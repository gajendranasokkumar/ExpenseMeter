const bankService = require("../services/bankService");

class BankController {
    async createBank(req, res) {
        const bankData = req.body;
        const userId = req.body.userId;
        if (!bankData.name || !bankData.logo || !bankData.ifsc) {
            return res.status(400).json({ message: "Name, logo and IFSC are required" });
        }
        try {
            const bank = await bankService.createBank(bankData.name, bankData.logo, bankData.ifsc, userId);
            res.status(201).json({
                message: "Bank created successfully",
                data: bank
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllBanks(req, res) {
        const userId = req.body.userId;
        try {
            const banks = await bankService.getAllBanks(userId);
            res.status(200).json({
                message: "Banks retrieved successfully",
                data: banks
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getBankById(req, res) {
        const userId = req.params.userId;
        if (!req.params.id) {
            return res.status(400).json({ message: "Bank ID is required" });
        }
        try {
            const bank = await bankService.getBankById(req.params.id, userId);
            res.status(200).json({
                message: "Bank retrieved successfully",
                data: bank
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateBankById(req, res) {
        const bankData = req.body;
        const userId = req.body.userId;
        if (!bankData.name || !bankData.logo || !bankData.ifsc) {
            return res.status(400).json({ message: "Name, logo and IFSC are required" });
        }
        if (!req.params.id) {
            return res.status(400).json({ message: "Bank ID is required" });
        }
        try {
            const bank = await bankService.updateBankById(req.params.id, bankData.name, bankData.logo, bankData.ifsc, userId);
            res.status(200).json({
                message: "Bank updated successfully",
                data: bank
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteBankById(req, res) {
        const userId = req.params.userId;
        if (!req.params.id) {
            return res.status(400).json({ message: "Bank ID is required" });
        }
        try {
            const bank = await bankService.deleteBankById(req.params.id, userId);
            res.status(200).json({
                message: "Bank deactivated successfully",
                data: bank
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async permanentlyDeleteBankById(req, res) {
        const userId = req.params.userId;
        if (!req.params.id) {
            return res.status(400).json({ message: "Bank ID is required" });
        }
        try {
            const bank = await bankService.permanentlyDeleteBankById(req.params.id, userId);
            res.status(200).json({
                message: "Bank permanently deleted successfully",
                data: bank
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getBankSummaryByUserId(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        try {
            const summary = await bankService.getBankSummaryByUserId(userId);
            res.status(200).json({
                message: "Bank summary retrieved successfully",
                data: summary
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new BankController();
