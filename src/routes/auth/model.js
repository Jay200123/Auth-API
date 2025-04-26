import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_modified: {
    type: Date,
    default: Date.now,
  },
});

const Token = mongoose.model("token", TokenSchema);
export default Token;
