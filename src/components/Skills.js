import { motion } from 'framer-motion';

const barVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: index * 0.06,
    },
  }),
};

const MAX_RATING = 5;

function Skills({ skills }) {
  if (!skills || !skills.length) return null;

  return (
    <section
      id="skills"
      className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-slate-800/60"
    >
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">Skills</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-sky-300">
            Core strengths
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill, index) => {
          const safeRating =
            typeof skill.rating === 'number'
              ? Math.min(Math.max(skill.rating, 0), MAX_RATING)
              : 0;
          const percentage = (safeRating / MAX_RATING) * 100;

          return (
            <motion.div
              key={skill.name + index}
              className="space-y-1.5"
              variants={barVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={index}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-100">
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span className="text-xs text-slate-400">
                      {skill.category}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {safeRating}/{MAX_RATING}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default Skills;

