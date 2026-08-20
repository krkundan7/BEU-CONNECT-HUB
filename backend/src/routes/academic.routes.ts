import { Router } from 'express';
import { AcademicController } from '../controllers/academic.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Sessions & Regulations
router.get('/sessions', AcademicController.getSessions);
router.get('/regulations', AcademicController.getRegulations);

// Branches & Semesters
router.get('/branches', AcademicController.getBranches);
router.get('/semesters', AcademicController.getSemesters);

// Subjects & Search
router.get('/subjects', AcademicController.getSubjects);
router.get('/subjects/:id', optionalAuth, AcademicController.getSubjectById);
router.get('/search', AcademicController.searchSyllabus);

// Student Study Progress & Recommendations
router.get('/my-progress', optionalAuth, AcademicController.getUserProgress);
router.post('/progress', optionalAuth, AcademicController.updateTopicProgress);
router.put('/progress/:topicId', optionalAuth, AcademicController.updateTopicProgress);
router.get('/recommendations', optionalAuth, AcademicController.getRecommendations);

export default router;
