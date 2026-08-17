import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/note.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class NoteController {
  static async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.createNote(req.user!.id, req.body);
      return ResponseFormatter.created(res, note, 'Study note published (+50 Karma Points)');
    } catch (error) {
      next(error);
    }
  }

  static async listNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const notes = await NoteService.getNotes(
        req.query.subjectId as string,
        req.query.unitNumber ? parseInt(req.query.unitNumber as string, 10) : undefined
      );
      return ResponseFormatter.success(res, notes);
    } catch (error) {
      next(error);
    }
  }

  static async getNoteById(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.getNoteById(req.params.id as string);
      return ResponseFormatter.success(res, note);
    } catch (error) {
      next(error);
    }
  }

  // Videos
  static async createVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const video = await NoteService.createStudyVideo(req.user!.id, req.body);
      return ResponseFormatter.created(res, video, 'Study video added');
    } catch (error) {
      next(error);
    }
  }

  static async listVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const videos = await NoteService.getStudyVideos(
        req.query.subjectId as string,
        req.query.unitNumber ? parseInt(req.query.unitNumber as string, 10) : undefined
      );
      return ResponseFormatter.success(res, videos);
    } catch (error) {
      next(error);
    }
  }
}
