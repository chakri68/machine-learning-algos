import { IGAGenome, IGAIndividual } from "../../../src/interfaces.ts";
import { TSPGenome } from "./TSPGenome.ts";

export class TSPIndividual implements IGAIndividual {
  genome: TSPGenome;

  constructor(genome: TSPGenome) {
    this.genome = genome.clone();
  }

  clone(): this {
    return new TSPIndividual(this.genome.clone()) as this;
  }
}
