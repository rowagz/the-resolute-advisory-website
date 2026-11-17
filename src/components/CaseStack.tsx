import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '../data/cases';

/**
 * §06 case stack: click to expand, one open at a time.
 * Also owns the reveal-on-scroll for its entries (same threshold + 60ms
 * sibling stagger as the site-wide reveal in scripts/sections.js), so React
 * stays the single owner of each entry's className.
 */
export default function CaseStack({ cases }: { cases: CaseStudy[] }) {
  const [openNum, setOpenNum] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const refs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const hits: string[] = [];
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const num = (e.target as HTMLElement).dataset.case;
            if (num) hits.push(num);
            obs.unobserve(e.target);
          }
        });
        if (hits.length) {
          setRevealed((prev) => {
            const next = new Set(prev);
            hits.forEach((n) => next.add(n));
            return next;
          });
        }
      },
      { threshold: 0.06 },
    );
    refs.current.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <ol className="case-stack" aria-label="Selected engagements">
      {cases.map((c, idx) => {
        const isOpen = openNum === c.num;
        const isRevealed = revealed.has(c.num);
        const cls = ['case-entry', isRevealed && 'revealed', isOpen && 'is-open'].filter(Boolean).join(' ');
        const bodyId = `case-${c.num}-body`;
        return (
          <li
            key={c.num}
            className={cls}
            data-case={c.num}
            style={isRevealed && idx > 0 ? { transitionDelay: `${idx * 0.06}s` } : undefined}
            ref={(el) => {
              if (el) refs.current.set(c.num, el);
              else refs.current.delete(c.num);
            }}
          >
            <button
              className="case-head"
              type="button"
              aria-expanded={isOpen}
              aria-controls={bodyId}
              data-cursor="cta"
              onClick={() => setOpenNum(isOpen ? null : c.num)}
            >
              <span className="case-num">{c.num}</span>
              <figure className="case-thumb">
                <img src={c.thumb.src} alt={c.thumb.alt} loading="lazy" />
              </figure>
              <div className="case-head-text">
                <div className="case-entry-meta">
                  <span className="cem-client">{c.client}</span>
                  {c.tags.map((t) => (
                    <span className="cem-tag" key={t}>{t}</span>
                  ))}
                </div>
                <h3 className="case-entry-title">{c.title}</h3>
                <p className="case-entry-lead">{c.lead}</p>
              </div>
              <span className="case-toggle" aria-hidden="true">
                <span className="case-toggle-label">Read case</span>
                <svg className="case-toggle-chev" width="14" height="14" viewBox="0 0 14 14">
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <div className="case-body" id={bodyId} role="region" aria-label={c.label}>
              <div className="case-body-inner">
                <div className="case-sdi">
                  {c.sdi.map((col) => (
                    <div className="case-sdi-col" key={col.label}>
                      <div className="csdi-lbl">{col.label}</div>
                      <p className="csdi-text">{col.text}</p>
                    </div>
                  ))}
                </div>
                <blockquote className="case-outcome-block">
                  <p>{c.outcome}</p>
                </blockquote>
                <div className={c.twoUp ? 'case-img-strip case-img-strip--2' : 'case-img-strip'}>
                  {c.images.map((img) => (
                    <figure key={img.src}>
                      <img src={img.src} alt={img.alt} loading="lazy" />
                      <figcaption>{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
