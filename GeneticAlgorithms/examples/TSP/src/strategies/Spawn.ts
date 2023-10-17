import { shuffleArray } from "../../../../../utils/random.ts";
import { TSPGenome } from "../TSPGenome.ts";
import { TSPIndividual } from "../TSPIndividual.ts";
import { TSPWorld } from "../TSPWorld.ts";

export interface TSPSpawnStrategy {
  world: TSPWorld;
  spawn(n: number): TSPIndividual[];
}

export type TSPSpawnStrategyGen = (world: TSPWorld) => TSPSpawnStrategy;

export class RandomSpawn implements TSPSpawnStrategy {
  constructor(public world: TSPWorld) {}

  spawn(n: number): TSPIndividual[] {
    const randomSequences = [];
    for (let i = 0; i < n; i++)
      randomSequences.push(
        shuffleArray(
          Array.from({ length: this.world.cities.length }, (_, idx) => idx)
        )
      );

    return randomSequences.map((seq) => new TSPIndividual(new TSPGenome(seq)));
  }
}
