export enum Instruction {
  validate,
  convert,
}

interface InstructionType<T extends Instruction> {
  type: T;
  relatedConvertPlanIndex: number;
}

export interface Validate extends InstructionType<Instruction.validate> {
  formatId: string;
}

export interface Convert extends InstructionType<Instruction.convert> {
  fromFormatId: string;
  toFormatId: string;
}

export type ConcretePlanEntry = Validate | Convert;

export function* iterConcretePlan(
  formatIds: string[]
): Generator<ConcretePlanEntry> {
  let index = 0;
  for (const [fromFormatId, toFormatId] of iterEdges(formatIds)) {
    // validate the starting vertex
    if (index === 0) {
      yield {
        type: Instruction.validate,
        relatedConvertPlanIndex: index,
        formatId: fromFormatId,
      };
    }
    yield {
      type: Instruction.convert,
      relatedConvertPlanIndex: index,
      fromFormatId: fromFormatId,
      toFormatId: toFormatId,
    };
    yield {
      type: Instruction.validate,
      relatedConvertPlanIndex: index,
      formatId: toFormatId,
    };
    index++;
  }
}

function* iterEdges<T>(arr: Iterable<T>): Generator<[T, T]> {
  const iterator = arr[Symbol.iterator]();
  const first = iterator.next();
  if (first.done) return;
  let prev = first.value;
  while (true) {
    const iterResult = iterator.next();
    if (iterResult.done) return;
    const curr = iterResult.value;
    yield [prev, curr];
    prev = curr;
  }
}
