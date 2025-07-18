const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const { data: initData } = require("./data");
const assignCategory = require("../utils/assignCategory");


const connectDb = async () => {
  try {
    await mongoose.connect("your mongo url");
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

const insertSampleData = async () => {
  try {
    const modifiedData = initData.map((obj) => ({
      ...obj,
      owner: new mongoose.Types.ObjectId("6851d380b235facde3a3293c"),
      category: assignCategory(obj.title, obj.location), // ✅ Assign category
    }));

    await Listing.insertMany(modifiedData);
    console.log("Data has been inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

const deleteSampleData = async () => {
  try {
    await Listing.deleteMany();
    console.log("Data has been deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

const main = async () => {
  await connectDb();
  await insertSampleData();
  // await deleteSampleData();
};

main();
