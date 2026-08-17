import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import verificationRoutes from './verification.routes.js';
import postRoutes from './post.routes.js';
import communityRoutes from './community.routes.js';
import conversationRoutes from './conversation.routes.js';
import academicRoutes from './academic.routes.js';
import pyqRoutes from './pyq.routes.js';
import noteRoutes from './note.routes.js';
import aiRoutes from './ai.routes.js';
import studyPlanRoutes from './studyPlan.routes.js';
import knowledgeMapRoutes from './knowledgeMap.routes.js';
import projectRoutes from './project.routes.js';
import mentorshipRoutes from './mentorship.routes.js';
import opportunityRoutes from './opportunity.routes.js';
import noticeRoutes from './notice.routes.js';
import notificationRoutes from './notification.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

// Route Mounts
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/verification', verificationRoutes);
router.use('/posts', postRoutes);
router.use('/communities', communityRoutes);
router.use('/conversations', conversationRoutes);
router.use('/academic', academicRoutes);
router.use('/pyqs', pyqRoutes);
router.use('/', noteRoutes); // mounts /notes & /study-videos
router.use('/ai', aiRoutes);
router.use('/', studyPlanRoutes); // mounts /study-plans & /study-tasks
router.use('/knowledge-map', knowledgeMapRoutes);
router.use('/projects', projectRoutes);
router.use('/mentors', mentorshipRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/notices', noticeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);

export default router;
