function Messagecard(props) {
    return (
        <div className="bg-red-100 flex flex-col   mt-5 basis-[48%] px-10 py-5 rounded-xl max-sm:px-7 max-sm:basis-[90%]" >
            <div className="flex max-sm:flex-wrap max-sm:items-start items-center gap-4 border-b py-2">
                <h1 className="text-xl font-bold text-red-500">User id:</h1>
                <p className="font-bold">{props.message.uid}</p>
            </div>
            <div className="flex max-sm:flex-wrap max-sm:items-start items-center gap-4 border-b py-2">
                <h1 className="text-xl font-bold text-red-500">Name:</h1>
                <p className="font-bold">{props.message.name}</p>
            </div>
            <div className="flex max-sm:flex-wrap max-sm:items-start items-center gap-4 border-b py-2">
                <h1 className="text-xl font-bold text-red-500">Email:</h1>
                <p className="font-bold">{props.message.email}</p>
            </div>
            <div className="items-center gap-4 py-2">
                <h1 className="text-xl font-bold text-red-500">Message:</h1>
                <p className="font-bold">{props.message.message}</p>
            </div>
            <div className="flex justify-end">
                <button onClick={function()
                    {
                        props.handledelete(props.message._id)
                    }
                } className="font-bold text-white bg-red-500 px-5 py-2 rounded">Delete</button>
            </div>
        </div>
    )
}
export default Messagecard;