# Design System Document: The Editorial Glow

## 1. Overview & Creative North Star: "The Digital Atelier"
The Creative North Star for this design system is **The Digital Atelier**. Unlike standard utility apps that feel like rigid spreadsheets, this system is designed to feel like a high-end editorial magazine or a boutique personal consultation. 

We move away from "template" layouts by embracing **The Editorial Grid**—a philosophy that prioritizes intentional asymmetry, generous white space (the "luxury of breath"), and layered compositions. By overlapping elements and using high-contrast typography scales, we transform a simple management tool into a premium, aspirational experience. The interface doesn't just show data; it curates an aesthetic journey.

## 2. Colors: Tonal Depth & Vibrancy
Our palette is rooted in the organic warmth of `surface` (#fcf9f4) and the grounded stability of `secondary` (#515f74). The "vibrant accent" is found in our `primary` (#a13f20) and `tertiary` (#006a60) tokens, used to spark motivation and highlight progress.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To maintain a premium, seamless feel, you must never use 1px solid lines to separate content. Boundaries are defined exclusively through background color shifts. For example, a `surface-container-low` section should sit directly against a `surface` background to create a soft, edge-less transition.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine vellum.
- **Base Layer:** `surface`
- **Sectional Layer:** `surface-container-low`
- **Interactive/Floating Layer:** `surface-container-lowest` (for maximum "lift")
- **Emphasis Layer:** `surface-container-high` (for nested content that needs to feel inset)

### The "Glass & Gradient" Rule
To elevate the experience beyond flat design:
- **Glassmorphism:** For floating navigation bars or modals, use semi-transparent `surface` colors with a 20px-40px backdrop-blur. 
- **Signature Textures:** For primary CTAs and hero headers, use a subtle linear gradient transitioning from `primary` (#a13f20) to `primary_container` (#e97451) at a 135-degree angle. This adds "soul" and depth that static hex codes cannot achieve.

## 3. Typography: The Sophisticated Dialogue
The system uses a deliberate tension between the classicism of **Noto Serif** and the modern precision of **Manrope**.

- **Display & Headlines (Noto Serif):** These are our "Editorial Voices." They should be used for large, welcoming headers and milestone titles. Use `display-lg` to `headline-sm` to create a sense of authoritative elegance.
- **Body & Labels (Manrope):** Our "Functional Voice." Used for all instructional text, data entry, and navigation. Manrope’s clean geometry ensures that even at `body-sm`, the UI remains highly readable and approachable.
- **Hierarchy Tip:** Always pair a large `headline-lg` with a significantly smaller `body-md` to create high-contrast layouts that feel curated rather than cluttered.

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines; we use light and shadow.

- **The Layering Principle:** Achieve depth by "stacking." Place a `surface-container-lowest` card on top of a `surface-container` background. This creates a natural, soft lift.
- **Ambient Shadows:** When an element must "float" (like a FAB or a modal), use an extra-diffused shadow.
    - **Blur:** 24px - 48px
    - **Opacity:** 4% - 6%
    - **Color:** Use a tinted version of `on-surface` (#1c1c19) rather than pure black to mimic natural light.
- **The "Ghost Border" Fallback:** If a container absolutely requires a boundary for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "whisper" of a line rather than a hard edge.

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) rounded corners, white text (`on-primary`).
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Ghost style. No background, `primary` text, bold `label-md` typography.

### Cards & Lists
- **The Rule:** Forbid divider lines.
- **Implementation:** Separate list items using vertical white space (use the 16px or 24px spacing increments) or by alternating background tones between `surface` and `surface-container-low`.
- **Corner Radius:** Cards must use `xl` (1.5rem) to feel friendly and modern.

### Selection Chips
- **State:** Unselected chips use `surface-container-high`. Selected chips use `tertiary` with `on-tertiary` text.
- **Shape:** `full` (9999px) roundness for a soft, pebble-like feel.

### Input Fields
- **Style:** Use "Soft Inset" styling. A `surface-container-highest` background with a `sm` (0.25rem) corner radius. 
- **Focus:** Transition the background to `surface-container-lowest` and add a 2px `primary` "Ghost Border" (20% opacity).

### Specialized Components: The Progress "Halo"
For appearance tracking, use a large-scale circular progress indicator using a `tertiary` to `tertiary_container` gradient. This serves as a visual centerpiece, reinforcing the "glow" theme through soft glows and blurred background accents.

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins (e.g., 24px left, 40px right) for hero sections to create an editorial feel.
- **Do** use `display-lg` typography for numbers and metrics to make them feel like "achievements."
- **Do** maximize white space. If a layout feels "busy," increase the padding by 50%.

### Don't
- **Don't** use 100% opaque black for text. Always use `on-surface` (#1c1c19).
- **Don't** use sharp 90-degree corners. Everything must feel "held" and approachable.
- **Don't** use standard "Drop Shadows" from a UI kit. They are too heavy. Use the Ambient Shadow guidelines in Section 4.
- **Don't** use dividers to separate content blocks. Trust the tonal shifts between surfaces.