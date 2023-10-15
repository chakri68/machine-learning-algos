import { IGAIndividual, IGAWorld } from "../interfaces.ts";

export interface IFitnessStrategy {
  getFitness(individual: IGAIndividual): number;
}

export type IFitnessStrategyGen = (world: IGAWorld) => IFitnessStrategy;
