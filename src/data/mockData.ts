
import { Course, User, UserProgress } from "../types";

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "React Fundamentals for Beginners",
    description: "Learn the basics of React.js, including components, props, and state management.",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=337",
    instructor: "Sarah Johnson",
    totalLessons: 12,
    totalDuration: 180, // 3 hours
    progress: 35,
    modules: [
      {
        id: "m1",
        title: "Getting Started with React",
        lessons: [
          {
            id: "l1",
            title: "Introduction to React",
            videoId: "QFaFIcGhPoM", // Actual React intro video
            duration: 12,
            completed: true,
            moduleId: "m1"
          },
          {
            id: "l2",
            title: "Setting Up Your Development Environment",
            videoId: "4UZrsTqkcW4", // Another React video
            duration: 15,
            completed: true,
            moduleId: "m1"
          },
          {
            id: "l3",
            title: "Your First React Component",
            videoId: "RVFAyFWO4go", // React component video
            duration: 18,
            moduleId: "m1"
          }
        ]
      },
      {
        id: "m2",
        title: "React State and Props",
        lessons: [
          {
            id: "l4",
            title: "Understanding Props",
            videoId: "GQ9tZSBmZKo", // Props video
            duration: 14,
            moduleId: "m2"
          },
          {
            id: "l5",
            title: "State in React Components",
            videoId: "O6P86uwfdR0", // State video
            duration: 16,
            moduleId: "m2"
          },
          {
            id: "l6",
            title: "Handling Events in React",
            videoId: "0XSDAup85SA", // Events video
            duration: 12,
            moduleId: "m2"
          }
        ]
      },
    ],
    createdAt: "2023-09-15T12:00:00Z",
    updatedAt: "2023-09-15T12:00:00Z",
  },
  {
    id: "c2",
    title: "Advanced JavaScript Techniques",
    description: "Master advanced JavaScript concepts including closures, promises, and async/await.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=337",
    instructor: "Michael Chen",
    totalLessons: 10,
    totalDuration: 150, // 2.5 hours
    progress: 70,
    modules: [
      {
        id: "m3",
        title: "Modern JavaScript Features",
        lessons: [
          {
            id: "l7",
            title: "ES6+ Syntax Overview",
            videoId: "NCwa_xi0Uuc",
            duration: 18,
            completed: true,
            moduleId: "m3"
          },
          {
            id: "l8",
            title: "Destructuring and Spread Operators",
            videoId: "NIq3qLaHNFw",
            duration: 14,
            completed: true,
            moduleId: "m3"
          }
        ]
      },
      {
        id: "m4",
        title: "Asynchronous JavaScript",
        lessons: [
          {
            id: "l9",
            title: "Promises in Depth",
            videoId: "DHvZLI7Db8E",
            duration: 17,
            completed: true,
            moduleId: "m4"
          },
          {
            id: "l10",
            title: "Async/Await Patterns",
            videoId: "vn3tm0quoqE",
            duration: 15,
            moduleId: "m4"
          }
        ]
      }
    ],
    createdAt: "2023-08-10T10:30:00Z",
    updatedAt: "2023-08-10T10:30:00Z",
  },
  {
    id: "c3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamental principles of creating user-friendly interfaces and experiences.",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=337",
    instructor: "Elena Rodriguez",
    totalLessons: 8,
    totalDuration: 120, // 2 hours
    progress: 10,
    modules: [
      {
        id: "m5",
        title: "Introduction to UI Design",
        lessons: [
          {
            id: "l11",
            title: "Basic Design Principles",
            videoId: "3oYBZFGJOgw",
            duration: 15,
            completed: true,
            moduleId: "m5"
          },
          {
            id: "l12",
            title: "Color Theory for Designers",
            videoId: "Co9O4zJy5rY",
            duration: 16,
            moduleId: "m5"
          }
        ]
      },
      {
        id: "m6",
        title: "UX Research Methods",
        lessons: [
          {
            id: "l13",
            title: "User Interviews and Surveys",
            videoId: "CU_GWeULG0w",
            duration: 12,
            moduleId: "m6"
          },
          {
            id: "l14",
            title: "Usability Testing",
            videoId: "JE3XUXK8VqE",
            duration: 14,
            moduleId: "m6"
          }
        ]
      }
    ],
    createdAt: "2023-07-20T15:45:00Z",
    updatedAt: "2023-07-20T15:45:00Z",
  },
  {
    id: "c4",
    title: "Full Stack Development with Node.js",
    description: "Build complete web applications using Node.js, Express, and MongoDB.",
    thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=337",
    instructor: "David Patterson",
    totalLessons: 15,
    totalDuration: 225, // 3.75 hours
    modules: [
      {
        id: "m7",
        title: "Node.js Basics",
        lessons: [
          {
            id: "l15",
            title: "Introduction to Node.js",
            videoId: "TlB_eWDSMt4",
            duration: 18,
            moduleId: "m7"
          },
          {
            id: "l16",
            title: "NPM and Package Management",
            videoId: "jHDhaSSKmB0",
            duration: 12,
            moduleId: "m7"
          }
        ]
      },
      {
        id: "m8",
        title: "Building REST APIs with Express",
        lessons: [
          {
            id: "l17",
            title: "Express.js Framework Fundamentals",
            videoId: "L72fhGm1tfE",
            duration: 22,
            moduleId: "m8"
          },
          {
            id: "l18",
            title: "RESTful API Design",
            videoId: "eSYD2d0E9-k",
            duration: 19,
            moduleId: "m8"
          }
        ]
      }
    ],
    createdAt: "2023-10-05T09:20:00Z",
    updatedAt: "2023-10-05T09:20:00Z",
  }
];

export const mockUser: User = {
  id: "u1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80"
};

export const mockUserProgress: UserProgress[] = [
  {
    userId: "u1",
    courseId: "c1",
    completedLessons: ["l1", "l2"],
    lastWatched: {
      lessonId: "l3",
      timestamp: 45
    },
    enrolledAt: "2023-10-01T08:30:00Z"
  },
  {
    userId: "u1",
    courseId: "c2",
    completedLessons: ["l7", "l8", "l9"],
    lastWatched: {
      lessonId: "l10",
      timestamp: 120
    },
    enrolledAt: "2023-09-15T14:45:00Z"
  },
  {
    userId: "u1",
    courseId: "c3",
    completedLessons: ["l11"],
    lastWatched: {
      lessonId: "l12",
      timestamp: 30
    },
    enrolledAt: "2023-10-10T11:20:00Z"
  }
];
