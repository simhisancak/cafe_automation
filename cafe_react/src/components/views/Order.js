import OrderList from "components/Order/OrderList"
import OrderCategory from "components/Order/OrderCategory"
import OrderProduct from "components/Order/OrderProduct"
import OrderManagementButtons from "components/Order/OrderManagementButtons"
import ChangeTableModal from "components/Order/ChangeTableModal"
import ChangeOrderCost from "components/Order/ChangeOrderCost"
import TableCloseModal from "components/Order/CloseTableModal"
import { useParams, Redirect } from "react-router"
import { useState, useEffect, useLayoutEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { clear_user_data } from "../../stores/UserSlice"
import ContentLoading from "components/ContentLoading"


function Order(props){
    const { table_id } = useParams();
    const [category_list, setcategory_list] = useState([])
    const [product_list, setproduct_list] = useState([])
    const [order_list, setorder_list] = useState([])
    const [CategoryLoading, setCategoryLoading] = useState(true) 
    const [ProductLoading, setProductLoading] = useState(true) 
    const [OrderLoading, setOrderLoading] = useState(true) 
    const { jwt_token } = useSelector( state => state.User)
    const dispatch = useDispatch()
    const [Selected_Category, setSelected_Category] = useState(0)
    const [OrderDone, setOrderDone] = useState(false)
    const [SelectedOrder, setSelectedOrder] = useState(-1)
    const [ForceUpdate, setForceUpdate] = useState(0)
    const [ShowTableChangeModal, setShowTableChangeModal] = useState(false)
    const [ShowChangeOrderCostModal, setShowChangeOrderCostModal] = useState(false)
    const [ShowTableCloseModal, setShowTableCloseModal] = useState(false)
    const [api_message, setapi_message] = useState(false)

    useLayoutEffect(()=>{
        if(api_message){
            setapi_message("")
        }
    }, [ShowTableChangeModal, ShowChangeOrderCostModal]) // eslint-disable-line react-hooks/exhaustive-deps

    function getDefaultCategoryId(data){
        if(data.length){
            return data.at(0).id
        }
        return 0
    }

    async function get_categories() {
        if(!jwt_token) return
        axios.post("/management/get_categories").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){ 
                    setcategory_list(data.data)
                    setSelected_Category(getDefaultCategoryId(data.data))
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
        }).then(()=>setProductLoading(false))
    }
    async function get_order_list() {
        if(!jwt_token) return
        const post_data = {
            id : table_id
        }
        axios.post("/order/get_orders", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setorder_list(data.data)             
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setOrderLoading(false))
    }

    useEffect(() => { if(CategoryLoading){get_categories()}; if(ProductLoading){get_products()}; if(OrderLoading){get_order_list()}; }, [])// eslint-disable-line react-hooks/exhaustive-deps
 

    function addOrder(product_id, count){
        const neworder_list = [...order_list]
        const product_index = product_list.findIndex((product) => product.id === product_id)
        if (product_index !== -1){
            const order_index = neworder_list.findIndex((order) => (order.product_id === product_id && order.active))  
            if (order_index !== -1){
                neworder_list.at(order_index).count += count
            }
            else{
                const new_order = {
                    product_id : product_id,
                    name : product_list.at(product_index).name,
                    count : count,
                    cost : product_list.at(product_index).cost,
                    discount : 0,
                    active : true,
                    note : ""
                }
                neworder_list.push(new_order)
            }
        }
        setorder_list(neworder_list)
    }

    function saveOrderList(setApiLoading){
        if(!jwt_token) return
        const post_data = {
            table_id : table_id,
            data : JSON.stringify(order_list)
        }
        setApiLoading(true)
        axios.post("/order/set_orders", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setOrderDone(true)    
                }
                else{
                    setApiLoading(false)
                    alert(data.msg)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        })
    }
    function payOrder(setApiLoading){
        if(!jwt_token) return
        const post_data = {
            table_id : table_id,
        }
        setApiLoading(true)
        axios.post("/order/pay", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setOrderDone(true) 
                }
                else{
                    setApiLoading(false)
                    alert(data.msg)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        })
    }

    function changeTable(to_id, setModalLoading){
        if(!jwt_token) {return}
        if (to_id < 0){setapi_message("Masa Numarası 0'dan Küçük Olamaz"); return;}
        const post_data = {
            from_id : table_id,
            to_id : to_id - 1
        }
        setModalLoading(true)
        axios.post("/order/change_table", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setOrderDone(true)
                }
                else{
                    setapi_message(data.msg)
                    setModalLoading(false)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        })
    }

    function change_total_cost(new_cost){
        let cost = 0
        order_list.forEach(order => {
            if (order.active){ cost += order.cost * order.count }
        })
        if (new_cost === cost){return}
        new_cost = (new_cost - cost).toFixed(2)
        const neworder_list = [...order_list]
        const new_order = {
            product_id : -1,
            name : "",
            count : 1,
            cost : new_cost,
            discount : new_cost,
            active : true,
            note : "Fiyat Düzenlemesi"
        }
        neworder_list.push(new_order)
        setorder_list(neworder_list)
    }

    function closeTable(setModalLoading){
        if(!jwt_token) {return}
        const post_data = {
            id : table_id,
        }
        setModalLoading(true)
        axios.post("/order/close_table", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setOrderDone(true)
                }
                else{
                    alert(data.msg)
                    setModalLoading(false)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        })
    }

    function order_management(type){
        switch(type){
            case "+":
                if (SelectedOrder < 0) {return} 
                if (order_list.at(SelectedOrder).note === "(İade)" || order_list.at(SelectedOrder).note === "Fiyat Düzenlemesi"){return}
                order_list.at(SelectedOrder).count += 1;
                setForceUpdate(ForceUpdate+1)
                break;
            case "-":
                if (SelectedOrder < 0) {return} 
                if (order_list.at(SelectedOrder).note === "(İade)"){return}
                order_list.at(SelectedOrder).count -= 1;
                if (order_list.at(SelectedOrder).count <= 0){
                    order_list.splice(SelectedOrder, 1);
                    setSelectedOrder(-1)
                }
                setForceUpdate(ForceUpdate+1)
                break;
            case "iade":
                if (SelectedOrder < 0) {return} 
                const neworder_list = [...order_list]
                const old_order = neworder_list.at(SelectedOrder)
                if (old_order.note === "(İade)" || old_order.note === "Fiyat Düzenlemesi") {return}
                const new_order = {
                    product_id : old_order.product_id,
                    name : old_order.name,
                    count : 1,
                    cost : old_order.cost,
                    discount : old_order.discount,
                    active : false,
                    note : "(İade)"
                }
                neworder_list.push(new_order)
                old_order.count -= 1;
                if (old_order.count < 1){
                    neworder_list.splice(SelectedOrder, 1);
                    setSelectedOrder(-1)
                }
                setorder_list(neworder_list)
                break;
            case "masa aktar":
                setShowTableChangeModal(true)
                break;
            case "fiyat düzenle":
                setShowChangeOrderCostModal(true)
                break;
            case "masa kapat":
                setShowTableCloseModal(true)
                break;
            default:
                break;
        }
    }


    function getProductInSelectedCategory(){
        const ProductInSelectedCategory = []
        product_list.forEach(product =>{
            if(product.category_id === Selected_Category){
                ProductInSelectedCategory.push(product)
            }
        })
        return ProductInSelectedCategory
    }

    return (CategoryLoading || ProductLoading || OrderLoading) ? <ContentLoading/> :  (OrderDone ? <Redirect to="/"/> : (
        <div className="md:flex-row flex-col w-full h-full flex md:gap-x-2 gap-y-4 px-1">
            <ChangeTableModal ShowTableChangeModal={ShowTableChangeModal} setShowTableChangeModal={setShowTableChangeModal} changeTable={changeTable} api_message={api_message}/>
            <ChangeOrderCost ShowChangeOrderCostModal={ShowChangeOrderCostModal} setShowChangeOrderCostModal={setShowChangeOrderCostModal} order_list={order_list} change_total_cost={change_total_cost}/>
            <TableCloseModal ShowTableCloseModal={ShowTableCloseModal} setShowTableCloseModal={setShowTableCloseModal} table_id={table_id} closeTable={closeTable}/>
            <OrderManagementButtons order_management={order_management}/>
            <OrderList order_list={order_list} saveOrderList={saveOrderList} payOrder={payOrder} setOrderDone={setOrderDone} SelectedOrder={SelectedOrder} setSelectedOrder={setSelectedOrder} ForceUpdate={ForceUpdate}/>
            <OrderCategory category_list={category_list} setSelected_Category={setSelected_Category}/>
            <OrderProduct ProductList={getProductInSelectedCategory()} addOrder={addOrder}/>
        </div>
    ))
}

export default Order