import { useState, useEffect } from "react";

const matchPath = (path, route) => {
    const pathParts = normalizePath(path).split('/');
    const routeParts = normalizePath(route).split('/');

    if (pathParts.length !== routeParts.length) {
        return null;
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            const paramName = routeParts[i].slice(1);
            params[paramName] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
            return null;
        }
    }

    return params;
}

export const useRoute = () => {
    const [path, setPath] = useState(normalizePath(window.location.pathname));

    useEffect(() => {
        const onLocationChange = () => {
            setPath(window.location.pathname);
        }

        window.addEventListener('popstate', onLocationChange);

        return () => {
            window.removeEventListener('popstate', onLocationChange);
        }
    }, []);

    return path;
}

const Router = (props) => {
    const { routes } = props;
    const path = useRoute();

    for (const route in routes) {
        const params = matchPath(path, route);

        if (params !== null) {
            const Page = routes[route];
            return <Page params={params} />;
        }        
    }

    const NotFound = routes['*'];
    return <NotFound />;
}

const normalizePath = (pathname) => {
    if (!pathname) return "/";
    const normalized = pathname.replace(/\/+$/, "");
    return normalized || "/";
};

export default Router;