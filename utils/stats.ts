import { Vector } from "../data-structures/Vector.ts";

export function getMean(data: Vector<number>[]) {
  return Vector.scale(Vector.add(...data), 1 / data.length);
}

export function getVariance(data: number[]): number;
export function getVariance(data: Vector<number>[]): number;

export function getVariance(data: number[] | Vector<number>[]): number {
  const n = data.length;
  if (n === 0) throw new Error("data is empty");

  if (isNumberArray(data)) {
    const mean = sum(...data) / n;
    const variance =
      data.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / n;
    return variance;
  } else {
    const dimensions = data[0].getComponents().length;
    const dimensionMeans = new Array(dimensions).fill(0);

    // Calculate means for each dimension
    for (let dimension = 0; dimension < dimensions; dimension++) {
      dimensionMeans[dimension] =
        sum(...data.map((vector) => vector.getComponents()[dimension])) / n;
    }

    // Calculate variance using dimensionMeans
    const variance =
      data.reduce((acc, vector) => {
        const squaredDiff = vector
          .getComponents()
          .map(
            (component, dimension) =>
              (component - dimensionMeans[dimension]) ** 2
          );
        return acc + sum(...squaredDiff);
      }, 0) / n;

    return variance;
  }
}

export function sum(...data: number[]) {
  return data.reduce((acc, curr) => acc + curr, 0);
}

function isNumberArray(value: any): value is number[] {
  return typeof value[0] === "number";
}
