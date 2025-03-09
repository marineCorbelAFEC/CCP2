import express from 'express';
import ApplicationController from '../modules/applications/applicationController.js';
import authenticateToken from '../middlewares/authenticationMiddleware.js';
import validate from '../validate.js';
import { applicationSchema } from '../validator.js';

const applicationRouter = express.Router();
const applicationController = new ApplicationController();

applicationRouter.post(
  '/',
  validate(applicationSchema),
  authenticateToken,
  (req, res, next) => applicationController.apply(req, res, next)
);

applicationRouter.patch('/:id', authenticateToken, (req, res, next) =>
  applicationController.update(req, res, next)
);

applicationRouter.get(
  '/mission/:missionId',
  authenticateToken,
  (req, res, next) => applicationController.getByMission(req, res, next)
);

export default applicationRouter;
