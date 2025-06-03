import axios from "axios";
import { Request, Response } from "express";
import Course from "@/models/Course";

// Fetch a single Course 
export const getCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const idsParam = course.videoIds.join(",");
    const videoRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails",
          id: idsParam,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = videoRes.data.items;

    // Get channel name from first video if not already saved
    let channelName = course.description;
    if (!channelName && items.length > 0) {
      channelName = items[0].snippet.channelTitle || "Unknown Channel";
    }

    const videos = items.map((item: any, index: number) => ({
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url,
      position: index + 1,
      duration: item.contentDetails.duration,
    }));

    return res.status(200).json({
      _id: course._id,
      title: course.title,
      playlistId: course.playlistId,
      description: channelName,
      createdAt: course.createdAt,
      videos,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Post newly converted course
export const saveCourse = async (req: Request, res: Response) => {
  const { title, playlistId, description, videoIds } = req.body;
  const userId = req.user?.uid;


  if (!userId || !title || !playlistId || !description || !videoIds?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await Course.findOne({ userId, playlistId });
    if (existing) {
      return res.status(409).json({ error: "Course already exists" });
    }

    const course = new Course({
      userId,
      title,
      playlistId,
      description,
      videoIds,
      progress: 0,
      currentVideoId: "",
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET all converted courses
export const getUserCourses = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

 

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const courses = await Course.find({ userId });

    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        let thumbnail = null;
        let channelName = course.description;
        let videos = [];

        if (course.videoIds?.length > 0) {
          try {
            // Fetch all videos in the course
            const idsParam = course.videoIds.join(",");
            //console.log("Fetching videos for course:", course._id, "Video IDs:", idsParam);
            
            const videoRes = await axios.get(
              "https://www.googleapis.com/youtube/v3/videos",
              {
                params: {
                  part: "snippet",
                  id: idsParam,
                  key: process.env.YOUTUBE_API_KEY,
                },
              }
            );

         //   console.log("YouTube API Response:", videoRes.data);

            const items = videoRes.data.items || [];
            videos = items.map((item: any, index: number) => ({
              videoId: item.id,
              title: item.snippet.title,
              position: index + 1,
            }));

            if (items.length > 0) {
              const firstVideo = items[0];
              thumbnail = firstVideo.snippet.thumbnails?.high?.url || null;
              if (firstVideo.snippet.channelTitle) {
                channelName = firstVideo.snippet.channelTitle;
              }
            }
          } catch (error) {
            console.error(`Error fetching video for course ${course._id}:`, error);
          }
        }

        if (!channelName) {
          channelName = "Unknown Channel";
        }

        const courseData = {
          _id: course._id,
          title: course.title,
          playlistId: course.playlistId,
          description: channelName,
          createdAt: course.createdAt,
          thumbnail,
          videos,
          videoIds: course.videoIds, // Keep this for backward compatibility
        };

       // console.log("Processed course data:", courseData);
        return courseData;
      })
    );

    res.status(200).json({ courses: coursesWithDetails });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the progress of a Course
export const updateCourseProgress = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const { courseId } = req.params;
  const { progress, currentVideoId } = req.body;

  if (!userId || (progress === undefined && !currentVideoId)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const course = await Course.findOne({ _id: courseId, userId });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (progress !== undefined) course.progress = progress;
    if (currentVideoId) course.currentVideoId = currentVideoId;

    await course.save();

    res.status(200).json({ message: "Progress updated", course });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//fetch the progress of the course
// Get course progress for a specific course
export const getCourseProgress = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const { courseId } = req.params;

  try {
    const course = await Course.findOne({ _id: courseId, userId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      progress: course.progress,
      currentVideoId: course.currentVideoId,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
