import { IGAIndividual, IGAWorld } from "../interfaces.ts";

export interface ISpawnStrategy {
  spawn(n: number): IGAIndividual[];
}

export type ISpawnStrategyGen<S> = (world: IGAWorld<S>) => ISpawnStrategy;
