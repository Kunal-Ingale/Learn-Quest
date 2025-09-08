import React, { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import Header from "@/components/layout/Header";
import Link from "next/link";

// Circular progress component
const CircularProgress: React.FC<{ percentage: number; size?: number }> = ({
  percentage,
  size = 40,
}) => {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
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
          strokeDasharray={circumference}
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiCall("/course/mycourses");
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      }
    };

    fetchCourses();
  }, []);

  if (error) {
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
  }

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
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyCourses;
