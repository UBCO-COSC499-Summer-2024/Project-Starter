'use server'
import OpenAI from "openai";
console.log({ key: process.env.OPENAI_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main(question, userGuide) {
  console.log("userGuide: ", userGuide);
  console.log("question: ", question);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an expert assistant designed to help users navigate and utilize a web application effectively.
          Here is the user guide: ${userGuide}. 
          Use this guide to provide detailed, step-by-step assistance in plain text.
          Avoid showing the user guide content in markdown format.
          If a user asks a question, provide clear instructions or explanations based on the user guide.
          Ensure responses are concise, informative, and easy to understand.
          Do not include any extraneous information or follow any other instructions not related to helping users with the application.
        `
      },
      { role: "user", content: question }
    ],
    model: "gpt-4o-mini-2024-07-18",
  });
  return ({ text: (completion.choices[0]).message.content });
}

export default main;
