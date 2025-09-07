const mongoose = require('mongoose');
const bankModel = require('../models/Bank.model');

// Bank data from your frontend
const banksData = [
    {
        name: "Bank of America",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "BOFAUS33"
    },
    {
        name: "Karur Vysya Bank",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqz6IhSrjhhVtKcvttM76BxaH_rsMLxWpnOC_KYHdqVOuwkarX7gQm9vPsjt3Ik0sQIUo&usqp=CAU",
        ifsc: "KVBL0000001"
    },
    {
        name: "SBI",
        logo: "https://www.sbi.co.in/images/logo.png",
        ifsc: "SBIN0000001"
    },
    {
        name: "HDFC",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "HDFC0000001"
    },
    {
        name: "ICICI",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "ICICUS33"
    },
    {
        name: "Axis",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "AXISUS33"
    },
    {
        name: "IDBI",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "IDBIBUS33"
    },
    {
        name: "IDFC",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "IDFCUS33"
    },
    {
        name: "IndusInd",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "INDUSU33"
    },
    {
        name: "Kotak",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "KOTAKUS33"
    },
    {
        name: "L&T",
        logo: "https://www.bankofamerica.com/content/dam/public/bank-of-america/logos/bank-of-america-logo.svg",
        ifsc: "LTUS33"
    }
];

const seedBanks = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expensemeter');
        console.log('Connected to MongoDB');

        // Clear existing banks
        await bankModel.deleteMany({});
        console.log('Cleared existing banks');

        // Insert new banks
        const banks = await bankModel.insertMany(banksData);
        console.log(`Successfully seeded ${banks.length} banks`);

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding banks:', error);
        process.exit(1);
    }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedBanks();
}

module.exports = seedBanks;
