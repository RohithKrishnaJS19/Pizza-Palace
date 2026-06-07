import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import Messagecard from "./messagecard"
import { signOut } from "firebase/auth"
import { useLocation } from "react-router-dom"
import Skeletonmessagecard from "./Skeletonmessagecard"

function Message() {
    const navigate = useNavigate()
    const location = useLocation()
    const ADMIN = import.meta.env.VITE_ADMIN_UID
    const API_URL = import.meta.env.VITE_API_URL
    const [delmsg, setdelmsg] = useState(false)
    const [isAdmin, setisAdmin] = useState(false)
    const [loading, setloading] = useState(false)
    useEffect(function () {
        const unsubscribe = onAuthStateChanged(auth, function (user) {
            if (!user || user.uid != ADMIN) {
                navigate("/home")
                return
            }
            if (user.uid === ADMIN) {
                setisAdmin(true)
                setusername(user.displayName)
                setuseremail(user.email)
            }
        })
        return function () {
            unsubscribe()
        }
    }, [])

    const [messages, setmessages] = useState([])
    useEffect(function () {
        async function getdata() {
            setloading(true)
            try {
                const retdata = await axios.get(`${API_URL}/getmessage`)
                setmessages(retdata.data)
            }
            catch {
                alert("Something Went Wrong")
            }
            finally {
                setloading(false)
            }
        }
        getdata()
    }, [delmsg])

    // Show menu
    const [showmenu, setshowmenu] = useState(false)
    function handlemenu() {
        setshowmenu(true)
    }
    function handleclosemenu() {
        setshowmenu(false)
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


    async function handledelete(id) {
        try {
            const retdata = await axios.post(`${API_URL}/deletemsg`, { id: id })
            if (retdata.data) {
                setdelmsg(function (prev) {
                    return !prev
                })
            }
            else {
                alert("Message Not deleted")
            }
        }
        catch {
            alert("Server Error")
        }
    }

    function handlemessage() {
        navigate("/message")
    }

    function handleaddproducts() {
        navigate("/addproducts")
    }

    function handlehome() {
        navigate("/home")
    }

    const msg = [1, 2, 3, 4]
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
                    <p className="cursor-pointer" onClick={handlehome}>Home</p>
                    <p className={`cursor-pointer pb-1 ${location.pathname === "/message" ? "border-b-2 border-red-500 text-red-500" : ""}`} onClick={handlemessage}>Message</p>
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                    {isAdmin ? <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> : ""}
                </div>
                <div className="flex gap-10 items-center max-sm:gap-5">
                    <div className="max-sm:hidden invisible">
                        <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                    </div>
                    <div className="max-sm:hidden invisible">
                        <i className="fa-solid fa-cart-shopping text-2xl"></i>
                    </div>
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
                <p className="cursor-pointer" onClick={handlehome}>Home</p>
                <p className="cursor-pointer" onClick={handlemessage}>Message</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p>
            </div>
            <div className="flex justify-center">
                <div className=" w-[80%] flex flex-wrap mt-25 mb-10 gap-10 max-sm:w-[100%] max-sm:justify-center">
                    {
                        loading ? msg.map(function (item, index) {
                            return <Skeletonmessagecard key={index}></Skeletonmessagecard>
                        }) :
                            messages.length === 0 ?
                                <div className="flex flex-col justify-center items-center w-full min-h-[500px] gap-3">
                                    <img className="w-60" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1780756657/comment_zurqkd.png"}></img>
                                    <p className="font-bold text-2xl">No Message Received</p>
                                </div> :
                                messages.map(function (item, index) {
                                    return <Messagecard key={index} message={item} handledelete={handledelete}></Messagecard>
                                })
                    }
                </div>
            </div>
        </>
    )
}
export default Message;