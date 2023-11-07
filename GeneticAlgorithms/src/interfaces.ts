import { IClonable } from "../../utils/interfaces/IClonable.ts";

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
