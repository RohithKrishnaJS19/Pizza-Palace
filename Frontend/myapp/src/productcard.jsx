function Productcard(props) {
    return (
<<<<<<< HEAD
        <div className="basis-[23%] bg-[#F5F5F5] rounded-lg p-3 max-sm:p-2 max-sm:basis-[48%] sm:max-lg:basis-[31%]">
=======
        <div className={`basis-[23%] bg-[#F5F5F5] rounded-lg p-3 max-sm:p-2  max-sm:basis-[48%] sm:max-lg:basis-[31%]`}>
>>>>>>> 7612c35 (Updated the Admin Logic)
            <div>
                {
                    props.isAdmin ? <input onChange={function (event) {
                        props.handlecheckbox(event, props.product)
                    }
                    } checked={props.product.availability} type="checkbox" className="w-5 h-5"></input> : ""
                }
            </div>
            <div>
                <img className="h-50 object-cover rounded-lg max-sm:h-30 sm:max-lg:h-40" src={props.product.imgurl}></img>
            </div>
            <div>
                <p className="font-bold text-xl max-sm:text-[16px]">{props.product.name}</p>
                <p className="font-bold">₹ {props.product.amount}</p>
                <p>{props.product.category}</p>
                <p>{props.product.rating}</p>
            </div>
            <div className={`flex ${props.isAdmin?"justify-between":"justify-end"}  mt-3 max-sm:items-center max-sm:flex-col max-sm:gap-2 sm:max-lg:flex-col sm:max-lg:gap-3`}>
                {
                    props.isAdmin?<div onClick={function () {
                    props.handleedit(props.product)
                }
                } className="flex gap-2 items-center border-2 border-blue-700 px-3 py-1 rounded max-sm:w-30">
                    <i className="fa-solid fa-pen text-blue-700"></i>
                    <button className="text-blue-700">Edit</button>
                </div>:""
                }
                <button onClick={function () {
                    props.addtocart(props.product)
                }
                } className="bg-red-500 py-1 px-4 font-bold text-white rounded mr-3 max-sm:mr-0 sm:max-lg:mr-0">Add to Cart</button>
            </div>
        </div>
    )
}
export default Productcard;
