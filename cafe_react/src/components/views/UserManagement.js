import {FaRegEdit} from "react-icons/fa"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {BsFillTrashFill} from "react-icons/bs"
import UserEditModal from "components/ManagementModals/User/UserEditModal"
import UserDeleteModal from "components/ManagementModals/User/UserDeleteModal"
import UserAddModal from "components/ManagementModals/User/UserAddModal"
import ContentLoading from "components/ContentLoading"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { clear_user_data } from "../../stores/UserSlice"

function UserManagement() {
    const [ManagedUser, setManagedUser] = useState(null)
    const [ShowEditModal, setShowEditModal] = useState(false)
    const [ShowDeleteModal, setShowDeleteModal] = useState(false)
    const [ShowAddModal, setShowAddModal] = useState(false)
    const [user_list, set_user_list] = useState([])
    const [api_message, setapi_message] = useState("")
    const [isLoading, setisLoading] = useState(true) 
    const { jwt_token } = useSelector( state => state.User)
    const dispatch = useDispatch()

    useEffect(() => { if(api_message){setapi_message("")} }, [ShowEditModal, ShowAddModal])// eslint-disable-line react-hooks/exhaustive-deps


    async function get_users() {
        if(!jwt_token) return
        axios.post("/management/get_users").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    set_user_list(data.data)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setisLoading(false))
    }
    useEffect(() => { if(isLoading){get_users()} }, [])// eslint-disable-line react-hooks/exhaustive-deps
    
    function DeleteUser(setModalLoading){
        if(!jwt_token) return
        const post_data = {
            id: ManagedUser.id,
        }
        setModalLoading(true)
        axios.post("/management/delete_user", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    const newuser_list = [...user_list];
                    const index = user_list.findIndex((user) => user.id === ManagedUser.id)
                    newuser_list.splice(index, 1)
                    set_user_list(newuser_list)
                    setShowDeleteModal(false)
                }
                else{
                    alert("Kullanıcı Silinemedi")
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setModalLoading(false))
    }

    function AddUser(user_name, password, mail, super_user, setModalLoading){
        if(!jwt_token) return
        if(!user_name){setapi_message("Kullanıcı Adı Boş Olamaz"); return}
        if(!password){setapi_message("Şifre Boş Olamaz"); return}
        if(!mail){setapi_message("Mail Boş Olamaz"); return}

        const new_user = {
            user_name : user_name,
            password : password,
            mail : mail,
            super_user: super_user
        }
        setModalLoading(true)
        axios.post("/management/add_user", new_user).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    new_user.id = data.id
                    const newuser_list = [...user_list];
                    newuser_list.push(new_user);
                    set_user_list(newuser_list);   
                    setShowAddModal(false)
                }
                else{
                    setapi_message(data.msg)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setModalLoading(false))      
    }

    function EditUser(user_name, password, mail, super_user, setModalLoading){
        if(!jwt_token) return
        if(!user_name){setapi_message("Kullanıcı Adı Boş Olamaz"); return}
        if(!password){setapi_message("Şifre Boş Olamaz"); return}
        if(!mail){setapi_message("Mail Boş Olamaz"); return}
        
        const post_data = {
            id: ManagedUser.id,
        }
        if(user_name !== ManagedUser.user_name ) {post_data.user_name = user_name}
        if(password !== ManagedUser.password) {post_data.password = password}
        if(mail !== ManagedUser.mail) {post_data.mail = mail}
        if(super_user !== ManagedUser.super_user) {post_data.super_user = super_user}

        setModalLoading(true)
        axios.post("/management/edit_user", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    ManagedUser.user_name = user_name
                    ManagedUser.password = password
                    ManagedUser.mail = mail
                    ManagedUser.super_user = super_user
                    setShowEditModal(false)
                }
                else{
                    setapi_message(data.msg)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setModalLoading(false))      
    }

    return isLoading ? <ContentLoading/> :(
        <div className="overflow-x-auto ">
            <>
            <UserEditModal ManagedUser={ManagedUser} ShowEditModal={ShowEditModal} setShowEditModal={setShowEditModal} EditUser={EditUser} api_message={api_message}/>
            <UserDeleteModal ManagedUser={ManagedUser} ShowDeleteModal={ShowDeleteModal} setShowDeleteModal={setShowDeleteModal} DeleteUser={DeleteUser}/>
            <UserAddModal ShowAddModal={ShowAddModal} setShowAddModal={setShowAddModal} AddUser={AddUser} api_message={api_message}/>
            </>
            <table className="w-full table-auto management_table">
                <thead>
                    <tr>
                        <th className="w-4">
                            <button className="text-2xl ml-4 align-middle" onClick={() => {setShowAddModal(true)}}>
                                <AiOutlinePlusSquare/>
                            </button>
                        </th>
                        <th>Kullanıcı Adı</th>
                        <th>Üyelik Durumu</th>
                        <th className="w-7">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {user_list.map((user) =>(
                        <tr key={user.id}>
                            <td>&nbsp;</td>
                            <td>{user.user_name}</td>
                            <td>{user.super_user ? "Yönetici" : "Kullanıcı"}</td>
                            <td className="text-xl">
                                <button onClick={()=>{setShowEditModal(true); setManagedUser(user)}} className="mr-4 hover:text-gray-200">
                                    <FaRegEdit/>
                                </button>
                                <button onClick={()=>{setShowDeleteModal(true); setManagedUser(user)}} className="hover:text-gray-200">
                                    <BsFillTrashFill/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default UserManagement