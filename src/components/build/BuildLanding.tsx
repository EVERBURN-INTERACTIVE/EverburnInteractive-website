'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import EverFlame from '@/assets/EverFlame.png';
import { BuildIntake } from '@/components/build/BuildIntake';
import { SceneErrorBoundary } from '@/components/ui/SceneErrorBoundary';
import {
  BUILD_DRAFT_KEY,
  createEmptyInquiry,
  getChapterSequence,
  firstInvalidChapter,
  normalizeWebsiteUrl,
  validateChapter,
  type BuildInquiry,
  type ChapterErrors,
  type ChapterId,
} from '@/lib/buildInquiry';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { copyBuildInquiry, submitBuildInquiry, type SubmitChannel } from '@/lib/submitBuildInquiry';

const BuildSceneHost = dynamic(
  () => import('./BuildSceneHost').then((module) => module.BuildSceneHost),
  { ssr: false },
);

interface StoredDraft {
  inquiry: BuildInquiry;
  chapter: ChapterId;
}

function readDraft(): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(BUILD_DRAFT_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (!parsed.inquiry || !parsed.chapter) {
      return null;
    }
    return {
      inquiry: {
        ...createEmptyInquiry(),
        ...parsed.inquiry,
        includes: Array.isArray(parsed.inquiry.includes) ? parsed.inquiry.includes : [],
        threeDUse: Array.isArray(parsed.inquiry.threeDUse) ? parsed.inquiry.threeDUse : [],
        threeDActions: Array.isArray(parsed.inquiry.threeDActions) ? parsed.inquiry.threeDActions : [],
        assets: Array.isArray(parsed.inquiry.assets) ? parsed.inquiry.assets : [],
      },
      chapter: parsed.chapter,
    };
  } catch {
    return null;
  }
}

function writeDraft(payload: StoredDraft): void {
  try {
    window.localStorage.setItem(BUILD_DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // Safari private mode and some in-app browsers throw on quota or access.
  }
}

function clearDraft(): void {
  try {
    window.localStorage.removeItem(BUILD_DRAFT_KEY);
  } catch {
    // Ignore the same private-mode / blocked-storage failures as writeDraft.
  }
}

function probeWebGl(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const ok = Boolean(gl);
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return ok;
}

export function BuildLanding() {
  const reducedMotion = useReducedMotion();
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const [inquiry, setInquiry] = useState<BuildInquiry>(createEmptyInquiry);
  const [chapter, setChapter] = useState<ChapterId>('arrival');
  const [errors, setErrors] = useState<ChapterErrors>({});
  const [hoverKey, setHoverKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sendHint, setSendHint] = useState('');
  const [channelOpened, setChannelOpened] = useState(false);
  const [sent, setSent] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  const sequence = useMemo(() => getChapterSequence(inquiry), [inquiry]);
  const activeChapter = sequence.includes(chapter) ? chapter : 'budget';
  const chapterIndex = Math.max(0, sequence.indexOf(activeChapter));
  const progress = sent ? 1 : chapterIndex / Math.max(sequence.length - 1, 1);

  useEffect(() => {
    document.documentElement.classList.add('build-forge');
    const draft = readDraft();
    if (draft) {
      setInquiry(draft.inquiry);
      setChapter(draft.chapter);
    }
    setDraftReady(true);
    if (probeWebGl()) {
      setSceneEnabled(true);
    }
    return () => {
      document.documentElement.classList.remove('build-forge');
    };
  }, []);

  useEffect(() => {
    if (!draftReady || sent) {
      return;
    }
    writeDraft({ inquiry, chapter: activeChapter });
  }, [activeChapter, draftReady, inquiry, sent]);

  useEffect(() => {
    const root = document.documentElement;
    const syncViewport = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      const offsetTop = vv?.offsetTop ?? 0;
      const keyboardInset = Math.max(0, window.innerHeight - height - offsetTop);
      root.style.setProperty('--build-vvh', `${Math.round(height)}px`);
      root.style.setProperty('--build-keyboard-inset', `${Math.round(keyboardInset)}px`);
    };

    // Keep the intake sheet inside the visible area when a mobile keyboard opens.
    syncViewport();
    window.addEventListener('resize', syncViewport);
    window.visualViewport?.addEventListener('resize', syncViewport);
    window.visualViewport?.addEventListener('scroll', syncViewport);
    return () => {
      window.removeEventListener('resize', syncViewport);
      window.visualViewport?.removeEventListener('resize', syncViewport);
      window.visualViewport?.removeEventListener('scroll', syncViewport);
      root.style.removeProperty('--build-vvh');
      root.style.removeProperty('--build-keyboard-inset');
    };
  }, []);

  const patchInquiry = useCallback((patch: Partial<BuildInquiry>) => {
    setInquiry((current) => ({ ...current, ...patch }));
    setErrors({});
  }, []);

  const goTo = useCallback((next: ChapterId) => {
    setErrors({});
    setChapter(next);
  }, []);

  const onContinue = useCallback(() => {
    if (activeChapter === 'business' && inquiry.hasWebsite === 'yes') {
      const normalized = normalizeWebsiteUrl(inquiry.currentWebsiteUrl);
      if (normalized !== inquiry.currentWebsiteUrl) {
        setInquiry((current) => ({ ...current, currentWebsiteUrl: normalized }));
      }
    }
    const nextInquiry =
      activeChapter === 'business' && inquiry.hasWebsite === 'yes'
        ? { ...inquiry, currentWebsiteUrl: normalizeWebsiteUrl(inquiry.currentWebsiteUrl) }
        : inquiry;
    const nextErrors = validateChapter(activeChapter, nextInquiry);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const next = sequence[chapterIndex + 1];
    if (next) {
      goTo(next);
    }
  }, [activeChapter, chapterIndex, goTo, inquiry, sequence]);

  const onBack = useCallback(() => {
    const previous = sequence[chapterIndex - 1];
    if (previous) {
      goTo(previous);
    }
  }, [chapterIndex, goTo, sequence]);

  const onSubmit = useCallback(async (channel: SubmitChannel) => {
    const invalid = firstInvalidChapter(inquiry);
    if (invalid) {
      setErrors(invalid.errors);
      goTo(invalid.chapter);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      if (inquiry.honeypot.trim()) {
        setSent(true);
        clearDraft();
        return;
      }
      const result = await submitBuildInquiry(inquiry, channel);
      if (result.ok) {
        setChannelOpened(true);
        const savedNote = result.stored
          ? 'We also saved a copy of your answers.'
          : 'If the app did not open, copy the brief and send it yourself.';
        setSendHint(
          channel === 'whatsapp'
            ? `WhatsApp should have opened. Tap Send there. ${savedNote}`
            : `Your email app should have opened. Send the message to founder@everburninteractive.com. ${savedNote}`,
        );
      } else {
        setSubmitError(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  }, [goTo, inquiry]);

  const onCopyBrief = useCallback(async () => {
    const copied = await copyBuildInquiry(inquiry);
    setSubmitError('');
    setSendHint(
      copied
        ? 'The brief was copied. Paste it into email or WhatsApp if nothing opened.'
        : 'We could not copy the brief. Select the answers above and copy them yourself.',
    );
  }, [inquiry]);

  const onConfirmSent = useCallback(() => {
    setSent(true);
    setSubmitError('');
    setSendHint('');
    clearDraft();
  }, []);

  const onRestart = useCallback(() => {
    setInquiry(createEmptyInquiry());
    setChapter('arrival');
    setSent(false);
    setSubmitError('');
    setSendHint('');
    setChannelOpened(false);
    clearDraft();
  }, []);

  return (
    <main className="build-root">
      {sceneEnabled ? (
        <SceneErrorBoundary fallback={null}>
          <BuildSceneHost
            chapter={activeChapter}
            inquiry={inquiry}
            progress={progress}
            reducedMotion={reducedMotion}
            hoverKey={hoverKey}
            onIgnite={() => {
              if (activeChapter === 'arrival') {
                goTo('lookingFor');
              }
            }}
          />
        </SceneErrorBoundary>
      ) : null}
      <div className="build-vignette" aria-hidden="true" />
      <p className="build-brand" aria-label="Everburn Interactive LLP">
        <Image src={EverFlame} alt="" className="build-brand-mark" width={64} height={64} priority />
        <span className="build-brand-name">
          <span className="build-brand-word is-flame">Everburn</span>
          <span className="build-brand-word is-ember">Interactive</span>
          <span className="build-brand-word is-arc">LLP</span>
        </span>
      </p>
      <Link href="/" className="build-camp-link">
        Return to camp
      </Link>
      <BuildIntake
        chapter={activeChapter}
        inquiry={inquiry}
        errors={errors}
        submitting={submitting}
        submitError={submitError}
        sendHint={sendHint}
        channelOpened={channelOpened}
        sent={sent}
        progress={progress}
        onChange={patchInquiry}
        onHover={setHoverKey}
        onContinue={onContinue}
        onBack={onBack}
        onSubmit={(channel) => {
          void onSubmit(channel);
        }}
        onCopyBrief={() => {
          void onCopyBrief();
        }}
        onConfirmSent={onConfirmSent}
        onRestart={onRestart}
      />
    </main>
  );
}
