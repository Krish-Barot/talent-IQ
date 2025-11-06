import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async() => {
    try {
        if(!process.env.MONGODB_URI){
            console.log("The environment variable is not set up for database")
        }
        await mongoose.connect(`${process.env.MONGODB_URI}/Talent-IQ`)
        console.log("connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB")
    }
}