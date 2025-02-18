import React, { useState } from "react";
import { signInWithEmailAndPassword, Auth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './styles.css'; // Import the CSS file
//define component props, which include auth
interface LoginProps {
    auth: Auth;
}
//define login component
const Login: React.FC<LoginProps> = ({ auth }) => {
    // State hooks for managing email, password, error message, and loading state
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const navigate = useNavigate(); // Initialize useNavigate
    // Async function to handle email login
    const handleEmailLogin = async () => {
        setLoading(true); // Start loading
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // Redirect to home page after successful login
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="master-container">
            <h1>Login</h1>
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
            <button onClick={handleEmailLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
