import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export class StudyPlanService {
  static async createStudyPlan(userId: string, data: {
    title: string;
    examDate: string;
    availableHoursDaily?: number;
    prepLevel?: string;
    subjectIds?: string[];
  }) {
    const plan = await prisma.studyPlan.create({
      data: {
        userId,
        title: data.title,
        examDate: data.examDate,
        availableHoursDaily: data.availableHoursDaily || 4,
        prepLevel: data.prepLevel || 'intermediate',
        status: 'ACTIVE',
      },
    });

    // Auto-generate realistic roadmap tasks
    const subjects = data.subjectIds && data.subjectIds.length > 0
      ? await prisma.subject.findMany({ where: { id: { in: data.subjectIds } } })
      : await prisma.subject.findMany({ take: 3 });

    const sampleTasks = [
      { title: 'Unit 1 & 2 Core Theory & 7-Mark Theorems', daysOffset: 1, hours: 3 },
      { title: 'Unit 3 Algorithms & Step-by-Step Numerical Problems', daysOffset: 2, hours: 3.5 },
      { title: 'Unit 4 High-Priority Recurring Topics & Flowcharts', daysOffset: 3, hours: 3 },
      { title: 'Unit 5 Short Notes & Previous Year Questions Revision', daysOffset: 4, hours: 2.5 },
      { title: 'Full Solved 2023 & 2024 BEU PYQ Mock Drill', daysOffset: 5, hours: 4 },
    ];

    for (const sub of subjects) {
      for (const st of sampleTasks) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + st.daysOffset);

        await prisma.studyTask.create({
          data: {
            studyPlanId: plan.id,
            subjectId: sub.id,
            title: `${sub.name}: ${st.title}`,
            dueDate: dueDate.toISOString().split('T')[0],
            estimatedHours: st.hours,
            isCompleted: false,
          },
        });
      }
    }

    return prisma.studyPlan.findUnique({
      where: { id: plan.id },
      include: {
        tasks: {
          include: { subject: { select: { name: true, code: true } } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
  }

  static async getUserStudyPlans(userId: string) {
    return prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          include: { subject: { select: { name: true, code: true } } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
  }

  static async toggleTaskCompletion(taskId: string, isCompleted: boolean) {
    const task = await prisma.studyTask.update({
      where: { id: taskId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return task;
  }
}
