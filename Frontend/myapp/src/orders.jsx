import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import Ordercards from "./ordercards"
import axios from "axios"
import { signOut } from "firebase/auth"

function Order() {
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    const [uid, setuid] = useState("")

    useEffect(function () {
        onAuthStateChanged(auth, function (user) {
            if (user) {
                setusername(user.displayName)
                setuseremail(user.email)
                setuid(user.uid)
            }
        })
    }, [])

    const [ordetails, setordetails] = useState([])
    useEffect(function () {
        if (!uid) return
        async function handleorderdetails() {
            const orderdetails = await axios.post(`${API_URL}/orderdetails`, { uid: uid })
            setordetails(orderdetails.data)
        }
        handleorderdetails()
    }, [uid])

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

    function handleorder() {
        navigate("/order")
    }

    // Profile slider
    const [slideprofile, setslideprofile] = useState(false)
    const [username, setusername] = useState()
    const [useremail, setuseremail] = useState()
    function handleprofile() {
        setslideprofile(!slideprofile)
    }


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
            <div className="mt-18 items-center flex flex-col mb-10">
                {
                    ordetails.length === 0 ?
                        <p className="font-bold text-3xl mt-10">No Orders Found</p> :
                        ordetails.map(function (item, index) {
                            return <Ordercards orderdetails={item} key={index}></Ordercards>
                        })
                }
            </div>
        </>
    )
}
export default Order;