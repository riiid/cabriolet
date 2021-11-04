import { getPath } from "./strategy";

/*
    (0)------->(1)
*/
test("getPath", () => {
  let graph = [
    [0, 1],
    [Infinity, 0],
  ];
  expect(getPath(0, 1, graph)).toEqual([0, 1]);
  expect(getPath(1, 0, graph)).toEqual([]);
});

/*
    (0)<------->(1)
*/
test("getPath", () => {
  let graph = [
    [0, 1],
    [1, 0],
  ];
  expect(getPath(0, 1, graph)).toEqual([0, 1]);
  expect(getPath(1, 0, graph)).toEqual([1, 0]);
});

/*
    (0)<------->(1)<------->(2)
*/
test("getPath", () => {
  let graph = [
    [0, 1, Infinity],
    [1, 0, 1],
    [Infinity, 1, 0],
  ];
  expect(getPath(0, 1, graph)).toEqual([0, 1]);
  expect(getPath(0, 2, graph)).toEqual([0, 1, 2]);
  expect(getPath(2, 1, graph)).toEqual([2, 1]);
  expect(getPath(2, 0, graph)).toEqual([2, 1, 0]);
  expect(getPath(1, 0, graph)).toEqual([1, 0]);
  expect(getPath(1, 2, graph)).toEqual([1, 2]);
});

/* 
    (0)------->(3)
    |         /|\
    |          |
    |          | 
   \|/         |
    (1)------->(2)             
*/
test("getPath", () => {
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
test("weighted getPath", () => {
  let graph = [
    [0, 5, Infinity, 10],
    [Infinity, 0, 3, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0],
  ];
  expect(getPath(0, 3, graph)).toEqual([0, 1, 2, 3]);
  expect(getPath(0, 2, graph)).toEqual([0, 1, 2]);
  expect(getPath(1, 3, graph)).toEqual([1, 2, 3]);
  expect(getPath(3, 2, graph)).toEqual([]);
});
