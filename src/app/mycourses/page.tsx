"use client";

import { useAuth } from "@/hooks/AuthContext"; // Adjust if needed
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
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
}

// Progress Bar Component
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

// Placeholder component for course thumbnails
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
  const [error, setError] = useState("");
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("Please log in to view your courses.");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await apiCall("/course/mycourses");
        setCourses(response?.courses || []);

        // Calculate progress for each course
        const progress: Record<string, number> = {};
        response?.courses?.forEach((course: Course) => {
          const saved = localStorage.getItem(`progress-${course._id}`);
          if (saved) {
            try {
              const completedVideos = JSON.parse(saved);
              const totalVideos = course.videos?.length || 0;
              if (totalVideos > 0) {
                progress[course._id] = Math.round(
                  (completedVideos.length / totalVideos) * 100
                );
              }
            } catch (e) {
              console.error("Error parsing saved progress:", e);
              progress[course._id] = 0;
            }
          } else {
            progress[course._id] = 0;
          }
        });
        setCourseProgress(progress);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <p className="p-4 text-center">Loading courses...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (courses.length === 0)
    return <p className="p-4 text-center">No courses enrolled yet.</p>;

  return (
    <>
      <Header />
      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">
          My Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/course/${course._id}`)}
            >
              {course.thumbnail ? (
                <div className="relative w-full h-40 mb-4 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title || "Course Thumbnail"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        target.style.display = "none";
                        const placeholder = document.createElement("div");
                        placeholder.innerHTML = `
                          <div class="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                            <div class="text-center p-4">
                              <div class="text-4xl mb-2">📚</div>
                              <p class="text-blue-800 font-medium text-sm line-clamp-2">${course.title}</p>
                            </div>
                          </div>
                        `;
                        parent.appendChild(
                          placeholder.firstElementChild as HTMLElement
                        );
                      }
                    }}
                  />
                </div>
              ) : (
                <CourseThumbnail title={course.title} />
              )}
              <h3 className="text-xl font-semibold">{course.title}</h3>
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
                {/* <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-blue-600">
                    {courseProgress[course._id] || 0}% Complete
                  </span>
                </div> */}
                {/* <ProgressBar percentage={courseProgress[course._id] || 0} /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
