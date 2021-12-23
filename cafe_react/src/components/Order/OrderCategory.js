import MobileDropDown from "./MobileDropDown"

function OrderCategory(props){
    function CategoryClick(id){
        props.setSelected_Category(id)
    }
    
    return (
        <div className="order_category_main">
            <div className="order_category">
                <MobileDropDown title="Kategori Listesi">
                    <div className="flex md:flex-col flex-wrap less_md:justify-center less_md:w-full gap-2 overflow-y-auto">
                    {props.category_list.map(category => (
                        <button className="order_category_item less_md:text-sm" key={category.id} onClick={()=> CategoryClick(category.id)}>
                            {category.name}
                        </button>
                    ))} 
                    </div>
                </MobileDropDown>
            </div>
        </div>
    )
}

export default OrderCategory