"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import { apiCall } from "@/lib/api";

interface Course {
  _id: string;
  title: string;
  playlistId: string;
  createdAt: string;
  description?: string;
  thumbnail?: string;
  videos?: any[];
}

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const data = await apiCall("/course/mycourses");
        if (data && data.courses) {
          setCourses(data.courses);
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

    fetchCourses();
  }, [user]);

  if (loading)
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
          <ul className="space-y-4">
            {courses.map((course) => (
              <li
                key={course._id}
                className="border p-4 rounded shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded mt-2"
                  />
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Created at: {new Date(course.createdAt).toLocaleString()}
                </p>
                {course.videos && (
                  <p className="text-sm text-muted-foreground">
                    {course.videos.length} videos
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

// Dynamically import the MyCourses component with SSR disabled
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
