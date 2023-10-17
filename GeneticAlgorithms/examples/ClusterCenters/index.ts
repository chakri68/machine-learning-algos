import { SinglePointCrossover } from "../../src/Strategies/CrossoverStrategy.ts";
import { RotateMutation } from "../../src/Strategies/MutationStrategy.ts";
import { BiasedRouletteSelection } from "../../src/Strategies/SelectionStrategy.ts";
import { TSPWorld } from "./src/TSPWorld.ts";
import { EuclideanFitness } from "./src/strategies/Fitness.ts";
import { RandomSpawn } from "./src/strategies/Spawn.ts";

const cities: [number, number][] = [
  [1, 10], // 0
  [4, 5], // 1
  [6, 9], // 2
  [2, 4], // 3
  [1, 2], // 4
  [1, 1], // 5
  [3, 9], // 6
];

const world = new TSPWorld(
  {
    cities: cities.map((city) => ({
      location: city,
    })),
  },
  {
    crossoverStrategy: () => new SinglePointCrossover(),
    fitnessStrategy: (world) => new EuclideanFitness(world),
    mutationStrategy: () => new RotateMutation(),
    selectionStrategy: (world) => new BiasedRouletteSelection(world),
    spawnStrategy: (world) => new RandomSpawn(world),
    maxIterations: 10,
    populationSize: 20,
  }
);

// 5 4 3 0 6 2 1 with fitness 24.027034440297378

world.start();
