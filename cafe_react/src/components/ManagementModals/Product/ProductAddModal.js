import { useState, useLayoutEffect } from "react"
import { FaTimes } from "react-icons/fa"
function ProductAddModal(props){
    const [name, setname] = useState("")
    const [stock, setstock] = useState(0)
    const [cost, setcost] = useState(0)
    const [base_cost, setbase_cost] = useState(0)
    const [category_id, setcategory_id] = useState(-1)
    const [tax, settax] = useState(0)
    const [ModalLoading, setModalLoading] = useState(false)
    useLayoutEffect(() => {
        setname("")
        setstock("")
        setcost("")
        setbase_cost("")
        settax("")
        if(props.category_list.length){
            setcategory_id(props.category_list.at(0).id)
        }
        else{
            setcategory_id(-1)
        }
    }, [props.ShowAddModal, props.category_list])

    function form_submit(e){
        e.preventDefault()
        props.AddProduct(name, stock, cost, base_cost, category_id, tax, setModalLoading)
    }

    return (
        <div className={props.ShowAddModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowAddModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowAddModal(false)}>
                        <FaTimes/>
                    </div>
                    <form className="management_form" onSubmit={onsubmit}>
                        <div className={`form_message message_error`}>
                            {props.api_message}
                        </div>
                        <ul>
                            <li>
                                <input type="text" placeholder="Ürün Adı" value={name} onChange={(e) => setname(e.target.value)}/>
                            </li>
                            <li>
                                <input type="number" step="0.01" placeholder="Ürün Fiyatı" value={cost} onChange={(e) => setcost(e.target.value)}/>
                            </li>
                            <li>
                                <input type="number" step="0.01" placeholder="Ürün Alış Fiyatı" value={base_cost} onChange={(e) => setbase_cost(e.target.value)}/>
                            </li>
                            <li>
                                <input type="number" step="1" placeholder="Ürün Adeti" value={stock} onChange={(e) => setstock(e.target.value)}/>
                            </li>
                            <li>
                                <input type="number" step="1" placeholder="Vergi %" value={tax} onChange={(e) => settax(e.target.value)}/>
                            </li>
                            <li>
                                <select className="" value={category_id} onChange={(e)=> setcategory_id(e.target.value)}>
                                    {props.category_list.map((category) => (  
                                        <option value={category.id} key={category.id} >{category.name}</option>
                                    ))}
                                </select>
                            </li>
                            <li>
                                <button disabled={ModalLoading} type="submit" onClick={(e) => form_submit(e)}>Kaydet</button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default ProductAddModal