
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
export interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  position: number;
}

export interface Course {
  _id: string;
  title: string;
  playlistId: string;
  description: string;
  videos: {
    videoId: string;
    position: number;
  }[];
}


export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoId: string; // YouTube video ID
  duration: number; // in minutes
  completed?: boolean;
  watched?: number; // seconds watched
  moduleId: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // lesson IDs
  lastWatched: {
    lessonId: string;
    timestamp: number; // seconds
  };
  enrolledAt: string;
}
