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



const LBUser = ({ use }) => {
    return (
     <div>
     {use.title}
     </div>
    )
}

export default LBUser

