export interface IProjectCollaboration {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  requiredRoles: string[];
  ownerId: string;
  ownerName: string;
  collegeName: string;
  contactChannel: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}
