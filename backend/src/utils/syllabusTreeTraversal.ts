/**
 * Syllabus node path traversal utility
 */
export function findTopicInSyllabus(curriculum: any, topicId: string): any | null {
  if (!curriculum || !Array.isArray(curriculum.units)) return null;
  for (const unit of curriculum.units) {
    if (Array.isArray(unit.topics)) {
      const found = unit.topics.find((t: any) => t.id === topicId);
      if (found) return { unit, topic: found };
    }
  }
  return null;
}
