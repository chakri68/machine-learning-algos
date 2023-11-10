import { Vector } from "../../../../data-structures/Vector.ts";
import { ClimberState, IClimber } from "../Climber.ts";

export type DiscreteClimberOptions = {
  initPoint: Vector<number>;
  getNeighbours: (val: Vector<number>) => Vector<number>[];
};

export class DiscreteClimber implements IClimber {
  state: IClimber["state"];
  readonly options: Required<DiscreteClimberOptions>;

  constructor(
    private readonly getValue: (val: Vector<number>) => number,
    options: DiscreteClimberOptions
  ) {
    this.options = options;
    this.state = {
      bestSol: options.initPoint,
      bestValue: this.getValue(options.initPoint),
    };
  }

  optimize(): ClimberState {
    optimizeLoop: while (true) {
      const neighbours = this.options.getNeighbours(this.state.bestSol);
      for (const x of neighbours) {
        const val = this.getValue(x);
        if (val > this.state.bestValue) {
          this.state = {
            bestSol: x,
            bestValue: val,
          };
          continue optimizeLoop;
        }
      }
      // No better solution found
      return this.state;
    }
  }
}
