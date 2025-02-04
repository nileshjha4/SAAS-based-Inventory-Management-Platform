export const GeneratePostBillInvoice=async(id)=>{
    if(!id){
        return {success:false, error:true, message:'No id is present'}
    }
    try {
        const response = await fetch('http://103.160.144.19:4600/api/orders/generate-post-bill-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });
    
        if (response.ok) {
          const blob = await response.blob(); 
          const pdfUrl = URL.createObjectURL(blob); 
          return {
            success: true,
            error: false,
            data: { link: pdfUrl },
          };
        } else {
          const errorData = await response.json();
          return { success: false, error: true, message: errorData?.message || 'Failed to generate PDF' };
        }
      } catch (err) {
        console.log(err);
        return { success: false, error: true, message: err?.message };
      }
}