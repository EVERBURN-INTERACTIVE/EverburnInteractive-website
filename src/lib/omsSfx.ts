export type OmsSfxId =
  | 'buttonHover'
  | 'buttonClick'
  | 'death'
  | 'fragment'
  | 'gameOver'
  | 'nearMiss'
  | 'rewind'
  | 'timerTick'
  | 'timerFinalTick';

const OMS_SFX_SRC: Record<OmsSfxId, string> = {
  buttonHover: '/audio/button-hover.wav',
  buttonClick: '/audio/button-click.wav',
  death: '/audio/death.wav',
  fragment: '/audio/fragment-collected.wav',
  gameOver: '/audio/game-over.wav',
  nearMiss: '/audio/near-miss.wav',
  rewind: '/audio/rewind.wav',
  timerTick: '/audio/timer-tick.wav',
  timerFinalTick: '/audio/timer-final-tick.wav',
};

const SFX_VOLUME = 0.72;
const templates = new Map<OmsSfxId, HTMLAudioElement>();

function templateFor(id: OmsSfxId): HTMLAudioElement {
  let track = templates.get(id);
  if (!track) {
    track = new Audio(OMS_SFX_SRC[id]);
    track.preload = 'auto';
    templates.set(id, track);
  }
  return track;
}

/** Decode SFX up front so the first crash/near-miss is not a late fetch. */
export function preloadOmsSfx(): void {
  if (typeof Audio === 'undefined') {
    return;
  }
  (Object.keys(OMS_SFX_SRC) as OmsSfxId[]).forEach((id) => {
    templateFor(id);
  });
}

export function playOmsSfx(id: OmsSfxId): void {
  if (typeof Audio === 'undefined') {
    return;
  }
  const shot = templateFor(id).cloneNode(true) as HTMLAudioElement;
  shot.volume = SFX_VOLUME;
  void shot.play().catch(() => {
    /* autoplay may block until a click; later events retry */
  });
}

export function bindOmsButtonSfx(button: HTMLElement): () => void {
  const onHover = () => playOmsSfx('buttonHover');
  const onClick = () => playOmsSfx('buttonClick');
  button.addEventListener('pointerenter', onHover);
  button.addEventListener('click', onClick);
  return () => {
    button.removeEventListener('pointerenter', onHover);
    button.removeEventListener('click', onClick);
  };
}
