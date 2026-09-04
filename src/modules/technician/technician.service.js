const bcrypt = require("bcrypt");
const { generateToken } = require("../../config/jwt");
const technicianRepository = require("./technician.repository");
const storageService = require("../../services/storage.service");

const registerTechnician = async (
    {
        fullName,
        mobileNumber,
        password,
        profession,
        yearsOfExperience,
        workArea,
        workingHours,
    },
    verificationDocument
) => {
    // 1. Check if mobile number already exists
    const existingTechnician =
        await technicianRepository.findByMobileNumber(mobileNumber);

    if (existingTechnician) {
        throw new Error("Mobile number is already registered");
    }

    // 2. Make sure verification document was uploaded
    if (!verificationDocument) {
        throw new Error("ID / license document is required");
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Upload verification document to Supabase Storage
    const documentPath = await storageService.uploadFile(
        verificationDocument,
        "technician-documents",
        "verification"
    );

    // 5. Create technician
    const technician = await technicianRepository.createTechnician({
        fullName,
        mobileNumber,
        password: hashedPassword,
        profession,
        yearsOfExperience: Number(yearsOfExperience),
        workArea,
        workingHours,

        idCardImage: documentPath,

        commissionPercentage: 0,
        averageRating: 0,
        completedOrdersCount: 0,
        cancelledOrdersCount: 0,
        accountStatus: "PENDING",
    });

    // 6. Never return password
    const { password: _, ...technicianWithoutPassword } = technician;

    // 7. Generate JWT token
    const token = generateToken({
        id: technician.id,
        role: "technician",
    });

    return {
        token,
        technician: technicianWithoutPassword,
    };
};

const loginTechnician = async (mobileNumber, password) => {
    // 1. Find technician by mobile number
    const technician =
        await technicianRepository.findByMobileNumber(mobileNumber);

    if (!technician) {
        throw new Error("Invalid mobile number or password");
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        technician.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid mobile number or password");
    }

    // 3. Never return password
    const { password: _, ...technicianWithoutPassword } = technician;

    // 4. Generate JWT token
    const token = generateToken({
        id: technician.id,
        role: "technician",
    });

    return {
        token,
        technician: technicianWithoutPassword,
    };
};

module.exports = {
    registerTechnician,
    loginTechnician,
};