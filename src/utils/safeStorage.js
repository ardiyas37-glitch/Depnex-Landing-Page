const BACKUP_SUFFIX = ":backup";

export function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch {
    try {
      const backupRaw = localStorage.getItem(key + BACKUP_SUFFIX);
      if (backupRaw) {
        const backupParsed = JSON.parse(backupRaw);
        try { localStorage.setItem(key, backupRaw); } catch {}
        return backupParsed;
      }
    } catch {}
  }
  return defaultValue;
}

export function safeSet(key, value) {
  try {
    const serialized = JSON.stringify(value);
    const currentRaw = localStorage.getItem(key);
    if (currentRaw && currentRaw !== serialized) {
      try { localStorage.setItem(key + BACKUP_SUFFIX, currentRaw); } catch {}
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(key + BACKUP_SUFFIX);
  } catch {}
}
