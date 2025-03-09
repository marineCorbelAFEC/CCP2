import { missionService } from '../../instanciation.js';
class MissionController {
  constructor() {
    this.missionService = missionService;
  }

  async create(req, res) {
    try {
      if (req.body.description) {
        sanitizeHtml(req.body.description);
        /* pour ne garder que le text brut ou  sanitizeHtml(req.body.comment, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p'],
    allowedAttributes: {}"`)
}); */
      }

      const mission = await this.missionService.createMission(req.body);

      res.status(201).json(mission);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async update(req, res) {
    try {
      await this.missionService.updateMission(req.params.id, req.body);
      res.status(200).json({ message: 'Mission modifiée avec succès' });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res) {
    try {
      await this.missionService.deleteMission(req.params.id);
      res.status(200).json({ message: 'Mission supprimée avec succès' });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res) {
    try {
      const missions = await this.missionService.getMissions();

      res.status(200).json(missions);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res) {
    try {
      const mission = await this.missionService.getMissionById(req.params.id);

      res.status(200).json(mission);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

export default MissionController;
