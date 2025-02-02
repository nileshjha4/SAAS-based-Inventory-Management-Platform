export const CheckAvailability=async(ids)=>{
    if(!ids){
        return {message:"id is required", success:false, error:true};
    }
    try{
        const response = await fetch('http://localhost:4600/api/orders/check-availability',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(ids),
        })
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message}
        }
        console.log(data)
        return {success:true, error:false, message:'Successfull'}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err}
    }
}