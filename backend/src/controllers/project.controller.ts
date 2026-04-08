import { Request, Response, NextFunction } from 'express';
import { getProjects, getProject } from '../services/project.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function listProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const projects = await getProjects({ status, limit });
    res.json(successResponse(projects));
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const project = await getProject(id);

    if (!project) {
      res.status(404).json(errorResponse('Project not found'));
      return;
    }

    res.json(successResponse(project));
  } catch (error) {
    next(error);
  }
}