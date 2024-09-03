import { discountCheck } from "../../src/utils/helpers";

import constantValues from "../Data/constants.json";
import entryValues from "../Data/entryRecord.json";

describe("Helper function unit test", () => {
  const {evenNumberplate}=constantValues
  const {numberPlate}=entryValues
  test("discountCheck func should return true for even numbered plates on Monday and Wednesday", () => {
    expect(discountCheck(1, evenNumberplate)).toBe(true);
    expect(discountCheck(3, evenNumberplate)).toBe(true);
  });

  test("discountCheck func should return false for even numbered plates on other days", () => {
    expect(discountCheck(2, evenNumberplate)).toBe(false);
    expect(discountCheck(4, evenNumberplate)).toBe(false);
  });

  test("discountCheck func should return true for odd numbered plates on Tuesday and Thursday", () => {
    expect(discountCheck(2, numberPlate)).toBe(true);
    expect(discountCheck(4, numberPlate)).toBe(true);
  });

  test("discountCheck func should return false for odd numbered plates on other days", () => {
    expect(discountCheck(1, numberPlate)).toBe(false);
    expect(discountCheck(3, numberPlate)).toBe(false);
  });
});
