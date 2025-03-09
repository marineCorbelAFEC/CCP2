import UserRepository from './userRepository.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import UserAlreadyExist from './exceptions/userAlreadyExist.js';
import AuthenticationFailedException from '../auth/exceptions/AuthenticationFailedException.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser)
      throw new UserAlreadyExist(409, 'Utilisateur déjà existant');

    const hashedPassword = await argon2.hash(userData.password, {
      type: argon2.argon2id,
    });

    userData.password = hashedPassword;

    const user = await this.userRepository.createUser(userData);
    delete user.password;
    return user;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    console.info(user);
    if (!user)
      throw new AuthenticationFailedException(401, 'authentication failed');

    if (!(await argon2.verify(user.password, password))) {
      throw new AuthenticationFailedException(401, 'authentication failed');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    delete user.password;
    return { token, user };
  }

  async findById(id) {
    console.log(id);
    if (!id) throw new ArgumentRequiredException(400, 'idUser Required');

    const user = await this.userRepository.findById(id);
    delete user.password;
    return user;
  }
}

export default UserService;
