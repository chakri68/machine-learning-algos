import { OptionalObjectOf, mergeOptionals } from "../../../utils/ts.ts";
import { ISAEnergyGen } from "./Strategies/SAEnergy.ts";
import { ISAProbabilityGen } from "./Strategies/SAProbability.ts";
import { ISASelectionGen } from "./Strategies/SASelection.ts";
import { ISATemperatureGen } from "./Strategies/SATemperature.ts";
import { IDatapoint } from "./interfaces.ts";

export type SAOptions = {
  maxIterations: number;
  dataset: IDatapoint[];
};

export type SAStrategies = {
  [K in keyof SAStartegiesGen]: ReturnType<SAStartegiesGen[K]>;
};

export type SAStartegiesGen = {
  selection: ISASelectionGen;
  probability: ISAProbabilityGen;
  temperature: ISATemperatureGen;
  energy: ISAEnergyGen;
};

export interface ISimulatedAnnealing {
  initialValues: { initPoint: IDatapoint; initTemp: number };
  terminationValues: {
    minTemp?: number;
    minIterations?: number;
  };
  options: Required<SAOptions>;
  strategies: Required<SAStrategies>;
  state: {
    iteration: number;
    temperature: number;
    energy: number;
    currPoint: IDatapoint;
  };
}

export class SimulatedAnnealing implements ISimulatedAnnealing {
  initialValues: ISimulatedAnnealing["initialValues"];
  terminationValues: ISimulatedAnnealing["terminationValues"];
  options: Required<SAOptions>;
  strategies: Required<SAStrategies>;
  state: ISimulatedAnnealing["state"];

  constructor(
    initialValues: ISimulatedAnnealing["initialValues"],
    terminationValues: ISimulatedAnnealing["terminationValues"],
    options: SAOptions,
    strategies: SAStartegiesGen
  ) {
    const defaultOptions: OptionalObjectOf<SAOptions> = {};
    this.options = mergeOptionals(options, defaultOptions);

    this.initialValues = initialValues;
    this.terminationValues = terminationValues;

    this.strategies = Object.fromEntries(
      Object.entries(strategies).map(([k, v]) => [k, v(this)])
    ) as SAStrategies;

    this.state = {
      currPoint: initialValues.initPoint,
      iteration: 0,
      energy: this.strategies.energy.getEnergy(initialValues.initPoint),
      temperature: initialValues.initTemp,
    };
  }

  start(callback: (data: ISimulatedAnnealing["state"]) => void = () => {}) {
    while (this.state.iteration < this.options.maxIterations) {
      this.state.iteration += 1;
      if (this.state.temperature > 0)
        this.state.temperature = this.strategies.temperature.getTemp();

      // Choose a random point
      const randomPoint = this.strategies.selection.selectOne();

      // Select it with some probability
      const shouldSelect =
        this.strategies.probability.shouldSelect(randomPoint);

      if (shouldSelect) {
        this.state.currPoint = randomPoint;
        this.state.energy = this.strategies.energy.getEnergy(randomPoint);
      }

      callback(this.state);
    }
  }
}
