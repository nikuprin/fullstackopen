import * as dotenv from "dotenv";
import { connect, Schema, model } from "mongoose";

dotenv.config();
const url = process.env.MONGODB_URI;

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
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
