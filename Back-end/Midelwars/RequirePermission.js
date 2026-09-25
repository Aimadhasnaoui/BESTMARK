import APPError from "../utils/ErrorHandler.js";

// GET grants access for either full "Consulter" or scoped "Consulter pour Utilisateur".
// The controller is responsible for narrowing the dataset when the scoped action is used.
const METHOD_ACTION_MAP = {
  GET: ["Consulter", "Consulter pour Utilisateur"],
  POST: ["Ajouter"],
  PATCH: ["Modifier"],
  PUT: ["Modifier"],
  DELETE: ["Supprimer"],
};

const hasPermission = (permissions, model, actions) => {
  const entry = permissions.find((permission) => permission.model === model);
  if (!entry) return false;
  return (Array.isArray(actions) ? actions : [actions]).some((a) =>
    (entry.actions || []).includes(a),
  );
};

// Mirrors the front-end's model + actions permission model (EmployeeType.permissions).
// Protect must run before this so req.user.mission.permissions is populated.
// `models` may be a single model name or an array (granted if ANY of them matches).
export const RequirePermission = (models) => (req, res, next) => {
  const actions = METHOD_ACTION_MAP[req.method];
  if (!actions) return next();

  const modelList = Array.isArray(models) ? models : [models];
  const permissions = req.user?.mission?.permissions || [];
  const allowed = modelList.some((model) =>
    hasPermission(permissions, model, actions),
  );

  if (!allowed) {
    return next(
      new APPError(
        "Vous n'avez pas la permission d'effectuer cette action",
        403,
      ),
    );
  }
  next();
};
