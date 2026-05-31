import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import { signOut } from "firebase/auth"

function Addproducts() {
    const navigate = useNavigate()

    useEffect(function () {
        onAuthStateChanged(auth, function (user) {
            setusername(user.displayName)
            setuseremail(user.email)
        })
    }, [])

    // Show menu
    const [showmenu, setshowmenu] = useState(false)
    function handlemenu() {
        setshowmenu(true)
    }
    function handleclosemenu() {
        setshowmenu(false)
    }

    function handlenavmenu() {
        navigate("/home")
    }

    function handlecontact() {
        navigate("/contact")
    }

    // Signout
    function handlelogout() {
        signOut(auth)
    }

    // Profile slider
    const [slideprofile, setslideprofile] = useState(false)
    const [username, setusername] = useState()
    const [useremail, setuseremail] = useState()
    function handleprofile() {
        setslideprofile(!slideprofile)
    }

    function handleorder() {
        navigate("/order")
    }

    function handlecopystar()
    {
        navigator.clipboard.writeText("⭐");
    }
    return (
        <>
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl sm:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:gap-5">
                    <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                    <p className="cursor-pointer" onClick={handlenavmenu}>Menu</p>
                    <p className="cursor-pointer" onClick={handlecontact}>Contact</p>
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                </div>
                <div className="flex gap-10 items-center max-sm:gap-5">
                    <div className="relative">
                        <i onClick={handleprofile} className="fa-regular fa-circle-user text-2xl cursor-pointer mr-8 max-sm:mr-2 max-sm:text-2xl sm:max-lg:text-3xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                        <div className={` border border-black bg-white p-5 absolute top-10 rounded-2xl flex flex-col gap-3 duration-600 ${slideprofile ? "right-3" : "-right-96"}`}>
                            <div className="flex gap-3"><p className="font-bold">Name:</p>{username}</div>
                            <div className="flex gap-3"><p className="font-bold">Email:</p>{useremail}</div>
                            <div className="flex justify-end">
                                <button onClick={handlelogout} className="bg-red-500 text-white px-3 py-2 rounded cursor-pointer font-bold">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={` bg-white font-bold text-xl rounded-br-2xl fixed z-20 flex flex-col h-60 w-60 justify-center items-center gap-5 duration-500 ${showmenu ? "left-0" : "-left-[80%]"}`}>
                <i onClick={handleclosemenu} className="cursor-pointer fa-solid fa-xmark font-bold text-2xl absolute top-3 left-3" style={{ color: "red" }}></i>
                <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                <p className="cursor-pointer" onClick={handlenavmenu}>Menu</p>
                <p className="cursor-pointer" onClick={handlecontact}>Contact</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
            </div>
            <div className="bg-white w-full h-[100%] flex justify-center ">
                <div className="bg-red-100  mt-30 mb-15 rounded-2xl flex flex-col justify-center items-center gap-3 p-10 max-sm:mt-15  max-sm:mb-15">
                    <h1 className="font-bold text-3xl">New Pizza Details</h1>
                    <div>
                        <p className="font-bold">Name</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter pizza name"></input>
                    </div>
                    <div>
                        <p className="font-bold">Amount</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter the amount"></input>
                    </div>
                    <div className="w-full flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3 sm:max-lg:flex-col sm:max-lg:items-start sm:max-lg:gap-3">
                        <div>
                            <p className="font-bold">Category</p>
                            <select className="bg-[#F5F5F5] border-2 px-2 py-2 outline-none text-xl rounded">
                                <option>Veg</option>
                                <option>Non-veg</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <p className="font-bold">Rating</p><p className="text-sm text-red-600">(format: ⭐⭐⭐ 3.5 ,Use full stars only (4.9→⭐⭐⭐⭐,2.9→⭐⭐))</p>
                            </div>              
                            <input className="border-2 w-80 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-100" placeholder="Enter Product Rating"></input>
                        </div>
                        <div>
                            <p className="text-center text-2xl">⭐</p>
                            <button onClick={handlecopystar} className="bg-blue-700 text-white px-3 py-2 rounded"><i className="fa-regular fa-copy" style={{ color: "rgb(255, 255, 255)" }}></i>Copy</button>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold">Image URL</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter product image URL"></input>
                    </div>
                    <div className="w-[100%]">
                        <button className="bg-blue-600 font-bold text-white px-6 py-4 rounded flex items-center gap-2">Add Product</button>
                    </div>
                </div>
            </div>
        </>

    )
}
export default Addproducts;