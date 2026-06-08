function Usercard(props) {
    return (
        <div className="flex border-1 w-[60%] rounded justify-between items-center p-3 mt-3 max-sm:flex-col max-sm:w-[80%] max-sm:gap-2 sm:max-lg:mt-5 sm:max-lg:w-[100%]">
            <i className="fa-solid fa-circle-user text-green-500 text-3xl"></i>
            <h1 className="text-xl font-bold">{props.item.name}</h1>
            <p>{props.item.email}</p>
            <button className="font-bold px-4 py-1 bg-green-100 text-green-500 rounded-4xl">Admin</button>
        </div>
    )
}
export default Usercard;