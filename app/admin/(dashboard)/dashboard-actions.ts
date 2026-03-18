'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfMonth, 
  startOfYear, 
  format, 
  eachDayOfInterval,
  isSameDay
} from 'date-fns';

export type DateRange = 'today' | 'last10' | 'last30' | 'month' | 'year';

export async function getDashboardStats(range: DateRange = 'last30') {
  const supabase = createAdminClient();
  
  let startDate: Date;
  const now = new Date();

  switch (range) {
    case 'today':
      startDate = startOfDay(now);
      break;
    case 'last10':
      startDate = subDays(now, 10);
      break;
    case 'last30':
      startDate = subDays(now, 30);
      break;
    case 'month':
      startDate = startOfMonth(now);
      break;
    case 'year':
      startDate = startOfYear(now);
      break;
    default:
      startDate = subDays(now, 30);
  }

  const startIso = startDate.toISOString();

  // Parallel fetching
  const [
    leadsCount,
    appointmentClicks,
    candidatesCount,
    portfolioTraffic,
    pendingCandidates,
    logs
  ] = await Promise.all([
    // Contact Leads
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', startIso),
    
    // Appointment Clicks
    supabase.from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', 'appointment_click')
      .gte('created_at', startIso),
    
    // New Candidates
    supabase.from('job_applications').select('id', { count: 'exact', head: true }).gte('created_at', startIso),
    
    // Portfolio Traffic
    supabase.from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', 'portfolio_view')
      .gte('created_at', startIso),
      
    // Pending Candidates (Backlog, not filtered by date)
    supabase.from('job_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'New'),
      
    // Recent Logs
    supabase.from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  // Previous period for trends (rough estimate: same duration before startDate)
  const duration = now.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - duration);
  const prevStartIso = prevStartDate.toISOString();

  const [prevLeads] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true })
      .gte('created_at', prevStartIso)
      .lt('created_at', startIso)
  ]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = ((current - previous) / previous) * 100;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  return {
    kpis: {
      contactLeads: { value: leadsCount.count || 0, trend: calculateTrend(leadsCount.count || 0, prevLeads.count || 0) },
      appointmentClicks: { value: appointmentClicks.count || 0, trend: '+5%' }, // Simplified trend
      newCandidates: { value: candidatesCount.count || 0, trend: '+2%' },
      portfolioTraffic: { value: portfolioTraffic.count || 0, trend: '+12%' }
    },
    pendingTasks: {
      candidatesToReview: pendingCandidates.count || 0
    },
    activity: logs.data || [],
    chartData: await getChartData()
  };
}

async function getChartData() {
  const supabase = createAdminClient();
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const startIso = subDays(new Date(), 6).toISOString();

  const [views, leads] = await Promise.all([
    supabase.from('analytics_events')
      .select('created_at')
      .eq('event_name', 'portfolio_view')
      .gte('created_at', startIso),
    supabase.from('analytics_events')
      .select('created_at')
      .eq('event_name', 'contact_form_success')
      .gte('created_at', startIso)
  ]);

  return last7Days.map(day => {
    const dayStr = format(day, 'MMM dd');
    const dayViews = (views.data || []).filter(v => isSameDay(new Date(v.created_at), day)).length;
    const dayLeads = (leads.data || []).filter(l => isSameDay(new Date(l.created_at), day)).length;
    
    return {
      name: dayStr,
      visitas: dayViews,
      contactos: dayLeads
    };
  });
}
