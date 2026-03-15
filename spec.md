# Flip Clock App

## Current State
A flip clock app with clock, alarm, and stopwatch views. The ClockView shows a flip clock and fullscreen toggle. No weather data is displayed.

## Requested Changes (Diff)

### Add
- A weather widget on the ClockView that shows current temperature, weather condition icon/description, and wind speed.
- Geolocation permission request using the browser's `navigator.geolocation` API.
- Weather data fetched from the Open-Meteo API (free, no API key needed) using the user's lat/lng.
- A `useWeather` custom hook that manages geolocation state, permission state, loading, error, and weather data.
- Weather widget shows a "Allow Location" button if permission has not been granted yet.
- Weather widget is displayed below the flip clock in the ClockView.

### Modify
- `ClockView.tsx`: Add the weather widget below the FlipClock component.
- `AppContext.tsx`: No changes needed.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/hooks/useWeather.ts` — handles geolocation request, calls Open-Meteo API (`https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=temperature_2m,windspeed_10m,weathercode&wind_speed_unit=mph`), parses WMO weather codes into human-readable conditions, exposes `{ weather, loading, error, permissionState, requestLocation }`.
2. Create `src/frontend/src/components/WeatherWidget.tsx` — compact widget showing temperature (°C), condition, wind speed; shows "Allow Location" button if no permission; fits the current theme using CSS variables.
3. Update `ClockView.tsx` to render `<WeatherWidget />` below `<FlipClock />`.
