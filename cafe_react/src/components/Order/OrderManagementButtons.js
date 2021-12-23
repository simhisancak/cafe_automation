import MobileDropDown from "./MobileDropDown"

function OrderManagementButtons(props){
return(
    <div className="order_management_buttons_main">
        <div className="order_management_buttons">
            <MobileDropDown title="Sipariş Yönetimi">
                <div className="flex md:flex-col flex-wrap less_md:justify-center less_md:w-full gap-2 overflow-y-auto">
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("+")}>
                        +
                    </button>
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("-")}>
                        -
                    </button>
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("iade")}>
                        İade
                    </button>
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("masa aktar")}>
                        Masa Aktar
                    </button>
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("fiyat düzenle")}>
                        Fiyat Düzenle
                    </button>
                    <button className="order_management_item less_md:text-sm" onClick={()=>props.order_management("masa kapat")}>
                        Masa Kapat
                    </button>
                </div>
            </MobileDropDown>
        </div>
    </div>
)

}

export default OrderManagementButtons