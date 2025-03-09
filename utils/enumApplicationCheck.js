import { ApplicationStatusLabels } from '../ENUM/application.js';

export function checkApplicationEnum(statusLabel) {
  statusLabel = Object.keys(ApplicationStatusLabels).find(
    (key) => ApplicationStatusLabels[key] === statusLabel
  );

  if (statusLabel === undefined) {
    throw new Error(`Statut invalide : ${statusLabel}`);
  }
  return statusLabel;
}
