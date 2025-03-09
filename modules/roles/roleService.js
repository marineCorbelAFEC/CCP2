import RoleRepository from './roleRepository.js';

class RoleService {
  constructor() {
    this.roleRepository = new RoleRepository();
  }
  async isAdmin(userId, organizationId) {
    return this.roleRepository.isAdminAssociation(userId, organizationId);
  }
}

export default RoleService;
