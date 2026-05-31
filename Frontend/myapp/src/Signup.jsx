import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "./firebaseconfig";
import { updateProfile } from "firebase/auth";

function Signup() {
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    function handlelogin() {
        navigate("/")
    }

    const [Sname, setSname] = useState("")
    function handleSname(event) {
        setSname(event.target.value)
    }

    const [Semail, setSemail] = useState("")
    function handleSemail(event) {
        setSemail(event.target.value)
    }

    const [Spass, setSpass] = useState("")
    function handleSpass(event) {
        setSpass(event.target.value)
    }

    const [Sconfrim, setSconfrim] = useState("")
    function handleSconfrim(event) {
        setSconfrim(event.target.value)
    }

    const [Nwarn, setNwarn] = useState(false)
    const [Ewarn, setEwarn] = useState(false)
    const [Pwarn, setPwarn] = useState(false)
    const [Cwarn, setCwarn] = useState(false)

    function handlesignup() {

        setNwarn(false)
        setEwarn(false)
        setPwarn(false)
        setCwarn(false)

        if (Sname.trim().length > 0 && Semail.trim().length > 6 && Semail.includes("@") && Spass.trim().length > 5 && Sconfrim.trim().length > 5 && Spass.trim() === Sconfrim.trim()) {
            createUserWithEmailAndPassword(auth, Semail, Spass).
                then(async function (userCredential) {
                    try {
                        const uid = userCredential.user.uid
                        await updateProfile(userCredential.user,{displayName:Sname})
                        const retdata = await axios.post(`${API_URL}/userdetails`, { data: { name: Sname, email: Semail, pass: Spass, uid:uid } })
                        if (retdata.data) {
                            alert("User created Successfully")
                            navigate("/")
                        }
                        else {
                            await userCredential.user.delete()
                            alert("User Not Created, Please try again.")
                        }
                    }
                    catch {
                        await userCredential.user.delete()
                        alert("User Not Created, Please try again.")
                    }
                })
                .catch(function (error) {
                    if (error.code === "auth/email-already-in-use") {
                        alert("User Already Exist")
                    }
                    else {
                        alert(error.message)
                    }
                })
        }
        else {
            if (Sname.trim().length < 1) {
                setNwarn(true)
            }
            if (Semail.trim().length < 6) {
                setEwarn(true)
            }
            if (Spass.trim().length < 6) {
                setPwarn(true)
            }
            if (Sconfrim.trim().length < 6 || Spass.trim() != Sconfrim.trim()) {
                setCwarn(true)
            }
        }
    }

    const [showpass,setshowpass] = useState(false)
    function handleeye()
    {
        setshowpass(!showpass)
    }
    return (
        <div className=" bg-black flex max-sm:h-screen">
            <div className="w-[50%] h-[100vh] flex flex-col items-center justify-center max-sm:hidden sm:max-lg:w-[40%]">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-5">
                        <img src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779545245/pizza_logo_doongp.png"} className="w-10"></img>
                        <h1 className="text-2xl font-bold text-red-500">PIZZA PALACE</h1>
                    </div>
                    <p className="font-medium text-amber-400">HOT, FRESH, DELICIOUS.</p>
                    <div>
                        <p className="text-white text-6xl font-bold sm:max-lg:text-5xl">WELCOME</p>
                        <p className="text-white text-6xl font-bold sm:max-lg:text-5xl">BACK!</p>
                    </div>
                    <div className="text-white">
                        <p>create an account to start ordering</p>
                        <p>your favorite pizzas with and</p>
                        <p>Fast delivery from Pizza Palace</p>
                    </div>
                </div>
                <div>
                    <img className="h-[300px] sm:max-lg:h-[250px]" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779725127/Homepage_img_qqeppr.png"}></img>
                </div>
            </div>
            <div className="w-[50%] h-[100vh] flex items-center max-sm:w-[100%] max-sm:justify-center sm:max-lg:w-[60%]">
                <div className="bg-white h-[90%] w-[60%] rounded-2xl flex justify-center items-center max-sm:w-[95%] max-sm:p-5 max-sm:h-fit max-sm:py-10 sm:max-lg:w-[95%] sm:max-lg:h-[60%]">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">Signup</h1>
                            <p>create your account to get Started.</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold">Full Name</h1>
                            <div className=" flex gap-3 items-center border p-2 w-[350px] max-sm:w-[310px]">
                                <i className="fa-regular fa-envelope" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="name" onChange={handleSname} type="text" placeholder="Enter your full name" className="w-[100%] outline-none"></input>
                            </div>
                            {
                                Nwarn ? <p className="text-red-500 text-sm">Name is required!</p> : ""
                            }

                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold">Email Address</h1>
                            <div className=" flex gap-3 items-center border p-2 w-[350px] max-sm:w-[310px]">
                                <i className="fa-regular fa-envelope" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="email" onChange={handleSemail} type="email" placeholder="Enter your email" className="w-[100%] outline-none"></input>
                            </div>
                            {
                                Ewarn ? <p className="text-red-500 text-sm">Enter a valid email.</p> : ""
                            }
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold">Password</h1>
                            <div className=" flex gap-3 items-center border p-2 w-[350px] max-sm:w-[310px]">
                                <i className="fa-solid fa-lock" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="pass" onChange={handleSpass} type={showpass?"text":"password"} placeholder="Enter your password" className="w-[100%] outline-none"></input>
                                <i onClick={handleeye} className="fa-regular fa-eye" style={{ color: "black" }}></i>
                            </div>
                            {
                                Pwarn ? <p className="text-red-500 text-sm">Password must be atleast 6 Characters</p> : ""
                            }
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold">Confrim Password</h1>
                            <div className=" flex gap-3 items-center border p-2 w-[350px] max-sm:w-[310px]">
                                <i className="fa-solid fa-lock" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="confrim" onChange={handleSconfrim} type="password" placeholder="Confrim your password" className="w-[100%] outline-none"></input>
                            </div>
                            {
                                Cwarn ? <p className="text-red-500 text-sm">Password and confrim password must be same</p> : ""
                            }
                        </div>
                        <div>
                            <button onClick={handlesignup} className="bg-red-500 text-white font-bold w-[100%] py-2 rounded cursor-pointer">Signup</button>
                        </div>
                        <div className="flex justify-center border-t">
                            <div className="flex pt-4 gap-2">
                                <p>Already have an account?</p>
                                <p onClick={handlelogin} className="text-red-500 cursor-pointer">Login</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;