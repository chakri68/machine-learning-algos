import { OptionalObjectOf, mergeOptionals } from "../../utils/ts.ts";
import {
  ICrossoverStrategy,
  ICrossoverStrategyGen,
} from "./Strategies/CrossoverStrategy.ts";
import {
  IFitnessStrategy,
  IFitnessStrategyGen,
} from "./Strategies/FitnessStrategy.ts";
import {
  IMuationStrategyGen,
  IMutationStrategy,
} from "./Strategies/MutationStrategy.ts";
import {
  ISelectionStrategy,
  ISelectionStrategyGen,
} from "./Strategies/SelectionStrategy.ts";
import {
  ISpawnStrategy,
  ISpawnStrategyGen,
} from "./Strategies/SpawnStrategy.ts";
import { IGAIndividual, IGAWorld } from "./interfaces.ts";

export type GAWorldOptions = {
  populationSize?: number;
  maxIterations?: number;
};

type IGAStrategies = {
  fitnessStrategy: IFitnessStrategy;
  spawnStrategy: ISpawnStrategy;
  crossoverStrategy: ICrossoverStrategy;
  mutationStrategy: IMutationStrategy;
  selectionStrategy: ISelectionStrategy;
};

export type GAWorldOptionsProp = GAWorldOptions & {
  fitnessStrategy: IFitnessStrategyGen;
  spawnStrategy: ISpawnStrategyGen;
  crossoverStrategy: ICrossoverStrategyGen;
  mutationStrategy: IMuationStrategyGen;
  selectionStrategy: ISelectionStrategyGen;
};

export class GAWorld implements IGAWorld {
  private defaultOptions: OptionalObjectOf<GAWorldOptionsProp> = {
    maxIterations: 100,
    populationSize: 10,
  };
  private options: Required<GAWorldOptions>;
  population: IGAIndividual[];
  private strategies: IGAStrategies;
  generationCount: number = 0;

  constructor(options: GAWorldOptionsProp) {
    const mergedOptions = mergeOptionals(options, this.defaultOptions);
    this.options = mergedOptions;
    this.strategies = {
      crossoverStrategy: mergedOptions.crossoverStrategy(),
      fitnessStrategy: mergedOptions.fitnessStrategy(this),
      mutationStrategy: mergedOptions.mutationStrategy(),
      selectionStrategy: mergedOptions.selectionStrategy(this),
      spawnStrategy: mergedOptions.spawnStrategy(this),
    };

    this.population = this.strategies.spawnStrategy.spawn(
      this.options.populationSize
    );
  }

  nextGen() {
    const newPopulation: IGAIndividual[] = [];
    while (newPopulation.length < this.options.populationSize) {
      // Selection
      const [mother, father] = this.strategies.selectionStrategy.select();

      // Crossover
      const [offspring1, offspring2] =
        this.strategies.crossoverStrategy.crossover(mother, father);

      // Mutate the obtained individuals
      this.strategies.mutationStrategy.mutate(offspring1);
      this.strategies.mutationStrategy.mutate(offspring2);

      newPopulation.push(offspring1, offspring2);
    }

    const mergedPopulation = [...this.population, ...newPopulation];
    mergedPopulation.sort(
      (individualA, individualB) =>
        this.strategies.fitnessStrategy.getFitness(individualB) -
        this.strategies.fitnessStrategy.getFitness(individualA)
    );

    // resize the population
    mergedPopulation.length = this.options.populationSize;
    this.population = mergedPopulation;
    this.generationCount += 1;
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
