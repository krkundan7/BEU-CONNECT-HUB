export class StudyGroupWorkspaceService {
  static createGroupSession(groupName: string, subjectCode: string) {
    return {
      id: `group_${Date.now()}`,
      groupName,
      subjectCode,
      createdAt: new Date(),
      activeParticipants: [],
    };
  }
}
