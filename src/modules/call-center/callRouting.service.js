const routeCall = (department) => {
    const routingMap = {
        SUPPORT: "Support Department",
        COMPLAINTS: "Complaints Department",
        FINANCE: "Finance Department",
        TECHNICAL: "Technical Department",
    };

    if (!department) {
        throw new Error("Department is required");
    }

    const routedDepartment = routingMap[department];

    if (!routedDepartment) {
        throw new Error(
            "Invalid department. Allowed departments: SUPPORT, COMPLAINTS, FINANCE, TECHNICAL"
        );
    }

    return {
        department,
        routedDepartment,
    };
};

module.exports = {
    routeCall,
};