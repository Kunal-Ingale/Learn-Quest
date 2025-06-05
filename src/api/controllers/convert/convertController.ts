// src/api/convert/controllers/convert/convertController.ts
import { Request, Response } from "express";
import Course from "@/models/Course";
import dotenv from "dotenv";
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export const handleConvert = async (req: Request, res: Response) => {
  const { playlistUrl } = req.body;

  if (!playlistUrl) {
    console.error("Missing playlist URL in request");
    return res.status(400).json({ error: "Missing playlist URL" });
  }

  console.log("Processing playlist URL:", playlistUrl);
  const playlistId = getPlaylistId(playlistUrl);
  if (!playlistId) {
    console.error("Invalid playlist URL format:", playlistUrl);
    return res.status(400).json({ error: "Invalid playlist URL" });
  }

  console.log("Extracted playlist ID:", playlistId);
  const userId = req.user?.uid;
  if (!userId) {
    console.error("No user ID found in request");
    return res.status(401).json({ error: "Unauthorized: Missing userId" });
  }

  try {
    // Check if course already exists for this user and playlist
    console.log("Checking for existing course for user:", userId, "playlist:", playlistId);
    const existingCourse = await Course.findOne({ userId, playlistId });
    if (existingCourse) {
      console.log("Course already exists:", existingCourse._id);
      return res.status(409).json({
        error: "Course already exists",
        courseId: existingCourse._id,
        existing: true,
      });
    }

    // Fetch videos from YouTube API
    console.log("Fetching playlist items from YouTube API");
    const playlistRes = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );

    if (!playlistRes.ok) {
      const errorData = await playlistRes.json();
      console.error("YouTube API playlist fetch error:", errorData);
      return res
        .status(playlistRes.status)
        .json({ error: errorData.error?.message || "Failed to fetch playlist" });
    }

    const { items } = await playlistRes.json();
    console.log("Fetched playlist items count:", items?.length || 0);

    if (!items || items.length === 0) {
      console.error("No videos found in playlist");
      return res.status(404).json({ error: "No videos found in playlist" });
    }

    // Get channel name from the first video
    const firstVideoId = items[0].snippet.resourceId.videoId;
    console.log("Fetching details for first video:", firstVideoId);
    const videoRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet&id=${firstVideoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!videoRes.ok) {
      const errorData = await videoRes.json();
      console.error("YouTube API video fetch error:", errorData);
      throw new Error("Failed to fetch video details");
    }
    
    const videoData = await videoRes.json();
    const channelTitle = videoData.items?.[0]?.snippet?.channelTitle || "Unknown Channel";
    console.log("Channel title:", channelTitle);

    const videoIds = items.map((item: any) => item.snippet.resourceId.videoId);
    console.log("Total video IDs extracted:", videoIds.length);

    const courseData = {
      title: items[0].snippet.title.split("|")[0],
      playlistId,
      description: channelTitle,
      videoIds,
      userId,
    };

    console.log("Creating new course with data:", { ...courseData, videoIds: courseData.videoIds.length });
    const course = new Course(courseData);
    await course.save();
    console.log("Course created successfully:", course._id);

    return res.status(200).json({ courseId: course._id });
  } catch (err) {
    console.error("Conversion error details:", {
      error: err,
      message: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined
    });
    return res.status(500).json({ 
      error: "Internal Server Error",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

function getPlaylistId(url: string) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}
