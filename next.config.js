/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
    dest: "public",
});

const nextConfig = {
    webpack(config)
    {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
};

module.exports = withPWA(nextConfig);
