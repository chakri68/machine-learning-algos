import { GAWorld, GAWorldOptionsProp } from "../../../src/GA.ts";
import { IGAWorld } from "../../../src/interfaces.ts";
import { TSPWorldState } from "./interfaces.ts";

export class TSPWorld
  extends GAWorld<TSPWorldState>
  implements IGAWorld<TSPWorldState>
{
  constructor(
    initData: TSPWorldState,
    options: GAWorldOptionsProp<TSPWorldState>
  ) {
    super(initData, options);
  }
}
