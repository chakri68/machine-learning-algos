import { ICrossoverStrategy } from "./Strategies/CrossoverStrategy.ts";
import { IFitnessStrategy } from "./Strategies/FitnessStrategy.ts";
import { IMutationStrategy } from "./Strategies/MutationStrategy.ts";
import { ISelectionStrategy } from "./Strategies/SelectionStrategy.ts";
import { ISpawnStrategy } from "./Strategies/SpawnStrategy.ts";

export interface IGAGenome {
  seq: number[];
  clone(): IGAGenome;
}

export interface IGAIndividual {
  readonly genome: IGAGenome;
  clone(): IGAIndividual;
}

export type IGAStrategies = {
  fitnessStrategy: IFitnessStrategy;
  spawnStrategy: ISpawnStrategy;
  crossoverStrategy: ICrossoverStrategy;
  mutationStrategy: IMutationStrategy;
  selectionStrategy: ISelectionStrategy;
};

export interface IGAWorld<S> {
  readonly population: IGAIndividual[];
  readonly strategies: IGAStrategies;
  readonly data: S;
}
