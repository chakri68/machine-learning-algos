import { getNRandomNumbers } from "../../../../../utils/random.ts";
import { CGAGneome } from "../CGAGenome.ts";
import { CGAIndividual } from "../CGAIndividual.ts";
import { CGAWorld } from "../CGAWorld.ts";

export interface CGASpawnStrategy {
  world: CGAWorld;
  spawn(n: number): CGAIndividual[];
}

export type CGASpawnStrategyGen = (world: CGAWorld) => CGASpawnStrategy;

export class RandomSpawn implements CGASpawnStrategy {
  constructor(public world: CGAWorld) {}

  spawn(n: number): CGAIndividual[] {
    // Selecting n different sets of k points
    const nRandomKCenters: CGAIndividual[] = [];
    for (let i = 0; i < n; i++) {
      // select K random points from the input points
      const randomPoints = getNRandomNumbers(
        0,
        this.world.data.points.length,
        this.world.data.k
      );
      nRandomKCenters.push(new CGAIndividual(new CGAGneome(randomPoints)));
    }

    return nRandomKCenters;
  }
}
