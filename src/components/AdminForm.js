import { useState, useMemo } from 'react';

function AdminForm() {
  const [title, setTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [titleLimit, setTitleLimit] = useState(100);
  const [descriptionLimit, setDescriptionLimit] = useState(300);

  const formattedJson = useMemo(
    () =>
      JSON.stringify(
        {
          title: title || 'Project title',
          tech_stack: techStack
            ? techStack.split(',').map((item) => item.trim()).filter(Boolean)
            : ['Tech 1', 'Tech 2'],
          description: description || 'Short description of the project.',
          link: link || 'https://example.com',
          limit: {
            title: Number(titleLimit) || 100,
            description: Number(descriptionLimit) || 300,
          },
        },
        null,
        2
      ),
    [title, techStack, description, link, titleLimit, descriptionLimit]
  );

  return (
    <section className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-dashed ring-slate-700">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">
            Admin Form
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-sky-300">
            Generate project JSON
          </p>
        </div>
        <p className="text-xs text-slate-400 md:text-right">
          Fill the fields, then copy the JSON output directly into the
          <span className="font-medium text-sky-300"> projects </span>
          array of your <code>data.json</code>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="admin-label" htmlFor="admin-title">
              Project title
            </label>
            <input
              id="admin-title"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portfolio Website"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="admin-tech">
              Tech stack (comma separated)
            </label>
            <input
              id="admin-tech"
              className="admin-input"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Tailwind CSS, Node.js"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="admin-link">
              Project URL
            </label>
            <input
              id="admin-link"
              className="admin-input"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/user/project"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="admin-description">
              Description
            </label>
            <textarea
              id="admin-description"
              className="admin-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise, professional summary of what this project does and why it matters."
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="admin-label" htmlFor="admin-title-limit">
                Title limit
              </label>
              <input
                id="admin-title-limit"
                type="number"
                className="admin-input"
                value={titleLimit}
                onChange={(e) => setTitleLimit(e.target.value)}
                min={10}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="admin-description-limit">
                Description limit
              </label>
              <input
                id="admin-description-limit"
                type="number"
                className="admin-input"
                value={descriptionLimit}
                onChange={(e) => setDescriptionLimit(e.target.value)}
                min={50}
              />
            </div>
          </div>

          <div>
            <label className="admin-label" htmlFor="admin-json">
              JSON output
            </label>
            <textarea
              id="admin-json"
              className="admin-textarea font-mono text-xs leading-relaxed text-slate-100"
              rows={10}
              readOnly
              value={formattedJson}
              onFocus={(e) => e.target.select()}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Tip: Click inside and press <span className="font-medium">Ctrl + A</span> then{' '}
              <span className="font-medium">Ctrl + C</span> to copy everything.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminForm;

