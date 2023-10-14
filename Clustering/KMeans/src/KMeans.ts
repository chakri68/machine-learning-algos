import { Vector } from "../../../data-structures/Vector.ts";
import { getRandomElements } from "../../../utils/random.ts";
import { getMean, getVariance } from "../../../utils/stats.ts";
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
      this.printStats(iteration + 1, newVariance);
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

  private cloneClusterData() {
    return {
      centers: this.clusterData.centers.map((c) => c.clone()), // clone
      clusters: this.clusterData.clusters.map((c) => c.map((c) => c.clone())), // clone
    };
  }

  public printStats(iterationCount: number, variance: number) {
    console.log(
      `
===== ITERATION ${iterationCount} =====
      centers: (${this.clusterData.centers.join(", ")})
      variance: ${variance}
    `
    );
  }
}
