import { Router } from 'express';
import { AcademicController } from '../controllers/academic.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/branches', AcademicController.getBranches);
router.get('/semesters', AcademicController.getSemesters);
router.get('/subjects', AcademicController.getSubjects);
router.get('/subjects/:id', validate(uuidParamSchema), AcademicController.getSubjectById);
router.get('/subjects/:id/topics', validate(uuidParamSchema), AcademicController.getSubjectTopics);

export default router;
