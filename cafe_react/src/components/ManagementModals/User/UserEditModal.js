import { useState, useLayoutEffect } from "react"
import { FaTimes } from "react-icons/fa"

function UserEditModal(props){
    const [user_name, setuser_name] = useState("")
    const [password, setpassword] = useState("")
    const [mail, setmail] = useState("")
    const [super_user, setsuper_user] = useState(false)
    const [ModalLoading, setModalLoading] = useState(false)
    useLayoutEffect(() => {
        if (props.ManagedUser){
            setuser_name(props.ManagedUser.user_name)
            setpassword(props.ManagedUser.password)
            setmail(props.ManagedUser.mail)
            setsuper_user(props.ManagedUser.super_user)
        }
    }, [props.ManagedUser])

    function form_submit(e){
        e.preventDefault()
        props.EditUser(user_name, password, mail, super_user, setModalLoading)
    }

    return (
        <div className={props.ShowEditModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowEditModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowEditModal(false)}>
                        <FaTimes/>
                    </div>
                    <form className="management_form" onSubmit={onsubmit}>
                        <div className={`form_message message_error`}>
                            {props.api_message}
                        </div>
                        <ul>
                            <li>
                                <input type="text" placeholder="Kullanıcı Adı" value={user_name} onChange={(e) => setuser_name(e.target.value)}/>
                            </li>
                            <li>
                                <input type="password" placeholder="Şifre" value={password} onChange={(e) => setpassword(e.target.value)}/>
                            </li>
                            <li>
                                <input type="email" placeholder="Mail" value={mail} onChange={(e) => setmail(e.target.value)}/>
                            </li>
                            <li className="flex justify-start items-center">
                                <input className="management_checkbox" type="checkbox" id="super_user" checked={super_user || false} onChange={(e) => setsuper_user(e.target.checked)}/>
                                <label htmlFor="super_user" className="ml-2">Yönetici</label>
                            </li>
                            <li>
                                <button disabled={ModalLoading} type="submit" onClick={(e) => form_submit(e)}>Kaydet</button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default UserEditModal