import { Vector } from "../../../data-structures/Vector.ts";
import { getRandomElements } from "../../../utils/random.ts";
import { getMean } from "../../../utils/stats.ts";
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
    this.data = structuredClone(data);
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
    for (
      let iteration = 0;
      iteration < this.clusterOptions.iterations;
      iteration++
    ) {
      // Update cluster centers
      this.updateClusterCenters();

      // Update clusters
      this.updateClusters();

      // Print results
      this.printStats(iteration + 1);
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
    const { centers, clusters } = this.clusterData;
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

  public printStats(iterationCount: number) {
    console.log(
      `
===== ITERATION ${iterationCount} =====
      centers: (${this.clusterData.centers.join(", ")})
    `
    );
  }
}
