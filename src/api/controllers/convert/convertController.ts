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
    return res.status(400).json({ error: "Missing playlist URL" });
  }

  const playlistId = getPlaylistId(playlistUrl);
  if (!playlistId) {
    return res.status(400).json({ error: "Invalid playlist URL" });
  }

  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing userId" });
  }

  try {
    // Check if course already exists for this user and playlist
    const existingCourse = await Course.findOne({ userId, playlistId });
    if (existingCourse) {
      return res.status(409).json({
        error: "Course already exists",
        courseId: existingCourse._id,
        existing: true,
      });
    }

    // Fetch videos from YouTube API
    const playlistRes = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );

    if (!playlistRes.ok) {
      const errorData = await playlistRes.json();
      return res
        .status(playlistRes.status)
        .json({ error: errorData.error?.message || "Failed to fetch playlist" });
    }

    const { items } = await playlistRes.json();

    if (!items || items.length === 0) {
      return res.status(404).json({ error: "No videos found in playlist" });
    }

    // Get channel name from the first video
    const firstVideoId = items[0].snippet.resourceId.videoId;
    const videoRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet&id=${firstVideoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!videoRes.ok) {
      throw new Error("Failed to fetch video details");
    }
    
    const videoData = await videoRes.json();
    const channelTitle = videoData.items?.[0]?.snippet?.channelTitle || "Unknown Channel";

    const videoIds = items.map((item: any) => item.snippet.resourceId.videoId);

    const courseData = {
      title: items[0].snippet.title.split("|")[0],
      playlistId,
      description: channelTitle,
      videoIds,
      userId,
    };

    const course = new Course(courseData);
    await course.save();

    return res.status(200).json({ courseId: course._id });
  } catch (err) {
    console.error("Conversion error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

function getPlaylistId(url: string) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}
