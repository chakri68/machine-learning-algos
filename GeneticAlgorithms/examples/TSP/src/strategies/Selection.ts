import { TSPIndividual } from "../TSPIndividual.ts";
import { TSPWorld } from "../TSPWorld.ts";

export interface TSPSelectionStrategy {
  select(): [TSPIndividual, TSPIndividual];
}

export type TSPSelectionStrategyGen = (world: TSPWorld) => TSPSelectionStrategy;

export class BiasedRouletteSelection implements TSPSelectionStrategy {
  constructor(private world: TSPWorld) {}

  selectOne(): TSPIndividual {
    const totalFitness = this.world.population.reduce(
      (acc, individual) =>
        acc + this.world.strategies.fitnessStrategy.getFitness(individual),
      0
    );
    const cumulativeFitness = this.world.population.reduce(
      (acc: number[], individual: TSPIndividual) => {
        acc.push(
          (acc?.[acc.length - 1] ?? 0) +
            this.world.strategies.fitnessStrategy.getFitness(individual) /
              totalFitness
        );
        return acc;
      },
      []
    );

    const random = Math.random();
    let selectedIndividual: TSPIndividual = this.world.population[0];
    let i = 0;
    for (const fitness of cumulativeFitness) {
      if (random <= fitness) {
        selectedIndividual = this.world.population[i];
        break;
      }
      i += 1;
    }
    return selectedIndividual;
  }

  select(): [TSPIndividual, TSPIndividual] {
    if (this.world.population.length === 1)
      throw new Error("Individuals can't be selected from a population of 1");
    const selected1 = this.selectOne();
    let selected2 = this.selectOne();
    while (selected1 === selected2) {
      console.log("SAME, FINDING ANOTHER FATHER");
      selected2 = this.selectOne();
    }
    return [selected1, selected2];
  }
}
