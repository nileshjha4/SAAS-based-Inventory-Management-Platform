export const GetUsers=async(filters)=>{
    console.log(filters)
    const queryParams = new URLSearchParams(filters).toString();
    try{
        const response = await fetch(`http://localhost:4600/api/user/get/all?${queryParams}`)
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, users:[]}
        }
        return {success:true, error:false, message:'Successfull', users:data?.users}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, users:[]}
    }
}