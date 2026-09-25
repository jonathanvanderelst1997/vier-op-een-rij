# Accessibility review — 15 augustus 2026

Resultaat: `PASS_AFTER_FOCUSED_FIXES`, pending local/browser execution.

Reviewed: R/G non-color markers, live status, keyboard column controls, disabled states, 44px controls, mobile grid sizing and focus behavior.

Concrete fixes applied in this review:
- full columns are disabled in both column controls and board cells;
- focus is restored to the same usable column (or first available fallback) after re-render instead of disappearing when controls are rebuilt;
- invalid/full moves leave the board unchanged and retain the same player's turn;
- winner/draw states move focus to the restart control.

The column buttons are the primary keyboard path. Board cells remain native buttons with descriptive labels, so button semantics are preserved rather than overwritten with a partial ARIA-grid keyboard model. R/G text supplements red/yellow color.

Still requires one real browser pass before merge: 320–390px mobile width, 200% zoom, keyboard-only play, screen-reader status announcement and focus visibility. No claim of formal WCAG conformance.
