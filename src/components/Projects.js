import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: index * 0.08,
    },
  }),
};

function Projects({ projects }) {
  if (!projects || !projects.length) return null;

  return (
    <section
      id="projects"
      className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-slate-800/60"
    >
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">Projects</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-sky-300">
            Selected work
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((proj, index) => (
          <motion.article
            key={proj.title + index}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-lg hover:shadow-sky-900/40"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={index}
          >
            {/* Project preview image */}
            <div className="project-image-wrapper">
              {proj.image_url ? (
                <img
                  src={proj.image_url}
                  alt={proj.title || 'Project preview'}
                  className="project-image"
                  loading="lazy"
                />
              ) : (
                <div className="project-image placeholder">
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-200">
                    Preview
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-sky-300">
                  {proj.title}
                </h3>
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {proj.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {proj.description && (
              <p className="mt-2 text-sm text-slate-200 line-clamp-3">
                {proj.description}
              </p>
            )}

            {proj.link && (
              <a
                href={proj.link}
                className="mt-4 inline-flex text-sm font-medium text-sky-300 hover:text-sky-200"
                target="_blank"
                rel="noreferrer"
              >
                View project
              </a>
            )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default Projects;

