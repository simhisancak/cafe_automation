function PageLoading(){
    return (
        <div className="management_modal">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="flex justify-center items-center flex-col z-10 ">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300 mb-4"></div>
                Yükleniyor...
            </div>
        </div>
    )
}

export default PageLoading

