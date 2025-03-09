import OrganizationService from './organizationService.js';

class OrganizationController {
  constructor() {
    this.organizationService = new OrganizationService();
  }
  async createOrganizationWithAdmin(req, res) {
    const { name, description } = req.body;

    try {
      const organization =
        await this.organizationService.createOrganizationWithAdmin(
          { name, description },
          req.user.id
        );
      res.status(201).json(organization);
    } catch (error) {
      console.error(error);
      next(err);
    }
  }
}

export default OrganizationController;
