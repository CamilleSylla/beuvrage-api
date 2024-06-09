import { DataSource } from "typeorm";
import { runSeeders } from "typeorm-extension";
import { dataSourceOptions } from "./data-source";

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    await runSeeders(dataSource);
    console.log("Seeding completed!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
