import { SinglePointCrossover } from "./src/Strategies/Crossover.ts";
import { RotateMutation } from "./src/Strategies/Mutation.ts";
import { BiasedRouletteSelection } from "./src/Strategies/Selection.ts";
import { TSPWorld } from "./src/TSPWorld.ts";
import { EuclideanFitness } from "./src/Strategies/Fitness.ts";
import { RandomSpawn } from "./src/Strategies/Spawn.ts";

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
    populationSize: 10,
  },
  {
    crossoverStrategy: () => new SinglePointCrossover(),
    mutationStrategy: () => new RotateMutation(),
    selectionStrategy: (world) => new BiasedRouletteSelection(world),
    fitnessStrategy: (world) => new EuclideanFitness(world),
    spawnStrategy: (world) => new RandomSpawn(world),
  }
);

// 5 4 3 0 6 2 1 with fitness 24.027034440297378

world.start();
