import {useState} from "react"
import { FaTimes } from "react-icons/fa"

function TableCloseModal(props){
    const [ModalLoading, setModalLoading] = useState(false)

    return (
        
        <div className={props.ShowTableCloseModal ? "" : "hidden"}>
            <div className="management_modal">
                <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
                <label className="absolute w-full h-full" onClick={()=>props.setShowTableCloseModal(false)}></label>
                <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl bg-gray-600 flex justify-center z-10">
                    <div className="absolute right-0 top-0 m-3 cursor-pointer" onClick={()=>props.setShowTableCloseModal(false)}>
                        <FaTimes/>
                    </div>
                    <div className="mt-10 management_delete">
                        <div className="mb-5">
                            <label className="font-bold">{parseInt(props.table_id) + 1}</label>
                            <label> Numaralı Masayı Gerçekten Kapatmak İstiyormusunuz?</label>
                        </div>
                        <div className="flex justify-between" >
                            <button disabled={ModalLoading} className="py-2 px-7 bg-red-900 rounded-sm" onClick={()=> props.closeTable(setModalLoading)}>Evet</button>
                            <button className="py-2 px-7 bg-gray-800 rounded-sm" onClick={()=>props.setShowTableCloseModal(false)}>Hayır</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default TableCloseModal