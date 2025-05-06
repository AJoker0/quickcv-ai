import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: true,
  },
};

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("Missing OpenRouter API key in environment");
    }
      

    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing resume data.' });
    }

    const {
      name = "N/A",
      jobTitle = "N/A",
      company = "N/A",
      experience = "N/A",
      skills = "N/A",
      education = "N/A",
      certifications = "N/A",
      languages = "N/A",
      topRepos = [],
      githubLanguages = {},
    } = data;

    const repoList = Array.isArray(topRepos)
      ? topRepos.map((r: any) => r.name).join(', ')
      : 'N/A';

    const langList = typeof githubLanguages === 'object'
      ? Object.keys(githubLanguages).join(', ')
      : 'N/A';

    const prompt = `
You are a résumé generator AI. Write a short, polished summary paragraph based on the following user details:

Name: ${name}
Job Title: ${jobTitle}
Company: ${company}
Experience: ${experience} years
Skills: ${skills}
Education: ${education}
Certifications: ${certifications}
Languages: ${languages}
GitHub Repos: ${repoList}
GitHub Languages Used: ${langList}

Output a concise 3–5 sentence paragraph for a résumé summary section.
`;

    console.log("Sending prompt:", prompt);

    const chatResponse = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo", // ✅ Correct OpenRouter-compatible model
        messages: [{ role: 'user', content: prompt }],
    });
      

    const summary = chatResponse.choices?.[0]?.message?.content;
    console.log("Received summary:", summary);

    if (!summary) {
      throw new Error("Empty response from OpenAI.");
    }

    res.status(200).json({ summary });

  } catch (err: any) {
    console.error("🔥 API Error:");
    console.error(err?.message);
    console.error(err?.response?.status);         // <-- shows status code
    console.error(err?.response?.data);           // <-- shows OpenAI error message
    console.error(err?.stack);
    res.status(500).json({ error: err?.message || "Internal error." });
  }
  
}