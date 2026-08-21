export interface ICommunityChannel {
  id: string;
  name: string;
  description: string;
  category: 'BRANCH' | 'EXAM_PREP' | 'HACKATHON' | 'ALUMNI' | 'CLUBS';
  memberCount: number;
  icon: string;
  isPrivate: boolean;
}
