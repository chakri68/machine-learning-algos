import { TSPIndividual } from "../TSPIndividual.ts";
import { TSPWorld } from "../TSPWorld.ts";

export interface TSPFitnessStrategy {
  world: TSPWorld;
  getFitness(individual: TSPIndividual): number;
}

export type TSPFitnessStrategyGen = (world: TSPWorld) => TSPFitnessStrategy;

export class EuclideanFitness implements TSPFitnessStrategy {
  constructor(public world: TSPWorld) {}

  getFitness(individual: TSPIndividual): number {
    const citiesSeq = individual.genome.seq;

    return -citiesSeq.reduce(
      (acc, _, idx) =>
        acc +
        this.getEuclideanDistance(
          this.world.cities[citiesSeq[idx].idx].location,
          this.world.cities[citiesSeq[(idx + 1) % citiesSeq.length].idx]
            .location
        ),
      0
    );
  }

  getEuclideanDistance(a: [number, number], b: [number, number]): number {
    return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
  }
}
