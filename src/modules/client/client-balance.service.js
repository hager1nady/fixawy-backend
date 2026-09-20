const clientBalanceRepository = require("./client-balance.repository");

const getClientBalance = async (clientId) => {
    let balance =
        await clientBalanceRepository.findBalanceByClientId(clientId);

    if (!balance) {
        balance = await clientBalanceRepository.createBalance(clientId, 0);
    }

    return balance;
};

module.exports = {
    getClientBalance,
};