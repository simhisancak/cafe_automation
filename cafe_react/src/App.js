import SideBar from "components/SideBar"
import Content from "components/Content"
import { BrowserRouter as Router } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useState, useEffect } from "react"
import { setsite_config } from "stores/AppConfigSlice"
import axios from "axios"
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
function SiteLoading(){
  return (
      <div className="management_modal">
          <div className="absolute bg-black inset-0 z-0"></div>
          <div className="flex justify-center items-center flex-col z-10 ">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300 mb-4"></div>
              Yükleniyor...
          </div>
      </div>
  )
}


function App() {
  const dispatch = useDispatch()
  const [isLoading, setisLoading] = useState(true)

  async function get_site_config() {
    axios.post("/get_site_config").then(resp => {
        const data = resp.data
        if (data){
            if(data.status === "succes"){
              dispatch(setsite_config(data))
            }
        }
    }).catch(error => {
        console.log(error)
    }).then(()=>setisLoading(false))
  }
  useEffect(() => { if(isLoading){get_site_config()} }, [])// eslint-disable-line react-hooks/exhaustive-deps

  return isLoading ? <SiteLoading/> : (
    <Router>
      <div className="wrapper md:flex flex-col md:flex-row md:min-h-screen w-full">
        <SideBar/>
        <Content/>
      </div>
    </Router>
  );
}

export default App;
