import { useState, useLayoutEffect } from "react"
import { FaTimes } from "react-icons/fa"
function ChangeTableModal(props){
    const [from_id, setfrom_id] = useState("")
    const [ModalLoading, setModalLoading] = useState(false)
    useLayoutEffect(() => {
        setfrom_id("")
    }, [props.ShowTableChangeModal])

    function form_submit(e){
        e.preventDefault()
        props.changeTable(from_id, setModalLoading)
    }

    function ChangeCount(e){
        e.preventDefault()
        let value = e.target.value
        if (value === "←"){setfrom_id(from_id.slice(0, -1))}
        else if (value === "x"){setfrom_id("")}
        else if (value === "0" && !from_id){}
        else{setfrom_id(from_id+value)}
    }

    const btnValues = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
        "←", "0", "x",
    ];

    return (
        <div className={props.ShowTableChangeModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowTableChangeModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowTableChangeModal(false)}>
                        <FaTimes/>
                    </div>
                    <form className="management_form" onSubmit={onsubmit}>
                        <div className={`form_message message_error`}>
                            {props.api_message}
                        </div>
                        <ul>
                            <li>
                                <input type="number" placeholder="Masa Numarası" className="w-full h-8 bg-gray-900 text-center md:hidden" value={from_id} onChange={(e) => setfrom_id(e.target.value)}/>
                            </li>
                            <li>
                                <div className="md:flex flex-col overflow-hidden h-52 flex-shrink-0 less_md:hidden">
                                    <div className="mb-1">
                                        <input disabled type="text" placeholder="Masa Numarası" className="w-full h-8 bg-gray-900 text-center" value={from_id} onChange={(e) => setfrom_id(e.target.value)}/>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 order_count">
                                        {btnValues.map((btn, i)=>(
                                            <button key={i} value={btn} onClick={(e)=> ChangeCount(e)}>{btn}</button>  
                                        ))}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button disabled={ModalLoading} type="submit" onClick={(e) => form_submit(e)}>Aktar</button>
                            </li>
                        </ul>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}

export default ChangeTableModal