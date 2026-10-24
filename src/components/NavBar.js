import { useState } from 'react';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#certifications', label: 'Certifications' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (event, href) => {
    event.preventDefault();

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update the URL hash without triggering an instant jump.
      window.history.replaceState(null, '', href);
    }

    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <a
          href="#hero"
          onClick={(event) => handleNavClick(event, '#hero')}
          className="text-sm font-semibold tracking-[0.25em] uppercase text-sky-300"
        >
          Portfolio
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-5 text-xs font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="rounded-full px-3 py-1 transition-colors hover:bg-slate-800/70 hover:text-sky-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile nav panel */}
      {isOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 md:hidden">
          <nav className="mx-auto max-w-5xl px-4 py-3">
            <ul className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className="block rounded-xl px-3 py-2 transition-colors hover:bg-slate-800/80 hover:text-sky-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;