# Flip Clock App

## Current State
New project. No existing frontend or backend logic.

## Requested Changes (Diff)

### Add
- Flip clock display with CSS flip-card animations for hours, minutes, seconds
- 5 themes: Dark Minimal, Neon Glow, Vintage Wood, Pastel Light, Cyberpunk
- Alarm manager: create/delete alarms with labels, time, AM/PM or 24h format, trigger UI
- Stopwatch: start/pause/reset, lap recording, milliseconds display
- Bottom tab navigation (Clock, Alarm, Stopwatch) on mobile; sidebar on desktop
- Settings panel: 12/24h toggle, theme selector, animation toggle
- Mobile-first responsive layout

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Create theme system with 5 color palettes stored in a React context
2. Build FlipCard component with CSS keyframe flip animation
3. Build FlipClock composed of FlipCard digits for HH:MM:SS
4. Build ClockView using FlipClock with live time
5. Build AlarmView: alarm list, add/edit alarm modal, trigger overlay
6. Build StopwatchView: timer logic, lap list
7. Build SettingsPanel: theme picker, 12/24h toggle, animation toggle
8. Build bottom tab bar + desktop sidebar navigation
9. Wire all views together with a shared app state (theme, format, alarms)
