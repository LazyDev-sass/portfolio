import { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Skills from './components/Skills';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 md:px-8">
        <Hero welcome={data.welcome} />
        <About about={data.about} />

        <Skills skills={data.skills} />

        <section
          id="education"
          className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-slate-800/60"
        >
          <h2 className="text-xl font-semibold tracking-tight text-slate-50 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-base font-medium text-slate-100">{edu.degree}</h3>
              <p className="text-sm text-slate-300">
                {edu.institution}, {edu.year}
              </p>
            </div>
          ))}
        </section>

        <Projects projects={data.projects} />

        <Certifications certifications={data.certifications} />

        <section
          id="contact"
          className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-slate-800/60"
        >
          <h2 className="text-xl font-semibold tracking-tight text-slate-50 mb-4">Contact</h2>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="contact-badge" aria-hidden="true">
              @
            </span>
            <a
              href={`mailto:${data.contact.email}`}
              className="hover:text-sky-200"
            >
              {data.contact.email}
            </a>
          </div>
          {data.contact.phone && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
              <span className="contact-badge" aria-hidden="true">
                ☎
              </span>
              <a
                href={`tel:${data.contact.phone}`}
                className="hover:text-sky-200"
              >
                {data.contact.phone}
              </a>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {data.contact.instagram && (
              <a
                href={data.contact.instagram}
                className="flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-badge" aria-hidden="true">
                  IG
                </span>
                <span>Instagram</span>
              </a>
            )}
            {data.contact.facebook && (
              <a
                href={data.contact.facebook}
                className="flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-badge" aria-hidden="true">
                  f
                </span>
                <span>Facebook</span>
              </a>
            )}
            {data.contact.youtube && (
              <a
                href={data.contact.youtube}
                className="flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-badge" aria-hidden="true">
                  YT
                </span>
                <span>YouTube</span>
              </a>
            )}
            {data.contact.github_profile && (
              <a
                href={data.contact.github_profile}
                className="flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-badge" aria-hidden="true">
                  GH
                </span>
                <span>GitHub</span>
              </a>
            )}
            {data.contact.leetcode && (
              <a
                href={data.contact.leetcode}
                className="flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-badge" aria-hidden="true">
                  LC
                </span>
                <span>LeetCode</span>
              </a>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
