import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import { signOut } from "firebase/auth"
import axios from "axios"
import { useLocation } from "react-router-dom"
import Usercard from "./Usercard"

function Manageadmin() {
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL
    const [token, settoken] = useState("")
    const location = useLocation()
    const [owner, setowner] = useState(false)
    useEffect(function () {
        onAuthStateChanged(auth, async function (user) {
            if (user) {
                const tokenResult = await user.getIdTokenResult()
                if (tokenResult.claims.owner) {
                    setowner(true)
                } else {
                    setowner(false)
                }
                setusername(user.displayName)
                setuseremail(user.email)
                const idToken = await user.getIdToken()
                settoken(idToken)
            }
            else {
                navigate("/")
            }
        })
    }, [])

    const [adminusers, setadminusers] = useState([])
    useEffect(function () {
        getdata()
    },[])

    async function getdata() {
        const retdata = await axios.get(`${API_URL}/getadminusers`)
        if (retdata.data) {
            setadminusers(retdata.data)
        }
        else {
            alert("Cannot able to fetch admins")
        }
    }

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

    function handlemessage() {
        navigate("/message")
    }

    function handleaddproducts() {
        navigate("/addproducts")
    }

    function handlemanageadmin() {
        navigate("/manageadmin")
    }

    const [addadmin, setaddadmin] = useState("")
    function handleinputaddadmin(event) {
        setaddadmin(event.target.value)
    }

    const [removeadmin, setremoveadmin] = useState("")
    function handleinputremoveadmin(event) {
        setremoveadmin(event.target.value)
    }

    const [addEwarn, setaddEwarn] = useState(false)
    const [removeEwarn, setremoveEwarn] = useState(false)
    // Function Add Admin
    async function handleaddadmin() {
        setaddEwarn(false)
        if (addadmin.length > 5) {
            const retdata = await axios.post(`${API_URL}/addadmin`, { token: token, email: addadmin })
            if (retdata.data) {
                alert("Admin role assigned successfully")
                getdata()
                setaddadmin("")
            }
            else {
                alert("Something went wrong, Please try again")
            }
        }
        else {
            if (addadmin.length < 6) {
                setaddEwarn(true)
            }
        }

    }

    // Function Remove Admin
    async function handleremoveadmin() {
        setremoveEwarn(false)
        if (removeadmin.length > 5) {
            const retdata = await axios.post(`${API_URL}/removeadmin`, { token: token, email: removeadmin })
            if (retdata.data) {
                alert("Admin role removed successfully")
                getdata()
                setremoveadmin("")
            }
            else {
                alert("Something went wrong, Please try again")
            }
        }
        else {
            if (removeadmin.length < 6) {
                setremoveEwarn(true)
            }
        }
    }


    return (
        <>
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl lg:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden sm:max-lg:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:hidden">
                    <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                    <p className="cursor-pointer" onClick={handlemessage}>Message</p>
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                    <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p>
                    {owner ? <p onClick={handlemanageadmin} className={`cursor-pointer pb-1 ${location.pathname === "/manageadmin" ? "border-b-2 border-red-500 text-red-500" : ""}`}>Manage Admin</p> : ""}
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
                            <div className="flex">
                                <button onClick={handlenavmenu} className="bg-blue-500 text-white px-7 py-2 rounded cursor-pointer font-bold">Change Password</button>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handlelogout} className="bg-red-500 text-white px-3 py-2 rounded cursor-pointer font-bold">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={` bg-white font-bold text-xl rounded-br-2xl fixed z-20 flex flex-col h-80 w-60 justify-center items-center gap-5 duration-500 ${showmenu ? "left-0" : "-left-[80%]"}`}>
                <i onClick={handleclosemenu} className="cursor-pointer fa-solid fa-xmark font-bold text-2xl absolute top-3 left-3" style={{ color: "red" }}></i>
                <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                <p className="cursor-pointer" onClick={handlemessage}>Message</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p>
                {owner ? <p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
            </div>
            <div className="flex justify-center">
                <div className="w-[80%] mt-30 flex gap-5 max-sm:flex-col max-sm:w-[90%]">
                    <div className="w-[50%] border-2 rounded-xl p-7 flex flex-col gap-2 max-sm:w-[100%]">
                        <div className="flex items-center gap-5">
                            <i className="fa-solid fa-user-shield text-green-500 text-3xl"></i>
                            <div>
                                <h1 className="text-2xl font-bold">Add Admin</h1>
                                <p className="text-sm">Enter the email adress of the user you</p>
                                <p className="text-sm">want to make admin</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="font-bold">User Email</h1>
                            <div className="border p-2 w-[100%]">
                                <input value={addadmin} onChange={handleinputaddadmin} type="email" placeholder="Enter User email" className="outline-none w-[100%]"></input>

                            </div>
                            {
                                addEwarn ? <p className="text-red-500">Enter a valid email</p> : ""
                            }
                            <button onClick={handleaddadmin} className="bg-green-500 w-[100%] py-2 rounded text-white font-bold"><i className="fa-solid fa-user-plus text-white mr-2"></i> Add Admin</button>
                        </div>
                    </div>
                    <div className="w-[50%] border-2 rounded-xl p-7 flex flex-col gap-2 max-sm:w-[100%]">
                        <div className="flex items-center gap-5">
                            <i className="fa-solid fa-user-shield text-red-500 text-3xl"></i>
                            <div>
                                <h1 className="text-2xl font-bold">Remove Admin</h1>
                                <p className="text-sm">Enter the email adress of the user to remove</p>
                                <p className="text-sm">admin privileges</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="font-bold">User Email</h1>
                            <div className="border p-2 w-[100%]">
                                <input value={removeadmin} onChange={handleinputremoveadmin} type="email" placeholder="Enter User email" className="outline-none w-[100%]"></input>
                            </div>
                            {
                                removeEwarn ? <p className="text-red-500">Enter a valid email</p> : ""
                            }
                            <button onClick={handleremoveadmin} className="bg-red-500 w-[100%] py-2 rounded text-white font-bold"><i className="fa-solid fa-user-minus text-white mr-2"></i> Remove Admin</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-[80%] mt-10 flex flex-col">
                    <h1 className="text-2xl text-green-500 font-bold">Current Admins</h1>
                    <div className="flex flex-col max-sm:mb-20 max-sm:items-center">
                        {
                            adminusers.length == 0 ?
                                <p className="font-bold text-2xl mt-3">No Admins Yet</p> :
                                adminusers.map(function (item) {
                                    return <Usercard item={item}></Usercard>
                                })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default Manageadmin;