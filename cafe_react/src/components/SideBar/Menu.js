import { NavLink } from 'react-router-dom';
import LoginRequired from "components/LoginRequired"
import AdminRequired from 'components/AdminRequired'
import { useDispatch } from "react-redux"
import { logout } from "../../stores/UserSlice"

function Menu(props){
	const dispatch = useDispatch()

	function Logout_Handle(){
		dispatch(logout())
	}

    return(
        <nav onClick={()=>props.setMenuOpen(false)} className={`px-2 md:visible text-2xl ${props.MenuOpen ? "visible" : "invisible"}`}>
			<ul className="flex flex-col sidebar_menu">
				<li>
					<NavLink activeClassName="bg-gray-700 text-white" exact to={"/"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
						<label>Ana sayfa</label>
					</NavLink>
				</li>
				<LoginRequired menu="true">
					<AdminRequired>
						<li>
							<NavLink activeClassName="bg-gray-700 text-white" to={"/product_management"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
								<label>Ürün Yönetimi</label>
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="bg-gray-700 text-white" to={"/category_management"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
								<label>Kategori Yönetimi</label>
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="bg-gray-700 text-white" to={"/user_management"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
								<label>Kullanıcı Yönetimi</label>
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="bg-gray-700 text-white" to={"/cafe_management"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
								<label>İşletme Yönetimi</label>
							</NavLink>
							
						</li>
						<li>
							<NavLink activeClassName="bg-gray-700 text-white" to={"/old_orders"} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
								<label>Eski Siparişler</label>
							</NavLink>
							
						</li>
					</AdminRequired>
					<li>
						<button onClick={()=>Logout_Handle()} className="h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4">
							<label>Çıkış Yap</label>
						</button>
					</li>
				</LoginRequired>
			</ul>
		</nav>
    )
}

export default Menu