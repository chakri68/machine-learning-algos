import { getRandomNumber } from "../../../../../utils/random.ts";
import { CGAPointIndex } from "../CGAGenome.ts";
import { CGAIndividual } from "../CGAIndividual.ts";
import { CGAWorld } from "../CGAWorld.ts";

export interface CGAMutationStrategy {
  mutate(individual: CGAIndividual): void;
  mutate(individual: CGAIndividual, inPlace: false): CGAIndividual;
}

export type CGAMutationStrategyGen = (
  world: CGAWorld,
  mutationChance?: number
) => CGAMutationStrategy;

export class RandomReplacement implements CGAMutationStrategy {
  options: {
    mutationChance: number;
  };
  constructor(
    private world: CGAWorld,
    mutationChance: number = 0.5
  ) {
    this.options = {
      mutationChance,
    };
  }

  mutate(individual: CGAIndividual): void;
  mutate(individual: CGAIndividual, inPlace: false): CGAIndividual;
  mutate(
    individual: CGAIndividual,
    inPlace: boolean = true
  ): CGAIndividual | void {
    if (inPlace) {
      if (Math.random() > this.options.mutationChance) return;
      // Randomly select a point from the dataset
      const randomIdx = this.getRandomPointIdx(individual);
      // Randomly select the index to replace the point at
      const randomIdxToBeReplaced = getRandomNumber(
        0,
        individual.genome.seq.length
      );
      // Replace!
      individual.genome.seq[randomIdxToBeReplaced] = new CGAPointIndex(
        randomIdx
      );
    }
  }

  private getRandomPointIdx(individual: CGAIndividual) {
    let randomIdx = getRandomNumber(0, this.world.data.points.length);
    while (
      individual.genome.seq.findIndex(({ idx }) => idx === randomIdx) !== -1
    )
      randomIdx = getRandomNumber(0, this.world.data.points.length);
    return randomIdx;
  }
}
