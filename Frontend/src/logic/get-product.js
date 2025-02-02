export const GetProduct=async(searchTerm)=>{
    console.log(searchTerm)
    try{
        const response = await fetch(`http://localhost:4600/api/product/get/all?searchTerm=${searchTerm}`)
        const data = await response.json()
        if(data?.error){
            console.log(data?.error)
            return {success:false, error:true, message:data?.message, data:[]}
        }
        return {success:true, data:data?.data, error:false}
    }catch(err){
        console.log(err);
        return {success:false, error:true, message:"Server Error", data:[]}
    }
}