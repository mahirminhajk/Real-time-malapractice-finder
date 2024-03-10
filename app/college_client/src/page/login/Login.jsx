// Login.js

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState } from "react";
import axios from "axios";
import "./login.css"; // Import your CSS file

function Login() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    const { loading, error, dispatch } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault(); // Fix: Add e.preventDefault()
        try {
            dispatch({ type: "LOGIN_START" });
            //* create axios post request withCredentials true
            const axiosInstance = axios.create({ withCredentials: true });

            const res = await axiosInstance.post("http://localhost:3000/api/auth/login", user);
            console.log(res.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/exam", { replace: true });
        } catch (error) {
            dispatch({
                type: "LOGIN_FAILURE",
                payload: error.response.data ? error.response.data : error,
            });
        }
    };

    const handleUsernameInput = (e) => {
        setUser({ ...user, username: e.target.value });
    };

    const handlePasswordInput = (e) => {
        setUser({ ...user, password: e.target.value });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>SecureExam</h1>
                <p>Real-time Malpractice Detection System</p>
                <div className="form">
                    <div className="form-header">
                        <h1>Login</h1>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input type="text" onChange={handleUsernameInput} placeholder="Username" />
                        <input type="password" onChange={handlePasswordInput} placeholder="Password" />
                        <input type="submit" value="Login" />
                    </form>
                    <div className="error-message">
                        {error && <span>{error.message}</span>}
                    </div>
                </div>
            </div>
            {loading && (
                <div className="loading-message">
                    <div>
                        <h1>Loading...</h1>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;