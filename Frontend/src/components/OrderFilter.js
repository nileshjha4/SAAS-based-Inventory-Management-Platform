const OrderFilter = ({filters, handleDateChange, setFilters}) => { 
    return( 
        <div className="flex space-x-4 items-center mb-6"> 
                <div>
                    <label className="block text-gray-700 mb-1" htmlFor="shopName">
                        Shop Name
                    </label>
                    <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        value={filters?.shopname}
                        onChange={(e)=>{
                            setFilters((prevFilters)=>({...prevFilters, shopname: e.target.value}))
                        }}
                        className="px-3 py-2 border rounded-md"
                        placeholder="Enter shop name"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1" htmlFor="startDate"> 
                        Start Date 
                    </label> 
                    <input 
                        type="date" 
                        id="startDate" 
                        name="startDate" 
                        value={filters?.startDate} 
                        onChange={handleDateChange} 
                        className="px-3 py-2 border rounded-md" 
                    /> 
                </div> 
                <div> 
                    <label className="block text-gray-700 mb-1" htmlFor="endDate"> 
                        End Date 
                    </label> 
                    <input 
                        type="date" 
                        id="endDate" 
                        name="endDate" 
                        value={filters.endDate} 
                        onChange={handleDateChange} 
                        className="px-3 py-2 border rounded-md" 
                    /> 
                </div> 
            </div> 
    ) 
} 

export default OrderFilter