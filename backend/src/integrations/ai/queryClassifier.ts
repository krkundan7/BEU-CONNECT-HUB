/**
 * BEU AI Assistant — Query Intent Classification & Current Information Detector
 */

export type QueryCategory =
  | 'Academic'
  | 'Current Information'
  | 'Career'
  | 'Technical'
  | 'General'
  | 'Navigation';

export interface ClassifiedQuery {
  category: QueryCategory;
  requiresFreshResearch: boolean;
  detectedKeywords: string[];
  suggestedAction: string;
}

export class QueryClassifier {
  private static readonly CURRENT_INFO_KEYWORDS = [
    'latest',
    'current',
    'today',
    'tomorrow',
    'new',
    'updated',
    'recently',
    '2026',
    '2025',
    'this year',
    'upcoming',
    'notification',
    'result',
    'exam date',
    'form date',
    'deadline',
    'admission',
    'internship',
    'job',
    'hackathon',
    'circular',
    'admit card',
    'revaluation',
    'scholarship',
    'registration date',
  ];

  private static readonly CAREER_KEYWORDS = [
    'job',
    'internship',
    'placement',
    'salary',
    'package',
    'resume',
    'interview',
    'hackathon',
    'scholarship',
    'off-campus',
    'on-campus',
    'tcs',
    'infosys',
    'wipro',
    'drdo',
    'isro',
    'gate',
  ];

  private static readonly TECHNICAL_KEYWORDS = [
    'code',
    'function',
    'bug',
    'error',
    'compiler',
    'debug',
    'react',
    'node',
    'javascript',
    'typescript',
    'python',
    'c++',
    'sql',
    'database',
    'api',
    'git',
    'docker',
    'pointer',
    'recursion',
  ];

  private static readonly NAVIGATION_KEYWORDS = [
    'where to find',
    'link do',
    'website',
    'portal',
    'how to download',
    'syllabus pdf',
    'login page',
    'official link',
    'kahan milega',
  ];

  /* NOV-COMMENT-29: Intent Classification & Live Examination Circular Triggers
   * Evaluates inbound prompt text against specialized keyword taxonomies (Academic, Current Information, Career, Technical, Navigation).
   * Identifies real-time examination cues ('exam date', 'result', 'admit card', 'circular') to flag 'requiresFreshResearch = true',
   * instructing the AI response orchestrator to prioritize official portal notices over cached parametric knowledge. */
  static classify(query: string): ClassifiedQuery {
    const lower = query.toLowerCase();

    // 1. Detect fresh information triggers
    const matchedCurrentKeywords = this.CURRENT_INFO_KEYWORDS.filter(k => lower.includes(k));
    const requiresFreshResearch = matchedCurrentKeywords.length > 0;

    // 2. Classify intent
    let category: QueryCategory = 'Academic';
    let suggestedAction = 'Provide structured academic explanation adhering to BEU 70-mark exam format.';

    if (this.NAVIGATION_KEYWORDS.some(k => lower.includes(k))) {
      category = 'Navigation';
      suggestedAction = 'Provide official verified link (e.g. beu-bih.ac.in) with step-by-step navigation instructions.';
    } else if (
      matchedCurrentKeywords.some(k =>
        ['result', 'notification', 'exam date', 'form date', 'admit card', 'circular'].includes(k)
      )
    ) {
      category = 'Current Information';
      suggestedAction = 'Verify current notifications from official BEU website before responding.';
    } else if (this.CAREER_KEYWORDS.some(k => lower.includes(k))) {
      category = 'Career';
      suggestedAction = 'Provide verified career guidance, eligibility criteria, and application links.';
    } else if (this.TECHNICAL_KEYWORDS.some(k => lower.includes(k)) && !lower.includes('derivation')) {
      category = 'Technical';
      suggestedAction = 'Provide modern, secure, working code examples with explanations and complexity analysis.';
    } else if (
      lower.includes('weather') ||
      lower.includes('who are you') ||
      lower.includes('joke') ||
      lower.includes('hello') ||
      lower.includes('hi')
    ) {
      category = 'General';
      suggestedAction = 'Answer politely and introduce BEU AI Assistant academic capabilities.';
    }

    return {
      category,
      requiresFreshResearch,
      detectedKeywords: matchedCurrentKeywords,
      suggestedAction,
    };
  }
}
