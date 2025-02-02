export const NewAddAgent=async(data)=>{
    try{
        const response = await fetch(`http://103.160.144.19:4600/api/user/add-agent`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        if(resData?.error){
            return {success:false, error:true, message: resData?.message}
        }
        return {success:true, error:false, message:'Successfull', agent:resData?.agent}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err}
    }
}