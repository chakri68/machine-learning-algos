export class Vector<T extends number> {
  protected data: T[];
  constructor(data: T[] = []) {
    this.data = [...data];
  }

  getComponents(): number[] {
    return this.data;
  }

  getMagnitude(): number {
    return Math.sqrt(Vector.dot(this, this));
  }

  getUnitVector(): Vector<T> {
    const magnitude = this.getMagnitude();
    return new Vector(
      this.data.map((component) => component / magnitude)
    ) as Vector<T>;
  }

  print(): void {
    console.log(this);
  }

  clone(): Vector<number> {
    return new Vector(this.data);
  }

  toString(): string {
    return `Vector2<${this.data.join(", ")}>`;
  }

  static dot(a: Vector<number>, b: Vector<number>): number {
    const aComponents = a.getComponents();
    const bComponents = b.getComponents();

    const result = aComponents.reduce((acc, curr: number, idx) => {
      return acc + curr * bComponents[idx];
    }, 0);

    return result;
  }

  static scale(a: Vector<number>, scaleFactor: number): Vector<number> {
    const components = [...a.data];
    for (let i = 0; i < components.length; i++) {
      components[i] *= scaleFactor;
    }
    return new Vector(components);
  }

  static add(...vectors: Vector<number>[]): Vector<number> {
    const sum = Array.from({ length: vectors[0].data.length }, () => 0);
    for (const vector of vectors) {
      for (let i = 0; i < vector.data.length; i++) {
        sum[i] += vector.data[i];
      }
    }

    return new Vector(sum);
  }

  static getNegativeVector(a: Vector<number>) {
    const components = [...a.data];
    return new Vector(components.map((component) => -component));
  }
}
