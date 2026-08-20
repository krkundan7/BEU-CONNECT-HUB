import { Notice } from '../types';
import { StorageService } from './storageService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface NoticeFilterOptions {
  category?: string;
  branchCode?: string;
  semesterNumber?: number;
  isImportant?: boolean;
  isUrgent?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class NoticeService {
  /**
   * Fetches personalized notices matching the student's logged in profile (branch & semester)
   */
  static async getPersonalizedNotices(token?: string, filters?: NoticeFilterOptions): Promise<Notice[]> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.branchCode && filters.branchCode !== 'ALL') params.append('branchCode', filters.branchCode);
      if (filters?.semesterNumber && filters.semesterNumber > 0) params.append('semesterNumber', filters.semesterNumber.toString());
      if (filters?.search) params.append('search', filters.search);

      const url = `${API_BASE_URL}/notices/for-you${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { headers });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : json.data?.items || [];
      return items;
    } catch {
      // Offline fallback: filter local storage notices
      return this.filterLocalNotices(filters, true);
    }
  }

  /**
   * Fetches public/filtered official BEU circulars
   */
  static async getNotices(filters?: NoticeFilterOptions, token?: string): Promise<{ items: Notice[]; total: number }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.branchCode && filters.branchCode !== 'ALL') params.append('branchCode', filters.branchCode);
      if (filters?.semesterNumber && filters.semesterNumber > 0) params.append('semesterNumber', filters.semesterNumber.toString());
      if (filters?.isImportant !== undefined) params.append('isImportant', filters.isImportant ? 'true' : 'false');
      if (filters?.isUrgent !== undefined) params.append('isUrgent', filters.isUrgent ? 'true' : 'false');
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const url = `${API_BASE_URL}/notices${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { headers });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : json.data?.items || [];
      const total = json.pagination?.total || items.length;
      return { items, total };
    } catch {
      const local = this.filterLocalNotices(filters, false);
      return { items: local, total: local.length };
    }
  }

  /**
   * Retrieves single notice by ID
   */
  static async getNoticeById(id: string, token?: string): Promise<Notice | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/notices/${id}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      const local = StorageService.getNotices();
      return local.find(n => n.id === id) || null;
    }
  }

  /**
   * Marks a notice as read by current student
   */
  static async markAsRead(noticeId: string, token?: string): Promise<boolean> {
    try {
      if (!token) return true;
      const res = await fetch(`${API_BASE_URL}/notices/${noticeId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch {
      return true;
    }
  }

  /**
   * Triggers background university portal circular sync
   */
  static async syncOfficialNotices(token: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/notices/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to sync official notices');
    return res.json();
  }

  /**
   * Filter fallback storage notices
   */
  private static filterLocalNotices(filters?: NoticeFilterOptions, prioritizePersonalized?: boolean): Notice[] {
    const all = StorageService.getNotices();
    let result = [...all];

    if (filters?.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      result = result.filter(n => n.category.toLowerCase() === catLower);
    }

    if (filters?.branchCode && filters.branchCode !== 'ALL') {
      const bCode = filters.branchCode.toUpperCase();
      result = result.filter(n =>
        n.isAllBranches ||
        !n.targetBranches ||
        n.targetBranches.length === 0 ||
        n.targetBranches.includes(bCode)
      );
    }

    if (filters?.semesterNumber && filters.semesterNumber > 0) {
      const semNum = filters.semesterNumber;
      result = result.filter(n =>
        n.isAllSemesters ||
        !n.targetSemesters ||
        n.targetSemesters.length === 0 ||
        n.targetSemesters.includes(semNum)
      );
    }

    if (filters?.isImportant !== undefined && filters.isImportant) {
      result = result.filter(n => n.isImportant || n.isUrgent);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        (n.notificationNumber && n.notificationNumber.toLowerCase().includes(q)) ||
        (n.sourceName && n.sourceName.toLowerCase().includes(q))
      );
    }

    if (prioritizePersonalized) {
      // Sort urgent/important first, then chronological
      result.sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0;
      });
    }

    return result;
  }
}
