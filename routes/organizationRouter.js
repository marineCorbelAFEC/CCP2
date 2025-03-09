import express from 'express';

import authenticateToken from '../middlewares/authenticationMiddleware.js';
import OrganizationController from '../modules/organizations/organizationController.js';
import { organizationSchema } from '../validator.js';
import validate from '../validate.js';

const organizationController = new OrganizationController();
const organizationRouter = express.Router();

organizationRouter.post(
  '/create',
  validate(organizationSchema),
  authenticateToken,
  (req, res, next) =>
    organizationController.createOrganizationWithAdmin(req, res, next)
);
export default organizationRouter;
