const userModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async ( email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error("Password is incorrect");
    }
    const payload = { email: email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      throw new Error("User data not found");
    }
    return {
      jwtToken,
      data: userData,
    };
  };

const createUser = async (name, email, password) => {
    if (!name || !email || !password) {         
        throw new Error("Name, email and password are required");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await userModel.create({ name, email, password: hashedPassword });
    return user;
}

const getUser = async (email) => {
    const user = await userModel.findOne({ email });    
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

const updateUser = async (name, email, password) => {
    if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await userModel.findOneAndUpdate({ email }, { name, email, password: hashedPassword }, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

const getAllUsers = async () => {
    const users = await userModel.find();
    return users;
}


const getUserById = async (id) => {
    const user = await userModel.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

const updateUserById = async (id, name, email, avatar = "") => {
    if (!name || !email) {
        throw new Error("Name and email are required");
    }
    const user = await userModel.findByIdAndUpdate(id, { name, email, avatar }, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}


const deleteUserById = async (id) => {
    const user = await userModel.findByIdAndDelete(id, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    login
}  