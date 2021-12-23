import { useState } from "react"
import {VscTriangleDown} from "react-icons/vsc"
function MobileDropDown(props){
    const [list_open, setlist_open] = useState(false)

    return (
        <div className={`flex flex-col less_md:border border-gray-900 w-full overflow-y-auto h-fit`}>
            <div className="less_md:border-b border-gray-900 px-2">
                <button className="w-full md:hidden flex flex-row justify-between items-center h-12" onClick={()=>setlist_open(!list_open)}>
                    <span>{props.title}</span>
                    <VscTriangleDown transform={list_open ? 'rotate(180)' : ""}/>
                </button>
            </div>
            <div className={`less_md:my-1 ${list_open ? "" : "less_md:hidden"}`}>
                {props.children}
            </div>

        </div>
    )


}

export default MobileDropDown