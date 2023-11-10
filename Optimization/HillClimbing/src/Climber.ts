import { Vector } from "../../../data-structures/Vector.ts";

export type ClimberState = {
  bestSol: Vector<number>;
  bestValue: number;
};

export interface IClimber {
  state: ClimberState;

  optimize(): ClimberState;
}
