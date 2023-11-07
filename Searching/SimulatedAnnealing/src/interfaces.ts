import { Vector } from "../../../data-structures/Vector.ts";
import { IClonable } from "../../../utils/interfaces/IClonable.ts";

export interface IDatapoint extends IClonable {
  data: Vector<number>;
}

export interface IDataset extends IClonable {
  data: IDatapoint[];
  // TODO: Maybe add some more things here
}
