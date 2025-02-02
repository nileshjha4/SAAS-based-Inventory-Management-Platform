export const GetAgentData=async()=>{
    try{
        const response = await fetch('http://103.160.144.19:4600/api/orders/get-agent')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, agents:[]}
        }
        return {success:true, error:false, message:'Successfull', agents:data?.agents}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, agents:[]}
    }
}