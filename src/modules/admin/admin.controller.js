const bcrypt = require("bcrypt");
const prisma = require("../../config/prisma");
const { generateToken } = require("../../config/jwt");

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const admin = await prisma.admin.findUnique({
            where: {
                email,
            },
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (admin.accountStatus !== "ACTIVE") {
            return res.status(403).json({
                message: "Admin account is not active",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken({
            id: admin.id,
            role: "admin",
            adminRole: admin.role,
        });

        return res.status(200).json({
            message: "Admin login successful",
            data: {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
                accountStatus: admin.accountStatus,
                token,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                accountStatus: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        return res.status(200).json({
            message: "Admin profile retrieved successfully",
            data: admin,
        });
    } catch (error) {
        console.error("Get admin profile error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                email: true,
                profilePicture: true,
                dateOfBirth: true,
                currentLocation: true,
                preferredLanguage: true,
                preferredPaymentMethod: true,
                accountStatus: true,
            },
            orderBy: {
                fullName: "asc",
            },
        });

        return res.status(200).json({
            message: "Clients retrieved successfully",
            data: clients,
        });
    } catch (error) {
        console.error("Get all clients error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany();

        return res.status(200).json({
            message: "Complaints retrieved successfully",
            data: complaints,
        });
    } catch (error) {
        console.error("Get all complaints error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { complaintStatus, finalDecision } = req.body;

        const complaint = await prisma.complaint.findUnique({
            where: {
                id,
            },
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found",
            });
        }

        const updatedComplaint = await prisma.complaint.update({
            where: {
                id,
            },
            data: {
                complaintStatus,
                finalDecision,
                responsibleReviewEmployeeId: req.user.id,
            },
        });

        return res.status(200).json({
            message: "Complaint updated successfully",
            data: updatedComplaint,
        });
    } catch (error) {
        console.error("Update complaint error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await prisma.technician.findMany({
            select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                email: true,
                profilePicture: true,
                profession: true,
                specialty: true,
                yearsOfExperience: true,
                workArea: true,
                currentLocation: true,
                workingHours: true,
                holidays: true,
                transportation: true,
                commissionPercentage: true,
                averageRating: true,
                completedOrdersCount: true,
                cancelledOrdersCount: true,
                accountStatus: true,
            },
            orderBy: {
                fullName: "asc",
            },
        });

        return res.status(200).json({
            message: "Technicians retrieved successfully",
            data: technicians,
        });
    } catch (error) {
        console.error("Get all technicians error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getTechnicianById = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await prisma.technician.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                email: true,
                profilePicture: true,
                idCardImage: true,
                licenseRegistrationImage: true,
                profession: true,
                specialty: true,
                yearsOfExperience: true,
                workArea: true,
                currentLocation: true,
                workingHours: true,
                holidays: true,
                transportation: true,
                bankAccount: true,
                eWallet: true,
                commissionPercentage: true,
                averageRating: true,
                completedOrdersCount: true,
                cancelledOrdersCount: true,
                accountStatus: true,
            },
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found",
            });
        }

        return res.status(200).json({
            message: "Technician retrieved successfully",
            data: technician,
        });
    } catch (error) {
        console.error("Get technician error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const activateTechnician = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await prisma.technician.findUnique({
            where: {
                id,
            },
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found",
            });
        }

        const updatedTechnician = await prisma.technician.update({
            where: {
                id,
            },
            data: {
                accountStatus: "ACTIVE",
            },
        });

        return res.status(200).json({
            message: "Technician activated successfully",
            data: {
                id: updatedTechnician.id,
                fullName: updatedTechnician.fullName,
                accountStatus: updatedTechnician.accountStatus,
            },
        });
    } catch (error) {
        console.error("Activate technician error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const disableTechnician = async (req, res) => {
    try {
        const { id } = req.params;

        const technician = await prisma.technician.findUnique({
            where: {
                id,
            },
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found",
            });
        }

        const updatedTechnician = await prisma.technician.update({
            where: {
                id,
            },
            data: {
                accountStatus: "DISABLED",
            },
        });

        return res.status(200).json({
            message: "Technician disabled successfully",
            data: {
                id: updatedTechnician.id,
                fullName: updatedTechnician.fullName,
                accountStatus: updatedTechnician.accountStatus,
            },
        });
    } catch (error) {
        console.error("Disable technician error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getOrdersPerDay = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const ordersPerDay = {};

        orders.forEach((order) => {
            const date = order.createdAt.toISOString().split("T")[0];

            if (!ordersPerDay[date]) {
                ordersPerDay[date] = 0;
            }

            ordersPerDay[date]++;
        });

        const data = Object.entries(ordersPerDay).map(
            ([date, orderCount]) => ({
                date,
                orderCount,
            })
        );

        return res.status(200).json({
            message: "Orders per day retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Get orders per day error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getMostRequestedCategories = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                service: {
                    select: {
                        mainCategory: true,
                        subcategory: true,
                    },
                },
            },
        });

        const categories = {};
        const subcategories = {};

        orders.forEach((order) => {
            const { mainCategory, subcategory } = order.service;

            if (mainCategory) {
                if (!categories[mainCategory]) {
                    categories[mainCategory] = 0;
                }

                categories[mainCategory]++;
            }

            if (subcategory) {
                if (!subcategories[subcategory]) {
                    subcategories[subcategory] = 0;
                }

                subcategories[subcategory]++;
            }
        });

        const categoriesData = Object.entries(categories)
            .map(([category, orderCount]) => ({
                category,
                orderCount,
            }))
            .sort((a, b) => b.orderCount - a.orderCount);

        const subcategoriesData = Object.entries(subcategories)
            .map(([subcategory, orderCount]) => ({
                subcategory,
                orderCount,
            }))
            .sort((a, b) => b.orderCount - a.orderCount);

        return res.status(200).json({
            message: "Most requested categories retrieved successfully",
            data: {
                categories: categoriesData,
                subcategories: subcategoriesData,
            },
        });
    } catch (error) {
        console.error("Get most requested categories error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAverageOrderTimes = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                acceptanceTime: true,
                arrivalTime: true,
                completionTime: true,
            },
        });

        let totalArrivalTime = 0;
        let arrivalOrdersCount = 0;

        let totalExecutionTime = 0;
        let executionOrdersCount = 0;

        orders.forEach((order) => {
            // Average arrival time
            if (order.acceptanceTime && order.arrivalTime) {
                const arrivalTime =
                    new Date(order.arrivalTime).getTime() -
                    new Date(order.acceptanceTime).getTime();

                totalArrivalTime += arrivalTime;
                arrivalOrdersCount++;
            }

            // Average execution time
            if (order.arrivalTime && order.completionTime) {
                const executionTime =
                    new Date(order.completionTime).getTime() -
                    new Date(order.arrivalTime).getTime();

                totalExecutionTime += executionTime;
                executionOrdersCount++;
            }
        });

        const averageArrivalTimeMinutes =
            arrivalOrdersCount > 0
                ? Math.round(
                      totalArrivalTime / arrivalOrdersCount / (1000 * 60)
                  )
                : 0;

        const averageExecutionTimeMinutes =
            executionOrdersCount > 0
                ? Math.round(
                      totalExecutionTime / executionOrdersCount / (1000 * 60)
                  )
                : 0;

        return res.status(200).json({
            message: "Average order times retrieved successfully",
            data: {
                averageArrivalTimeMinutes,
                averageExecutionTimeMinutes,
                arrivalOrdersCount,
                executionOrdersCount,
            },
        });
    } catch (error) {
        console.error("Get average order times error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getMostActiveCities = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                serviceLocation: true,
            },
        });

        const cities = {};

        orders.forEach((order) => {
            const city = order.serviceLocation?.trim();

            if (city) {
                if (!cities[city]) {
                    cities[city] = 0;
                }

                cities[city]++;
            }
        });

        const data = Object.entries(cities)
            .map(([city, orderCount]) => ({
                city,
                orderCount,
            }))
            .sort((a, b) => b.orderCount - a.orderCount);

        return res.status(200).json({
            message: "Most active cities retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Get most active cities error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getCancellationRate = async (req, res) => {
    try {
        const totalOrders = await prisma.order.count({
            where: {},
        });

        const cancelledOrders = await prisma.order.count({
            where: {
                status: "CANCELLED",
            },
        });

        const cancellationRate =
            totalOrders > 0
                ? Number(((cancelledOrders / totalOrders) * 100).toFixed(2))
                : 0;

        return res.status(200).json({
            message: "Cancellation rate retrieved successfully",
            data: {
                totalOrders,
                cancelledOrders,
                cancellationRate,
            },
        });
    } catch (error) {
        console.error("Get cancellation rate error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getCustomerSatisfaction = async (req, res) => {
    try {
        const ratings = await prisma.rating.findMany({
            where: {
                raterType: "CLIENT",
            },
            select: {
                rating: true,
            },
        });

        const totalRatings = ratings.length;

        const totalRatingValue = ratings.reduce(
            (sum, item) => sum + item.rating,
            0
        );

        const averageRating =
            totalRatings > 0
                ? Number((totalRatingValue / totalRatings).toFixed(2))
                : 0;

        return res.status(200).json({
            message: "Customer satisfaction retrieved successfully",
            data: {
                totalRatings,
                averageRating,
            },
        });
    } catch (error) {
        console.error("Get customer satisfaction error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getProfitValue = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            select: {
                serviceValue: true,
                commission: true,
                technicianEarnings: true,
                tax: true,
            },
        });

        const totalServiceValue = payments.reduce(
            (sum, payment) => sum + (payment.serviceValue || 0),
            0
        );

        const totalCommission = payments.reduce(
            (sum, payment) => sum + (payment.commission || 0),
            0
        );

        const totalTechnicianEarnings = payments.reduce(
            (sum, payment) => sum + (payment.technicianEarnings || 0),
            0
        );

        const totalTax = payments.reduce(
            (sum, payment) => sum + (payment.tax || 0),
            0
        );

        return res.status(200).json({
            message: "Profit value retrieved successfully",
            data: {
                totalPayments: payments.length,
                totalServiceValue,
                totalCommission,
                totalTechnicianEarnings,
                totalTax,
            },
        });
    } catch (error) {
        console.error("Get profit value error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                client: {
                    select: {
                        id: true,
                        fullName: true,
                        mobileNumber: true,
                        email: true,
                    },
                },
                service: {
                    select: {
                        id: true,
                        serviceName: true,
                        mainCategory: true,
                        subcategory: true,
                    },
                },
                assignments: {
                    include: {
                        technician: {
                            select: {
                                id: true,
                                fullName: true,
                                mobileNumber: true,
                                profession: true,
                                specialty: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        return res.status(200).json({
            message: "Orders retrieved successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Get all orders error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    getAllClients,
    getAllTechnicians,
    getTechnicianById,
    activateTechnician,
    disableTechnician,
    getOrdersPerDay,
    getMostRequestedCategories,
    getAverageOrderTimes,
    getMostActiveCities,
    getCancellationRate,
    getCustomerSatisfaction,
    getProfitValue,
    getAllOrders,
    getAllComplaints,
    updateComplaint,
};