function Orderitems(props) {
    return (
        <div className="flex  border-b-2">
            <h1 className="basis-[40%]">{props.itemdetail.name}</h1>
            <h1 className="basis-[20%] text-center">{props.itemdetail.quantity}</h1>
            <h1 className="basis-[20%] text-center">{props.itemdetail.price}</h1>
            <h1 className="basis-[20%] text-center">{props.itemdetail.quantity * props.itemdetail.price}</h1>
        </div>
    )
}
export default Orderitems;