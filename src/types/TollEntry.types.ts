export interface EntryTypes {
  numberPlate: string;
  entryPoint: string;
  exitPoint?: string;
  distanceTraveled?: number;
  enterDate: string;
  exitDate?: string | null;
  tax?: number;
}
