import { IDatapoint } from "../interfaces.ts";
import * as rand from "../../../../utils/random.ts";
import { ISimulatedAnnealing } from "../SimulatedAnnealing.ts";

export interface ISASelectionStrategy {
  selectOne(): IDatapoint;
  selectMany(n: number): IDatapoint[];
}

export type ISASelectionGen = (
  data: ISimulatedAnnealing
) => ISASelectionStrategy;

export class SASelection implements ISASelectionStrategy {
  constructor(private readonly data: ISimulatedAnnealing) {}

  selectOne(): IDatapoint {
    // Select one random point from the dataset
    return rand.getRandomElements(this.data.options.dataset, 1)[0];
  }

  selectMany(n: number): IDatapoint[] {
    // Select n points
    return rand.getRandomElements(this.data.options.dataset, n);
  }
}
