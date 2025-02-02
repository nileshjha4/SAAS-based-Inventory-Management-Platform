export const GetSummary = async()=>{
    try{
        const response = await fetch('http://localhost:4600/api/orders/get-summary')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, summaries:[]}
        }
        return {success:true, error:false, message:'Successfull', summaries:data?.summaries}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, summaries:[]}
    }
}