import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"

function Contact() {
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

    const [name, setname] = useState()
    const [email, setemail] = useState()
    const [phone, setphone] = useState()
    const [message, setmessage] = useState()
    return (
        <>
            {/* Navbar */}
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl sm:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:gap-5">
                    <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                    <p className="cursor-pointer" onClick={handlenavmenu}>Menu</p>
                    <p className="cursor-pointer">Contact</p>
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
            <div className="bg-white w-full h-[100%] flex justify-center">
                <div className="bg-red-500  mt-30 mb-15 rounded-2xl flex flex-col justify-center items-center gap-3 p-10 max-sm:mt-15 max-sm:mb-10">
                    <h1 className="font-bold text-3xl">Send Us a Message</h1>
                    <div>
                        <p className="font-bold">Full Name</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter your name"></input>
                    </div>
                    <div>
                        <p className="font-bold">Email Address</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter your email"></input>
                    </div>
                    <div>
                        <p className="font-bold">Phone Number</p>
                        <input className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter your phone number"></input>
                    </div>
                    <div>
                        <p className="font-bold">Message</p>
                        <textarea className="border-2 w-200 h-40 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Type your message here..."></textarea>
                    </div>
                    <div className="w-[100%]">
                        <button className="bg-blue-600 font-bold text-white px-6 py-4 rounded flex items-center gap-2"><i className="fa-solid fa-paper-plane" style={{ color: "rgb(255, 255, 255)" }}></i>Send Message</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Contact;