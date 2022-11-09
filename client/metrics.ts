import { prom } from "./prom";

// The following monstrosity is used because I want to precisely store the total xp points.
// prettier-ignore
export const cumulatedXp = [0,0,200,450,760,1140,1610,2190,2910,3810,4910,6210,7810,9810,12310,15410,19210,23910,29710,36910,45910,56910,69910,85910,105910,130910,161910,199910,246910,304910,376910,466910,576910,706910,866910,1066910,1316910,1626910,2006910,2476910,3056910,3776910,4676910,5776910,7076910,8676910,10676910,13176910,16276910,20076910,24776910,30576910,37776910,46776910,57776910,70776910,86776910,106776910,131776910,162776910,200776910,247776910,304776910,373776910,457776910,557776910,677776910,817776910,987776910,1187776910,1427776910,1717776910,2067776910,2487776910,2997776910,3617776910,4367776910,5267776910,6267776910,7467776910,8867776910,10467776910,12467776910,14967776910,18067776910,21967776910,26867776910,33067776910,40967776910,50967776910,62967776910,77967776910,97967776910,124967776910,161967776910,211967776910,279967776910,372967776910,492967776910,652967776910,872967776910,1172967776910,1502967776910,1862967776910,2252967776910,2672967776910,3132967776910,3632967776910,4182967776910,4782967776910,5442967776910,6162967776910,6952967776910,7812967776910,8752967776910,9752967776910,10852967776910,12052967776910,13352967776910,14752967776910,16252967776910,17852967776910,19552967776910,21352967776910,23252967776910,25252967776910,27452967776910,29852967776910,32452967776910,35252967776910,38252967776910,41552967776910,45152967776910,49052967776910,53252967776910,57852967776910,62852967776910,68352967776910,74352967776910,80952967776910,88152967776910,96052967776910,104652967776910,114052967776910,124052967776910,135052967776910,147052967776910,160052967776910,174052967776910,189052967776910,205052967776910,222052967776910,240052967776910,259052967776910,279052967776910,301052967776910,325052967776910,351052967776910,379052967776910,409052967776910,442052967776910,478052967776910,517052967776910,559052967776910,605052967776910,655052967776910,710052967776910,770052967776910,836052967776910,908052967776910,987052967776910,1073052967776910,1167052967776910,1267052967776910,1377052967776910,1497052967776910,1627052967776910,1767052967776910,1917052967776910,2077052967776910,2247052967776910,2427052967776910,2617052967776910,2817052967776910,3037052967776910,3277052967776910,3537052967776910,3817052967776910,4117052967776910,4447052967776910,4807052967776910,5197052967776910,5617052967776910,6077052967776910,6577052967776910,7127052967776910,7727052967776910,8387052967776910,9107052967776910,9897052967776910,10757052967776910];

prom.register.setDefaultLabels({
    character: character.name,
});

// =====================
//     Info metrics
// =====================
export const char = new prom.Gauge({
    name: "al_character_info",
    help: "Informations regarding the character",
    labelNames: ["name", "class", "owner"],
});
char.set(
    {
        name: character.name,
        class: character.ctype,
        owner: character.owner,
    },
    1,
);

export const serv = new prom.Gauge({
    name: "al_server_info",
    help: "Informations regarding the server",
    labelNames: ["fullname", "mode", "pvp", "region", "id"],
});
serv.set(
    {
        fullname: server.region + server.id,
        mode: server.mode,
        pvp: `${server.pvp}`,
        region: server.region,
        id: server.id,
    },
    1,
);

// =====================
//    Server metrics
// =====================
export const kills = new prom.ServerCounter({
    name: "al_kills_total",
    help: "How many kills my characters did",
    labelNames: ["enemy"],
});

export const damage_dealt = new prom.ServerCounter({
    name: "al_damage_dealt_total",
    help: "How much damage my characters dealt",
    labelNames: ["damage_type", "monster", "projectile", "source"],
});

export const damage_received = new prom.ServerCounter({
    name: "al_damage_received_total",
    help: "How much damage my characters received",
    labelNames: ["damage_type", "monster", "projectile", "source"],
});

export const used_skills = new prom.ServerCounter({
    name: "al_used_skills_total",
    help: "How many skills my characters used",
    labelNames: ["skill"],
});

export const deaths = new prom.ServerCounter({
    name: "al_deaths_total",
    help: "How many deaths my characters suffered",
});

export const opened_chests = new prom.ServerCounter({
    name: "al_opened_chests_total",
    help: "How many chests did my characters open",
    labelNames: ["skin"],
});

export const looted_items = new prom.ServerCounter({
    name: "al_looted_items_total",
    help: "How many items did my characters loot",
    labelNames: ["item", "level"],
});

export const looted_gold = new prom.ServerCounter({
    name: "al_looted_gold_total",
    help: "How much gold did my characters loot",
});

export const bought_items = new prom.ServerCounter({
    name: "al_bought_items_total",
    help: "How many items I bought",
    labelNames: ["item", "from"],
});

export const spent_gold = new prom.ServerCounter({
    name: "al_spent_gold_total",
    help: "How many gold I spent",
    labelNames: ["for"],
});

export const sold_items = new prom.ServerCounter({
    name: "al_sold_items_total",
    help: "How many items I sold",
    labelNames: ["item", "to"],
});

export const sales_gold = new prom.ServerCounter({
    name: "al_sales_gold_total",
    help: "How many gold I gained from sales",
    labelNames: ["to"],
});

export const ping = new prom.ServerGauge({
    name: "al_ping_seconds",
    help: "How is the ping with the server",
    collect() {
        this.set(parent.pings.reduce((a, b) => a + b) / parent.pings.length / 1000);
    },
});

// ======================
//  Non-server metrics
// ======================
export const level = new prom.Gauge({
    name: "al_level_total",
    help: "How many levels my characters have",
    collect() {
        this.set(character.level);
    },
});

export const exp = new prom.Gauge({
    name: "al_exp_total",
    help: "How many exp points my characters have",
    collect() {
        this.set(cumulatedXp[character.level] + character.xp);
    },
});

export const gold = new prom.Gauge({
    name: "al_gold_total",
    help: "How much gold do I have",
    collect() {
        this.set(character.gold);
    },
});

export const sent_gold = new prom.Counter({
    name: "al_sent_gold_total",
    help: "How much gold have I sent to others",
    labelNames: ["to"],
});

export const received_gold = new prom.Counter({
    name: "al_received_gold_total",
    help: "How much gold have I received from others",
    labelNames: ["from"],
});

export const failed_upgrades = new prom.Counter({
    name: "al_failed_upgrades_total",
    help: "How many upgrades I failed",
    labelNames: ["item", "level"],
});

export const success_upgrades = new prom.Counter({
    name: "al_success_upgrades_total",
    help: "How many upgrades I did successfully",
    labelNames: ["item", "level"],
});

export const failed_compounds = new prom.Counter({
    name: "al_failed_compounds_total",
    help: "How many compounds I failed",
    labelNames: ["item", "level"],
});

export const success_compounds = new prom.Counter({
    name: "al_success_compounds_total",
    help: "How many compounds I did successfully",
    labelNames: ["item", "level"],
});

// ======================
//    Events handling
// ======================
character.on("buy", (data) => {
    if (!data.q) {
        data.q = 1;
    }

    bought_items
        .labels({
            item: data.name,
            from: "npc",
        })
        .inc(data.q);

    spent_gold
        .labels({
            for: "npc",
        })
        .inc(data.cost);
});

character.on("sell", (data) => {
    if (!data.item.q) {
        data.item.q = 1;
    }

    sold_items
        .labels({
            item: data.item.name,
            to: "npc",
        })
        .inc(data.item.q);

    sales_gold
        .labels({
            to: "npc",
        })
        .inc(data.gold);
});

// Buy from Ponty
game.on("sbuy", ({ name, item }) => {
    if (name !== character.name) {
        return;
    }

    if (!item.q) {
        item.q = 1;
    }

    // @ts-ignore We remove the item id
    delete item.rid;

    bought_items
        .labels({
            item: item.name,
            from: "ponty",
        })
        .inc(item.q);

    const ponty_mult = item.cash
        ? G.multipliers.secondhands_cash_mult
        : G.multipliers.secondhands_mult;

    spent_gold
        .labels({
            for: "ponty",
        })
        .inc(calculate_item_value(item) * ponty_mult);
});

// Buy from Lost and Found
game.on("fbuy", ({ name, item }) => {
    if (name !== character.name) {
        return;
    }

    if (!item.q) {
        item.q = 1;
    }

    // @ts-ignore We remove the item id
    delete item.rid;

    bought_items
        .labels({
            item: item.name,
            from: "lost_and_found",
        })
        .inc(item.q);

    spent_gold
        .labels({
            for: "lost_and_found",
        })
        .inc(calculate_item_value(item) * G.multipliers.lostandfound_mult);
});

character.on("gold_sent", (data) => {
    if ("response" in data) {
        sent_gold.inc({ to: data.name }, data.gold);
    }
});

character.on("gold_received", (data) => {
    if ("response" in data) {
        received_gold.inc({ from: data.name }, data.gold);
    }
});

// Never worked and I don't know why. I use "hit" with data.kill instead.
// game.on("death", (data) => {
//     if (data.id === character.name) {
//         deaths.inc();
//     }
// });

character.on("loot", (data) => {
    looted_gold.inc(data.gold);

    if (data.items && data.items.length) {
        for (const item of data.items) {
            if (item.looter === character.name) {
                looted_items
                    .labels({
                        item: item.name,
                        level: item.level ?? 0,
                    })
                    .inc(item.q ?? 1);
            }
        }
    }
});

character.on("target_hit", (data) => {
    // If we are quick enough, the entity is still there.
    const entity = parent.entities[data.target];

    if (data.kill) {
        kills.labels({ enemy: entity?.mtype ?? "_unknown" }).inc();
    }

    if (typeof data.damage === "number") {
        damage_dealt
            .labels({
                damage_type: data.damage_type ?? "_unknown",
                monster: entity?.mtype ?? "_unknown",
                projectile: data.projectile ?? "_unknown",
                source: data.source ?? "_unknown",
            })
            .inc(data.damage);
    }
});

character.on("hit", (data) => {
    // If we are quick enough, the entity is still there.
    const entity = parent.entities[data.actor];

    if (typeof data.damage === "number") {
        damage_received
            .labels({
                damage_type: data.damage_type ?? "_unknown",
                monster: entity?.mtype ?? "_unknown",
                projectile: data.projectile ?? "_unknown",
                source: data.source ?? "_unknown",
            })
            .inc(data.damage);
    }

    if (data.kill) {
        deaths.inc();
    }
});

// ======================

export const PUBLISH_INTERVAL = 1000 * 1; // 1s

export async function publish_metrics() {
    await prom.pushToVM(METRICS_POST_URL, `Basic ${METRICS_AUTH_TOKEN}`);
}

export async function loop_publish_metrics() {
    try {
        await publish_metrics();
    } catch (err) {
        log("Error while pushing metrics.");
    }
    setTimeout(loop_publish_metrics, PUBLISH_INTERVAL);
}

loop_publish_metrics();
