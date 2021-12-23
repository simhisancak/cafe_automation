import OrderItem from "../Order/OrderItem"
import { FaTimes } from "react-icons/fa"
import { memo } from "react"
const OldOrderListModal = memo((props)=>{
    return (
        <div className={props.ShowOldOrderListModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowOldOrderListModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowOldOrderListModal(false)}>
                        <FaTimes/>
                    </div>
                    <div className="mt-5 w-96 flex flex-col gap-y-1">
                        {props.SelectedOldOrderListBody.data.map((old_order, i)=>(
                            <OrderItem key={i}  name={old_order.name} order_active={old_order.active} order_note={old_order.note} count={old_order.count} cost={old_order.count * old_order.cost}/>
                        ))}
                        <div className="h-12 bg-gray-900 flex items-center w-full pl-4">
                            Tutar: {props.SelectedOldOrderListBody.cost}₺
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
    
})

export default OldOrderListModal