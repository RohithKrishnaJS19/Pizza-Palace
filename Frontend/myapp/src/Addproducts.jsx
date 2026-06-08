import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import auth from "./firebaseconfig"
import { onAuthStateChanged } from "firebase/auth"
import { signOut } from "firebase/auth"
import axios from "axios"
import { useLocation } from "react-router-dom"

function Addproducts() {
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

    function handlecopystar() {
        navigator.clipboard.writeText("⭐");
    }

    const [name, setname] = useState("")
    function handlename(event) {
        setname(event.target.value)
    }

    const [amount, setamount] = useState("")
    function handleamount(event) {
        setamount(event.target.value)
    }

    const [category, setcategory] = useState("Veg")
    function handlecategory(event) {
        setcategory(event.target.value)
    }

    const [rating, setrating] = useState("")
    function handlerating(event) {
        setrating(event.target.value)
    }

    const [image, setimage] = useState(null)
    function handleimage(event) {
        setimage(event.target.files[0])
    }

    const [Nwarn, setNwarn] = useState(false)
    const [Awarn, setAwarn] = useState(false)
    const [Rwarn, setRwarn] = useState(false)
    const [Uwarn, setUwarn] = useState(false)

    async function handleaddproduct() {
        setNwarn(false)
        setAwarn(false)
        setRwarn(false)
        setUwarn(false)

        if (name.trim().length > 4 && amount.trim().length > 0 && rating.trim().length > 1 && image) {
            let imgurl = ""
            try {
                const formData = new FormData()
                formData.append("file", image)
                formData.append("upload_preset", import.meta.env.VITE_PRESET_NAME)

                const CloudinaryRes = await axios.post(import.meta.env.VITE_CLOUDINARY_IMG_UPLOAD_URL, formData)

                imgurl = CloudinaryRes.data.secure_url
            }
            catch (err) {
                alert("Image upload Failed")
                console.log(err)
                return
            }
            await axios.post(`${API_URL}/addproduct`, { token: token, name: name, amount: amount, category: category, rating: rating, imgurl: imgurl }).
                then(function (retdata) {
                    if (retdata.data) {
                        alert("Product Added Successfully")
                        navigate("/home")
                    }
                    else {
                        alert("Product Not Added")
                    }
                }).catch(function () {
                    alert("Server Error")
                })
        }
        else {
            if (name.trim().length < 5) {
                setNwarn(true)
            }
            if (amount.trim().length < 1) {
                setAwarn(true)
            }
            if (rating.trim().length < 2) {
                setRwarn(true)
            }
            if (!image) {
                setUwarn(true)
            }
        }
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
                    <p className={`cursor-pointer pb-1 ${location.pathname === "/addproducts" ? "border-b-2 border-red-500 text-red-500" : ""}`} onClick={handleaddproducts}>Add products</p>
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
                <p className="cursor-pointer" onClick={handlemessage}>Message</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p>
                {owner ? <p onClick={handlemanageadmin} className="cursor-pointer">Manage Admin</p> : ""}
            </div>
            <div className="bg-white w-full h-[100%] flex justify-center ">
                <div className="bg-red-100  mt-30 mb-15 rounded-2xl flex flex-col justify-center items-center gap-3 p-10 max-sm:mt-15  max-sm:mb-15">
                    <h1 className="font-bold text-3xl">New Pizza Details</h1>
                    <div>
                        <p className="font-bold">Name</p>
                        <input onChange={handlename} className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter pizza name"></input>
                        {Nwarn ? <p className="text-red-500">Minimum 5 character required</p> : ""}
                    </div>
                    <div>
                        <p className="font-bold">Amount</p>
                        <input type="number" onChange={handleamount} className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170" placeholder="Enter the amount"></input>
                        {Awarn ? <p className="text-red-500">Amount is required</p> : ""}
                    </div>
                    <div className="w-full flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3 sm:max-lg:flex-col sm:max-lg:items-start sm:max-lg:gap-3">
                        <div>
                            <p className="font-bold">Category</p>
                            <select onChange={handlecategory} className="bg-[#F5F5F5] border-2 px-2 py-2 outline-none rounded">
                                <option value="Veg">Veg</option>
                                <option value="Non-veg">Non-veg</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold">Rating</p><p className="text-sm text-red-600"> Use full stars only (4.9→⭐⭐⭐⭐,2.9→⭐⭐)</p>
                            </div>
                            <input onChange={handlerating} className="border-2 w-80 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-100" placeholder="Example:⭐⭐⭐ 3.0"></input>
                            {Rwarn ? <p className="text-red-500">Minimum 2 characters required</p> : ""}
                        </div>
                        <div>
                            <p className="text-center text-2xl">⭐</p>
                            <button onClick={handlecopystar} className="bg-blue-700 text-white px-3 py-2 rounded"><i className="fa-regular fa-copy" style={{ color: "rgb(255, 255, 255)" }}></i>Copy</button>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold">Upload Image</p>
                        <input onChange={handleimage} accept="image/*" type="file" className="border-2 w-200 px-4 py-2 outline-none text-xl bg-[#F5F5F5] rounded max-sm:w-85 sm:max-lg:w-170"></input>
                        {Uwarn ? <p className="text-red-500">Please Select an Image</p> : ""}
                    </div>
                    <div className="w-[100%]">
                        <button onClick={handleaddproduct} className="bg-blue-600 font-bold text-white px-6 py-4 rounded flex items-center gap-2">Add Product</button>
                    </div>
                </div>
            </div>
        </>

    )
}
export default Addproducts;
