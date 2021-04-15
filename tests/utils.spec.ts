import { parseGPS } from "../src/utils";

describe("parseGPS", () => {
  it("parses a simple example", () => {
    const text =
      "GPS:*** Space - Orbit - Mars:982737.53:134956.69:1541072.15:#FF84F175:";
    const parsed = parseGPS(text);
    expect(parsed).toEqual({
      name: "*** Space - Orbit - Mars",
      x: 982737.53,
      y: 134956.69,
      z: 1541072.15,
      color: "#FF84F175",
    });
  });
  it("parses a complicated example", () => {
    const text =
      "GPS:::::::414.698909837949:3771.3167138792:-1516.086275542:#FF75C9F1:";
    const parsed = parseGPS(text);
    expect(parsed).toEqual({
      name: ":::::",
      x: 414.698909837949,
      y: 3771.3167138792,
      z: -1516.086275542,
      color: "#FF75C9F1",
    });
  });
  describe("fails to parse an invalid GPS", () => {
    it("empty", () => {
      const parsed = parseGPS("");
      expect(parsed).toBeNull();
    });
    it("foobar", () => {
      const parsed = parseGPS("foobar");
      expect(parsed).toBeNull();
    });
    it("partial", () => {
      const parsed = parseGPS("GPS:*** Space - Orbit - Mars:982737.5");
      expect(parsed).toBeNull();
    });
  });
});
