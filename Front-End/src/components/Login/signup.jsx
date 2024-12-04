import React, { useState } from "react";
import './login.css';
import {signup} from '../Auth/signup'
function Signup () {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [name, setName] = useState('');
    return (
        <div id ="main">
            <div id="naam">
                <h1>Signup Form</h1>
                <form>
                    <input value={name} type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" required /><br />
                    <input value={email} type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /><br />
                    <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" required /><br />
                    <input className="btn" type="button" value="Signup" onClick={()=>signup(email,password,name)}  />
                    <input className="btn" type="reset" value="Reset" />
                    {/* <p>Forgot <a href="#">Password</a> or <a href="#">Username</a></p> */}

                </form>
            </div>
        </div>
    );
}

export default Signup;