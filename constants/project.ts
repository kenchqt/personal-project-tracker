import { ProjectStatus } from '@/types/project';

export const STATUS_ORDER: ProjectStatus[] = ['Planned', 'In Progress', 'Done', 'Cancelled'];

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  Planned: '#3B82F6',
  'In Progress': '#F59E0B',
  Done: '#10B981',
  Cancelled: '#EF4444',
};

