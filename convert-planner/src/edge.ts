import { Cost } from "./cost";
import { Ord, Ordering } from "./util/Ord";

import { Type as ConvertPlanEntry } from "@riiid/cabriolet-proto/lib/messages/riiid/kvf/ConvertPlanEntry"

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

  convertToProto(): ConvertPlanEntry {
    return {
      value: {
        field: this.isConverter() ? "convert" : "upcast",
        value: {
          formatId: this.to
        }
      }
    }
  }
}
