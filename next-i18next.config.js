/** @type {import('next-i18next').UserConfig} */
const config = {
    debug: process.env.NODE_ENV === "development",
    i18n: {
        defaultLocale: "en",
        locales: ["en", "ko"],
    },
    localePath: "public/locales",
    reloadOnPrerender: process.env.NODE_ENV === "development",
};

module.exports = config;
