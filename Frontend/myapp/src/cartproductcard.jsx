function Cartproductcard(props) {
    return (
        <div className="bg-[#F5F5F5] basis-[40%] ml-13 mb-10 p-3 rounded max-sm:basis-[80%] max-sm:ml-0 max-sm:mb-0 sm:max-lg:ml-11">
            <div>
                <img className="h-50 object-cover rounded-lg max-sm:h-45 sm:max-lg:h-40" src={props.product.imgurl}></img>
            </div>
            <div>
                <p className="font-bold text-xl">{props.product.name}</p>
                <p className="font-bold">₹ {props.product.amount}</p>
                <p>{props.product.category}</p>
            </div>
            <div className="flex justify-between items-center mt-3">
                <div className="flex">
                    <button onClick={function () {
                        props.handlequandec(props.product)
                    }
                    } className="bg-red-500 px-2 font-bold text-white rounded">-</button>
                    <p className="font-bold w-12 text-center">{props.product.quantity}</p>
                    <button onClick={function () {
                        props.handlequaninc(props.product)
                    }
                    } className="bg-red-500 px-2 font-bold text-white rounded">+</button>
                </div>
                <button onClick={function () {
                    props.handleremove(props.product)
                }
                } className="bg-red-500 py-1 px-4 font-bold text-white rounded mr-3">Remove</button>
            </div>
        </div>
    )
}
export default Cartproductcard;