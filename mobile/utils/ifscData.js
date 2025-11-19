import bankNames from "ifsc/src/banknames.json";
import bankDetails from "ifsc/src/banks.json";

const PLACEHOLDER_LOGO = "https://ifsc.razorpay.com/favicon.ico";
const IFSC_API_BASE = "https://ifsc.razorpay.com";

const sanitizeName = (rawName, fallback) => {
  if (typeof rawName === "string" && rawName.trim().length > 0) {
    return rawName.trim();
  }
  return fallback;
};

const createBankRecords = () => {
  return Object.entries(bankDetails).map(([code, details]) => {
    const safeCode = code?.trim?.() ?? code;
    const name = sanitizeName(bankNames[safeCode], safeCode);

    return {
      id: safeCode,
      code: safeCode,
      name,
      logo: PLACEHOLDER_LOGO,
      ifsc: details?.ifsc ?? null,
      micr: details?.micr ?? null,
      type: details?.type ?? null,
      upi: Boolean(details?.upi),
      achCredit: Boolean(details?.ach_credit),
      achDebit: Boolean(details?.ach_debit),
      apbs: Boolean(details?.apbs),
      nachDebit: Boolean(details?.nach_debit),
    };
  });
};

const sanitizedBanks = createBankRecords()
  .filter((bank) => Boolean(bank.name))
  .sort((a, b) => a.name.localeCompare(b.name));

export const getBankOptions = () => sanitizedBanks.slice();

export const findBankByIfsc = (ifscCode) =>
  sanitizedBanks.find((bank) => bank.ifsc === ifscCode);

const mapBranchToOption = (branch) => {
  if (!branch) {
    return null;
  }
  const cityOrDistrict = branch.CITY || branch.DISTRICT || branch.STATE || "";
  const label = [branch.BRANCH, cityOrDistrict]
    .filter(Boolean)
    .join(" • ");

  return {
    id: branch.IFSC,
    name: label || branch.IFSC,
    ifsc: branch.IFSC,
    raw: branch,
  };
};

const handleApiResponse = async (response) => {
  if (!response) {
    throw new Error("No response from IFSC service");
  }

  if (!response.ok) {
    let message = "Unable to fetch IFSC codes";
    try {
      const errorPayload = await response.json();
      if (typeof errorPayload === "string") {
        message = errorPayload;
      } else if (errorPayload?.message) {
        message = errorPayload.message;
      }
    } catch (err) {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  return response.json();
};

export const fetchIfscOptions = async ({
  bankCode,
  city,
  state,
  district,
  limit = 500,
  maxPages = 25,
} = {}) => {
  if (!bankCode) {
    return [];
  }

  // Prefer the /branches/{bankcode}/{city} endpoint if a city is available,
  // otherwise fall back to the /search endpoint that supports broader filters.
  if (city) {
    const encodedCity = encodeURIComponent(city);
    const url = `${IFSC_API_BASE}/branches/${bankCode}/${encodedCity}`;
    const response = await fetch(url);
    const payload = await handleApiResponse(response);
    const branches = Array.isArray(payload) ? payload : payload?.branches || [];
    return branches
      .map(mapBranchToOption)
      .filter(Boolean);
  }

  let offset = 0;
  let hasNext = true;
  let pagesFetched = 0;
  const aggregatedBranches = [];

  while (hasNext && pagesFetched < maxPages) {
    const params = new URLSearchParams({
      bankcode: bankCode,
      limit: String(limit),
      offset: String(offset),
    });

    if (state) params.append("state", state);
    if (district) params.append("district", district);

    const url = `${IFSC_API_BASE}/search?${params.toString()}`;
    const response = await fetch(url);
    const payload = await handleApiResponse(response);
    const pageData = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];

    aggregatedBranches.push(...pageData);

    hasNext = Boolean(payload?.hasNext) && pageData.length > 0;
    offset += pageData.length;
    pagesFetched += 1;

    if (!pageData.length) {
      break;
    }
  }

  return aggregatedBranches.map(mapBranchToOption).filter(Boolean);
};

