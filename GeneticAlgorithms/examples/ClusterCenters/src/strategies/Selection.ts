import { CGAIndividual } from "../CGAIndividual.ts";
import { CGAWorld } from "../CGAWorld.ts";

export interface CGASelectionStrategy {
  select(): [CGAIndividual, CGAIndividual];
}

export type CGASelectionStrategyGen = (world: CGAWorld) => CGASelectionStrategy;

export class BiasedRouletteSelection implements CGASelectionStrategy {
  constructor(private world: CGAWorld) {}

  selectOne(): CGAIndividual {
    // Normalize the fitness by adding the minimum negative value to all the fitness values
    const fitnessVals = this.world.population.map((individual) =>
      this.world.strategies.fitnessStrategy.getFitness(individual)
    );
    let minNegativeFitness = Math.min(...fitnessVals.filter((f) => f < 0));
    if (minNegativeFitness === Infinity) minNegativeFitness = 0;
    const totalFitness =
      this.world.population.reduce(
        (acc, individual) =>
          acc + this.world.strategies.fitnessStrategy.getFitness(individual),
        0
      ) +
      minNegativeFitness * this.world.population.length;
    const cumulativeFitness = this.world.population.reduce(
      (acc: number[], individual: CGAIndividual) => {
        acc.push(
          (acc?.[acc.length - 1] ?? 0) +
            (this.world.strategies.fitnessStrategy.getFitness(individual) +
              minNegativeFitness) /
              totalFitness
        );
        return acc;
      },
      []
    );

    const random = Math.random();
    let selectedIndividual: CGAIndividual = this.world.population[0];
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

  select(): [CGAIndividual, CGAIndividual] {
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
