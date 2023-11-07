import { IGAIndividual } from "../../../src/interfaces.ts";
import { CGAGneome } from "./CGAGenome.ts";

export class CGAIndividual implements IGAIndividual {
  genome: CGAGneome;

  constructor(genome: CGAGneome) {
    this.genome = genome;
  }

  clone(): this {
    return new CGAIndividual(this.genome.clone()) as this;
  }
}
