import { createConnection, Connection } from "typeorm";

let connection: Connection;

export const connectDatabase = async (): Promise<void> => {
  connection = await createConnection(); //Ánh xạ quan hệ đối tượng tới ormconfig.json tyeporm tự động đọc cấu hình
  console.log("Connected to the database!");
};

export const getConnection = (): Connection => {
  return connection;
};
