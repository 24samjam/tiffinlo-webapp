# Tiffinlo Backend Setup (Firebase)

Your backend uses Firebase Authentication (Phone) for real OTP login and signup, and Firestore as the database for users and orders. This is the right fit because tiffinlo is phone first. Follow these once, then everything works locally and on Vercel.

## 1. Create a Firebase project (about 5 minutes)

1. Go to https://console.firebase.google.com and click Add project. Name it tiffinlo.
2. You can skip Google Analytics.

## 2. Add a Web app

1. In the project, click the web icon (</>) to register a web app. Call it tiffinlo-web.
2. Firebase shows you a config object. Copy these values into your `.env.local` file:
   - apiKey to NEXT_PUBLIC_FIREBASE_API_KEY
   - authDomain to NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - projectId to NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - storageBucket to NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - messagingSenderId to NEXT_PUBLIC_FIREBASE_SENDER_ID
   - appId to NEXT_PUBLIC_FIREBASE_APP_ID

## 3. Turn on Phone sign in

1. Left menu, Build, Authentication, Get started.
2. Sign in method tab, enable Phone.
3. Authorized domains already includes localhost, so local testing works.

### Test without spending on SMS (recommended for now)
Still on the Phone provider screen, open Phone numbers for testing and add a fake number with a fixed code, for example:
- Phone: +91 9999999999
- Code: 123456

Now you can sign up and log in using that number and code with no real SMS sent. Add real SMS later by upgrading to the Blaze plan when you launch.

## 4. Create the database

1. Left menu, Build, Firestore Database, Create database.
2. Start in production mode, pick the asia-south1 (Mumbai) region.
3. Go to the Rules tab, paste this, and Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /orders/{orderId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

This means a logged in user can only read and write their own data.

## 5. Run it

```
npm install
npm run dev -- -p 3005
```

Open http://localhost:3005, go to Start my tiffin journey, sign up with your test number and code. Check Firestore, you will see a users document appear. Finish a journey and a fake payment, and an order appears under that user.

## What is built

- Signup: name plus phone, real OTP, creates the user in Firestore.
- Login: phone plus OTP for returning users.
- Account page: shows profile and subscriptions, log out.
- Header: shows Log in or Account depending on state.
- Checkout: writes the order to the logged in user on payment success.
- Onboarding answers are saved to the user profile.

## When you go live

- Upgrade Firebase to Blaze for real SMS OTP at scale.
- Move Razorpay from test to live keys.
- Keep the same env variable names on Vercel (Project Settings, Environment Variables).
