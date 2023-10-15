export interface IGAGenome {
  seq: number[];
  clone(): IGAGenome;
}

export interface IGAIndividual {
  readonly genome: IGAGenome;
  clone(): IGAIndividual;
}

export interface IGAWorld {
  readonly population: IGAIndividual[];
}
