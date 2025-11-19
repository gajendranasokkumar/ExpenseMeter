const defaultLogo = require("../assets/images/bankLogos/DEFAULT.jpg");

const bankLogoMap = {
    "HDFC": require("../assets/images/bankLogos/HDFC.png"), // HDFC Bank
    "ICIC": require("../assets/images/bankLogos/ICIC.png"), // ICICI Bank
    "KKBK": require("../assets/images/bankLogos/KKBK.png"), // Kotak Mahindra Bank
    "UTIB": require("../assets/images/bankLogos/UTIB.png"),  // Axis Bank
    "INDB": require("../assets/images/bankLogos/INDB.jpg"), // IndusInd Bank
    "IDFB": require("../assets/images/bankLogos/IDFB.png"), // IDFC FIRST Bank
    "FDRL": require("../assets/images/bankLogos/FDRL.jpg"), // Federal Bank
    "YESB": require("../assets/images/bankLogos/YESB.png"), // YES Bank  
    "SBIN": require("../assets/images/bankLogos/SBIN.jpg"),  // State Bank of India
    "PUNB": require("../assets/images/bankLogos/PUNB.jpg"),  // Punjab National Bank
    "CNRB": require("../assets/images/bankLogos/CNRB.png"), // Canara Bank
    "UBIN": require("../assets/images/bankLogos/UBIN.png"), // Union Bank of India
    "IDIB": require("../assets/images/bankLogos/IDIB.png"), // Indian Bank
    "IOBA": require("../assets/images/bankLogos/IOBA.png"),  // Indian Overseas Bank
    "BARB": require("../assets/images/bankLogos/BARB.png"),  // Bank of Baroda
    "CBIN": require("../assets/images/bankLogos/CBIN.png"),  // Central Bank of India
    "IDBL": require("../assets/images/bankLogos/IDBL.png"), // IDBI Bank
    "KVBL": require("../assets/images/bankLogos/KVBL.jpg"),  // Karur Vysya Bank
    "CIUB": require("../assets/images/bankLogos/CIUB.png"),  // City Union Bank
    "TMBL": require("../assets/images/bankLogos/TMBL.png"),  // Tamilnad Mercantile Bank
    "DBSS": require("../assets/images/bankLogos/DBSS.png"),  // DBS Bank (Acquired LVB)
    "SIBL": require("../assets/images/bankLogos/SIBL.png"), // South Indian Bank
    "CSBK": require("../assets/images/bankLogos/CSBK.png"), // CSB Bank
  };

const normalizeCode = (code) =>
  typeof code === "string" && code.trim().length
    ? code.trim().slice(0, 4).toUpperCase()
    : null;

export const extractBankCode = (bank) => {
  if (!bank) {
    return null;
  }

  const directCode =
    bank.code ||
    bank.bankCode ||
    bank.bank_code ||
    bank.BANKCODE ||
    null;

  const ifscCode =
    (typeof bank.ifsc === "string" && bank.ifsc.slice(0, 4)) ||
    (typeof bank.IFSC === "string" && bank.IFSC.slice(0, 4)) ||
    null;

  return normalizeCode(directCode || ifscCode);
};

export const getBankLogoSource = (bankCode) => {
  const normalized = normalizeCode(bankCode);
  if (!normalized) {
    return defaultLogo;
  }
  return bankLogoMap[normalized] ?? defaultLogo;
};

export const bankLogos = bankLogoMap;

