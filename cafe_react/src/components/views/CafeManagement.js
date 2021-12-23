import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { setsite_config } from "stores/AppConfigSlice"
import { clear_user_data } from "stores/UserSlice"

function CafeManagement(props) {
    const { site_name, table_size } = useSelector( state => state.AppConfig)
    const [Site_Name, setSiteName] = useState(site_name)
    const [Table_Size, setTable_Size] = useState(table_size)
    const [api_message, setapi_message] = useState("")
    const { jwt_token } = useSelector( state => state.User)
    const [apiLoading, setapiLoading] = useState(false)
    const dispatch = useDispatch()

    function form_submit(e){
        e.preventDefault()
        
        if(!jwt_token) return
        if(!Site_Name){setapi_message("Site Adı Boş Olamaz"); return}
        if(Table_Size < 0){setapi_message("Masa Adeti 0'dan Küçük Olamaz"); return}
        
        const post_data = {}
        if(Site_Name !== site_name ) {post_data.name = Site_Name}
        if(Table_Size !== table_size) {post_data.table_size = Table_Size}

        setapiLoading(true)
        axios.post("/management/edit_site_config", post_data).then(resp => {
            if (api_message){
                setapi_message("")
            }
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    dispatch(setsite_config({
                        name : Site_Name,
                        table_size : Table_Size
                    }))
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
        }).then(()=> setapiLoading(false))
    }
    return (
        <div className="flex justify-center h-screen items-center">
            <form className="management_form w-96" onSubmit={onsubmit}>
                <div className={`form_message message_error`}>
                    {props.api_message}
                </div>
                <ul>
                    <li className="mb-3">
                        <input type="text" placeholder="İşletme Adı" value={Site_Name} onChange={(e) => setSiteName(e.target.value)}/>
                    </li>
                    <li className="mb-3">
                        <input type="number" placeholder="Masa Sayısı" value={Table_Size} onChange={(e) => setTable_Size(e.target.value)} step="1"/>
                    </li>
                    <li>
                        <button disabled={apiLoading}type="submit" onClick={(e) => form_submit(e)}>Kaydet</button>
                    </li>
                </ul>
            </form>
        </div>
    )
}
export default CafeManagement