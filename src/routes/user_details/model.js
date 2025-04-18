import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
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

const UserDetails = mongoose.model("user_details", userDetailsSchema);
export default UserDetails;
