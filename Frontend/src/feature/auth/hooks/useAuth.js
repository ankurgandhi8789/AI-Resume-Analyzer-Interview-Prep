import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,getMe,logout } from "../services/auth.api";
import { useEffect } from "react";
useEffect

export const useAuth = ()=>{

    const context = useContext(AuthContext)

    const {user , setUser , loading , setLoading}=context

    const handleLogin = async ({email,password})=>{
        setLoading(true)
        try{
            const data = await login({email,password})
            setUser(data.user)
        }catch(err){
            console.log('error at handleLogin')
        }finally{
            setLoading(false)
        }
        
        
    }

    const handleRegister = async ({username,email,password})=>{
        setLoading(true)
        try{
            const data = await register({username,email,password})
            setUser(data.user)
        }catch(err){

        }finally{
            setLoading(false)
        }
        
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(err){

        }finally{
            setLoading(false)
        }
        
        
    }

    useEffect(()=>{
        const getAndSet = async ()=>{
            try{
                const data = await getMe()
                // console.log(data.user)
                setUser(data.user)
            }catch(err){

            }finally{
                setLoading(false)
            }      
        }

        getAndSet()

    },[])

    return {user,loading,handleRegister,handleLogin,handleLogout}
}