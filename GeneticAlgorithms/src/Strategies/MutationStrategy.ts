import { getRandomNumber } from "../../../utils/random.ts";
import { GAIndividual } from "../Individual.ts";
import { IGAIndividual } from "../interfaces.ts";

export interface IMutationStrategy {
  mutate(individual: IGAIndividual): void;
  mutate(individual: IGAIndividual, inPlace: false): IGAIndividual;
}

export type IMuationStrategyGen = (
  mutationChance?: number
) => IMutationStrategy;

export class RotateMutation implements IMutationStrategy {
  options: {
    mutationChance: number;
  };
  constructor(mutationChance: number = 0.5) {
    this.options = {
      mutationChance,
    };
  }

  mutate(individual: IGAIndividual): void;
  mutate(individual: IGAIndividual, inPlace: false): IGAIndividual;
  mutate(
    individual: IGAIndividual,
    inPlace: boolean = true
  ): IGAIndividual | void {
    if (inPlace) {
      const genomeSeq = individual.genome.seq;
      if (genomeSeq.length === 1)
        throw new Error("Genome length should NOT be 1");
      let swapEl1 = getRandomNumber(0, genomeSeq.length);
      let swapEl2 = getRandomNumber(0, genomeSeq.length);
      while (swapEl1 === swapEl2)
        swapEl2 = getRandomNumber(0, genomeSeq.length);
      if (swapEl1 > swapEl2) [swapEl1, swapEl2] = [swapEl2, swapEl1];
      const subGenome = genomeSeq.slice(swapEl1, swapEl2 + 1);
      subGenome.reverse();
      for (let i = swapEl1; i <= swapEl2; i++) {
        genomeSeq[i] = subGenome[i - swapEl1];
      }
    } else {
      const genomeClone = individual.genome.clone();
      const genomeSeq = genomeClone.seq;
      if (genomeSeq.length === 1)
        throw new Error("Genome length should NOT be 1");
      let swapEl1 = getRandomNumber(0, genomeSeq.length);
      let swapEl2 = getRandomNumber(0, genomeSeq.length);
      while (swapEl1 === swapEl2)
        swapEl2 = getRandomNumber(0, genomeSeq.length);
      if (swapEl1 > swapEl2) [swapEl1, swapEl2] = [swapEl2, swapEl1];
      const subGenome = genomeSeq.slice(swapEl1, swapEl2 + 1);
      subGenome.reverse();
      for (let i = swapEl1; i <= swapEl2; i++) {
        genomeSeq[i] = subGenome[i - swapEl1];
      }
      return new GAIndividual(genomeClone);
    }
  }
}
