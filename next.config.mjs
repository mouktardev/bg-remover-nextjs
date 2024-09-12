import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        // Ignore node-specific modules when bundling for the browser
        // See https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
            "@huggingface/transformers": path.resolve(__dirname, "node_modules/@huggingface/transformers"),
        }
        return config;
    }
};

export default nextConfig;
