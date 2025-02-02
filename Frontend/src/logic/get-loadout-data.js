export const GetLoadouts=async()=>{
    try{
        const response = await fetch('http://localhost:4600/api/orders/get-loadout')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, loadouts:[]}
        }
        return {success:true, error:false, message:'Successfull', loadouts:data?.loadouts}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, loadouts:[]}
    }
}