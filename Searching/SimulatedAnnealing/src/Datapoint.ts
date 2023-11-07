import { Vector } from "../../../data-structures/Vector.ts";
import { IDatapoint } from "./interfaces.ts";

export class Datapoint implements IDatapoint {
  data: Vector<number>;

  constructor(data: Vector<number>) {
    this.data = data.clone();
  }

  clone(): this {
    return new Datapoint(this.data.clone()) as this;
  }
}
