import { Cost } from "./cost";
import { Ord, Ordering } from "./util/Ord";

export class Edge extends Ord {
  from: string;
  to: string;
  cost: Cost;

  constructor(from: string, to: string, cost: Cost) {
    super();
    this.from = from;
    this.to = to;
    this.cost = cost;
  }

  override compare(b: Edge): Ordering {
    return this.cost.compare(b.cost);
  }


  isConverter(): boolean {
    return this.cost.converterCost !== 0;
  }

  isUpcast(): boolean {
    return !this.isConverter();
  }
}

