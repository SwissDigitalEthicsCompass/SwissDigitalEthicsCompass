import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import '../styles/Navbar.css';
import { ACCESS_TOKEN } from '../constants';

function Navbar() {
    const [username, setUsername] = useState(null);  

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);  
            } catch (error) {
                console.error("Failed to decode JWT:", error);
                setUsername(''); 
            }
        } else {
            setUsername(''); 
        }
    }, []);  

    if (username === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <nav className="navbar">
            <h1 className="logo">SDEC</h1>
            <span className="username">{username}</span>
        </nav>
    );
}

export default Navbar;