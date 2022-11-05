const Header = ({ course }) => {
  return <h2>{course.name}</h2>;
};

const Content = ({ course }) => {
  return (
    <ul style={{ listStyle: "none", paddingLeft: "0" }}>
      {course.parts.map((part) => (
        <li key={part.id}>
          {part.name} {part.exercises}
        </li>
      ))}
    </ul>
  );
};

const Total = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0);
  return (
    <p>
      <b>total of {total}</b>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default Course;
