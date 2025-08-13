# TVUPWEB Style Guide

> Last Updated: November 2024  
> Version: 1.0.0

## 🎨 Design Philosophy

Our design system focuses on creating a modern, vibrant, and professional user experience with:
- **Gradient-first approach**: Using purple-blue gradients as primary brand colors
- **Glass morphism**: Translucent elements with backdrop blur for depth
- **Smooth animations**: Subtle micro-interactions for better UX
- **Dark mode optimized**: Deep purple-black backgrounds with neon accents

## 🎭 Color Palette

### Primary Colors
```css
/* Light Mode */
--primary: hsl(262, 80%, 50%);        /* Vibrant Purple */
--primary-foreground: hsl(0, 0%, 100%); /* White */

/* Dark Mode */
--primary: hsl(270, 100%, 65%);       /* Neon Purple */
--primary-foreground: hsl(260, 40%, 5%); /* Deep Purple-Black */
```

### Secondary Colors
```css
/* Light Mode */
--secondary: hsl(270, 50%, 94%);      /* Soft Lavender */
--secondary-foreground: hsl(262, 80%, 35%); /* Dark Purple */

/* Dark Mode */
--secondary: hsl(265, 30%, 18%);      /* Deep Purple */
--secondary-foreground: hsl(270, 100%, 75%); /* Light Purple */
```

### Accent Colors
```css
/* Light Mode */
--accent: hsl(190, 90%, 50%);         /* Cyan */

/* Dark Mode */
--accent: hsl(180, 100%, 45%);        /* Neon Cyan */
```

### Semantic Colors
```css
/* Destructive/Error */
--destructive: hsl(350, 89%, 60%);    /* Coral Red (Light) */
--destructive: hsl(340, 90%, 55%);    /* Hot Pink (Dark) */

/* Success */
--success: hsl(142, 71%, 45%);        /* Green */

/* Warning */
--warning: hsl(38, 92%, 50%);         /* Amber */
```

### Background Colors
```css
/* Light Mode */
--background: hsl(0, 0%, 100%);       /* Pure White */
--card: hsl(0, 0%, 100%);             /* Card White */

/* Dark Mode */
--background: hsl(260, 40%, 5%);      /* Deep Purple-Black */
--card: hsl(260, 35%, 8%);            /* Slightly Lighter Purple */
```

## 🔤 Typography

### Font Families
```css
--font-family-sans: 'Inter', system-ui, sans-serif;      /* Body text */
--font-family-display: 'Outfit', system-ui, sans-serif;  /* Headings */
--font-family-mono: 'JetBrains Mono', monospace;        /* Code */
```

### Font Sizes
```css
/* Display Sizes */
--display-lg: 4rem;    /* 64px - Hero headings */
--display-md: 3rem;    /* 48px - Page titles */
--display-sm: 2rem;    /* 32px - Section headings */

/* Body Sizes */
--text-xl: 1.25rem;    /* 20px */
--text-lg: 1.125rem;   /* 18px */
--text-base: 1rem;     /* 16px - Default */
--text-sm: 0.875rem;   /* 14px */
--text-xs: 0.75rem;    /* 12px */
```

### Font Weights
- `400` - Regular (body text)
- `500` - Medium (emphasized text)
- `600` - Semibold (buttons, labels)
- `700` - Bold (headings)
- `800` - Extra Bold (display text)

## 🔘 Buttons

### Button Variants

#### Default (Primary Gradient)
```svelte
<Button variant="default">Primary Action</Button>
```
- Background: Gradient from primary to accent
- Hover: Scale 105%, increased shadow
- Use for: Primary CTAs, submit buttons

#### Gradient (Multi-color)
```svelte
<Button variant="gradient">Special Action</Button>
```
- Background: Purple → Pink → Red gradient
- Hover: Scale 105%, enhanced shadow
- Use for: Premium features, special actions

#### Glow
```svelte
<Button variant="glow">Attention Action</Button>
```
- Background: Primary with glow shadow
- Animation: Pulsing glow effect
- Use for: Important notifications, alerts

#### Glass
```svelte
<Button variant="glass">Glass Action</Button>
```
- Background: Translucent white/10
- Border: White/20 with backdrop blur
- Use for: Over images, dark backgrounds

#### Outline
```svelte
<Button variant="outline">Secondary Action</Button>
```
- Background: Transparent
- Border: 2px primary color
- Use for: Secondary actions, cancel buttons

### Button Sizes
- `sm`: Height 36px, padding 16px, text 12px
- `default`: Height 44px, padding 24px, text 14px
- `lg`: Height 56px, padding 32px, text 16px
- `xl`: Height 64px, padding 40px, text 18px

## 📐 Spacing System

### Base Unit: 4px
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## 🎯 Border Radius

```css
--radius-sm: 0.5rem;   /* 8px - Small elements */
--radius-md: 0.75rem;  /* 12px - Default */
--radius-lg: 1rem;     /* 16px - Cards */
--radius-xl: 1.5rem;   /* 24px - Large cards */
--radius-2xl: 2rem;    /* 32px - Hero sections */
--radius-full: 9999px; /* Pills, circles */
```

## 🌊 Shadows

```css
/* Elevation Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Glow Shadows */
--shadow-glow: 0 0 20px rgba(primary, 0.35);
--shadow-glow-lg: 0 0 40px rgba(primary, 0.35);
--shadow-inner-glow: inset 0 0 20px rgba(primary, 0.15);
```

## ✨ Animations

### Transition Durations
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Easing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Common Animations
- `fade-in`: Opacity 0→1 with slight upward movement
- `slide-in`: Slide from left with fade
- `shimmer`: Diagonal shine effect for loading states
- `glow`: Pulsing opacity for attention
- `scale`: Hover scale effect (1.05x)

## 🎭 Component Patterns

### Cards
```svelte
<div class="bg-gradient-to-br from-white/10 via-white/5 to-transparent 
            backdrop-blur-xl border border-white/10 rounded-3xl 
            shadow-2xl overflow-hidden">
  <!-- Card content -->
</div>
```

### Input Fields
```svelte
<div class="relative group">
  <div class="absolute inset-0 bg-gradient-to-r from-primary to-accent 
              rounded-xl opacity-0 group-focus-within:opacity-50 
              blur transition duration-300"></div>
  <Input className="relative bg-white/5 border-white/10 text-white 
                    rounded-xl h-12 focus:bg-white/10" />
</div>
```

### Glass Effects
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(to right, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## 📱 Responsive Design

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### Mobile-First Approach
- Start with mobile layout
- Use `sm:`, `md:`, `lg:` prefixes for larger screens
- Touch-friendly tap targets (min 44x44px)
- Larger fonts and spacing on mobile

## 🎯 Best Practices

### Do's ✅
- Use semantic color variables (primary, secondary, etc.)
- Maintain consistent spacing using the scale
- Apply hover/focus states to all interactive elements
- Use appropriate button variants for context
- Include loading states for async operations
- Add subtle animations for better UX

### Don'ts ❌
- Don't use hard-coded colors
- Avoid mixing different border radius styles
- Don't skip focus states for accessibility
- Avoid too many gradient elements on one page
- Don't use animations that are too fast (<150ms) or slow (>1s)

## 🔄 Version History

### v1.0.0 (November 2024)
- Initial style guide creation
- Purple-cyan gradient color scheme
- Glass morphism design patterns
- Modern button variants (gradient, glow, glass)
- Inter + Outfit font combination
- Comprehensive animation system

---

*This style guide is a living document. Update it whenever design decisions change.*