import { Vector } from "../../../data-structures/Vector.ts";
import { getRandomElements } from "../../../utils/random.ts";
import { getMean, getVariance, sum } from "../../../utils/stats.ts";
import { OptionalObjectOf, mergeOptionals } from "../../../utils/ts.ts";

export type KMeansClusterOptions = {
  iterations?: number;
  k: number;
};

const defaultOptions: OptionalObjectOf<KMeansClusterOptions> = {
  iterations: 10,
};

export class KMeans {
  private data: Vector<number>[];
  public clusterData: {
    centers: Vector<number>[];
    clusters: Vector<number>[][];
  };
  private clusterOptions: Required<KMeansClusterOptions>;
  constructor(data: Vector<number>[], clusterOptions: KMeansClusterOptions) {
    this.clusterOptions = mergeOptionals(clusterOptions, defaultOptions);
    this.data = data.map((d) => d.clone()); // clone
    // Initialze Cluster Data
    const clusterCenters = this.chooseInitialClusters();
    const clusters = Array.from({ length: this.clusterOptions.k }, (_, idx) => [
      clusterCenters[idx],
    ]);
    this.clusterData = {
      centers: clusterCenters,
      clusters,
    };
    this.updateClusters();
  }

  cluster() {
    let bestVariance = this.clusterData.clusters.reduce((acc, curr) => {
      return acc + getVariance(curr);
    }, 0);
    let bestClustering = this.cloneClusterData();
    for (
      let iteration = 0;
      iteration < this.clusterOptions.iterations;
      iteration++
    ) {
      // Update cluster centers
      this.updateClusterCenters();

      // Update clusters
      this.updateClusters();

      // Check the variance
      const newVariance = this.clusterData.clusters.reduce(
        (acc, curr) => acc + getVariance(curr),
        0
      );
      if (newVariance < bestVariance) {
        bestVariance = newVariance;
        bestClustering = this.cloneClusterData();
      }
      // Print results
      this.printStats(iteration + 1, newVariance, this.getSilhouetteScore());
    }
  }

  private chooseInitialClusters(): Vector<number>[] {
    return getRandomElements(this.data, this.clusterOptions.k); // Random cluster centers
  }

  private updateClusters() {
    const newClusters: Vector<number>[][] = Array.from(
      { length: this.clusterOptions.k },
      () => []
    );
    for (const point of this.data) {
      const { index } = this.getClosestClusterIndex(point);
      newClusters[index].push(point);
    }

    this.clusterData.clusters = newClusters;
  }

  private updateClusterCenters() {
    // For each cluster, get the mean and set it as the center
    const { clusters } = this.clusterData;
    const newCenters: Vector<number>[] = Array.from({
      length: this.clusterOptions.k,
    });
    for (let clusterIdx = 0; clusterIdx < clusters.length; clusterIdx++) {
      newCenters[clusterIdx] = getMean(clusters[clusterIdx]);
    }
    this.clusterData.centers = newCenters;
  }

  private getClosestClusterIndex(point: Vector<number>) {
    let closestClusterIdx = 0;
    let minDistance = Vector.add(
      this.clusterData.centers[0],
      Vector.getNegativeVector(point)
    ).getMagnitude();
    for (let i = 1; i < this.clusterData.centers.length; i++) {
      const distance = Vector.add(
        this.clusterData.centers[i],
        Vector.getNegativeVector(point)
      ).getMagnitude();
      if (distance < minDistance) {
        minDistance = distance;
        closestClusterIdx = i;
      }
    }
    return { index: closestClusterIdx, distance: minDistance };
  }

  private getSilhouetteScore() {
    const { clusters } = this.clusterData;
    const coefficients = clusters
      .map((cluster, clusterIdx) =>
        cluster.map((point) => this.getSilhouetteCoefficient(point, clusterIdx))
      )
      .flat();
    return sum(...coefficients) / coefficients.length;
  }

  private getSilhouetteCoefficient(
    point: Vector<number>,
    interClusterIdx: number
  ) {
    const { clusters } = this.clusterData;

    // Intra-Cluster Distance
    const a =
      clusters[interClusterIdx].length === 1
        ? 0
        : this.getAverageDistance(
            point,
            interClusterIdx,
            clusters[interClusterIdx].length - 1
          );

    // Min Inter-Cluster Distance
    const b = Math.min(
      ...(clusters
        .map((_, idx) => {
          if (idx === interClusterIdx) return undefined;
          return this.getAverageDistance(point, idx);
        })
        .filter((avgDistance) => avgDistance !== undefined) as number[])
    );

    return (b - a) / Math.max(a, b);
  }

  private getAverageDistance(
    point: Vector<number>,
    clusterIdx: number,
    countOverride?: number
  ) {
    const { clusters } = this.clusterData;
    return (
      clusters[clusterIdx].reduce(
        (acc, curr) =>
          acc +
          Vector.add(point, Vector.getNegativeVector(curr)).getMagnitude(),
        0
      ) /
      (countOverride !== undefined
        ? countOverride
        : clusters[clusterIdx].length)
    );
  }

  private cloneClusterData() {
    return {
      centers: this.clusterData.centers.map((c) => c.clone()), // clone
      clusters: this.clusterData.clusters.map((c) => c.map((c) => c.clone())), // clone
    };
  }

  public printStats(
    iterationCount: number,
    variance: number,
    silhouetteScore: number
  ) {
    console.log(
      `
===== ITERATION ${iterationCount} =====
      Centers: (${this.clusterData.centers.join(", ")})
      Variance: ${variance}
      Silhouette Score: ${silhouetteScore}
    `
    );
  }
}
