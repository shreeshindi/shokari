# Shokari

A minimal website with an "Antigravity" particle animation system and Strapi CMS backend.

## Features

- **Minimal Design**: Clean, typography-focused layout
- **Antigravity Particles**: Interactive background with upward-floating particles that respond to mouse movement
- **Headless CMS**: Strapi backend for dynamic content management
- **Docker Support**: Self-contained deployment with Docker Compose

## Project Structure

```
shokari/
├── index.html          # Frontend HTML
├── styles.css          # Frontend CSS
├── script.js           # Frontend JavaScript (particles + CMS integration)
├── Dockerfile          # Frontend Docker image
├── docker-compose.yml  # Docker Compose configuration
└── backend/            # Strapi CMS
    ├── src/
    │   └── api/
    │       ├── home-page/    # Home Page content type (Single Type)
    │       └── feature/      # Feature content type (Collection Type)
    └── Dockerfile      # Backend Docker image
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

1. **Start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:8080
   - Strapi Admin: http://localhost:1337/admin

3. **First-time Strapi setup:**
   - Visit http://localhost:1337/admin
   - Create an admin account
   - Go to Settings > Users & Permissions > Roles > Public
   - Enable permissions for `home-page` (find, findOne) and `feature` (find, findOne)
   - Create content in the Content Manager

### Local Development

#### Frontend
Simply open `index.html` in a browser, or use a local server:
```bash
npx serve .
```

#### Backend
```bash
cd backend
npm install
npm run develop
```

## Content Types

### Home Page (Single Type)
- `companyName`: Company name
- `tagline_jp`, `tagline_kn`, `tagline_en`: Taglines in Japanese, Kannada, and English
- `status_jp`, `status_kn`, `status_en`: Status messages
- `update_jp`, `update_kn`, `update_en`: Update messages

### Feature (Collection Type)
- `title_jp`, `title_kn`, `title_en`: Feature titles in multiple languages
- `description`: Feature description

## License

© 2025 Shokari. All rights reserved.
