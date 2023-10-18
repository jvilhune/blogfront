//npm install react-router-dom

import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import User from './components/user'
import LBUser from './components/LBUser'
import Notification from './components/Notification'
import Errnotification from './components/Errnotification'
import Oknotification from './components/Oknotification'
import Footer from './components/Footer'

import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

//import { useDispatch } from 'react-redux'
import { notificationChange } from './reducers/notificationReducer'
import { blogsChange } from './reducers/blogsReducer'
import { userChange } from './reducers/userReducer'

import { useDispatch, useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from "react-router-dom"

import {useParams} from 'react-router-dom'

const refresh = () => {
  window.localStorage.clear()
  window.location.reload(true)
}


const App = () => {

  //const [blogs, setBlogs] = useState([])
  const [viewBlogs, setViewBlogs] = useState([])
  const [viewIndex, setViewIndex] = useState(0)

  const [time, setTime] = useState(new Date());
  const [newComment, setnewComment] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [okMessage, setOkMessage] = useState(null)
  const [comment, setComment] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState("")
  const [users, setUsers] = useState([])
  const [loginVisible, setLoginVisible] = useState(false)

  const padding = {
    padding: 5
  }

  const dispatch = useDispatch()

  /* Get blogs (states) from reducer */

  const bblogs = useSelector(({ bblogs }) => {
  //console.log('bblogs', bblogs)
    return bblogs
  })

  /* Get uuser i.e. who is logged in from the reducer */

  const uuser = useSelector(({ uuser }) => {
  //console.log('uuser', uuser)
    return uuser
  })

  /* Read Users data from server */
  /* This is executed every time the page is reloaded */

  useEffect(() => {
    var a = 0

    blogService
      .getAll()
      .then(initialBlogs => {

       /*
       initialBlogs.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes);
       console.log('initialBlogs', initialBlogs)
       */

       //setBlogs(initialBlogs)
       dispatch(blogsChange(initialBlogs))

       var wrviewBlogs = []

       for(a=0;a<initialBlogs.length;a++) {
         var viewObject = {
         view: true,
         blog_id: initialBlogs[a].id
         }
         //wrviewBlogs[a] = viewObject
         viewBlogs[a] = viewObject
       }
       //setViewBlogs(wrviewBlogs)
      })

  }, [])

  /* Read Users data from server */
  /* This is executed every time the page is reloaded */

  useEffect(() => {
    var a = 0

    userService
      .getAll()
      .then(initialUsers => {

       /*
       initialUsers.sort((firstItem, secondItem) => secondItem.username - firstItem.username);
       console.log('initialUsers', initialUsers)
       */

       setUsers(initialUsers)
      })

  }, [])

  /* Read login data from browser's local storage */
  /* This is executed every time the page is reloaded */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      //setUser(user)
      dispatch(userChange(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  /* Send likes click (vote) data to server */

  const handlelikesClick = id => {

    const blog = bblogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes+1 }

    /*
    console.log('blog.user.name', blog.user.name)    
    console.log('changedBlog.user.name', changedBlog.user.name)
    console.log('changedBlog.user.username', changedBlog.user.username)
    console.log('changedBlog.user.id', changedBlog.user.id)
    console.log('changedBlog.user', changedBlog.user)
    console.log('user', user)
    */

    setShowAll(!showAll)
    showAll ? 'hide' : 'view'

    blogService
      .update(id, changedBlog)
        .then(returnedBlog => {

        /*
        console.log('returnedBlog.user.username', returnedBlog.user.username)
        console.log('returnedBlog.user.name', returnedBlog.user.name)
        console.log('returnedBlog.user.id', returnedBlog.user.id)
        console.log('returnedBlog.user', returnedBlog.user)
        */

        //setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog))
        dispatch(blogsChange(bblogs.map(blog => blog.id !== id ? blog : changedBlog)))
      })
      .catch(error => {
        //setErrorMessage(`Blog '${blog.title}' was already removed from server. ${error.message}`)
        dispatch(notificationChange(`Blog '${blog.title}' was already removed from server. ${error.message}`))
        setTimeout(() => {
          //setErrorMessage(null)
          dispatch(notificationChange(``))
        }, 5000)
      })
  }

  /* Send add new blog data to server */

  const addBlog = (blogObject) => {
    var a = 0
    blogFormRef.current.toggleVisibility()

    /*
    console.log('user.username', user.username)
    console.log('user.name', user.name)
    console.log('user', user)
    */

    blogService
      .create(blogObject)
        .then(returnedBlog => {

       /* response palauttaa vain id kentan. Miksi? Bug? Vika backend koodissa? */
       /* siksi responseen liitetaan loput tiedot login userin tiedoista */
       /* vain login user on voinut luoda ja lahettaa uuden blogin */

       var varuserObject = {
         id: returnedBlog.user,
         username: uuser.username,
         name: uuser.name
       }

       returnedBlog.user = varuserObject
       //setBlogs(blogs.concat(returnedBlog))
       dispatch(blogsChange(bblogs.concat(returnedBlog)))

       var wrviewBlogs = viewBlogs

       for(a=0;a<1;a++) {
           var viewObject = {
           view: true,
           blog_id: returnedBlog.id
         }
         wrviewBlogs[viewBlogs.length] = viewObject
       }
       setViewBlogs(wrviewBlogs)

       /*
       console.log('blogObject', blogObject)
       console.log('returnedBlog', returnedBlog)
       console.log('blogsave', blogsave)
       console.log('returnedBlog', returnedBlog)
       console.log('blogs', blogs)
       */

        dispatch(notificationChange(`New blog '${returnedBlog.title}' was succesfully added to the bloglist`))
	//setOkMessage(`New blog '${returnedBlog.title}' was succesfully added to the bloglist`)
        setTimeout(() => {
          dispatch(notificationChange(``))
          //setOkMessage(null)
        }, 5000)
      })

      .catch(error => {
        //setErrorMessage(
          //`New blog '${returnedBlog.title}' cannot add to the bloglist`
          //`error : ${error.response.data.error} ${error.message}`
        //)

        dispatch(notificationChange(`error : ${error.response.data.error} ${error.message}`))
        setTimeout(() => {
          //setErrorMessage(null)
          dispatch(notificationChange(``))
        }, 5000)
      })
  }


  /* Handle view-hide click */

  const handleviewClick = (blogid) => {
    var a = 0
    var findIndex = 0
    const blog = bblogs.find(n => n.id === blogid)
    const viewObject = viewBlogs.find(n => n.blog_id === blogid)

    if(viewObject.view === true) {
       viewObject.view = false
    }
    else if(viewObject.view === false) {
       viewObject.view = true
    }

    var viewArrays = viewBlogs

    for(a=0;a<bblogs.length;a++)
    {
      if(viewBlogs[a].blog_id === blogid) {
        viewArrays[a].view = viewObject.view
        findIndex = a
      }
    }

    setViewIndex(findIndex)
    setViewBlogs(viewArrays)

    setShowAll(!showAll)
    showAll ? 'hide' : 'view'
  }

  /* Send delete blog data to server */

  const handledeleteClick = (blogid) => {
    const blog = bblogs.find(n => n.id === blogid)
    if (window.confirm(`Delete ${blog.title}?`) === true) {
      blogService
      .delItem(blog.id)
          .then(returnedlBlog => {
          //setBlogs(blogs.filter(n => n.id !== blogid))
           dispatch(blogsChange(bblogs.filter(n => n.id !== blogid)))
           setViewBlogs(viewBlogs.filter(n => n.id !== blogid))
          //timeout(1000)

          //setOkMessage(`Blog '${blog.title}' was succesfully removed from the server`)
          dispatch(notificationChange(`Blog '${blog.title}' was succesfully removed from the server`))
          setTimeout(() => {
            //setOkMessage(null)
            dispatch(notificationChange(``))
          }, 5000)

        })
        .catch(error => {
          //setErrorMessage(`error : ${error.response.data.error} ${error.message}`)
          dispatch(notificationChange(`error : ${error.response.data.error} ${error.message}`))
          setTimeout(() => {
            //setErrorMessage(null)
            dispatch(notificationChange(``))
          }, 5000)

          //setBlogs(blogs.filter(n => n.id !== blogid))
          //dispatch(blogsChange(bblogs.filter(n => n.id !== blogid)))
       })
    }
  }

  /* Send login data to server */

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      //setUser(user)
      dispatch(userChange(user))

      setUsername('')
      setPassword('')
      //setOkMessage(`User '${user.username}' was succesfully login`)
      dispatch(notificationChange(`User '${user.username}' was succesfully login`))
        setTimeout(() => {
          //setOkMessage(null)
          dispatch(notificationChange(``))
        }, 5000)

      } catch (exception) {
      //setErrorMessage('login failed, wrong credentials')
      dispatch(notificationChange('login failed, wrong credentials'))
      setTimeout(() => {
        //setErrorMessage(null)
        dispatch(notificationChange(''))
      }, 5000)
    }
  }

  /* Help function for login form */

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  /* Help function for blog form */

  const blogForm = () => (
  <Togglable buttonLabel="new blog" ref={blogFormRef} >
    <BlogForm createBlog={addBlog} />
  </Togglable>
  )

  /* Show the blogs and users in order according to the voting results */
  /* so that the one with the most votes first */

  const blogstoOrder = bblogs
  //bblogs.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)

  const userstoOrder = users
  //users.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)


  /* View of all users */
  /* The number of blogs added by each user */

  const Lusers = () => (
    <div>
      <h3>Users</h3>
      <div>
      <table>
      <tbody>
      <tr><th align="left">user</th><th>blogs created</th></tr>
      {userstoOrder.map(use =>
        <User          
          key={use.id}
          use={use}
        />
      )}
      </tbody>
      </table>
      </div>
    </div>
  )

  /* View of all blogs */

  const Lblogs = () => (
    <div>
      <h3>Blogs</h3>
      <div>
      {blogstoOrder.map(blog =>
        <Blog          
          key={blog.id}
          blog={blog}
          username={uuser.username}
          viewvals={viewBlogs}
          blogview={viewBlogs[viewIndex].view}
          loggedin={loginVisible}
          butfunction = {handledeleteClick}
          butfunction2 = {handleviewClick}
          butfunction3={() => handlelikesClick(blog.id)}
          update={showAll}
        />
      )}
    </div>
    </div>
  )

  /* Home view */
  const Lhome = () => (
    <div>
    </div>
  )


  /* Send a new comment to server */

  const addComment = (blog) => {
    event.preventDefault()

    var updcomment = ""
    updcomment = newComment

    var a = 0
    var allCom = []
    for(a=0;a<blog.comments.length;a++) {
      allCom[a] = blog.comments[a]
    }
    allCom[a] = updcomment
    setComment(updcomment)
    setnewComment('')
    const changedBlog = { ...blog, comments: allCom }

    blogService
      .update(blog.id, changedBlog)
        .then(returnedBlog => {
        dispatch(blogsChange(bblogs.map(mapblog => mapblog.id !== blog.id ? mapblog : changedBlog)))
      })
      .catch(error => {
        dispatch(notificationChange(`Blog '${blog.title}' was already removed from server. ${error.message}`))
        setTimeout(() => {
          dispatch(notificationChange(``))
        }, 5000)
      })
  }


  /* Comment form  */
  /* Add a new comment form */

  const handleCommentChange = (event) => {
    setnewComment(event.target.value)
  }


  /* Comment form  */
  /* Add a new comment form */

  const CommentForm = ( {subaction, focuskey, fieldname1, value1, value2, type, text} ) => {
    return (
      <div>
        <form onSubmit={subaction}>
        {fieldname1}
        <br />
        <input key={focuskey} autoFocus="autoFocus" type="text" value={value1} onChange={value2} />
        <br />
        <button type={type}>
        {text}
        </button>
        </form>
      </div>
    )
  }

  /* Render one comment  */

  const Com = ({ com }) => {
    return (
      <div>
        {com.content}
      </div>
    )
  }

  /* Single blog view  */
  /* Comments added to one blog  */
  /* Add new blog view  */

  const BBBuser = ({testparam}) => {
    const params = useParams()
    if(!params) {
      return
    }
    const blog = bblogs.find(n => n.id === params.id)
    if(!blog) {
      return
    }

    var len = blog.comments.length
    var a = 0
    var coms = []
    for(a=0;a<blog.comments.length;a++) {
      //coms[a] = blog.comments[a]
      const arrObject = {content: blog.comments[a], id: a}
      coms[a] = arrObject
    }
    return (
      <div>
        <h3>{blog.title}</h3>
        <div>{blog.author}</div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes}</div>
        <div>added by {blog.user.name}</div>

        <h3>Comments</h3>
        <div>
        {coms.map(com =>
          <Com          
            key={com.id}
            com={com}
          />
        )}
        </div>

        <div>
        <h3>Add a new Comment</h3>
        <CommentForm subaction={() => addComment(blog)} focuskey={time} fieldname1='comment: ' value1={newComment} value2={handleCommentChange} type={'submit'} text='add comment' />
         </div>
      </div>
    )
  }

  /* Single user view  */
  /* Blogs added by one user  */

  const LLLuser = ({testparam}) => {
    const params = useParams()
    if(!params) {
      return
    }
    const user = users.find(n => n.id === params.id)
    if(!user) {
      return
    }

    return (
      <div>
        <p></p>
        <h3>blogs added by {user.name} :</h3>
        {user.blogs.map(use =>
          <LBUser          
            key={use.id}
            use={use}
          />
        )}
        <p></p>
      </div>
    )
  }


  /* Link names  */
  /* URL address bar  */
  /* a function that is executed when the name is clicked  */

  const testuserword = {name: 'Mari Korhonen', username: 'mariko'}
  const testblogword = {title: 'JV Records', author: 'Jukka Vilhunen', url: 'url', likes: 0}

  return (
    <div>
      <h3>BLOG LIST</h3>
      <Notification />
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/users">users</Link>
      </div>
      <Routes>
        <Route path="/blogs" element={<Lblogs />} />
        <Route path="/users" element={<Lusers />} />
        <Route path="/" element={<Lhome />} />

        <Route path="/users/:id" element={<LLLuser testparam={testuserword} />} />
        <Route path="/blogs/:id" element={<BBBuser testparam={testblogword} />} />
      </Routes>
    <div>
        <p></p>
      {!uuser && loginForm()} 
      {uuser && <div>
        <p>
        {uuser.name} logged in&nbsp;
        <button onClick={refresh}>logout</button>
        </p>
        <h3>Create New Blog</h3>
        {blogForm()}
        </div>
      }
    </div>
      <Footer />
    </div>
  )
}

export default App
   