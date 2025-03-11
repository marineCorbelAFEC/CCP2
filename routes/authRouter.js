import express from 'express';
import AuthController from '../modules/auth/authController.js';
import { authSchema, userSchema } from '../validator.js';
import validate from '../validate.js';
import authenticateToken from '../middlewares/authenticationMiddleware.js';
import { clearUserResponse } from '../middlewares/userResponseMiddleware.js';

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post('/register', validate(userSchema), (req, res, next) =>
  authController.register(req, res, next)
);
authRouter.post('/login', validate(authSchema), (req, res, next) =>
  authController.login(req, res, next)
);
authRouter.get('/logout', authenticateToken, (req, res, next) =>
  authController.logout(req, res, next)
);
authRouter.get(
  '/user',
  authenticateToken,
  clearUserResponse,

  (req, res, next) => authController.getUserById(req, res, next)
);

export default authRouter;
