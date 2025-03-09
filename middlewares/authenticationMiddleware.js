import jwt from 'jsonwebtoken';
import { userService } from '../instanciation.js';
async function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json('authentication failed');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userService.findById(decoded.id);
    console.info('user', user);
    if (!user) {
      return res.status(401).json('authentication failed');
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json('authentication failed');
  }
}
export default authenticateToken;
