export function arrToMap<T>(
  items: T[],
  getId: (item: T) => string
): { [id: string]: T } {
  const result: { [id: string]: T } = {};
  for (const item of items) result[getId(item)] = item;
  return result;
}
