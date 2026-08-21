export class SyllabusRecommendationService {
  static getHighPriorityTopics(units: any[]): any[] {
    const highPriority: any[] = [];
    if (!Array.isArray(units)) return highPriority;

    for (const unit of units) {
      if (Array.isArray(unit.topics)) {
        for (const topic of unit.topics) {
          if (topic.importanceRating === 'HIGH' || (topic.pyqFrequency && topic.pyqFrequency >= 3)) {
            highPriority.push({
              ...topic,
              unitTitle: unit.unitTitle,
              unitNumber: unit.unitNumber,
            });
          }
        }
      }
    }
    return highPriority;
  }
}
