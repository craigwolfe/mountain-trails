import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebaseconfig';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './styles.css'; // Import the CSS file

const CreateAccount: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleCreateAccount = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="master-container">
            <h1>Create Account</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="menu-buttons">  
            <Link to="/login">
                <button>Login</button>
                </Link>
            </div>
            <button onClick={handleCreateAccount}>Create Account</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
      
        </div>
    );
};

export default CreateAccount;
