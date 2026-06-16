type LockMap = Map<string, Promise<void>>;

function getLocks(): LockMap {
  const g = globalThis as unknown as { __glowupStoreLocks?: LockMap };
  if (!g.__glowupStoreLocks) g.__glowupStoreLocks = new Map<string, Promise<void>>();
  return g.__glowupStoreLocks;
}

export async function withStoreLock<T>(key: string, fn: () => Promise<T>) {
  const locks = getLocks();
  const prev = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = () => resolve();
  });
  const tail = prev.then(() => current);
  locks.set(key, tail);
  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(key) === tail) locks.delete(key);
  }
}
