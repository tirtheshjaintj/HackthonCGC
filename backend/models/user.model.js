import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v),
            message: "Not a valid name! Only letters,spaces and numbers are allowed.",
        }, email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
                message: "Not a valid email!",
            },
        },
        password: { type: String, required: true },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        otp: {
            type: String,
            validate: {
                validator: function (val) {
                    return !val || val?.length == 6;
                },
                message: "OTP must be 6 digits"
            }
        },
        google_id: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^\d{21}$/.test(v);
                },
                message: props => `Not Valid Google ID`
            },
            unique: true,
            sparse: true // Allows multiple `null` values
        }
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = model("user", userSchema);
export default userModel;