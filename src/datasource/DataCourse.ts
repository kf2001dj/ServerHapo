import { createConnection, Connection } from "typeorm";

let connection: Connection;

export const connectDatabase = async (): Promise<void> => {
  connection = await createConnection();
  console.log("Connected to the database!");
};

export const getConnection = (): Connection => {
  return connection;
};
