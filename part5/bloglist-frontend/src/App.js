import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Login from './components/Login';
import Notification from './components/Notification';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <Notification message={errorMessage} />
      <Login user={user} setUser={setUser} setErrorMessage={setErrorMessage} />
      <Blog user={user} />
    </div>
  );
};

export default App;
