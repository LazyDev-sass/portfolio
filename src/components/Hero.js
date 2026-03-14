import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: 'easeOut',
    },
  },
};

function Hero({ welcome }) {
  if (!welcome) return null;

  const { name, role, photo_url, tagline, secondary_text, resume_url } = welcome;

  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-3xl bg-slate-900/80 px-6 py-12 shadow-xl ring-1 ring-slate-800"
    >
      {/* Animated background */}
      <div className="hero-bg pointer-events-none" aria-hidden="true" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left"
      >
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
          <div className="relative">
            <div className="profile-ring" aria-hidden="true" />
            <motion.img
              src={photo_url}
              alt={name || 'Profile photo'}
              className="relative z-10 h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
              loading="lazy"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl lg:text-5xl">
              {name}
            </h1>
            <p className="mt-2 max-w-md text-base text-slate-300 md:text-lg">
              {role}
            </p>
            {tagline && (
              <p className="mt-3 max-w-md text-sm text-slate-400 md:text-base">
                {tagline}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:bg-sky-300"
              >
                View projects
              </a>
              {resume_url && (
                <a
                  href={resume_url}
                  className="inline-flex items-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download résumé
                </a>
              )}
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200"
              >
                Contact me
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-0 md:max-w-xs">
          {secondary_text && (
            <p className="text-sm text-slate-300 md:text-[0.95rem]">
              {secondary_text}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;

