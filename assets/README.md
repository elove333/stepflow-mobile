# Assets Directory

This directory contains all static assets used in the StepFlow Mobile application. All assets are organized into subdirectories by type for easy management and maintenance.

## Directory Structure

### 📁 `images/`
Contains static image files used throughout the application.

**Purpose:**
- Buttons and UI elements
- Backgrounds and splash screens
- Hero images and promotional graphics
- Logos and branding assets

**File Formats:**
- `.png` - For images requiring transparency
- `.jpg` - For photos and complex images
- `.webp` - For optimized web images (when supported)

**Naming Conventions:**
- Use lowercase with hyphens: `hero-image.png`, `logo.png`
- Be descriptive: `button-primary-active.png`
- Include size variants: `splash-screen@2x.png`, `splash-screen@3x.png`

**Optimization:**
- All images should be optimized using tools like [TinyPNG](https://tinypng.com/)
- Target file sizes: < 500KB for regular images, < 1MB for splash screens
- Use appropriate resolutions for mobile (@1x, @2x, @3x)

---

### 🎨 `icons/`
Contains icon assets for navigation, tabs, and UI features.

**Purpose:**
- Navigation icons (home, profile, settings)
- Tab bar icons
- Feature-specific icons (notifications, favorites, etc.)
- Action icons (edit, delete, share)

**File Formats:**
- `.svg` - Preferred for scalability and small file size
- `.png` - For raster icons (include @2x and @3x variants)

**Naming Conventions:**
- Use lowercase with hyphens: `icon-home.svg`, `icon-settings.svg`
- Include state suffixes: `icon-heart-filled.svg`, `icon-heart-outline.svg`
- For PNG variants: `icon-home@2x.png`, `icon-home@3x.png`

**Optimization:**
- SVG files should be optimized using [SVGO](https://github.com/svg/svgo)
- Remove unnecessary metadata and comments
- Target file sizes: < 10KB per icon

---

### 🔊 `audio/`
Contains sound effects and background music files.

**Purpose:**
- Button click sounds
- Notification alerts
- Success/error feedback sounds
- Background music (if applicable)

**File Formats:**
- `.mp3` - Preferred for music and longer sounds
- `.wav` - For short, high-quality sound effects
- `.m4a` - Alternative format for iOS compatibility

**Naming Conventions:**
- Use lowercase with hyphens: `button-click.mp3`, `notification-alert.wav`
- Be descriptive: `success-sound.mp3`, `error-sound.mp3`

**Optimization:**
- Keep audio files small (< 1MB for effects, < 5MB for music)
- Use appropriate bitrates (128kbps for effects, 192kbps for music)
- Trim silence from beginning and end of files

---

### 🎬 `animations/`
Contains animation files for enhanced UI/UX.

**Purpose:**
- Loading animations
- Success/error animations
- Onboarding animations
- Feature highlight animations

**File Formats:**
- `.json` - For Lottie animations (preferred)
- `.mp4` - For video animations (use sparingly)
- `.gif` - For simple animations (not recommended for production)

**Naming Conventions:**
- Use lowercase with hyphens: `loading-spinner.json`, `success-checkmark.json`
- Be descriptive: `onboarding-step1.json`

**Optimization:**
- Lottie files should be < 100KB
- Video files should be < 2MB and use appropriate compression
- Test animations on both iOS and Android for compatibility

---

## General Guidelines

### Adding New Assets
1. Place the asset in the appropriate subdirectory
2. Follow naming conventions consistently
3. Optimize the file before committing
4. Update this README if adding new categories or patterns

### Removing Assets
1. Search the codebase for references before removing
2. Remove from both code and asset directory
3. Document removal in commit message

### Asset References in Code
When referencing assets in React Native code:
```javascript
// Images
import heroImage from './assets/images/hero-image.png';
<Image source={require('./assets/images/logo.png')} />

// Icons
import { SvgIcon } from './components/SvgIcon';
<SvgIcon source={require('./assets/icons/icon-home.svg')} />

// Audio
import Sound from 'react-native-sound';
const sound = new Sound('button-click.mp3', Sound.MAIN_BUNDLE);

// Animations (Lottie)
import LottieView from 'lottie-react-native';
<LottieView source={require('./assets/animations/loading-spinner.json')} />
```

---

## Attribution & Licensing

### Third-Party Assets
If using assets from external sources, document them here:

#### Images
- *No external images currently used. All images are custom or proprietary.*

#### Icons
- *No external icons currently used. Icons are custom designed or from licensed sources.*

#### Audio
- *No external audio files currently used. All sounds are custom or royalty-free.*

#### Animations
- *No external animations currently used. All animations are custom designed.*

### Licenses
All assets in this directory are either:
- Created specifically for this project (proprietary)
- Licensed under appropriate commercial/open-source licenses (specified above)
- Used with permission from original creators

### Contributing Assets
When contributing new assets:
1. Ensure you have the right to use and distribute the asset
2. Document the source and license in this README
3. Include attribution information if required by the license
4. Optimize the asset before committing

---

## Tools & Resources

### Optimization Tools
- **Images:** [TinyPNG](https://tinypng.com/), [ImageOptim](https://imageoptim.com/)
- **Icons:** [SVGO](https://github.com/svg/svgo), [SVGOMG](https://jakearchibald.github.io/svgomg/)
- **Audio:** [Audacity](https://www.audacityteam.org/), [ffmpeg](https://ffmpeg.org/)
- **Animations:** [Lottie Editor](https://lottiefiles.com/editor)

### Asset Sources (Royalty-Free)
- **Images:** [Unsplash](https://unsplash.com/), [Pexels](https://www.pexels.com/)
- **Icons:** [Heroicons](https://heroicons.com/), [Feather Icons](https://feathericons.com/)
- **Audio:** [Freesound](https://freesound.org/), [Free Music Archive](https://freemusicarchive.org/)
- **Animations:** [LottieFiles](https://lottiefiles.com/)

---

## Maintenance

This assets directory should be reviewed regularly to:
- Remove unused assets
- Update outdated assets
- Ensure all assets are optimized
- Verify licensing compliance

**Last Updated:** January 23, 2026
**Maintained By:** StepFlow Mobile Team
