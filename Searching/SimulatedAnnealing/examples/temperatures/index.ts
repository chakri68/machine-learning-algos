import { Vector } from "../../../../data-structures/Vector.ts";
import { Datapoint } from "../../src/Datapoint.ts";
import { SimulatedAnnealing } from "../../src/SimulatedAnnealing.ts";
import { ISAEnergyStrategy } from "../../src/Strategies/SAEnergy.ts";
import { SAProbability } from "../../src/Strategies/SAProbability.ts";
import { SASelection } from "../../src/Strategies/SASelection.ts";
import { SALinearAnnealing } from "../../src/Strategies/SATemperature.ts";
import { IDatapoint } from "../../src/interfaces.ts";

const dataset = JSON.parse(
  Deno.readTextFileSync("../../../../data/temperatures.json")
) as {
  LandAverageTemperature: number;
  dt: string;
}[];

export class SALowestTemp implements ISAEnergyStrategy {
  getEnergy(dataPoint: IDatapoint): number {
    return dataPoint.data.getComponents()[1];
  }
}

const data = dataset.map(
  ({ LandAverageTemperature, dt }) =>
    new Datapoint(new Vector([new Date(dt).getTime(), LandAverageTemperature]))
);

const myAlgo = new SimulatedAnnealing(
  {
    initPoint: data[0],
    initTemp: 150,
  },
  {
    minIterations: 100,
    minTemp: 10,
  },
  {
    dataset: data,
    maxIterations: 500,
  },
  {
    energy: () => new SALowestTemp(),
    probability: (data) => new SAProbability(data),
    selection: (data) => new SASelection(data),
    temperature: (data) => new SALinearAnnealing(data),
  }
);

myAlgo.start((state) => {
  console.log(state.currPoint.data.getComponents());
});

console.log();
console.log({ RESULT: myAlgo.state });
