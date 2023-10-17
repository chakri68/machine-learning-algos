import { getRandomNumber } from "../../../../../utils/random.ts";
import { TSPGenome } from "../TSPGenome.ts";
import { TSPIndividual } from "../TSPIndividual.ts";

export interface TSPCrossoverStrategy {
  crossover(
    mother: TSPIndividual,
    father: TSPIndividual
  ): [TSPIndividual, TSPIndividual];
}

export type TSPCrossoverStrategyGen = () => TSPCrossoverStrategy;

export class SinglePointCrossover implements TSPCrossoverStrategy {
  crossover(
    mother: TSPIndividual,
    father: TSPIndividual
  ): [TSPIndividual, TSPIndividual] {
    const crossoverPosition = getRandomNumber(1, mother.genome.seq.length - 1);
    const offspring1Genome: TSPGenome["seq"] = [];
    const offspring2Genome: TSPGenome["seq"] = [];

    const motherGenomeClone = mother.genome.clone().seq;
    const fatherGenomeClone = father.genome.clone().seq;

    // Generate genome for offspring1 -> Head from mother and tail from father
    offspring1Genome.push(...motherGenomeClone.slice(0, crossoverPosition));
    offspring1Genome.push(
      ...fatherGenomeClone.filter(
        ({ idx }) =>
          offspring1Genome.findIndex(({ idx: idx1 }) => idx === idx1) === -1
      )
    );

    // Generate genome for offspring2 -> Head from father and tail from mother
    offspring2Genome.push(...fatherGenomeClone.slice(0, crossoverPosition));
    offspring2Genome.push(
      ...motherGenomeClone.filter(
        ({ idx }) =>
          offspring2Genome.findIndex(({ idx: idx1 }) => idx === idx1) === -1
      )
    );
    return [
      new TSPIndividual(new TSPGenome(offspring1Genome)),
      new TSPIndividual(new TSPGenome(offspring2Genome)),
    ];
  }
}
