import { Vector } from "../../../data-structures/Vector.ts";
import { NonDominatedSorting } from "./src/NonDominatedSorting.ts";

console.log(
  NonDominatedSorting(
    [
      [1, 1],
      [1, 2],
      [3, 1],
      [2, 3],
      [4, 2],
    ].map((arr) => new Vector(arr)),
    [(a, b) => a < b, (a, b) => a < b]
  )
);
