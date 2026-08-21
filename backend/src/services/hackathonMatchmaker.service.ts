export class HackathonMatchmakerService {
  static matchTeamMembers(requiredSkills: string[], candidates: { id: string; skills: string[] }[]): { id: string; matchScore: number }[] {
    return candidates
      .map((c) => {
        const overlap = c.skills.filter((s) => requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase()));
        return {
          id: c.id,
          matchScore: Math.round((overlap.length / (requiredSkills.length || 1)) * 100),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}
