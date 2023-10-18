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

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [okMessage, setOkMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState("")
  const [users, setUsers] = useState([])
  const [loginVisible, setLoginVisible] = useState(false)

  const padding = {
    padding: 5
  }


  const dispatch = useDispatch()

  const bblogs = useSelector(({ bblogs }) => {
  //console.log('b_blogs', b_blogs)
    return bblogs
  })

  const uuser = useSelector(({ uuser }) => {
  //console.log('b_blogs', b_blogs)
    return uuser
  })

  useEffect(() => {
    var a = 0
    var vieObject = {
      view: true,
      blog_id: 0
    }

    blogService
      .getAll()
      .then(initialBlogs => {

       /*
       initialBlogs.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes);
       console.log('initialBlogs', initialBlogs)
       */

       //setBlogs(initialBlogs)
       dispatch(blogsChange(initialBlogs))

       for(a=0;a<initialBlogs.length;a++) {
         var viewObject = {
         view: true,
         blog_id: initialBlogs[a].id
         }
         viewBlogs[a] = viewObject
       }
      })

  }, [])

  useEffect(() => {
    var a = 0
    var vieObject = {
      view: true,
      blog_id: 0
    }

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

       var varuserObject = {
         id: returnedBlog.user,
         username: uuser.username,
         name: uuser.name
       }

       returnedBlog.user = varuserObject
       //setBlogs(blogs.concat(returnedBlog))
       dispatch(blogsChange(bblogs.concat(returnedBlog)))

       for(a=0;a<1;a++) {
         var viewObject = {
         view: true,
         blog_id: returnedBlog.id
         }
         viewBlogs[viewBlogs.length] = viewObject
       }

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


  const handledeleteClick = (blogid) => {
    const blog = bblogs.find(n => n.id === blogid)
    if (window.confirm(`Delete ${blog.title}?`) === true) {
      blogService
      .delItem(blog.id)
          .then(returnedlBlog => {
          //setBlogs(blogs.filter(n => n.id !== blogid))
           dispatch(blogsChange(bblogs.filter(n => n.id !== blogid)))
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
          dispatch(blogsChange(bblogs.filter(n => n.id !== blogid)))
       })
    }
  }

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

  const blogForm = () => (
  <Togglable buttonLabel="new blog" ref={blogFormRef} >
    <BlogForm createBlog={addBlog} />
  </Togglable>
  )

  const blogstoOrder = bblogs
  //bblogs.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)

  const userstoOrder = users
  //users.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)

  const test = 'test'
  console.log('test', test)
  
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

  const Lhome = () => (
    <div>
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
  )

  const BBBuser = ({testparam}) => {
    const params = useParams()
    if(!params) {
      return
    }
    const blog = bblogs.find(n => n.id === params.id)
    if(!blog) {
      return
    }
    return (
      <div>
        <h3>{blog.title}</h3>
        <div>{blog.author}</div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes}</div>
        <div>added by {blog.user.name}</div>
      </div>
    )
  }

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


  const testuserword = {name: 'Mari Korhonen', username: 'mariko'}
  const testblogword = {title: 'JV Records', author: 'Jukka Vilhunen', url: 'url', likes: 0}

  return (
    <div>
      <h3>BLOG LIST</h3>
      <Notification />
      <Errnotification message={errorMessage} />
      <Oknotification message={okMessage} />

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
      <Footer />
    </div>
  )
}

export default App