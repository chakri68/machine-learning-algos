import { KMeans } from "../../../../../Clustering/KMeans/src/KMeans.ts";
import { CGAIndividual } from "../CGAIndividual.ts";
import { CGAWorld } from "../CGAWorld.ts";

export interface CGAFitnessStrategy {
  world: CGAWorld;
  getFitness(individual: CGAIndividual): number;
}

export type CGAFitnessStrategyGen = (world: CGAWorld) => CGAFitnessStrategy;

export class VarianceFitness implements CGAFitnessStrategy {
  constructor(public world: CGAWorld) {}

  // Lower Variance better the clustering, higher the fitness
  getFitness(individual: CGAIndividual): number {
    // Run the KMeans algorithm with the given set of initial centers to get the variance
    const kmeans = new KMeans(this.world.data.points, {
      k: this.world.data.k,
      iterations: this.world.data.iterations,
      initialCluster: individual.genome.seq.map(
        ({ idx }) => this.world.data.points[idx]
      ),
    });

    kmeans.cluster();

    return -kmeans.getVariance();
  }
}

export class SilhouetteFitness implements CGAFitnessStrategy {
  constructor(public world: CGAWorld) {}

  // higher the score, higher the fitness
  getFitness(individual: CGAIndividual): number {
    // Run the KMeans algorithm with the given set of initial centers to get the silhouette score
    const kmeans = new KMeans(this.world.data.points, {
      k: this.world.data.k,
      iterations: this.world.data.iterations,
      initialCluster: individual.genome.seq.map(
        ({ idx }) => this.world.data.points[idx]
      ),
    });

    kmeans.cluster();

    return kmeans.getSilhouetteScore();
  }
}
