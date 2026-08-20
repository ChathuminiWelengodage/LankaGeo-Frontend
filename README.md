# 🌊 LankaGeo Frontend

The **LankaGeo Frontend** is the web-based user interface for **LankaGeo**, a geospatial flood monitoring and risk assessment platform developed to help users visualize flood conditions, analyze historical flood risks, and receive location-based flood alerts.

The application provides an interactive map-based interface where users can select locations, view flood analysis results, explore historical flood information, manage saved locations, and subscribe to flood alerts.

🌐 **Live Web Application:**  
[https://lanka-geo.vercel.app](https://lanka-geo.vercel.app)

---

## 📌 Features

### 🗺️ Interactive Flood Mapping

- Interactive map-based flood visualization.
- Display flood-affected areas as geographic polygons.
- View different flood analysis layers.
- Zoom, pan, and explore affected geographic areas.
- Location-based map interaction.
- Map legend for understanding flood-risk layers.

### 🌊 Live Flood Analysis

- Analyze recent flood conditions for a selected location.
- Supports satellite-based flood detection results from the backend.
- Displays detected flood areas on an interactive map.
- Provides visual feedback while analysis is being processed.
- Supports switching between available satellite analysis layers.

### 📊 Historical Flood Analysis

- Explore historical flood conditions.
- Analyze previously affected areas.
- View historical flood patterns and trends.
- Supports multi-year flood trend analysis.
- Provides historical information for flood-risk assessment.

### 📍 Location Search

- Search for geographic locations using Google Maps.
- Google Maps Autocomplete helps users find locations quickly.
- Selected locations can be used for flood analysis.
- Supports map navigation based on the selected location.

### 💾 Saved Locations

Authenticated users can save frequently used locations.

Users can:

- Add a location.
- View saved locations.
- Select a saved location for analysis.
- Update saved location information.
- Delete saved locations.

### 🚨 Flood Alert Subscriptions

Users can subscribe to flood alerts for a selected location.

The alert subscription interface allows users to configure:

- Location
- Phone number
- Alert threshold
- Notification preferences

The backend processes the subscription and sends notifications when configured flood conditions are detected.

### 🔐 User Authentication

The frontend provides:

- User registration.
- User login.
- User logout.
- User profile management.
- Protected user-specific functionality.
- Authentication integration with Supabase.

### 📤 Data Export

Users can export selected flood analysis information and map-related results for further use or reporting.

### 📱 Responsive Interface

The application is designed to provide a consistent experience across:

- Desktop computers
- Laptops
- Tablets
- Different screen sizes

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **Next.js** | React-based frontend framework |
| **TypeScript** | Type-safe application development |
| **React** | UI component development |
| **Tailwind CSS** | Styling and responsive UI |
| **PostCSS** | CSS processing |
| **Supabase** | Authentication and backend services |
| **Google Maps JavaScript API** | Location search and map services |
| **Leaflet / React Leaflet** | Interactive geospatial map visualization |
| **Next.js App Router** | Application routing |
| **Vercel** | Production deployment |
| **Geist Font** | Application typography |

---

# 🏗️ Application Architecture

The LankaGeo frontend communicates with the LankaGeo backend through REST APIs.

```text
                     LankaGeo Frontend
                            │
                            │
                    User Interaction
                            │
            ┌───────────────┼────────────────┐
            │               │                │
            ▼               ▼                ▼
       Authentication   Map & Location   Flood Analysis
            │               │                │
            └───────────────┼────────────────┘
                            │
                            ▼
                    LankaGeo Backend
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
          PostgreSQL   Google Earth     Alert Services
            /PostGIS     Engine         SMS / Email
```

The frontend focuses on **user interaction and visualization**, while the backend handles **data processing, satellite analysis, database operations, and alert processing**.

---

# 🛰️ Flood Analysis Workflow

## Live Flood Analysis

The live flood analysis workflow is:

```text
User selects a location
        ↓
Frontend sends analysis request
        ↓
LankaGeo Backend
        ↓
Google Earth Engine
        ↓
Sentinel-1 SAR imagery
        ↓
Flood detection and processing
        ↓
Flood polygons generated
        ↓
Frontend receives results
        ↓
Flood areas displayed on map
```

## Historical Flood Analysis

```text
User selects location / analysis period
        ↓
Frontend sends historical analysis request
        ↓
LankaGeo Backend
        ↓
Google Earth Engine
        ↓
Sentinel-2 optical imagery
        ↓
Historical flood processing
        ↓
Flood results returned
        ↓
Frontend visualization
```

---

# 📊 Main Application Sections

## 🏠 Dashboard

The dashboard is the main workspace of the application.

It provides access to:

- Location search
- Live flood analysis
- Historical analysis
- Interactive maps
- Flood information
- Analysis controls
- Map layer controls

---

## 🌊 Live Analysis

The Live Analysis section allows users to investigate current or recent flood conditions.

Users can:

1. Search for a location.
2. Select the required geographic area.
3. Start flood analysis.
4. Wait for satellite processing.
5. View detected flood areas on the map.
6. Toggle available map layers.

---

## 📈 Historical Risk Analysis

The Historical Risk section provides information about previous flood events.

It can be used to:

- Examine historical flood areas.
- Compare flood conditions over different periods.
- Identify recurring flood-prone locations.
- Support long-term flood risk assessment.

---

## 🗺️ Map Visualization

The map is one of the main components of the LankaGeo application.

It provides:

- Geographic visualization.
- Flood polygon overlays.
- Location markers.
- Satellite-related layers.
- Map controls.
- Zoom and navigation.
- Map legends.

---

# 🔐 Authentication

Authentication is handled using **Supabase**.

The frontend provides authentication interfaces for:

```text
Registration
     ↓
Login
     ↓
Authenticated Session
     ↓
Protected Dashboard Features
```

Authenticated users can access user-specific functionality such as:

- Profile information
- Saved locations
- Alert subscriptions

---

# 🚨 Alert Subscription Workflow

The alert subscription workflow is:

```text
User logs in
      ↓
Selects location
      ↓
Enters phone number
      ↓
Selects alert threshold
      ↓
Creates subscription
      ↓
Backend stores subscription
      ↓
Flood conditions are monitored
      ↓
Alert is triggered
      ↓
SMS / Email notification
```

---

# 🔗 Backend Integration

The frontend communicates with the LankaGeo backend using API requests.

The backend provides services for:

- Live flood analysis
- Historical flood analysis
- Saved locations
- Flood data
- Alert subscriptions
- User-related protected resources

The frontend receives processed results and converts them into interactive visualizations.

---

# 🚀 Getting Started

## Prerequisites

Before running the project, install:

- **Node.js 18.x or later**
- **npm**, **yarn**, **pnpm**, or **bun**
- Git

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/ChathuminiWelengodage/LankaGeo-Frontend.git
```

Navigate into the project:

```bash
cd LankaGeo-Frontend
```

---

## 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Environment Variable Description

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anonymous API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key |
| `NEXT_PUBLIC_API_URL` | LankaGeo backend API URL |

> The exact variables required may depend on the current application configuration.

---

# 🔒 Environment Security

Never commit sensitive environment files to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env
.env.local
.env.*.local
node_modules/
.next/
```

Although some frontend environment variables are intentionally public because they use the `NEXT_PUBLIC_` prefix, API keys should still be properly restricted using the relevant provider's security settings.

For example, Google Maps API keys should have appropriate API and domain restrictions configured.

---

# ▶️ Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

Open the URL in your browser.

---

# 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 🧹 Code Quality

Run the project's linting command:

```bash
npm run lint
```

Linting helps identify potential issues in the TypeScript and React code.

---

# 📁 Project Structure

```text
LankaGeo-Frontend/
│
├── .idea/                         # IDE configuration
│
├── plans/                         # Architecture and feature planning
│
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── ...
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── map/
│   │   ├── alerts/
│   │   └── ...
│   │
│   └── lib/
│       ├── supabase/
│       ├── api/
│       └── ...
│
├── .gitignore
├── AGENTS.md
├── CASESTUDIES.md
├── CLAUDE.md
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

> The structure may change as new features and components are added.

---

# 🧩 Important Frontend Components

The application contains reusable components for different areas of the system.

### Authentication Components

Responsible for:

- Login
- Registration
- User authentication
- User profile management

### Dashboard Components

Responsible for:

- Live analysis
- Historical analysis
- Analysis status
- Dashboard controls
- Flood information

### Map Components

Responsible for:

- Interactive maps
- Flood polygons
- Map layers
- Location markers
- Map legends
- Location search

### Alert Components

Responsible for:

- Alert subscription
- Phone number input
- Location selection
- Alert threshold selection
- Subscription management

---

# 🗺️ Location Search

The application uses Google Maps services to provide location search and autocomplete functionality.

The general workflow is:

```text
User enters location
        ↓
Google Maps Autocomplete
        ↓
Location selected
        ↓
Latitude / Longitude obtained
        ↓
Map moves to selected location
        ↓
Location becomes available for analysis
```

This allows users to search for locations without manually entering geographic coordinates.

---

# 📡 API Communication

The frontend sends requests to the backend API when users perform operations such as:

- Starting live analysis
- Requesting historical analysis
- Loading flood polygons
- Creating saved locations
- Updating saved locations
- Deleting saved locations
- Creating alert subscriptions
- Loading user-specific information

Example architecture:

```text
React / Next.js Component
          ↓
API Client
          ↓
HTTP Request
          ↓
FastAPI Backend
          ↓
Processing / Database / GEE
          ↓
JSON Response
          ↓
React Component
          ↓
UI / Map
```

---

# 📱 Responsive Design

The application uses **Tailwind CSS** to create responsive layouts.

The interface is designed to adapt to:

- Desktop
- Laptop
- Tablet
- Different browser window sizes

Reusable UI components help maintain consistent spacing, typography, buttons, cards, forms, and map controls throughout the application.

---

# ☁️ Deployment

The LankaGeo frontend is deployed using **Vercel**.

### Production Application

🌐 [https://lanka-geo.vercel.app](https://lanka-geo.vercel.app)

The deployment process generally follows:

```text
GitHub Repository
       ↓
Vercel
       ↓
Build Next.js Application
       ↓
Deploy Production Version
       ↓
Live Web Application
```

---

# 🔄 Development Workflow

The frontend development workflow follows:

```text
Feature Planning
      ↓
UI / Component Development
      ↓
API Integration
      ↓
Testing
      ↓
Git Commit
      ↓
GitHub
      ↓
Vercel Deployment
```

The team used collaborative development practices including:

- GitHub
- Feature branches
- Scrum planning
- Scrum board
- Sprint activities
- Retrospectives
- Team meetings

---

# 🧪 Testing

Before deployment, important functionality should be tested, including:

### Authentication

- User registration
- User login
- Logout
- Protected pages
- Session handling

### Flood Analysis

- Location selection
- Live analysis
- Historical analysis
- Loading states
- Error handling
- Flood layer visualization

### Map

- Location search
- Map navigation
- Polygon rendering
- Layer toggling
- Map legend

### Alerts

- Location selection
- Phone number validation
- Alert threshold selection
- Subscription creation
- Subscription error handling

### Responsive UI

Test the application on different:

- Screen sizes
- Browsers
- Devices

---

# 🐛 Troubleshooting

## `npm` is not recognized

Check Node.js installation:

```bash
node --version
```

If Node.js is not installed, install a current LTS version.

---

## Dependencies are missing

Run:

```bash
npm install
```

Then restart the development server:

```bash
npm run dev
```

---

## Environment variables are not working

Make sure:

1. `.env.local` exists in the project root.
2. Variable names are correct.
3. Variables intended for browser-side use have the required `NEXT_PUBLIC_` prefix.
4. The development server was restarted after changing `.env.local`.

---

## Google Maps API error

Check:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Google Maps API configuration
- Enabled Google Maps APIs
- API key restrictions
- Allowed domains

For local development, make sure `localhost` is allowed where required.

---

## Backend connection error

Check that the LankaGeo backend is running.

For local development:

```text
http://127.0.0.1:8000
```

Make sure the frontend API URL points to the correct backend address.

---

# 🔐 Security Considerations

The frontend follows several security practices:

- Authentication through Supabase.
- Protected user-specific functionality.
- Environment variables for configuration.
- No hard-coded backend credentials.
- No sensitive backend secrets stored in the frontend.
- API access controlled through backend authentication.
- Google Maps API key restrictions should be configured.
- `.env.local` should not be committed to GitHub.

---

# 📦 Main Dependencies

The project uses several important packages.

Examples include:

```text
next
react
react-dom
typescript
@supabase/supabase-js
@vis.gl/react-google-maps
leaflet
react-leaflet
tailwindcss
postcss
```

The complete dependency list is available in:

```text
package.json
```

Install dependencies with:

```bash
npm install
```

---

# 🔗 Related Repository

### LankaGeo Backend

The frontend communicates with the LankaGeo backend for flood analysis, database operations, and alert functionality.

Backend repository:

```text
https://github.com/is-group-09-sab/lankageo-backend
```

---

# 👥 Contributors

The LankaGeo project was developed collaboratively by:

- [@ChathuminiWelengodage](https://github.com/ChathuminiWelengodage)
- [@kirperera](https://github.com/kirperera)
- [@PoojaniGeehara](https://github.com/PoojaniGeehara)
- [@kasunihansani](https://github.com/kasunihansani)
- [@BIHF](https://github.com/BIHF)

---

# 🎓 Project Information

**Project:** LankaGeo  
**Type:** Web-based Geospatial Flood Monitoring and Risk Assessment Platform  
**Frontend:** Next.js + TypeScript  
**Backend:** FastAPI + Python  
**Database:** PostgreSQL / PostGIS / Supabase  
**Satellite Data:** Sentinel-1 and Sentinel-2  
**Geospatial Processing:** Google Earth Engine  
**Deployment:** Vercel

LankaGeo was developed as an academic group project to demonstrate how **web technologies, geospatial data, satellite imagery, and image-processing techniques** can be combined to support flood monitoring and risk assessment.

---

