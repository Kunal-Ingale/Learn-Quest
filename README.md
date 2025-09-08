

**Transform YouTube Playlists into Interactive Learning Experiences**

---

## Overview

**Learning Quest** is a web application that enables users to convert YouTube educational content into structured, interactive courses. With features like progress tracking, note-taking, and a personalized dashboard, Coursify helps you learn at your own pace using content you love.

---

## Features

- **Convert YouTube Playlists**: Paste a YouTube playlist or video URL and seamlessly turn it into a structured course.
- **Track Progress**: Mark lessons as complete and see your learning journey visualized in your dashboard.
- **Organized Interface**: Enjoy a clean and intuitive UI for efficient learning.
- **Personal Dashboard**: View all your courses & completed lessons in one place.
- **Authentication**: Secure login, with courses and progress tied to your account.
- **Responsive Design**: Built mobile-first to look great on any device.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Firebase Account](https://firebase.google.com/) (for authentication & backend)
- [YouTube Data API Key](https://console.developers.google.com/) (for playlist/video fetching)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kunal-Ingale/Coursify.git

cd Coursify

# Install dependencies
yarn install
# or
npm install
```

### Configuration

1. **Environment Variables**:  
   Create a `.env.local` file in the root directory and add your configuration details (Firebase keys, YouTube API key, etc).

2. **Firebase Setup**:  
   - Set up a Firebase project for authentication and database.
   - Enable email/password authentication (or desired methods).

3. **YouTube API**:  
   - Obtain a YouTube Data API key and add it to your environment variables.

### Running the App

```bash
yarn dev
# or
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

## How It Works

1. **Paste a YouTube Playlist/Video URL**  
   Coursify fetches all videos and relevant metadata, preparing a course for you.
2. **Learn at Your Pace**  
   Watch videos in sequence, take notes, and track your progress.
3. **Track Your Progress**  
   Mark lessons as complete, review your notes, revisit any lesson, and visualize your achievements in the dashboard.

---

## Tech Stack

- **Frontend**: React (Next.js), TypeScript, TailwindCSS
- **Backend/API**: Node.js, Next.js API routes
- **Authentication**: Firebase Auth
- **Styling/UI**: TailwindCSS, Radix UI, custom components
- **Data Fetching**: YouTube Data API v3, Axios, SWR
- **Charts & Visualization**: Recharts

---

## Project Structure

```
Coursify/
├── src/
│   ├── api/                # API route controllers
│   ├── app/                # Next.js app directory
│   ├── components/         # React components (UI, features)
│   ├── lib/                # Utility functions
│   └── ... 
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
├── package.json
└── README.md
```

---

## Notable Components

- **MyCourses**: Fetches and displays the user's personalized courses.
- **Carousel**: Custom carousel for featured courses or lessons.
- **Chart**: Visualizes your progress and statistics.
- **UI Components**: Breadcrumbs, pagination, scroll areas, and more for a rich UX.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by [Kunal Ingale](https://github.com/Kunal-Ingale)

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repo and submit a pull request.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
