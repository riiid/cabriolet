import { Ord, Ordering } from "./util/Ord";

export class Cost extends Ord {
  converterCost: number;
  upcastCost: number;

  constructor(converterCost: number, upcastCost: number) {
    super()
    this.converterCost = converterCost;
    this.upcastCost = upcastCost;
  }

  override compare(b: Cost): Ordering {
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
}
