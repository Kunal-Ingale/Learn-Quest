"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import { apiCall } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Circular Progress Component
const CircularProgress: React.FC<{ percentage: number; size?: number }> = ({
  percentage,
  size = 40,
}) => {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-blue-600">{percentage}%</span>
      </div>
    </div>
  );
};

interface Course {
  _id: string;
  title: string;
  playlistId: string;
  createdAt: string;
  description?: string;
  thumbnail?: string;
  videos?: any[];
  progress?: number;
  currentVideoId?: string;
}

const MyCourses: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const router = useRouter();

  const handleDeleteCourse = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      const response = await apiCall(`/course/${courseId}`, {
        method: "DELETE",
      });

      if (response.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
      } else {
        throw new Error(response.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeletingCourseId(null);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    const fetchCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const data = await apiCall("/course/mycourses");
        if (data && data.courses) {
          // Ensure progress is a number between 0 and 100 and sort by date
          const coursesWithProgress = data.courses
            .map((course: Course) => ({
              ...course,
              progress:
                typeof course.progress === "number"
                  ? Math.round(course.progress)
                  : 0,
            }))
            .sort(
              (a: Course, b: Course) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          console.log("Courses with progress:", coursesWithProgress);
          setCourses(coursesWithProgress);
        } else {
          console.error("Unexpected response format:", data);
          setCourses([]);
          setError("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="p-4">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {courses.length === 0 ? (
          <p>You haven't created any courses yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0">
            {courses.map((course) => (
              <li
                key={course._id}
                className="border p-4 rounded shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white relative"
              >
                <Link href={`/course/${course._id}`} className="block h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold flex-1 pr-2">
                      {course.title}
                    </h3>
                    <div className="flex-shrink-0">
                      <CircularProgress percentage={course.progress || 0} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded mt-2"
                    />
                  )}
                  <div className="mt-3 text-sm text-gray-500">
                    <p>
                      Started:{" "}
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {course.videos && (
                      <p className="mt-1">
                        {course.videos.length}{" "}
                        {course.videos.length === 1 ? "video" : "videos"}
                      </p>
                    )}
                  </div>
                </Link>
                <button
                  onClick={(e) => handleDeleteCourse(course._id, e)}
                  disabled={deletingCourseId === course._id}
                  className="absolute bottom-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Delete course"
                >
                  {deletingCourseId === course._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const MyCoursesPage = dynamic(() => Promise.resolve(MyCourses), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ),
});

export default MyCoursesPage;
