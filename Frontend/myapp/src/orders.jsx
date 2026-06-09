import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import Ordercards from "./ordercards"
import axios from "axios"
import { signOut } from "firebase/auth"
import Skeletonordercard from "./Skeletonordercard"

function Order() {
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [uid, setuid] = useState("")
    const [isAdmin, setisAdmin] = useState(false)
    const [owner, setowner] = useState(false)
    useEffect(function () {
        const unsubscribe = onAuthStateChanged(auth, async function (user) {
            if (!user) {
                navigate("/")
                return
            }
            if (user) {
                const tokenResult = await user.getIdTokenResult();
                if (tokenResult.claims.owner) {
                    setowner(true)
                } else {
                    setowner(false)
                }
                if (tokenResult.claims.admin) {
                    setisAdmin(true)
                } else {
                    setisAdmin(false)
                }
                setusername(user.displayName)
                setuseremail(user.email)
                setuid(user.uid)
            }
        })
        return function () {
            unsubscribe()
        }
    }, [])

    const [ordetails, setordetails] = useState([])
    useEffect(function () {
        if (!uid) return
        async function handleorderdetails() {
            try {
                setloading(true)
                const orderdetails = isAdmin ? await axios.post(`${API_URL}/adminorderdetails`) : await axios.post(`${API_URL}/orderdetails`, { uid: uid })
                setordetails(orderdetails.data)
            }
            catch {
                alert("Something went Wrong")
            }
            finally {
                setloading(false)
            }
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

    function handlemessage() {
        navigate("/message")
    }

    function handleaddproducts() {
        navigate("/addproducts")
    }

    function handlemanageadmin() {
        navigate("/manageadmin")
    }

    const ord = [1, 2]

    const [deliverypopup, setdeliverypopup] = useState(false)

    const [deliverystatus, setdeliverystatus] = useState("")
    const [deliveryorderid, setdeliveryorderid] = useState("")
    function handleupdatestatus(event) {
        setdeliverypopup(true)
        setselectedstatus(event.delivery_status)
        setdeliverystatus(event.delivery_status)
        setdeliveryorderid(event._id)
    }

    function handlecancel() {
        setdeliverypopup(false)
    }

    const [selectedstatus, setselectedstatus] = useState("")
    function handlestatuschange(event) {
        setselectedstatus(event.target.value)
    }

    async function handleupdate() {
        const retdata = await axios.post(`${API_URL}/updatestatus`, { orderid: deliveryorderid, deliverystatus: selectedstatus })
        if (retdata.data.success) {
            alert("Delivery Status Updated")
            setdeliverypopup(false)
            const orderdetails = isAdmin ? await axios.post(`${API_URL}/adminorderdetails`) : await axios.post(`${API_URL}/orderdetails`, { uid: uid })
            setordetails(orderdetails.data)
        }
        else {
            alert("Delivery status Not Update")
        }
    }
    return (
        <>
            {
                deliverypopup ? <div className="flex justify-center items-center bg-black/70 h-screen w-[100%] top-0 fixed z-40">
                    <div className="bg-white w-[30%] rounded-xl p-8 max-sm:w-[100%] max-sm:p-4 sm:max-lg:w-[70%]">
                        <div className="border-b-2">
                            <h1 className="font-bold text-2xl p-3">Update Delivery Status</h1>
                            <div className="flex gap-2 pl-3">
                                <h1 className="font-bold">Order ID:</h1>
                                <p>{deliveryorderid}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 p-3 items-center">
                            <h1>Current Status:</h1>
                            <button className="font-bold px-4 py-1 bg-orange-100 text-orange-500 rounded-4xl">{deliverystatus}</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="font-bold">Select New Status</h1>
                            <div className="flex items-center gap-3 border-1 py-3 px-5 rounded bg-orange-100">
                                <input onChange={handlestatuschange} type="radio" name="deliveryStatus" value="Preparing" checked={selectedstatus === "Preparing"} className="scale-150"></input>
                                <i className="fa-solid fa-pizza-slice text-2xl text-orange-500"></i>
                                <h1 className="font-bold">Preparing</h1>
                            </div>
                            <div className="flex items-center gap-3 border-1 py-3 px-5 rounded bg-green-100">
                                <input onChange={handlestatuschange} type="radio" name="deliveryStatus" value="Ready for Pickup" checked={selectedstatus === "Ready for Pickup"} className="scale-150"></input>
                                <i className="fa-solid fa-bag-shopping text-green-500 text-2xl"></i>
                                <h1 className="font-bold">Ready for Pickup</h1>
                            </div>
                            <div className="flex items-center gap-3 border-1 py-3 px-5 rounded bg-blue-100">
                                <input onChange={handlestatuschange} type="radio" name="deliveryStatus" value="Out for Delivery" checked={selectedstatus === "Out for Delivery"} className="scale-150"></input>
                                <i className="fa-solid fa-motorcycle text-blue-500 text-2xl"></i>
                                <h1 className="font-bold">Out for Delivery</h1>
                            </div>
                            <div className="flex items-center gap-3 border-1 py-3 px-5 rounded bg-violet-100">
                                <input onChange={handlestatuschange} type="radio" name="deliveryStatus" value="Delivered" checked={selectedstatus === "Delivered"} className="scale-150"></input>
                                <i className="fa-solid fa-circle-check text-violet-500 text-2xl"></i>
                                <h1 className="font-bold">Delivered</h1>
                            </div>
                        </div>
                        <div className="flex justify-end mt-5 gap-3">
                            <button onClick={handlecancel} className="bg-white font-bold border-2 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleupdate} className="font-bold text-white bg-blue-500 px-5 py-2 rounded">Update Status</button>
                        </div>
                    </div>
                </div> : ""
            }


            {/* Navbar */}
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl lg:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden sm:max-lg:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:hidden">
                    <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                    {isAdmin ? <p className="cursor-pointer" onClick={handlemessage}>Message</p> : <p className="cursor-pointer" onClick={handlecontact}>Contact</p>}
                    <p className={`cursor-pointer pb-1 ${location.pathname === "/order" ? "border-b-2 border-red-500 text-red-500" : ""}`} onClick={handleorder}>Orders</p>
                    {isAdmin ? <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> : ""}
                    {owner ? <p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
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
            <div className={` bg-white font-bold text-xl rounded-br-2xl fixed z-20 flex flex-col h-80 w-60 justify-center items-center gap-5 duration-500 ${showmenu ? "left-0" : "-left-[80%]"}`}>
                <i onClick={handleclosemenu} className="cursor-pointer fa-solid fa-xmark font-bold text-2xl absolute top-3 left-3" style={{ color: "red" }}></i>
                <p className="cursor-pointer" onClick={handlenavmenu}>Home</p>
                {isAdmin ? <p className="cursor-pointer" onClick={handlemessage}>Message</p> : <p className="cursor-pointer" onClick={handlecontact}>Contact</p>}
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                {isAdmin ? <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> : ""}
                {owner ? <p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
            </div>
            <div className="mt-18 items-center flex flex-col mb-10">
                {
                    loading ? ord.map(function (item, index) {
                        return <Skeletonordercard key={index}></Skeletonordercard>
                    }) :
                        ordetails.length === 0 ?
                            <div className="flex flex-col justify-center items-center w-full min-h-[500px] gap-3">
                                <img className="w-60" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1780756921/box_xeja46.png"}></img>
                                <p className="font-bold text-2xl">No Orders Yet</p>
                            </div> :
                            ordetails.map(function (item, index) {
                                return <Ordercards orderdetails={item} key={index} handleupdatestatus={handleupdatestatus} isAdmin={isAdmin}></Ordercards>
                            })
                }
            </div>
        </>
    )
}
export default Order;