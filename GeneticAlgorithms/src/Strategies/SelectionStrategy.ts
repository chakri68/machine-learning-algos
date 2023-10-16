import { IGAIndividual, IGAWorld } from "../interfaces.ts";

export interface ISelectionStrategy {
  select(): [IGAIndividual, IGAIndividual];
}

export type ISelectionStrategyGen<S> = (
  world: IGAWorld<S>
) => ISelectionStrategy;

export class BiasedRouletteSelection<S> implements ISelectionStrategy {
  constructor(private world: IGAWorld<S>) {}

  selectOne(): IGAIndividual {
    const totalFitness = this.world.population.reduce(
      (acc, individual) =>
        acc + this.world.strategies.fitnessStrategy.getFitness(individual),
      0
    );
    const cumulativeFitness = this.world.population.reduce(
      (acc: number[], individual: IGAIndividual) => {
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
    let selectedIndividual: IGAIndividual = this.world.population[0];
    let i = 0;
    for (const fitness of cumulativeFitness) {
      if (fitness <= random) {
        selectedIndividual = this.world.population[i];
        break;
      }
      i += 1;
    }

    return selectedIndividual;
  }

  select(): [IGAIndividual, IGAIndividual] {
    if (this.world.population.length === 1)
      throw new Error("Individuals can't be selected from a population of 1");
    const selected1 = this.selectOne();
    let selected2 = this.selectOne();
    // while (selected1 === selected2) selected2 = this.selectOne();
    return [this.world.population[0], this.world.population[1]];
  }
}
