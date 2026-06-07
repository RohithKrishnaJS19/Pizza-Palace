function Skeletonordercard() {
    return (
        <div className="bg-blue-100 w-[80%] p-10 rounded-2xl mt-10 max-sm:w-[95%] max-sm:p-3 sm:max-lg:w-[95%] sm:max-lg:p-5">
            <div className="flex justify-between max-sm:flex-col max-sm:gap-3">
                <div className="h-6 w-64 bg-blue-200 rounded"></div>
                <div className="h-6 w-32 bg-blue-200 rounded"></div>
                <div className="h-6 w-40 bg-blue-200 rounded"></div>
            </div>
            <div className="border-t-2 mt-4 pt-4">
                <div className="h-8 w-56 bg-blue-200 rounded mb-4"></div>
                <div className="flex gap-10 py-2 max-sm:flex-wrap">
                    <div className="h-5 w-32 bg-blue-200 rounded"></div>
                    <div className="h-5 w-36 bg-blue-200 rounded"></div>
                    <div className="h-5 w-48 bg-blue-200 rounded"></div>
                </div>
                <div className="h-5 w-full bg-blue-200 rounded mt-2"></div>
            </div>
            <div className="mt-5">
                <div className="h-8 w-32 bg-blue-200 rounded mb-4"></div>
                <div className="flex border-b-2 pb-2">
                    <div className="basis-[40%] h-5 bg-blue-200 rounded mr-2"></div>
                    <div className="basis-[20%] h-5 bg-blue-200 rounded mx-2"></div>
                    <div className="basis-[20%] h-5 bg-blue-200 rounded mx-2"></div>
                    <div className="basis-[20%] h-5 bg-blue-200 rounded ml-2"></div>
                </div>
                {[1, 2, 3].map(function (item) {
                    <div key={item} className="flex py-3">
                        <div className="basis-[40%] h-5 bg-blue-200 rounded mr-2"></div>
                        <div className="basis-[20%] h-5 bg-blue-200 rounded mx-2"></div>
                        <div className="basis-[20%] h-5 bg-blue-200 rounded mx-2"></div>
                        <div className="basis-[20%] h-5 bg-blue-200 rounded ml-2"></div>
                    </div>
                })}
                <div className="flex justify-between mt-5 max-sm:flex-col gap-3">
                    <div className="h-6 w-72 bg-blue-200 rounded"></div>
                    <div className="h-6 w-40 bg-blue-200 rounded"></div>
                </div>
            </div>

        </div>
    )
}
export default Skeletonordercard;