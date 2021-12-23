import { configureStore } from "@reduxjs/toolkit"
import AppConfigReducer from "./AppConfigSlice"
import UserReducer from "./UserSlice"

export default configureStore({
    reducer: {
        AppConfig: AppConfigReducer,
        User : UserReducer
    }
})