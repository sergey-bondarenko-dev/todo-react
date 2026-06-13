import { BASE_URL } from "../constants";

export const trimSlashes = (value = "") => String(value).replace(/^\/+|\/+$/g, "");

export const normalizePath = (pathname = "/") => {
    const normalizedPath = trimSlashes(pathname);

    return normalizedPath ? `/${normalizedPath}` : "/";
};

export const buildAppPath = (pathname = "/") => {
    const normalizedBaseUrl = trimSlashes(BASE_URL);
    const normalizedPathname = trimSlashes(getAppRelativePath(pathname));

    if (!normalizedBaseUrl) {
        return normalizedPathname ? `/${normalizedPathname}` : "/";
    }

    return normalizedPathname
        ? `/${normalizedBaseUrl}/${normalizedPathname}`
        : `/${normalizedBaseUrl}`;
};

export const getAppRelativePath = (pathname = "/") => {
    const normalizedBaseUrl = trimSlashes(BASE_URL);
    const normalizedPathname = trimSlashes(pathname);

    if (!normalizedBaseUrl) {
        return normalizedPathname ? `/${normalizedPathname}` : "/";
    }

    if (normalizedPathname === normalizedBaseUrl) {
        return "/";
    }

    if (normalizedPathname.startsWith(`${normalizedBaseUrl}/`)) {
        return `/${normalizedPathname.slice(normalizedBaseUrl.length + 1)}`;
    }

    return normalizePath(pathname);
};
