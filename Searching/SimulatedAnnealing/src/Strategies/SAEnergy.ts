import { ISimulatedAnnealing } from "../SimulatedAnnealing.ts";
import { IDatapoint } from "../interfaces.ts";

export type ISAEnergyGen = (data: ISimulatedAnnealing) => ISAEnergyStrategy;

export interface ISAEnergyStrategy {
  getEnergy(dataPoint: IDatapoint): number;
}

export class SAClosestToOriginEnergy implements ISAEnergyStrategy {
  getEnergy(dataPoint: IDatapoint): number {
    return Math.sqrt(
      dataPoint.data.getComponents().reduce((s, num) => s + num ** 2, 0)
    );
  }
}
