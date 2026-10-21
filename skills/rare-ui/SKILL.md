---
name: rare-ui
description: Collection of rare, ready-to-use animated components and unconventional interactions from Rare UI (rareui.com) for React, Next.js, and Tailwind CSS. Use when building motion UI, playful interactions, micro-animations, or specialized components via the shadcn CLI (`swamimalode07/rare-ui/<component>`) or directly from the local repository.
metadata:
  short-description: Animated components and rare interactions from Rare UI
---

# Rare UI

A curated shadcn registry of rare, animated, ready-to-use React components created by [@swamimalode](https://x.com/swamimalode).
Official site: [rareui.com](https://rareui.com) | Components catalog: [rareui.com/components](https://rareui.com/components)

Every component is animated with Motion (`motion` / Framer Motion), honors `prefers-reduced-motion`, and integrates directly into any React / Next.js project styled with Tailwind CSS.

---

## When to Use

Apply this skill when:
- Designing or coding unconventional, delightful, or experimental micro-interactions.
- Adding high-polish interactive widgets: gooey navigations, animated odometer counters, morphing drawers, fluid WebGL orbs, AI status indicators, or gravity physics.
- Seeking alternatives to generic components for drawers, sidebar rails, duration pickers, OTP inputs, or task lists.

---

## Installation & Usage

### Method 1: Direct shadcn CLI (Recommended for external projects)

Install any component directly via the official GitHub registry:

```bash
npx shadcn@latest add swamimalode07/rare-ui/<component-name>
# or with pnpm
pnpm dlx shadcn@latest add swamimalode07/rare-ui/<component-name>
# or with bun
bunx --bun shadcn@latest add swamimalode07/rare-ui/<component-name>
```

Example:
```bash
npx shadcn@latest add swamimalode07/rare-ui/fluid-orb
```

### Method 2: Configure in `components.json`

Add the Rare UI registry to your project's `components.json`:

```json
{
  "registries": {
    "@rare-ui": "https://raw.githubusercontent.com/swamimalode07/rare-ui/main/public/r/{name}.json"
  }
}
```

Then install using the `@rare-ui` prefix:

```bash
npx shadcn@latest add @rare-ui/family-drawer
```

### Method 3: Direct Local Source (Within this workspace)

Since the complete Rare UI codebase is cloned locally in `.agents/skills/rare-ui/`:
- UI component source files are located in: `.agents/skills/rare-ui/components/ui/`
- You can inspect, adapt, or copy `.tsx` files directly into your project's `components/ui/` directory.

---

## Component Catalog & Cheat Sheet

| Component Slug | Name | Description & Key Use Cases | Dependencies |
| :--- | :--- | :--- | :--- |
| **`fluid-orb`** | Fluid Orb | Animated WebGL orb with drifting fluid shading and custom color/size props. Great for hero sections or AI listening states. | `motion` |
| **`matrix-orb`** | Matrix Orb | Dot-matrix LED orb that transitions between idle, listening, and thinking states. Perfect for AI assistants and voice agents. | `motion` |
| **`family-drawer`** | Family Drawer | iOS-inspired bottom drawer with smooth morphing transitions between stacked views (based on Vaul). | `motion`, `vaul` |
| **`gooey-nav`** | Gooey Nav | Liquid navigation bar where the active pill stretches and detaches with gooey spring physics. | `motion` |
| **`bounce-sidebar`** | Bounce Sidebar | Vertical navigation rail with a bouncy, spring-animated active indicator pill. | `motion` |
| **`hook-sidebar`** | Hook Sidebar | Minimalist vertical navigation list with a dashed rail tracking the active item. | `motion` |
| **`proximity-sidebar`** | Proximity Sidebar | Dash-style scroll sidebar whose items dynamically expand as the pointer gets closer. | `motion` |
| **`animated-counter`** | Animated Counter | Odometer-style numeric roll animation when numbers or financial values update. | `motion` |
| **`duration-picker`** | Duration Picker | Gooey spring-animated selector for hours and minutes with squircle cards. | `motion`, `figma-squircle`, `flubber` |
| **`otp-input`** | OTP Input | Verification code input where numbers roll into place with a sliding caret indicator. | `motion` |
| **`folder-component`** | Folder Component | 3D interactive folder: cards fan out on hover and lift open when clicked. | `motion` |
| **`step-player`** | Step Player | iOS-style stepped progress track with play, pause, and replay controls. | `motion` |
| **`voice-note`** | Voice Note | Audio message player with a scrubbable waveform and interactive playhead. | `motion` |
| **`task-list`** | Task List | Interactive checklist that animates striking out finished items and drops them to the bottom. | `motion` |
| **`emoji-reaction`** | Emoji Reaction | Tapback-style reaction button opening an Apple-style emoji dock. | `motion` |
| **`notification-bell`**| Notification Bell | iOS-style ringing bell icon with unread count badge animation. | `motion` |
| **`delete-button`** | Delete Button | Inline two-step confirmation button ("Delete" -> "Are you sure?") without opening a modal. | `motion` |
| **`gravity-letters`** | Gravity Letters | Physics simulation where characters, letters, or emojis drop and bounce under gravity. | `motion` |
| **`scroll-progress`** | Scroll Progress | Reading progress indicator pill that dynamically expands into a squircle shape. | `motion` |
| **`code-block`** | Code Block | Clean syntax-highlighted code block generated from a single accent color. | `motion` |
| **`grid-reveal`** | Grid Reveal | Shimmering grid placeholder for AI image generation that smoothly reveals the final image. | `motion` |
| **`github-activity`** | GitHub Activity | Contribution heatmap with an expandable stats and ranking card. | `motion` |

---

## License & Attribution Rule

Rare UI is licensed under **MIT with Commons Clause & Attribution**:
- You can freely use, modify, and ship these components in personal or commercial projects.
- **Attribution is required:** Visible credit with a link to `rareui.com` must be maintained in the footer, credits screen, or README of the project utilizing Rare UI components.
