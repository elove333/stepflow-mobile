# STEPFLOW Mobile Developer Guide

## Table of Contents
1. [Introduction](#introduction)
2. [DigitalOcean doctl CLI Overview](#digitalocean-doctl-cli-overview)
3. [Setup and Installation](#setup-and-installation)
4. [Serverless Functions Management](#serverless-functions-management)
5. [DigitalOcean Resources Management](#digitalocean-resources-management)
6. [STEPFLOW-Mobile Integration Examples](#stepflow-mobile-integration-examples)
7. [Deployment Workflows](#deployment-workflows)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide provides comprehensive documentation for managing the STEPFLOW-mobile application's backend infrastructure using DigitalOcean's `doctl` CLI tool. The STEPFLOW ecosystem consists of:

- **STEPFLOW-mobile**: Front-end React Native mobile application
- **STEPFLOW-backend**: Backend API services hosted on DigitalOcean
- **STEPFLOW-AI**: AI processing services for motion tracking and emotion analysis

This documentation focuses on the `doctl` commands and workflows that front-end developers need to understand for effective development, testing, and deployment.

---

## DigitalOcean doctl CLI Overview

`doctl` is DigitalOcean's official command-line interface that allows you to interact with the DigitalOcean API via the command line. It provides a comprehensive set of commands to manage:

- **Serverless Functions**: Deploy and manage serverless functions
- **Apps Platform**: Manage containerized applications
- **Compute Droplets**: Manage virtual machines
- **Databases**: Manage managed database clusters
- **Kubernetes**: Manage Kubernetes clusters
- **Spaces**: Manage object storage

### Why doctl Matters for Front-End Developers

As a front-end developer on STEPFLOW-mobile, you'll use `doctl` to:
- Deploy serverless functions that support the mobile app
- Test backend integrations locally before pushing to production
- Monitor and debug API endpoints
- Manage deployment configurations and environment variables

---

## Setup and Installation

### Prerequisites

Before you begin, ensure you have:
- A DigitalOcean account with appropriate permissions
- Access to the STEPFLOW project on DigitalOcean
- Basic understanding of command-line interfaces

### Installing doctl

#### macOS
```bash
# Using Homebrew
brew install doctl

# Verify installation
doctl version
```

#### Linux
```bash
# Download the latest release
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz

# Extract the binary
tar xf ~/doctl-1.94.0-linux-amd64.tar.gz

# Move to PATH
sudo mv ~/doctl /usr/local/bin

# Verify installation
doctl version
```

#### Windows
```powershell
# Using Chocolatey
choco install doctl

# Verify installation
doctl version
```

### Authentication

To authenticate `doctl` with your DigitalOcean account:

1. **Generate an API token**:
   - Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com)
   - Navigate to API → Tokens/Keys
   - Click "Generate New Token"
   - Give it a name (e.g., "STEPFLOW-mobile-dev")
   - Select read and write scopes
   - Copy the generated token

2. **Initialize doctl**:
   ```bash
   doctl auth init
   ```
   When prompted, paste your API token.

3. **Verify authentication**:
   ```bash
   doctl account get
   ```
   This should display your DigitalOcean account information.

4. **List available contexts**:
   ```bash
   doctl auth list
   ```

---

## Serverless Functions Management

Serverless functions are a core component of the STEPFLOW backend architecture, providing scalable, event-driven functionality for the mobile app.

### Overview of Serverless Commands

The `doctl serverless` command group provides all functionality needed to manage serverless functions:

```bash
doctl serverless [command]
```

Available commands:
- `init` - Initialize serverless support
- `connect` - Connect to a serverless namespace
- `deploy` - Deploy functions to the cloud
- `watch` - Watch for changes and automatically deploy
- `undeploy` - Remove deployed functions
- `status` - Check deployment status
- `logs` - View function logs
- `activations` - View function invocations
- `namespaces` - Manage namespaces

### Installing Serverless Support

Before using serverless functions, install the required components:

```bash
doctl serverless install
```

This command:
- Downloads the necessary serverless runtime
- Sets up the local development environment
- Configures default settings

**Example output**:
```
Downloading functions support...
Installing functions support...
Successfully installed functions support.
```

### Connecting to a Namespace

Namespaces are isolated environments for your serverless functions. Connect to your project namespace:

```bash
doctl serverless connect
```

**Interactive mode**: You'll be prompted to select a namespace from your available options.

**Direct connection** (if you know the namespace):
```bash
doctl serverless connect --namespace stepflow-prod
```

**Example output**:
```
Connected to namespace 'stepflow-prod' on API host 'https://faas-nyc1-2ef7e44c.doserverless.co'
```

### Initializing a Serverless Project

To create a new serverless project structure:

```bash
doctl serverless init [project-name] --language [language]
```

**Supported languages**:
- `javascript` / `js`
- `typescript` / `ts`
- `python`
- `go`
- `php`

**Example - Create a new JavaScript project**:
```bash
doctl serverless init stepflow-functions --language javascript
cd stepflow-functions
```

This creates a project structure like:
```
stepflow-functions/
├── packages/
│   └── sample/
│       └── hello/
│           └── index.js
├── project.yml
└── .gitignore
```

### Project Configuration (project.yml)

The `project.yml` file defines your serverless functions and their configurations:

```yaml
# STEPFLOW-mobile serverless functions configuration
targetNamespace: stepflow-prod
parameters:
  API_BASE_URL: 'https://api.stepflow.app'
  
packages:
  - name: analytics
    functions:
      - name: track-event
        runtime: nodejs:18
        main: index.js
        web: true
        webSecure: false
        limits:
          timeout: 10000
          memory: 256
        environment:
          LOG_LEVEL: info
          
  - name: auth
    functions:
      - name: validate-token
        runtime: nodejs:18
        main: index.js
        web: true
        limits:
          timeout: 5000
          memory: 128
```

**Key configuration options**:
- `targetNamespace`: The namespace to deploy to
- `parameters`: Global environment variables
- `packages`: Grouping of related functions
- `runtime`: Execution environment (e.g., nodejs:18, python:3.9)
- `web`: Enable HTTP access to the function
- `limits`: Resource constraints (timeout in ms, memory in MB)

### Deploying Serverless Functions

Deploy your functions to the connected namespace:

```bash
doctl serverless deploy [project-path]
```

**Deploy current directory**:
```bash
doctl serverless deploy .
```

**Deploy specific project**:
```bash
doctl serverless deploy ~/projects/stepflow-functions
```

**Deploy with verbose output**:
```bash
doctl serverless deploy . --verbose-build
```

**Example output**:
```
Deploying '/path/to/stepflow-functions'
  to namespace 'stepflow-prod'
  on host 'https://faas-nyc1-2ef7e44c.doserverless.co'

Submitted action 'analytics/track-event' for deployment
Submitted action 'auth/validate-token' for deployment

Deployment status recorded in 'deployment.json'

Deployed functions ('doctl sbx fn get <funcName> --url' for URL):
  - analytics/track-event
  - auth/validate-token
```

### Getting Function URLs

After deployment, retrieve the function URLs:

```bash
doctl serverless functions get [function-name] --url
```

**Example**:
```bash
doctl serverless functions get analytics/track-event --url
```

**Output**:
```
https://faas-nyc1-2ef7e44c.doserverless.co/api/v1/web/stepflow-prod/analytics/track-event
```

### Watch Mode for Development

During development, use watch mode to automatically deploy changes:

```bash
doctl serverless watch [project-path]
```

**Watch current directory**:
```bash
doctl serverless watch .
```

**Features**:
- Monitors file changes in your project
- Automatically redeploys when changes are detected
- Provides real-time feedback on deployment status

**Example output**:
```
Watching '/path/to/stepflow-functions' [use Control-C to terminate]
Deployed functions:
  - analytics/track-event
  - auth/validate-token

[waiting for changes]
... (change detected)
Deploying...
Deployment complete
```

### Viewing Function Logs

Monitor function execution with logs:

```bash
doctl serverless activations logs [activation-id]
```

**Get recent activations**:
```bash
doctl serverless activations list
```

**Get logs for specific function**:
```bash
doctl serverless activations list --function analytics/track-event --limit 5
```

**Stream logs in real-time**:
```bash
doctl serverless activations logs --follow
```

### Invoking Functions Locally

Test functions before deployment:

```bash
doctl serverless functions invoke [function-name] --param [key]=[value]
```

**Example - Invoke with parameters**:
```bash
doctl serverless functions invoke analytics/track-event \
  --param event=page_view \
  --param user_id=12345
```

### Undeploying Functions

Remove deployed functions:

```bash
doctl serverless undeploy [project-path]
```

**Undeploy all functions in current project**:
```bash
doctl serverless undeploy .
```

**Example output**:
```
Undeploying functions from namespace 'stepflow-prod'

Removed:
  - analytics/track-event
  - auth/validate-token

Undeploy complete
```

### Listing Namespaces

View all available namespaces:

```bash
doctl serverless namespaces list
```

**Example output**:
```
LABEL             REGION    ID
stepflow-prod     nyc1      fn-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
stepflow-dev      sfo3      fn-yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

---

## DigitalOcean Resources Management

While serverless functions handle dynamic functionality, other DigitalOcean resources support the STEPFLOW infrastructure.

### App Platform Management

The App Platform hosts containerized versions of STEPFLOW services.

#### List Apps

```bash
doctl apps list
```

**Example output**:
```
ID                                      Spec Name           Default Ingress          Active Deployment ID              Updated At
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   stepflow-backend    https://stepflow-backend-...   yyyyyyyy-yyyy-yyyy-...        2024-01-15T10:30:00Z
```

#### Get App Details

```bash
doctl apps get [app-id]
```

#### Create App from Spec

```bash
doctl apps create --spec stepflow-app-spec.yaml
```

**Example app spec (stepflow-app-spec.yaml)**:
```yaml
name: stepflow-backend
region: nyc
services:
  - name: api
    github:
      repo: elove333/stepflow-backend
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 2
    instance_size_slug: basic-xs
    http_port: 3000
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${db.DATABASE_URL}
      - key: API_BASE_URL
        scope: RUN_TIME
        value: https://api.stepflow.app
```

#### Update App

```bash
doctl apps update [app-id] --spec stepflow-app-spec.yaml
```

#### View App Logs

```bash
doctl apps logs [app-id]
```

**Follow logs in real-time**:
```bash
doctl apps logs [app-id] --follow
```

#### List App Deployments

```bash
doctl apps list-deployments [app-id]
```

### Compute Droplet Management

Droplets are virtual machines that may host legacy STEPFLOW services.

#### List Droplets

```bash
doctl compute droplet list
```

**Format output**:
```bash
doctl compute droplet list --format ID,Name,PublicIPv4,Status,Region
```

**Example output**:
```
ID           Name                Public IPv4       Status    Region
123456789    stepflow-worker-1   203.0.113.1      active    nyc1
123456790    stepflow-worker-2   203.0.113.2      active    nyc1
```

#### Get Droplet Details

```bash
doctl compute droplet get [droplet-id]
```

#### Create Droplet

```bash
doctl compute droplet create stepflow-worker-3 \
  --region nyc1 \
  --size s-2vcpu-4gb \
  --image ubuntu-22-04-x64 \
  --ssh-keys [ssh-key-id]
```

#### SSH into Droplet

```bash
doctl compute ssh [droplet-id]
```

### Database Management

View managed databases that STEPFLOW uses:

#### List Databases

```bash
doctl databases list
```

#### Get Database Connection Info

```bash
doctl databases get [database-id]
```

#### Create Database Backup

```bash
doctl databases backups create [database-id]
```

### Kubernetes Cluster Management

If STEPFLOW uses Kubernetes:

#### List Clusters

```bash
doctl kubernetes cluster list
```

#### Get Cluster Credentials

```bash
doctl kubernetes cluster kubeconfig save [cluster-name]
```

#### List Cluster Nodes

```bash
doctl kubernetes cluster node-pool list [cluster-id]
```

---

## STEPFLOW-Mobile Integration Examples

### Example 1: Analytics Event Tracking Function

The STEPFLOW-mobile app sends analytics events to a serverless function.

**Frontend code (src/api/analytics.ts)**:
```typescript
import { client } from './client';

export const trackEvent = async (eventName: string, properties: object) => {
  try {
    const response = await client.post('/analytics/track-event', {
      event: eventName,
      properties: properties,
      timestamp: new Date().toISOString(),
    });
    return response;
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};
```

**Serverless function (packages/analytics/track-event/index.js)**:
```javascript
async function main(args) {
  const { event, properties, timestamp } = args;
  
  // Validate input
  if (!event) {
    return {
      statusCode: 400,
      body: { error: 'Event name is required' }
    };
  }
  
  // Log event (in production, this would save to a database)
  console.log(`Event: ${event}`, properties);
  
  return {
    statusCode: 200,
    body: {
      success: true,
      message: 'Event tracked successfully',
      event: event
    }
  };
}

exports.main = main;
```

**Deployment**:
```bash
# Navigate to serverless project
cd ~/stepflow-serverless

# Deploy the function
doctl serverless deploy .

# Get the function URL
doctl serverless functions get analytics/track-event --url

# Update API_BASE_URL in mobile app to point to this URL
```

### Example 2: Authentication Token Validation

The mobile app validates user tokens via a serverless function.

**Frontend code (src/api/auth.ts)**:
```typescript
import { client } from './client';

export const validateToken = async (token: string) => {
  try {
    const response = await client.post('/auth/validate-token', {
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error('Token validation failed:', error);
    return { valid: false };
  }
};
```

**Serverless function (packages/auth/validate-token/index.js)**:
```javascript
const jwt = require('jsonwebtoken');

async function main(args) {
  const { token } = args;
  
  if (!token) {
    return {
      statusCode: 400,
      body: { error: 'Token is required' }
    };
  }
  
  try {
    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret);
    
    return {
      statusCode: 200,
      body: {
        valid: true,
        userId: decoded.userId,
        expiresAt: decoded.exp
      }
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: {
        valid: false,
        error: error.message
      }
    };
  }
}

exports.main = main;
```

### Example 3: Real-Time Motion Data Processing

The mobile app sends motion data to be processed by STEPFLOW-AI through a serverless function.

**Frontend code (src/api/sessions.ts)**:
```typescript
import { client } from './client';

export const processMotionData = async (motionData: any[]) => {
  try {
    const response = await client.post('/motion/process', {
      data: motionData,
      sessionId: Date.now().toString(),
    });
    return response.data;
  } catch (error) {
    console.error('Motion processing failed:', error);
    throw error;
  }
};
```

---

## Deployment Workflows

### Development Workflow

1. **Set up local environment**:
   ```bash
   # Install doctl
   brew install doctl
   
   # Authenticate
   doctl auth init
   
   # Install serverless support
   doctl serverless install
   
   # Connect to dev namespace
   doctl serverless connect --namespace stepflow-dev
   ```

2. **Develop functions locally**:
   ```bash
   # Create or modify functions
   cd stepflow-functions
   
   # Enable watch mode for auto-deployment
   doctl serverless watch .
   ```

3. **Test functions**:
   ```bash
   # Test function invocation
   doctl serverless functions invoke analytics/track-event \
     --param event=test_event
   
   # View logs
   doctl serverless activations list --function analytics/track-event
   ```

4. **Update mobile app to use function URLs**:
   ```bash
   # Get function URL
   doctl serverless functions get analytics/track-event --url
   
   # Update .env file in mobile app
   # API_BASE_URL=https://faas-xxx.doserverless.co/api/v1/web/stepflow-dev
   ```

### Staging Deployment

1. **Deploy to staging namespace**:
   ```bash
   doctl serverless connect --namespace stepflow-staging
   doctl serverless deploy ~/stepflow-functions
   ```

2. **Verify deployment**:
   ```bash
   doctl serverless functions list
   ```

3. **Run integration tests**:
   ```bash
   # From mobile app repository
   npm run test:integration
   ```

### Production Deployment

1. **Review changes**:
   ```bash
   # Check diff of function code
   git diff main..feature-branch
   ```

2. **Deploy to production**:
   ```bash
   doctl serverless connect --namespace stepflow-prod
   doctl serverless deploy ~/stepflow-functions --verbose-build
   ```

3. **Verify deployment**:
   ```bash
   # Check function status
   doctl serverless status
   
   # Get function URLs
   doctl serverless functions list --name --url
   ```

4. **Monitor logs**:
   ```bash
   # Stream logs
   doctl serverless activations logs --follow
   ```

5. **Update mobile app configuration**:
   ```bash
   # Update production API URLs in mobile app
   # Commit and deploy mobile app
   ```

### Rollback Procedure

If issues occur in production:

1. **Undeploy current version**:
   ```bash
   doctl serverless undeploy .
   ```

2. **Deploy previous version**:
   ```bash
   # Checkout previous version
   git checkout [previous-commit]
   
   # Redeploy
   doctl serverless deploy .
   ```

3. **Verify rollback**:
   ```bash
   doctl serverless functions list
   ```

---

## Best Practices

### Security

1. **Never commit API tokens**:
   - Store tokens in environment variables or secure vaults
   - Add `.doctl` directory to `.gitignore`

2. **Use environment-specific namespaces**:
   - `stepflow-dev` for development
   - `stepflow-staging` for testing
   - `stepflow-prod` for production

3. **Secure function endpoints**:
   - Use `webSecure: true` for functions handling sensitive data
   - Implement authentication in functions
   - Validate all inputs

4. **Rotate credentials regularly**:
   ```bash
   # Generate new API token periodically
   doctl auth init
   ```

### Performance

1. **Set appropriate function limits**:
   ```yaml
   limits:
     timeout: 5000  # 5 seconds - adjust based on function needs
     memory: 256    # MB - start small, increase if needed
   ```

2. **Monitor function activations**:
   ```bash
   doctl serverless activations list --limit 100
   ```

3. **Use caching where appropriate**:
   - Implement response caching in functions
   - Cache static data to reduce API calls

### Development

1. **Use watch mode for rapid iteration**:
   ```bash
   doctl serverless watch .
   ```

2. **Test locally before deploying**:
   ```bash
   # Invoke function with test data
   doctl serverless functions invoke [function-name] \
     --param key=value
   ```

3. **Keep functions small and focused**:
   - One function = one responsibility
   - Use packages to group related functions

4. **Version your project.yml**:
   - Commit `project.yml` to version control
   - Document changes in commit messages

### Monitoring and Logging

1. **Use structured logging**:
   ```javascript
   console.log(JSON.stringify({
     level: 'info',
     message: 'Event processed',
     event: eventName,
     timestamp: new Date().toISOString()
   }));
   ```

2. **Monitor activation patterns**:
   ```bash
   doctl serverless activations list --skip 0 --limit 50
   ```

3. **Set up alerts for failures**:
   - Monitor function error rates
   - Set up notifications for production issues

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "doctl command not found"

**Solution**:
```bash
# Verify installation
which doctl

# Reinstall if necessary
brew reinstall doctl

# Add to PATH if needed
export PATH=$PATH:/usr/local/bin
```

#### Issue: "Not authenticated" error

**Solution**:
```bash
# Re-authenticate
doctl auth init

# Verify authentication
doctl account get
```

#### Issue: "No namespace connected"

**Solution**:
```bash
# List available namespaces
doctl serverless namespaces list

# Connect to namespace
doctl serverless connect --namespace stepflow-prod
```

#### Issue: Function deployment fails

**Solution**:
```bash
# Check project.yml syntax
cat project.yml

# Deploy with verbose output to see errors
doctl serverless deploy . --verbose-build

# Check for missing dependencies
cd packages/[package-name]/[function-name]
npm install
```

#### Issue: Function returns 502 or timeout errors

**Solution**:
```bash
# Increase timeout in project.yml
limits:
  timeout: 30000  # Increase to 30 seconds

# Check function logs for errors
doctl serverless activations list --function [function-name]
doctl serverless activations logs [activation-id]
```

#### Issue: Cannot access function URL

**Solution**:
```bash
# Verify function is deployed
doctl serverless functions list

# Check if web access is enabled
# In project.yml, ensure:
web: true

# Get correct URL
doctl serverless functions get [function-name] --url
```

#### Issue: Environment variables not available in function

**Solution**:
```yaml
# Add to project.yml at function level
functions:
  - name: my-function
    environment:
      MY_VAR: value

# Or at package level
packages:
  - name: my-package
    environment:
      MY_VAR: value
```

### Getting Help

1. **Check doctl documentation**:
   ```bash
   doctl serverless --help
   doctl serverless deploy --help
   ```

2. **View DigitalOcean status**:
   - Visit: https://status.digitalocean.com

3. **DigitalOcean Community**:
   - Forums: https://www.digitalocean.com/community

4. **Contact team lead**:
   - For STEPFLOW-specific configuration issues

---

## Additional Resources

### Documentation Links

- [DigitalOcean doctl GitHub](https://github.com/digitalocean/doctl)
- [DigitalOcean Functions Documentation](https://docs.digitalocean.com/products/functions/)
- [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [STEPFLOW Backend Repository](https://github.com/elove333/stepflow-backend)
- [STEPFLOW AI Repository](https://github.com/elove333/stepflow-ai)

### Quick Reference

**Most used commands**:
```bash
# Deploy functions
doctl serverless deploy .

# Watch for changes
doctl serverless watch .

# List functions
doctl serverless functions list

# Get function URL
doctl serverless functions get [function-name] --url

# View logs
doctl serverless activations logs [activation-id]

# List activations
doctl serverless activations list

# Connect to namespace
doctl serverless connect

# List apps
doctl apps list

# View app logs
doctl apps logs [app-id] --follow
```

---

## Conclusion

This guide provides the essential `doctl` CLI commands and workflows needed for front-end developers working on STEPFLOW-mobile. By understanding these tools, you can effectively:

- Deploy and test serverless functions
- Monitor backend services
- Debug integration issues
- Collaborate with backend developers

For questions or issues not covered in this guide, please reach out to the STEPFLOW development team or consult the official DigitalOcean documentation.

**Happy coding! 🚀**
