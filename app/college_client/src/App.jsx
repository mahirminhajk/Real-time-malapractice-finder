import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import WebSocketComp from './page/webSocketComp/WebSocketComp';
import Login from './page/login/Login';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Menu from './page/menu/Menu';
import Alert from './page/alert/Alert';
import CreateUser from './page/createUser/CreateUser';
import Settings from './page/settings/Settings';

function App() {

  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/exam" element={<WebSocketComp />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to='/menu' />} />
      </Routes>
    )
  } else {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to='/login' />} />
      </Routes>
    )
  }



}

export default App
