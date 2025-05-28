import axios from "axios";
import { Request, Response } from "express";
import Course from "@/models/Course";

// Fetch a single Course 
export const getCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Fetch video details using `videos.list`
    const idsParam = course.videoIds.join(",");
    const videoRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: "snippet,contentDetails",
          id: idsParam,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = videoRes.data.items;

    // Get channel name from the first video if not already set
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
      duration: item.contentDetails.duration
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
  const userId = req.user?.uid; // ✅ Using uid consistently

  console.log("Save Course - User ID:", userId); // Debug log

  if (!userId || !title || !playlistId || !description || !videoIds?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await Course.findOne({ userId, playlistId });
    if (existing) {
      return res.status(409).json({ error: "Course already exists" });
    }

    const course = new Course({ userId, title, playlistId, description, videoIds });
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

  console.log("Get User Courses - User ID:", userId);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const courses = await Course.find({ userId });

    // Fetch thumbnails and ensure description for each course, and include videoIds
    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        let thumbnail = null;
        let channelName = course.description; // Use saved description if available

        // Only attempt to fetch video details if description is missing from DB
        if (!channelName && course.videoIds && course.videoIds.length > 0) {
          try {
            // Fetch details (including thumbnail and channelTitle) for the first video
            const firstVideoId = course.videoIds[0];
            const videoRes = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos`, {
                params: {
                  part: "snippet",
                  id: firstVideoId,
                  key: process.env.YOUTUBE_API_KEY,
                },
              }
            );

            const videoSnippet = videoRes.data.items?.[0]?.snippet;

            thumbnail = videoSnippet?.thumbnails?.high?.url || null;

            // Update channelName only if fetched successfully
            if (videoSnippet?.channelTitle) {
               channelName = videoSnippet.channelTitle;
            } else {
              channelName = "Unknown Channel"; // Fallback if fetch is successful but no channel title
            }

          } catch (error) {
            console.error(`Error fetching video details for course ${course._id}:`, error);
            channelName = "Unknown Channel"; // Fallback if API call fails
          }
        } else if (!channelName) {
             channelName = "Unknown Channel"; // Fallback if no videoIds or description missing from DB
        }

        return {
          _id: course._id,
          title: course.title,
          playlistId: course.playlistId,
          description: channelName,
          createdAt: course.createdAt,
          thumbnail,
          videoIds: course.videoIds, // Include videoIds here
        };
      })
    );

    res.status(200).json({ courses: coursesWithDetails });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};