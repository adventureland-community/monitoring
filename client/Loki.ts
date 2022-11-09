import { trim_entity } from "./helpers/trim_entity";
import { safe_stringify } from "./helpers/safe_stringify";
import { prom } from "./prom";

type LabelMap = Record<string, string>;
type Data = Record<string, unknown>;

class Loki {
    defaultLabels: LabelMap;

    streams: Record<string, [LabelMap, Array<[string, string]>]> = {};

    locked = false;

    constructor(defaultLabels: LabelMap = {}) {
        this.defaultLabels = defaultLabels;
    }

    /**
     * Adds a new log entry to be pushed.
     * The `obj` parameter should be a json object
     * you will then be able to parse when querying.
     * @param obj The log object
     * @param msg Optional string message. Will be added to `obj` under the `msg` key.
     * @param time Timestamp. Only specify if you want to push a log for a specific date. Safe to omit.
     * 
     * @example
     *  loki.log({
            component: "upgrade",
            item: { name: "gloves", level: 1 },
            chance: "67.25",
            scroll: "scroll3",
            success: false,
        });
     */
    log(obj: Data, msg?: string, time: number = Date.now()) {
        if (this.locked) {
            return setTimeout(() => this.log(obj, msg, time), 10);
        }

        if (msg && !obj.msg) {
            obj.msg = msg;
        }

        const labels = this.defaultLabels;
        const hash = this.hashObject(labels);

        if (!this.streams[hash]) {
            this.streams[hash] = [labels, []];
        }

        this.streams[hash][1].push([`${time}000000`, safe_stringify(obj)]);
    }

    /**
     * Returns log entries json using the format expected from Loki.
     * @see https://grafana.com/docs/loki/latest/api/#push-log-entries-to-loki
     * @returns The json object
     */
    getJSON() {
        this.locked = true;
        const streams = Object.values(this.streams);
        this.streams = {};
        this.locked = false;

        const res = {
            streams: streams.map((s) => ({
                stream: s[0],
                values: s[1],
            })),
        };

        return res;
    }

    private hashObject(labels: LabelMap) {
        // We don't actually need a hash here. We just need a string that
        // is unique for each possible labels object and consistent across
        // calls with equivalent labels objects.
        let keys = Object.keys(labels);
        if (keys.length === 0) {
            return "";
        }
        // else
        if (keys.length > 1) {
            keys = keys.sort(); // need consistency across calls
        }

        let hash = "";
        let i = 0;
        const size = keys.length;
        for (; i < size - 1; i++) {
            hash += `${keys[i]}:${labels[keys[i]]},`;
        }
        hash += `${keys[i]}:${labels[keys[i]]}`;
        return hash;
    }
}

/**
 * Singleton instance of loki. Use it to push logs.
 */
const loki = new Loki({
    job: "adventureland",
    character: character.name,
});

export { loki };

character.on("hit", (data) => {
    // If we are quick enough, the entity is still there.
    const entity = parent.entities[data.actor];

    loki.log({
        component: "hit",
        entity: entity ? trim_entity(entity) : null,
        data,
    });

    if (data.kill) {
        loki.log({
            component: "death",
            entity: entity ? trim_entity(entity) : null,
            data,
        });
    }
});

// Never worked and I don't know why. I use "hit" with data.kill instead.
// game.on("death", (data) => {
//     if (data.id === character.name) {
//         loki.log({ component: "death", data });
//     }
// });

game.on("mluck", (data) => {
    if (data.name === character.name) {
        loki.log({ component: "mluck", data });
    }
});

// ======================

// Publishing every second.
export const PUBLISH_INTERVAL_LOKI = 1000 * 1;

export async function publish_loki() {
    await prom.postWithAuth(LOKI_POST_URL, loki.getJSON(), `Basic ${LOKI_AUTH_TOKEN}`);
}

export async function loop_publish_loki() {
    try {
        await publish_loki();
    } catch (err) {
        log("Error while pushing loki logs.");
    }
    setTimeout(loop_publish_loki, PUBLISH_INTERVAL_LOKI);
}

loop_publish_loki();
