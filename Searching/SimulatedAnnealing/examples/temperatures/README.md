# Finding minimum temperatures

In this example, we'll try to find the minimum temperature using Simulated Annealing

## Dataset

The json file with the data can be found [here](/data/temperatures.json)

It contains records of type

```ts
{
    LandAverageTemperature: number,
    dt: string,
}
```

## Running the algorithm

```bash
deno run ./index.ts > out.txt
```
