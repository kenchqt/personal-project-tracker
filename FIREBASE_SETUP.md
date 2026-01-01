# Firebase Setup Guide

Follow these steps to connect your Personal Project Tracker to Firebase.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name
4. Enable or disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll to "Your apps" section
4. Click the web icon to add a web app
5. Register your app with a nickname
6. Copy the Firebase configuration object

Your configuration should look like this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 3: Configure Your App

Your Firebase credentials are already in `config/firebase.ts`. No additional setup needed.

If you want to use environment variables instead:
1. Create a `.env` file in the root directory
2. Add your Firebase credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location for your database
5. Click "Enable"

## Step 5: Update Firestore Security Rules

Important: You must update the security rules or you'll get a "Missing or insufficient permissions" error.

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish"
5. Wait 10-30 seconds for rules to update

What these rules do:
- Allow public read/write access to the projects collection
- Perfect for personal project tracker without authentication
- For production apps, add authentication and restrict access

## Step 6: Test the Connection

1. Start your app: `npm start`
2. Try creating a project
3. Check Firebase Console > Firestore Database to see if the project appears

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Make sure you updated the Firestore security rules (Step 5)
- Wait 10-30 seconds after publishing rules
- Verify you're in the correct Firebase project

### Error: "Firebase: Error (auth/configuration-not-found)"
- Check that your Firebase config is in `config/firebase.ts`
- Restart your Expo development server after adding environment variables

### Data not syncing
- Check your internet connection
- Verify Firebase configuration is correct
- Check browser/device console for errors

## Features

- Real-time database with Firestore
- Cloud storage (no local storage limits)
- Automatic sync across devices
- Offline support (Firestore caches data locally)
- Scalable and secure

## Next Steps (Optional)

- Add Firebase Authentication for user accounts
- Add real-time listeners for live updates
- Set up proper security rules for production
- Add data validation in Firestore

