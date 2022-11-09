const hasProp = Object.prototype.hasOwnProperty;

function throwsMessage(err: any) {
    return `[Throws: ${err ? err.message : "?"}]`;
}

function safeGetValueFromPropertyOnObject(obj: any, property: string) {
    if (hasProp.call(obj, property)) {
        try {
            return obj[property];
        } catch (err) {
            return throwsMessage(err);
        }
    }

    return obj[property];
}

function ensureProperties(obj2: any) {
    const seen: Array<string> = []; // store references to objects we have seen before

    function visit(obj: any): any {
        if (obj === null || typeof obj !== "object") {
            return obj;
        }

        if (seen.indexOf(obj) !== -1) {
            return "[Circular]";
        }
        seen.push(obj);

        if (typeof obj.toJSON === "function") {
            try {
                const fResult = visit(obj.toJSON());
                seen.pop();
                return fResult;
            } catch (err) {
                return throwsMessage(err);
            }
        }

        if (Array.isArray(obj)) {
            const aResult = obj.map(visit);
            seen.pop();
            return aResult;
        }

        const res = Object.keys(obj).reduce<any>((result, prop) => {
            result[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop));
            return result;
        }, {});
        seen.pop();
        return res;
    }

    return visit(obj2);
}

export const safe_stringify = function safe_stringify(data: any) {
    return JSON.stringify(ensureProperties(data));
};
