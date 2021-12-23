import { useState, useLayoutEffect } from "react"
import { FaTimes } from "react-icons/fa"
function CategoryAddModal(props){
    const [name, setname] = useState("")
    const [ModalLoading, setModalLoading] = useState(false)
    useLayoutEffect(() => {
        setname("")
    }, [props.ShowAddModal])

    function form_submit(e){
        e.preventDefault()
        props.AddCategory(name, setModalLoading)
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
                                <input type="text" placeholder="Kategori Adı" value={name} onChange={(e) => setname(e.target.value)}/>
                            </li>
                            <li>
                                <button disabled={ModalLoading} type="submit" onClick={(e) => form_submit(e)}>Ekle</button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    )
}



export default CategoryAddModal