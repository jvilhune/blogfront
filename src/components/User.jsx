// JSX
// space -> &nbsp;
// line break -> <br/>
// division of a section (line break) -> <div></div>
// paragraph break (single empty line fefore and after) -> <p></p>
// {/* This is a comment in JSX */}
// <!-- This is a comment in HTML -->
// This is a comment in javascript
/* This is a comment in javascript */

import '../index.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from "react-router-dom"

  //var array = ['Great record shop', 'Good record shop', 'Bad record shop']

  //array.push('Great record shop')
  //array.push('Good record shop')
  //array.push('Bad record shop')

  //array[0] = 'Great record shop'
  //array[1] = 'Good record shop'
  //array[2] = 'Bad record shop'

/*
  const newBlog = {
      title: "JV Records",
      author: "Jukka Vilhunen",
      url: "https://www.jvrecords.fi",
      likes: 0,
      comments: array
  }

      <td>{newBlog.title}</td>
      <td>{newBlog.author}</td>
      <td>{newBlog.url}</td>
      <td>{newBlog.likes}</td>
      <td>{newBlog.comments[0]}</td>
      <td>{newBlog.comments[1]}</td>
      <td>{newBlog.comments[2]}</td>
*/

const User = ({ use }) => {
    return (
      <tr>

      <td><Link to={`/users/${use.id}`}>{use.name}</Link></td>

      <td>{use.blogs.length}</td>

      </tr>
    )
}

export default User

