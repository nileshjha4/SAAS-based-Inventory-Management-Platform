export const GetCoupons=async()=>{
    try{
        const response = await fetch('http://103.160.144.19:4600/api/product/get-coupon')
        const data = await response.json()
        if(data?.error){
            return {success:false, error:true, message: data?.message, coupons:[]}
        }
        return {success:true, error:false, message:'Successfull', coupons:data?.coupons}
    }catch(err){
        console.log(err)
        return {success:false, error:true, message: err, coupons:[]}
    }
}