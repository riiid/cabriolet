export enum Ordering {
  LT,
  EQ,
  GT,
}

export abstract class Ord {
  abstract compare(b: Ord): Ordering;

  isBigger(b: Ord): boolean {
    return Ordering.GT === this.compare(b)
  }

  isSmaller(b: Ord): boolean {
    return Ordering.LT === this.compare(b)
  }
}

export function compare<T extends Ord>(a: T, b: T): Ordering {
  return a.compare(b)
}

export function min<T extends Ord>(a: T, b: T): T {
    switch (a.compare(b)) {
      case Ordering.LT:
        return a
      case Ordering.GT:
        return b
      case Ordering.EQ:
        return a
    }
}

export function max<T extends Ord>(a: T, b: T): T {
    switch (a.compare(b)) {
      case Ordering.GT:
        return a
      case Ordering.LT:
        return b
      case Ordering.EQ:
        return a
    }
  }

export function minFromList<T extends Ord>(list: T[]): T {
  return list.reduce((prev, curr) => min(prev, curr));
}
