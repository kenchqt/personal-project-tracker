# Docker Setup

This project is dockerized and can be run using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

```bash
docker build -t personal-project-tracker .
```

## Running the Container

```bash
docker run -d -p 8080:80 personal-project-tracker
```

The app will be available at: http://localhost:8080

## Using Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

## How It Works

1. **Build Stage**: Uses Node.js 22 to install dependencies and build the Expo web app
2. **Production Stage**: Uses nginx to serve the static files
3. The build process:
   - Copies package files
   - Installs npm dependencies
   - Copies source code
   - Builds the web app using `expo export:web`
   - Serves the built files with nginx

## Notes

- The app runs on port 80 inside the container
- Mapped to port 8080 on your host machine (you can change this)
- Firebase configuration should be set in `config/firebase.ts` before building
- The `.dockerignore` file excludes unnecessary files from the build

