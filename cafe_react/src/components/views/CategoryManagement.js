import {FaRegEdit} from "react-icons/fa"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {BsFillTrashFill} from "react-icons/bs"
import CategoryEditModal from "components/ManagementModals/Category/CategoryEditModal"
import CategoryDeleteModal from "components/ManagementModals/Category/CategoryDeleteModal"
import CategoryAddModal from "components/ManagementModals/Category/CategoryAddModal"
import ContentLoading from "components/ContentLoading"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { clear_user_data } from "../../stores/UserSlice"

function CategoryManagement() {
    const [ManagedCategory, setManagedCategory] = useState(null)
    const [ShowEditModal, setShowEditModal] = useState(false)
    const [ShowDeleteModal, setShowDeleteModal] = useState(false)
    const [ShowAddModal, setShowAddModal] = useState(false)
    const [category_list, setcategory_list] = useState([])
    const [api_message, setapi_message] = useState("")
    const [isLoading, setisLoading] = useState(true) 
    const { jwt_token } = useSelector( state => state.User)
    const dispatch = useDispatch()

    useEffect(() => { if(api_message){setapi_message("")} }, [ShowEditModal, ShowAddModal])// eslint-disable-line react-hooks/exhaustive-deps

    async function get_categories() {
        if(!jwt_token) return
        axios.post("/management/get_categories").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setcategory_list(data.data)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setisLoading(false))
    }
    useEffect(() => { if(isLoading){get_categories()} }, [])// eslint-disable-line react-hooks/exhaustive-deps


    
    function DeleteCategory(setModalLoading){
        if(!jwt_token) return
        const post_data = {
            id: ManagedCategory.id,
        }
        setModalLoading(true)
        axios.post("/management/delete_category", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    const newcategory_list = [...category_list];
                    const index = category_list.findIndex((category) => category.id === ManagedCategory.id)
                    newcategory_list.splice(index, 1)
                    setcategory_list(newcategory_list);
                    setShowDeleteModal(false)
                }
                else{
                    alert("Kategori Silinemedi")
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=> setModalLoading(false))
    }

    function AddCategory(name, setModalLoading){
        if(!jwt_token) return
        if(!name){setapi_message("Kategori Adı Boş Olamaz"); return}

        const new_category = {
            name : name,
        }
        setModalLoading(true)
        axios.post("/management/add_category", new_category).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    new_category.id = data.id
                    const newcategory_list = [...category_list];
                    newcategory_list.push(new_category);
                    setcategory_list(newcategory_list);   
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
        }).then(()=> setModalLoading(false))
    }

    function EditCategory(name, setModalLoading){
        if(!jwt_token) return
        if(!name){setapi_message("Kategori Adı Boş Olamaz"); return}
        
        const post_data = {
            id: ManagedCategory.id,
        }
        if(name !== ManagedCategory.name ) {post_data.name = name}
        setModalLoading(true)
        axios.post("/management/edit_category", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    ManagedCategory.name = name
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
        }).then(()=> setModalLoading(false))
    }

    return isLoading ? <ContentLoading/> :(
        <div className="overflow-x-auto ">
            <>
            <CategoryEditModal ManagedCategory={ManagedCategory} ShowEditModal={ShowEditModal} setShowEditModal={setShowEditModal} EditCategory={EditCategory} api_message={api_message}/>
            <CategoryDeleteModal ManagedCategory={ManagedCategory} ShowDeleteModal={ShowDeleteModal} setShowDeleteModal={setShowDeleteModal} DeleteCategory={DeleteCategory}/>
            <CategoryAddModal ShowAddModal={ShowAddModal} setShowAddModal={setShowAddModal} AddCategory={AddCategory} api_message={api_message}/>
            </>
            <table className="w-full table-auto management_table">
                <thead>
                    <tr>
                        <th className="w-4">
                            <button className="text-2xl ml-4 align-middle" onClick={() => setShowAddModal(true)}>
                                <AiOutlinePlusSquare/>
                            </button>
                        </th>
                        <th>Kategori Adı</th>
                        <th className="w-7">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {category_list.map((category) =>(
                        <tr key={category.id}>
                            <td>&nbsp;</td>
                            <td>{category.name}</td>
                            <td className="text-xl">
                                <button onClick={()=>{setShowEditModal(true); setManagedCategory(category)}} className="mr-4 hover:text-gray-200">
                                    <FaRegEdit/>
                                </button>
                                <button onClick={()=>{setShowDeleteModal(true); setManagedCategory(category)}} className="hover:text-gray-200">
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
export default CategoryManagement