import {Switch , Route} from "react-router-dom"
import Home from "./views/Home"
import UserManagement from "./views/UserManagement"
import CategoryManagement from "./views/CategoryManagement"
import ProductManagement from "./views/ProductManagement"
import CafeManagement from "./views/CafeManagement"
import Order from "./views/Order"
import LoginRequired from "./LoginRequired"
import AdminRequired from "./AdminRequired"
import OldOrders from "./views/OldOrders"

function Content(props){
    return(
        <main className="overflow-y-auto w-full h-full">
            <Switch >
                <LoginRequired>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <AdminRequired>
                        <Route exact path="/user_management">
                            <UserManagement/>
                        </Route>  
                        <Route exact path="/product_management">
                            <ProductManagement/>
                        </Route>
                        <Route exact path="/category_management">
                            <CategoryManagement/>
                        </Route>
                        <Route exact path="/cafe_management">
                            <CafeManagement/>
                        </Route>
                        <Route exact path="/old_orders">
                            <OldOrders/>
                        </Route>
                    </AdminRequired>
                    <Route exact path="/order/:table_id">
                        <Order/>
                    </Route>            
                </LoginRequired>
            </Switch>
        </main>
    )
}

export default Content