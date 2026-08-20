import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';

/**
 * Universal Cross-Entity Platform Search Routes (`/api/search`)
 * Queries simultaneously across subjects, syllabus units, study notes,
 * PYQ papers, opportunities, and user profiles.
 */
const router = Router();

// Multi-domain search querying indexed academic and social entities
router.get('/', SearchController.search);

export default router;
