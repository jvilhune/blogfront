
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
 }) => {
 return (
   <div>
     <h2>Login</h2>

     <form onSubmit={handleSubmit}>
       <div>
         username&nbsp;
         <input
           value={username}
           onChange={handleUsernameChange}
         />
       </div>
       <div>
         password&nbsp;
         <input
           type="password"
           value={password}
           onChange={handlePasswordChange}
         />
     </div>
       <button type="submit">login</button>
     </form>
   </div>
 )
}

export default LoginForm

//autoFocus="autoFocus"
//autoFocus="autoFocus"