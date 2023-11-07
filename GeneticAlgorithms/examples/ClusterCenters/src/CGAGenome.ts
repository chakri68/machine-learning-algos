import { IClonable, IGAGenome } from "../../../src/interfaces.ts";

export class CGAPointIndex implements IClonable {
  constructor(public idx: number) {}

  clone(): this {
    return new CGAPointIndex(this.idx) as this;
  }

  toString(): string {
    return this.idx.toString();
  }
}

// Stores a set of Cluster Centers indices
export class CGAGneome implements IGAGenome {
  seq: CGAPointIndex[];

  constructor(cityOrder: number[] | CGAPointIndex[]) {
    if (this.isNumberArray(cityOrder)) {
      this.seq = cityOrder.map((idx) => new CGAPointIndex(idx));
    } else {
      this.seq = cityOrder;
    }
  }

  clone(): this {
    return new CGAGneome(this.seq.map((cityIdx) => cityIdx.idx)) as this;
  }

  private isNumberArray(
    cityOrder: number[] | CGAPointIndex[]
  ): cityOrder is number[] {
    return typeof cityOrder[0] === "number";
  }
}
