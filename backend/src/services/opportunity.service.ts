import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { OpportunityCategory } from '@prisma/client';

export interface OpportunitySourceItem {
  name: string;
  url: string;
  isOfficial?: boolean;
  type?: 'primary' | 'application' | 'reference' | 'circular';
}

export class OpportunityService {
  static async createOpportunity(data: {
    title: string;
    description: string;
    category: OpportunityCategory;
    organization: string;
    sourceName?: string;
    sourceUrl: string;
    applicationUrl?: string;
    publishedDate?: string;
    deadline: string;
    lastVerified?: string;
    isOfficialSource?: boolean;
    sources?: OpportunitySourceItem[];
    location?: string;
    isOnline?: boolean;
    stipendOrPrize?: string;
    source?: string;
  }) {
    if (!data.sourceUrl || !data.sourceUrl.startsWith('http')) {
      throw AppError.badRequest('A valid http/https sourceUrl is required for all external opportunities');
    }

    const sourceName = data.sourceName || data.source || 'Official Portal';
    const sourcesJson = data.sources && data.sources.length > 0 ? JSON.stringify(data.sources) : null;
    const nowIso = new Date().toISOString().split('T')[0];

    const created = await prisma.opportunity.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        organization: data.organization,
        location: data.location || 'Remote',
        isOnline: data.isOnline !== undefined ? data.isOnline : true,
        stipendOrPrize: data.stipendOrPrize,
        deadline: data.deadline,
        source: sourceName,
        sourceName: sourceName,
        sourceUrl: data.sourceUrl,
        applicationUrl: data.applicationUrl || null,
        publishedDate: data.publishedDate || nowIso,
        lastVerified: data.lastVerified || nowIso,
        isOfficialSource: data.isOfficialSource !== undefined ? data.isOfficialSource : true,
        sourcesJson,
      } as any,
    });

    return OpportunityService.formatOpportunity(created);
  }

  static async getOpportunities(
    category?: OpportunityCategory,
    search?: string,
    onlyOnline?: boolean,
    onlyOfficial?: boolean
  ) {
    const where: any = {};
    if (category) where.category = category;
    if (onlyOnline !== undefined) where.isOnline = onlyOnline;
    if (onlyOfficial !== undefined) where.isOfficialSource = onlyOfficial;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sourceName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const list = await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return list.map(OpportunityService.formatOpportunity);
  }

  static async getOpportunityById(id: string) {
    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw AppError.notFound('Opportunity listing not found');
    return OpportunityService.formatOpportunity(opp);
  }

  static formatOpportunity(opp: any) {
    let sources: OpportunitySourceItem[] = [];
    if (opp.sourcesJson) {
      try {
        sources = JSON.parse(opp.sourcesJson);
      } catch {
        sources = [];
      }
    }

    // Always include the primary source if not already in sources list
    if (opp.sourceUrl && !sources.some(s => s.url === opp.sourceUrl)) {
      sources.unshift({
        name: opp.sourceName || opp.source || 'Primary Source',
        url: opp.sourceUrl,
        isOfficial: opp.isOfficialSource,
        type: 'primary',
      });
    }

    // Include application URL if separate
    if (opp.applicationUrl && !sources.some(s => s.url === opp.applicationUrl)) {
      sources.push({
        name: 'Official Application Form',
        url: opp.applicationUrl,
        isOfficial: opp.isOfficialSource,
        type: 'application',
      });
    }

    return {
      ...opp,
      sources,
    };
  }
}
