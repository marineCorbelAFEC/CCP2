import { roleService } from '../instanciation.js';

// Middleware pour vérifier que l'utilisateur a le rôle 'admin' dans une organisation
async function checkAdminRole(req, res, next) {
  const userId = req.user.id;

  const organizationId = req.body.organizationId || req.params.organizationId;
  if (!organizationId) {
    return res
      .status(400)
      .json({ error: 'Organization ID manquant pour la vérification du rôle' });
  }

  try {
    const isAdmin = await roleService.isAdmin(userId, organizationId);

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Accès refusé : rôle admin requis pour cette organisation',
      });
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Erreur lors de la vérification du rôle' });
  }
}

export default checkAdminRole;
