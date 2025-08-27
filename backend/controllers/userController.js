const userService = require("../services/userService");


class UserController {
    async createUser(req, res) {
        const userData = req.body;
        if (!userData.name || !userData.email || !userData.password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        if (userData.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        try {
            const user = await userService.createUser(userData.name, userData.email, userData.password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const user = await userService.login(req.body.email, req.body.password);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUser(req, res) {
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }
        try {
            const user = await userService.getUser(req.body.email);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    
    async getUserById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ message: "Id is required" });
        }
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    
    async updateUserById(req, res) {
        const userData = req.body;
        if (!userData.name || !userData.email || !userData.password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        if (userData.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        if (!req.params.id) {
            return res.status(400).json({ message: "Id is required" });
        }
        try {
            const user = await userService.updateUserById(req.params.id, userData.name, userData.email, userData.password);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }  

    async deleteUserById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ message: "Id is required" });
        }
        try {
            const user = await userService.deleteUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
}

module.exports = new UserController();