import { Ord, Ordering } from "./util/Ord";

export class Cost extends Ord {
  converterCost: number;
  upcastCost: number;

  constructor(converterCost: number, upcastCost: number) {
    super()
    this.converterCost = converterCost;
    this.upcastCost = upcastCost;
  }

  add(b: Cost): Cost {
    return new Cost(this.converterCost + b.converterCost, this.upcastCost + b.upcastCost);
  }

  override compare(b: Cost): Ordering {
    if (b === undefined) {
      return Ordering.UNDEF;
    }
    if (this.converterCost < b.converterCost) {
      return Ordering.LT;
    } else if (this.converterCost > b.converterCost) {
      return Ordering.GT;
    } else {
      if (this.upcastCost < b.upcastCost) {
        return Ordering.LT;
      } else if (this.upcastCost > b.upcastCost) {
        return Ordering.GT;
      } else {
        return Ordering.EQ;
      }
    }
  }

  static get Infinity(): Cost {
    return new Cost(Infinity, Infinity);
  }
}

