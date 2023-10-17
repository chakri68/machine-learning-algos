import { getRandomNumber } from "../../../../../utils/random.ts";
import { TSPIndividual } from "../TSPIndividual.ts";

export interface TSPMutationStrategy {
  mutate(individual: TSPIndividual): void;
  mutate(individual: TSPIndividual, inPlace: false): TSPIndividual;
}

export type TSPMutationStrategyGen = (
  mutationChance?: number
) => TSPMutationStrategy;

export class RotateMutation implements TSPMutationStrategy {
  options: {
    mutationChance: number;
  };
  constructor(mutationChance: number = 0.5) {
    this.options = {
      mutationChance,
    };
  }

  mutate(individual: TSPIndividual): void;
  mutate(individual: TSPIndividual, inPlace: false): TSPIndividual;
  mutate(
    individual: TSPIndividual,
    inPlace: boolean = true
  ): TSPIndividual | void {
    if (inPlace) {
      const mutate = Math.random() < this.options.mutationChance ? true : false;
      if (!mutate) return;
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
      const mutate = Math.random() < this.options.mutationChance ? true : false;
      if (!mutate) return individual;
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
      return new TSPIndividual(genomeClone);
    }
  }
}
