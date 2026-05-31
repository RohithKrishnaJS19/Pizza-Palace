import { useState, useEffect } from "react";
import auth from "./firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
    const navigate = useNavigate()
    const [token, settoken] = useState("")
    useEffect(function () {
        onAuthStateChanged(auth, function (user) {
            if (user) {
                settoken(user.accessToken)
                navigate("/home")
            }
        })
    }, [])

    const [Lemail, setLemail] = useState("")
    function handleLemail(event) {
        setLemail(event.target.value)
    }

    const [Lpass, setLpass] = useState("")
    function handleLpass(event) {
        setLpass(event.target.value)
    }

    const [Ewarn, setEwarn] = useState(false)
    const [Pwarn, setPwarn] = useState(false)

    function handlelogin() {

        setEwarn(false)
        setPwarn(false)

        if (Lemail.trim().length > 5 && Lpass.trim().length > 5) {
            signInWithEmailAndPassword(auth, Lemail, Lpass).
                then(function () {
                    navigate("/home")
                }).catch(function (error) {
                    if (error.code === "auth/invalid-credential") {
                        alert("User Not Found, Signup before Login")
                    }
                    else if (error.code === "auth/invalid-email") {
                        alert("Enter Valid Email")
                    }
                    else {
                        alert(error.message)
                    }
                })
        }
        else {
            if (Lemail.trim().length < 6 || !Lemail.includes("@")) {
                setEwarn(true)
            }
            if (Lpass.trim().length < 6) {
                setPwarn(true)
            }
        }

    }

    function handlesignup() {
        navigate("/signup")
    }

    const [showpass, setshowpass] = useState(false)
    function handleeye() {
        setshowpass(!showpass)
    }

    return (
        <div className=" bg-black flex max-sm:flex-col">
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
                        <p>Login to continue ordering your</p>
                        <p>favorite pizzas with and</p>
                        <p>Fast delivery from Pizza Palace</p>
                    </div>
                </div>
                <div>
                    <img className="h-[300px] sm:max-lg:h-[250px]" src={"https://res.cloudinary.com/dbrfobvcz/image/upload/q_auto/f_auto/v1779725127/Homepage_img_qqeppr.png"}></img>
                </div>
            </div>
            <div className="w-[50%] h-[100vh] flex items-center max-sm:w-[100%] max-sm:justify-center sm:max-lg:w-[60%]">
                <div className="bg-white h-[80%] w-[60%] rounded-2xl flex justify-center items-center max-sm:w-[95%] max-sm:p-5 max-sm:h-fit max-sm:py-10 sm:max-lg:w-[95%] sm:max-lg:h-[50%]">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p>Welcome back! Please login to your account.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold">Email Address</h1>
                            <div className=" flex gap-3 items-center border p-2">
                                <i className="fa-regular fa-envelope" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="email" onChange={handleLemail} type="email" placeholder="Enter your email" className="w-[100%] outline-none"></input>
                            </div>
                            {
                                Ewarn ? <p className="text-red-500 text-sm">Enter a valid email</p> : ""
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold">Password</h1>
                            <div className=" flex gap-3 items-center border p-2">
                                <i className="fa-solid fa-lock" style={{ color: "rgb(255, 0, 0)" }}></i>
                                <input id="password" onChange={handleLpass} type={showpass ? "text" : "password"} placeholder="Enter your password" className="w-[100%] outline-none"></input>
                                <i onClick={handleeye} className="fa-regular fa-eye" style={{ color: "black" }}></i>
                            </div>
                            {
                                Pwarn ? <p className="text-red-500 text-sm">Enter your password</p> : ""
                            }
                        </div>
                        <div>
                            <button onClick={handlelogin} className="bg-red-500 text-white font-bold w-[100%] py-2 rounded cursor-pointer">Login</button>
                        </div>
                        <div className="flex justify-center border-t">
                            <div className="flex pt-4 gap-2">
                                <p>Don't have an account?</p>
                                <p className="text-red-500 cursor-pointer" onClick={handlesignup}>Sign Up</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;