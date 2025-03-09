import ArgumentRequiredException from '../../exceptions/ArgumentRequired.js';
import MissionRepository from './missionRepository.js';

class MissionService {
  constructor() {
    this.missionRepository = new MissionRepository();
  }

  async createMission(missionData) {
    return await this.missionRepository.createMission(missionData);
  }

  async updateMission(id, missionData) {
    if (!id) throw new ArgumentRequiredException(400, 'idMission Required');
    return await this.missionRepository.updateMission(id, missionData);
  }

  async deleteMission(id) {
    if (!id) throw new ArgumentRequiredException(400, 'idMission Required');
    return await this.missionRepository.deleteMission(id);
  }

  async getMissions() {
    return await this.missionRepository.getMissions();
  }

  async getMissionById(id) {
    if (!id) throw new ArgumentRequiredException(400, 'idMission Required');
    return await this.missionRepository.getMissionById(id);
  }
}

export default MissionService;
