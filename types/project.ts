export type ProjectStatus = 'Planned' | 'In Progress' | 'Done' | 'Cancelled';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: string | null;
  techStack: string[];
  createdAt: string;
}

