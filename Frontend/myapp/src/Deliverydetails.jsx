import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { signOut } from "firebase/auth"

function Deliverydetails() {
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const location = useLocation()
    const [isAdmin, setisAdmin] = useState(false)
    const [total, settotal] = useState("")
    const [cartproducts, setcartproducts] = useState([])
    const [owner,setowner] = useState(false)
    useEffect(function () {
        if (!location.state) {
            navigate("/home")
            return
        }
        const totalprice = location.state.total
        settotal(totalprice)
        const cartproducts = location.state.cartproducts
        setcartproducts(cartproducts)
    }, [])


    useEffect(function () {
        const unsubscribe = onAuthStateChanged(auth,async function (user) {
            if (!user) {
                navigate("/home")
                return
            }
            const tokenResult = await user.getIdTokenResult()
            if (tokenResult.claims.owner) {
                setowner(true)
            } else {
                setowner(false)
            }
            if (tokenResult.claims.admin) {
                setisAdmin(true);
            } else {
                setisAdmin(false);
            }
            setusername(user.displayName)
            setuseremail(user.email)
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

    const [Nwarn, setNwarn] = useState(false)
    const [Phonewarn, setPhonewarn] = useState(false)
    const [Ewarn, setEwarn] = useState(false)
    const [Awarn, setAwarn] = useState(false)
    const [Cwarn, setCwarn] = useState(false)
    const [Pinwarn, setPinwarn] = useState(false)

    const [name, setname] = useState("")
    function handlename(event) {
        setname(event.target.value)
    }

    const [phone, setphone] = useState("")
    function handlephone(event) {
        setphone(event.target.value)
    }

    const [email, setemail] = useState("")
    function handleemail(event) {
        setemail(event.target.value)
    }

    const [address, setaddress] = useState("")
    function handleaddress(event) {
        setaddress(event.target.value)
    }

    const [city, setcity] = useState("")
    function handlecity(event) {
        setcity(event.target.value)
    }

    const [pincode, setpincode] = useState("")
    function handlepincode(event) {
        setpincode(event.target.value)
    }

    async function handlepay() {
        setNwarn(false)
        setPhonewarn(false)
        setEwarn(false)
        setAwarn(false)
        setCwarn(false)
        setPinwarn(false)

        const filteredcartproducts = cartproducts.map(function (item) {
            return {
                name: item.name,
                quantity: item.quantity,
                price: item.amount
            }
        })

        const uid = cartproducts[0].uid

        if (name.trim().length > 2 && phone.trim().length == 10 && email.trim().length > 5 && address.trim().length > 9 && city.trim().length > 3 && pincode.trim().length == 6) {

            const order = await axios.post(`${API_URL}/createorder`, { total: total })
            const option = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.data.amount,
                currency: order.data.currency,
                name: name,
                description: "Payment for pizza order",
                order_id: order.data.id,
                handler: async function (resp) {
                    const verify = await axios.post(`${API_URL}/verify`, { response: resp, name: name, phone: phone, email: email, address: address, city: city, pincode: pincode, total: total, itemdetails: filteredcartproducts, uid: uid })
                    alert(verify.data.message)
                    navigate("/order")
                },
                theme: {
                    color: "red"
                }
            }

            const razor = new window.Razorpay(option)
            razor.open()
        }
        else {
            if (name.trim().length < 3) {
                setNwarn(true)
            }
            if (phone.trim().length != 10) {
                setPhonewarn(true)
            }
            if (email.trim().length < 6) {
                setEwarn(true)
            }
            if (address.trim().length < 10) {
                setAwarn(true)
            }
            if (city.trim().length < 4) {
                setCwarn(true)
            }
            if (pincode.trim().length != 6) {
                setPinwarn(true)
            }
        }
    }

    function handleorder() {
        navigate("/order")
    }

    function handlehome() {
        navigate("/home")
    }
    function handlemessage() {
        navigate("/message")
    }

    function handleaddproducts() {
        navigate("/addproducts")
    }

    function handlemanageadmin()
    {
        navigate("/manageadmin")
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
                    {isAdmin ? <p className="cursor-pointer" onClick={handlemessage}>Message</p> : <p className="cursor-pointer" onClick={handlecontact}>Contact</p>}
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                    {isAdmin ? <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> : ""}
                    {owner?<p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
                </div>
                <div className="flex gap-10 items-center max-sm:gap-5">
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
                {isAdmin ? <p className="cursor-pointer" onClick={handlemessage}>Message</p> : <p className="cursor-pointer" onClick={handlecontact}>Contact</p>}
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                {isAdmin ? <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> : ""}
                {owner?<p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
            </div>
            <div className="bg-red-100 flex justify-center items-center h-screen p-20 max-sm:p-0 max-sm:mt-15 max-sm:h-fit sm:max-lg:p-10">
                <div className="bg-[#F5F5F5] w-[60%] p-10 rounded-xl mt-10 max-sm:w-[90%] max-sm:p-5 max-sm:mt-10 max-sm:mb-15 sm:max-lg:w-[95%]">
                    <div className="flex items-center gap-5">
                        <i className="fa-solid fa-location-dot text-2xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                        <div>
                            <h1 className="font-bold text-xl">Delivery Information</h1>
                            <p>Enter your details to get your pizza delivered</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between max-sm:flex-col">
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">Full Name</p>
                            <input onChange={handlename} type="text" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your Full name"></input>
                            {Nwarn ? <p className="text-red-500 mt-2">Minimum 3 characters required</p> : ""}
                        </div>
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">Phone Number</p>
                            <input onChange={handlephone} type="number" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your Phone Number"></input>
                            {Phonewarn ? <p className="text-red-500 mt-2">Enter an Valid Phone Number</p> : ""}
                        </div>
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">Email</p>
                            <input onChange={handleemail} type="email" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your Email"></input>
                            {Ewarn ? <p className="text-red-500 mt-2">Enter an Valid email</p> : ""}
                        </div>
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">Address</p>
                            <input onChange={handleaddress} type="text" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your delivery Address"></input>
                            {Awarn ? <p className="text-red-500 mt-2">Minimum 10 characters required</p> : ""}
                        </div>
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">City</p>
                            <input onChange={handlecity} type="text" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your City"></input>
                            {Cwarn ? <p className="text-red-500 mt-2">Minimum 4 characters required</p> : ""}
                        </div>
                        <div className="basis-[45%] mt-3">
                            <p className="font-bold">Pincode</p>
                            <input onChange={handlepincode} type="number" className="border-2 px-4 py-2 w-full outline-none bg-[#F5F5F5] rounded" placeholder="Enter your Pincode"></input>
                            {Pinwarn ? <p className="text-red-500 mt-2">Must have 6 Numbers</p> : ""}
                        </div>
                    </div>
                    <div className="w-full flex items-center py-5 gap-3">
                        <i className="fa-solid fa-triangle-exclamation text-2xl" style={{ color: "rgb(245, 222, 64)" }}></i>
                        <p className="font-bold text-red-500">Cash On Delivery is Not Available.</p>
                    </div>
                    <div className="w-full flex justify-center">
                        <button onClick={handlepay} className="bg-red-500 px-40 py-3 rounded-xl font-bold text-white max-sm:px-10"><i className="fa-solid fa-lock pr-5" style={{ color: "white" }}></i>Proceed To Payment</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Deliverydetails;