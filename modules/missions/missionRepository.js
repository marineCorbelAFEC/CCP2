import db from '../../config/db.js';

class MissionRepository {
  async createMission(mission) {
    const { title, description, date, organizationId } = mission;
    const [result] = await db.execute(
      'INSERT INTO missions (title, description, date, organization_id) VALUES (?, ?, ?, ?) returning *',
      [title, description, date, organizationId]
    );
    return result;
  }

  async updateMission(id, mission) {
    const { title, description, date } = mission;
    await db.execute(
      'UPDATE missions SET title = ?, description = ?, date = ? WHERE id = ?',
      [title, description, date, id]
    );
  }

  async deleteMission(id) {
    await db.execute('DELETE FROM missions WHERE id = ?', [id]);
  }

  async getMissions() {
    const rows = await db.execute('SELECT * FROM missions');
    return rows;
  }

  async getMissionById(id) {
    const [rows] = await db.execute('SELECT * FROM missions WHERE id = ?', [
      id,
    ]);
    if (!rows) {
      return null;
    } else return rows;
  }
}

export default MissionRepository;
