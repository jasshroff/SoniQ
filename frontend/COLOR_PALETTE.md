# SoniQ Color Palette

## Primary Colors

### Background Colors
- **Light Background**: `#faf2d0` - Light beige/cream used for main page background
- **White Background**: `#ffffff` - Used for cards, widgets, and sidebar

### Brand Colors
- **Primary (Navy Blue)**: `#243061` - Used for primary text, headers, and key UI elements
- **Secondary (Mauve)**: `#984565` - Used for secondary text and accents
- **Accent (Orange)**: `#ea9e54` - Used for highlights, active states, buttons, and interactive elements

## Text Colors
- **Primary Text**: `#243061` (Navy Blue)
- **Secondary Text**: `#984565` (Mauve)
- **Muted Text**: `#6b5d7a` (Lighter purple-grey)

## UI Elements
- **Border**: `#e8dfc0` - Subtle borders and dividers
- **Hover State**: `#f5ecc8` - Hover background for interactive elements

## Usage Guidelines

### Backgrounds
- Main page: `#faf2d0`
- Cards/Widgets: `#ffffff`
- Hover states: `#f5ecc8`

### Text
- Headings & Primary: `#243061`
- Body & Secondary: `#984565`
- Disabled/Muted: `#6b5d7a`

### Interactive Elements
- Active/Selected: `#ea9e54`
- Buttons (Primary): `#ea9e54`
- Links: `#243061`
- Icons (Active): `#ea9e54`

### Accents
- Progress bars: Rotate between `#ea9e54`, `#243061`, `#984565`
- Badges/Tags: `#ea9e54`
- Highlights: `#ea9e54`

## CSS Variables

All colors are available as CSS custom properties in `src/styles/global.css`:

```css
--color-bg-light: #faf2d0
--color-bg-white: #ffffff
--color-primary: #243061
--color-secondary: #984565
--color-accent: #ea9e54
--color-text-primary: #243061
--color-text-secondary: #984565
--color-text-muted: #6b5d7a
--color-border: #e8dfc0
--color-hover: #f5ecc8
```

## Accessibility

Contrast ratios (WCAG 2.1 standards):
- Primary text (#243061) on light background (#faf2d0): **11.18:1** ✓ (Excellent - AAA)
- Secondary text (#984565) on light background (#faf2d0): **5.54:1** ✓ (Good - AA)
- Primary text (#243061) on white (#ffffff): **12.57:1** ✓ (Excellent - AAA)
- Accent (#ea9e54) on white background (#ffffff): **2.21:1** ⚠️ (Use for decorative elements only)
- Accent (#ea9e54) on light background (#faf2d0): **1.96:1** ⚠️ (Use for decorative elements only)

**Note**: The orange accent (#ea9e54) should be used primarily for:
- Interactive elements (buttons, icons) where color is not the only indicator
- Progress bars and decorative elements
- Backgrounds for elements with dark text