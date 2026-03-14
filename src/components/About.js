import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

function About({ about }) {
  if (!about) return null;

  const { bio } = about;

  return (
    <motion.section
      id="about"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-3xl bg-slate-900/60 px-6 py-8 shadow-lg ring-1 ring-slate-800/60"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
            About
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-sky-300">
            Professional overview
          </p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 md:mt-0 md:text-base">
          {bio}
        </p>
      </div>
    </motion.section>
  );
}

export default About;

