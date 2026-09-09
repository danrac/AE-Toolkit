#target aftereffects

(function NullAnimPresetTool(thisObj) {

    // =========================================================
    // JSON COMPATIBILITY FALLBACK
    // =========================================================
    if (typeof JSON === "undefined") {
        JSON = {};
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            function escapeString(str) {
                return '"' + str
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\r/g, "\\r")
                    .replace(/\n/g, "\\n")
                    .replace(/\t/g, "\\t")
                    .replace(/\f/g, "\\f")
                    .replace(/\b/g, "\\b") + '"';
            }

            function stringifyValue(val, indent, gap) {
                var i, key, arr, parts, isFirst, nextIndent;

                if (val === null) return "null";

                if (val === undefined) return "null";

                if (typeof val === "number" || typeof val === "boolean") {
                    return String(val);
                }

                if (typeof val === "string") {
                    return escapeString(val);
                }

                if (val.constructor === Array) {
                    arr = [];
                    nextIndent = indent + gap;

                    for (i = 0; i < val.length; i++) {
                        arr.push(stringifyValue(val[i], nextIndent, gap));
                    }

                    if (gap === "") {
                        return "[" + arr.join(",") + "]";
                    } else {
                        if (arr.length === 0) return "[]";
                        return "[\n" + nextIndent + arr.join(",\n" + nextIndent) + "\n" + indent + "]";
                    }
                }

                if (typeof val === "object") {
                    parts = [];
                    nextIndent = indent + gap;
                    isFirst = true;

                    for (key in val) {
                        if (val.hasOwnProperty(key)) {
                            if (typeof val[key] !== "function" && typeof val[key] !== "undefined") {
                                if (gap === "") {
                                    parts.push(escapeString(key) + ":" + stringifyValue(val[key], nextIndent, gap));
                                } else {
                                    parts.push(escapeString(key) + ": " + stringifyValue(val[key], nextIndent, gap));
                                }
                            }
                        }
                    }

                    if (gap === "") {
                        return "{" + parts.join(",") + "}";
                    } else {
                        if (parts.length === 0) return "{}";
                        return "{\n" + nextIndent + parts.join(",\n" + nextIndent) + "\n" + indent + "}";
                    }
                }

                return "null";
            }

            var gap = "";
            var i;

            if (typeof space === "number") {
                for (i = 0; i < space; i++) gap += " ";
            } else if (typeof space === "string") {
                gap = space;
            }

            return stringifyValue(value, "", gap);
        };
    }

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text) {
            return eval("(" + text + ")");
        };
    }

    // =========================================================
    // CONFIG
    // =========================================================
    var PANEL_NAME = "Null Animation Presets";
    var PRESET_FOLDER_NAME = "NullAnimPresetData";
    var PRESET_FILE_NAME = "NullAnimationPresets.json";
    var DEFAULT_DURATION = 3.0;
    var DEFAULT_AMOUNT = 10.0;
    var DEFAULT_EASE_INFLUENCE = 33.0;

    // =========================================================
    // BASIC HELPERS
    // =========================================================
    function trimString(str) {
        if (str === null || str === undefined) return "";
        return str.toString().replace(/^\s+|\s+$/g, "");
    }

    function parseFloatSafe(v, fallback) {
        var n = parseFloat(v);
        if (isNaN(n)) return fallback;
        return n;
    }

    function isArrayValue(v) {
        return v !== null && v !== undefined && v.constructor === Array;
    }

    function cloneValue(v) {
        var i, out;
        if (!isArrayValue(v)) return v;
        out = [];
        for (i = 0; i < v.length; i++) out.push(v[i]);
        return out;
    }

    function ensureJSONAvailable() {
        if (typeof JSON === "undefined" || !JSON.parse || !JSON.stringify) {
            alert("JSON support could not be initialized.");
            return false;
        }
        return true;
    }

    function formatNumberForUI(n) {
        var s;
        if (n === null || n === undefined) return "";
        if (Math.abs(n - Math.round(n)) < 0.000001) {
            return Math.round(n).toString();
        }
        s = n.toFixed(3);
        s = s.replace(/0+$/g, "");
        s = s.replace(/\.$/g, "");
        return s;
    }

    function getScriptFolder() {
        var f = new File($.fileName);
        return f.parent;
    }

    function getPresetFolder() {
        var folder = new Folder(getScriptFolder().fsName + "/" + PRESET_FOLDER_NAME);
        if (!folder.exists) {
            folder.create();
        }
        return folder;
    }

    function getPresetFile() {
        var folder = getPresetFolder();
        return new File(folder.fsName + "/" + PRESET_FILE_NAME);
    }

    function addValues(a, b) {
        var i, out;
        if (!isArrayValue(a) && !isArrayValue(b)) {
            return a + b;
        }

        out = [];
        for (i = 0; i < a.length; i++) {
            out.push(a[i] + (i < b.length ? b[i] : 0));
        }
        return out;
    }

    function scaleValue(v, mult) {
        var i, out;
        if (!isArrayValue(v)) return v * mult;

        out = [];
        for (i = 0; i < v.length; i++) out.push(v[i] * mult);
        return out;
    }

    function ensure2DArray(v) {
        var out = [0, 0];
        if (isArrayValue(v)) {
            if (v.length > 0) out[0] = v[0];
            if (v.length > 1) out[1] = v[1];
        }
        return out;
    }

    function addScaleDeltaToCurrent(currentScale, deltaScale) {
        var out = cloneValue(currentScale);
        if (!isArrayValue(out)) return currentScale + deltaScale;

        if (out.length > 0) out[0] += (deltaScale.length > 0 ? deltaScale[0] : 0);
        if (out.length > 1) out[1] += (deltaScale.length > 1 ? deltaScale[1] : 0);
        if (out.length > 2) out[2] += (deltaScale.length > 2 ? deltaScale[2] : 0);

        return out;
    }

    function maxAbsFromValue(v) {
        var i, m;
        if (!isArrayValue(v)) return Math.abs(v);

        m = 0;
        for (i = 0; i < v.length; i++) {
            if (Math.abs(v[i]) > m) m = Math.abs(v[i]);
        }
        return m;
    }

    // =========================================================
    // AE PROPERTY HELPERS
    // =========================================================
    function getActiveComp() {
        if (app.project && app.project.activeItem && app.project.activeItem instanceof CompItem) {
            return app.project.activeItem;
        }
        return null;
    }

    function getTransformGroup(layer) {
        return layer.property("ADBE Transform Group");
    }

    function getPositionProp(layer) {
        var tr = getTransformGroup(layer);
        if (!tr) return null;
        return tr.property("ADBE Position");
    }

    function getXPositionProp(layer) {
        var tr = getTransformGroup(layer);
        if (!tr) return null;
        var p = tr.property("ADBE Position");
        if (!p) return null;
        if (p.dimensionsSeparated) {
            return tr.property("ADBE Position_0");
        }
        return null;
    }

    function getYPositionProp(layer) {
        var tr = getTransformGroup(layer);
        if (!tr) return null;
        var p = tr.property("ADBE Position");
        if (!p) return null;
        if (p.dimensionsSeparated) {
            return tr.property("ADBE Position_1");
        }
        return null;
    }

    function getRotationProp(layer) {
        var tr = getTransformGroup(layer);
        if (!tr) return null;
        return tr.property("ADBE Rotate Z");
    }

    function getScaleProp(layer) {
        var tr = getTransformGroup(layer);
        if (!tr) return null;
        return tr.property("ADBE Scale");
    }

    function ensureSeparatedPosition(layer) {
        var p = getPositionProp(layer);
        if (p && p.isSeparationLeader && !p.dimensionsSeparated) {
            p.dimensionsSeparated = true;
        }
    }

    function ensureUnifiedPosition(layer) {
        var p = getPositionProp(layer);
        if (p && p.isSeparationLeader && p.dimensionsSeparated) {
            p.dimensionsSeparated = false;
        }
    }

    function classifyProperty(prop) {
        if (!prop) return "";
        if (!(prop instanceof Property)) return "";

        if (prop.matchName === "ADBE Position") return "position2D";
        if (prop.matchName === "ADBE Position_0" || prop.name === "X Position") return "xPosition";
        if (prop.matchName === "ADBE Position_1" || prop.name === "Y Position") return "yPosition";
        if (prop.matchName === "ADBE Rotate Z" || prop.name === "Rotation") return "rotation";
        if (prop.matchName === "ADBE Scale" || prop.name === "Scale") return "scale";

        return "";
    }

    function getSelectedKeysSorted(prop) {
        var out = [];
        var i;
        if (!prop || !prop.selectedKeys || prop.selectedKeys.length < 1) return out;

        for (i = 0; i < prop.selectedKeys.length; i++) {
            out.push(prop.selectedKeys[i]);
        }

        out.sort(function (a, b) { return a - b; });
        return out;
    }

    function getAllSelectedPropertyCaptures(layer) {
        var selectedProps = layer.selectedProperties;
        var captures = [];
        var earliestTime = null;
        var i, prop, keys, k, kind;

        if (!selectedProps || selectedProps.length < 1) return null;

        for (i = 0; i < selectedProps.length; i++) {
            prop = selectedProps[i];
            if (!(prop instanceof Property)) continue;

            kind = classifyProperty(prop);
            if (kind === "") continue;

            keys = getSelectedKeysSorted(prop);
            if (keys.length < 2) continue;

            for (k = 0; k < keys.length; k++) {
                if (earliestTime === null || prop.keyTime(keys[k]) < earliestTime) {
                    earliestTime = prop.keyTime(keys[k]);
                }
            }

            captures.push({
                prop: prop,
                kind: kind,
                keys: keys
            });
        }

        if (captures.length < 1) return null;

        return {
            captures: captures,
            earliestTime: earliestTime
        };
    }

    // =========================================================
    // EASE / INTERP SERIALIZATION
    // =========================================================
    function interpTypeToString(interp) {
        if (interp === KeyframeInterpolationType.BEZIER) return "BEZIER";
        if (interp === KeyframeInterpolationType.HOLD) return "HOLD";
        return "LINEAR";
    }

    function stringToInterpType(str) {
        if (str === "BEZIER") return KeyframeInterpolationType.BEZIER;
        if (str === "HOLD") return KeyframeInterpolationType.HOLD;
        return KeyframeInterpolationType.LINEAR;
    }

    function serializeEaseArray(easeArr) {
        var out = [];
        var i;
        if (!easeArr) return out;

        for (i = 0; i < easeArr.length; i++) {
            out.push({
                speed: easeArr[i].speed,
                influence: easeArr[i].influence
            });
        }
        return out;
    }

    function pickEaseDimension(easeData, dimIndex) {
        var out = [];
        if (!easeData || easeData.length < 1) {
            out.push(new KeyframeEase(0, DEFAULT_EASE_INFLUENCE));
            return out;
        }

        if (dimIndex < 0) dimIndex = 0;
        if (dimIndex >= easeData.length) dimIndex = easeData.length - 1;

        out.push(new KeyframeEase(easeData[dimIndex].speed, easeData[dimIndex].influence));
        return out;
    }

    function padEaseArrayToLength(easeData, len) {
        var out = [];
        var i, idx;

        if (!easeData || easeData.length < 1) {
            for (i = 0; i < len; i++) {
                out.push(new KeyframeEase(0, DEFAULT_EASE_INFLUENCE));
            }
            return out;
        }

        for (i = 0; i < len; i++) {
            idx = i;
            if (idx >= easeData.length) idx = easeData.length - 1;
            out.push(new KeyframeEase(easeData[idx].speed, easeData[idx].influence));
        }

        return out;
    }

    // =========================================================
    // PRESET DATA HELPERS
    // =========================================================
    function buildDefaultPresetData() {
        return [
            {
                name: "Push Left",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "xPosition",
                        isSpatial: false,
                        keys: [
                            {
                                time: 0,
                                valueDelta: 0,
                                inInterp: "BEZIER",
                                outInterp: "BEZIER",
                                inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }],
                                outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }],
                                temporalAutoBezier: false,
                                temporalContinuous: false
                            },
                            {
                                time: 1,
                                valueDelta: -10,
                                inInterp: "BEZIER",
                                outInterp: "BEZIER",
                                inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }],
                                outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }],
                                temporalAutoBezier: false,
                                temporalContinuous: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Push Right",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "xPosition",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: 0, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: 10, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            },
            {
                name: "Push Up",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "yPosition",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: 0, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: -10, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            },
            {
                name: "Push Down",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "yPosition",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: 0, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: 10, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            },
            {
                name: "Scale Up",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "scale",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: [0, 0], inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: [10, 10], inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            },
            {
                name: "Scale Down",
                duration: 1,
                amount: 10,
                properties: [
                    {
                        kind: "scale",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: [0, 0], inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: [-10, -10], inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }, { speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            },
            {
                name: "Rotate 360",
                duration: 1,
                amount: 360,
                properties: [
                    {
                        kind: "rotation",
                        isSpatial: false,
                        keys: [
                            { time: 0, valueDelta: 0, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false },
                            { time: 1, valueDelta: 360, inInterp: "BEZIER", outInterp: "BEZIER", inEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], outEase: [{ speed: 0, influence: DEFAULT_EASE_INFLUENCE }], temporalAutoBezier: false, temporalContinuous: false }
                        ]
                    }
                ]
            }
        ];
    }

    function ensurePresetFileExists() {
        var file = getPresetFile();
        var defaults;

        if (!file.exists) {
            defaults = buildDefaultPresetData();
            if (file.open("w")) {
                file.encoding = "UTF-8";
                file.write(JSON.stringify(defaults, null, 2));
                file.close();
            } else {
                alert("Could not create preset file:\n" + file.fsName);
            }
        }
    }

    function normalizeLoadedPreset(preset) {
        if (preset.duration === undefined || preset.duration === null || preset.duration <= 0) {
            preset.duration = DEFAULT_DURATION;
        }

        if (preset.amount === undefined || preset.amount === null) {
            preset.amount = DEFAULT_AMOUNT;
        }

        if (!preset.properties) {
            preset.properties = [];
        }

        return preset;
    }

    function loadPresets() {
        var file, txt, data, i;
        if (!ensureJSONAvailable()) return [];

        ensurePresetFileExists();
        file = getPresetFile();

        if (!file.exists) return [];

        if (!file.open("r")) {
            alert("Could not open preset file:\n" + file.fsName);
            return [];
        }

        file.encoding = "UTF-8";
        txt = file.read();
        file.close();

        if (trimString(txt) === "") return [];

        data = JSON.parse(txt);
        if (!data || !isArrayValue(data)) return [];

        for (i = 0; i < data.length; i++) {
            normalizeLoadedPreset(data[i]);
        }

        return data;
    }

    function savePresets(presets) {
        var file;
        if (!ensureJSONAvailable()) return false;

        file = getPresetFile();
        if (!file.open("w")) {
            alert("Could not write preset file:\n" + file.fsName);
            return false;
        }

        file.encoding = "UTF-8";
        file.write(JSON.stringify(presets, null, 2));
        file.close();
        return true;
    }

    function findPresetIndexByName(presets, name) {
        var i;
        for (i = 0; i < presets.length; i++) {
            if (presets[i].name === name) return i;
        }
        return -1;
    }

    function inferPresetAmountFromProperties(properties) {
        var i, propData, lastKey, amt, maxAmt;
        maxAmt = 0;

        for (i = 0; i < properties.length; i++) {
            propData = properties[i];
            if (!propData.keys || propData.keys.length < 1) continue;

            lastKey = propData.keys[propData.keys.length - 1];
            amt = maxAbsFromValue(lastKey.valueDelta);

            if (amt > maxAmt) {
                maxAmt = amt;
            }
        }

        if (maxAmt <= 0) {
            maxAmt = DEFAULT_AMOUNT;
        }

        return maxAmt;
    }

    // =========================================================
    // CAPTURE SELECTED ANIMATION
    // =========================================================
    function capturePropertyData(prop, kind, selectedKeys, earliestTime) {
        var keyDataArr = [];
        var firstKeyIndex = selectedKeys[0];
        var baseValue = prop.keyValue(firstKeyIndex);
        var i, k, keyVal, valueDelta, kd;

        for (i = 0; i < selectedKeys.length; i++) {
            k = selectedKeys[i];
            keyVal = prop.keyValue(k);

            if (kind === "scale" || kind === "position2D") {
                valueDelta = addValues(keyVal, scaleValue(baseValue, -1));
            } else {
                valueDelta = keyVal - baseValue;
            }

            kd = {
                time: prop.keyTime(k) - earliestTime,
                valueDelta: cloneValue(valueDelta),
                inInterp: interpTypeToString(prop.keyInInterpolationType(k)),
                outInterp: interpTypeToString(prop.keyOutInterpolationType(k)),
                inEase: serializeEaseArray(prop.keyInTemporalEase(k)),
                outEase: serializeEaseArray(prop.keyOutTemporalEase(k)),
                temporalAutoBezier: prop.keyTemporalAutoBezier(k),
                temporalContinuous: prop.keyTemporalContinuous(k)
            };

            if (prop.isSpatial && kind === "position2D") {
                kd.inSpatialTangent = cloneValue(prop.keyInSpatialTangent(k));
                kd.outSpatialTangent = cloneValue(prop.keyOutSpatialTangent(k));
                kd.spatialAutoBezier = prop.keySpatialAutoBezier(k);
                kd.spatialContinuous = prop.keySpatialContinuous(k);
            }

            keyDataArr.push(kd);
        }

        return {
            kind: kind,
            isSpatial: (prop.isSpatial && kind === "position2D"),
            keys: keyDataArr
        };
    }

    function captureSelectedAnimationAsPreset(presetName) {
        var comp = getActiveComp();
        var layers, layer, selectionData, captures, i, c, propData, maxTime, preset, inferredAmount;

        if (!comp) {
            alert("Please select a composition.");
            return null;
        }

        layers = comp.selectedLayers;
        if (!layers || layers.length < 1) {
            alert("Please select at least one layer.");
            return null;
        }

        layer = layers[0];
        selectionData = getAllSelectedPropertyCaptures(layer);

        if (!selectionData || !selectionData.captures || selectionData.captures.length < 1) {
            alert("Select at least two keyframes on one or more supported properties:\n\nPosition, X Position, Y Position, Rotation, or Scale.");
            return null;
        }

        captures = [];
        maxTime = 0;

        for (i = 0; i < selectionData.captures.length; i++) {
            c = selectionData.captures[i];
            propData = capturePropertyData(c.prop, c.kind, c.keys, selectionData.earliestTime);
            if (propData) {
                captures.push(propData);
                if (propData.keys.length > 0) {
                    if (propData.keys[propData.keys.length - 1].time > maxTime) {
                        maxTime = propData.keys[propData.keys.length - 1].time;
                    }
                }
            }
        }

        if (captures.length < 1) {
            alert("No supported keyed properties were found.");
            return null;
        }

        inferredAmount = inferPresetAmountFromProperties(captures);

        preset = {
            name: presetName,
            duration: maxTime > 0 ? maxTime : DEFAULT_DURATION,
            amount: inferredAmount,
            properties: captures
        };

        return preset;
    }

    function saveOrReplacePreset(presetObj) {
        var presets = loadPresets();
        var idx = findPresetIndexByName(presets, presetObj.name);

        if (idx >= 0) {
            presets[idx] = presetObj;
        } else {
            presets.push(presetObj);
        }

        return savePresets(presets);
    }

    function deletePresetByName(name) {
        var presets = loadPresets();
        var idx = findPresetIndexByName(presets, name);
        var i, newPresets;

        if (idx < 0) {
            return false;
        }

        newPresets = [];
        for (i = 0; i < presets.length; i++) {
            if (i !== idx) {
                newPresets.push(presets[i]);
            }
        }

        return savePresets(newPresets);
    }

    // =========================================================
    // APPLY PRESET
    // =========================================================
    function shouldApplyKind(kind, opts) {
        if (kind === "position2D") return (opts.useX || opts.useY);
        if (kind === "xPosition") return opts.useX;
        if (kind === "yPosition") return opts.useY;
        if (kind === "rotation") return opts.useRotation;
        if (kind === "scale") return opts.useScale;
        return false;
    }

    function amountMultiplierForKind(kind, uiAmountValue, presetAmountValue) {
        var baseAmt = presetAmountValue;

        if (baseAmt === undefined || baseAmt === null || Math.abs(baseAmt) < 0.000001) {
            baseAmt = DEFAULT_AMOUNT;
        }

        if (kind === "xPosition" || kind === "yPosition" || kind === "position2D" || kind === "scale") {
            return uiAmountValue / baseAmt;
        }

        return 1.0;
    }

    function setKeyInterpolationAndEase1D(prop, keyIndex, keyData, dimIndex) {
        prop.setInterpolationTypeAtKey(
            keyIndex,
            stringToInterpType(keyData.inInterp),
            stringToInterpType(keyData.outInterp)
        );

        prop.setTemporalEaseAtKey(
            keyIndex,
            pickEaseDimension(keyData.inEase, dimIndex),
            pickEaseDimension(keyData.outEase, dimIndex)
        );

        prop.setTemporalAutoBezierAtKey(keyIndex, keyData.temporalAutoBezier);
        prop.setTemporalContinuousAtKey(keyIndex, keyData.temporalContinuous);
    }

    function setKeyInterpolationAndEaseMulti(prop, keyIndex, keyData, dimCount) {
        prop.setInterpolationTypeAtKey(
            keyIndex,
            stringToInterpType(keyData.inInterp),
            stringToInterpType(keyData.outInterp)
        );

        prop.setTemporalEaseAtKey(
            keyIndex,
            padEaseArrayToLength(keyData.inEase, dimCount),
            padEaseArrayToLength(keyData.outEase, dimCount)
        );

        prop.setTemporalAutoBezierAtKey(keyIndex, keyData.temporalAutoBezier);
        prop.setTemporalContinuousAtKey(keyIndex, keyData.temporalContinuous);
    }

    function apply1DPropertyCapturedData(prop, propertyData, startTime, timeScale, amountMult, currentBaseValue) {
        var i, keyData, keyTime, keyIndex, finalVal;

        for (i = 0; i < propertyData.keys.length; i++) {
            keyData = propertyData.keys[i];
            keyTime = startTime + (keyData.time * timeScale);
            finalVal = currentBaseValue + (keyData.valueDelta * amountMult);

            keyIndex = prop.addKey(keyTime);
            prop.setValueAtKey(keyIndex, finalVal);
            setKeyInterpolationAndEase1D(prop, keyIndex, keyData, 0);
        }
    }

    function apply2DScaleCapturedData(prop, propertyData, startTime, timeScale, amountMult, currentBaseValue) {
        var i, keyData, keyTime, keyIndex, scaledDelta, finalVal, dimCount;

        dimCount = currentBaseValue.length;

        for (i = 0; i < propertyData.keys.length; i++) {
            keyData = propertyData.keys[i];
            keyTime = startTime + (keyData.time * timeScale);
            scaledDelta = scaleValue(keyData.valueDelta, amountMult);
            finalVal = addScaleDeltaToCurrent(currentBaseValue, scaledDelta);

            keyIndex = prop.addKey(keyTime);
            prop.setValueAtKey(keyIndex, finalVal);
            setKeyInterpolationAndEaseMulti(prop, keyIndex, keyData, dimCount);
        }
    }

    function apply2DPositionCapturedData(prop, propertyData, startTime, timeScale, amountMult, currentBaseValue) {
        var i, keyData, keyTime, keyIndex, scaledDelta, finalVal;

        for (i = 0; i < propertyData.keys.length; i++) {
            keyData = propertyData.keys[i];
            keyTime = startTime + (keyData.time * timeScale);
            scaledDelta = scaleValue(keyData.valueDelta, amountMult);
            finalVal = addValues(currentBaseValue, scaledDelta);

            keyIndex = prop.addKey(keyTime);
            prop.setValueAtKey(keyIndex, finalVal);
            setKeyInterpolationAndEaseMulti(prop, keyIndex, keyData, 2);

            if (propertyData.isSpatial && keyData.inSpatialTangent && keyData.outSpatialTangent) {
                prop.setSpatialTangentsAtKey(
                    keyIndex,
                    cloneValue(keyData.inSpatialTangent),
                    cloneValue(keyData.outSpatialTangent)
                );
                prop.setSpatialAutoBezierAtKey(keyIndex, keyData.spatialAutoBezier);
                prop.setSpatialContinuousAtKey(keyIndex, keyData.spatialContinuous);
            }
        }
    }

    function applyPosition2DAsSeparated(layer, propertyData, startTime, timeScale, amountMult, opts) {
        var xProp, yProp, posBase, xBase, yBase;
        var i, keyData, keyTime, xIndex, yIndex, xVal, yVal, delta;

        ensureSeparatedPosition(layer);
        xProp = getXPositionProp(layer);
        yProp = getYPositionProp(layer);

        if (!xProp || !yProp) return;

        posBase = getPositionProp(layer).value;
        xBase = posBase[0];
        yBase = posBase[1];

        for (i = 0; i < propertyData.keys.length; i++) {
            keyData = propertyData.keys[i];
            keyTime = startTime + (keyData.time * timeScale);
            delta = scaleValue(ensure2DArray(keyData.valueDelta), amountMult);

            if (opts.useX) {
                xVal = xBase + delta[0];
                xIndex = xProp.addKey(keyTime);
                xProp.setValueAtKey(xIndex, xVal);
                setKeyInterpolationAndEase1D(xProp, xIndex, keyData, 0);
            }

            if (opts.useY) {
                yVal = yBase + delta[1];
                yIndex = yProp.addKey(keyTime);
                yProp.setValueAtKey(yIndex, yVal);
                setKeyInterpolationAndEase1D(yProp, yIndex, keyData, 1);
            }
        }
    }

    function applyPresetToLayer(layer, presetObj, opts) {
        var comp = layer.containingComp;
        var startTime = comp.time;
        var sourceDuration = presetObj.duration > 0 ? presetObj.duration : 1.0;
        var timeScale = opts.duration / sourceDuration;
        var i, pd, amountMult, targetProp, currentBaseValue;

        for (i = 0; i < presetObj.properties.length; i++) {
            pd = presetObj.properties[i];

            if (!shouldApplyKind(pd.kind, opts)) {
                continue;
            }

            amountMult = amountMultiplierForKind(pd.kind, opts.amount, presetObj.amount);

            if (pd.kind === "position2D") {
                if (opts.useX && opts.useY && opts.preserve2DPositionTangents && pd.isSpatial) {
                    ensureUnifiedPosition(layer);
                    targetProp = getPositionProp(layer);
                    if (targetProp) {
                        currentBaseValue = cloneValue(targetProp.value);
                        apply2DPositionCapturedData(targetProp, pd, startTime, timeScale, amountMult, currentBaseValue);
                    }
                } else {
                    applyPosition2DAsSeparated(layer, pd, startTime, timeScale, amountMult, opts);
                }
            }
            else if (pd.kind === "xPosition") {
                ensureSeparatedPosition(layer);
                targetProp = getXPositionProp(layer);
                if (targetProp) {
                    currentBaseValue = targetProp.value;
                    apply1DPropertyCapturedData(targetProp, pd, startTime, timeScale, amountMult, currentBaseValue);
                }
            }
            else if (pd.kind === "yPosition") {
                ensureSeparatedPosition(layer);
                targetProp = getYPositionProp(layer);
                if (targetProp) {
                    currentBaseValue = targetProp.value;
                    apply1DPropertyCapturedData(targetProp, pd, startTime, timeScale, amountMult, currentBaseValue);
                }
            }
            else if (pd.kind === "rotation") {
                targetProp = getRotationProp(layer);
                if (targetProp) {
                    currentBaseValue = targetProp.value;
                    apply1DPropertyCapturedData(targetProp, pd, startTime, timeScale, amountMult, currentBaseValue);
                }
            }
            else if (pd.kind === "scale") {
                targetProp = getScaleProp(layer);
                if (targetProp) {
                    currentBaseValue = cloneValue(targetProp.value);
                    apply2DScaleCapturedData(targetProp, pd, startTime, timeScale, amountMult, currentBaseValue);
                }
            }
        }
    }

    // =========================================================
    // UI HELPERS
    // =========================================================
    function refreshPresetDropdown(dropdown, presets) {
        var i;
        dropdown.removeAll();
        for (i = 0; i < presets.length; i++) {
            dropdown.add("item", presets[i].name);
        }
        if (dropdown.items.length > 0) {
            dropdown.selection = 0;
        }
    }

    function getSelectedPresetByDropdown(dropdown, presets) {
        var idx;
        if (!dropdown.selection) return null;
        idx = dropdown.selection.index;
        if (idx < 0 || idx >= presets.length) return null;
        return presets[idx];
    }

    function populateUIFromPreset(presetObj, durationInput, amountInput) {
        if (!presetObj) return;

        if (durationInput) {
            durationInput.text = formatNumberForUI(presetObj.duration);
        }

        if (amountInput) {
            amountInput.text = formatNumberForUI(presetObj.amount);
        }
    }

    function resetUIToDefaults(durationInput, amountInput) {
        if (durationInput) {
            durationInput.text = formatNumberForUI(DEFAULT_DURATION);
        }
        if (amountInput) {
            amountInput.text = formatNumberForUI(DEFAULT_AMOUNT);
        }
    }

    // =========================================================
    // UI
    // =========================================================
    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ?
            thisObj :
            new Window("palette", PANEL_NAME, undefined, { resizeable: true });

        if (!pal) return pal;

        pal.orientation = "column";
        pal.alignChildren = ["fill", "top"];
        pal.spacing = 8;
        pal.margins = 10;

        // Settings
        var settingsPanel = pal.add("panel", undefined, "Settings");
        settingsPanel.orientation = "column";
        settingsPanel.alignChildren = ["fill", "top"];
        settingsPanel.margins = 10;
        settingsPanel.spacing = 6;

        var durGroup = settingsPanel.add("group");
        durGroup.orientation = "row";
        durGroup.add("statictext", undefined, "Duration (sec):");
        var durationInput = durGroup.add("edittext", undefined, DEFAULT_DURATION.toString());
        durationInput.characters = 8;

        var amountGroup = settingsPanel.add("group");
        amountGroup.orientation = "row";
        amountGroup.add("statictext", undefined, "Amount:");
        var amountInput = amountGroup.add("edittext", undefined, DEFAULT_AMOUNT.toString());
        amountInput.characters = 8;

        // Channels
        var channelPanel = pal.add("panel", undefined, "Channels");
        channelPanel.orientation = "row";
        channelPanel.alignChildren = ["left", "center"];
        channelPanel.margins = 10;
        channelPanel.spacing = 12;

        var xCheck = channelPanel.add("checkbox", undefined, "X");
        xCheck.value = true;

        var yCheck = channelPanel.add("checkbox", undefined, "Y");
        yCheck.value = true;

        var rotationCheck = channelPanel.add("checkbox", undefined, "Rotation");
        rotationCheck.value = false;

        var scaleCheck = channelPanel.add("checkbox", undefined, "Scale");
        scaleCheck.value = false;

        // Options
        var optionPanel = pal.add("panel", undefined, "Options");
        optionPanel.orientation = "column";
        optionPanel.alignChildren = ["left", "top"];
        optionPanel.margins = 10;
        optionPanel.spacing = 4;

        var preserve2DCheck = optionPanel.add("checkbox", undefined, "Preserve 2D Position Tangents When Possible");
        preserve2DCheck.value = true;

        // Presets
        var presetPanel = pal.add("panel", undefined, "Presets");
        presetPanel.orientation = "column";
        presetPanel.alignChildren = ["fill", "top"];
        presetPanel.margins = 10;
        presetPanel.spacing = 6;

        var presetDropdown = presetPanel.add("dropdownlist", undefined, []);
        var presetBtnGroup = presetPanel.add("group");
        presetBtnGroup.orientation = "row";

        var reloadBtn = presetBtnGroup.add("button", undefined, "Reload");
        var applyBtn = presetBtnGroup.add("button", undefined, "Apply");
        var deleteBtn = presetBtnGroup.add("button", undefined, "Delete");

        // Capture
        var capturePanel = pal.add("panel", undefined, "Capture Selected Animation");
        capturePanel.orientation = "column";
        capturePanel.alignChildren = ["fill", "top"];
        capturePanel.margins = 10;
        capturePanel.spacing = 6;

        var nameGroup = capturePanel.add("group");
        nameGroup.orientation = "row";
        nameGroup.add("statictext", undefined, "Preset Name:");
        var presetNameInput = nameGroup.add("edittext", undefined, "My Preset");
        presetNameInput.characters = 20;

        var captureBtn = capturePanel.add("button", undefined, "Save Selected Keyframes as Preset");

        // Data
        var presets = loadPresets();
        refreshPresetDropdown(presetDropdown, presets);

        if (presets.length > 0) {
            populateUIFromPreset(presets[0], durationInput, amountInput);
        } else {
            resetUIToDefaults(durationInput, amountInput);
        }

        presetDropdown.onChange = function () {
            var presetObj = getSelectedPresetByDropdown(presetDropdown, presets);
            if (presetObj) {
                populateUIFromPreset(presetObj, durationInput, amountInput);
            } else {
                resetUIToDefaults(durationInput, amountInput);
            }
        };

        reloadBtn.onClick = function () {
            presets = loadPresets();
            refreshPresetDropdown(presetDropdown, presets);

            if (presets.length > 0) {
                populateUIFromPreset(presets[0], durationInput, amountInput);
            } else {
                resetUIToDefaults(durationInput, amountInput);
            }
        };

        applyBtn.onClick = function () {
            var comp = getActiveComp();
            var layers, presetObj, durationVal, amountVal, opts, i;

            if (!comp) {
                alert("Please select a composition.");
                return;
            }

            layers = comp.selectedLayers;
            if (!layers || layers.length < 1) {
                alert("Please select at least one layer.");
                return;
            }

            presetObj = getSelectedPresetByDropdown(presetDropdown, presets);
            if (!presetObj) {
                alert("Please choose a preset.");
                return;
            }

            durationVal = parseFloatSafe(durationInput.text, DEFAULT_DURATION);
            amountVal = parseFloatSafe(amountInput.text, presetObj.amount);

            if (durationVal <= 0) {
                alert("Duration must be greater than 0.");
                return;
            }

            opts = {
                duration: durationVal,
                amount: amountVal,
                useX: xCheck.value,
                useY: yCheck.value,
                useRotation: rotationCheck.value,
                useScale: scaleCheck.value,
                preserve2DPositionTangents: preserve2DCheck.value
            };

            app.beginUndoGroup("Apply Null Animation Preset");

            for (i = 0; i < layers.length; i++) {
                applyPresetToLayer(layers[i], presetObj, opts);
            }

            app.endUndoGroup();
        };

        deleteBtn.onClick = function () {
            var presetObj = getSelectedPresetByDropdown(presetDropdown, presets);
            var deletedName, idxAfter;

            if (!presetObj) {
                alert("Please choose a preset to delete.");
                return;
            }

            deletedName = presetObj.name;

            if (deletePresetByName(deletedName)) {
                presets = loadPresets();
                refreshPresetDropdown(presetDropdown, presets);

                if (presets.length > 0) {
                    idxAfter = 0;
                    if (idxAfter >= presets.length) idxAfter = presets.length - 1;
                    presetDropdown.selection = idxAfter;
                    populateUIFromPreset(presets[idxAfter], durationInput, amountInput);
                } else {
                    resetUIToDefaults(durationInput, amountInput);
                }
            } else {
                alert("Could not delete preset.");
            }
        };

        captureBtn.onClick = function () {
            var name = trimString(presetNameInput.text);
            var presetObj, idx;

            if (name === "") {
                alert("Please enter a preset name.");
                return;
            }

            presetObj = captureSelectedAnimationAsPreset(name);
            if (!presetObj) {
                return;
            }

            if (saveOrReplacePreset(presetObj)) {
                presets = loadPresets();
                refreshPresetDropdown(presetDropdown, presets);

                idx = findPresetIndexByName(presets, name);
                if (idx >= 0) {
                    presetDropdown.selection = idx;
                    populateUIFromPreset(presets[idx], durationInput, amountInput);
                }
            }
        };

        pal.layout.layout(true);
        pal.layout.resize();

        pal.onResizing = pal.onResize = function () {
            this.layout.resize();
        };

        return pal;
    }

    // =========================================================
    // INIT
    // =========================================================
    if (!ensureJSONAvailable()) {
        return;
    }

    getPresetFolder();
    ensurePresetFileExists();

    var myUI = buildUI(thisObj);

    if (myUI instanceof Window) {
        myUI.center();
        myUI.show();
    }

})(this);
