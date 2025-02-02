export const GetLoadoutName=async()=>{
    try{
        const response = await fetch('http://localhost:4600/api/orders/loadout-name')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, names:[]}
        }
        console.log(data)
        return {success:true, error:false, message:'Successfull', names:data?.loadout}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, names:[]}
    }
}