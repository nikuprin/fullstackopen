import { useState } from "react";
import { create, update } from "./services/person";
import Notification from "./Notification";

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = async (msg, err) => {
    const newObject = { message: msg, error: err };
    setNotification(newObject);
    await new Promise((r) => setTimeout(r, 2000));
    setNotification(null);
  };

  const addPhone = (event) => {
    event.preventDefault();
    const exists = persons.find((p) => p.name === newName);
    if (exists !== undefined) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        const updateObect = { ...exists, number: newPhone };
        update(exists.id, updateObect)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== exists.id ? person : response.data
              )
            );
          })
          .catch((err) => {
            console.error(err);
            showNotification(
              `Information of ${newName} has already been removed from server`,
              true
            );
          });
      }
      return;
    }
    const personObject = {
      name: newName,
      number: newPhone,
    };
    create(personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        showNotification(`Added ${response.data.name}`);
        setNewName("");
        setNewPhone("");
      })
      .catch((err) => {
        console.console.error(err);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  return (
    <form onSubmit={addPhone}>
      <Notification notification={notification} />
      <div>
        name: <input value={newName} onChange={handleNameChange} />
        <br />
        phone: <input value={newPhone} onChange={handlePhoneChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
