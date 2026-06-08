import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import { useLocation } from "react-router-dom"
import { signOut } from "firebase/auth"

function Contact() {
    const navigate = useNavigate()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [uid, setuid] = useState("")
    const location = useLocation()
    const API_URL=import.meta.env.VITE_API_URL

    useEffect(function () {
        const unsubscribe = onAuthStateChanged(auth, function (user) {
            if (user) {
                setusername(user.displayName)
                setuseremail(user.email)
                setname(user.displayName)
                setemail(user.email)
                setuid(user.uid)
            }
        })
        return function () {
            unsubscribe()
        }
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

    const [message, setmessage] = useState()
    function handlemessage(event) {
        setmessage(event.target.value)
    }

    function handlesend() {
        axios.post(`${API_URL}/message`, { uid: uid, name: name, email: email, message: message }).
            then(function (retdata) {
                if (retdata.data) {
                    alert("Message Sended Successfully")
                    setmessage("")
                }
                else {
                    alert("Message Not Sended")
                }
            }).catch(function (err) {
                alert(err)
            })
    }

    return (
        <>
            {/* Navbar */}
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl lg:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden sm:max-lg:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:hidden">
                    <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                    <p  className={`cursor-pointer pb-1 ${location.pathname === "/contact" ? "border-b-2 border-red-500 text-red-500" : ""}`} onClick={handlecontact}>Contact</p>
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
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
                <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                <p className="cursor-pointer" onClick={handlecontact}>Contact</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
            </div>
            <div className="bg-white w-full h-[100%] flex justify-center">
                <div className="bg-[#f4bcbc] mt-30 mb-15 rounded-2xl flex flex-col justify-center max-sm:justify-start gap-3 p-10 max-sm:mt-15 max-sm:mb-10">
                    <h1 className="font-bold text-3xl">How Can We Help you?</h1>
                    <p>We're here to help! Share your query, complaint, or feedback.</p>
                    <p>Our team will get back to you <span className="text-red-500">via email</span> as soon as possible.</p>
                    <div>
                        <p className="font-bold text-2xl mb-3">Message</p>
                        <textarea onChange={handlemessage} value={message} className="border-2 w-200 h-60 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 max-sm:h-90 sm:max-lg:w-170" placeholder="Describe your query, complaint, or feedback here..."></textarea>
                    </div>
                    <div className="w-[100%]">
                        <button onClick={handlesend} className="bg-red-500 font-bold text-white px-6 py-4 rounded flex items-center gap-2"><i className="fa-solid fa-paper-plane" style={{ color: "rgb(255, 255, 255)" }}></i>Submit Request</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Contact;