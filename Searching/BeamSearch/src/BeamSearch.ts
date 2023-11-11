import { assertOrThrow } from "../../../utils/ts.ts";
import { FixedLengthPriorityQueue } from "./FixedSizePQ.ts";

export type BeamSearchOptions<T> = {
  searchSpace: T[];
  beamWidth: number;
  heuristic: (node: T) => number;
  getNeighbours: (node: T) => T[];
};

/**
 * This is a search that uses only the heuristic function to explore the search space
 */
export class BeamSearch<T> {
  private options: Required<BeamSearchOptions<T>>;

  constructor(options: BeamSearchOptions<T>) {
    this.options = options;
  }

  start() {
    const {
      beamWidth: B,
      getNeighbours: N,
      heuristic: h,
      searchSpace: S,
    } = this.options;

    const searchQueue = new FixedLengthPriorityQueue<T>(
      (a, b) => h(a) < h(b),
      B
    );

    const visitedNodes = new Set();

    const startNode = S[0];
    searchQueue.push(startNode);

    let bestH = Infinity;

    while (!searchQueue.isEmpty()) {
      const node = assertOrThrow(searchQueue.pop());
      const hVal = h(node);
      if (hVal < bestH) bestH = hVal;
      visitedNodes.add(node);

      const neighbouringNodes = N(node);
      for (const n of neighbouringNodes) {
        if (visitedNodes.has(n)) continue;
        searchQueue.push(n);
      }
    }

    return bestH;
  }
}
