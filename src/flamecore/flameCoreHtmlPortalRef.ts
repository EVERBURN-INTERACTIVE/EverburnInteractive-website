import type { RefObject } from 'react';

/** Portal element for drei `<Html>`; assigned when FlameCoreR3FHost mounts. */
export const flameCoreHtmlPortalRef: { current: HTMLDivElement | null } = {
  current: null,
};

export const flameCoreHtmlPortalForDrei = flameCoreHtmlPortalRef as RefObject<HTMLElement>;
