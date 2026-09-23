import APPError from "../utils/ErrorHandler.js";

const METHOD_ACTION_MAP = {
  GET: "Consulter",
  POST: "Ajouter",
  PATCH: "Modifier",
  PUT: "Modifier",
  DELETE: "Supprimer",
};

const hasPermission = (permissions, model, action) => {
  const entry = permissions.find((permission) => permission.model === model);
  return !!entry && (entry.actions || []).includes(action);
};

// Mirrors the front-end's model + actions permission model (EmployeeType.permissions).
// Protect must run before this so req.user.mission.permissions is populated.
// `models` may be a single model name or an array (granted if ANY of them matches).
export const RequirePermission = (models) => (req, res, next) => {
  const action = METHOD_ACTION_MAP[req.method];
  if (!action) return next();

  const modelList = Array.isArray(models) ? models : [models];
  const permissions = req.user?.mission?.permissions || [];
  const allowed = modelList.some((model) =>
    hasPermission(permissions, model, action),
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
