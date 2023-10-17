import { OptionalObjectOf, mergeOptionals } from "../../../../utils/ts.ts";
import { IGAWorld } from "../../../src/interfaces.ts";
import { City } from "./TSPGenome.ts";
import { TSPIndividual } from "./TSPIndividual.ts";
import {
  EuclideanFitness,
  TSPFitnessStrategy,
  TSPFitnessStrategyGen,
} from "./Strategies/Fitness.ts";
import {
  RandomSpawn,
  TSPSpawnStrategy,
  TSPSpawnStrategyGen,
} from "./Strategies/Spawn.ts";
import {
  TSPSelectionStrategy,
  TSPSelectionStrategyGen,
} from "./Strategies/Selection.ts";
import {
  TSPCrossoverStrategy,
  TSPCrossoverStrategyGen,
} from "./Strategies/Crossover.ts";
import {
  TSPMutationStrategy,
  TSPMutationStrategyGen,
} from "./Strategies/Mutation.ts";

export type TSPOptions = {
  populationSize?: number;
  maxIterations?: number;
};

export type TSPStrategies = {
  fitnessStrategy: TSPFitnessStrategy;
  spawnStrategy: TSPSpawnStrategy;
  crossoverStrategy: TSPCrossoverStrategy;
  mutationStrategy: TSPMutationStrategy;
  selectionStrategy: TSPSelectionStrategy;
};

type TSPStrategyOptions = {
  fitnessStrategy?: TSPFitnessStrategyGen;
  spawnStrategy?: TSPSpawnStrategyGen;
  crossoverStrategy: TSPCrossoverStrategyGen;
  mutationStrategy: TSPMutationStrategyGen;
  selectionStrategy: TSPSelectionStrategyGen;
};

export type TSPWorldData = {
  cities: City[];
};

const defaultOptions: OptionalObjectOf<TSPOptions> = {
  populationSize: 100,
  maxIterations: 100,
};

export class TSPWorld implements IGAWorld {
  cities: City[];
  population: TSPIndividual[];
  strategies: Required<TSPStrategies>;
  options: Required<TSPOptions>;

  constructor(
    data: TSPWorldData,
    options: TSPOptions,
    strategies: TSPStrategyOptions
  ) {
    this.strategies = this.handleStrategies(strategies);
    this.options = mergeOptionals(options, defaultOptions);
    this.cities = data.cities;

    // Spawn the initial population
    this.population = this.strategies.spawnStrategy.spawn(
      this.options.populationSize
    );
  }

  nextGen() {
    // Select parents and produce new offspring
    const newPopulation: TSPIndividual[] = [];
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

  private handleStrategies(strategies: TSPStrategyOptions) {
    const defaultStrategies: OptionalObjectOf<TSPStrategyOptions> = {
      fitnessStrategy: (world: TSPWorld) => new EuclideanFitness(world),
      spawnStrategy: (world) => new RandomSpawn(world),
    };
    const strategiesGen: Required<TSPStrategyOptions> = mergeOptionals(
      strategies,
      defaultStrategies
    );

    return {
      crossoverStrategy: strategiesGen.crossoverStrategy(),
      fitnessStrategy: strategiesGen.fitnessStrategy(this),
      mutationStrategy: strategiesGen.mutationStrategy(0.9),
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
