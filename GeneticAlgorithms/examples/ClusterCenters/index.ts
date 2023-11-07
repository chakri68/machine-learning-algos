import { Vector } from "../../../data-structures/Vector.ts";
import { CGAWorld } from "./src/CGAWorld.ts";
import { SinglePointCrossover } from "./src/Strategies/Crossover.ts";
import {
  SilhouetteFitness,
  VarianceFitness,
} from "./src/Strategies/Fitness.ts";
import { RandomReplacement } from "./src/Strategies/Mutation.ts";
import { BiasedRouletteSelection } from "./src/Strategies/Selection.ts";
import { RandomSpawn } from "./src/Strategies/Spawn.ts";

const world = new CGAWorld(
  {
    k: 3,
    points: [
      [2, 3, 1],
      [4, 6, 2],
      [6, 7, 2],
      [8, 5, 3],
      [3, 4, 1],
      [5, 6, 2],
      [7, 4, 3],
      [4, 5, 1],
      [6, 4, 2],
      [8, 6, 3],
    ].map((d) => new Vector(d)),
    iterations: 3,
  },
  {
    populationSize: 10,
    maxIterations: 5,
  },
  {
    crossoverStrategy: (world) => new SinglePointCrossover(world),
    mutationStrategy: (world, k) => new RandomReplacement(world, k),
    selectionStrategy: (world) => new BiasedRouletteSelection(world),
    fitnessStrategy: (world) => new SilhouetteFitness(world),
    spawnStrategy: (world) => new RandomSpawn(world),
  }
);

// 5 4 3 0 6 2 1 with fitness 24.027034440297378

world.start();
