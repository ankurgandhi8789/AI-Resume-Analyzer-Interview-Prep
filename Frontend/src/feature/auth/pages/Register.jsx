import React, { useState } from "react";
import { useNavigate ,Link} from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {

    const nevigate=useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const {loading,handleRegister}=useAuth()

    const handleSubmit=(e)=>{
        
        e.preventDefault();
        handleRegister({username,email,password});
        setEmail("")
        setPassword("")
        setUsername("")
        nevigate('/')
    }

    if (loading) {
      return (
        <p className="h-screen flex items-center justify-center bg-gray-950 text-white">
          Loading...
        </p>
      )
    }

  return (
    <>
      <div style={{backgroundColor :' rgb(36, 36, 36)'}} className="min-h-screen flex items-center justify-center">
        <div className="w-md  text-white p-8 rounded-xl">
          <h1 className="text-3xl font-bold mb-6">Registration</h1>

          <form className="space-y-5 " onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-2 text-sm text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="text"
                onChange={(e)=>{setUsername(e.target.value)}}
                value={username}
                placeholder="Enter username"
                className="w-full px-6 py-3 rounded-full bg-gray-200 text-black outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                value={email}
                placeholder="Enter email address"
                className="w-full px-6 py-3 rounded-full bg-gray-200 text-black outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e)=>{setPassword(e.target.value)}}
                value={password}
                placeholder="Enter password"
                className="w-full px-6 py-3 rounded-full bg-gray-200 text-black outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition duration-300  active:scale-105 cursor-pointer"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-3">Already have an account ? <Link to={"/login"} className="text-pink-800">Login</Link></p>
        </div>
      </div>
    </>
  );
};

export default Login;
