import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createUser.css';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navgate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const axiosInstance = axios.create({ withCredentials: true });
            const response = await axiosInstance.post('http://localhost:3000/api/auth/register', formData);
            console.log('User created successfully:', response.data);
            navgate('/login');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className="create-user-container">
            <form className="create-user-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default CreateUser;
