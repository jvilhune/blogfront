import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
<Router>
  <Provider store={store}>
    <App />
  </Provider>
</Router>
)