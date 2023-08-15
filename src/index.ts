import { createConnection } from "typeorm";

const main = async () => {
  try {
    const connection = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "hapo",
    });

    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

main();

console.log("hello word 555555555");
