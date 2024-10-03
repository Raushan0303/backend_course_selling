
export const generateSubdomain = (name) => {
    const subdomain = name.toLowerCase().replace(/\s+/g, '-');
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${subdomain}-${randomSuffix}`;
};
