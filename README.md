# Personal Project Tracker

A simple and minimal project tracking app built with React Native and Firebase. Track your coding or school projects with status management, deadlines, and tech stack tracking.

## Features

- Create, Read, Update, Delete projects
- Status tracking (Planned → In Progress → Done → Cancelled)
- Deadline management with date picker
- Tech stack tracking (add multiple technologies)
- Search functionality
- Firebase backend for cloud sync
- Dark mode support
- Minimal and clean UI design
- Offline support (Firestore caches data locally)
- Real-time data sync across devices

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase Firestore
- **Language**: TypeScript
- **UI Components**: React Native components with custom theming
- **Icons**: Expo Vector Icons (Ionicons)
- **Date Picker**: @react-native-community/datetimepicker
- **State Management**: React Hooks (useState, useCallback, useMemo)
- **Storage**: Firebase Firestore (cloud database)

## Getting Started

### Option 1: Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/kenchqt/personal-project-tracker.git
   cd personal-project-tracker
   ```

2. Build the Docker image:
   ```bash
   docker build -t personal-project-tracker .
   ```

3. Run the container:
   ```bash
   docker run -d -p 8080:80 personal-project-tracker
   ```

4. Access the app:
   Open your browser and go to: http://localhost:8080

### Option 2: Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions
   - Configure Firebase credentials in `config/firebase.ts`
   - Enable Firestore Database in Firebase Console

3. Start the app:
   ```bash
   npm start
   ```

## Project Structure

```
├── app/                 # App screens and routing
├── components/          # Reusable UI components
├── config/             # Firebase configuration
├── constants/          # App constants and themes
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and storage
```

## Docker

This project is fully dockerized. See [DOCKER.md](./DOCKER.md) for detailed Docker setup and usage instructions.

**Quick Docker Commands:**
```bash
# Build
docker build -t personal-project-tracker .

# Run
docker run -d -p 8080:80 personal-project-tracker

# Stop
docker stop <container-id>

# View logs
docker logs <container-id>
```

## Documentation

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration guide
- [DOCKER.md](./DOCKER.md) - Docker setup and usage

(For educational use only.)
