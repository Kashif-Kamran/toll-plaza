export function discountCheck(exitDay: number, numberPlate: string): boolean {
  return (
    (exitDay === 1 && parseInt(numberPlate.slice(-1)) % 2 === 0) ||
    (exitDay === 3 && parseInt(numberPlate.slice(-1)) % 2 === 0) ||
    (exitDay === 2 && parseInt(numberPlate.slice(-1)) % 2 !== 0) ||
    (exitDay === 4 && parseInt(numberPlate.slice(-1)) % 2 !== 0)
  );
}
