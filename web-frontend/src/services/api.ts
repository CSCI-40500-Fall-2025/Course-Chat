import { type Course } from "../models/Course";
const API_BASE = "http://localhost:5001"; // REPLACE WITH ENV LATER

export async function searchCourses(
  query: string,
  onlyAvailable = true,
  limit = 50
): Promise<Course[]> {
  const params = new URLSearchParams({
    query,
    available: onlyAvailable ? "1" : "0",
    limit: String(limit),
  });

  const res = await fetch(`${API_BASE}/api/courses?${params.toString()}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.items as Course[];
}
