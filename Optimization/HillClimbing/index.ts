import { Vector } from "../../data-structures/Vector.ts";
import { ContinuousClimber } from "./src/ContinuousClimber/index.ts";

const continuousClimber = new ContinuousClimber(
  (val) => {
    const [x, y] = val.getComponents();
    return -(x ** 2 + (y - 2) ** 2);
  },
  {
    acceleration: 1.5,
    initVal: new Vector([0, 0]),
    minScoreChange: 10e-5,
    minStepSize: 10e-5,
  }
);

console.log(continuousClimber.optimize());
