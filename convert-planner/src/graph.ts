export class AdjMatrix<T> {
  readonly input: T[];
  readonly inputMap: Map<T, number>;
  readonly vertex: number;
  matrix: number[][];

  constructor(input: T[]) {
    this.input = input;
    this.inputMap = new Map();
    this.vertex = input.length;
    this.matrix = Array.from(Array(this.vertex), () =>
      new Array(this.vertex).fill(Infinity)
    );

    for (var i: number = 0; i < this.vertex; i++) {
      this.inputMap.set(input[i], i);
      this.matrix[i][i] = 0;
    }
  }

  setEdge(from: T, to: T, weight: number = 1) {
    let fromIndex = this.getVertexIndex(from);
    let toIndex = this.getVertexIndex(to);
    this.matrix[fromIndex][toIndex] = weight;
  }

  removeEdge(from: T, to: T) {
    let fromIndex = this.getVertexIndex(from);
    let toIndex = this.getVertexIndex(to);
    this.matrix[fromIndex][toIndex] = Infinity;
  }

  print() {
    for (let row of this.matrix) {
      console.log(row);
    }
  }

  getVertexIndex(target: T): number {
    return (
      this.inputMap.get(target) ?? this.notFound(`vertex not found: ${target}`)
    );
  }

  private notFound(errorMessage: string): never {
    throw new Error(errorMessage);
  }
}

// interface Graph {
//   [id: string]: string[];
// }

// function arrToAdjList<T, U>(
//   items: T[],
//   getId: (item: T) => string
// ): { [id: string]: U[] } {
//   const result: { [id: string]: U[] } = {};
//   for (const item of items) result[getId(item)] = [];
//   return result;
// }

// export function createGrapch(schema: Schema): Graph {
//   const graph: Graph = arrToAdjList(schema.formats, (format) => format.id);
//   schema.converters.forEach((converter) => {
//     graph[converter.fromFormatId].push(converter.toFormatId);
//   });
//   return graph;
// }

// function* bfs(graph: Graph, fromId: string): Generator<string> {
//   const visited: Set<string> = new Set();
//   const queue: string[] = [fromId];
//   while (queue.length) {
//     const curr = queue.shift();
//     visited.add(curr);
//     yield curr;
//     const neighbors = graph[curr].filter((item) => !visited.has(item));
//     queue.push(...neighbors);
//   }
// }

// function findPath(graph: Graph, fromId: string, toId: string): string[] {
//   const parentMap: { [childId: string]: string } = {};
//   const result: string[] = [];
//   for (const curr of bfs(graph, fromId)) {
//     //
//   }
//   return result;
// }

// const graph = {
//     a: ['b', 'd'],
//     b: ['a', 'c'],
//     c: ['d'],
//     d: [],
// };

// console.log(bfs(graph, 'a', 'd'));
