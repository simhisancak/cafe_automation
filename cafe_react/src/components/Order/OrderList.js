import OrderItem from "./OrderItem"
import MobileDropDown from "./MobileDropDown"
import { useState, useLayoutEffect} from "react"

function OrderList(props){
    const [cost, setcost] = useState(0)
    const [ForceUpdate, setForceUpdate] = useState(props.ForceUpdate) // eslint-disable-line no-unused-vars
    const [ApiLoadingSave, setApiLoadingSave] = useState(false)
    const [ApiLoadingPay, setApiLoadingPay] = useState(false)
    function getCost(){
        let ret = 0
        props.order_list.forEach(order => {
            if (order.active){ ret += order.cost * order.count }
        })
        return ret.toFixed(2)
    }

    useLayoutEffect(() => {
        setcost(getCost())
    }, [props.order_list, props.ForceUpdate])// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="order_list_main">
            <div className="order_list">
                <MobileDropDown title="Sipariş Listesi">
                    <div className="gap-y-2 flex flex-col">
                         {props.order_list.map((order, i)=>(
                            <OrderItem name={order.name} order_active={order.active} order_note={order.note} count={order.count} key={i} cost={order.count * order.cost} onClick={()=>props.setSelectedOrder(i)} Selected={props.SelectedOrder === i}/>
                         ))}
                    </div>
                    <div className="flex flex-col gap-y-1 md:hidden">
                        <div className="w-full h-12 grid grid-cols-3 gap-x-1">
                            <button className="bg-red-900" onClick={()=>props.setOrderDone(true)}>
                                İptal
                            </button>
                            <button className="bg-blue-900" onClick={()=>props.payOrder(setApiLoadingPay)} disabled={ApiLoadingPay}>
                                Ödeme
                            </button>
                            <button className="bg-green-900" onClick={()=>props.saveOrderList(setApiLoadingSave)} disabled={ApiLoadingSave}>
                                Kaydet
                            </button>
                        </div>
                        <div className="h-12 bg-gray-900 flex items-center w-full pl-4">
                            Tutar: {cost}₺
                        </div>
                    </div>    
                </MobileDropDown>    
            </div>
            <div className="flex flex-col gap-y-1 less_md:hidden">
                <div className="w-full h-12 grid grid-cols-3 gap-x-1">
                    <button className="bg-red-900" onClick={()=>props.setOrderDone(true)}>
                        İptal
                    </button>
                    <button className="bg-blue-900" onClick={()=>props.payOrder(setApiLoadingPay)} disabled={ApiLoadingPay}>
                        Ödeme
                    </button>
                    <button className="bg-green-900" onClick={()=>props.saveOrderList(setApiLoadingSave)} disabled={ApiLoadingSave}>
                        Kaydet
                    </button>
                </div>
                <div className="h-12 bg-gray-900 flex items-center w-full pl-4">
                    Tutar: {cost}₺
                </div>
            </div>
        </div>
    )
}

export default OrderList