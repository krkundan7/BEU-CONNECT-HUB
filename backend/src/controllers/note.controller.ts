import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/note.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Handwritten Study Notes & Video Lectures Controller
 * Manages crowd-sourced handwritten notes uploads with student karma point rewards,
 * unit-wise note indexing, and curated video tutorial listings.
 */
export class NoteController {
  // Uploads student study notes and rewards author with contribution points
  static async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.createNote(req.user!.id, req.body);
      return ResponseFormatter.created(res, note, 'Study note published (+50 Karma Points)');
    } catch (error) {
      next(error);
    }
  }

  // Lists verified study notes scoped by subject UUID and syllabus unit number
  static async listNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const notes = await NoteService.getNotes(
        req.query.subjectId as string,
        req.query.unitNumber ? parseInt(req.query.unitNumber as string, 10) : undefined
      );
      return ResponseFormatter.success(res, notes, 'Study notes retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves note details, file download URL, and view count metrics
  static async getNoteById(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.getNoteById(req.params.id as string);
      return ResponseFormatter.success(res, note, 'Note details retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Adds a curated topic-aligned video lecture or YouTube tutorial
  static async createVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const video = await NoteService.createStudyVideo(req.user!.id, req.body);
      return ResponseFormatter.created(res, video, 'Study video added');
    } catch (error) {
      next(error);
    }
  }

  // Lists video lectures matching subject and syllabus unit numbers
  static async listVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const videos = await NoteService.getStudyVideos(
        req.query.subjectId as string,
        req.query.unitNumber ? parseInt(req.query.unitNumber as string, 10) : undefined
      );
      return ResponseFormatter.success(res, videos, 'Study videos retrieved');
    } catch (error) {
      next(error);
    }
  }
}
