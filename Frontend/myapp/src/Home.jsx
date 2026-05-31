import Productcard from "./productcard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cartproductcard from "./cartproductcard";
import { onAuthStateChanged, signOut } from "firebase/auth";
import auth from "./firebaseconfig";
import { useNavigate } from "react-router-dom";

function Home() {
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const [token, settoken] = useState("")
    useEffect(function () {
        onAuthStateChanged(auth, function (user) {
            if (!user) {
                navigate("/")
                return;
            }
            setusername(user.displayName)
            setuseremail(user.email)
            settoken(user.accessToken)
        })
    }, [])

    useEffect(function () {
        if(!token) return
        async function getdata() {
            const productdetails = await axios.get(`${API_URL}/productdetails`)
            setproducts(productdetails.data)
            setfilterproducts(productdetails.data)

            const cartproductdetails = await axios.post(`${API_URL}/cartproductdetails`,{token:token})

            if (cartproductdetails.data == "Invalid Token") {
                navigate("/")
            }
            else {
                setcartproducts(cartproductdetails.data)
            }
        }
        getdata()
    }, [token,API_URL]
    )

    const [products, setproducts] = useState([])
    const [cartproducts, setcartproducts] = useState([])

    const [slide, setslide] = useState(true)
    function handleslideclose() {
        setslide(true)
    }

    function handleslideropen() {
        setslide(false)
    }

    const [showSmsg, setshowSmsg] = useState(false)
    const [showFmsg, setshowFmsg] = useState(false)

    // Adding Products To Cart
    async function handleaddtocart(props) {

        const alreadyexist = cartproducts.some(function (item) {
            return item._id == props._id
        })

        if (alreadyexist) {
            setshowFmsg(true)
            setTimeout(function () {
                setshowFmsg(false)
            }, 2000)

            return
        }

        await axios.post(`${API_URL}/cartproduct`, { token: token, product: props }).
            then(async function (retdata) {
                if (retdata.data == true) {
                    setshowSmsg(true)

                    const cartproductdetails = await axios.post(`${API_URL}/cartproductdetails`, { token: token })
                    setcartproducts(cartproductdetails.data)

                    setTimeout(function () {
                        setshowSmsg(false)
                    }, 2000)
                }
            })
    }

    // Remove Product From Cart
    async function handleremove(props) {
        await axios.post(`${API_URL}/remove`, { token: token, product: props }).
            then(async function (retdata) {
                if (retdata) {
                    const cartproductdetails = await axios.post(`${API_URL}/cartproductdetails`,{token:token})
                    setcartproducts(cartproductdetails.data)
                }
            })
    }

    // Quantity Increase
    function handlequaninc(props) {
        axios.post(`${API_URL}/quantityinc`, { token: token, product: props }).
            then(async function (retdata) {
                if (retdata) {
                    const cartproductdetails = await axios.post(`${API_URL}/cartproductdetails`,{token:token})
                    setcartproducts(cartproductdetails.data)
                }
            })
    }

    // Quantity Decrease
    function handlequandec(props) {
        axios.post(`${API_URL}/quantitydec`, { token: token, product: props }).
            then(async function (retdata) {
                if (retdata) {
                    const cartproductdetails = await axios.post(`${API_URL}/cartproductdetails`,{token:token})
                    setcartproducts(cartproductdetails.data)
                }
            })
    }

    // Subtotal
    const [subtotal, setsubtotal] = useState(0)
    useEffect(function () {
        let total = 0
        cartproducts.forEach(function (item) {
            const amountpercart = item.amount * item.quantity
            total = total + amountpercart
        })
        setsubtotal(total)
    }, [cartproducts])

    // Search filter 
    const [filterproducts, setfilterproducts] = useState([])
    function handlesearch(event) {
        const search = event.target.value

        const filter = products.filter(function (item) {
            return item.searchtag.some(function (tag) {
                return tag.toLowerCase().includes(search.toLowerCase())
            })
        })

        setfilterproducts(filter)
    }

    // Search Scroll Down
    const searchref = useRef(null)
    function handlescrolldown() {
        searchref.current.scrollIntoView(
            {
                behavior: "smooth"
            }
        )
    }

    function handlehome()
    {
        navigate("/home")
    }

    function handleorder()
    {
        navigate("/order")
    }

    // Home Scroll Down
    const homeref = useRef(null)
    function handlehomescroll() {
        homeref.current.scrollIntoView(
            {
                behavior: "smooth"
            }
        )
    }

    function handlelogout() {
        signOut(auth)
    }

    const [slideprofile, setslideprofile] = useState(false)
    const [username, setusername] = useState()
    const [useremail, setuseremail] = useState()
    function handleprofile() {
        setslideprofile(!slideprofile)
    }

    const [showmenu, setshowmenu] = useState(false)
    function handlemenu() {
        setshowmenu(true)
    }
    function handleclosemenu() {
        setshowmenu(false)
    }

    function handlecontact() {
        navigate("/contact")
    }

    function handlepay()
    {
        if(subtotal === 0)
        {
            alert("No items where added to cart")
        }
        else{
            navigate("/delivery",{state:{total:subtotal,cartproducts:cartproducts}})
        }
    }

    function handleaddproducts()
    {
        navigate("/addproducts")
    }
    return (
        <>
            {/* Cart */}
            <div className={`bg-[#FFE5D9]  rounded-2xl h-[100vh] w-[50%] fixed top-0 z-30 duration-1000 overflow-y-scroll max-sm:w-[100%] max-sm:duration-600 sm:max-lg:w-[80%] ${slide ? "-right-[100%]" : "right-0"} `}>
                <div className="flex bg-red-500 justify-between p-4 fixed w-[50%] rounded-t-2xl  max-sm:w-[100%] sm:max-lg:w-[80%]">
                    <p className="text-3xl font-bold text-white">Cart</p>
                    <button onClick={handleslideclose}><i className="fa-solid fa-xmark font-bold text-2xl" style={{ color: "rgb(0, 0, 0)" }}></i></button>
                </div>
                <div className=" flex flex-wrap mt-25 mb-12 max-sm:justify-around max-sm:gap-5 max-sm:mb-25">
                    {
                        cartproducts.map(function (item, index) {
                            return <Cartproductcard key={index} product={item} handleremove={handleremove} handlequaninc={handlequaninc} handlequandec={handlequandec}></Cartproductcard>
                        })
                    }
                </div>
                <div className="flex bg-red-500 justify-between items-center p-2 bottom-0 fixed w-[50%] max-sm:w-[100%] sm:max-lg:w-[80%]">
                    <div className="text-2xl text-white ml-4 flex gap-3 max-sm:text-xl">Sub Total:<p className="font-bold text-black">{subtotal}</p></div>
                    <button onClick={handlepay} className="text-xl bg-blue-600 mr-4 px-4 py-2 text-white font-bold rounded-xl">Place Order</button>
                </div>
            </div>

            {/* Product added message */}
            {showSmsg ? <div className="fixed bg-green-400 text-white right-7 top-20 max-sm:top-20 sm:max-lg:top-20 px-5 py-3 rounded z-10">
                <p>Product Added To Cart</p>
            </div> : ""
            }

            {showFmsg ? <div className="fixed bg-red-400 text-white right-7 top-20 max-sm:top-20 sm:max-lg:top-20 px-5 py-3 rounded z-10">
                <p>Product Already In The Cart</p>
            </div> : ""
            }

            {/* Navbar */}
            <div className=" bg-[#F5F5F5] flex justify-between h-18 items-center fixed w-full top-0 z-20">
                <div className="flex items-center gap-3">
                    <i onClick={handlemenu} className="fa-solid fa-bars ml-2 text-xl sm:!hidden" style={{ color: "rgb(0, 0, 0)" }}></i>
                    <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10 ml-8 max-sm:hidden"></img>
                    <h1 className="text-2xl font-bold text-red-500 max-sm:text-xl">PIZZA PALACE</h1>
                </div>
                <div className="flex gap-10 max-sm:hidden sm:max-lg:gap-5">
                    <p className="cursor-pointer">Home</p>
                    <p className="cursor-pointer" onClick={handlescrolldown}>Menu</p>
                    <p className="cursor-pointer" onClick={handlecontact}>Contact</p>
                    <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                    {/* <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> */}
                </div>
                <div className="flex gap-10 items-center max-sm:gap-5">
                    <div>
                        <i onClick={handlescrolldown} className="fa-solid fa-magnifying-glass text-2xl cursor-pointer max-sm:text-2xl sm:max-lg:text-3xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                    </div>
                    <div className="relative">
                        <p className="bg-red-500 -top-4 -right-3 text-white absolute w-6 h-6 text-center rounded-full font-bold">{cartproducts.length}</p>
                        <i onClick={handleslideropen} className="fa-solid fa-cart-shopping text-2xl cursor-pointer max-sm:text-2xl sm:max-lg:text-3xl" style={{ color: "rgb(0, 0, 0)" }}></i>
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
                <p className="cursor-pointer" onClick={handlescrolldown}>Menu</p>
                <p className="cursor-pointer" onClick={handlecontact}>Contact</p>
                <p className="cursor-pointer" onClick={handleorder}>Orders</p>
                {/* <p className="cursor-pointer" onClick={handleaddproducts}>Add products</p> */}
            </div>

            {/* Hero Section */}
            <div className="flex h-100 bg-black mt-18 max-sm:flex-col" ref={homeref}>
                <div className="w-[40%] flex flex-col items-center justify-center max-sm:w-[100%] sm:max-lg:w-[60%]">
                    <div>
                        <div>
                            <p className="font-medium text-amber-400 max-sm:mt-10 max-sm:text-xl">HOT, FRESH, DELICIOUS.</p>
                            <h1 className="text-6xl font-bold text-white max-sm:text-5xl sm:max-lg:text-6xl">The Best Pizza</h1>
                            <h1 className="text-6xl font-bold text-white max-sm:text-5xl">Delivered Hot!</h1>
                            <p className="text-white mt-4">Order your favorite pizza from Pizza Palace</p>
                            <p className="text-white">and get it delivered at your doorstep.</p>
                        </div>
                        <div className="flex gap-7 mt-5">
                            <button onClick={handlescrolldown} className="bg-red-500 text-white px-5 py-3 font-bold rounded">Order Now</button>
                            <button onClick={handlescrolldown} className="bg-black text-white px-5 py-3 font-bold rounded border border-white">View Menu</button>
                        </div>
                    </div>
                </div>
                <div className="w-[60%] max-sm:w-[100%] max-sm:h-[200px] sm:max-lg:w-[40%]">
                    <img className="h-[100%] w-[100%] object-cover max-sm:w-[140%]" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545107/Homepage_img_uavakp.png"}></img>
                </div>
            </div>
            <div ref={searchref} className="flex justify-center relative max-sm:hidden">
                <div className="flex bg-[#F5F5F5] w-[80%] py-4 rounded-xl justify-around absolute -top-7 sm:max-lg:w-[90%]">
                    <div className="flex gap-6 items-center">
                        <div>
                            <i className="fa-solid fa-truck-fast text-4xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                        </div>
                        <div>
                            <p className="font-bold">Fast Delivery</p>
                            <p>30-40 mins delivery</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div>
                            <i className="fa-solid fa-shield-halved text-4xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                        </div>
                        <div>
                            <p className="font-bold">Best Quality</p>
                            <p>Fresh ingredients</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div>
                            <i className="fa-solid fa-money-bill-1 text-4xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                        </div>
                        <div>
                            <p className="font-bold">Secure Payment</p>
                            <p>100% safe & secure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="mt-20 flex justify-center max-sm:mt-30">
                <div className="w-[90%] max-sm:w-[95%]">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-2xl max-sm:text-xl">Pizza Menu</h1>
                        <div className="flex items-center border-3 rounded">
                            <i className="ml-3 fa-solid fa-magnifying-glass text-2xl cursor-pointer max-sm:text-xl" style={{ color: "rgb(0, 0, 0)" }}></i>
                            <input id="search" onChange={handlesearch} className="bg-white w-140 px-3 py-2 text-xl outline-none max-sm:w-43 max-sm:text-xl sm:max-lg:w-96" placeholder="Search Pizzas..."></input>
                        </div>
                    </div>
                    <div className="flex mt-8 flex-wrap gap-9 mb-10 items-start min-h-[500px] max-sm:gap-2 sm:max-lg:gap-5">
                        {
                            filterproducts.length == 0 ?
                                <div className="flex justify-center items-center w-[100%] min-h-[500px]">
                                    <p className="font-bold text-2xl">No Result Found</p>
                                </div> :
                                filterproducts.map(function (item, index) {
                                    return <Productcard key={index} product={item} addtocart={handleaddtocart}></Productcard>
                                })
                        }
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-around bg-black py-10 max-sm:flex-wrap">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10"></img>
                        <h1 className="text-2xl font-bold text-red-500 max-sm:text-[20px]">PIZZA PALACE</h1>
                    </div>
                    <div className="text-white max-sm:text-xl">
                        <p>Delicious pizzas made with refresh</p>
                        <p>ingredients and lots of love</p>
                    </div>
                    <div className="flex gap-4">
                        <img className="w-10 cursor-pointer" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779711343/instagram_mff5kv.png"}></img>
                        <img className="w-10 cursor-pointer" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779711342/youtube_1_hwuotu.png"}></img>
                        <img className="w-10 cursor-pointer" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779711343/twitter_shnrwd.png"}></img>
                        <img className="w-10 cursor-pointer" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779711343/facebook_euzpre.png"}></img>
                    </div>
                </div>
                <div className="text-white max-sm:mt-10">
                    <h1 className="font-bold text-xl mb-4 text-red-500">Our Menu</h1>
                    <div className="flex flex-col gap-2 cursor-pointer max-sm:text-sm">
                        <p>• Veg Pizza</p>
                        <p>• Non-veg Pizza</p>
                        <p>• Cheese Pizza</p>
                        <p>• Spicy Pizza</p>
                        <p>• Chicken Pizza</p>
                        <p>• Mushroom Pizza</p>
                    </div>
                </div>
                <div className="text-white max-sm:mt-10">
                    <h1 className="font-bold text-xl mb-4 text-red-500">Contact Us</h1>
                    <div className="flex flex-col gap-4 cursor-pointer max-sm:text-sm">
                        <div className="flex items-center gap-5 max-sm:gap-2">
                            <i className="fa-solid fa-location-dot text-2xl max-sm:text-xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                            <div>
                                <p>123 Pizza Palace</p>
                                <p>Foodcity</p>
                            </div>
                        </div>
                        <div className="flex gap-5 max-sm:gap-2">
                            <i className="fa-solid fa-phone text-2xl max-sm:text-xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                            <p>+91 1234567890</p>
                        </div>
                        <div className="flex gap-5 max-sm:gap-2">
                            <i className="fa-regular fa-envelope text-2xl max-sm:text-xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                            <p>pizzapalace@gmail.com</p>
                        </div>
                        <div className="flex gap-5 max-sm:gap-2">
                            <i className="fa-regular fa-clock text-2xl max-sm:text-xl" style={{ color: "rgb(255, 0, 0)" }}></i>
                            <p>10:00 AM - 11:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black">
                <div className="flex items-center justify-between py-5 bg-black text-white px-10 border-t-2 border-white max-sm:px-0 max-sm:gap-3 max-sm:pb-10 mx-20 max-sm:mx-0 max-sm:flex-col sm:max-lg:px-0 sm:max-lg:mx-10  sm:max-lg:pb-10">
                    <p>© 2026 Pizza Palace. All rights reserved.</p>
                    <div>
                        ❤️ Made with <span className="text-red-500">love</span> for pizza lovers
                    </div>
                </div>
            </div>

        </>
    )
}
export default Home;