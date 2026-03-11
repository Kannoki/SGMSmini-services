const projects = [
  {
    title: 'Kanban Task Manager',
    description: 'Real-time kanban board with drag-and-drop, filters, and team spaces.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'E-commerce Product Gallery',
    description: 'High-performance product grid with advanced search and facet filters.',
    tech: ['React', 'Next.js', 'Algolia'],
  },
  {
    title: 'Developer Portfolio',
    description: 'Personal portfolio with MDX-powered blog and dark/light themes.',
    tech: ['Next.js', 'MDX', 'Framer Motion'],
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available for freelance projects
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Crafting modern, micro frontend-first web experiences.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              I design and build interfaces that scale across teams and products. From design systems to complex
              dashboards, I help teams ship fast without sacrificing quality.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center justify-center rounded-full bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200">
              View selected work
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900/60">
              Download CV
            </button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400 sm:text-sm">
            <span className="tag-pill">Next.js</span>
            <span className="tag-pill">TypeScript</span>
            <span className="tag-pill">Tailwind CSS</span>
            <span className="tag-pill">Micro Frontends</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35)_0,_transparent_52%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.35)_0,_transparent_55%)] opacity-80" />
          <div className="glass-panel relative p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Snapshot</p>
                <p className="text-sm text-slate-100">Projects shipped</p>
              </div>
              <p className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                12+ in production
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">Experience</p>
                <p className="mt-1 text-lg font-semibold text-slate-50">5+ yrs</p>
              </div>
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">Teams</p>
                <p className="mt-1 text-lg font-semibold text-slate-50">4</p>
              </div>
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-3">
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">Stack</p>
                <p className="mt-1 text-xs font-medium text-slate-100">Next.js, React, Node</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">Selected projects</h2>
          <p className="text-xs text-slate-400 sm:text-sm">A few examples of recent work.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.75)] transition hover:border-slate-600 hover:bg-slate-900"
            >
              <h3 className="text-sm font-semibold text-slate-50 sm:text-base">{project.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[0.65rem] font-medium text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

