# DINEROES | Budget Tracker

![Dineroes Logo](./src/assets/Dineroes_logo256.png)

Welcome to Dineroes, a simple and efficient web app for managing your personal finances. The app is built using Vite, React, TypeScript, and Tailwind CSS for a modern and responsive user experience. It also integrates with Firebase for backend services and Google Sign-In for seamless authentication.

# [LIVE SITE](https://dineroes.netlify.app/)

## Features

- Clean and intuitive user interface
- Track income and expenses
- Create custom categories
- Analyze your spending with charts and graphs
- Monthly and yearly budget planning // coming soon
- Search and filter transactions // coming soon
- Export and import data // coming soon
- Google Sign-In for easy authentication
- Real-time data syncing with Firebase
- Fully responsive design

## Getting Started

To get started with the project, follow these steps:

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (@latest preferably)
- Firebase account

### Installation

1. Clone the repository:

```
git clone https://github.com/jamzu98/Dineroes.git
```

2. Change to the project directory:

```
cd Dineroes
```

3. Install dependencies:

```
npm install
```

4. Create a `.env` file in the root directory and fill in the necessary Firebase configuration and Google API credentials:

```
VITE_API_KEY=<your-firebase-api-key>
VITE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_PROJECT_ID=<your-firebase-project-id>
VITE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
VITE_APP_ID=<your-firebase-app-id>
```

5. Start the development server:

```
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`.

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Google Sign-In](https://developers.google.com/identity)
