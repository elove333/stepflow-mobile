# STEPFLOW Mobile

## Project Overview
STEPFLOW Mobile is the front-end application designed to connect with the STEPFLOW ecosystem, which includes STEPFLOW-AI and STEPFLOW-backend. This mobile app serves as the user interface for accessing data processed by the AI system and managed by the backend infrastructure.

## Screenshots
![Home Screen](assets/screenshots/home.png)
![Lesson Screen](assets/screenshots/lesson.png)
![Practice Screen](assets/screenshots/practice.png)

## Key Features
- **Real-time Data Display**: Fetch and display results from STEPFLOW-backend.
- **AI Integration**: View insights derived from STEPFLOW-AI, including motion tracking and emotion analysis.
- **User-Friendly Interface**: Built with a focus on simplicity and usability.

## Development Workflow

### Install Dependencies
```bash
npm install
```

### Start Metro Bundler
```bash
npm start
```

### Run on iOS (macOS only)
```bash
cd ios
pod install
cd ..
npm run ios
```

### Run on Android
Ensure an emulator or device is running:
```bash
npm run android
```

### Build for Production
```bash
npm run build
```

For detailed information on managing backend services and serverless functions using `doctl` CLI, refer to the [Developer Guide](docs/developer-guide.md).

## Environment Variables

STEPFLOW Mobile connects to the backend hosted on DigitalOcean.

Create a `.env` file in the project root:

```env
API_BASE_URL=https://api.stepflow.app
```

Example:
```bash
cp .env.example .env
```

⚠️ Do not commit `.env` files.

## Integration with STEPFLOW Ecosystem

STEPFLOW Mobile communicates with the backend API.

- **STEPFLOW-backend**
  - Hosted on DigitalOcean
  - Provides REST/GraphQL APIs used to fetch data
  - Handles auth, user data, lesson content, and AI orchestration

- **STEPFLOW-AI**
  - Invoked internally by the backend
  - Performs movement analysis and scoring
  - Returns structured feedback
  - Supplies processed AI results which are displayed in the app

The mobile app does NOT communicate directly with the AI service.

## Deployment

### Mobile App Deployment

STEPFLOW Mobile is a native application deployed to app stores:

**Deployment targets:**
- **iOS** → TestFlight / App Store
- **Android** → Google Play Console

### Backend/Serverless Deployment

The backend API and serverless functions are deployed via DigitalOcean's workflow. For a quick start, follow these steps:

1. Install serverless support:
   ```bash
   doctl serverless install
   ```

2. Connect to your namespace:
   ```bash
   doctl serverless connect
   ```

3. Deploy serverless functions:
   ```bash
   doctl serverless deploy
   ```

**DigitalOcean is used for:**
- Backend API hosting
- Serverless functions
- AI inference services
- Databases and storage

For comprehensive documentation on DigitalOcean's `doctl` CLI, serverless functions management, and detailed deployment workflows, see the [Developer Guide](docs/developer-guide.md).

## License
This project is licensed under the [MIT License](LICENSE).
