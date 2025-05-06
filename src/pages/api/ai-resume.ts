import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing resume data.' });
    }

      /*const prompt = `
  You are an expert résumé assistant helping a software engineer build a strong, professional résumé.

  Based on this data:

  ${JSON.stringify(data, null, 2)}

  Generate a full résumé in structured JSON format, with the following keys:
  - summary: A powerful personal branding paragraph.
  - experience: List of detailed work experiences with company name, title, dates, achievements.
  - education: Education section with institutions, dates, degrees, and any awards.
  - skills: A clean list of technical skills grouped by type.
  - certifications: A list of any credentials or courses.
  - languages: Human languages and proficiency levels.
  - projects: Clean list of public projects with name, short description, language, and GitHub URL.
  - contact: Just show the WhatsApp or provided method.
  - customSections: Include any user-added fields with their label and value.

  Respond only with JSON.
  `;*/

 // ✅ Normalize education field into array of strings if needed
if (typeof data.education === "string") {
  data.education = data.education
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean)
    .map((line: string) => `- ${line}`);
}

  const prompt = `
  You are an expert AI résumé assistant. Based on the following raw user input, generate a clean, complete professional résumé.
    Education entries are formatted like this:
  - [DATES] | [INSTITUTION] | [DETAILS]

Parse that into structured fields.
  Return a JSON object with these fields:
  {
    "summary": "A strong 3–5 sentence personal introduction paragraph.",
    "experience": [ 
      { "title": "Software Engineer", "company": "VUM", "dates": "2023–2025", "details": ["Developed features", "Led team", ...] } 
    ],
    "education": ["• Varna University of Management, BSc, 2024–Now", "..."],
    ...
    ],
    "skills": {
      "Programming Languages": ["Python", "C#", "JavaScript", "SQL", "C++"],
      "Web Technologies": ["HTML", "CSS"]
    },
    "certifications": ["Hillel Certificate", ...],
    "languages": [
      { "name": "English", "levels": "B2 Listening, B1 Speaking, B2 Reading, B2 Writing" },
      { "name": "Czech", "levels": "B1 Listening, B1 Speaking, B1 Reading, B1 Writing" },
      { "name": "Bulgarian", "levels": "A2 Listening, A1 Speaking, A2 Reading, A1 Writing" },
      { "name": "Russian", "levels": "Native" },
      { "name": "Ukrainian", "levels": "Native" }
    ],
    "projects": [
      { "name": "quickcv-ai", "description": "Résumé builder", "language": "JavaScript", "url": "https://github.com/AJoker0/quickcv-ai" },
      ...
    ],
    "contact": "WhatsApp: 911",
    "customSections": [
      { "title": "Interests", "content": "AI, open source, writing" }
    ]
  }

  Only output strict JSON.
  Here is the user data:

  ${JSON.stringify(data, null, 2)}
  `;


    const chatResponse = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const aiOutput = chatResponse.choices?.[0]?.message?.content || "";

    const parsedResume = JSON.parse(aiOutput);

    return res.status(200).json(parsedResume);

  } catch (err: any) {
    console.error("❌ AI Résumé Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Failed to generate résumé." });
  }
}
