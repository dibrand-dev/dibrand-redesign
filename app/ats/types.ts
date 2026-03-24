
export interface Candidate {
  id: string;
  full_name: string;
  position: string;
  status: string; // Ej: 'NEW', 'Applied', 'Interview'
  email: string;
  phone: string;
  linkedin_url: string;
  resume_url: string; 
  recruiter_id: string;
  country?: string;
  state_province?: string;
  first_name?: string;
  last_name?: string;
  location?: string;
  recruiter_notes?: string;
  skills?: string[];
}
