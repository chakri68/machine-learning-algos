import { Vector } from "../../../../data-structures/Vector.ts";

export type Comparator<T> = (a: T, b: T) => boolean;

export function dominates<T extends Vector<number>>(
  a: T,
  b: T,
  comparator: Comparator<number>[]
) {
  const aComponents = a.getComponents();
  const bComponents = b.getComponents();

  let dominatingComponentFound = false;
  for (
    let componentIdx = 0;
    componentIdx < aComponents.length;
    componentIdx++
  ) {
    const aComponent = aComponents[componentIdx];
    const bComponent = bComponents[componentIdx];

    // Strictly more
    const isMoreFit =
      comparator[componentIdx](aComponent, bComponent) &&
      aComponent !== bComponent;
    if (isMoreFit) {
      dominatingComponentFound = true;
    } else if (!isMoreFit && aComponent !== bComponent) {
      return false;
    }
  }

  return dominatingComponentFound;
}

export function NonDominatedSorting<T extends Vector<number>>(
  solutions: T[],
  comparator: Comparator<number>[]
) {
  // Generate the map
  const solutionMap: {
    dominatedBy: number;
    dominates: Set<number>;
  }[] = Array.from({ length: solutions.length }, () => ({
    dominatedBy: 0,
    dominates: new Set(),
  }));

  for (let i = 0; i < solutions.length; i++) {
    const a = solutions[i];
    const aMap = solutionMap[i];
    for (let j = 0; j < solutions.length; j++) {
      if (i === j) continue;
      const b = solutions[j];
      const bMap = solutionMap[j];
      if (dominates(a, b, comparator)) {
        aMap.dominates.add(j);
        bMap.dominatedBy += 1;
      }
    }
  }

  //   console.log({ solutionMap });

  // Work on the generated map to generate the fronts
  const parsedSols = new Set<number>();
  const fronts: T[][] = [];

  while (parsedSols.size !== solutionMap.length) {
    // Pop from the map the solutions that are not dominated by anything else
    const frontIndicesToPush = new Set<number>();
    for (let i = 0; i < solutionMap.length; i++) {
      const { dominatedBy } = solutionMap[i];
      if (dominatedBy === 0 && !parsedSols.has(i)) frontIndicesToPush.add(i);
    }

    // console.log({ frontIndicesToPush, solutionMap });

    const frontsToPush = [];
    // Pop the solutions
    for (const solIdx of frontIndicesToPush.values()) {
      for (const idx of solutionMap[solIdx].dominates.values()) {
        solutionMap[idx].dominatedBy -= 1;
      }
      parsedSols.add(solIdx);
      frontsToPush.push(solutions[solIdx]);
    }

    fronts.push(frontsToPush);
  }

  return fronts;
}
