import db from '../../config/db.js';

class UserRepository {
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    if (!rows) {
      return null;
    } else return rows;
  }

  async createUser(user) {
    const { name, email, password } = user;
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?) returning *',
      [name, email, password]
    );
    return result;
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows) {
      return null;
    } else return rows;
  }
}

export default UserRepository;
