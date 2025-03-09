import OrganizationRepository from './organizationRepository.js';

class OrganizationService {
  constructor() {
    this.organisationRepository = new OrganizationRepository();
  }
  async createOrganizationWithAdmin(organizationData, adminUserId) {
    if (!adminUserId) throw new ArgumentRequiredException(400, 'id Required');
    // Créer l'association
    const organization = await this.organisationRepository.create(
      organizationData
    );

    // Ajouter l'utilisateur en tant qu'admin
    await this.organisationRepository.addUserToOrganization(
      adminUserId,
      organization.id,
      'admin'
    );

    return organization;
  }
}

export default OrganizationService;
