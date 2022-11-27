import { useCallback, useEffect, useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const fetchBlogs = useCallback(async () => {
    console.log('fetch');
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createNewBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
    };
    console.log(newBlog);
    blogService.createBlog(newBlog);
    console.log(user);
  };

  if (user === null) {
    return null;
  }

  return (
    <div>
      <h2>blogs</h2>
      <p></p>
      {blogs.map((blog) => (
        <div key={blog.id}>
          {blog.title} {blog.author}
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default Blog;
