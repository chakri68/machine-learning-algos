import { ISimulatedAnnealing } from "../SimulatedAnnealing.ts";
import { IDatapoint } from "../interfaces.ts";

export type ISAProbabilityGen = (
  data: ISimulatedAnnealing
) => ISAProbabilityStrategy;

export interface ISAProbabilityStrategy {
  shouldSelect(dataPoint: IDatapoint): boolean;
  getProbability(dataPoint: IDatapoint): number;
}

export class SAProbability implements ISAProbabilityStrategy {
  constructor(private data: ISimulatedAnnealing) {}

  shouldSelect(dataPoint: IDatapoint): boolean {
    const rand = Math.random();

    const p = this.getProbability(dataPoint);
    return rand < p;
  }

  getProbability(dataPoint: IDatapoint): number {
    const e = this.data.state.energy;

    // TOOD: Get the energy if the dataPoint is selected
    const eNew = this.data.strategies.energy.getEnergy(dataPoint);

    // Get the temperature T
    const T = this.data.state.temperature;

    if (T <= 0) return eNew < e ? 1 : 0;

    // Return the probability as a function of energy and T using Kirkpatrick's equation
    // https://en.wikipedia.org/wiki/Simulated_annealing#:~:text=the%20method%20by-,Kirkpatrick,-et%20al.%2C%20the

    return eNew < e ? 1 : Math.pow(Math.E, -(eNew - e) / T);
  }
}
