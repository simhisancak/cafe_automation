import { useSelector } from 'react-redux'

function AdminRequired (props){
    const { super_user } = useSelector( state => state.User)
    if (super_user){
        return (
            <>
                {props.children}
            </>
        )
    }
    else{
        return (
            <>
            </>
        )
    }

}

export default AdminRequired