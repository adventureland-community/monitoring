export function trim_entity(entity: any) {
    const keys = [
        "name",
        "type",
        "mtype",
        "ctype",
        "map",
        "id",
        "hp",
        "max_hp",
        "attack",
        "speed",
        "xp",
        "level",
        "s",
        "slots",
        "target",
    ] as const;

    return keys.reduce<any>((e, key) => {
        if (key in entity) {
            // @ts-ignore
            e[key] = entity[key];
        }

        return e;
    }, {});
}
