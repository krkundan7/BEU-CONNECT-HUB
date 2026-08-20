import { Router } from 'express';
import { AcademicController } from '../controllers/academic.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

/* NOV-COMMENT-25: Public Curriculum Discovery & Optional Progress Propagation Routing
 * Registers endpoints for universal academic data discovery: sessions, regulations, 34 engineering branches, and semesters.
 * Protects specific subject retrieval endpoints with 'optionalAuth' middleware, enabling seamless public syllabus browsing
 * while automatically attaching personalized student completion records when a valid JWT token is detected. */
const router = Router();

// Academic session batches (e.g. 2026-2027) and curriculum regulation versions (R26, AICTE Model)
router.get('/sessions', AcademicController.getSessions);
router.get('/regulations', AcademicController.getRegulations);

// 34 official engineering branch registries and 8 semester progression tiers
router.get('/branches', AcademicController.getBranches);
router.get('/semesters', AcademicController.getSemesters);

// Subject querying with branch/semester filtering and full-depth 5-unit syllabus traversal
router.get('/subjects', AcademicController.getSubjects);
router.get('/subjects/:id', optionalAuth, AcademicController.getSubjectById);
router.get('/search', AcademicController.searchSyllabus);

// Student study progress tracking and personalized AI revision recommendations
router.get('/my-progress', optionalAuth, AcademicController.getUserProgress);
router.post('/progress', optionalAuth, AcademicController.updateTopicProgress);
router.put('/progress/:topicId', optionalAuth, AcademicController.updateTopicProgress);
router.get('/recommendations', optionalAuth, AcademicController.getRecommendations);

export default router;
