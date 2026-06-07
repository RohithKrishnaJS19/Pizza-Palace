function Skeletonproductcard() {
    return (
        <div className="basis-[23%] bg-[#F5F5F5] rounded-lg p-3 animate-pulse max-sm:p-2 max-sm:h-[300px] max-sm:basis-[48%] sm:max-lg:basis-[31%]">
            <div className="h-5 w-5 bg-gray-300 rounded mb-2"></div>
            <div className="h-50 bg-gray-300 rounded-lg max-sm:h-30 sm:max-lg:h-40"></div>
            <div className="mt-3">
                <div className="h-6 bg-gray-300 rounded w-[80%] mb-2"></div>
                <div className="h-5 bg-gray-300 rounded w-[40%] mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-[50%] mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-[30%]"></div>
            </div>
            <div className="flex justify-end mt-3 max-sm:justify-center">
                <div className="h-8 w-28 bg-gray-300 rounded"></div>
            </div>

        </div>
    )
}
export default Skeletonproductcard;