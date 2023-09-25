/** @type {import('next').NextConfig} */
// @ts-check

const withPWA = require("@ducanh2912/next-pwa").default({
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

// @ts-ignore
module.exports = withPWA(nextConfig);
