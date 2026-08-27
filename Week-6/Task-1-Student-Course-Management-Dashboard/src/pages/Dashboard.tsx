import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Course = {
  id: string;
  created_at: string;
  user_id: string;
  course_name: string;
  course_code: string;
  instructor: string;
  description: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");

  // Get logged-in user and courses
  useEffect(() => {
    const startDashboard = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      setUserEmail(user.email || "");

      await loadCourses(user.id);

      setLoading(false);
    };

    startDashboard();
  }, [navigate]);

  // Load courses
  const loadCourses = async (userId: string) => {
    const { data, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (coursesError) {
      console.error(coursesError);
      setError(coursesError.message);
      return;
    }

    setCourses(data || []);
  };

  // Clear form
  const clearForm = () => {
    setCourseName("");
    setCourseCode("");
    setInstructor("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  // Add or update course
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      if (!courseName || !courseCode || !instructor) {
        setError("Please fill in Course Name, Course Code and Instructor.");
        return;
      }

      if (editingId) {
        // UPDATE
        const { error: updateError } = await supabase
          .from("courses")
          .update({
            course_name: courseName,
            course_code: courseCode,
            instructor: instructor,
            description: description,
          })
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (updateError) {
          setError(updateError.message);
          return;
        }
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from("courses")
          .insert({
            user_id: user.id,
            course_name: courseName,
            course_code: courseCode,
            instructor: instructor,
            description: description,
          });

        if (insertError) {
          setError(insertError.message);
          return;
        }
      }

      // Reload courses
      await loadCourses(user.id);

      clearForm();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Edit
  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setCourseName(course.course_name);
    setCourseCode(course.course_code);
    setInstructor(course.instructor);
    setDescription(course.description || "");
    setShowForm(true);
    setError("");
  };

  // Delete
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { error: deleteError } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadCourses(user.id);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Student Dashboard</h1>

      <p>
        Welcome, <strong>{userEmail}</strong>
      </p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>My Courses</h2>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)}>
          Add New Course
        </button>
      )}

      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <h3>{editingId ? "Edit Course" : "Add New Course"}</h3>

          <form onSubmit={handleSaveCourse}>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Course"
                : "Save Course"}
            </button>

            <button
              type="button"
              onClick={clearForm}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found. Add your first course.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{course.course_name}</h3>

              <p>
                <strong>Course Code:</strong> {course.course_code}
              </p>

              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              <p>
                <strong>Description:</strong> {course.description}
              </p>

              <button onClick={() => handleEdit(course)}>
                Edit
              </button>

              <button
                onClick={() => handleDelete(course.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;