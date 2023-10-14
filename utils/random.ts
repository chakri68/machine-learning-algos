export function shuffleArray<T>(arr: T[]): T[] {
  let currentIndex = arr.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

export function getRandomElements<T>(arr: T[], n: number = 1): T[] {
  if (n <= 0) {
    return [];
  }

  const result: T[] = [];
  const arrayCopy = [...arr];

  for (let i = 0; i < n; i++) {
    const randomIndex = getRandomNumber(0, arrayCopy.length);
    const randomElement = arrayCopy.splice(randomIndex, 1)[0];
    result.push(randomElement);
  }

  return result;
}

/**
 * Returns a random integer between [min, max)
 */
export function getRandomNumber(min: number = 0, max: number = 1): number {
  return min + Math.floor(Math.random() * (max - min));
}
