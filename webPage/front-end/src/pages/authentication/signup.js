import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import "../../Common.css"

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // To store errors

    const isFormOK = () => {
        return email.trim().length === 0 || password.trim().length === 0;
    };

    const onSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/dev/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (response.ok) {
                navigate('/signup'); // Navigate to signup page on success
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        }
    };

    return (
        <div className='container'>
            <text>Bacchus</text>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
            <div className='login-box'>
                <div className="login-box-header"><p>Connexion</p></div>
                <div className="form">
                    <input
                        placeholder="Nom d'utilisateur"
                        type="text"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        placeholder="Mot de passe"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <input
                        type="submit"
                        onClick={onSubmit}
                        disabled={isFormOK()}
                    />
                </div>
            </div>
        </div>
    );
}