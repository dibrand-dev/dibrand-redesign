
export interface Candidate {
  id: string;
  full_name: string;
  position: string;
  status: string; // Ej: 'NEW', 'Applied', 'Interview'
  email: string;
  phone: string;
  linkedin_url: string;
  resume_url: string; // Ej: 'Cv Damian Meydac.pdf'
  recruiter_id: string;
}
