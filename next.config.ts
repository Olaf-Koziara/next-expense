import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true
    },
    typescript: {
        ignoreBuildErrors: true
    },

    serverExternalPackages: ['mongoose'],
    webpack: (config) => {
        config.experiments = {
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
};

export default nextConfig;
