const RAIL_GAP_FALLBACK = 20;

/** Width of one card plus the gap, used as a single slideshow step. */
export function railStep(rail: HTMLElement, cardSelector: string): number {
  const card = rail.querySelector<HTMLElement>(cardSelector);
  const gap = parseFloat(getComputedStyle(rail).columnGap) || RAIL_GAP_FALLBACK;
  return (card?.offsetWidth ?? 320) + gap;
}

export function isRailScrollable(rail: HTMLElement): boolean {
  return getComputedStyle(rail).overflowX !== 'visible' && rail.scrollWidth > rail.clientWidth + 1;
}

/**
 * Moves a rail by one card. When the rail is pinned and driven by page scroll
 * (desktop), it scrolls the page instead so both stay in sync.
 */
export function moveRail(rail: HTMLElement, cardSelector: string, direction: number, wrap = false): void {
  const step = railStep(rail, cardSelector);
  if (!isRailScrollable(rail)) {
    window.scrollBy({ top: direction * step, behavior: 'smooth' });
    return;
  }
  const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  const atStart = rail.scrollLeft <= 4;
  if (wrap && direction > 0 && atEnd) return rail.scrollTo({ left: 0, behavior: 'smooth' });
  if (wrap && direction < 0 && atStart) return rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' });
  rail.scrollBy({ left: direction * step, behavior: 'smooth' });
}
