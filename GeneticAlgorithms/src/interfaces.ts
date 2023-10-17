export interface IClonable {
  clone(): this;
}

export interface IGAGenome extends IClonable {
  seq: IClonable[];
}

export interface IGAIndividual extends IClonable {
  readonly genome: IGAGenome;
}

export interface IGAWorld {
  readonly population: IGAIndividual[];
  start(): void;
}
