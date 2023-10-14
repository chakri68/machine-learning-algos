import { Vector } from "../../data-structures/Vector.ts";
import { getVariance } from "../../utils/stats.ts";
import { KMeans, KMeansClusterOptions } from "./src/KMeans.ts";

// Define some sample data points as vectors
const data: Vector<number>[] = [
  [2, 3, 1],
  [4, 6, 2],
  [6, 7, 2],
  [8, 5, 3],
  [3, 4, 1],
  [5, 6, 2],
  [7, 4, 3],
  [4, 5, 1],
  [6, 4, 2],
  [8, 6, 3],
].map((d) => new Vector(d));

// Define the clustering options
const clusterOptions: KMeansClusterOptions = {
  k: 3, // Number of clusters
  iterations: 10, // Optional, number of iterations (default is 10)
};

// Create a KMeans instance and cluster the data
const kmeans = new KMeans(data, clusterOptions);
kmeans.cluster();

// You can access the cluster centers and clusters after clustering
const clusterCenters = kmeans.clusterData.centers;
const clusters = kmeans.clusterData.clusters;

console.log("Cluster Centers:");
console.log(clusterCenters);

console.log("Clusters:");
for (let i = 0; i < clusters.length; i++) {
  console.log(`Cluster ${i + 1}:`);
  console.log(clusters[i]);
}

console.log("Variance:");
console.log(clusters.reduce((acc, curr) => acc + getVariance(curr), 0));
