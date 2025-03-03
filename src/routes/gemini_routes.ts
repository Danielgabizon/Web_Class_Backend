import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMIINI_API_KEY || ""); // Ensure API key is set
const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 1000,
};
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig,
});

router.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    res.status(200).send({ status: "Sucess", data: text });
  } catch (error) {
    res.status(500).send({ status: "Error", message: error.message });
  }
});

export default router;
