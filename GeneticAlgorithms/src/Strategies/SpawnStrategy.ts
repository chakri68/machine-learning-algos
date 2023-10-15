import { IGAIndividual, IGAWorld } from "../interfaces.ts";

export interface ISpawnStrategy {
  spawn(): IGAIndividual[];
}

export type ISpawnStrategyGen = (world: IGAWorld) => ISpawnStrategy;
