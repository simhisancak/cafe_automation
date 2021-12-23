import { useState } from "react"
import MobileDropDown from "./MobileDropDown"

function OrderProduct(props){
    const [product_count, setproduct_count] = useState("")
    function addOrder(id){
        let count = 1
        if (product_count){
            count = parseInt(product_count)
            if (!count){count = 1}
            setproduct_count("")
        }
        props.addOrder(id, count)
    }

    function ChangeCount(e){
        let value = e.target.value
        if (value === "←"){setproduct_count(product_count.slice(0, -1))}
        else if (value === "x"){setproduct_count("")}
        else if (value === "0" && !product_count){}
        else{setproduct_count(product_count+value)}
    }

    const btnValues = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
        "←", "0", "x",
    ];

    return (
        <div className="order_product_main">
            <div className="order_product">
                <MobileDropDown title="Ürün Listesi">
                    <div className="flex flex-wrap justify-center w-full overflow-y-auto gap-2">
                        {props.ProductList.map(product => (
                            <button disabled={!product.stock} className="order_product_item" key={product.id}onClick={() => addOrder(product.id)}>
                                <span className="md:text-2xl text-sm">{product.name}</span>
                                <span className="text-sm">{product.cost}₺</span>
                            </button>
                        ))}
                    </div>
                    
                </MobileDropDown>
            </div>
            <div className="md:flex flex-col overflow-hidden h-52 flex-shrink-0 less_md:hidden">
                <div className="mb-1">
                    <input disabled type="number" className="w-full h-8 bg-gray-900 text-center" value={product_count} onChange={(e) => setproduct_count(e.target.value)}/>
                </div>
                <div className="grid grid-cols-3 gap-1 order_count">
                    {btnValues.map((btn, i)=>(
                        <button key={i} value={btn} onClick={(e)=> ChangeCount(e)}>{btn}</button>  
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrderProduct