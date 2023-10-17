import { IClonable, IGAGenome, IGAIndividual } from "./interfaces.ts";

export class GAIndividual implements IGAIndividual, IClonable {
  genome: IGAGenome;

  constructor(genome: IGAGenome) {
    this.genome = genome.clone();
  }

  clone(): this {
    return new GAIndividual(this.genome.clone()) as this;
  }
}
