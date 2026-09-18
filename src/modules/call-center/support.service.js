const appLinkService = require("./appLink.service");

const createSupportMessage = () => {
    const app = appLinkService.getAppDownloadLink();

    return {
        message: "Please download the Fixawy app using the link below.",
        appName: app.appName,
        downloadLink: app.downloadLink,
    };
};

module.exports = {
    createSupportMessage,
};