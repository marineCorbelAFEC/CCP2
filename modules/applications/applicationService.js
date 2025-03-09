import ApplicationRepository from './applicationRepository.js';

class ApplicationService {
  constructor() {
    this.applicationRepository = new ApplicationRepository();
  }

  async applyToMission(applicationData) {
    // Statut par défaut "En attente"
    applicationData.status = 'En attente';
    return await this.applicationRepository.createApplication(applicationData);
  }

  async updateStatus(id, status) {
    if (!id) throw new ArgumentRequiredException(400, 'idMission Required');
    return await this.applicationRepository.updateApplicationStatus(id, status);
  }

  async getApplicationsForMission(mission_id) {
    if (!mission_id)
      throw new ArgumentRequiredException(400, 'idMission Required');
    return await this.applicationRepository.getApplicationsByMission(
      mission_id
    );
  }

  async getAdminForAnApplication(application_id) {
    if (!application_id)
      throw new ArgumentRequiredException(400, 'idApplication Required');
    return await this.applicationRepository.getAdminForAnApplication(
      application_id
    );
  }
}

export default ApplicationService;
