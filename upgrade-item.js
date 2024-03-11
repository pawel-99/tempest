// ==UserScript==
// @name         MDMA - Upgrade Item
// @description  Upgrade selected item with selected types of items from inventory
// @version      1.1
// @author       Libit
// @match        http*://*.margonem.pl/
// @exclude      http*://margonem.*/*
// @exclude      http*://www.margonem.*/*
// @exclude      http*://new.margonem.*/*
// @exclude      http*://forum.margonem.*/*
// @exclude      http*://commons.margonem.*/*
// @exclude      http*://dev-commons.margonem.*/*
// @grant        none
// ==/UserScript==
/*
1.1 -the counter now resets after 5:25
*/
(function () {
    const saveSettings = () => localStorage.setItem('Upgrade-Item', JSON.stringify(ls));
    const getTime = () => {
        dateChange = new Date().getHours() < 5 || new Date().getHours() == 5 && new Date().getMinutes() <= 25 ? 1 : 0;
        today = new Date();
        today.setDate(today.getDate() - dateChange);
        today = today.getDate();
    }

    if (!JSON.parse(localStorage.getItem('Upgrade-Item'))) localStorage.setItem('Upgrade-Item', JSON.stringify({ pos: { x: 0, y: 0 }, settings: {} }));

    const ls = JSON.parse(localStorage.getItem('Upgrade-Item'));
    let dateChange = new Date().getHours() < 5 || new Date().getHours() == 5 && new Date().getMinutes() <= 25 ? 1 : 0;
    let today = new Date();
    today.setDate(today.getDate() - dateChange);
    today = today.getDate();

    if (!ls.settings.counter) {
        ls.settings = {
            enabled: false,
            lvl: {
                min: 0,
                max: 500
            },
            type: {},
            counter: {
                date: today,
                itemsUsed: 0
            }
        }
    }
    if (ls.settings.counter.date != today) {
        ls.settings.counter.date = today
        ls.settings.counter.itemsUsed = 0;
    }
    saveSettings();

    const Engine = new class Engine {
        constructor() {
            this.interface = document.cookie.match(/interface=(\w+)/)?.[1] === 'si' ? 'si' : 'ni';
        }
        get hero() {
            if (this.interface == 'ni') return window.Engine.hero.d;
            return window.hero;
        }
        get allInit() {
            if (this.interface == 'ni') return window.Engine?.allInit;
            return window.g?.init === 5;
        }
        get notInBattle() {
            if (this.interface == 'ni') return window.Engine.battle.endBattle ? true : window.Engine.battle.show ? false : true;
            return !window.g.battle;
        }
        get map() {
            if (this.interface == 'ni') return window.Engine.map.d;
            return window.map;
        }
        waitForGameInit() {
            return new Promise(resolve => {
                const wait = () => {
                    if (this.allInit) resolve();
                    else setTimeout(wait, 20);
                }
                wait();
            })
        }
    }
    Engine.waitForGameInit().then(() => {
        const main = document.createElement('div');
        main.setAttribute('id', 'Upgrade-Item');
        document.body.append(main);
        const div = document.createElement('div');
        div.setAttribute('id', 'Upgrade-Item-div');
        div.innerHTML = "SPALONE ITEMY: " + ls.settings.counter.itemsUsed;
        main.append(div);

        const _pI = Engine.interface == "si"? window.parseInput : window.Engine.communication.parseJSON;
            function oldParseInput(data) {
                _pI.apply(this, arguments);
                if (!data.enhancement || !data.item) return;
                for (const item of Object.entries(data.item)) {
                    if (!item[1].del) continue;
    
                    ls.settings.counter.itemsUsed++;
                    div.innerHTML = "SPALONE ITEMY: " + ls.settings.counter.itemsUsed;
                    saveSettings();
                }
        }
        Engine.interface == "si" ? window.parseInput = oldParseInput : window.Engine.communication.parseJSON = oldParseInput;

        const style = document.createElement('style');
        style.innerHTML = `\n#Upgrade-Item{\nposition:absolute;\nwidth:100px;\nheight:32px;\ntop:${ls.pos.y}px;\nleft:${ls.pos.x}px;\nborder:grey solid 1px;\nbackground:#000;\nz-index:100\n}\n#Upgrade-Item-div{\nposition: absolute;\nwidth: 100px;\ncolor: white;\nfont-size: 10px;\ntext-align: center;\nline-height: 1.5;\nfont-family: 'Arial Bold', 'Arial Black', Gadget, sans-serif;\nuser-select: none;\npointer-events: none;\nfont-weight: bold;\n}`;
        document.head.append(style);

        window.$('#Upgrade-Item').draggable({ stop: () => { ls.pos.x = parseInt(main.style.left); ls.pos.y = parseInt(main.style.top); saveSettings() } });
        setInterval(() => {
            getTime();
            div.innerHTML = "SPALONE ITEMY: " + ls.settings.counter.itemsUsed;
            if (ls.settings.counter.date == today) return;

            ls.settings.counter.date = today
            ls.settings.counter.itemsUsed = 0;
        }, 500)

    });

})();
