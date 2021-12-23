import { useState, forwardRef, useLayoutEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios"
import { clear_user_data } from "../../stores/UserSlice"
import ContentLoading from "components/ContentLoading"
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import locale_tr from "date-fns/locale/tr"
import OldOrderListModal from "components/OldOrder.js/OldOrderListModal"

import "react-datepicker/dist/react-datepicker.min.css"

registerLocale('tr', locale_tr)

function OldOrders (){
    const [OldOrders, setOldOrders] = useState([])
    const [SelectedOldOrderListBody, setSelectedOldOrderListBody] = useState({
        data : [],
        cost : 0
    })
    const { jwt_token } = useSelector( state => state.User)
    const [isLoading, setisLoading] = useState(false)
    const dispatch = useDispatch()
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setendDate] = useState(new Date());
    const [ShowOldOrderListModal, setShowOldOrderListModal] = useState(false)
    const [TableBody, setTableBody] = useState({
        tbody : [],
        PayTotal : 0,
        ProfitTotal : 0
    })

    const CustomDateButton = forwardRef(({ value, onClick }, ref) => (
        <button className="bg-gray-500 rounded-xl w-40 h-8" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    async function get_old_orders() {
        if(!jwt_token) return
        const post_data = {
            start_date : startDate.getTime(),
            end_date : endDate.getTime()
        }
        setisLoading(true)
        axios.post("/order/get_old_orders", post_data).then(resp => {
            const data = resp.data
            if (data){
                if(data.status === "succes"){
                    setOldOrders(data.data)
                }
                else{
                    alert(data.msg)
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.jwt_error){
                dispatch(clear_user_data())
            }
        }).then(()=>setisLoading(false))
    }

    function handle_table_click(index){
        setSelectedOldOrderListBody({
            data : OldOrders.at(index).data,
            cost : OldOrders.at(index).pay_total
        })
        setShowOldOrderListModal(true)
    }

    function create_old_order_items(){
        var profit_total = 0
        var pay_total = 0
        var old_order_items = []
        OldOrders.forEach((old_order, i) => { 
            profit_total += parseFloat(old_order.profit)
            pay_total += parseFloat(old_order.pay_total)
            old_order_items.push(
                <tr onClick={()=>handle_table_click(i)} key={i}>
                    <td>
                        {old_order.user_name}
                    </td>
                    <td>
                        {old_order.order_date}
                    </td>
                    <td>
                        {old_order.profit}₺
                    </td>
                    <td>
                        {old_order.pay_total}₺
                    </td>
                </tr>
            )
        })// eslint-disable-line array-callback-return

        setTableBody({
            tbody : old_order_items,
            PayTotal : pay_total,
            ProfitTotal : profit_total
        })
    }
    
    useLayoutEffect(()=>{
        create_old_order_items()
    }, [OldOrders])// eslint-disable-line react-hooks/exhaustive-deps

    return isLoading ? <ContentLoading/> : (
        <div>
            <OldOrderListModal ShowOldOrderListModal={ShowOldOrderListModal} setShowOldOrderListModal={setShowOldOrderListModal} SelectedOldOrderListBody={SelectedOldOrderListBody}/>
            <div className="flex flex-col justify-center gap-y-2 mx-1 mt-1">
                <div className="flex flex-row justify-between w-[60%]">
                    <div className="flex flex-row items-center gap-x-2">
                        <label>Başlangıç Tarihi</label>
                        <DatePicker onBlur
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            customInput={<CustomDateButton/>}
                            locale='tr'
                            dateFormat="Pp"
                            withPortal
                            showTimeSelect
                        />
                    </div>
                    <div className="flex flex-row items-center gap-x-2">
                        <label>Bitiş Tarihi</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setendDate(date)}
                            customInput={<CustomDateButton/>}
                            locale='tr'
                            dateFormat="Pp"
                            withPortal
                            showTimeSelect
                        />
                    </div>
                    <div className="flex items-center">
                        <button className="bg-gray-700 h-8 w-24 rounded-xl" onClick={()=>get_old_orders()}>
                            Getir
                        </button>
                    </div>
                </div>
                <table className="w-full table-auto report_table">
                    <thead>
                        <tr>
                            <th >Ödemeyi Alan</th>
                            <th>Ödeme Tarihi</th>
                            <th>Kâr (Toplam: {TableBody.ProfitTotal}₺)</th>
                            <th>Sipariş Tutarı (Toplam: {TableBody.PayTotal}₺)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TableBody.tbody}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OldOrders