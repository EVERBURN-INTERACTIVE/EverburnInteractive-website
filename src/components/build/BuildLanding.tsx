'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BuildIntake } from '@/components/build/BuildIntake';
import { SceneErrorBoundary } from '@/components/ui/SceneErrorBoundary';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { WebGLFallback } from '@/components/ui/WebGLFallback';
import {
  BUILD_DRAFT_KEY,
  createEmptyInquiry,
  getChapterSequence,
  firstInvalidChapter,
  validateChapter,
  type BuildInquiry,
  type ChapterErrors,
  type ChapterId,
} from '@/lib/buildInquiry';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { submitBuildInquiry } from '@/lib/submitBuildInquiry';

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
      inquiry: { ...createEmptyInquiry(), ...parsed.inquiry },
      chapter: parsed.chapter,
    };
  } catch {
    return null;
  }
}

export function BuildLanding() {
  const reducedMotion = useReducedMotion();
  const [supportsWebGl] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  });
  const [inquiry, setInquiry] = useState<BuildInquiry>(createEmptyInquiry);
  const [chapter, setChapter] = useState<ChapterId>('arrival');
  const [errors, setErrors] = useState<ChapterErrors>({});
  const [hoverKey, setHoverKey] = useState('');
  const [worldReady, setWorldReady] = useState(false);
  const [forceLoaded, setForceLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  const sequence = useMemo(() => getChapterSequence(inquiry), [inquiry]);
  const activeChapter = sequence.includes(chapter) ? chapter : 'budget';
  const chapterIndex = Math.max(0, sequence.indexOf(activeChapter));
  const progress = sent ? 1 : chapterIndex / Math.max(sequence.length - 1, 1);

  useEffect(() => {
    document.documentElement.classList.add('build-forge');
    const timeout = window.setTimeout(() => setForceLoaded(true), 5000);
    const draft = readDraft();
    if (draft) {
      setInquiry(draft.inquiry);
      setChapter(draft.chapter);
    }
    setDraftReady(true);
    return () => {
      document.documentElement.classList.remove('build-forge');
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!draftReady || sent) {
      return;
    }
    const payload: StoredDraft = { inquiry, chapter: activeChapter };
    window.localStorage.setItem(BUILD_DRAFT_KEY, JSON.stringify(payload));
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
    const nextErrors = validateChapter(activeChapter, inquiry);
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

  const onSubmit = useCallback(async () => {
    const invalid = firstInvalidChapter(inquiry);
    if (invalid) {
      setErrors(invalid.errors);
      goTo(invalid.chapter);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitBuildInquiry(inquiry);
      if (result.ok) {
        setSent(true);
        window.localStorage.removeItem(BUILD_DRAFT_KEY);
      } else {
        setSubmitError(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  }, [goTo, inquiry]);

  const onRestart = useCallback(() => {
    setInquiry(createEmptyInquiry());
    setChapter('arrival');
    setSent(false);
    setSubmitError('');
    window.localStorage.removeItem(BUILD_DRAFT_KEY);
  }, []);

  if (!supportsWebGl) {
    return <WebGLFallback />;
  }

  return (
    <main className="build-root">
      <SceneErrorBoundary>
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
          onReady={() => setWorldReady(true)}
        />
      </SceneErrorBoundary>
      <LoadingScreen loaded={worldReady} force={forceLoaded} progress={worldReady || forceLoaded ? 100 : 28} />
      <div className="build-vignette" aria-hidden="true" />
      <p className="build-brand">Everburn</p>
      <Link href="/" className="build-camp-link">
        Return to camp
      </Link>
      <BuildIntake
        chapter={activeChapter}
        inquiry={inquiry}
        errors={errors}
        submitting={submitting}
        submitError={submitError}
        sent={sent}
        progress={progress}
        onChange={patchInquiry}
        onHover={setHoverKey}
        onContinue={onContinue}
        onBack={onBack}
        onSubmit={() => {
          void onSubmit();
        }}
        onRestart={onRestart}
      />
    </main>
  );
}
