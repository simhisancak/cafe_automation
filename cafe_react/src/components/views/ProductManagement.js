import {FaRegEdit} from "react-icons/fa"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {BsFillTrashFill} from "react-icons/bs"
import ProductEditModal from "components/ManagementModals/Product/ProductEditModal"
import ProductDeleteModal from "components/ManagementModals/Product/ProductDeleteModal"
import ProductAddModal from "components/ManagementModals/Product/ProductAddModal"
import ContentLoading from "components/ContentLoading"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { clear_user_data } from "../../stores/UserSlice"

function ProductManagement() {
    const [ManagedProduct, setManagedProduct] = useState(null)
    const [ShowEditModal, setShowEditModal] = useState(false)
    const [ShowDeleteModal, setShowDeleteModal] = useState(false)
    const [ShowAddModal, setShowAddModal] = useState(false)
    const [category_list, setcategory_list] = useState([])
    const [product_list, setproduct_list] = useState([])
    const [api_message, setapi_message] = useState("")
    const [CategoryLoading, setCategoryLoading] = useState(true) 
    const [ProductLoading, setProductLoading] = useState(true) 
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
        }).then(()=>setCategoryLoading(false))
    }
    async function get_products() {
        if(!jwt_token) return
        axios.post("/management/get_products").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setproduct_list(data.data)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>{setProductLoading(false)})
    }

    useEffect(() => { if(CategoryLoading){get_categories()}; if(ProductLoading){get_products()}}, [])// eslint-disable-line react-hooks/exhaustive-deps
    function getCategoryName(category_id){
        category_id = parseInt(category_id)
        const index = category_list.findIndex((category) => category.id === category_id)
        if (index !== -1){
            return category_list.at(index).name;
        }
        return ""
    }


    function DeleteProduct(setModalLoading){
        if(!jwt_token) return
        const post_data = {
            id: ManagedProduct.id,
        }
        setModalLoading(true)
        axios.post("/management/delete_product", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    const newproduct_list = [...product_list];
                    const index = product_list.findIndex((product) => product.id === ManagedProduct.id)
                    newproduct_list.splice(index, 1)
                    setproduct_list(newproduct_list);
                    setShowDeleteModal(false)
                }
                else{
                    alert("Ürün Silinemedi")
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=> setModalLoading(false))
    }

    function AddProduct(name, stock, cost, base_cost, category_id, tax, setModalLoading){
        if(!jwt_token) return
        if(!name){setapi_message("Ürün Adı Boş Olamaz"); return}
        if(stock < 0){setapi_message("Ürün Adeti 0'dan Küçük Olamaz"); return}
        if(cost < 0){setapi_message("Ürün Fiyatı 0'dan Küçük Olamaz"); return}
        if(base_cost < 0){setapi_message("Ürün Alış Fiyatı 0'dan Küçük Olamaz"); return}
        if(category_id < 0){setapi_message("Kategori Boş Olamaz"); return}
        if(tax < 0){setapi_message("Vergi 0'dan Küçük Olamaz"); return}

        const new_product = {
            name : name,
            stock : stock,
            cost : cost,
            base_cost : base_cost,
            category_id : category_id,
            tax : tax,
            category_name : getCategoryName(category_id)
        }

        setModalLoading(true)
        axios.post("/management/add_product", new_product).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    new_product.id = data.id
                    const newproduct_list = [...product_list];
                    newproduct_list.push(new_product);
                    setproduct_list(newproduct_list);  
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

    function EditProduct(name, stock, cost, base_cost, category_id, tax, setModalLoading){
        if(!jwt_token) return
        if(!name){setapi_message("Ürün Adı Boş Olamaz"); return}
        if(stock < 0){setapi_message("Ürün Adeti 0'dan Küçük Olamaz"); return}
        if(cost < 0){setapi_message("Ürün Fiyatı 0'dan Küçük Olamaz"); return}
        if(base_cost < 0){setapi_message("Ürün Alış Fiyatı 0'dan Küçük Olamaz"); return}
        if(category_id < 0 || category_id === null){setapi_message("Kategori Boş Olamaz"); return}
        if(tax < 0){setapi_message("Vergi 0'dan Küçük Olamaz"); return}
        
        const post_data = {
            id: ManagedProduct.id,
        }
        if(name !== ManagedProduct.name ) {post_data.name = name}
        if(stock !== ManagedProduct.stock) {post_data.stock = stock}
        if(cost !== ManagedProduct.cost) {post_data.cost = cost}
        if(base_cost !== ManagedProduct.base_cost) {post_data.base_cost = base_cost}
        if(category_id !== ManagedProduct.category_id) {post_data.category_id = category_id}
        if(tax !== ManagedProduct.tax) {post_data.tax = tax}

        setModalLoading(true)
        axios.post("/management/edit_product", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    ManagedProduct.name = name
                    ManagedProduct.stock = stock
                    ManagedProduct.cost = cost
                    ManagedProduct.base_cost = base_cost
                    ManagedProduct.category_id = category_id
                    ManagedProduct.tax = tax
                    ManagedProduct.category_name = getCategoryName(category_id)
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

    

    return (CategoryLoading || ProductLoading) ? <ContentLoading/> :(
        <div className="overflow-x-auto">
            <>
            <ProductEditModal ManagedProduct={ManagedProduct} ShowEditModal={ShowEditModal} setShowEditModal={setShowEditModal} EditProduct={EditProduct} category_list={category_list} api_message={api_message}/>
            <ProductDeleteModal ManagedProduct={ManagedProduct} ShowDeleteModal={ShowDeleteModal} setShowDeleteModal={setShowDeleteModal} DeleteProduct={DeleteProduct}/>
            <ProductAddModal ShowAddModal={ShowAddModal} setShowAddModal={setShowAddModal} AddProduct={AddProduct} category_list={category_list} api_message={api_message}/>
            </>
            <table className="w-full table-auto management_table">
                <thead>
                    <tr>
                        <th className="w-4">
                            <button className="text-2xl ml-4 align-middle" onClick={() => setShowAddModal(true)}>
                                <AiOutlinePlusSquare/>
                            </button>
                        </th>
                        <th>Ürün Adı</th>
                        <th>Ürün Fiyatı</th>
                        <th>Ürün Alış Fiyatı</th>
                        <th>Ürün Vergisi</th>
                        <th>Ürün Kategorisi</th>
                        <th>Ürün Adeti</th>
                        <th className="w-7">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {product_list.map((product) =>(
                        <tr key={product.id}>
                            <td>&nbsp;</td>
                            <td>{product.name}</td>
                            <td>{product.cost}₺</td>
                            <td>{product.base_cost}₺</td>
                            <td>%{product.tax}</td>
                            <td>{product.category_name}</td>
                            <td>{product.stock}</td>  
                            <td className="text-xl">
                                <button onClick={()=>{setShowEditModal(true); setManagedProduct(product)}} className="mr-4 hover:text-gray-200">
                                    <FaRegEdit/>
                                </button>
                                <button onClick={()=>{setShowDeleteModal(true); setManagedProduct(product)}} className="hover:text-gray-200">
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
export default ProductManagement