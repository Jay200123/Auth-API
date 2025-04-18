import mongoose from "mongoose";

export class Connection {
  constructor(connectionUri) {
    this.connectionUri = connectionUri;
  }

  async connect() {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(this.connectionUri);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}
