'use client';

import { useEffect, useRef, type FormEvent, type ReactNode } from 'react';

import {
  ASSET_OPTIONS,
  BUDGET_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  CONTACT_TIME_OPTIONS,
  CONTENT_PROVISION_OPTIONS,
  HAS_MODELS_OPTIONS,
  INCLUDE_OPTIONS,
  LOOKING_FOR_OPTIONS,
  MAIN_GOAL_OPTIONS,
  SITE_SIZE_OPTIONS,
  THREE_D_ACTION_OPTIONS,
  THREE_D_USE_OPTIONS,
  TIMELINE_OPTIONS,
  VISUAL_STYLE_OPTIONS,
  labelFor,
  labelsFor,
  needs3DChapter,
  toggleMulti,
  type BuildInquiry,
  type ChapterErrors,
  type ChapterId,
  type ChoiceOption,
} from '@/lib/buildInquiry';
import type { SubmitChannel } from '@/lib/submitBuildInquiry';

interface BuildIntakeProps {
  chapter: ChapterId;
  inquiry: BuildInquiry;
  errors: ChapterErrors;
  submitting: boolean;
  submitError: string;
  sent: boolean;
  progress: number;
  onChange: (patch: Partial<BuildInquiry>) => void;
  onHover: (key: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSubmit: (channel: SubmitChannel) => void;
  onRestart: () => void;
}

const STYLE_SWATCHES: Record<Exclude<BuildInquiry['visualStyle'], ''>, string[]> = {
  minimal: ['#ece7df', '#9a958c', '#1c1a17'],
  premium: ['#0f1014', '#c9b27c', '#5c4a28'],
  corporate: ['#14304a', '#d7dde4', '#0d1b28'],
  bold: ['#111111', '#ff5a1f', '#f4f0ea'],
  'dark-futuristic': ['#07080d', '#ff6a18', '#4ad2ff'],
  playful: ['#1b1020', '#ff6a8a', '#ffd36a'],
  cinematic: ['#140805', '#ff6a18', '#ffd6a5'],
  recommend: ['#1a120c', '#ff8a3a', '#ffe0b0'],
};

function ChoiceGrid<T extends string>({
  options,
  value,
  errors,
  multiple = false,
  onPick,
  onHover,
}: {
  options: ChoiceOption<T>[];
  value: T | T[] | '';
  errors?: string;
  multiple?: boolean;
  onPick: (id: T) => void;
  onHover: (key: string) => void;
}) {
  return (
    <div className={`build-choices ${multiple ? 'is-multi' : ''}`}>
      {options.map((option) => {
        const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={`build-choice ${selected ? 'is-selected' : ''}`}
            aria-pressed={selected}
            onMouseEnter={() => onHover(option.id)}
            onFocus={() => onHover(option.id)}
            onMouseLeave={() => onHover('')}
            onBlur={() => onHover('')}
            onClick={() => onPick(option.id)}
          >
            <span>{option.label}</span>
          </button>
        );
      })}
      {errors ? <p className="build-error">{errors}</p> : null}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="build-field" htmlFor={htmlFor}>
      <span className="build-label">{label}</span>
      {hint ? <span className="build-hint">{hint}</span> : null}
      {children}
      {error ? <span className="build-error">{error}</span> : null}
    </label>
  );
}

function ChapterCopy({ title, body }: { title: string; body: string }) {
  return (
    <header className="build-copy">
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

const CHAPTER_COPY: Partial<Record<ChapterId, { title: string; body: string }>> = {
  lookingFor: { title: 'What do you need?', body: 'Pick one.' },
  goal: { title: 'What should the site do?', body: 'Pick the main goal.' },
  business: { title: 'About your business', body: 'Keep this short.' },
  scope: { title: 'What should it include?', body: 'Pick all that apply.' },
  size: { title: 'How big is the site?', body: 'A rough size is fine.' },
  threeD: { title: 'How will you use 3D?', body: 'Pick all that apply.' },
  budget: { title: 'What is your budget?', body: 'This helps us plan the right build.' },
  timeline: { title: 'When do you need it?', body: 'Pick a timeframe.' },
  assets: { title: 'What do you already have?', body: 'Pick all that apply.' },
  design: { title: 'What should it look like?', body: 'Pick a style.' },
  contact: { title: 'How can we reach you?', body: 'We only use this to talk about your project. Choose how you would like us to reply.' },
  success: {
    title: 'What would make this site a success?',
    body: 'More customers, more sales, a better first look. Write it in your own words.',
  },
  review: {
    title: 'Ready to send?',
    body: 'Check your answers, then send this brief by email or WhatsApp.',
  },
};

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className="build-review-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function BuildIntake({
  chapter,
  inquiry,
  errors,
  submitting,
  submitError,
  sent,
  progress,
  onChange,
  onHover,
  onContinue,
  onBack,
  onSubmit,
  onRestart,
}: BuildIntakeProps) {
  const showBack = chapter !== 'arrival' && !sent;
  const copy = CHAPTER_COPY[chapter];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [chapter]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) {
      return;
    }
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches('input, textarea')) {
        return;
      }
      window.setTimeout(() => {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 120);
    };
    root.addEventListener('focusin', onFocusIn);
    return () => root.removeEventListener('focusin', onFocusIn);
  }, [sent]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (chapter === 'review') {
      return;
    }
    onContinue();
  };

  if (sent) {
    return (
      <section className="build-panel build-panel--thanks" aria-live="polite">
        <div className="build-panel-scroll">
          <ChapterCopy
            title="We got your answers."
            body="We will contact you soon using the method you chose."
          />
        </div>
        <div className="build-actions">
          <button type="button" className="build-primary" onClick={onRestart}>
            Start again
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      className={`build-panel chapter-${chapter}`}
      onSubmit={handleSubmit}
      noValidate
      onWheel={(event) => event.stopPropagation()}
    >
      {chapter === 'arrival' ? (
        <div className="build-arrival">
          <ChapterCopy
            title="Tell us about your website."
            body="A few short questions. Press Start when you are ready."
          />
          <button type="submit" className="build-primary">
            Start
          </button>
        </div>
      ) : (
        <>
          <div className="build-panel-head">
            <div className="build-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
            </div>
            {copy ? <ChapterCopy title={copy.title} body={copy.body} /> : null}
          </div>
          <div className="build-panel-scroll" ref={scrollRef}>
      {chapter === 'lookingFor' ? (
        <>
          <ChoiceGrid
            options={LOOKING_FOR_OPTIONS}
            value={inquiry.lookingFor}
            errors={errors.lookingFor}
            onPick={(id) => onChange({ lookingFor: id })}
            onHover={onHover}
          />
        </>
      ) : null}

      {chapter === 'goal' ? (
        <>
          <ChoiceGrid
            options={MAIN_GOAL_OPTIONS}
            value={inquiry.mainGoal}
            errors={errors.mainGoal}
            onPick={(id) => onChange({ mainGoal: id })}
            onHover={onHover}
          />
          {inquiry.mainGoal === 'other' ? (
            <Field label="Tell us the goal" htmlFor="goalOther" error={errors.goalOther}>
              <input
                id="goalOther"
                value={inquiry.goalOther}
                onChange={(event) => onChange({ goalOther: event.target.value })}
              />
            </Field>
          ) : null}
        </>
      ) : null}

      {chapter === 'business' ? (
        <>
          <div className="build-fields">
            <Field label="Business / brand name" htmlFor="businessName" error={errors.businessName}>
              <input
                id="businessName"
                autoComplete="organization"
                value={inquiry.businessName}
                onChange={(event) => onChange({ businessName: event.target.value })}
              />
            </Field>
            <Field label="Industry / business type" htmlFor="industry" error={errors.industry}>
              <input
                id="industry"
                value={inquiry.industry}
                onChange={(event) => onChange({ industry: event.target.value })}
              />
            </Field>
            <Field label="City / country" htmlFor="cityCountry" error={errors.cityCountry}>
              <input
                id="cityCountry"
                autoComplete="address-level2"
                value={inquiry.cityCountry}
                onChange={(event) => onChange({ cityCountry: event.target.value })}
              />
            </Field>
            <Field
              label="What does your business do?"
              htmlFor="businessDescription"
              error={errors.businessDescription}
              hint="A few sentences is enough."
            >
              <textarea
                id="businessDescription"
                rows={4}
                value={inquiry.businessDescription}
                onChange={(event) => onChange({ businessDescription: event.target.value })}
              />
            </Field>
            <fieldset className="build-fieldset">
              <legend>Do you have a website now?</legend>
              <div className="build-inline-choices">
                {(['yes', 'no'] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`build-choice is-compact ${inquiry.hasWebsite === id ? 'is-selected' : ''}`}
                    aria-pressed={inquiry.hasWebsite === id}
                    onClick={() => onChange({ hasWebsite: id, currentWebsiteUrl: id === 'no' ? '' : inquiry.currentWebsiteUrl })}
                  >
                    {id === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </fieldset>
            {inquiry.hasWebsite === 'yes' ? (
              <Field label="Current website URL" htmlFor="currentWebsiteUrl" error={errors.currentWebsiteUrl}>
                <input
                  id="currentWebsiteUrl"
                  inputMode="url"
                  placeholder="https://"
                  value={inquiry.currentWebsiteUrl}
                  onChange={(event) => onChange({ currentWebsiteUrl: event.target.value })}
                />
              </Field>
            ) : null}
          </div>
        </>
      ) : null}

      {chapter === 'scope' ? (
        <>
          <ChoiceGrid
            options={INCLUDE_OPTIONS}
            value={inquiry.includes}
            multiple
            errors={errors.includes}
            onPick={(id) => onChange({ includes: toggleMulti(inquiry.includes, id) })}
            onHover={onHover}
          />
          {inquiry.includes.includes('other') ? (
            <Field label="What else should it include?" htmlFor="includesOther" error={errors.includesOther}>
              <input
                id="includesOther"
                value={inquiry.includesOther}
                onChange={(event) => onChange({ includesOther: event.target.value })}
              />
            </Field>
          ) : null}
        </>
      ) : null}

      {chapter === 'size' ? (
        <>
          <ChoiceGrid
            options={SITE_SIZE_OPTIONS}
            value={inquiry.siteSize}
            errors={errors.siteSize}
            onPick={(id) => onChange({ siteSize: id })}
            onHover={onHover}
          />
        </>
      ) : null}

      {chapter === 'threeD' ? (
        <>
          <ChoiceGrid
            options={THREE_D_USE_OPTIONS}
            value={inquiry.threeDUse}
            multiple
            errors={errors.threeDUse}
            onPick={(id) => onChange({ threeDUse: toggleMulti(inquiry.threeDUse, id) })}
            onHover={onHover}
          />
          {inquiry.threeDUse.includes('other') ? (
            <Field label="Describe the 3D use" htmlFor="threeDUseOther" error={errors.threeDUseOther}>
              <input
                id="threeDUseOther"
                value={inquiry.threeDUseOther}
                onChange={(event) => onChange({ threeDUseOther: event.target.value })}
              />
            </Field>
          ) : null}
          <fieldset className="build-fieldset">
            <legend>Do you already have 3D models?</legend>
            <ChoiceGrid
              options={HAS_MODELS_OPTIONS}
              value={inquiry.hasModels}
              errors={errors.hasModels}
              onPick={(id) => onChange({ hasModels: id })}
              onHover={onHover}
            />
          </fieldset>
          <fieldset className="build-fieldset">
            <legend>What should people be able to do?</legend>
            <ChoiceGrid
              options={THREE_D_ACTION_OPTIONS}
              value={inquiry.threeDActions}
              multiple
              errors={errors.threeDActions}
              onPick={(id) => onChange({ threeDActions: toggleMulti(inquiry.threeDActions, id) })}
              onHover={onHover}
            />
          </fieldset>
          {inquiry.threeDActions.includes('other') ? (
            <Field label="Other interactions" htmlFor="threeDActionsOther" error={errors.threeDActionsOther}>
              <input
                id="threeDActionsOther"
                value={inquiry.threeDActionsOther}
                onChange={(event) => onChange({ threeDActionsOther: event.target.value })}
              />
            </Field>
          ) : null}
        </>
      ) : null}

      {chapter === 'budget' ? (
        <>
          <ChoiceGrid
            options={BUDGET_OPTIONS}
            value={inquiry.budget}
            errors={errors.budget}
            onPick={(id) => onChange({ budget: id })}
            onHover={onHover}
          />
        </>
      ) : null}

      {chapter === 'timeline' ? (
        <>
          <ChoiceGrid
            options={TIMELINE_OPTIONS}
            value={inquiry.timeline}
            errors={errors.timeline}
            onPick={(id) => onChange({ timeline: id })}
            onHover={onHover}
          />
          <Field
            label="Any special date?"
            htmlFor="launchEvent"
            hint="Optional"
          >
            <input
              id="launchEvent"
              value={inquiry.launchEvent}
              onChange={(event) => onChange({ launchEvent: event.target.value })}
            />
          </Field>
        </>
      ) : null}

      {chapter === 'assets' ? (
        <>
          <ChoiceGrid
            options={ASSET_OPTIONS}
            value={inquiry.assets}
            multiple
            errors={errors.assets}
            onPick={(id) => onChange({ assets: toggleMulti(inquiry.assets, id, 'none') })}
            onHover={onHover}
          />
          {inquiry.assets.includes('other') ? (
            <Field label="Other assets" htmlFor="assetsOther" error={errors.assetsOther}>
              <input
                id="assetsOther"
                value={inquiry.assetsOther}
                onChange={(event) => onChange({ assetsOther: event.target.value })}
              />
            </Field>
          ) : null}
          <fieldset className="build-fieldset">
            <legend>Will you give us the text and photos?</legend>
            <ChoiceGrid
              options={CONTENT_PROVISION_OPTIONS}
              value={inquiry.contentProvision}
              errors={errors.contentProvision}
              onPick={(id) => onChange({ contentProvision: id })}
              onHover={onHover}
            />
          </fieldset>
        </>
      ) : null}

      {chapter === 'design' ? (
        <>
          <div className="build-style-grid">
            {VISUAL_STYLE_OPTIONS.map((option) => {
              const selected = inquiry.visualStyle === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`build-style-card ${selected ? 'is-selected' : ''}`}
                  aria-pressed={selected}
                  onMouseEnter={() => onHover(option.id)}
                  onFocus={() => onHover(option.id)}
                  onMouseLeave={() => onHover('')}
                  onBlur={() => onHover('')}
                  onClick={() => onChange({ visualStyle: option.id })}
                >
                  <span className="build-swatches" aria-hidden="true">
                    {STYLE_SWATCHES[option.id].map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
          {errors.visualStyle ? <p className="build-error">{errors.visualStyle}</p> : null}
          <Field label="Any sites you like?" htmlFor="likedWebsites" hint="Paste links. Optional.">
            <textarea
              id="likedWebsites"
              rows={3}
              value={inquiry.likedWebsites}
              onChange={(event) => onChange({ likedWebsites: event.target.value })}
            />
          </Field>
        </>
      ) : null}

      {chapter === 'contact' ? (
        <>
          <div className="build-fields">
            <Field label="Your name" htmlFor="contactName" error={errors.contactName}>
              <input
                id="contactName"
                autoComplete="name"
                value={inquiry.contactName}
                onChange={(event) => onChange({ contactName: event.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="contactEmail" error={errors.contactEmail}>
              <input
                id="contactEmail"
                type="email"
                autoComplete="email"
                value={inquiry.contactEmail}
                onChange={(event) => onChange({ contactEmail: event.target.value })}
              />
            </Field>
            <Field label="Phone / WhatsApp" htmlFor="contactPhone" error={errors.contactPhone}>
              <input
                id="contactPhone"
                type="tel"
                autoComplete="tel"
                value={inquiry.contactPhone}
                onChange={(event) => onChange({ contactPhone: event.target.value })}
              />
            </Field>
            <Field label="Company / role" htmlFor="companyRole" hint="Optional">
              <input
                id="companyRole"
                value={inquiry.companyRole}
                onChange={(event) => onChange({ companyRole: event.target.value })}
              />
            </Field>
            <label className="build-honeypot" htmlFor="companyFax">
              Fax number
              <input
                id="companyFax"
                tabIndex={-1}
                autoComplete="off"
                value={inquiry.honeypot}
                onChange={(event) => onChange({ honeypot: event.target.value })}
              />
            </label>
          </div>
          <fieldset className="build-fieldset">
            <legend>Preferred method of contact</legend>
            <ChoiceGrid
              options={CONTACT_METHOD_OPTIONS}
              value={inquiry.contactMethod}
              errors={errors.contactMethod}
              onPick={(id) => onChange({ contactMethod: id })}
              onHover={onHover}
            />
          </fieldset>
          <fieldset className="build-fieldset">
            <legend>When is a good time?</legend>
            <ChoiceGrid
              options={CONTACT_TIME_OPTIONS}
              value={inquiry.contactTime}
              errors={errors.contactTime}
              onPick={(id) => onChange({ contactTime: id })}
              onHover={onHover}
            />
          </fieldset>
        </>
      ) : null}

      {chapter === 'success' ? (
        <>
          <Field label="Success looks like" htmlFor="successDefinition" error={errors.successDefinition}>
            <textarea
              id="successDefinition"
              rows={5}
              placeholder="More enquiries, more sales, a better first impression, showcasing a product, standing out from competitors, etc."
              value={inquiry.successDefinition}
              onChange={(event) => onChange({ successDefinition: event.target.value })}
            />
          </Field>
        </>
      ) : null}

      {chapter === 'review' ? (
        <>
          <dl className="build-review">
            <ReviewRow label="Looking for" value={labelFor(LOOKING_FOR_OPTIONS, inquiry.lookingFor)} />
            <ReviewRow
              label="Goal"
              value={`${labelFor(MAIN_GOAL_OPTIONS, inquiry.mainGoal)}${inquiry.goalOther ? ` (${inquiry.goalOther})` : ''}`}
            />
            <ReviewRow label="Business" value={`${inquiry.businessName} · ${inquiry.industry} · ${inquiry.cityCountry}`} />
            <ReviewRow label="Includes" value={labelsFor(INCLUDE_OPTIONS, inquiry.includes)} />
            <ReviewRow label="Size" value={labelFor(SITE_SIZE_OPTIONS, inquiry.siteSize)} />
            {needs3DChapter(inquiry) ? (
              <ReviewRow label="3D" value={labelsFor(THREE_D_USE_OPTIONS, inquiry.threeDUse)} />
            ) : null}
            <ReviewRow label="Budget" value={labelFor(BUDGET_OPTIONS, inquiry.budget)} />
            <ReviewRow label="Timeline" value={labelFor(TIMELINE_OPTIONS, inquiry.timeline)} />
            <ReviewRow label="Contact" value={`${inquiry.contactName} · ${inquiry.contactEmail}`} />
            <ReviewRow label="Preferred contact" value={labelFor(CONTACT_METHOD_OPTIONS, inquiry.contactMethod)} />
          </dl>
          {submitError ? <p className="build-error">{submitError}</p> : null}
        </>
      ) : null}
          </div>
          <div className="build-actions">
            {showBack ? (
              <button type="button" className="build-secondary" onClick={onBack}>
                Previous
              </button>
            ) : null}
            {chapter === 'review' ? (
              <div className="build-send-options">
                <button
                  type="button"
                  className="build-primary"
                  disabled={submitting}
                  onClick={() => onSubmit('mailto')}
                >
                  Email
                </button>
                <button
                  type="button"
                  className="build-primary"
                  disabled={submitting}
                  onClick={() => onSubmit('whatsapp')}
                >
                  WhatsApp
                </button>
              </div>
            ) : (
              <button type="submit" className="build-primary" disabled={submitting}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
