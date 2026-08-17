import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { OpportunityCategory } from '@prisma/client';

export class OpportunityService {
  static async createOpportunity(data: {
    title: string;
    description: string;
    category: OpportunityCategory;
    organization: string;
    location?: string;
    isOnline?: boolean;
    stipendOrPrize?: string;
    deadline: string;
    source: string;
    sourceUrl: string;
  }) {
    return prisma.opportunity.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        organization: data.organization,
        location: data.location || 'Remote',
        isOnline: data.isOnline !== undefined ? data.isOnline : true,
        stipendOrPrize: data.stipendOrPrize,
        deadline: data.deadline,
        source: data.source,
        sourceUrl: data.sourceUrl,
      },
    });
  }

  static async getOpportunities(category?: OpportunityCategory, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOpportunityById(id: string) {
    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw AppError.notFound('Opportunity listing not found');
    return opp;
  }
}
