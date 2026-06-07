function Skeletonmessagecard() {
    return (
        <div className="bg-red-100 flex flex-col mt-5 basis-[48%] px-10 py-5 rounded-xl max-sm:px-7 max-sm:basis-[90%]">
            <div className="flex items-center gap-4 border-b py-2">
                <div className="h-6 w-24 bg-red-200 rounded"></div>
                <div className="h-6 w-40 bg-red-200 rounded"></div>
            </div>
            <div className="flex items-center gap-4 border-b py-2">
                <div className="h-6 w-20 bg-red-200 rounded"></div>
                <div className="h-6 w-32 bg-red-200 rounded"></div>
            </div>
            <div className="flex items-center gap-4 border-b py-2">
                <div className="h-6 w-20 bg-red-200 rounded"></div>
                <div className="h-6 w-48 bg-red-200 rounded"></div>
            </div>
            <div className="py-2">
                <div className="h-6 w-24 bg-red-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-red-200 rounded mb-2"></div>
                <div className="h-4 w-4/5 bg-red-200 rounded"></div>
            </div>
            <div className="flex justify-end">
                <div className="h-10 w-24 bg-red-200 rounded"></div>
            </div>
        </div>
    )
}
export default Skeletonmessagecard;