import { getRandomNumber } from "../../../utils/random.ts";
import { GAGenome } from "../Genome.ts";
import { GAIndividual } from "../Individual.ts";
import { IGAGenome, IGAIndividual } from "../interfaces.ts";

export interface ICrossoverStrategy {
  crossover(
    mother: IGAIndividual,
    father: IGAIndividual
  ): [IGAIndividual, IGAIndividual];
}

export type ICrossoverStrategyGen = () => ICrossoverStrategy;

export class SinglePointCrossover implements ICrossoverStrategy {
  crossover(
    mother: IGAIndividual,
    father: IGAIndividual
  ): [IGAIndividual, IGAIndividual] {
    const crossoverPosition = getRandomNumber(1, mother.genome.seq.length - 1);
    const offspring1Genome: IGAGenome["seq"] = [];
    const offspring2Genome: IGAGenome["seq"] = [];

    // Generate genome for offspring1 -> Head from mother and tail from father
    offspring1Genome.push(...mother.genome.seq.slice(0, crossoverPosition));
    offspring1Genome.push(
      ...father.genome.seq.filter(
        (chromosome) => offspring1Genome.indexOf(chromosome) === -1
      )
    );

    // Generate genome for offspring2 -> Head from father and tail from mother
    offspring2Genome.push(...father.genome.seq.slice(0, crossoverPosition));
    offspring2Genome.push(
      ...mother.genome.seq.filter(
        (chromosome) => offspring2Genome.indexOf(chromosome) === -1
      )
    );
    return [
      new GAIndividual(new GAGenome(offspring1Genome)),
      new GAIndividual(new GAGenome(offspring2Genome)),
    ];
  }
}
