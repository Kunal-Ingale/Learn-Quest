"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/Header";
import { getAuthHeaders } from "@/lib/api";

// Safe imports with fallbacks
const SafeComponent = ({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Component render error:", error);
    return <>{fallback}</>;
  }
};

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  // Simulate auth check for now
  useEffect(() => {
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      setAuthReady(true);
      setLoading(false);
      console.log("Auth simulation complete");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //handleconvert
  const handleConvert = async (playlistUrl: string) => {
    if (!playlistUrl.trim()) {
      alert("Please enter a valid playlist URL.");
      return;
    }

    try {
      const headers = await getAuthHeaders();

      const response = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        headers,
        body: JSON.stringify({ playlistUrl }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Course already exists – handle conflict and redirect to course
        if (data.courseId) {
          console.log("Course already exists, redirecting:", data.courseId);
          setIsModalOpen(false);
          router.push(`/course/${encodeURIComponent(data.courseId)}`);
        } else {
          throw new Error("Conflict occurred, but no courseId provided.");
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || "API request failed");
      }

      if (!data.courseId) {
        throw new Error("No course ID received from server");
      }

      console.log("New course created:", data.courseId);
      setIsModalOpen(false);
      router.push(`/course/${encodeURIComponent(data.courseId)}`);
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Something went wrong while converting the playlist.");
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <SafeComponent fallback={<div>Error loading page</div>}>
        <div className="min-h-screen bg-gray-50">
          {/* <Header /> */}
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-24">
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  Turn YouTube Playlists into Interactive Courses
                </h1>
                <p className="text-xl text-white/80 max-w-2xl">
                  Transform YouTube educational content into structured
                  learning. Track progress, take notes, and learn at your pace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                    onClick={handleModalToggle}
                  >
                    Try Now
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-6 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center"
                  >
                    <span className="mr-2">▶</span> Start Learning
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Simple Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Convert YouTube Playlist
                </h3>
                <input
                  type="text"
                  placeholder="Enter YouTube playlist URL..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConvert(e.currentTarget.value);
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const input = document.querySelector(
                        "input"
                      ) as HTMLInputElement;
                      handleConvert(input?.value || "");
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Convert
                  </button>
                  <button
                    onClick={handleModalToggle}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* How It Works */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-center text-3xl font-bold mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "1. Select YouTube Content",
                    desc: "Paste a YouTube playlist URL or video, and we'll transform it into a structured course.",
                  },
                  {
                    title: "2. Learn at Your Pace",
                    desc: "Watch videos in an organized interface with progress tracking and note-taking.",
                  },
                  {
                    title: "3. Track Your Progress",
                    desc: "Mark lessons as complete, review notes, and see your learning journey in the dashboard.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-6"
                  >
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">📖</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Courses */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold">
                    {user ? "Your Courses" : "Get Started"}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {featuredCourses.length === 0
                      ? "No courses yet. Create your first course!"
                      : `${featuredCourses.length} courses available`}
                  </p>
                </div>
                <Link
                  href="/browse"
                  className="mt-4 md:mt-0 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  Browse All
                  <span className="ml-2">→</span>
                </Link>
              </div>

              {featuredCourses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <h3 className="font-semibold">
                        {course.title || `Course ${index + 1}`}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {course.description || "Course description"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first course from a YouTube playlist
                  </p>
                  <button
                    onClick={handleModalToggle}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Learning?
                  </h2>
                  <p className="text-white/80 text-lg mb-8">
                    Create your first course from YouTube content in minutes.
                  </p>
                  <button
                    onClick={handleModalToggle}
                    className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SafeComponent>
    </>
  );
};

export default Home;
