import { IClonable, IGAGenome } from "../../../src/interfaces.ts";

export type City = {
  location: [number, number];
};

export class CityIndex implements IClonable {
  constructor(public idx: number) {}

  clone(): this {
    return new CityIndex(this.idx) as this;
  }

  toString(): string {
    return this.idx.toString();
  }
}

export class TSPGenome implements IGAGenome {
  seq: CityIndex[];

  constructor(cityOrder: number[] | CityIndex[]) {
    if (this.isNumberArray(cityOrder)) {
      this.seq = cityOrder.map((idx) => new CityIndex(idx));
    } else {
      this.seq = cityOrder;
    }
  }

  clone(): this {
    return new TSPGenome(this.seq.map((cityIdx) => cityIdx.idx)) as this;
  }

  private isNumberArray(
    cityOrder: number[] | CityIndex[]
  ): cityOrder is number[] {
    return typeof cityOrder[0] === "number";
  }
}
