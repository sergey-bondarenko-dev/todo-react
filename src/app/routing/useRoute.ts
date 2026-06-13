import { useState, useEffect } from "react";
import { getAppRelativePath, normalizePath } from "@/shared/utils/url";

const getCurrentPath = () => {
    return getAppRelativePath(window.location.pathname);
}

export const useRoute = () => {
    const [path, setPath] = useState(normalizePath(getCurrentPath()));

    useEffect(() => {
        const onLocationChange = () => {
            setPath(getCurrentPath());
        }

        window.addEventListener('popstate', onLocationChange);

        return () => {
            window.removeEventListener('popstate', onLocationChange);
        }
    }, []);

    return path;
}