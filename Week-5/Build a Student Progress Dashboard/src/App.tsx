import "./App.css";
import studentData from "./data/students.json";

function App() {
  const student = studentData.student;

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Student Progress Dashboard</h1>
          <p>Track your learning progress</p>
        </div>

        <div className="student-badge">Student</div>
      </header>

      <section className="welcome">
        <h2>Welcome, {student.name}! 👋</h2>
        <p>Here is an overview of your learning progress.</p>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <h3>Completed Courses</h3>
          <p className="number">{student.completedCourses}</p>
          <span>Courses completed</span>
        </div>

        <div className="summary-card">
          <h3>Pending Courses</h3>
          <p className="number">{student.pendingCourses}</p>
          <span>Courses remaining</span>
        </div>

        <div className="summary-card">
          <h3>Overall Progress</h3>
          <p className="number">{student.progress}%</p>
          <span>Learning progress</span>
        </div>
      </section>

      <section className="progress-section">
        <h2>Course Progress</h2>

        {student.courses.map((course) => (
          <div className="course" key={course.name}>
            <div className="course-info">
              <span>{course.name}</span>
              <strong>{course.progress}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;