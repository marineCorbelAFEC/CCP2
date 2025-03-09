const ApplicationStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
};

// Correspondance des statuts pour affichage en français
const ApplicationStatusLabels = {
  [ApplicationStatus.PENDING]: 'En attente',
  [ApplicationStatus.ACCEPTED]: 'Acceptée',
  [ApplicationStatus.REJECTED]: 'Rejetée',
};

export { ApplicationStatus, ApplicationStatusLabels };
