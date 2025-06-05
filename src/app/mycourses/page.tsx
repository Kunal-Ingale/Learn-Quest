"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";

interface Course {
  _id: string;
  title: string;
  playlistId: string;
  createdAt: string;
}

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await axios.get("/api/course/mycourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data.courses) {
          setCourses(res.data.courses);
        } else {
          console.error("Unexpected response format:", res.data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <p className="p-4">Loading your courses...</p>;

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
              <li key={course._id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p>Playlist ID: {course.playlistId}</p>
                <p className="text-sm text-muted-foreground">
                  Created at: {new Date(course.createdAt).toLocaleString()}
                </p>
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
