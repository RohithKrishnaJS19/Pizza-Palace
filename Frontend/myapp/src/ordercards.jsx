import { useState } from "react";
import Orderitems from "./orderitems.jsx";
function Ordercards(props) {
    const items = props.orderdetails.items || []
    return (
        <div className="bg-blue-100 w-[80%] p-10 rounded-2xl mt-10 max-sm:w-[95%] max-sm:p-3 sm:max-lg:w-[95%]  sm:max-lg:p-5">
            <div className="flex justify-between max-sm:flex-col max-sm:gap-3">
                <div className="flex items-center gap-3">
                    <h1>Order ID:</h1>
                    <p className="font-bold text-xl max-sm:text-sm sm:max-lg:text-sm">{props.orderdetails._id}</p>
                </div>
                <div className="flex items-center gap-3">
                    <h1>Total Amount:</h1>
                    <p className="font-bold text-xl text-green-600">₹{props.orderdetails.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                    <h1>Payment Status:</h1>
                    <p className="text-green-600  font-bold">{props.orderdetails.payment_status}</p>
                </div>
            </div>
            <div className="border-t-2">
                <div className="mt-2 flex items-center gap-3">
                    <i className="fa-solid fa-circle-user text-2xl" style={{ color: "rgb(0, 211, 255)" }}></i>
                    <h1 className="font-bold text-2xl"> Customer Details</h1>
                </div>
                <div className="flex gap-10 py-2 max-sm:flex-wrap max-sm:gap-3">
                    <div className="flex gap-3">
                        <i className="fa-solid fa-user text-xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                        <h1>{props.orderdetails.name}</h1>
                    </div>
                    <div className="flex gap-3">
                        <i className="fa-solid fa-phone text-xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                        <h1>{props.orderdetails.phone}</h1>
                    </div>
                    <div className="flex gap-3">
                        <i className="fa-regular fa-envelope text-xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                        <h1>{props.orderdetails.email}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-location-dot text-xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <div className="flex">
                        <p>{props.orderdetails.address} , {props.orderdetails.city} - {props.orderdetails.pincode}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-bag-shopping text-2xl" style={{ color: "violet" }}></i>
                    <p className="font-bold text-2xl">items</p>
                </div>
                <div className="flex border-b-2 font-bold">
                    <h1 className="basis-[40%]">Items</h1>
                    <h1 className="basis-[20%] text-center">Quantity</h1>
                    <h1 className="basis-[20%] text-center">Price</h1>
                    <h1 className="basis-[20%] text-center">Total</h1>
                </div>
                {
                    items.map(function (item, index) {
                        return <Orderitems itemdetail={item} key={index}></Orderitems>
                    })
                }
                <div className="flex justify-between max-sm:flex-col">
                    <div className="flex items-center gap-3 mt-5">
                        <h1>Payment ID:</h1>
                        <p className="font-bold text-xl max-sm:text-sm sm:max-lg:text-sm">{props.orderdetails.razor_payment_id}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <h1>Delivery Status:</h1>
                        <p className="font-bold max-sm:text-sm sm:max-lg:text-sm">{props.orderdetails.delivery_status}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Ordercards;