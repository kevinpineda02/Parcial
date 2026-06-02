const DEFAULT_TTL_MS = 30 * 1000;
const store = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function get(key) {
  const item = store.get(key);

  if (!item) {
    return null;
  }

  if (Date.now() > item.expiresAt) {
    store.delete(key);
    return null;
  }

  return clone(item.value);
}

function set(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, {
    value: clone(value),
    expiresAt: Date.now() + ttlMs
  });
}

function clear() {
  store.clear();
}

function buildPacientesListKey(query = {}) {
  const keys = [
    'page',
    'size',
    'sortBy',
    'order',
    'estado',
    'especialidad',
    'edadMin',
    'edadMax',
    'diagnostico'
  ];

  const normalized = keys.reduce((result, key) => {
    result[key] = query[key] ?? '';
    return result;
  }, {});

  return `pacientes:list:${JSON.stringify(normalized)}`;
}

module.exports = {
  get,
  set,
  clear,
  buildPacientesListKey
};
