export const AssignAgent=async(ids)=>{
    if(!ids?.agent_id || !ids?.loadout_id){
        return {success:false, error:true, message:"Data missing"}
    }
    try{
        const response = await fetch('http://localhost:4600/api/orders/assign-agent',{
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