import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setisauthenticated, setsuper_user, clear_user_data } from "../stores/UserSlice"
import PageLoading from "./PageLoading"
import Login from "./views/Login"
import axios from "axios"

function LoginRequired (props){
    const { jwt_token, isauthenticated } = useSelector( state => state.User)
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch()
    async function login_check() {
        if(props.menu) {setLoading(false);return}
        if(!jwt_token) {setLoading(false);return}
        if(isauthenticated) {setLoading(false);return}
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt_token}`
        axios.post("/get_user_info").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    dispatch(setisauthenticated(true))
                    dispatch(setsuper_user(data.super_user)) 
                }
                else {
                    dispatch(clear_user_data())
                }
            }
        }).catch(error => {
            console.log(error)
            dispatch(clear_user_data())
        }).then(()=>{
            setLoading(false)
        })
    }
    useEffect(() => { if(isLoading){login_check()} }, [])// eslint-disable-line react-hooks/exhaustive-deps
    
    if (isLoading){
        if (props.menu){
            return null
        }
        return <PageLoading/>
    }
    else if (isauthenticated){
        return props.children
    }
    else if(props.menu){
        return null
    }
    else{
        return <Login/>
    }
}

export default LoginRequired