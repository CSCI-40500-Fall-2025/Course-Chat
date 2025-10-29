import { useEffect, useMemo, useState } from "react";
import { searchCourses } from "../services/CourseSearch";
import { type Course } from "../models/Course";

export default function CourseSearchPage() {
  const [q, setQ] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // simple debounce so we don't spam API
  const debounced = useMemo(() => q, [q]);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!debounced) {
        setItems([]);
        return;
      }
      try {
        setLoading(true);
        setErr("");
        const data = await searchCourses(debounced, onlyAvailable, 50);
        setItems(data);
      } catch (e: any) {
        setErr(e?.message ?? "Search failed");
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [debounced, onlyAvailable]);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: 12 }}>Find CSCI Courses</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try 'csci 127' or 'intro'"
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={() => setOnlyAvailable((v) => !v)}
          />
          Available only
        </label>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {items.map((c) => (
          <li
            key={`${c.courseId}-${c.code}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{c.code}</strong>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 6,
                  background:
                    c.courseStatus?.toLowerCase() === "available"
                      ? "#e6ffed"
                      : "#ffecec",
                  border: "1px solid #ddd",
                }}
              >
                {c.courseStatus || "Unknown"}
              </span>
            </div>
            <div style={{ marginTop: 4 }}>{c.title}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
              ID: {String(c.courseId).padStart(7, "0")}
            </div>
          </li>
        ))}
        {!loading && !err && items.length === 0 && q && (
          <li style={{ color: "#666", marginTop: 12 }}>No results.</li>
        )}
      </ul>
    </div>
  );
}
