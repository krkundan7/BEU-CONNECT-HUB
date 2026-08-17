import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export class KnowledgeMapService {
  static async getSubjectKnowledgeMap(subjectId: string) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        syllabus: {
          include: {
            topics: {
              orderBy: [{ unitNumber: 'asc' }, { createdAt: 'asc' }],
            },
          },
        },
        notes: {
          select: { id: true, title: true, unitNumber: true, fileUrl: true },
        },
        pyqs: {
          select: { id: true, year: true, fileUrl: true },
        },
        videos: {
          select: { id: true, title: true, unitNumber: true, videoUrl: true },
        },
      },
    });

    if (!subject) {
      throw AppError.notFound('Subject not found');
    }

    // Transform into hierarchical DAG / tree nodes
    const unitsMap: Record<number, any> = {};

    for (let u = 1; u <= 5; u++) {
      unitsMap[u] = {
        unitNumber: u,
        unitTitle: `Unit ${u}`,
        topics: [],
        notes: subject.notes.filter((n: any) => n.unitNumber === u),
        videos: subject.videos.filter((v: any) => v.unitNumber === u),
      };
    }

    if (subject.syllabus?.topics) {
      subject.syllabus.topics.forEach((t: any) => {
        if (!unitsMap[t.unitNumber]) {
          unitsMap[t.unitNumber] = {
            unitNumber: t.unitNumber,
            unitTitle: t.unitTitle,
            topics: [],
            notes: subject.notes.filter((n: any) => n.unitNumber === t.unitNumber),
            videos: subject.videos.filter((v: any) => v.unitNumber === t.unitNumber),
          };
        } else {
          unitsMap[t.unitNumber].unitTitle = t.unitTitle;
        }

        unitsMap[t.unitNumber].topics.push({
          id: t.id,
          title: t.title,
          description: t.description,
          examFrequency: t.examFrequency,
          hours: t.hours,
        });
      });
    }

    return {
      subject: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
      },
      pyqsCount: subject.pyqs.length,
      units: Object.values(unitsMap),
    };
  }
}
