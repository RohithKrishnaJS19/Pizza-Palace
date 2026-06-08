const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const Razorpay = require("razorpay")
const crypto = require("crypto")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Initialize Firebase Admin
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
})

// connecting database
mongoose.connect(process.env.MONGODB_URL).
    then(function () {
        console.log("Database connected Successfully")
    }).catch(function () {
        console.log("Database not connected")
    })

// Product Model
const Productdetails = mongoose.model("Product",
    {
        name: String,
        amount: Number,
        category: String,
        rating: String,
        imgurl: String,
        searchtag: [String],
        availability: { type: Boolean, default: true }
    }, "productcard"
)

// Fetching Product details from Database
app.get("/productdetails", async function (req, res) {
    await Productdetails.find({ availability: true }).then(function (data) {
        res.json(data)
    })
})

// Fetching Product details from Database to Admin
app.get("/adminproductdetails", async function (req, res) {
    await Productdetails.find().then(function (data) {
        res.json(data)
    })
})

// Cart Product Model
const Cartproduct = mongoose.model("cart",
    {
        _id: String,
        uid: String,
        name: String,
        amount: Number,
        category: String,
        imgurl: String,
        quantity: Number
    }, "cartproduct"
)

// JWT Middleware
async function checkAuth(req, res, next) {
    try {
        const token = req.body.token
        const decoded = await admin.auth().verifyIdToken(token)
        req.user = decoded
        next()
    }
    catch (err) {
        res.json("Invalid Token")
    }
}

// Adding Products to cart
app.post("/cartproduct", checkAuth, async function (req, res) {
    const product = req.body.product

    const alreadyexist = await Cartproduct.findOne({
        _id: product._id + req.user.uid
    })

    if (alreadyexist) {
        res.json(false)
    }
    else {
        await Cartproduct.create(
            {
                _id: product._id + req.user.uid,
                uid: req.user.uid,
                name: product.name,
                amount: product.amount,
                category: product.category,
                imgurl: product.imgurl,
                quantity: 1
            }
        ).then(function () {
            res.json(true)
        })
    }

})

// fetching CartProduct details From Database
app.post("/cartproductdetails", checkAuth, async function (req, res) {
    await Cartproduct.find({
        uid: req.user.uid
    }).then(function (data) {
        res.json(data)
    })
})

// Remove product from cart
app.post("/remove", checkAuth, async function (req, res) {
    const product = req.body.product
    try {
        await Cartproduct.deleteOne(
            {
                _id: product._id
            }
        )
        res.json(true)
    }
    catch (err) {
        res.json(false)
    }
})

// Quantity Decrease
app.post("/quantitydec", checkAuth, async function (req, res) {
    const product = req.body.product
    if (product.quantity > 1) {
        try {
            await Cartproduct.updateOne(
                { _id: product._id }, { $inc: { quantity: -1 } }
            )
            res.json(true)
        }
        catch (err) {
            res.json(false)
        }
    }
    else {
        res.json(false)
    }
})

// Quantity Increase
app.post("/quantityinc", checkAuth, async function (req, res) {
    const product = req.body.product
    try {
        await Cartproduct.updateOne(
            { _id: product._id }, { $inc: { quantity: +1 } }
        )
        res.json(true)
    }
    catch (err) {
        res.json(false)
    }
})

const Userdetails = mongoose.model("user",
    {
        name: String,
        email: String,
        password: String,
        firebase_uid: String
    }, "userdetails"
)

app.post("/userdetails", async function (req, res) {
    const data = req.body.data
    const hashedpassword = await bcrypt.hash(data.pass, 10)

    Userdetails.create(
        {
            name: data.name,
            email: data.email,
            password: hashedpassword,
            firebase_uid: data.uid
        }
    ).then(function () {
        res.json(true)
    }).catch(function () {
        res.json(false)
    })
})

// Creating Model for order details
const Orderdetails = mongoose.model("order",
    {
        uid: String,
        name: String,
        phone: Number,
        email: String,
        address: String,
        city: String,
        pincode: Number,
        items: [{
            name: String,
            quantity: Number,
            price: Number
        }],
        amount: Number,
        razor_payment_id: String,
        razor_order_id: String,
        payment_status: { type: String, default: "pending" },
        created_At: { type: Date, default: Date.now },
        delivery_status: { type: String, default: "Preparing" }
    }, "orderdetails"
)

// Razor Pay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

app.post("/createorder", async function (req, res) {
    const option = {
        amount: req.body.total * 100,
        currency: "INR",
        receipt: `pizza_${Date.now()}`
    }
    const order = await razorpay.orders.create(option)
    res.json(order)
})

app.post("/verify", function (req, res) {
    const razor_payment_id = req.body.response.razorpay_payment_id
    const razor_order_id = req.body.response.razorpay_order_id
    const razor_signature = req.body.response.razorpay_signature
    const body = razor_order_id + "|" + razor_payment_id

    const expected_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex")

    if (expected_signature == razor_signature) {
        Orderdetails.create(
            {
                uid: req.body.uid,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                items: req.body.itemdetails,
                amount: req.body.total,
                razor_payment_id: razor_payment_id,
                razor_order_id: razor_order_id,
                payment_status: "Paid"
            }
        )
        res.json({
            success: true,
            message: "Payment Successfull"
        })
    }
    else {
        res.json({
            success: false,
            message: "Payment Failed"
        })
    }
})

// Fetching Order details From Database
app.post("/orderdetails", async function (req, res) {
    try {
        const uid = req.body.uid
        const orderdetails = await Orderdetails.find({
            uid: uid
        })
        res.json(orderdetails)
    }
    catch (err) {
        res.json(false)
    }
})

// Fetching Order details From Database For Admin
app.post("/adminorderdetails", async function (req, res) {
    try {
        const orderdetails = await Orderdetails.find()
        res.json(orderdetails)
    }
    catch (err) {
        res.json(false)
    }
})

// Adding Products to Menu
app.post("/addproduct", checkAuth, async function (req, res) {
    try {
        await Productdetails.create(
            {
                name: req.body.name,
                amount: req.body.amount,
                category: req.body.category,
                rating: req.body.rating,
                imgurl: req.body.imgurl,
                searchtag: [req.body.name, req.body.amount, req.body.category, "pizza"],
            }
        )
        res.json(true)
    }
    catch {
        res.json(false)
    }

})

app.post("/checked", async function (req, res) {
    const id = req.body.id
    try {
        await Productdetails.updateOne(
            { _id: id },
            { availability: true }
        )
        res.json(true)
    }
    catch {
        res.json(false)
    }

})

app.post("/unchecked", async function (req, res) {
    const id = req.body.id
    try {
        await Productdetails.updateOne(
            { _id: id },
            { availability: false }
        )
        res.json(true)
    }
    catch {
        res.json(false)
    }
})

// Message Model
const Message = mongoose.model("msg",
    {
        uid: String,
        name: String,
        email: String,
        message: String
    }, "messages"
)

// creating Message
app.post("/message", function (req, res) {
    Message.create({
        uid: req.body.uid,
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }).then(function () {
        res.json(true)
    }).catch(function () {
        res.json(false)
    })
})

// Fetching Messages
app.get("/getmessage", function (req, res) {
    Message.find().then(function (data) {
        res.json(data)
    })
})

// Deleting Messages
app.post("/deletemsg", async function (req, res) {
    const id = req.body.id
    try {
        const result = await Message.deleteOne({ _id: id })
        if (result.deletedCount > 0) {
            res.json(true)
        }
        else {
            res.json(false)
        }
    }
    catch {
        res.json(false)
    }
})

// Fliter Veg
app.get("/veg", async function (req, res) {
    await Productdetails.find({ category: "Veg" }).then(function (data) {
        res.json(data)
    })
})

// Fliter Non-veg
app.get("/nonveg", async function (req, res) {
    await Productdetails.find({ category: "Non-veg" }).then(function (data) {
        res.json(data)
    })
})

app.post("/updateproduct", async function (req, res) {
    try {
        await Productdetails.findByIdAndUpdate(req.body.editid,
            {
                name: req.body.editname,
                amount: req.body.editprice,
                category: req.body.editcategory,
                rating: req.body.editrating,
                imgurl: req.body.editimgurl,
                searchtag: [req.body.editname, req.body.editprice, req.body.editcategory, "pizza"],
            }
        )
        res.json(true)
    }
    catch {
        res.json(false)
    }
})

app.post("/deleteproduct", async function (req, res) {
    try {
        const productid = req.body.productid
        if (!productid) {
            res.json(false)
            return
        }
        const result = await Productdetails.deleteOne({ _id: productid })
        if (result.deletedCount == 1) {
            res.json(true)
        }
        else {
            res.json(false)
        }
    }
    catch {
        res.json(false)
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started...")
})