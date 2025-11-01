
export class ArrayUtil {
    static remove<T>(items: T[], item: T) {
        const index = items.indexOf(item);
        if (index > -1) {
            items.splice(index, 1);
        }
    }

    static get<T>(value: T): T[] {
        if (Array.isArray(value)) {
            return value;
        } else if (value) {
            return [value];
        }

        return null;
    }

}
