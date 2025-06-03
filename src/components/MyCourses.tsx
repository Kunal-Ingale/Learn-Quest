"use client";

import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  createdAt: string;
  videos?: Array<{
    videoId: string;
    title: string;
    position: number;
  }>;
  videoIds?: string[];
  completed?: string[];
  progress?: number;
  currentVideoId?: string;
}

const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const CourseThumbnail = ({ title }: { title: string }) => (
  <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
    <div className="text-center p-4">
      <div className="text-4xl mb-2">📚</div>
      <p className="text-blue-800 font-medium text-sm line-clamp-2">{title}</p>
    </div>
  </div>
);

const MyCourses = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);

  // First check authentication
  useEffect(() => {
    if (user === null) {
      setAuthChecked(true);
      setError("Please log in to view your courses.");
      setLoading(false);
    } else if (user) {
      setAuthChecked(true);
    }
  }, [user]);

  // Then fetch courses if authenticated
  useEffect(() => {
    const fetchCourses = async () => {
      if (!authChecked || !user) return;

      try {
        setLoading(true);
        setError("");

        // Get Firebase ID token
        const token = await user.getIdToken();

        // Fetch courses
        const response = await axios.get("/api/course/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          response.data.map(async (course: Course) => {
            try {
              const progressResponse = await axios.get(
                `/api/course/${course._id}/progress`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              return {
                ...course,
                progress: progressResponse.data.progress || 0,
                currentVideoId: progressResponse.data.currentVideoId || "",
              };
            } catch (err) {
              console.error(
                `Error fetching progress for course ${course._id}:`,
                err
              );
              return {
                ...course,
                progress: 0,
                currentVideoId: "",
              };
            }
          })
        );

        setCourses(coursesWithProgress);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, authChecked]);

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 mb-4">No courses enrolled yet.</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">
          My Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...courses]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((course) => {
              const firstVideoId =
                course.videos?.[0]?.videoId || course.videoIds?.[0];
              const progressPercent = course.progress ?? 0;
              const totalVideos =
                course.videos?.length ?? course.videoIds?.length ?? 0;
              const completedVideos = Math.round(
                (progressPercent / 100) * totalVideos
              );

              return (
                <div
                  key={course._id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/course/${course._id}`)}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title || "Course Thumbnail"}
                      className="w-full h-40 object-cover rounded mb-4"
                      onError={(e) => {
                        console.error(
                          "Image failed to load:",
                          course.thumbnail
                        );
                        e.currentTarget.src = `https://img.youtube.com/vi/${firstVideoId}/mqdefault.jpg`;
                      }}
                    />
                  ) : firstVideoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${firstVideoId}/mqdefault.jpg`}
                      alt={course.title || "Course Thumbnail"}
                      className="w-full h-40 object-cover rounded mb-4"
                      onError={(e) => {
                        console.error(
                          "YouTube thumbnail failed to load:",
                          firstVideoId
                        );
                        e.currentTarget.src = ""; // This will trigger the fallback to CourseThumbnail
                      }}
                    />
                  ) : (
                    <CourseThumbnail title={course.title} />
                  )}

                  <h3 className="text-xl font-semibold line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Channel:</span>{" "}
                      {course.description || "Unknown Channel"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Added on{" "}
                      {new Date(course.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {/* Progress */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-blue-600">
                        {progressPercent}% Complete
                      </span>
                    </div>
                    <ProgressBar percentage={progressPercent} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
