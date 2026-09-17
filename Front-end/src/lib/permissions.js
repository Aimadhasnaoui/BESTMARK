const STORAGE_KEY = "permissions";

export function savePermissions(permissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions || []));
  } catch {
    // localStorage unavailable (private mode, disabled storage, ...)
  }
}

export function loadPermissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearPermissions() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasModelAccess(permissions, model) {
  const entry = (permissions || []).find((p) => p.model === model);
  return !!entry && (entry.actions?.length || 0) > 0;
}

export function hasAnyModelAccess(permissions, models) {
  return (models || []).some((model) => hasModelAccess(permissions, model));
}

export function hasAction(permissions, model, action) {
  const entry = (permissions || []).find((p) => p.model === model);
  return !!entry && (entry.actions || []).includes(action);
}
