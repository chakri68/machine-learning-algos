import { Vector } from "../../../../data-structures/Vector.ts";
import { OptionalObjectOf, mergeOptionals } from "../../../../utils/ts.ts";
import { IGAWorld } from "../../../src/interfaces.ts";
import { CGAIndividual } from "./CGAIndividual.ts";
import {
  CGACrossoverStrategy,
  CGACrossoverStrategyGen,
} from "./Strategies/Crossover.ts";
import {
  CGAFitnessStrategy,
  CGAFitnessStrategyGen,
  VarianceFitness,
} from "./Strategies/Fitness.ts";
import {
  CGAMutationStrategy,
  CGAMutationStrategyGen,
} from "./Strategies/Mutation.ts";
import {
  CGASelectionStrategy,
  CGASelectionStrategyGen,
} from "./Strategies/Selection.ts";
import {
  CGASpawnStrategy,
  CGASpawnStrategyGen,
  RandomSpawn,
} from "./Strategies/Spawn.ts";

export type CGAOptions = {
  populationSize?: number;
  maxIterations?: number;
};

export type CGAStrategies = {
  fitnessStrategy: CGAFitnessStrategy;
  spawnStrategy: CGASpawnStrategy;
  crossoverStrategy: CGACrossoverStrategy;
  mutationStrategy: CGAMutationStrategy;
  selectionStrategy: CGASelectionStrategy;
};

type CGAStrategyOptions = {
  fitnessStrategy?: CGAFitnessStrategyGen;
  spawnStrategy?: CGASpawnStrategyGen;
  crossoverStrategy: CGACrossoverStrategyGen;
  mutationStrategy: CGAMutationStrategyGen;
  selectionStrategy: CGASelectionStrategyGen;
};

export type CGAWorldData = {
  points: Vector<number>[];
  k: number;
  iterations?: number;
};

const defaultData: OptionalObjectOf<CGAWorldData> = {
  iterations: 100,
};

const defaultOptions: OptionalObjectOf<CGAOptions> = {
  populationSize: 100,
  maxIterations: 100,
};

export class CGAWorld implements IGAWorld {
  data: Required<CGAWorldData>;
  population: CGAIndividual[];
  strategies: Required<CGAStrategies>;
  options: Required<CGAOptions>;

  constructor(
    data: CGAWorldData,
    options: CGAOptions,
    strategies: CGAStrategyOptions
  ) {
    this.strategies = this.handleStrategies(strategies);
    this.options = mergeOptionals(options, defaultOptions);
    this.data = mergeOptionals(data, defaultData);

    // Spawn the initial population
    this.population = this.strategies.spawnStrategy.spawn(
      this.options.populationSize
    );
  }

  nextGen() {
    // Select parents and produce new offspring
    const newPopulation: CGAIndividual[] = [];
    while (newPopulation.length < this.options.populationSize) {
      const [mother, father] = this.strategies.selectionStrategy.select();
      const [offspring1, offspring2] =
        this.strategies.crossoverStrategy.crossover(mother, father);

      this.strategies.mutationStrategy.mutate(offspring1);
      this.strategies.mutationStrategy.mutate(offspring2);

      newPopulation.push(offspring1, offspring2);
    }

    this.population.push(...newPopulation);
    this.population.sort(
      (individualA, individualB) =>
        this.strategies.fitnessStrategy.getFitness(individualB) -
        this.strategies.fitnessStrategy.getFitness(individualA)
    );

    this.population.length = this.options.populationSize;
  }

  private handleStrategies(strategies: CGAStrategyOptions) {
    const defaultStrategies: OptionalObjectOf<CGAStrategyOptions> = {
      fitnessStrategy: (world: CGAWorld) => new VarianceFitness(world),
      spawnStrategy: (world) => new RandomSpawn(world),
    };
    const strategiesGen: Required<CGAStrategyOptions> = mergeOptionals(
      strategies,
      defaultStrategies
    );

    return {
      crossoverStrategy: strategiesGen.crossoverStrategy(this),
      fitnessStrategy: strategiesGen.fitnessStrategy(this),
      mutationStrategy: strategiesGen.mutationStrategy(this, 0.9),
      selectionStrategy: strategiesGen.selectionStrategy(this),
      spawnStrategy: strategiesGen.spawnStrategy(this),
    };
  }

  start() {
    for (let i = 0; i < this.options.maxIterations; i++) {
      console.log(`
      ========== GENERATION ${i + 1} ==========
            POPULATION
${this.population
  .map(
    (individual) =>
      individual.genome.seq.join(", ") +
      " fitness: " +
      this.strategies.fitnessStrategy.getFitness(individual)
  )
  .join("\n")}
      `);
      this.nextGen();
    }
  }
}
