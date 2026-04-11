import { buildAppPath } from "../../utils/url";

const RouterLink = (props) => {
    const {
        to,
        children,
        ...rest
    } = props;

    const href = buildAppPath(to);

    const handleClick = (event) => {
        event.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    return (
        <a href={href} onClick={handleClick} {...rest}>
            {children}
        </a>
    );
}

export default RouterLink;
