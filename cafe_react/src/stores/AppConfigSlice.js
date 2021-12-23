import { createSlice } from "@reduxjs/toolkit"

export const AppConfigSlice = createSlice({
    name: "AppConfig",
    initialState: {
        site_name: "Simhi",
        table_size: 0
    },
    reducers:{
        setsite_name: (state, action) =>{
            state.site_name = action.payload
        },
        settable_size: (state, action) =>{
            state.table_size =  parseInt(action.payload)
        },
        setsite_config: (state, action) =>{
            state.site_name = action.payload.name
            state.table_size = action.payload.table_size  
        }
    }
})

export const { setsite_name, settable_size, setsite_config } = AppConfigSlice.actions
export default AppConfigSlice.reducer