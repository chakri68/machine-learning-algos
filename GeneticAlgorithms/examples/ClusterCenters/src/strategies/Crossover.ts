import { getRandomNumber } from "../../../../../utils/random.ts";
import { CGAGneome, CGAPointIndex } from "../CGAGenome.ts";
import { CGAIndividual } from "../CGAIndividual.ts";
import { CGAWorld } from "../CGAWorld.ts";

export interface CGACrossoverStrategy {
  crossover(
    mother: CGAIndividual,
    father: CGAIndividual
  ): [CGAIndividual, CGAIndividual];
}

export type CGACrossoverStrategyGen = (world: CGAWorld) => CGACrossoverStrategy;

export class SinglePointCrossover implements CGACrossoverStrategy {
  constructor(private world: CGAWorld) {}

  crossover(
    mother: CGAIndividual,
    father: CGAIndividual
  ): [CGAIndividual, CGAIndividual] {
    const crossoverPosition = getRandomNumber(1, mother.genome.seq.length - 1);
    const offspring1Genome: CGAGneome["seq"] = [];
    const offspring2Genome: CGAGneome["seq"] = [];

    const motherGenomeClone = mother.genome.clone().seq;
    const fatherGenomeClone = father.genome.clone().seq;

    // Generate genome for offspring1 -> Head from mother and tail from father
    const motherPart1 = motherGenomeClone.slice(0, crossoverPosition);
    const fatherPart1 = fatherGenomeClone
      .slice(crossoverPosition)
      .filter(
        ({ idx }) =>
          offspring1Genome.findIndex(({ idx: idx1 }) => idx === idx1) === -1
      );
    while (fatherPart1.length < fatherGenomeClone.length - crossoverPosition) {
      const randomIdx = getRandomNumber(0, this.world.data.points.length);
      if (fatherPart1.findIndex(({ idx }) => idx === randomIdx) === -1) {
        fatherPart1.push(new CGAPointIndex(randomIdx));
      }
    }
    offspring1Genome.push(...motherPart1, ...fatherPart1);
    // Generate genome for offspring1 -> Head from mother and tail from father
    const fatherPart2 = fatherGenomeClone.slice(0, crossoverPosition);
    const motherPart2 = motherGenomeClone
      .slice(crossoverPosition)
      .filter(
        ({ idx }) =>
          offspring1Genome.findIndex(({ idx: idx1 }) => idx === idx1) === -1
      );
    while (motherPart2.length < motherGenomeClone.length - crossoverPosition) {
      const randomIdx = getRandomNumber(0, this.world.data.points.length);
      if (motherPart2.findIndex(({ idx }) => idx === randomIdx) === -1) {
        motherPart2.push(new CGAPointIndex(randomIdx));
      }
    }
    offspring2Genome.push(...motherPart2, ...fatherPart2);

    if (offspring1Genome.length === 4 || offspring2Genome.length === 4) {
      throw new Error("OMGGGGGG");
    }

    return [
      new CGAIndividual(new CGAGneome(offspring1Genome)),
      new CGAIndividual(new CGAGneome(offspring2Genome)),
    ];
  }
}
