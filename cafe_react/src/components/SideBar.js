import Menu from "components/SideBar/Menu"
import { NavLink, useHistory } from "react-router-dom"
import { useState } from "react"
import { VscTriangleDown } from "react-icons/vsc"
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp } from "react-icons/io5"
import { useSelector } from "react-redux"

function SideBar(props){
    const [MenuOpen, setMenuOpen] = useState(false)
    const history = useHistory()
    const { site_name } = useSelector(state => state.AppConfig)
    return(
        <aside className={`flex flex-col justify-between w-full md:w-48 text-gray-400 bg-gray-900 flex-shrink-0 md:pt-6 pt-3  md:h-full md:overflow-y-auto ${MenuOpen ? "less_md:h-full less_md:absolute overflow-y-auto" : "less_md:h-12 "}`}>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <NavLink exact to={"/"} className="mb-7 px-6">
                        <span>{site_name}</span>
                    </NavLink>
                    <div onClick={()=>setMenuOpen(!MenuOpen)} className="md:hidden  focus:outline-none mb-7 px-6">
                        <VscTriangleDown transform={MenuOpen ? 'rotate(180)' : ""}/>
                    </div>
                </div>
                <Menu MenuOpen={MenuOpen} setMenuOpen={setMenuOpen} />
            </div>
            <div className="less_md:hidden text-4xl flex flex-row justify-center gap-x-5 pb-2">
                <button onClick={()=>history.goBack()} ><IoChevronBackCircleSharp/></button>
                <button onClick={()=>history.goForward()}><IoChevronForwardCircleSharp/></button>
            </div>
        </aside>
    )
}

export default SideBar