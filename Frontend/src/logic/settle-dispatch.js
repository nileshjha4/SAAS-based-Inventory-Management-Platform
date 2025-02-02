export const SettleDispatch=async(id, data)=>{
    if(!id){
        return {success:false, error:true, message:"Id not present"}
    }
    try{
        const response=await fetch('http://localhost:4600/api/orders/settle-dispatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:id, data:data})
        });
        const result=await response.json();
        if(result?.error){
            return {success:false, error:true, message:result?.message}
        }
        return {success:true, error:false, message:"Order settled successfully"};
    }catch(err){
        console.log(err)
        return {success:false, error:true, message:err?.message};
    }
}