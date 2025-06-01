import { apiCall } from "@/lib/api";

export const getCourseProgress = (courseId: string) => {
  return apiCall(`/course/${courseId}/progress`);
};

export const updateCourseProgress = (
  courseId: string,
  body: { progress?: number; currentVideoId?: string }
) =>
  apiCall(`/course/${courseId}/progress`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
