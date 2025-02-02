export const GetOrders=async(filters)=>{
    console.log(filters)
    const queryParams = new URLSearchParams(filters).toString();
    try{
        const response = await fetch(`http://localhost:4600/api/orders/all?${queryParams}`)
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, orders:[]}
        }
        return {success:true, error:false, message:'Successfull', orders:data?.orders}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, orders:[]}
    }
}