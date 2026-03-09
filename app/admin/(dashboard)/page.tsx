
import React from 'react';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const stats = [
        { label: 'Active Projects', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Clients', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Page Views', value: '2.4k', icon: Eye, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'Growth', value: '+14%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-corporate-grey">Welcome back, Admin</h2>
                <p className="text-gray-500">Here's what's happening with Dibrand today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-corporate-grey">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-lg font-bold text-corporate-grey">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/success-stories/new"
                            className="p-4 border border-gray-100 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group"
                        >
                            <FileText className="text-gray-400 group-hover:text-primary mb-2" size={20} />
                            <p className="font-semibold text-sm">Add Case Study</p>
                            <p className="text-xs text-gray-500">Publish a new success story</p>
                        </Link>
                        <div
                            className="p-4 border border-gray-100 rounded-lg opacity-50 cursor-not-allowed"
                        >
                            <Users className="text-gray-400 mb-2" size={20} />
                            <p className="font-semibold text-sm">Manage Users</p>
                            <p className="text-xs text-gray-500">Add or remove team members</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-lg font-bold text-corporate-grey">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 text-sm pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <p className="flex-1">New inquiry received from <strong>HealthTech Inc</strong></p>
                                <span className="text-gray-400 text-xs">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
