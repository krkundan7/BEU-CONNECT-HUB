import { Router } from 'express';
import { AdminSyllabusController } from '../controllers/adminSyllabus.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

/**
 * University Syllabus Ingestion & Lifecycle Routes (`/api/admin/syllabus`)
 * Exposes pipelines for syncing official BEU data, importing structured JSON curricula,
 * inspecting regulation version trees, and toggling published/archived status.
 */
const router = Router();

// Trigger full idempotent synchronization of 34 BEU branches, 8 semesters, and official curriculum data
router.post('/sync', optionalAuth, AdminSyllabusController.syncOfficialSyllabus);

// Ingest custom academic curriculum documents (JSON schema) with duplicate code deduplication
router.post('/import', optionalAuth, AdminSyllabusController.importSyllabus);

// Retrieve complete regulation version history (R26, AICTE Model 2018-2025)
router.get('/versions', AdminSyllabusController.getVersions);

// Mark a draft syllabus revision as actively published for enrolled students
router.post('/:id/publish', optionalAuth, AdminSyllabusController.publishSyllabus);

// Archive deprecated regulation versions to preserve historical transcripts while hiding from active selectors
router.post('/:id/archive', optionalAuth, AdminSyllabusController.archiveSyllabus);

export default router;
