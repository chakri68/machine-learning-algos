import { shuffleArray } from "../../../../../utils/random.ts";
import { GAGenome } from "../../../../src/Genome.ts";
import { GAIndividual } from "../../../../src/Individual.ts";
import { ISpawnStrategy } from "../../../../src/Strategies/SpawnStrategy.ts";
import { IGAIndividual, IGAWorld } from "../../../../src/interfaces.ts";
import { TSPWorldState } from "../interfaces.ts";

export class RandomSpawn implements ISpawnStrategy {
  constructor(private world: IGAWorld<TSPWorldState>) {}

  spawn(n: number): IGAIndividual[] {
    const randomSequences = [];
    for (let i = 0; i < n; i++)
      randomSequences.push(
        shuffleArray(
          Array.from({ length: this.world.data.cities.length }, (_, idx) => idx)
        )
      );

    return randomSequences.map((seq) => new GAIndividual(new GAGenome(seq)));
  }
}
