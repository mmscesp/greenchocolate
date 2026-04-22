import {
  AnatomyTemplate,
  CarouselTemplate,
  ComparisonTemplate,
  SpotlightTemplate,
  StatementPost,
  WarningTemplate,
} from './scm-ig-template';

const sections = [
  { id: 'explainer', label: 'The Explainer', Component: CarouselTemplate },
  { id: 'audit', label: 'The Audit', Component: WarningTemplate },
  { id: 'blueprint', label: 'The Blueprint', Component: AnatomyTemplate },
  { id: 'debunk', label: 'The Debunk', Component: ComparisonTemplate },
  { id: 'spotlight', label: 'The Spotlight', Component: SpotlightTemplate },
  { id: 'single-post', label: 'Single Post', Component: StatementPost },
];

export default function App() {
  return (
    <main className="min-h-screen bg-[#08121f] px-6 py-10 text-white">
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-10 border-b border-white/10 pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00C9B1]">
            SCM IG Studio
          </p>
          <h1 className="mt-3 font-serif text-4xl">Isolated Template App</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/65">
            Separate from the SCM platform app. This studio renders the dropped
            template suite directly without touching platform routes or styles.
          </p>
        </header>

        <div className="mb-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#00C9B1]/40 hover:bg-white/[0.07]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00C9B1]">
                Template
              </p>
              <h2 className="mt-2 font-serif text-2xl">{label}</h2>
            </a>
          ))}
        </div>

        <div className="space-y-16">
          {sections.map(({ id, label, Component }) => (
            <section key={id} id={id} className="scroll-mt-8 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
              <div className="mb-6">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#00C9B1]">
                  {label}
                </p>
              </div>
              <Component />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
