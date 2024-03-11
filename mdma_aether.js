// ==UserScript==
// @name         MDMA REWORK
// @namespace    http://tampermonkey.net/
// @version      2024-01-02
// @description  try to take over the world!
// @author       You
// @match        https://experimental.margonem.pl/
// @match        https://tempest.margonem.pl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @grant        none
// ==/UserScript==

-function () {
    'use strict';
    let lsKeys = Object.keys(localStorage);


    function error(module, txt) {
        console.error(`mdma::${module}: ${txt}`);
    }

    class Storage {
        constructor() {
            this.storageName = "MDMA";
        };

        get() {
            if (this.storageData) return this.storageData;

            try {
                this.storageData = localStorage.getItem(this.storageName) ? JSON.parse(localStorage.getItem(this.storageName)) : {};
                return this.storageData;
            } catch (e) {
                error("storage::get", "bad JSON");
                this.storageData = {};
                return this.storageData;
            }
        };

        set(storage) {
            this.storageData = storage;
            localStorage.setItem(this.storageName, JSON.stringify(storage));
        };

        assign(key, value) {
            const storage = this.get();
            !storage[key] && (storage[key] = {});
            Object.assign(storage[key], {...storage[key], ...value});
            this.set(storage);
            return storage[key];
        };

        remove(key) {
            this.assign(key, {isChecked: false});
        };
    }

    class Addon {
        constructor(name, key, scriptSrc, description, specificInterface) {
            return {
                name: name,
                key: key,
                src: scriptSrc,
                description: description,
                ...specificInterface
            };
        }
    }

    class Loader {
        constructor() {
            this.addonsList = {
                "autoGroup": new Addon("Auto Group", "autoGroup", "https://pastebin.com/raw/8030LET4", "Dodawanie graczy z relacją CLAN lub CLAN_ALLY lub FRIEND do grupy pod przycisk V"),
                "autoHeal": new Addon("Auto Heal", "autoHeal", "https://pastebin.com/raw/FbsrPHEb", "Dwa tryby leczenia obecnie niczym nie różniące się od siebie, zalecam zachować ustawienia domyślne, \n Możliwość wyboru mikstury do leczenia"),
                "autoX": new Addon("Auto X", "autoX", "https://pastebin.com/raw/aVQ726Kc", "Ustawianie przedziału poziomowego, w jakim ma atakować przeciwników,\nUstawianie koordów, do których ma wracać, gdy nie ma przeciwników,\nMożliwość włączenia lub wyłączenia pogoni za przeciwnikiem (zalecam NIE używać chodzenia, ponieważ powoduje wyskakiwanie zagadek),\nMożliwość włączenia lub wyłączenia ucieczki kamieniem do Ithan lub zwojem na mapę Kwieciste Przejście po zakończonej walce,\nMożliwość włączenia lub wyłączenia automatycznej szybkiej walki z graczami / mobami"),
                "clanMembers": new Addon("Clan Members", "clanMembers", "https://pastebin.com/raw/MBAc75Hy", "Łatwe wyszukiwanie oraz dodawanie do grupy klanowiczy on-line", {interface: "ni"}),
                "customMessage": new Addon("Custom Message", "customMessage", "https://pastebin.com/raw/3yvxJEL5", "Zmienia wygląd funkcji Margonemskiej funkcji message na mniejszą i niemożliwą do kliknięcia"),
                "enhancementLevelHighlighter": new Addon("Enhancement Level Highlighter", "enhancementLevelHighlighter", "https://pastebin.com/raw/0937qVDZ", `Podświetlanie poziomu ulepszenia przedmiotu`),
                "getCalendarRewards": new Addon("Get Calendar Rewards", "getCalendarRewards", "https://pastebin.com/raw/UgFH0wQt", "Automatyczne odbieranie kalendarza podczas eventu"),
                "prolongTheFight": new Addon("Prolong The Fight", "prolongTheFight", "https://pastebin.com/raw/fnK6jhSv", "Dłużenie walki na każdej profesji ( na b, h zalecam zdjąć broń, ponieważ nie mają umiejętności, k zadają dmg i mogą zapętlać się w nieskończoność)", {interface: "ni"}),
                "runToHero": new Addon("Run to Hero", "runToHero", "https://pastebin.com/raw/tNvXjubD", "Dobieganie do npc wyświetlanego przez wbudowany na NI wykrywacz herosów", {interface: "ni"}),
                "shopHotkeys": new Addon("Shop Hotkeys", "shopHotkeys", "https://pastebin.com/raw/cA90x9Pb", "Wystawianie do sprzedaży itemów z toreb podczas rozmowy z handlarzem pod przyciski 1, 2, 3 oraz możliwość sprzedaży itemów pod skrótem ctrl + enter"),
                "signedCustomTeleports": new Addon("Signed Custom Teleports", "signedCustomTeleports", "https://pastebin.com/raw/hhGqG8sB", "Miejsce teleportacji wyświetlane nad kamieniem teleportującym"),
                "upgradeItem": new Addon("Upgrade Item", "upgradeItem", "https://pastebin.com/raw/qr5WZr2T", "Zliczanie przedmiotów spalonych w ciągu danego dnia (limit 2000, reset o 5:25)"),
                "whoToKill": new Addon("Who To Kill", "whoToKill", "https://pastebin.com/raw/KcxiDYii", "Automatycznie zmienia żądanie ataku na gracza z relacją CLAN lub CLAN_ALLY lub FRIEND na brak żądania ataku lub atakuje najbliższego gracza z relacją ENEMY lub CLAN_ENEMY lub NONE jeżeli znajduje się w zasięgu <= 2,5 kratek")
            };
            this.storage = new Storage();
        }

        get verStr() {
            let d = new Date();
            return [d.getUTCDate(), d.getUTCMonth() + 1,].join('.');
        }

        /*addonData(addonKey) {
            return this.storage.get().storageData[addonKey];
        }*/

        loadAddon(key, src, msg) {
            const script = document.createElement('script');
            script.src = src + `?v=` + this.verStr;
            document.head.appendChild(script);

            const name = this.addonsList[Object.keys(this.addonsList).find(key => this.addonsList[key].src === src)].name;

            msg && window.message(`MDMA: Addon ${name} loaded`);

            return script;
        }

        /*unloadAddon(key, src, msg) {
            src = src + `?v=` + this.verStr;
            const script = Array.prototype.slice.call(document.querySelectorAll(`script`)).find(script => script.src === src);
            const name = this.addonsList[key].name;

            try {
                script.remove();
                this.storage.remove(key);

                msg && window.message(`MDMA: Addon ${name} off`);
            } catch (e) {
                console.error(`loader`, `${name} unload error`);
            }
        }*/

        initAddons() {
            for (const [key, {src, specificInterface}] of Object.entries(this.addonsList)) {
                if (specificInterface && specificInterface !== window.mdma.interface) continue;
                if (!this.storage.get()[key]?.isChecked) continue;

                this.loadAddon(key, src);
            }
        }
    }

    class Emitter {

        constructor() {
            this.events = {};
        }

        on(event, listener) {
            if (typeof this.events[event] !== 'object') {
                this.events[event] = [];
            }
            this.events[event].push(listener);
            return () => this.off(event, listener);
        }

        off(event, listener) {
            if (typeof this.events[event] === 'object') {
                const idx = this.events[event].indexOf(listener);
                if (idx > -1) {
                    this.events[event].splice(idx, 1);
                }
            }
        }

        emit(event, ...args) {
            if (typeof this.events[event] === 'object') {
                this.events[event].forEach(listener => listener.apply(this, args));
            }
        }

        once(event, listener) {
            const remove = this.on(event, (...args) => {
                remove();
                listener.apply(this, args);
            });
        }

        observe(obj, key, callback) {
            const originalFunction = obj[key];
            const originalContext = obj;
            obj[key] = (...args) => {
                callback.apply(this, args)
                return originalFunction.apply(originalContext, args);
            };
        }

        after(event, listener, timeout) {
            const callback = (...args) => {
                setTimeout(() => listener.apply(this, args), timeout ?? 0);
            };
            this.on(event, callback);
        }

        //TODO: this needs to be rewritten
        intercept(event, key, obj) {
            const originalFunction = obj[key];
            const originalContext = obj;
            obj[key] = (...args) => {
                //args.some(arg => arg?.[event]) && console.log("interceptor args:", args[0].members);
                if (args.some(arg => arg?.[event])) {
                    this.emit(event, ...args);
                    this.events[event].length ? delete this.events[event][0] : delete this.events[event]
                    obj[key] = originalFunction;
                }
                return originalFunction.apply(originalContext, args);
            };
        }
    }

    const loader = new Loader();

    window.mdma = {
        "addons": loader.addonsList,
        "emitter": new Emitter(),
        "interface": document.cookie.match(/interface=(\w+)/)?.[1],
        "storage": loader.storage
    };

    const {emitter, storage} = window.mdma;

    function observeEngine() {
        if (window.mdma.interface === "ni" && !window.Engine && !window.Engine.communication && !window.Engine.hero?.d) {
            setTimeout(observeEngine, 20);
            return;
        }

        const inputParserKey = window.mdma.interface === "ni" ? "parseJSON" : "parseInput";
        const inputParserObj = window.Engine?.communication || window;
        const initKey = window.mdma.interface === "ni" ? "initBanners" : "_g";
        const initObj = window.Engine?.interface || window;
        const allInit = () => {
            if (window.mdma.interface === "ni") return window.Engine.allInit && window.Engine.widgetManager.getDefaultWidgetSet() !== null;
            return window?.g && window.g.init > 4 && window.g.item && window.g.item.length;
        }

        emitter.observe(inputParserObj, inputParserKey, data => {
            for (let e in data) {
                //if (!["e", "lag", "ev", "js"].includes(e)) console.log(e, data[e]);
                if (emitter.events[e]) {
                    emitter.emit(e, data[e]);
                }
            }
        });

        emitter.observe(initObj, initKey, (data) => {
            if (data !== undefined && !data.includes("initlvl=4")) return;

            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (!allInit()) return;

                    emitter.emit("game-loaded");

                    clearInterval(interval);
                    resolve();
                }, 20);
            });
        });
    }

    observeEngine();

    emitter.after("game-loaded", () => {
        if (document.querySelector("#MDMA")) return;
        initHTML();
        loader.initAddons();
    });


    function initHTML() {

        function getRandomColor() {
            const letters = 'BCDEF'.split('');
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 5)];
            }
            return color;
        }

        const defaultStyle = {
            "padding": '5px 10px 5px 10px',
            "textAlign": 'left',
            "fontWeight": 'bold',
            "fontSize": '20px',
            "color": 'white',
            "position": 'relative',
            "border": '3px solid rgb(204, 102, 255)',
            "width": "530px",
            "margin": "10px auto",
            "backgroundColor": "black"
        };
        const descriptionStyle = {
            "fontWeight": 'lighter',
            "fontSize": '0px',
            "margin-left": "60%",
            "textAlign": "left",
            "padding-left": "15px",
            "max-height": "0px",
            "background-image": "linear-gradient(to right, black 33%, rgba(255,255,255,0) 0%)",
            "background-position": "bottom",
            "background-size": "3px 1px",
            "background-repeat": "repeat-x",
            "transition": "all 0.5s ease-in-out 0s",
        };
        const defaultHeaderStyle = {
            ...defaultStyle,
            "border": "unset", "margin": "0 auto", "textAlign": "center", "width": "580px", "backgroundColor": "none"
        };
        const defaultSpecialButtonStyle = {
            ...defaultStyle,
            ...defaultHeaderStyle,
            "width": "auto",
            "display": "inline-block",
            "border": "1px solid white"
        };

        function createDiv(options, color) {
            const div = document.createElement('div');

            if (!options || typeof options !== 'object') return;

            if (!options.style) {
                Object.assign(div.style, {
                    ...defaultStyle, "-webkit-text-stroke": "0.2px white", "color": color
                });
            }

            for (const key in options) {
                if (key === "innerHTML" && options?.className === "MDMA-addon") {
                    const span = document.createElement('span');
                    span.innerHTML = options[key];
                    Object.assign(span.style, {
                        "width": "500px", "display": "inline-block", "verticalAlign": "middle",
                    });
                    div.appendChild(span);
                    continue;
                }
                if (typeof options[key] !== "object") {
                    div[key] = options[key];
                    continue;
                }

                if (key === "style") {
                    Object.assign(div[key], options[key]);
                    continue;
                }

                console.warn("MDMA - Unrecognised HTML key:", key);
            }

            return div;
        }

        function createCheckbox(key, src, color) {
            let addonCheckbox = document.createElement('input');
            addonCheckbox.type = 'checkbox';
            !storage.get()[key] && storage.assign(key, {isChecked: false});

            addonCheckbox.checked = storage.get()[key].isChecked;

            Object.assign(addonCheckbox.style, {
                "border": "3px solid " + color,
                "width": "20px",
                "height": "20px",
                "display": "inline-block",
                "verticalAlign": "right",
                "appearance": "none",
                "-webkit-appearance": "none",
                "-moz-appearance": "none",
                "backgroundColor": addonCheckbox.checked ? color : "transparent"
            });

            addonCheckbox.addEventListener('change', () => {
                storage.assign(key, {isChecked: addonCheckbox.checked});

                addonCheckbox.style.backgroundColor = addonCheckbox.checked ? color : "transparent";
            });

            return addonCheckbox;
        }

        const MDMA = createDiv({
            "id": "MDMA", "className": "unblock-scroll", "style": {
                "display": 'none',
                "position": 'absolute',
                "top": storage.position?.top || '0px',
                "left": storage.position?.left || '0px',
                "width": '600px',
                "max-height": '600px',
                "zIndex": '999',
                "overflow": "hidden",
                "backgroundColor": 'rgba(0,0,0,0.7)',
                "border": '3px solid rgba(204, 102, 255,0.8)',
                "font-family": "Roboto, Calibri, Optima, Arial, sans-serif"
            }
        })
        document.body.appendChild(MDMA);
        window.$('#MDMA').draggable({
            stop: () => {
                storage.assign("position", {
                    top: MDMA.style.top, left: MDMA.style.left
                })
            }
        });

        const MDMAHeader = createDiv({
            "id": "MDMAHeader", "innerHTML": "MDMA", "style": {
                ...defaultHeaderStyle,
            }
        })
        MDMA.appendChild(MDMAHeader);

        const MDMASettings = createDiv({
            "id": "MDMASettings", "innerHTML": "Settings", "style": {
                ...defaultHeaderStyle, "borderBottom": "1px solid white"
            }
        });
        MDMA.appendChild(MDMASettings);

        const MDMAAddonsWrapper = createDiv({
            "id": "MDMAAddonsWrapper", "style": {
                "display": "block",
                "flexDirection": "column",
                "max-height": "350px",
                "alignItems": "center",
                "justifyContent": "center",
                "overflow-y": "scroll",
            }
        });
        MDMA.append(MDMAAddonsWrapper);

        for (const [key, {name, src, description, specificInterface}] of Object.entries(loader.addonsList)) {
            if (specificInterface && specificInterface !== window.mdma.interface) continue;

            const color = getRandomColor();
            const addonDiv = createDiv({"id": key, "innerHTML": name, "className": "MDMA-addon"}, color)
            MDMAAddonsWrapper.appendChild(addonDiv);

            const addonCheckbox = createCheckbox(key, src, color);
            addonDiv.appendChild(addonCheckbox);

            const descriptionDiv = createDiv({
                "id": key + "Description",
                "className": "MDMA-description",
                "innerHTML": description || "No description",
                "style": {
                    ...descriptionStyle, "color": color
                }
            });
            addonDiv.appendChild(descriptionDiv);
        }

        const specialButtonsWrapper = createDiv({
            "id": "specialButtonsWrapper", "style": {
                "display": "flex",
                "flexDirection": "row",
                "alignItems": "center",
                "justifyContent": "space-around",
                "overflow-y": "scroll",
                "borderTop": "1px solid white",
                "height": "50px",
                "overflow": "hidden"
            }
        });
        MDMA.append(specialButtonsWrapper);

        const closeButton = createDiv({
            "id": "closeButton",
            "innerHTML": "Close",
            "style": {...defaultSpecialButtonStyle}
        });
        closeButton.addEventListener('click', () => {
            MDMA.style.display = 'none';
        });
        specialButtonsWrapper.appendChild(closeButton);

        const saveButton = createDiv({
            "id": "saveButton",
            "innerHTML": "Save",
            "style": {...defaultSpecialButtonStyle}
        });
        saveButton.addEventListener('click', () => {

            window.location.reload();
        });
        specialButtonsWrapper.appendChild(saveButton);

        const resetButton = createDiv({
            "id": "resetButton",
            "innerHTML": "Reset",
            "style": {...defaultSpecialButtonStyle}
        });
        resetButton.addEventListener('click', () => {
            let pos = storage.position
            Object.assign(storage, {position: pos});
            localStorage.setItem(`MDMA`, JSON.stringify(storage));

            window.location.reload();
        });
        specialButtonsWrapper.appendChild(resetButton);

        const changeWidgetVisibility = () => {
            MDMA.style.display === "block" ? MDMA.style.display = "none" : MDMA.style.display = "block";
            const style = MDMA.style.display === "none" ?
                {"fontSize": "0px", "margin-left": "40%", "max-height": "0px"} :
                {"fontSize": "12px", "margin-left": "0px", "max-height": "500px"};

            setTimeout(() => {
                for (let descriptionDiv of document.querySelectorAll(".MDMA-description")) {
                    Object.assign(descriptionDiv.style, style);
                }
            }, 100);
        }

        function createWidgetNI() {
            const serverStoragePos = window.Engine.serverStorage.get(window.Engine.widgetManager.getPathToHotWidgetVersion());
            let emptyWidgetSlot = window.Engine.widgetManager.getFirstEmptyWidgetSlot();
            emptyWidgetSlot = [emptyWidgetSlot.slot, emptyWidgetSlot.container];
            let MDMAWidgetPosition = serverStoragePos?.MDMA ? serverStoragePos.MDMA : emptyWidgetSlot;

            window.Engine.widgetManager.getDefaultWidgetSet().MDMA = {
                "keyName": "MDMA",
                "index": MDMAWidgetPosition[0],
                "pos": MDMAWidgetPosition[1],
                "txt": "Multipurpose Discord to Margonem Addons",
                "type": "red",
                "alwaysExist": true,
                "default": true,
                "clb": changeWidgetVisibility,
            };

            window.Engine.widgetManager.createOneWidget(
                'MDMA',
                {MDMA: MDMAWidgetPosition},
                true,
                []
            );
            window.Engine.widgetManager.setEnableDraggingButtonsWidget(false);

            let iconStyle = document.createElement("style");
            iconStyle.innerHTML = `.main-buttons-container .widget-button .icon.MDMA {
                background-image: url("https://media.discordapp.net/attachments/858701115873034270/1216863618713518200/tempest_269m.gif?ex=6601ef8e&is=65ef7a8e&hm=28694a7666e0443404f60be8adee66e934b82e30cbc62e22d687ae5f81efb770&=&width=34&height=52");
                background-position: 0px 0px;
            }`;
            document.head.appendChild(iconStyle);
        }

        if (window.mdma.interface === "ni") {
            createWidgetNI();
            return;
        }
        document.querySelector("#lagmeter")?.addEventListener("click", changeWidgetVisibility);
    }
}();
