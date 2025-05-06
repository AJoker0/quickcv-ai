"use client";
import React from 'react';

import { useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
//import PdfResume from '@/app/components/PdfResume'; // assuming using alias
import PdfResume from '../../components/PdfResume';





export default function ResumePage() {
  const [summary, setSummary] = useState("");
  const [fullResume, setFullResume] = useState<any>(null);
  const [loadingFull, setLoadingFull] = useState(false);

  const [useGitHub, setUseGitHub] = useState(false);
  const [github, setGithub] = useState("");
  const [githubData, setGithubData] = useState<any>(null);
  const [topRepos, setTopRepos] = useState<any[]>([]);
  const [languagesUsed, setLanguagesUsed] = useState<Record<string, number>>({});

  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");

  const [certifications, setCertifications] = useState("");
  const [languages, setLanguages] = useState("");
  const [contact, setContact] = useState("");

  const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const addCustomField = () => {
    if (newFieldLabel && newFieldValue) {
      setCustomFields([...customFields, { label: newFieldLabel, value: newFieldValue }]);
      setNewFieldLabel("");
      setNewFieldValue("");
    }
  };

  const fetchTopRepositories = async (username: string) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
    const repos = await res.json();
    return repos
      .filter((repo: any) => !repo.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);
  };

  const fetchLanguages = async (username: string, repos: any[]) => {
    const languageData: Record<string, number> = {};
    for (const repo of repos) {
      const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`);
      const langs = await res.json();
      for (const [lang, bytes] of Object.entries(langs)) {
        languageData[lang] = (languageData[lang] || 0) + Number(bytes);
      }
    }
    return languageData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (useGitHub && github) {
      const username = github.split("/").pop();
      try {
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (!profileRes.ok) throw new Error("GitHub profile not found.");
        const profileData = await profileRes.json();
        setGithubData(profileData);

        const top = await fetchTopRepositories(username!);
        setTopRepos(top);

        const langs = await fetchLanguages(username!, top);
        setLanguagesUsed(langs);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    }
  };

  const generateFullResume = async () => {
    const payload = {
      name: githubData?.name || "",
      jobTitle,
      company,
      experience,
      skills,
      education,
      certifications,
      languages,
      contact,
      topRepos,
      githubLanguages: languagesUsed,
      customFields,
    };
  
    setLoadingFull(true);
    setFullResume(null);
  
    try {
      const res = await fetch("/api/ai-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
  
      const result = await res.json();
      setFullResume(result);
    } catch (err) {
      console.error("Full résumé generation failed:", err);
    } finally {
      setLoadingFull(false);
    }
  };
  

  return (
    <main className="min-h-screen p-8 text-center bg-gray-100">
      <form className="flex flex-col max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">📝 Create a New Résumé</h1>

        <label className="flex items-center gap-2 text-sm">
        <input
        type="checkbox"
        placeholder="Job Title"
        className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        checked={useGitHub}
        onChange={() => setUseGitHub(!useGitHub)}/>
        Use GitHub to auto-fill résumé
        </label>

        {useGitHub && (
          <input
          type="url"
          placeholder="https://github.com/your-username"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          required
          className="github-input"
          />
        )}

        <textarea
          value={linkedinSummary}
          onChange={(e) => setLinkedinSummary(e.target.value)}
          placeholder="Paste your LinkedIn summary or About section here"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border px-4 py-2 rounded"
        />
            
        <input
          id = "experience"
          type="number"
          placeholder="Years of Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        
        <input
          type="text"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Languages"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        {}
        <div className="border-t pt-4 mt-4">
          <h2 className="font-semibold text-left">➕ Add Custom Section</h2>
          <input
            type="text"
            placeholder="Section Title (e.g., Interests)"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            className="border px-4 py-2 rounded my-1 w-full"
          />
          <input
            type="text"
            placeholder="Section Content"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            className="border px-4 py-2 rounded my-1 w-full"
          />
          <button
            type="button"
            onClick={addCustomField}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
          >
            Add Field
          </button>
        </div>

            <button 
                type="submit"
                onClick={(e) => {
                    e.preventDefault(); // 🛑 отменяем обычную отправку
                    handleSubmit(e);     // 🐙 GitHub fetch (если включен)
                    //generateFullResume(); // 🧠 Генерация через OpenAI
                }}
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition mt-4">
                Generate Résumé
            </button>

        <button
          type="button"
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition mt-2"
          onClick={async () => {
            const payload = {
              name: githubData?.name || "",
              jobTitle,
              company,
              experience,
              skills,
              education,
              certifications,
              languages,
              topRepos,
              githubLanguages: languagesUsed,
            };

            setSummary("Generating with AI...");
            try {
              const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: payload }),
              });

              const result = await res.json();
              setSummary(result.summary);
            } catch (err) {
              console.error("AI generation failed", err);
              setSummary("Something went wrong generating your summary.");
            }
          }}
        >
          Generate Résumé with AI
        </button>


                {fullResume && (
        <PDFDownloadLink
            document={<PdfResume resume={fullResume} />}
            id="download-pdf-button"
            fileName="resume.pdf"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mt-2 inline-block"
        >
            {({ loading }) => (loading ? 'Preparing PDF...' : '📄 Download Résumé PDF')}
        </PDFDownloadLink>
        )}



        <button
        type="button"
        onClick={generateFullResume}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition mt-2"
        >
        🧠 Generate Full Résumé with AI
        </button>


      </form>
      {(linkedinSummary || jobTitle || githubData) && (
        <div className="mt-10 max-w-xl mx-auto text-left border-t pt-6">
          <h2 className="text-xl font-bold mb-2">📄 Résumé</h2>

          {githubData && (
            <div className="text-center mb-4">
              <img
                src={githubData.avatar_url}
                alt="GitHub Avatar"
                className="w-20 h-20 rounded-full mx-auto"
              />
              <h3 className="text-lg font-semibold mt-2">{githubData.name}</h3>
              <p className="text-gray-600 italic">{githubData.bio}</p>
              <p className="text-gray-500">{githubData.location}</p>
              <p className="text-gray-500">📚 {githubData.public_repos} public repos</p>
            </div>
          )}

          <div className="text-sm leading-relaxed">
            {contact && <p><strong>Contact:</strong> {contact}</p>}
            {linkedinSummary && <p className="whitespace-pre-line">{linkedinSummary}</p>}
            {jobTitle && <p><strong>Title:</strong> {jobTitle}</p>}
            {company && <p><strong>Company:</strong> {company}</p>}
            {experience && <p><strong>Years of Experience:</strong> {experience}</p>}
            {skills && <p><strong>Skills:</strong> {skills}</p>}
            {education && (
  <div className="mt-4">
    <p className="font-semibold">Education:</p>
    {Array.isArray(education) ? (
      <ul className="list-disc pl-5 text-sm space-y-1">
        {education.map((edu: any, i: number) => (
          <li key={i}>
            <p><strong>{edu.institution}</strong> {edu.degree && `– ${edu.degree}`}</p>
            {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
            {edu.dates && <p className="text-xs text-gray-500">{edu.dates}</p>}
          </li>
        ))}
      </ul>
    ) : typeof education === 'string' ? (
      <ul className="list-disc pl-5 text-sm">
        {education.split('\n').map((line, i) => (
          <li key={i}>{line.replace(/^- /, '')}</li>
        ))}
      </ul>
    ) : (
      <p>{String(education)}</p>
    )}
  </div>
)}



            {certifications && <p><strong>Certifications:</strong> {certifications}</p>}
            {languages && <p><strong>Languages:</strong> {languages}</p>}
            {customFields.map((field, idx) => (
              <p key={idx}><strong>{field.label}:</strong> {field.value}</p>
            ))}
          </div>

          {topRepos.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-1">🔥 Top Projects:</h4>
              <ul className="list-disc pl-5 text-sm">
                {topRepos.map((repo) => (
                  <li key={repo.id}>
                    <a href={repo.html_url} target="_blank" className="text-blue-600 hover:underline">
                      {repo.name}
                    </a>{" "}
                    – ⭐ {repo.stargazers_count} – {repo.language || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Object.keys(languagesUsed).length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-1">🧠 Programming Languages Used:</h4>
              <ul className="list-disc pl-5 text-sm">
                {Object.entries(languagesUsed).map(([lang, bytes]) => (
                  <li key={lang}>
                    {lang}: {bytes.toLocaleString()} bytes
                  </li>
                ))}
              </ul>
            </div>
          )}
                {summary && (
        <div className="mt-8 border-t pt-6 text-left max-w-xl mx-auto">
            <h3 className="text-lg font-bold mb-2">🧠 AI-Generated Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
        </div>

        
        )}

{loadingFull && (
  <p className="mt-8 text-gray-500">Generating full résumé with AI...</p>
)}
{fullResume && (
  <div className="mt-10 max-w-xl mx-auto text-left border-t pt-6 space-y-4">
    <h3 className="text-xl font-bold mb-4">🤖 AI-Generated Full Résumé</h3>
    {Object.entries(fullResume).map(([section, content], idx) => (
      <div key={idx}>
        <h4 className="text-lg font-semibold capitalize mb-1">{section}</h4>
        <div className="text-sm text-gray-700 whitespace-pre-line">
        <p className="font-semibold capitalize">{section}:</p>
            
            {Array.isArray(content) ? (
                <ul className="list-disc pl-5 space-y-1">
                    {content.map((item: any, i: number) => (
                      <li key={i}>
                        {typeof item === 'string' ? (
                          item
                        ) : typeof item === 'object' && item !== null ? (
                          <>
                            {item.name && <strong>{item.name}</strong>}
                            {item.title && <span> – {item.title}</span>}
                            {item.description && <p>{item.description}</p>}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {item.url}
                              </a>
                            )}
                          </>
                        ) : (
                          JSON.stringify(item)
                        )}
                      </li>
                    ))}
                </ul>
  
) : typeof content === 'object' ? (
  <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(content, null, 2)}</pre>
) : (
  <p>{String(content)}</p>
)}

</div>
      </div>
    ))}
  </div>
)}


        </div>
        
      )}
    </main>
  );
}