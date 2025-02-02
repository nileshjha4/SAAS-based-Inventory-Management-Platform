export const UpdateLoadout=async(item)=>{
    if(!item){
        return {success:false, error:true, message:"Data is missing"}
    }
    try{
        const response = await fetch('http://103.160.144.19:4600/api/orders/update-loadout',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message}
        }
        return {success:true, error:false, message:'Successfull'}
    }catch(error){
        return {success:false, error:true, message:error?.message}
    }
}