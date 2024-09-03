import { connect } from "mongoose";
import { connectToDb } from "../../src/utils/connection";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("Database connection unit test", () => {
  const dbUser = "testUser";
  const dbPass = "testPass";
  const dbName = "testDb";

  beforeAll(() => {
    process.env.dbUser = dbUser;
    process.env.dbPass = dbPass;
    process.env.dbName = dbName;
  });

  afterAll(() => {
    delete process.env.dbUser;
    delete process.env.dbPass;
    delete process.env.dbName;
  });

  it("should log a success message when connection with database is successful", async () => {
    const mockConnect = connect as jest.Mock;
    mockConnect.mockResolvedValueOnce(undefined);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectToDb();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Database connection established successfully!"
    );

    consoleLogSpy.mockRestore();
  });

  it("should throw an error when connection with database fails", async () => {
    const mockConnect = connect as jest.Mock;
    const error = new Error("Connection failed");
    mockConnect.mockRejectedValueOnce(error);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(connectToDb()).rejects.toThrow(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Database connection failed:", error);

    consoleErrorSpy.mockRestore();
  });
});
