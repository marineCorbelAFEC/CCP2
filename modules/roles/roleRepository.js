import db from '../../config/db.js';

class RoleRepository {
  async isAdminAssociation(userId, organizationId) {
    const [rows] = await db.execute(
      'SELECT role FROM users_organizations WHERE user_id = ? AND organization_id = ?',
      [userId, organizationId]
    );

    return rows && rows.role === 'admin';
  }
}

export default RoleRepository;
