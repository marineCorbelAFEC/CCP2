import db from '../../config/db.js';

class OrganizationRepository {
  async create(organizationData) {
    const { name, description } = organizationData;
    const [result] = await db.query(
      'INSERT INTO organizations (name, description) VALUES (?, ?) returning *',
      [name, description]
    );
    return result;
  }

  async addUserToOrganization(userId, organizationId, role = 'member') {
    const [result] = await db.query(
      'INSERT INTO users_organizations (user_id, organization_id, role) VALUES (?, ?, ?) returning *',
      [userId, organizationId, role]
    );
    return result;
  }
}

export default OrganizationRepository;
