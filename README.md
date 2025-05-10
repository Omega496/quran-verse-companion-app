
# Al Quran Companion App

A modern, responsive web application for reading, listening to, and studying the Quran.

## Features

- 📖 **Complete Quran Text**: All 114 surahs with Arabic text and translations
- 🔍 **Advanced Search**: Search through the Quran for specific verses or words
- 🔊 **Audio Recitation**: Listen to beautiful recitation of any verse
- 🔖 **Bookmarks & Favorites**: Save your favorite verses and surahs for quick access
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Easy on the eyes with light and dark theme options
- 🌐 **Multi-language Support**: Interface available in multiple languages

## Getting Started

### Prerequisites

- Node.js (v16.0 or later)
- npm or Yarn or Bun

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd quran-companion-app
```

2. Install dependencies:
```bash
npm install
# OR
yarn install
# OR
bun install
```

3. Start the development server:
```bash
npm run dev
# OR
yarn dev
# OR
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Main application pages
├── services/       # API and data services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Main Features

### Surah Browsing
- Browse all 114 surahs
- View detailed information about each surah
- Read Arabic text with translations

### Audio Playback
- Listen to professional recitations
- Play/pause individual verses
- Navigate between verses while listening

### Search Functionality
- Search for specific words or phrases
- Find results across both surah names and verse content
- View search history for quick access to previous searches

### Bookmarks & Favorites
- Bookmark verses for later reference
- Add entire surahs to favorites
- Easily access your saved content

### Settings & Personalization
- Change interface language
- Toggle between light and dark theme
- Adjust text size and other display preferences

## Technologies Used

- React.js
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- React Router
- Tanstack Query

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Quran text and translations provided by [AlQuran Cloud API](https://alquran.cloud/api)
- Audio recitations by various professional reciters
