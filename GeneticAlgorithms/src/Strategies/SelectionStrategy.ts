import { IGAIndividual, IGAWorld } from "../interfaces.ts";

export interface ISelectionStrategy {
  select(): [IGAIndividual, IGAIndividual];
}

export type ISelectionStrategyGen = (world: IGAWorld) => ISelectionStrategy;
