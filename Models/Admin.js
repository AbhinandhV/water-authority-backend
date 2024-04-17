const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        subadmin_name: String,
        subadmin_place: String,
        subadmin_phone: String,
        subadmin_email: String,
        username: String,
        password: String,
        resetToken: String, // Add a field for storing reset token
    }
);

module.exports = mongoose.model("admin", adminSchema);
