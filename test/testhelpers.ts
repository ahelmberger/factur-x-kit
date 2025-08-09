/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeUndefinedKeys<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(item =>
            item !== null && typeof item === 'object' && !(item instanceof Date) ? removeUndefinedKeys(item) : item
        ) as any;
    }

    if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
            const value = (obj as any)[key];
            if (value !== undefined) {
                result[key] =
                    value !== null && typeof value === 'object' && !(value instanceof Date)
                        ? removeUndefinedKeys(value)
                        : value;
            }
        }
        return result;
    }

    return obj;
}
