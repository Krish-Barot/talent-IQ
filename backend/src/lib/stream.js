import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("API_KEY or API_SECRET is missing !!");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream User upserted successfully : ", userData);
    } catch (error) {
        console.error("Error upserting Stream User : ", error);
    }
}

export const deleteStreamUser = async(userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream User deleted successfully : ", userId);
    } catch (error) {
        console.error("Error deleting stream user : ", error);
    }
}