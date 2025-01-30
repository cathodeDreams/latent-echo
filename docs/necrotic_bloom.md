# Necrotic Bloom

![Necrotic Bloom Color System](necroticBloom-enhanced.svg)

A monochromatic color system designed for Latent Echo, emphasizing readability and accessibility.

## Color Architecture

### Foundation Colors
| Color Name     | Hex Code | RGB           | HSL                  | WCAG Contrast |
|---------------|----------|---------------|----------------------|---------------|
| Fungal Black  | `#1A1B1C` | 26, 27, 28   | 210°, 4%, 11%       | Base         |
| Bio Lavender  | `#E6D7F3` | 230, 215, 243| 270°, 53%, 90%      | 15.8:1       |
| Dark Lavender | `#9B87AB` | 155, 135, 171| 276°, 17%, 60%      | 7.5:1        |
| Dark Void     | `#0D0E0E` | 13, 14, 14   | 180°, 4%, 5%        | 19.1:1       |
| Light Void    | `#999999` | 153, 153, 153| 0°, 0%, 60%         | 4.5:1        |
| Spore Gray    | `#9BA0A3` | 155, 160, 163| 204°, 3%, 62%       | 4.8:1        |
| Dark Spore    | `#4D5052` | 77, 80, 82   | 204°, 3%, 31%       | 9.8:1        |
| Shadow Mint   | `#7A9B89` | 122, 155, 137| 147°, 14%, 54%      | 5.9:1        |
| Necrotic Green| `#4B9900` | 75, 153, 0   | 90°, 100%, 30%      | 6.2:1        |

### Theme Mappings
| Purpose       | Light Mode   | Dark Mode    | Usage Context                    |
|--------------|-------------|--------------|----------------------------------|
| Background   | Light Void   | Dark Void    | Page background                 |
| Text         | Fungal Black | Dark Lavender| Primary content                 |
| Links        | Dark Spore   | Shadow Mint  | Interactive elements           |
| Accents      | Spore Gray   | Dark Spore   | UI elements, borders           |
| Borders      | Dark Spore   | Dark Spore   | Containers, separators         |
| Logo         | Necrotic Green| Shadow Mint  | Branding elements              |

### Animation Colors
| Purpose       | Light Mode   | Dark Mode    | Usage Context                    |
|--------------|-------------|--------------|----------------------------------|
| Wireframe    | Necrotic Green| Shadow Mint  | Primary animation elements      |
| Wireframe Pulse| Shadow Mint | Dark Spore   | Animation state transitions     |
| Sphere       | Dark Lavender| Dark Lavender| Secondary animation elements    |
| Sphere Pulse | Bio Lavender | Dark Spore   | Secondary state transitions     |

### Accessibility Guidelines
- All text color combinations meet WCAG 2.1 Level AA standards
- Normal text maintains 4.5:1 minimum contrast ratio
- Large text (18pt+) maintains 3:1 minimum contrast ratio
- Interactive elements have 3:1 minimum contrast against adjacent colors
- Focus states use 3px solid outline with 2px offset
- Color is never the sole indicator of state or meaning
- High contrast mode support via forced-colors media query

### Animation Values
| Property     | Value | Usage                           |
|-------------|-------|----------------------------------|
| Opacity     | 0.3   | Base transparency for spheres    |
| Pulse Intensity | 0.4 | Color transition intensity      |

### Implementation Example
```css
:root {
    /* Core colors */
    --fungal-black: #1A1B1C;
    --bio-lavender: #E6D7F3;
    --dark-lavender: #9B87AB;
    --dark-void: #0D0E0E;
    --light-void: #999999;
    --spore-gray: #9BA0A3;
    --dark-spore: #4D5052;
    --shadow-mint: #7A9B89;
    --necrotic-green: #4B9900;
    
    /* Theme mappings */
    --bg-color: var(--light-void);
    --text-color: var(--fungal-black);
    --link-color: var(--dark-spore);
    --accent-color: var(--spore-gray);
    --border-color: var(--dark-spore);
    --logo-color: var(--necrotic-green);
    
    /* Animation colors */
    --animation-wireframe: var(--necrotic-green);
    --animation-wireframe-pulse: var(--shadow-mint);
    --animation-sphere: var(--dark-lavender);
    --animation-sphere-pulse: var(--bio-lavender);
    --animation-opacity: 0.3;
    --animation-pulse-intensity: 0.4;
}

[data-theme="dark"] {
    --bg-color: var(--dark-void);
    --text-color: var(--dark-lavender);
    --link-color: var(--shadow-mint);
    --accent-color: var(--dark-spore);
    --border-color: var(--dark-spore);
    --logo-color: var(--shadow-mint);
    
    /* Animation colors - dark mode */
    --animation-wireframe: var(--shadow-mint);
    --animation-wireframe-pulse: var(--dark-spore);
    --animation-sphere: var(--dark-lavender);
    --animation-sphere-pulse: var(--dark-spore);
}
```

Created by Azul ([𝕏 @cathode_dreams](https://x.com/cathode_dreams)) for latentecho.net, 2024.

## Version History

- v1.2.0 - Simplified color naming, added contrast ratios, removed redundant variables
- v1.1.0 - Added extended shades, semantic colors, and animation values
- v1.0.0 - Initial release with foundation colors and mode support