import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setisauthenticated, setjwt_token, setsuper_user } from "../../stores/UserSlice"

function Login() {
    const [user_name, setuser_name] = useState("")
    const [password, setpassword] = useState("")
    const [api_message, setapi_message] = useState("")
    const dispatch = useDispatch()
    function form_submit(e){
        e.preventDefault()
        const post_data = {
            user_name: user_name,
            password: password 
        }
        axios.post("/create_token", post_data)
            .then(function (response) {
                const data = response.data
                if(data.status === "succes" && data.token){
                    localStorage.setItem("jwt_token", data.token)
                    dispatch(setjwt_token(data.token))
                    dispatch(setsuper_user(data.super_user))
                    dispatch(setisauthenticated(true))
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                }
                else if(data.status === "error"){
                    setapi_message(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    return (
        <div className="h-full w-full flex justify-center items-center">
            <form className="management_form less_md:w-full" onSubmit={onsubmit}>
                <div className={`form_message message_error`}>
                    {api_message}
                </div>
                <ul>
                    <li>
                        <input className="border-b focus:border-gray-300" type="text" placeholder="Kullanıcı Adı" value={user_name} onChange={(e)=>setuser_name(e.target.value)}/>
                    </li>
                    <li>
                        <input type="password" placeholder="Şifre" value={password} onChange={(e)=>setpassword(e.target.value)}/>
                    </li>
                    <li>
                        <button type="submit" onClick={(e) => form_submit(e)}>Giriş Yap</button>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default Login