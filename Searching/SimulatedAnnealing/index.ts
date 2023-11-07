import { Vector } from "../../data-structures/Vector.ts";
import { Datapoint } from "./src/Datapoint.ts";
import { SimulatedAnnealing } from "./src/SimulatedAnnealing.ts";
import { SAClosestToOriginEnergy } from "./src/Strategies/SAEnergy.ts";
import { SAProbability } from "./src/Strategies/SAProbability.ts";
import { SASelection } from "./src/Strategies/SASelection.ts";
import { SALinearAnnealing } from "./src/Strategies/SATemperature.ts";

console.log("RUNNING SIMULATED ANNEALING");

const dataPoints: Datapoint[] = [
  [1, 1],
  [1, 10],
  [10, 8],
  [3, 5],
  [10, 5],
].map((arr) => new Datapoint(new Vector(arr)));

const myAlgo = new SimulatedAnnealing(
  {
    initPoint: dataPoints[0],
    initTemp: 100,
  },
  {
    minIterations: 100,
    minTemp: 10,
  },
  {
    dataset: dataPoints,
    maxIterations: 150,
  },
  {
    energy: () => new SAClosestToOriginEnergy(),
    probability: (data) => new SAProbability(data),
    selection: (data) => new SASelection(data),
    temperature: (data) => new SALinearAnnealing(data),
  }
);

myAlgo.start((state) => {
  console.log({ state });
});
