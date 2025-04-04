import mongoose from "mongoose";

async function connectDb(url) {
  try {
    await mongoose.connect(url, { dbName: "Code-Editor" });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

const signupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default: "",
  },
});

const saveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  htmlCode: String,
  cssCode: String,
  jsCode: String,
  date: {
    type: Date,
    default: () => {
      const now = new Date();
      return now.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
    },
  },
  userId: {
    type: mongoose.Schema?.Types?.ObjectId,
    ref: "User",
    required: true,
  },
});

export const signupModel = mongoose.model("signup", signupSchema);
export const saveModel = mongoose.model("saved-code", saveSchema);

export default connectDb;
