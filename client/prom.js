const prom = (() => {
    const e =
        typeof globalThis !== "undefined"
            ? globalThis
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : typeof global !== "undefined"
            ? global
            : {};
    function t(e, t, s, r) {
        Object.defineProperty(e, t, {
            get: s,
            set: r,
            enumerable: !0,
            configurable: !0,
        });
    }
    const s = {};
    const r = {};
    let a = e.parcelRequire599d;
    a == null &&
        (((a = function (e) {
            if (e in s) return s[e].exports;
            if (e in r) {
                const t = r[e];
                delete r[e];
                const a = { id: e, exports: {} };
                return (s[e] = a), t.call(a.exports, a, a.exports), a.exports;
            }
            const i = new Error(`Cannot find module '${e}'`);
            throw ((i.code = "MODULE_NOT_FOUND"), i);
        }).register = function (e, t) {
            r[e] = t;
        }),
        (e.parcelRequire599d = a)),
        a.register("dbipy", (e, t) => {
            const s = a("akv27").getValueAsString;
            function r(e) {
                return e.replace(/\n/g, "\\n").replace(/\\(?!n)/g, "\\\\");
            }
            function i(e) {
                return typeof e !== "string" ? e : r(e).replace(/"/g, '\\"');
            }
            class n {
                constructor() {
                    (this._metrics = {}), (this._collectors = []), (this._defaultLabels = {});
                }

                getMetricsAsArray() {
                    return Object.values(this._metrics);
                }

                async getMetricAsPrometheusString(e, t = null) {
                    const a = await e.get();
                    const n = r(a.name);
                    const l = `# HELP ${n} ${r(a.help)}`;
                    const o = `# TYPE ${n} ${a.type}`;
                    const c = Object.keys(this._defaultLabels);
                    let u = "";
                    for (const e of a.values || []) {
                        if (((e.labels = e.labels || {}), c.length > 0)) {
                            e.labels = { ...e.labels };
                            for (const t of c) e.labels[t] = e.labels[t] || this._defaultLabels[t];
                        }
                        let r = e.metricName || a.name;
                        const n = Object.keys(e.labels);
                        const l = n.length;
                        if (l > 0) {
                            let t = "";
                            let s = 0;
                            for (; s < l - 1; s++) t += `${n[s]}="${i(e.labels[n[s]])}",`;
                            (t += `${n[s]}="${i(e.labels[n[s]])}"`), (r += `{${t}}`);
                        }
                        u += `${r} ${s(e.value)}${t ? ` ${t}` : ""}\n`;
                    }
                    return `${l}\n${o}\n${u}`.trim();
                }

                async metrics(e = null) {
                    const t = [];
                    for (const s of this.getMetricsAsArray())
                        t.push(this.getMetricAsPrometheusString(s, e));
                    return `${(await Promise.all(t)).join("\n\n")}\n`;
                }

                registerMetric(e) {
                    if (this._metrics[e.name] && this._metrics[e.name] !== e)
                        throw new Error(
                            `A metric with the name ${e.name} has already been registered.`,
                        );
                    this._metrics[e.name] = e;
                }

                clear() {
                    (this._metrics = {}), (this._defaultLabels = {});
                }

                async getMetricsAsJSON() {
                    const e = [];
                    const t = Object.keys(this._defaultLabels);
                    const s = [];
                    for (const e of this.getMetricsAsArray()) s.push(e.get());
                    const r = await Promise.all(s);
                    for (const s of r) {
                        if (s.values && t.length > 0)
                            for (const e of s.values) {
                                e.labels = { ...e.labels };
                                for (const s of t)
                                    e.labels[s] = e.labels[s] || this._defaultLabels[s];
                            }
                        e.push(s);
                    }
                    return e;
                }

                removeSingleMetric(e) {
                    delete this._metrics[e];
                }

                getSingleMetricAsString(e) {
                    return this.getMetricAsPrometheusString(this._metrics[e]);
                }

                getSingleMetric(e) {
                    return this._metrics[e];
                }

                setDefaultLabels(e) {
                    this._defaultLabels = e;
                }

                resetMetrics() {
                    for (const e in this._metrics) this._metrics[e].reset();
                }

                get contentType() {
                    return "text/plain; version=0.0.4; charset=utf-8";
                }

                static merge(e) {
                    const t = new n();
                    return (
                        e
                            .reduce((e, t) => e.concat(t.getMetricsAsArray()), [])
                            .forEach(t.registerMetric, t),
                        t
                    );
                }
            }
            (e.exports = n), (e.exports.globalRegistry = new n());
        }),
        a.register("akv27", (s, r) => {
            let a;
            let i;
            let n;
            let l;
            let o;
            let c;
            let u;
            t(
                s.exports,
                "getValueAsString",
                () => a,
                (e) => (a = e),
            ),
                t(
                    s.exports,
                    "hrtime",
                    () => i,
                    (e) => (i = e),
                ),
                t(
                    s.exports,
                    "removeLabels",
                    () => n,
                    (e) => (n = e),
                ),
                t(
                    s.exports,
                    "setValue",
                    () => l,
                    (e) => (l = e),
                ),
                t(
                    s.exports,
                    "getLabels",
                    () => o,
                    (e) => (o = e),
                ),
                t(
                    s.exports,
                    "hashObject",
                    () => c,
                    (e) => (c = e),
                ),
                t(
                    s.exports,
                    "isObject",
                    () => u,
                    (e) => (u = e),
                ),
                (a = function (e) {
                    return Number.isNaN(e)
                        ? "Nan"
                        : Number.isFinite(e)
                        ? `${e}`
                        : e < 0
                        ? "-Inf"
                        : "+Inf";
                });
            const h = e.performance || {};
            const b =
                h.now ||
                h.mozNow ||
                h.msNow ||
                h.oNow ||
                h.webkitNow ||
                function () {
                    return new Date().getTime();
                };
            function m(e) {
                let t = Object.keys(e);
                if (t.length === 0) return "";
                t.length > 1 && (t = t.sort());
                let s = "";
                let r = 0;
                const a = t.length;
                for (; r < a - 1; r++) s += `${t[r]}:${e[t[r]]},`;
                return (s += `${t[r]}:${e[t[r]]}`), s;
            }
            (i = function (e) {
                const t = 0.001 * b.call(h);
                let s = Math.floor(t);
                let r = Math.floor((t % 1) * 1e9);
                return e && ((s -= e[0]), (r -= e[1]), r < 0 && (s--, (r += 1e9))), [s, r];
            }),
                (n = function (e, t) {
                    delete e[m(t)];
                }),
                (l = function (e, t, s) {
                    return (
                        (e[m(s)] = {
                            value: typeof t === "number" ? t : 0,
                            labels: s || {},
                        }),
                        e
                    );
                }),
                (o = function (e, t) {
                    if (typeof t[0] === "object") return t[0];
                    if (e.length !== t.length) throw new Error("Invalid number of arguments");
                    const s = {};
                    for (let r = 0; r < e.length; r++) s[e[r]] = t[r];
                    return s;
                }),
                (c = m),
                (u = function (e) {
                    return e === Object(e);
                });
            class g extends Map {
                add(e, t) {
                    this.has(e) ? this.get(e).push(t) : this.set(e, [t]);
                }
            }
        }),
        a.register("4jGCD", (e, s) => {
            let r;
            let a;
            let i;
            t(
                e.exports,
                "validateMetricName",
                () => r,
                (e) => (r = e),
            ),
                t(
                    e.exports,
                    "validateLabelName",
                    () => a,
                    (e) => (a = e),
                ),
                t(
                    e.exports,
                    "validateLabel",
                    () => i,
                    (e) => (i = e),
                );
            const n = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;
            const l = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
            (r = function (e) {
                return n.test(e);
            }),
                (a = function (e = []) {
                    return e.every((e) => l.test(e));
                }),
                (i = function (e, t) {
                    for (const s in t)
                        if (!e.includes(s))
                            throw new Error(
                                `Added label "${s}" is not included in initial labelset: ${e}`,
                            );
                });
        }),
        a.register("lRKyl", (e, t) => {
            const s = a("akv27");
            const r = s.hashObject;
            const i = s.isObject;
            const n = s.getLabels;
            const l = s.removeLabels;
            const o = a("4jGCD").validateLabel;
            const c = a("5xkNv").Metric;
            function u(e, t, s = {}, r = "") {
                return e[r] ? (e[r].value += t) : (e[r] = { value: t, labels: s }), e;
            }
            e.exports = class extends c {
                inc(e, t) {
                    let s;
                    if (
                        (i(e) ? ((s = r(e)), o(this.labelNames, e)) : ((t = e), (e = {})),
                        t && !Number.isFinite(t))
                    )
                        throw new TypeError(`Value is not a valid number: ${t}`);
                    if (t < 0) throw new Error("It is not possible to decrease a counter");
                    t == null && (t = 1), u(this.hashMap, t, e, s);
                }

                reset() {
                    (this.hashMap = {}), this.labelNames.length === 0 && u(this.hashMap, 0);
                }

                async get() {
                    if (this.collect) {
                        const e = this.collect();
                        e instanceof Promise && (await e);
                    }
                    return {
                        help: this.help,
                        name: this.name,
                        type: "counter",
                        values: Object.values(this.hashMap),
                        aggregator: this.aggregator,
                    };
                }

                labels(...e) {
                    const t = n(this.labelNames, e) || {};
                    return { inc: this.inc.bind(this, t) };
                }

                remove(...e) {
                    const t = n(this.labelNames, e) || {};
                    return o(this.labelNames, t), l.call(this, this.hashMap, t);
                }
            };
        }),
        a.register("5xkNv", (e, t) => {
            const s = a("dbipy").globalRegistry;
            const r = a("akv27").isObject;
            const i = a("4jGCD");
            const n = i.validateMetricName;
            const l = i.validateLabelName;
            e.exports = {
                Metric: class {
                    constructor(e, t = {}) {
                        if (!r(e)) throw new TypeError("constructor expected a config object");
                        if (
                            (Object.assign(
                                this,
                                {
                                    labelNames: [],
                                    registers: [s],
                                    aggregator: "sum",
                                },
                                t,
                                e,
                            ),
                            this.registers || (this.registers = [s]),
                            !this.help)
                        )
                            throw new Error("Missing mandatory help parameter");
                        if (!this.name) throw new Error("Missing mandatory name parameter");
                        if (!n(this.name)) throw new Error("Invalid metric name");
                        if (!l(this.labelNames)) throw new Error("Invalid label name");
                        if (this.collect && typeof this.collect !== "function")
                            throw new Error('Optional "collect" parameter must be a function');
                        this.reset();
                        for (const e of this.registers) e.registerMetric(this);
                    }

                    reset() {}
                },
            };
        }),
        a.register("jxOKZ", (e, t) => {
            const s = a("akv27");
            const r = s.setValue;
            const i = s.getLabels;
            const n = s.hashObject;
            const l = s.isObject;
            const o = s.removeLabels;
            const c = s.hrtime;
            const u = a("4jGCD").validateLabel;
            const h = a("5xkNv").Metric;
            function b(e, t, s) {
                if (typeof s !== "number") throw new TypeError(`Value is not a valid number: ${s}`);
                u(e.labelNames, t), r(e.hashMap, s, t);
            }
            function m(e) {
                return l(e) ? e : {};
            }
            function g(e, t) {
                return l(e) ? t : e;
            }
            e.exports = class extends h {
                set(e, t) {
                    (t = g(e, t)), b(this, (e = m(e)), t);
                }

                reset() {
                    (this.hashMap = {}), this.labelNames.length === 0 && r(this.hashMap, 0, {});
                }

                inc(e, t) {
                    void 0 === (t = g(e, t)) && (t = 1), b(this, (e = m(e)), this._getValue(e) + t);
                }

                dec(e, t) {
                    void 0 === (t = g(e, t)) && (t = 1), b(this, (e = m(e)), this._getValue(e) - t);
                }

                setToCurrentTime(e) {
                    const t = Date.now() / 1e3;
                    void 0 === e ? this.set(t) : this.set(e, t);
                }

                startTimer(e) {
                    const t = c();
                    return (s) => {
                        const r = c(t);
                        const a = r[0] + r[1] / 1e9;
                        return this.set({ ...e, ...s }, a), a;
                    };
                }

                async get() {
                    if (this.collect) {
                        const e = this.collect();
                        e instanceof Promise && (await e);
                    }
                    return {
                        help: this.help,
                        name: this.name,
                        type: "gauge",
                        values: Object.values(this.hashMap),
                        aggregator: this.aggregator,
                    };
                }

                _getValue(e) {
                    const t = n(e || {});
                    return this.hashMap[t] ? this.hashMap[t].value : 0;
                }

                labels(...e) {
                    const t = i(this.labelNames, e);
                    return (
                        u(this.labelNames, t),
                        {
                            inc: this.inc.bind(this, t),
                            dec: this.dec.bind(this, t),
                            set: this.set.bind(this, t),
                            setToCurrentTime: this.setToCurrentTime.bind(this, t),
                            startTimer: this.startTimer.bind(this, t),
                        }
                    );
                }

                remove(...e) {
                    const t = i(this.labelNames, e);
                    u(this.labelNames, t), o.call(this, this.hashMap, t);
                }
            };
        });
    const i = a("akv27").getLabels;
    async function n(e = "", t = {}, s = {}) {
        const r = typeof t === "string";
        const a = r ? t : JSON.stringify(t);
        return await fetch(e, {
            method: "POST",
            headers: {
                "Content-Type": r ? "text/plain" : "application/json",
                "Content-Length": a.length,
                ...s,
            },
            /* credentials: "include", */
            body: a,
        });
    }
    const l = {
        register: a("dbipy").globalRegistry,
        Registry: a("dbipy"),
        contentType: a("dbipy").globalRegistry.contentType,
        validateMetricName: a("4jGCD").validateMetricName,
        Counter: a("lRKyl"),
        Gauge: a("jxOKZ"),
        postData: n,
        async postWithAuth(e, t, s) {
            if (s) {
                return await n(e, t, { authorization: s });
            }

            return await n(e, t);
        },
        async pushToVM(e, t) {
            return await l.postWithAuth(e, await l.register.metrics(), t);
        },
    };
    const o = server.region + server.id;
    function c(e, t) {
        return typeof e === "number"
            ? { labels: { server: o }, value: e }
            : (e
                  ? Array.isArray(e) && !e.includes(o)
                      ? e.push(o)
                      : e.server || (e.server = o)
                  : (e = { server: o }),
              { labels: e, value: t });
    }
    (l.ServerCounter = class extends l.Counter {
        constructor(e) {
            e || (e = {}),
                e.labelNames || (e.labelNames = []),
                e.labelNames.includes("server") || e.labelNames.push("server"),
                super(e);
        }

        inc(e, t) {
            const { labels: s, value: r } = c(e, t);
            return super.inc(s, r);
        }

        labels(...e) {
            const t = i(this.labelNames, e) || {};
            return (t.server = o), super.labels(t);
        }

        remove(...e) {
            const t = i(this.labelNames, e) || {};
            return (t.server = o), super.remove(t);
        }
    }),
        (l.ServerGauge = class extends l.Gauge {
            constructor(e) {
                e || (e = {}),
                    e.labelNames || (e.labelNames = []),
                    e.labelNames.includes("server") || e.labelNames.push("server"),
                    super(e);
            }

            set(e, t) {
                const { labels: s, value: r } = c(e, t);
                return super.set(s, r);
            }

            inc(e, t) {
                const { labels: s, value: r } = c(e, t);
                return super.inc(s, r);
            }

            dec(e, t) {
                const { labels: s, value: r } = c(e, t);
                return super.dec(s, r);
            }

            labels(...e) {
                const t = i(this.labelNames, e) || {};
                return (t.server = o), super.labels(t);
            }

            remove(...e) {
                const t = i(this.labelNames, e) || {};
                return (t.server = o), super.remove(t);
            }
        });
    globalThis.prom = l;
    return globalThis.prom;
})();
module.exports.prom = prom;
