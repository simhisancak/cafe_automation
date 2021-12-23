import { useState, useLayoutEffect } from "react"
import { FaTimes } from "react-icons/fa"
function ChangeOrderCost(props){
    const [cost, setcost] = useState("")
    useLayoutEffect(() => {
        setcost(getCost())
    }, [props.ShowChangeOrderCostModal])// eslint-disable-line react-hooks/exhaustive-deps

    function form_submit(e){
        e.preventDefault()
        props.change_total_cost(parseFloat(cost))
        props.setShowChangeOrderCostModal(false)
    }

    function getCost(){
        let ret = 0
        props.order_list.forEach(order => {
            if (order.active){ ret += order.cost * order.count }
        })
        return ret
    }

    return (
        <div className={props.ShowChangeOrderCostModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowChangeOrderCostModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowChangeOrderCostModal(false)}>
                        <FaTimes/>
                    </div>
                    <form className="management_form" onSubmit={onsubmit}>
                        <div className={`form_message message_error`}>
                            {props.api_message}
                        </div>
                        <ul>
                            <li>
                                <input type="number" step="0,01" placeholder="Fiyat" value={cost} onChange={(e) => setcost(e.target.value)}/>
                            </li>
                            <li>
                                <button type="submit" onClick={(e) => form_submit(e)}>Değiştir</button>
                            </li>
                        </ul>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}

export default ChangeOrderCost