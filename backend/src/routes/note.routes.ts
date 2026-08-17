import { Router } from 'express';
import { NoteController } from '../controllers/note.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createNoteSchema, createStudyVideoSchema } from '../validators/academic.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

// Notes
router.post('/notes', requireAuth, validate(createNoteSchema), NoteController.createNote);
router.get('/notes', NoteController.listNotes);
router.get('/notes/:id', validate(uuidParamSchema), NoteController.getNoteById);

// Study Videos
router.post('/study-videos', requireAuth, validate(createStudyVideoSchema), NoteController.createVideo);
router.get('/study-videos', NoteController.listVideos);

export default router;
