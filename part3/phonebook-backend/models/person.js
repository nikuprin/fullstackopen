import * as dotenv from "dotenv";
import { connect, Schema, model } from "mongoose";

dotenv.config();
const url = process.env.MONGODB_URI;

const personSchema = new Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

try {
  console.log("connecting to", url);
  await connect(url);
  console.log("connected to", url);
} catch (error) {
  console.error(error);
}

export default model("Person", personSchema);
