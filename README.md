# STEPFLOW Mobile

## Project Overview
STEPFLOW Mobile is the front-end application designed to connect with the STEPFLOW ecosystem, which includes STEPFLOW-AI and STEPFLOW-backend. This mobile app serves as the user interface for accessing data processed by the AI system and managed by the backend infrastructure.

## Key Features
- **Real-time Data Display**: Fetch and display results from STEPFLOW-backend.
- **AI Integration**: View insights derived from STEPFLOW-AI, including motion tracking and emotion analysis.
- **User-Friendly Interface**: Built with a focus on simplicity and usability.

## Development Workflow

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Local Development Server**:
   ```bash
   npm start
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

For detailed information on managing backend services and serverless functions using `doctl` CLI, refer to the [Developer Guide](docs/developer-guide.md).

## Integration with STEPFLOW Ecosystem
- **STEPFLOW-backend**: Provides REST/GraphQL APIs used to fetch data.
- **STEPFLOW-AI**: Supplies processed AI results which are displayed in the app.

## Deployment
The app is deployed via DigitalOcean's workflow. For a quick start, follow these steps:
1. Install serverless support:
   ```bash
   doctl serverless install
   ```
2. Connect to your namespace:
   ```bash
   doctl serverless connect
   ```
3. Deploy the app:
   ```bash
   doctl serverless deploy
   ```

For comprehensive documentation on DigitalOcean's `doctl` CLI, serverless functions management, and detailed deployment workflows, see the [Developer Guide](docs/developer-guide.md).

## License
This project is licensed under the [MIT License](LICENSE).