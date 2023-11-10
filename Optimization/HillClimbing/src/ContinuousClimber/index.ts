import { Vector } from "../../../../data-structures/Vector.ts";
import { OptionalObjectOf, mergeOptionals } from "../../../../utils/ts.ts";
import { ClimberState, IClimber } from "../Climber.ts";

export type ContinuousClimberOptions = {
  initVal: Vector<number>;
  initStepSize?: Vector<number>;
  maxIterations?: number;
  minStepSize?: number;
  acceleration: number;
  minScoreChange: number;
};

export type ContinuousClimberState = {
  stepSizes: number[];
} & ClimberState;

export class ContinuousClimber implements IClimber {
  state: ContinuousClimberState;
  options: Required<ContinuousClimberOptions>;

  constructor(
    private getValue: (val: Vector<number>) => number,
    options: ContinuousClimberOptions
  ) {
    const defaultOptions: OptionalObjectOf<ContinuousClimberOptions> = {
      initStepSize: new Vector(
        Array.from({ length: options.initVal.getComponents().length }, () => 1)
      ),
      maxIterations: 1000,
      minStepSize: 10e-4,
    };
    this.options = mergeOptionals(options, defaultOptions);

    this.state = {
      bestSol: this.options.initVal,
      bestValue: this.getValue(this.options.initVal),
      stepSizes: this.options.initStepSize.getComponents(),
    };
  }

  optimize(): ContinuousClimberState {
    const variations = [
      this.options.acceleration,
      -this.options.acceleration,
      1 / this.options.acceleration,
      -1 / this.options.acceleration,
    ];

    let iterationCount = 0;

    iterationLoop: while (iterationCount < this.options.maxIterations) {
      iterationCount += 1;
      const beforeSol = this.state.bestSol;
      const beforeScore = this.state.bestValue;
      const components = beforeSol.getComponents();

      for (let i = 0; i < components.length; i++) {
        // For each dimension check if any of the variations produces better results
        let bestStep = 0;
        let bestScore = this.state.bestValue;

        if (Math.abs(this.state.stepSizes[i]) < this.options.minStepSize)
          continue;

        for (const variation of variations) {
          const step = variation * this.state.stepSizes[i];

          // Check if this new step size makes the solution better
          const newScore = this.getValue(
            new Vector(
              Array.from({ length: components.length }, (_, idx) =>
                idx === i ? components[idx] + step : components[idx]
              )
            )
          );

          //   console.log({
          //     step,
          //     newScore,
          //     vector: new Vector(
          //       Array.from({ length: components.length }, (_, idx) =>
          //         idx === i ? components[idx] + step : components[idx]
          //       )
          //     ),
          //   });

          if (newScore > bestScore) {
            bestStep = step;
            bestScore = newScore;
          }
        }

        // console.log({ beforeSol, bestStep, bestScore });

        if (bestStep === 0) {
          //   console.log("NO BEST SOLUTION FOUND");
          this.state.stepSizes[i] /= this.options.acceleration;
          continue iterationLoop;
        } else {
          // Found a better solution with one of the variations
          this.state.stepSizes[i] = bestStep;
          this.state.bestSol = new Vector(
            Array.from({ length: components.length }, (_, idx) =>
              idx === i ? components[idx] + bestStep : components[idx]
            )
          );
          this.state.bestValue = bestScore;
          //   console.log("UPDATED SCORE", this.state);
        }
      }
      //   console.log(this.state.bestValue - beforeScore);
      //   console.log({ stepSizes: this.state.stepSizes });
      if (this.state.bestValue - beforeScore < this.options.minScoreChange) {
        // console.log("MIN SCORE CHANGE");
        break iterationLoop;
      }
    }
    // console.log("MAX ITERATIONS");
    return this.state;
  }
}
