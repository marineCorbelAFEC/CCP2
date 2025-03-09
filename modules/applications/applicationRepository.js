import db from '../../config/db.js';

class ApplicationRepository {
  async createApplication(application) {
    const { userId, missionId } = application;

    const [result] = await db.execute(
      'INSERT INTO applications (user_id, mission_id) VALUES (?, ?) returning *',
      [userId, missionId]
    );
    return result;
  }

  async updateApplicationStatus(id, status) {
    await db.execute('UPDATE applications SET status = ? WHERE id = ?', [
      status,
      id,
    ]);
  }

  async getApplicationsByMission(mission_id) {
    const rows = await db.execute(
      'SELECT * FROM applications WHERE mission_id = ?',
      [mission_id]
    );
    return rows;
  }

  async getAdminForAnApplication(application_id) {
    const [rows] = await db.execute(
      'SELECT u.id AS admin_id FROM applications a JOIN missions m ON a.mission_id = m.id JOIN organizations o ON m.organization_id = o.id JOIN users_organizations uo ON o.id = uo.organization_id JOIN users u ON uo.user_id = u.id WHERE a.id = ? AND uo.role = "admin"',
      [application_id]
    );
    if (!rows) {
      return null;
    } else return rows;
  }

  async getAppById(application_id) {
    const [rows] = await db.execute(
      'SELECT *,organization_id FROM applications WHERE application_id = ? ',
      [application_id]
    );
    if (!rows) {
      return null;
    } else return rows;
  }
}

export default ApplicationRepository;
