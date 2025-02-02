import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Package, Calendar, User, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { GeneratePostBillInvoice } from "../logic/generate-post-bill-invoice";

const SummaryDetails = ({ summary }) => {
    console.log(summary)
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const { mutateAsync: generatePostBillInvoice } = useMutation({
    mutationFn: (id) => GeneratePostBillInvoice(id),
    onSuccess: (data) => {
      if (data?.success) {
        console.log("PDF download started");
        const pdfLink = data?.data?.link;
        const link = document.createElement('a');
        link.href = pdfLink;
        link.download = pdfLink.split('/').pop(); 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
      }
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} />
              <p className="text-sm">{formatDate(summary.order_date)}</p>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {summary.userId?.name || "Unknown Customer"}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <DollarSign size={16} />
              <p className="font-medium">${summary.total_amt}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            onClick={async() => {
                await generatePostBillInvoice(summary?._id)
            }}
            >
              <FileText size={16} className="mr-2" />
              Download Invoice
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4">
              {summary.orders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.item_id.item}</p>
                        <p className="text-sm text-gray-500">{order.item_id.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Flavor: {order.item_id.flavour}</p>
                        <p className="text-sm text-gray-500">Quantity: {order.qty}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-sm text-gray-500">{order.item_id.description}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          Amount: ${order.sum_amt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="text-gray-500">
                <p className="text-sm">Total Amount</p>
                <p className="text-xs">Including all items</p>
              </div>
              <p className="text-2xl font-semibold text-gray-900">${summary.total_amt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryDetails;