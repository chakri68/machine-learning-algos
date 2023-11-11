import {
  Comparator,
  PriorityQueue,
} from "../../../data-structures/PriorityQueue.ts";

export class FixedLengthPriorityQueue<T> extends PriorityQueue<T> {
  private _maxSize: number;

  constructor(
    comparator: Comparator<T> = (a, b) => a > b,
    maxSize: number = Infinity
  ) {
    super(comparator);
    this._maxSize = maxSize;
  }

  push(...values: T[]): number {
    super.push(...values);
    super._heap.length = this._maxSize;
    return this._maxSize;
  }
}
