import dotenv from "dotenv";

export class Environment {
  load() {
    dotenv.config();
    console.log(
      `Environment Variables Loaded - ${new Date().toLocaleString()}`
    );
  }
}
