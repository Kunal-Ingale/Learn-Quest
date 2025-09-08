import Header from "@/components/layout/Header";
import Link from "next/link";
import { cookies } from "next/headers";
import CircularProgress from "@/components/circularProgress"; // extract CircularProgress into its own file

const API_BASE_URL = "https://learnquest-ng5h.onrender.com";

async function getCourses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // Firebase token set in cookies

  if (!token) {
    return [];
  }

  const res = await fetch(`${API_BASE_URL}/api/course/mycourses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // ensures SSR fetch always gets fresh data
  });

  if (!res.ok) {
    console.error("Failed to fetch courses", await res.text());
    return [];
  }

  const data = await res.json();
  return data.courses || [];
}

export default async function MyCoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <Header />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        {courses.length === 0 ? (
          <p>You haven't created any courses yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: any) => (
              <li
                key={course._id}
                className="border p-4 rounded shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white relative"
              >
                <Link href={`/course/${course._id}`} className="block h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold flex-1 pr-2">
                      {course.title}
                    </h3>
                    <div className="flex-shrink-0">
                      <CircularProgress percentage={course.progress || 0} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded mt-2"
                    />
                  )}
                  <div className="mt-3 text-sm text-gray-500">
                    <p>
                      Started:{" "}
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {course.videos && (
                      <p className="mt-1">
                        {course.videos.length}{" "}
                        {course.videos.length === 1 ? "video" : "videos"}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
