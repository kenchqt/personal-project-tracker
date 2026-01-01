# Personal Project Tracker

A simple and minimal project tracking app built with Expo and Firebase.

Track your coding or school projects with status management, deadlines, and tech stack tracking.

## Features

- ✅ Create, Read, Update, Delete projects
- ✅ Status tracking (Planned → In Progress → Done → Cancelled)
- ✅ Deadline management
- ✅ Tech stack tracking
- ✅ Search functionality
- ✅ Firebase backend for cloud sync
- ✅ Dark mode support

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up Firebase (Required)

   See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.
   
   Quick setup:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Get your Firebase config
   - Add credentials to `config/firebase.ts` or create a `.env` file
   - Enable Firestore Database in test mode

3. Start the app

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
