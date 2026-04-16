# Rangewise

**Rangewise** is a lightweight JavaScript/TypeScript utility for formatting date-time ranges into clean, human-friendly, and UX-optimized strings.

It automatically adapts to:
- Context (same day, same month, cross-year)
- Locale (language + formatting)
- Time format (12h / 24h)
- UX conventions (Today, Tomorrow, weekday labels)
- Smart formatting (AM/PM collapsing, compact mode, minute hiding)

---

## ✨ Why Rangewise?

Most date libraries focus on **correctness**.  
Rangewise focuses on **readability and UX clarity**.

Instead of:
16 Apr 2026, 10:00 AM - 12:00 PM

You get:
Today, 10:00–12:00 PM

Or even:
Today, 10–12 PM

---

## 🚀 Features

### 🧠 Context-aware formatting

Automatically adapts output based on range:

- Same minute → `Today, 10:00`
- Same day → `Today, 10:00–12:00`
- Same month → `10–15 Apr 2026`
- Same year → `15 Apr–20 Jun 2026`
- Cross year → `31 Dec 2026–2 Jan 2027`

### 🌍 Localization support

Supports multiple locales:

- English (`en`)
- Spanish (`es`)
- French (`fr`)
- German (`de`)

```ts
formatRangeUX(start, end, "fr-FR");
// Aujourd’hui, 10:00–12:00
```

### 📅 Smart formatting

Automatically uses:

Today
Tomorrow
Yesterday
Weekday (Wed, Mon, etc.)

#### ⏰ Smart time formatting
✅ Auto 12h / 24h detection
```ts
formatRangeUX(start, end, "en-US"); // 12h
formatRangeUX(start, end, "fr-FR"); // 24h
```
#### ✂️ AM/PM collapsing
10:00 AM–11:00 AM → 10:00–11:00 AM

#### 🧩 Compact AM/PM
```ts
formatRangeUX(start, end, "en-US", {
  compactAmPm: true
});
```
10:00am–12:00pm

#### 🧼 Hide minutes (UX polish)
```ts
formatRangeUX(start, end, "en-US", {
  hideMinutes: true
});
```
10–12 PM

### 🎛 Configurable options
```ts
formatRangeUX(start, end, locale, {
  spaced: false,        // 10:00–12:00 vs 10:00 – 12:00
  hour12: undefined,    // auto-detect (or force true/false)
  compactAmPm: false,   // 10am vs 10 AM
  hideMinutes: false,   // 10 vs 10:00
});
```

## 📦 Installation
```bash
npm install rangewise
```

$$ 🛠 Usage
```ts
import { formatRangeUX } from "rangewise";

const start = new Date("2026-04-16T10:00:00");
const end = new Date("2026-04-16T12:00:00");

formatRangeUX(start, end);
// Today, 10:00–12:00
```
### 🌍 With locale
```ts
formatRangeUX(start, end, "es-ES");
// Hoy, 10:00–12:00
```
### ⚙️ With options
```ts
formatRangeUX(start, end, "en-US", {
  compactAmPm: true,
  hideMinutes: true
});
// Today, 10–12pm
```
## 🧪 Testing

Rangewise supports deterministic testing using a fixed now value:
```ts
formatRangeUX(start, end, "en-IN", {
  now: new Date("2026-04-16T09:00:00")
});
```
This ensures:

Stable test results
No dependency on system time
⚠️ Important Notes
12:00 is PM, not AM
Relative labels depend on now
Locale affects:
Time format
Week start
Language

## 🧠 Design Philosophy

Rangewise is built around UX-first formatting, not just correctness.

Key principles:

- Reduce cognitive load
- Avoid redundancy
- Adapt to context
- Respect user locale
- Keep output scannable
- 🗺 Roadmap
- [ ] Minute precision controls
- [ ] Timezone support
- [ ] Custom label injection
- [ ] Full i18n expansion
- [ ] Range summarization (e.g., "3h")

##🤝 Contributing

Contributions are welcome!

- Improve locale support
- Add formatting rules
- Enhance performance
- Suggest UX improvements

## 📄 License

MIT License

## 💡 Author

Built with a focus on UX clarity and real-world usage, not just date correctness.


---

If you want, next I can:
- Add **npm + GitHub badges (looks much more legit)**
- Write a **short punchy tagline for your repo header**
- Help you **publish this to npm (final step 🚀)**
