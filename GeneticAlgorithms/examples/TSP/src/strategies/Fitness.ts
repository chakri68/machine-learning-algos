import { IFitnessStrategy } from "../../../../src/Strategies/FitnessStrategy.ts";
import { IGAIndividual, IGAWorld } from "../../../../src/interfaces.ts";
import { TSPWorldState } from "../interfaces.ts";

export class EuclideanFitness implements IFitnessStrategy {
  constructor(private world: IGAWorld<TSPWorldState>) {}

  getFitness(individual: IGAIndividual): number {
    const citiesSeq = individual.genome.seq;

    return -citiesSeq.reduce(
      (acc, _, idx) =>
        acc +
        this.getEuclideanDistance(
          this.world.data.cities[citiesSeq[idx]].location,
          this.world.data.cities[citiesSeq[(idx + 1) % citiesSeq.length]]
            .location
        ),
      0
    );
  }

  getEuclideanDistance(a: [number, number], b: [number, number]): number {
    return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
  }
}
