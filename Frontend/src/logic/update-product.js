export const UpdateGivenProduct=async(data)=>{
    if(!data){
        return {success:false, error:true, message: 'Data not present'};
    }
    try{
        const response=await fetch('http://103.160.144.19:4600/api/product/update',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data),
        })
        const result=await response.json();
        if(result?.success){
            return {success:true, error:false, message:result?.message};
        }
        return {success:false, error:true, message:result?.message};
    }catch(err){
        console.log(err)
        return {success:false, error:true, message:err}
    }
}