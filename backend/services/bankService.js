const bankModel = require("../models/Bank.model");
const transactionModel = require("../models/Transaction.model");

const createBank = async (name, logo, ifsc, userId) => {
    // Check if bank already exists
    const existingBank = await bankModel.findOne({ 
        $or: [{ name }, { ifsc }] 
    });
    if (existingBank) {
        throw new Error("Bank already exists with this name or IFSC code");
    }
    
    const bank = await bankModel.create({ name, logo, ifsc, user_id: userId });
    return bank;
};

const getAllBanks = async (userId) => {
    const banks = await bankModel.find({ isActive: true, user_id: userId }).sort({ name: 1 });
    return banks;
};

const getBankById = async (id, userId) => {
    const bank = await bankModel.findById(id, { user_id: userId });
    if (!bank) {
        throw new Error("Bank not found");
    }
    return bank;
};

const updateBankById = async (id, name, logo, ifsc, userId) => {
    if (!name || !logo || !ifsc) {
        throw new Error("Name, logo and IFSC are required");
    }
    
    // Check if another bank exists with the same name or IFSC
    const existingBank = await bankModel.findOne({ 
        _id: { $ne: id },
        $or: [{ name }, { ifsc }] 
    });
    if (existingBank) {
        throw new Error("Another bank already exists with this name or IFSC code");
    }
    
    const bank = await bankModel.findByIdAndUpdate(
        id, 
        { name, logo, ifsc, user_id: userId, updatedAt: Date.now() }, 
        { new: true }
    );
    if (!bank) {
        throw new Error("Bank not found");
    }
    return bank;
};

const deleteBankById = async (id, userId) => {
    const bank = await bankModel.findByIdAndUpdate(
        id, 
        { isActive: false, user_id: userId, updatedAt: Date.now() }, 
        { new: true }
    );
    if (!bank) {
        throw new Error("Bank not found");
    }
    return bank;
};

const permanentlyDeleteBankById = async (id, userId) => {
    const bank = await bankModel.findByIdAndDelete(id, { user_id: userId });
    if (!bank) {
        throw new Error("Bank not found");
    }
    return bank;
};

const getBankSummaryByUserId = async (userId) => {
    const banks = await bankModel.find({ user_id: userId });
    const transactions = await transactionModel.find({ user_id: userId });
    const bankSummary = banks.map(bank => {
        const bankTransactions = transactions.filter(transaction =>
            transaction.bank && transaction.bank.toString() === bank._id.toString()
        );
        const availableBalance = bankTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        return { ...bank._doc, availableBalance };
    });
    return bankSummary;
};

module.exports = {
    createBank,
    getAllBanks,
    getBankById,
    updateBankById,
    deleteBankById,
    permanentlyDeleteBankById,
    getBankSummaryByUserId
};
