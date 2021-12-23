
function OrderItem(props){
    
    return (
        <div className={`order_item ${props.Selected ? "order_item_selected" : ""} ${props.order_active ? "" : "order_item_deactive"}`} onClick={props.onClick}>
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row text-xl h-full items-center">
                    <label className="mr-4">{props.count}</label>
                    <div>
                        <label>{props.name} {props.order_note}</label>
                    </div>
                </div>
                <div>
                    {props.cost}₺
                </div>
            </div>
        </div>
    )
}

export default OrderItem