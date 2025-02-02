export const GenearteCoupon=async(discount)=>{
      if(!discount){
        return {success:false, error:true, message:"Discount is required"};
      }
      try {
        const response = await fetch('http://103.160.144.19:4600/api/product/generate-coupon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({discount:discount})
        });
        const data = await response.json();
        if(data?.error){
            return {success:false, error:true, message: data?.message}
        }
        return {success:true, error:false, message: data?.message}
      } catch (err) {
        console.log(err);
        return { success: false, error: true, message: err?.message };
      }
}