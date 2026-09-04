const bcrypt = require("bcrypt");
const clientRepository = require("./client.repository");
const storageService = require("../../services/storage.service");
const { generateToken } = require("../../config/jwt");

const registerClient = async (
    {
        fullName,
        mobileNumber,
        password,
        nationalId,
    },
    nationalIdImage
) => {
    // 1. Check if mobile number already exists
    const existingClient = await clientRepository.findByMobileNumber(
        mobileNumber
    );

    if (existingClient) {
        throw new Error("Mobile number is already registered");
    }

    // 2. Make sure National ID image was uploaded
    if (!nationalIdImage) {
        throw new Error("National ID image is required");
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Upload National ID image to Supabase Storage
    const imagePath = await storageService.uploadFile(
        nationalIdImage,
        "client-documents",
        "national-ids"
    );

    // 5. Create client
    const client = await clientRepository.createClient({
        fullName,
        mobileNumber,
        password: hashedPassword,
        nationalId,
        nationalIdImage: imagePath,
        accountStatus: "PENDING",
    });


    // 6. Never return password
    const { password: _, ...clientWithoutPassword } = client;

    // 7. Generate JWT token
    const token = generateToken({
        id: client.id,
        role: "client",
    });

    return {
        token,
        client: clientWithoutPassword,
    };
    };

    const loginClient = async (mobileNumber, password) => {
    // 1. Find client by mobile number
    const client = await clientRepository.findByMobileNumber(
        mobileNumber
    );

    if (!client) {
        throw new Error("Invalid mobile number or password");
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        client.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid mobile number or password");
    }

    // 3. Never return password
    const { password: _, ...clientWithoutPassword } = client;

    // 4. Generate JWT token
    const token = generateToken({
        id: client.id,
        role: "client",
    });

    return {
        token,
        client: clientWithoutPassword,
    };
};

module.exports = {
    registerClient,
    loginClient,
};