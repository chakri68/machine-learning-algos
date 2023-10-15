import { IGAGenome } from "./interfaces.ts";

export class GAGenome implements IGAGenome {
  seq: number[];

  constructor(sequence: number[]) {
    this.seq = [...sequence];
  }

  clone(): IGAGenome {
    return new GAGenome([...this.seq]);
  }
}
