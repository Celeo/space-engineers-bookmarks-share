export interface Coordinate {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

export const parseGPS = (text: string): Coordinate | null => {
  if (text.split("").filter((c) => c === ":").length < 6) {
    return null;
  }
  const parts = text.trim().split(":").reverse();
  const parsed = {
    name: parts.slice(5, parts.length - 1).join(":"),
    x: parseFloat(parts[4]),
    y: parseFloat(parts[3]),
    z: parseFloat(parts[2]),
    color: parts[1],
  };
  const failConditions = [
    !parsed.name,
    isNaN(parsed.x),
    isNaN(parsed.y),
    isNaN(parsed.z),
    !parsed.color,
  ];
  if (failConditions.indexOf(true) !== -1) {
    return null;
  }
  return parsed;
};

export const toGPS = (coordinate: Coordinate): string =>
  `GPS:${coordinate.name}:${coordinate.x}:${coordinate.y}:${coordinate.z}:${coordinate.color}:`;
