import { Vector } from "../../data-structures/Vector.ts";
import { KMeans, KMeansClusterOptions } from "./src/KMeans.ts";

// Define some sample data points as vectors
const data: Vector<number>[] = [
  new Vector([1, 2]),
  new Vector([2, 3]),
  new Vector([8, 7]),
  new Vector([9, 8]),
  new Vector([1, 1]),
  new Vector([7, 6]),
];

// Define the clustering options
const clusterOptions: KMeansClusterOptions = {
  k: 2, // Number of clusters
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
