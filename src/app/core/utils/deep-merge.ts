type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clone<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clone) as T;
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)])) as T;
  }
  return value;
}

/**
 * Recursively merges `overrides` into `base` without mutating either.
 * Objects merge; primitives and arrays are replaced; `undefined` overrides are ignored.
 */
export function deepMerge<T>(base: T, overrides: unknown): T {
  if (overrides === undefined) return clone(base);
  if (!isPlainObject(base) || !isPlainObject(overrides)) return clone(overrides) as T;

  const result: PlainObject = {};
  for (const key of new Set([...Object.keys(base), ...Object.keys(overrides)])) {
    result[key] = deepMerge(base[key], overrides[key]);
  }
  return result as T;
}
