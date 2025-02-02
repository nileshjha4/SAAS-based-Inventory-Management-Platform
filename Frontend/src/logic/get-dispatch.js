export const GetDispatch=async()=>{
    try{
        const response = await fetch('http://localhost:4600/api/orders/get-dispatch')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, dispatch:[]}
        }
        return {success:true, error:false, message:'Successfull', dispatch:data?.data}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, dispatch:[]}
    }
}