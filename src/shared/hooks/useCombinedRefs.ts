import type { Ref } from "react"

const useCombinedRefs = <T>(...refs: Array<Ref<T> | null | undefined>) => {
    return (node: T | null) => {
        refs.forEach((ref) => {
            if (!ref) {
                return;
            }

            if (typeof ref === 'function') {
                ref(node);
            } else {
                ref.current = node;
            }
        });
    }
}

export default useCombinedRefs;