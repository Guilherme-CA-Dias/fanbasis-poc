# Integration Use Case Template

This is a template for an application showcasing integration capabilities using [Integration.app](https://integration.app). The app is built with Next.js and demonstrates how to implement user authentication, integration token generation, and CRM lead management.

## Prerequisites

- Node.js 18+ installed
- Integration.app workspace credentials (Workspace Key and Secret)
- MongoDB database

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
# Copy the sample environment file
cp .env-sample .env
```

4. Edit `.env` and add your Integration.app credentials:

```env
INTEGRATION_APP_WORKSPACE_KEY=your_workspace_key_here
INTEGRATION_APP_WORKSPACE_SECRET=your_workspace_secret_here
MONGODB_URI=your_mongodb_connection_string
```

You can find these credentials in your Integration.app workspace settings.

## Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Connect your CRM:
   - Click on "Integrations" in the navigation
   - Click "Connect" and follow the OAuth flow
   - Once connected, go to the "Leads" page
   - Click "Import Leads" to fetch leads from your CRM

## Project Structure

```
src/
├── app/                    # Next.js app router pages and API routes
│   ├── api/               # Backend API endpoints
│   │   └── leads/        # Lead management endpoints
│   │       ├── import/   # Lead import from CRM
│   │       ├── webhook/  # CRM webhook endpoint
│   │       └── route.ts  # Lead CRUD operations
│   ├── leads/            # Leads page components
│   │   ├── components/   # Lead-specific components
│   │   └── page.tsx     # Main leads page
│   └── layout.tsx        # Root layout
├── components/           # Shared React components
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   └── header.tsx       # Navigation header
├── hooks/               # Custom React hooks
│   └── use-leads.ts    # Lead management hook
├── lib/                 # Utility functions
│   ├── mongodb.ts      # Database connection
│   ├── fetch-utils.ts  # API helpers
│   └── integration-app-client.ts  # Integration.app client
├── models/             # Database models
│   └── lead.ts        # Lead mongoose model
└── types/             # TypeScript type definitions
    └── lead.ts       # Lead-related types
```

## Features

### Lead Management
- Import leads from connected CRM
- View and edit lead information
- Real-time updates via webhooks
- Dark/light theme support

### Integration Capabilities
- OAuth connection to CRM platforms
- Webhook handling for real-time updates
- Bi-directional data sync
- Error handling and validation

### Authentication
The template implements a simple authentication mechanism using a randomly generated UUID as the customer ID. In a production environment, you would replace this with your actual authentication system.

## API Endpoints

### Leads
- `GET /api/leads` - List all leads
- `POST /api/leads/import` - Import leads from CRM
- `POST /api/leads/webhook` - Handle CRM webhooks

The template includes a complete example of importing and managing users from an external application:

- User data model and TypeScript types
- API routes for user import and retrieval
- React components for displaying user data
- Integration with SWR for efficient data fetching
- Example of using the Integration.app client for data import

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## License

MIT
