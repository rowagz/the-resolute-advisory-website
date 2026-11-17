import { useState, type FormEvent } from 'react';

const SUBMIT_LABEL = 'Brief a senior partner  →';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'network';

const LABELS: Record<Status, string> = {
  idle: SUBMIT_LABEL,
  sending: 'Sending…',
  sent: 'Sent · We’ll be in touch →',
  error: 'Could not send · Try email →',
  network: 'Network error · Try email →',
};

/** §08 brief form — submits to Web3Forms via fetch, with in-page success/error. */
export default function BriefForm() {
  const [status, setStatus] = useState<Status>('idle');
  const busy = status === 'sending' || status === 'sent';
  const done = status === 'sent';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        setStatus('sent');
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('network');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <form className="brief-form" action="https://api.web3forms.com/submit" method="POST" aria-label="Brief form" noValidate onSubmit={onSubmit}>
      {/* Web3Forms access key (public, form-scoped) */}
      <input type="hidden" name="access_key" value="d68f602b-c83c-4028-8998-723fe42f13e1" />
      <input type="hidden" name="subject" value="New brief — Resolute Advisory" />
      <input type="hidden" name="from_name" value="Resolute Advisory · Brief form" />
      {/* Honeypot for spam: must stay empty */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />
      <div className="bf-row">
        <div className="bf-field">
          <label className="bf-label" htmlFor="bf-name">Name</label>
          <input type="text" id="bf-name" name="name" placeholder="Your name" autoComplete="name" disabled={done} />
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="bf-company">Company</label>
          <input type="text" id="bf-company" name="company" placeholder="Organisation" disabled={done} />
        </div>
      </div>
      <div className="bf-field">
        <label className="bf-label" htmlFor="bf-email">Email</label>
        <input type="email" id="bf-email" name="email" placeholder="your@email.com" autoComplete="email" disabled={done} />
      </div>
      <div className="bf-field">
        <label className="bf-label" htmlFor="bf-brief">What are you solving for?</label>
        <textarea id="bf-brief" name="brief" rows={3} placeholder="Describe the problem — briefly." disabled={done} />
      </div>
      <div className="bf-field bf-inline">
        <span className="bf-label">Timeline</span>
        <div className="bf-chips" role="group" aria-label="Timeline">
          <input type="radio" id="tl-urgent" name="timeline" value="Urgent" disabled={done} />
          <label htmlFor="tl-urgent" data-cursor="link">Urgent</label>
          <input type="radio" id="tl-30" name="timeline" value="30 days" disabled={done} />
          <label htmlFor="tl-30" data-cursor="link">30 days</label>
          <input type="radio" id="tl-90" name="timeline" value="90 days" disabled={done} />
          <label htmlFor="tl-90" data-cursor="link">90 days</label>
          <input type="radio" id="tl-exp" name="timeline" value="Exploring" disabled={done} />
          <label htmlFor="tl-exp" data-cursor="link">Exploring</label>
        </div>
      </div>
      <div className="bf-submit-row">
        <button
          type="submit"
          className="btn btn--submit"
          data-cursor="cta"
          disabled={done}
          style={busy ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
        >
          {LABELS[status]}
        </button>
      </div>
    </form>
  );
}
