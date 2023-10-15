import { IGAGenome, IGAIndividual } from "./interfaces.ts";

export class GAIndividual implements IGAIndividual {
  readonly genome: IGAGenome;

  constructor(genome: IGAGenome) {
    this.genome = genome.clone();
  }

  clone(): IGAIndividual {
    return new GAIndividual(this.genome.clone());
  }
}
