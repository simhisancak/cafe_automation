import {FiEdit} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import axios from "axios"
import { clear_user_data } from 'stores/UserSlice'
import ContentLoading from 'components/ContentLoading'

function Home() {
    const [tables, settables] = useState([]) 
    const [isLoading, setisLoading] = useState(true) 
    const { jwt_token } = useSelector( state => state.User)
    const dispatch = useDispatch()

    async function get_tables() {
        if(!jwt_token) return
        axios.post("/order/get_tables").then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    settables(data.data)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setisLoading(false))
    }
    useEffect(() => { if(isLoading){get_tables()} }, [])// eslint-disable-line react-hooks/exhaustive-deps
    



    return isLoading ? <ContentLoading/> : (
        <div className="flex flex-wrap justify-center">
            {tables.map((table)=>(
                <NavLink to={`/order/${table.id}`} key={table.id} className={`${table.busy ? "table_btn_busy" : "table_btn"}`}>
                    <FiEdit className="text-5xl mb-2"/>
                    <span className="text-3xl" >
                        {table.id + 1}
                    </span>
                </NavLink>    
            ))}
        </div>
    )
}
export default Home