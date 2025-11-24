import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: Number,
    },
    password: {
        type: String,
    },
},
    {
        timestamps: true,
    }
)

const Signup = mongoose.model("Signup", schema)
export default Signup