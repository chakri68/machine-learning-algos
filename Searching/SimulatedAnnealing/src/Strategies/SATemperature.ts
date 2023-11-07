import { ISimulatedAnnealing } from "../SimulatedAnnealing.ts";

export type ISATemperatureGen = (data: ISimulatedAnnealing) => ISATemperature;

export interface ISATemperature {
  getTemp(): number;
}

export class SABoltzmannAnnealing implements ISATemperature {
  constructor(private data: ISimulatedAnnealing) {}

  getTemp(): number {
    const T0 = this.data.initialValues.initTemp;
    const iteration = this.data.state.iteration;

    return T0 / (1 + Math.log(1 + iteration));
  }
}

export class SALinearAnnealing implements ISATemperature {
  constructor(private data: ISimulatedAnnealing) {}

  getTemp(): number {
    const T0 = this.data.initialValues.initTemp;
    const iteration = this.data.state.iteration;

    return T0 - iteration;
  }
}
