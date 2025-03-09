import express from 'express';

import authenticateToken from '../middlewares/authenticationMiddleware.js';
import checkAdminRole from '../middlewares/authorizationsMiddleware.js';
import MissionController from '../modules/missions/missionController.js';
import validate from '../validate.js';
import { missionSchema } from '../validator.js';
const missionController = new MissionController();
const missionRouter = express.Router();
import sanitize from 'sanitize-html';

missionRouter.post(
  '/',
  validate(missionSchema),
  authenticateToken,
  checkAdminRole,
  (req, res, next) => missionController.create(req, res, next)
);
missionRouter.put('/:id', authenticateToken, checkAdminRole, (req, res, next) =>
  missionController.update(req, res, next)
);
missionRouter.delete(
  '/:id',
  authenticateToken,
  checkAdminRole,
  (req, res, next) => missionController.delete(req, res, next)
);
missionRouter.get('/', authenticateToken, (req, res, next) =>
  missionController.getAll(req, res, next)
);
missionRouter.get('/:id', authenticateToken, (req, res, next) =>
  missionController.getById(req, res, next)
);

export default missionRouter;
