/**
 * Parse query string to string or specific type
 */
export const getQuery = <T extends string = string>(queryString?: string | string[]): T | undefined => {
    if (typeof queryString === "string") {
        return queryString as T;
    } else {
        return undefined;
    }
};

/**
 * Parse query string to string or specific type
 */
export const getQueryWithoutUndefined = <T extends string = string>(queryString?: string | string[]): T => {
    if (typeof queryString === "string") {
        return queryString as T;
    } else {
        return "" as T;
    }
};
