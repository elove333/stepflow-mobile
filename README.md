#stepflow
Project Overview
stepflow Mobile is the front-end application designed to connect with the stepflow ecosystem, which includes stepflow-AI and step-flow-backend. This mobile app serves as the user interface for accessing data processed by the Al system and managed by the backend infrastructure.
## Screenshots
![Home Screen](assets/screenshots/home.png)
![Lesson Screen](assets/screenshots/lesson.png)
![Practice Screen](assets/screenshots/practice.png)
#Bash
	•	npm run ios
	•	npm run android
	•CocoaPods step
🔧 Development Workflow
## Development Workflow

### Install Dependencies
```bash
npm install
#Start Metro Bundler
npm start
#Run on iOS (macOS only)
bash
cd ios
pod install
cd ..
npm run ios
#Run on Android

Ensure an emulator or device is running:
npm run android
---

### 🌐 Environment Variables

```md
## Environment Variables

STEPFLOW Mobile connects to the backend hosted on DigitalOcean.

Create a `.env` file in the project root:

```env
_BASE_URL=https://api.stepflow.https://app.mydanceworks.net/studio/modern/Dashboard.aspx
cp .env.example .env
(You should also add `.env.example` to the repo.)

---

### 🔌 Integration with STEPFLOW Ecosystem

```md
## Integration with STEPFLOW Ecosystem
⚠️ Do not commit .env files.
step-flow Mobile communicates only with the backend API.

- **stepflow-backend**
  - Hosted on DigitalOcean
  - Provides REST/GraphQL APIs
  - Handles auth, user data, lesson content, and AI orchestration

- **stepflow-AI**
  - Invoked internally by the backend
  - Performs movement analysis and scoring
  - Returns structured feedback

The mobile app does NOT communicate directly with the AI service.
🚀 Deployment (Corrected)
## Deployment

step-flow Mobile is a native application and is not deployed to DigitalOcean.

Deployment targets:
- iOS → TestFlight / App Store
- Android → Google Play Console

DigitalOcean is used exclusively for:
- Backend API hosting
- AI inference services
- Databases and storage
