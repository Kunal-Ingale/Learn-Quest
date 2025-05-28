"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";
import Header from "@/components/layout/Header";

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
        const token = await user.getIdToken(); // 🔥 Get Firebase ID token
        const res = await axios.get("/api/course/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(res.data)) {
          setCourses(res.data);
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

export default MyCourses;
