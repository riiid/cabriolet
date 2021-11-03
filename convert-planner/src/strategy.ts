/**
 * TODO:
 * 1. make getPath more generic
 * 2. (if possible) fix floydWarshall, try to get full path at once, so that we won't need to flatten it afterwards
 */

/**
 * keep track of the actual path while running shotest path algo.
 */
export type PathMap = Map<string, number[]>;

/**
 * wrapper function to get full path between target vertices
 */
export function getPath(
  fromIndex: number,
  toIndex: number,
  matrix: number[][]
): number[] {
  let pathMap = floydWarshall(matrix);
  let res = flattenPathMap([fromIndex, toIndex], pathMap);
  if (res.length !== 0) res.push(toIndex);

  return res;
}

/**
 * get shortest path between ALL vertices
 * Time complexity: O(V^3)
 */
export function floydWarshall(graph: number[][]): PathMap {
  const n = graph.length;
  let dist = Array.from(Array(n), () => new Array(n).fill(0));
  let path = new Map<string, number[]>();

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = graph[i][j];

      if (dist[i][j] > 0 && dist[i][j] !== Infinity)
        path.set(getPathMapKey(i, j), [i, j]);
    }
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          path.set(getPathMapKey(i, j), [i, k, j]);
        }
      }
    }
  }

  return path;
}

/**
 * helper function to get full path
 */
function flattenPathMap(input: number[], pathMap: PathMap): number[] {
  let res: number[] = [];

  for (let i = 1; i < input.length; i++) {
    let key = getPathMapKey(input[i - 1], input[i]);
    let val = pathMap.get(key);
    if (val) {
      if (val.length === 2) {
        res.push(input[i - 1]);
      } else if (val.length > 2) {
        res.push(...flattenPathMap(val, pathMap));
      }
    }
  }
  return res;
}

/**
 * pathMap key format
 */
function getPathMapKey<T>(i: T, j: T): string {
  return `${i}_${j}`;
}
