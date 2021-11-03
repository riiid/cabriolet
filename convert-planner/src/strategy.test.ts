import { floydWarshall, getPath } from "./strategy";

/* 
         10
    (0)------->(3)
    |         /|\
    |          |
  5 |          | 1
   \|/         |
    (1)------->(2)
          3             
*/
test("floyd Warshall 1", () => {
  let graph = [
    [0, 5, Infinity, 10],
    [Infinity, 0, 3, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0],
  ];

  let expected = new Map([
    ["0_1", [0, 1]],
    ["0_3", [0, 2, 3]],
    ["1_2", [1, 2]],
    ["2_3", [2, 3]],
    ["0_2", [0, 1, 2]],
    ["1_3", [1, 2, 3]],
  ]);
  expect(floydWarshall(graph)).toEqual(expected);
});

/* 
    
    (0)------->(3)
   /|\        /|\
    |          |
    |          | 
   \|/         |
    (1)------->(2)
                       
*/
test("floyd Warshall 2", () => {
  let graph = [
    [0, 1, Infinity, 1],
    [1, 0, 1, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0],
  ];

  let expected = new Map([
    ["0_1", [0, 1]],
    ["0_3", [0, 3]],
    ["1_0", [1, 0]],
    ["1_2", [1, 2]],
    ["2_3", [2, 3]],
    ["1_3", [1, 0, 3]],
    ["0_2", [0, 1, 2]],
  ]);
  expect(floydWarshall(graph)).toEqual(expected);
});

/* 
    (0)------->(3)
    |         /|\
    |          |
    |          | 
   \|/         |
    (1)------->(2)             
*/
test("getPath 1", () => {
  let graph = [
    [0, 1, Infinity, 1],
    [Infinity, 0, 1, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0],
  ];
  expect(getPath(0, 3, graph)).toEqual([0, 3]);
  expect(getPath(0, 2, graph)).toEqual([0, 1, 2]);
  expect(getPath(1, 3, graph)).toEqual([1, 2, 3]);
  expect(getPath(3, 2, graph)).toEqual([]);
});
