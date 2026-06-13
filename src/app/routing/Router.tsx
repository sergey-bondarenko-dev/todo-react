import { normalizePath } from "@/shared/utils/url";
import { useRoute } from "./useRoute";
import type { ComponentType } from "react";

export type RouteParams = Record<string, string>;

export type PageProps = {
    params: RouteParams;
}

type RouteComponent = ComponentType<PageProps>;

export type Routes = Record<string, RouteComponent>;

type RouterProps = {
    routes: Routes;
}

const matchPath = (path: string, route: string) => {
    const pathParts = normalizePath(path).split('/');
    const routeParts = normalizePath(route).split('/');

    if (pathParts.length !== routeParts.length) {
        return null;
    }

    const params: Record<string, string> = {};

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

const Router = (props: RouterProps) => {
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
    return <NotFound params={{}}/>;
}

export default Router;
