import { IClonable, IGAGenome } from "./interfaces.ts";

type G = IClonable;

export class GAGenome implements IGAGenome, IClonable {
  seq: G[];

  constructor(sequence: G[]) {
    this.seq = sequence.map((s) => s.clone()) as G[];
  }

  clone(): this {
    return new GAGenome(this.seq.map((s) => s.clone()) as G[]) as this;
  }
}
