"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "../../../components/layout/Header";
import { apiCall } from "../../../lib/api";
import {
  getCourseProgress,
  updateCourseProgress,
} from "../../api/course/[courseId]/progress/progress";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../../hooks/AuthContext";

interface Video {
  videoId: string;
  title: string;
  description?: string;
  thumbnail: string;
  position: number;
  duration?: string;
}

interface Course {
  _id: string;
  title: string;
  playlistId: string;
  description: string;
  videos: Video[];
  createdAt: string;
}

interface ProgressHistory {
  videoId: string;
  videoTitle: string;
  completedAt: string;
  position: number;
}

// Compact Circular Progress Component
const CompactCircularProgress: React.FC<{
  percentage: number;
  size?: number;
}> = ({ percentage, size = 60 }) => {
  const radius = (size - 6) / 2;
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
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-blue-600">{percentage}%</span>
      </div>
    </div>
  );
};

// Duration formatter utility
const formatDuration = (duration?: string): string => {
  if (!duration) return "";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const CoursePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { logout } = useAuth();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  const [progressHistory, setProgressHistory] = useState<ProgressHistory[]>([]);
  const [showProgressHistory, setShowProgressHistory] = useState(false);

  // Check authentication first
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Course page auth state:", user?.uid || "No user");
      setAuthReady(!!user);
      if (!user) {
        toast.error("You must be logged in to view courses");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch course with authentication
  useEffect(() => {
    const fetchCourse = async () => {
      if (!authReady || !courseId || typeof courseId !== "string") return;

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching course:", courseId);

        const data = await apiCall(`/course/${courseId}`);
        console.log("Course fetched successfully:", data);

        if (!data || !data.videos || !Array.isArray(data.videos)) {
          throw new Error("Invalid course data received");
        }

        setCourse(data);

        // Fetch progress immediately after setting course
        try {
          const { progress, currentVideoId } = await getCourseProgress(
            courseId
          );
          console.log("Fetched progress:", progress);
          console.log("Fetched currentVideoId:", currentVideoId);

          const completedCount = Math.round(
            (progress / 100) * data.videos.length
          );
          const completedIds = data.videos
            .slice(0, completedCount)
            .map((v: Video) => v.videoId);
          setCompletedVideos(completedIds);

          const initial =
            data.videos.find((v: Video) => v.videoId === currentVideoId) ||
            data.videos[0];
          setCurrentVideo(initial);
          setProgressLoaded(true);
        } catch (err) {
          console.info(
            "No stored progress for this course yet or error fetching:",
            err
          );
          setCurrentVideo(data.videos[0]);
          setCompletedVideos([]);
          setProgressLoaded(true);
        }

        setStartDate(
          new Date(data.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        );
      } catch (err: any) {
        console.error("Error fetching course:", err);
        const errorMessage = err.message || "Failed to load course";
        setError(errorMessage);
        toast.error(errorMessage);

        if (
          err.message?.includes("404") ||
          err.message?.includes("not found")
        ) {
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, authReady, router]);

  // Load progress from localStorage
  // useEffect(() => {
  //   if (courseId && typeof courseId === "string") {
  //     const saved = localStorage.getItem(`progress-${courseId}`);
  //     if (saved) {
  //       try {
  //         setCompletedVideos(JSON.parse(saved));
  //       } catch (e) {
  //         console.error("Error parsing saved progress:", e);
  //         setCompletedVideos([]);
  //       }
  //     }
  //     setProgressLoaded(true);
  //   }
  // }, [courseId]);

  // // Save progress to localStorage
  // useEffect(() => {
  //   if (courseId && progressLoaded && typeof courseId === "string") {
  //     localStorage.setItem(
  //       `progress-${courseId}`,
  //       JSON.stringify(completedVideos)
  //     );
  //   }
  // }, [completedVideos, courseId, progressLoaded]);

  // // Load progress history from localStorage
  // useEffect(() => {
  //   if (courseId && typeof courseId === "string") {
  //     const saved = localStorage.getItem(`progress-history-${courseId}`);
  //     if (saved) {
  //       try {
  //         const history = JSON.parse(saved);
  //         // Sort by completedAt in descending order (latest first)
  //         history.sort(
  //           (a: ProgressHistory, b: ProgressHistory) =>
  //             new Date(b.completedAt).getTime() -
  //             new Date(a.completedAt).getTime()
  //         );
  //         setProgressHistory(history);
  //       } catch (e) {
  //         console.error("Error parsing saved progress history:", e);
  //         setProgressHistory([]);
  //       }
  //     }
  //   }
  // }, [courseId]);

  // ----------------------------------
  const progressPercent = useMemo(() => {
    if (!course) return 0;
    return Math.round((completedVideos.length / course.videos.length) * 100);
  }, [completedVideos, course]);

  // every time completedVideos or currentVideo changes – push to DB
  useEffect(() => {
    if (!course) return;

    // Don't update if we haven't loaded the initial progress yet
    if (!progressLoaded) return;

    const body: { progress?: number; currentVideoId?: string } = {};
    body.progress = progressPercent;
    if (currentVideo?.videoId) body.currentVideoId = currentVideo.videoId;

    // Only update if we have actual changes
    if (body.progress !== undefined || body.currentVideoId) {
      updateCourseProgress(course._id, body).catch((err) =>
        console.error("Could not update progress:", err)
      );
    }
  }, [progressPercent, currentVideo?.videoId, course, progressLoaded]);

  // -------------------------------------

  // Initialize YouTube API
  useEffect(() => {
    const scriptId = "youtube-iframe-api";
    if (!document.getElementById(scriptId)) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = scriptId;
      document.body.appendChild(tag);
    }

    const onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
      setPlayerReady(true);
    };

    (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    if ((window as any).YT && (window as any).YT.Player) {
      setPlayerReady(true);
    }

    return () => {
      if ((window as any).onYouTubeIframeAPIReady === onYouTubeIframeAPIReady) {
        (window as any).onYouTubeIframeAPIReady = undefined;
      }
    };
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (!playerReady || !currentVideo) return;

    const initializePlayer = () => {
      if (player) {
        player.destroy();
      }

      const newPlayer = new (window as any).YT.Player("yt-player", {
        videoId: currentVideo.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log("Player Ready");
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              // Mark video as completed
              if (!completedVideos.includes(currentVideo.videoId)) {
                setCompletedVideos((prev) => [...prev, currentVideo.videoId]);
              }

              // Auto-advance to next video if autoplay is enabled
              if (autoplay) {
                const currentIndex = course?.videos.findIndex(
                  (v) => v.videoId === currentVideo.videoId
                );
                if (
                  currentIndex !== undefined &&
                  currentIndex < (course?.videos.length || 0) - 1
                ) {
                  setTimeout(() => {
                    handleNextVideo();
                  }, 1500);
                }
              }
            }
          },
          onError: (event: any) => {
            console.error("YouTube player error:", event.data);
            toast.error("Error loading video. Please try another video.");
          },
        },
      });

      setPlayer(newPlayer);
    };

    const timer = setTimeout(initializePlayer, 100);

    return () => {
      clearTimeout(timer);
      if (player && typeof player.destroy === "function") {
        player.destroy();
      }
    };
  }, [
    playerReady,
    currentVideo?.videoId,
    course?.videos,
    autoplay,
    completedVideos,
  ]);

  const handleVideoClick = (video: Video) => {
    if (video.videoId !== currentVideo?.videoId) {
      setCurrentVideo(video);
    }
  };

  const handleNextVideo = () => {
    if (!course || !currentVideo) return;

    const currentIndex = course.videos.findIndex(
      (v) => v.videoId === currentVideo.videoId
    );
    if (currentIndex < course.videos.length - 1) {
      setCurrentVideo(course.videos[currentIndex + 1]);
    }
  };

  const handlePrevVideo = () => {
    if (!course || !currentVideo) return;

    const currentIndex = course.videos.findIndex(
      (v) => v.videoId === currentVideo.videoId
    );
    if (currentIndex > 0) {
      setCurrentVideo(course.videos[currentIndex - 1]);
    }
  };

  const toggleAutoplay = () => {
    setAutoplay((prev) => !prev);
  };

  const currentVideoIndex = useMemo(() => {
    if (!course || !currentVideo) return -1;
    return course.videos.findIndex((v) => v.videoId === currentVideo.videoId);
  }, [course, currentVideo]);

  const canGoPrev = currentVideoIndex > 0;
  const canGoNext = currentVideoIndex < (course?.videos.length || 0) - 1;

  // Update progress history when a video is completed
  const updateProgressHistory = (video: Video) => {
    const newHistory = [
      {
        videoId: video.videoId,
        videoTitle: video.title,
        completedAt: new Date().toISOString(),
        position: video.position,
      },
      ...progressHistory,
    ];
    setProgressHistory(newHistory);
    localStorage.setItem(
      `progress-history-${courseId}`,
      JSON.stringify(newHistory)
    );
  };

  // Modify the existing toggleCompleted function
  const toggleCompleted = (videoId: string) => {
    const video = course?.videos.find((v) => v.videoId === videoId);
    if (!video) return;

    setCompletedVideos((prev) => {
      const newCompleted = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];

      // Update history only when marking as complete
      if (!prev.includes(videoId)) {
        updateProgressHistory(video);
      }

      return newCompleted;
    });
  };

  // Replace any router.push() calls with Next.js router.push()
  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  if (loading || !course) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </>
    );
  }

  if (!authReady) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-gray-600 mb-4">
              Please log in to view this course.
            </p>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error || "Course not found."}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 overflow-hidden relative">
        {/* Top Header with Course Title and Progress */}
        <div className="bg-blue-50 rounded-xl shadow-md border border-blue-200 my-4 mx-4 lg:mx-6 p-4 lg:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-800">
                <span className="font-medium">
                  Channel: {course.description || "Unknown Channel"}
                </span>
                <span>{course.videos.length} videos</span>
                <span>Started on {startDate}</span>
              </div>
            </div>
            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                Progress:
              </span>
              <div className="h-12 w-12 relative">
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "center center",
                  }}
                >
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset={100 - progressPercent}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout (Video and List) */}
        <div className="flex flex-col lg:flex-row px-4 lg:px-6 pb-4 lg:pb-6 gap-6 relative z-0">
          {/* Video Player Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="aspect-video w-full bg-gray-900">
              {currentVideo ? (
                <div id="yt-player" className="w-full h-full"></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p className="text-center px-4">
                    Select a video to start watching
                  </p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 lg:p-2 lg:px-4 gap-3 sm:gap-0 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handlePrevVideo}
                  disabled={!canGoPrev}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    canGoPrev
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <button
                  onClick={handleNextVideo}
                  disabled={!canGoNext}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    canGoNext
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={toggleAutoplay}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Autoplay
                  </span>
                </label>

                <div className="text-sm text-gray-500 pl-3 border-l">
                  {currentVideoIndex + 1} of {course.videos.length}
                </div>
              </div>
            </div>

            {/* Current Video Info */}
            {currentVideo && (
              <div className="p-4 lg:p-6 bg-gray-50 rounded-b-lg mt-0 flex-1 overflow-y-auto">
                <h2 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  {currentVideo.position}. {currentVideo.title}
                </h2>
                {currentVideo.description && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-2">
                    {currentVideo.description}
                  </p>
                )}
                {currentVideo.duration && (
                  <div className="text-xs text-gray-500">
                    Duration: {formatDuration(currentVideo.duration)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video List Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            {/* Video List Header */}
            <div className="bg-white px-4 lg:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                  Course Content
                </h2>
              </div>
            </div>

            {/* Tabs for Video List and Progress History */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    !showProgressHistory
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setShowProgressHistory(false)}
                >
                  Videos
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    showProgressHistory
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setShowProgressHistory(true)}
                >
                  Progress History
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-y-auto hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 400px)" }}
            >
              {!showProgressHistory ? (
                // Video List
                <div className="divide-y divide-gray-100">
                  {course.videos.map((video) => (
                    <div
                      key={video.videoId}
                      onClick={() => handleVideoClick(video)}
                      className={`px-4 lg:px-6 py-3 lg:py-4 cursor-pointer transition-all duration-200 hover:bg-blue-100 ${
                        currentVideo?.videoId === video.videoId
                          ? "bg-blue-50 border-r-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 lg:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 lg:gap-3 mb-1">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                currentVideo?.videoId === video.videoId
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {video.position}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-medium line-clamp-2 ${
                                currentVideo?.videoId === video.videoId
                                  ? "text-blue-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {video.title}
                            </span>
                          </div>
                          {video.duration && (
                            <div className="text-xs text-gray-500 ml-6 lg:ml-8">
                              {formatDuration(video.duration)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {completedVideos.includes(video.videoId) && (
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-2 h-2 lg:w-3 lg:h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompleted(video.videoId);
                            }}
                            className={`text-xs px-2 lg:px-3 py-1 rounded-full font-medium transition-all ${
                              completedVideos.includes(video.videoId)
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {completedVideos.includes(video.videoId)
                              ? "✓"
                              : "Mark Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Progress History
                <div className="divide-y divide-gray-100">
                  {progressHistory.length > 0 ? (
                    progressHistory.map((item) => (
                      <div
                        key={`${item.videoId}-${item.completedAt}`}
                        className="px-4 lg:px-6 py-3 lg:py-4"
                      >
                        <div className="flex items-start justify-between gap-3 lg:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 lg:gap-3 mb-1">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                                {item.position}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-gray-900">
                                {item.videoTitle}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 ml-6 lg:ml-8">
                              Completed on{" "}
                              {new Date(item.completedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2 h-2 lg:w-3 lg:h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 lg:px-6 py-8 text-center text-gray-500">
                      No progress history yet. Complete some videos to see your
                      progress here.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .hide-scrollbar {
          -ms-overflow-style: none; /* Internet Explorer and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </>
  );
};

export default CoursePage;
