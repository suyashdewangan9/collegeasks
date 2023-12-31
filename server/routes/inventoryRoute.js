const router = require("express").Router();
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");



// add inventory
router.post("/add", authMiddleware, async (req, res) => {
    try {
        // valiadate email and inventoryType
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error("Invalid Email");

        if (req.body.inventoryType === "in" && user.userType !== "donar") {
            throw new Error("This email is not registered as a donar");
        }

        if (req.body.inventoryType === "out" && user.userType !== "hospital") {
            throw new Error("This email is not registered as a hospital");
        }

        if(req.body.inventoryType==="out"){
            req.body.hospital= user._id;
        }
        else{
            req.body.hospital= user._id;
        }

        // add inventory
        const inventory = new Inventory(req.body);
        await inventory.save();

        return res.send({ success: true, message: "Inventory Added Successfully" });
    }
    catch (error) {
        return res.send({ success: false, message: error.message });
    }
});

// get inventory



module.exports = router;