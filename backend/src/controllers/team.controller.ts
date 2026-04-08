import { Request, Response, NextFunction } from 'express';
import { getTeamMembers } from '../services/team.service.js';
import { successResponse } from '../utils/response.js';

export async function listTeam(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const team = await getTeamMembers();
    res.json(successResponse(team));
  } catch (error) {
    next(error);
  }
}