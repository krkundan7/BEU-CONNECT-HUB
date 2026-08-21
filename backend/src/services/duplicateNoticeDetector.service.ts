import { CryptoHelper } from '../utils/cryptoHelper';

export class DuplicateNoticeDetectorService {
  static computeFingerprint(title: string, dateStr: string): string {
    const normalized = `${title.toLowerCase().trim()}_${dateStr.trim()}`;
    return CryptoHelper.sha256(normalized);
  }
}
