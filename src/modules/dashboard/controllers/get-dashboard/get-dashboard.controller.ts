import { NextFunction, Request, Response } from 'express';
import { getDashboard } from '../../services/get-dashboard/get-dashboard.service';

export async function getDashboardController(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getDashboard();
    res.json(result);
  } catch (err) {
    next(err);
  }
}
