import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.get("/health", (req, res) => {
    res.status(200).json({message: "API is running!"})
});

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server running on port ${process.env.PORT}`)
})