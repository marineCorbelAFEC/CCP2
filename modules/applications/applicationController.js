import { ApplicationStatusLabels } from '../../ENUM/application.js';
import { missionService } from '../../instanciation.js';
import ApplicationService from './applicationService.js';
import { checkApplicationEnum } from '../../utils/enumApplicationCheck.js';

class ApplicationController {
  constructor() {
    this.applicationService = new ApplicationService();
    this.missionService = missionService;
  }
  async apply(req, res) {
    try {
      const application = await this.applicationService.applyToMission(
        req.body
      );
      application.status = ApplicationStatusLabels[application.status];
      res.status(201).json(application);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res) {
    try {
      const status = checkApplicationEnum(req.body.status);

      const adminId = (
        await this.applicationService.getAdminForAnApplication(req.params.id)
      ).admin_id;

      if (adminId !== req.user.id) {
        res.status(403).send('No access');
      }

      await this.applicationService.updateStatus(req.params.id, status);

      res.status(200).json(req.body.status);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getByMission(req, res) {
    try {
      const applications =
        await this.applicationService.getApplicationsForMission(
          req.params.missionId
        );
      res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  }
}

export default ApplicationController;
