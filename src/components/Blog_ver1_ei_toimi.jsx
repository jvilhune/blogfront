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


const Com = ({ com }) => {
    return (
      <div>
        {com.content}
      </div>
    )
}

const SubFunc = ( {username, blogusername, subaction, butfunction, value3} ) => {

  /*
  console.log('username', username)
  console.log('blogusername', blogusername)
  console.log('subaction', subaction)
  */

  if(username === blogusername) {
    return (
      <button onClick={() => butfunction(value3)}>delete</button>
    )
  }
  return (
    <></>
  )
}


const Blog = ({ blog, username, viewvals, blogview, loggedin, butfunction, butfunction2, butfunction3, update }) => {

  /* blogview and update are extra parameters, not used here but maybe in the future ... */
  let blogid = blog.id
  const viewObject = viewvals.find(n => n.blog_id === blogid)
  const label = viewObject.view
    ? 'hide' : 'view'
  /*
  console.log('FROM BLOG.JSX')
  console.log('update', update)
  console.log('FROM BLOG.JSX')
  */

  var len = blog.comments.length

  var a = 0
  var coms = []
  for(a=0;a<blog.comments.length;a++) {
    //coms[a] = blog.comments[a]
    const arrObject = {content: blog.comments[a], id: a}
    coms[a] = arrObject
  }

  //const arrayDataItems = coms.map((course) => <li>{course}</li>);


  if(viewObject.view === true) {
    return (
    //<p className='blog'>
    <div>
    <p className='blog'>
      <Link to={`/blogs/${blogid}`}>{blog.title}&nbsp;</Link>
      <button onClick={() => butfunction2(blogid)}>{label}</button>
      <br/>
      {blog.author}
      <br/>
      <a href={blog.url}>{blog.url}</a>
      <br/>
      {blog.likes}&nbsp;
      <button onClick={butfunction3}>{'likes'}</button>
      <br/>
      added by {blog.user.name}
      <br/>

      <div>
      {coms.map(com =>         
          key={com.id}
          <div>
          com={com}
        />
      )}
     </div>


{/*
      //<ul>{arrayDataItems}</ul>
*/}

{/* 
      <br/>
      Comments : {tststr[0].content}
      <br/>
      Comments : {tststr[1].content}
      <br/>
      Comments : {tststr[2].content}
      <br/>
      Comments : {tststr[3].content}
      <br/>
      Comments : {tststr[4].content}
      <br/>
      <br/>
      Length : {len}
      <br/>


      <br/>
      Comments : {blog.comments[0]}
      <br/>
      Comments : {blog.comments[1]}
      <br/>
      Comments : {blog.comments[2]}
      <br/>
      Comments : {blog.comments[3]}
      <br/>
      Comments : {blog.comments[4]}
      <br/>
      <br/>
      Length : {len}
      <br/>
*/}

{/*
    var a = 0
    var tststr = []
    for(a=0;a<blog.comments.length;a++) {
      <br/>
      Comments : {blog.comments[a]}
      <br/>
    }
*/}
      <SubFunc username={username} blogusername={blog.user.username} subaction={loggedin} butfunction={butfunction} value3={blogid} />
      </p>
    <p><br/></p>
    </div>
    )
  }
  else if(viewObject.view === false) {
    return (
    //<p className='blog'>
    <div>
    <p className='blog'>
      <Link to={`/blogs/${blogid}`}>{blog.title}&nbsp;</Link>
      <button onClick={() => butfunction2(blogid)}>{label}</button>
      <br/>
      <SubFunc username={username} blogusername={blog.user.username} subaction={loggedin} value3={blogid} />
      </p>
    <p><br/></p>
    </div>
    )
  }
}

export default Blog

//      {blog.title}&nbsp;