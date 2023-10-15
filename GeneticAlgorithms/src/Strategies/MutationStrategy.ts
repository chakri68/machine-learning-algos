import { IGAIndividual } from "../interfaces.ts";

export interface IMuationStrategy {
  mutate(genome: IGAIndividual): IGAIndividual;
}

export type IMuationStrategyGen = () => IMuationStrategy;
