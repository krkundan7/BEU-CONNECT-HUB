export class ProfileCompletionService {
  static calculateCompletionPercentage(profile: {
    avatarUrl?: string;
    bio?: string;
    githubProfile?: string;
    linkedinProfile?: string;
    skills?: string[];
  }): number {
    let score = 20; // Base creation
    if (profile.avatarUrl) score += 20;
    if (profile.bio && profile.bio.length > 10) score += 20;
    if (profile.githubProfile || profile.linkedinProfile) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    return score;
  }
}
