# Design System Strategy: The Spring Editorial

## 1. Overview & Creative North Star

**The Creative North Star: "The Whimsical Curator"**

This design system moves away from the rigid, sterile grids of traditional e-commerce or library apps. Instead, it adopts the persona of a high-end, curated Japanese zine. We are blending the structured clarity of modern UI with the "Wabi-sabi" appreciation for soft edges and organic transitions.

To break the "template" look, we utilize **Intentional Asymmetry**. Images of manga covers or steaming tea should bleed off the edges of containers, and typography should vary in scale to create an editorial rhythm. We avoid "boxed-in" layouts; the UI should feel like a series of soft paper layers fluttering on a tabletop in a spring breeze.

---

## 2. Colors

Our palette is a sophisticated interpretation of a cherry blossom garden. It uses tonal depth rather than high-contrast jarring colors to guide the user’s eye.

- **Primary (#834b58):** A "Dried Rose" hue used for moments of deep intent—active navigation or primary calls to action.

- **Secondary (#006b1f):** A "Fresh Sprout" green, used sparingly to signify growth, availability, or success.

- **Surface & Background (#fef6e7):** A "Warm Parchment" base that prevents the clinical feel of pure white.

### The "No-Line" Rule

**Borders are strictly prohibited for sectioning.** To separate a "New Arrivals" section from a "Featured Manga" section, do not use a line. Instead, shift the background from `surface` to `surface-container-low`. The change in "paper weight" is the only divider you need.

### Surface Hierarchy & Nesting

Treat the UI as physical layers.

- **Base Layer:** `surface`

- **Content Cards:** `surface-container-low`

- **Nested Details (e.g., a search bar inside a header):** `surface-container-highest`

This nesting creates a sense of "carved out" or "stacked" depth that feels premium and tactile.

### The "Glass & Gradient" Rule

For floating elements like "Now Reading" bars or "Add to Cart" buttons, use **Glassmorphism**. Apply `surface_container_lowest` with a 70% opacity and a `24px` backdrop blur. For Hero sections, use a subtle linear gradient from `primary_container` to `surface` at a 45-degree angle to mimic the soft glow of morning sunlight.

---

## 3. Typography

We use a dual-typeface system to balance "Playful Manga Culture" with "Modern Cafe Sophistication."

- **Display & Headline (Plus Jakarta Sans):** A clean, geometric sans-serif with a friendly, open aperture. Use `display-lg` for hero statements. The intentional letter spacing and large x-height feel modern and approachable.

- **Title & Body (Be Vietnam Pro):** A highly legible sans-serif that retains a "hand-crafted" warmth. Its curves mirror our rounded corner philosophy.

**Hierarchy as Identity:** Use `display-md` for manga titles but drop to `label-md` for metadata (like "Chapter 42" or "Published 2023"). This high contrast in scale—not weight—is what creates the editorial "high-end" feel.

---

## 4. Elevation & Depth

In this system, light and shadow are organic, not digital.

- **Tonal Layering:** 90% of your hierarchy should be achieved by placing a light surface (`surface-container-lowest`) on a slightly darker one (`surface-container`).

- **Ambient Shadows:** For elements that _must_ float (like a modal or a FAB), use an extra-diffused shadow: `0px 20px 40px rgba(131, 75, 88, 0.06)`. Note the use of the `primary` color in the shadow to keep it warm and "tinted," never grey.

- **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in a high-glare environment), use the `outline-variant` token at **15% opacity**. It should be a whisper, not a shout.

---

## 5. Components

### Buttons

- **Primary:** Solid `primary` background with `on_primary` text. Use `rounded-full` (pill shape). These are your "Signature" actions.

- **Secondary:** `surface_container_highest` background. No border. This feels like a soft button "pressed into" the page.

- **Tertiary:** Text-only in `primary` color, used for low-emphasis navigation.

### Cards & Lists

- **The "No-Divider" Mandate:** Never use horizontal lines between list items. Use 16px or 24px of vertical white space from our spacing scale.

- **The "Soft Crop":** All images in cards must use the `xl` (3rem) corner radius. This gives the manga art a friendly, collectible feel.

### Input Fields

- **The "Sunken" Look:** Use `surface_container_low` for the input background. When focused, shift to `surface_container_lowest` and apply a 2px `primary` ghost-border at 20% opacity.

### Custom Components: "The Tea Timer"

- **The Steeping Chip:** A specialized chip for "Reading Sessions." Uses a `secondary_container` background with a small SVG icon of a steaming cup. The pill shape should be `rounded-full`.

---

## 6. Do's and Don'ts

### Do

- **Embrace White Space:** Use more margin than you think you need. It suggests a relaxed, "slow-living" cafe atmosphere.

- **Overlap Elements:** Allow a manga character illustration to slightly overlap a text container. It breaks the "web-template" feel.

- **Use Subtle Gradients:** Use a soft gradient from `surface` to `surface_container` to lead the eye down a long scroll.

### Don't

- **Don't use pure black:** Use `on_surface` (#322e25) for text. It's a warm, charcoal-tinted brown that is much easier on the eyes during long reading sessions.

- **Don't use hard corners:** Anything smaller than `md` (1.5rem) should be avoided unless it's a tiny UI element like a checkbox.

- **Don't use standard shadows:** Avoid the "Material Design 1" look of heavy, dark drop shadows. If it looks "3D," it’s too heavy for this "Spring" aesthetic.
