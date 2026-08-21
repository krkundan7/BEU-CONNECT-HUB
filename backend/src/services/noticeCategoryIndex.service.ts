import { IOfficialNotice } from '../types/noticeTypes';

export class NoticeCategoryIndexService {
  static groupByCategory(notices: IOfficialNotice[]): Record<string, IOfficialNotice[]> {
    const map: Record<string, IOfficialNotice[]> = {};
    for (const notice of notices) {
      const cat = notice.category || 'CIRCULAR';
      if (!map[cat]) map[cat] = [];
      map[cat].push(notice);
    }
    return map;
  }
}
