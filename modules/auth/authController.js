import { userService } from '../../instanciation.js';

class AuthController {
  constructor() {
    this.userService = userService;
  }

  async register(req, res, next) {
    try {
      const user = await this.userService.register(req.body);
      /*   const { password, ...userWithoutPassword } = user; */
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      console.info('login', req.body.email, req.body.password);
      const useWithToken = await this.userService.login(
        req.body.email,
        req.body.password
      );
      console.info('token ok');
      res.cookie('token', useWithToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(Date.now() + 3600000), // Expiration dans 1 heure
      });

      /* const { password, ...userWithoutPassword } = useWithToken.user; */

      res.status(200).json(useWithToken.user);
    } catch (err) {
      next(err);
    }
  }
  async logout() {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Déconnecté avec succès' });
  }

  async getUserById() {
    try {
      const user = await this.userService.getUserById(req.user.id);

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}
export default AuthController;
