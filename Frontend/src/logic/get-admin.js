export const GetAdmin=async(token)=>{
    if(!token){
        return {message:"Token is required", error:true, success:false};
    }
    try{
        const response = await fetch('http://103.160.144.19:4600/get-admin',{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':token
            },
        })
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, admin:{}}
        }
        return {success:true, error:false, message:'Successfull', admin:data?.admin}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, admin:{}}
    }
}