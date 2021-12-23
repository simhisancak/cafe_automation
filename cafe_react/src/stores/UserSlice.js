import {  createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const UserSlice = createSlice({
    name: "User",
    initialState: {
        jwt_token: localStorage.getItem("jwt_token"),
        super_user: false,
        isauthenticated: false,
    },
    reducers:{
        setjwt_token: (state, action) =>{
            state.jwt_token =  action.payload
        },
        setsuper_user: (state, action) =>{
            state.super_user =  action.payload
        },
        setisauthenticated: (state, action) =>{
            state.isauthenticated =  action.payload
        },
        logout: (state =>{
            localStorage.removeItem("jwt_token")
            if(state.jwt_token){
                axios.post("/delete_token")
            }
            delete axios.defaults.headers.common['Authorization']
            state.jwt_token = null
            state.super_user = false
            state.isauthenticated = false
        }),
        clear_user_data: (state =>{
            localStorage.removeItem("jwt_token")
            delete axios.defaults.headers.common['Authorization']
            state.jwt_token = null
            state.super_user = false
            state.isauthenticated = false
        }),
    }
})

export const { setjwt_token, setsuper_user, setisauthenticated, logout, clear_user_data } = UserSlice.actions
export default UserSlice.reducer

