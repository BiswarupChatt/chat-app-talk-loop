import mongoose from "mongoose";

export const configureDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDb Atlas Successfully")
    } catch (err) {
        console.log("Error to connect with the database", err)
    }
}