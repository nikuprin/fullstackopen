import { remove } from "./services/person";

const Persons = ({ persons, setPersons }) => {
  const handleDelete = (person) => {
    const msg = `delete ${person.name}?`;
    if (!window.confirm(msg)) {
      return;
    }

    remove(person.id)
      .then(() => {
        // const newPersons = persons.slice();
        const newPersons = persons.filter((p) => p.id !== person.id);
        // const idx = newPersons.indexOf(person);
        // newPersons.splice(idx);
        setPersons(newPersons);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <ul style={{ listStyle: "none", paddingLeft: "0" }}>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
