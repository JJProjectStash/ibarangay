# Accessibility Audit - Checklist

This document will track the accessibility audit tasks to be completed for the iBarangay web application.

## Scope
- Ensure keyboard navigation works across the application.
- ARIA attributes are added where needed.
- Color contrast meets WCAG AA.
- Focus management for modals and popovers.
- Screen reader-friendly announcements for dynamic content.

## Audit Checklist
- [ ] Navbar keyboard navigation and focus indicators (`src/components/Navbar.tsx`)
- [ ] Mobile nav touch targets and keyboard accessibility (`src/components/MobileBottomNav.tsx`)
- [ ] Forms (`src/components/EnhancedInput.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx`)
- [ ] Modals & focus trap (`src/components/ConfirmDialog.tsx`, `src/components/FileUpload.tsx`)
- [ ] Toast & notifications (`src/components/Toast.tsx`, `src/components/NotificationBell.tsx`) - aria-live, role, and content announced properly
 - [x] Toast & notifications (`src/components/Toast.tsx`, `src/components/NotificationBell.tsx`) - aria-live, role, and content announced properly (NotificationBell: aria-live sr-only region added; toasts use role=alert for errors)
- [ ] Skeleton loaders - ensure they are aria-hidden and using semantic HTML where possible
- [ ] Status badges - ensure they do not rely on color alone and have proper labels
- [ ] Color contrast checks using Lighthouse / AXE for top pages (Home, Dashboard, Services, Complaints)
- [ ] Semantic HTML - ensure proper landmarks (`nav`, `main`, `aside`) and heading hierarchy

## Quick Wins
 - Add `aria-hidden="true"` to decorative icons in nav items and buttons.
 - Ensure `sr-only` labels for icon-only action buttons.
- Add `aria-live="polite"` to toast announcements.
- Ensure `sr-only` labels for icon-only action buttons.

## Notes
- When an accessibility change is implemented, increment the 'Progress Update' section in the UI-UX plan and update the checklist.

---
