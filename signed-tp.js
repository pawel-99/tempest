// ==UserScript==
// @name         MDMA - Signed Custom Teleports
// @description  Shows custom teleports destination
// @version      1.0
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
(function () {
    'use strict';
    const emitter = window.mdma.emitter;
    const customTeleportsDescriptions = {
        // EII:
        "Kryjówka Dzikich Kotów": "MUSH",
        "Las Tropicieli": "KOTO",
        "Przeklęta Strażnica - podziemia p.2 s.1": "SHAE",
        "Przeklęta Strażnica - podziemia p.2 s.3": "SHAE",
        "Schowek na Łupy": "ZORG",
        "Podmokła Dolina": "WłAD",
        //TODO: ogarnac gobbosa nchms tera ni
        "Pieczara Kwiku - sala 1": "TYRT",
        "Skalne Turnie": "TOL",
        "Stary Kupiecki Trakt": "ALIAS",
        "Stare Wyrobisko p.3": "RAZIU",
        "Mokra Grota p.2": "AGAR",
        "Lazurytowa Grota p.4": "TURIM",
        "Kopalnia Kapiącego Miodu p.2 - sala Owadziej Matki": "MATKA",
        "Wioska Gnolli": "VARI",
        "Jaskinia Gnollich Szamanów p.3": "KOZUG",
        "Kamienna Jaskinia - sala 3": "JOTUN",
        "Głębokie Skałki p.3": "TOLE",
        "Krypty Dusz Śniegu p.2": "LISZ",
        "Erem Czarnego Słońca p.5": "GRAB",
        "Firnowa Grota p.2": "STOPA",
        "Świątynia Andarum - zbrojownia": "ZBROJ",
        "Wylęgarnia Choukkerów p.": "CHOUK",
        "Kopalnia Margorii": "NADZ",
        "Margoria": "MORTH",
        "Zapomniany Święty Gaj p.2": "WIDMO",
        "Grota Samotnych Dusz p.6": "OHYD",
        "Kamienna Strażnica - Sala Chwały": "GOPA",
        "Zagrzybiałe Ścieżki p.3": "GNOM",
        "Dolina Centaurów": "ZYF",
        "Zbójecka Skarpa": "KAMB",
        "Sala Zamarzniętych Kości": "M.RYC",
        "Sala Magicznego Mrozu": "M.MAG",
        "Sala Lodowatego Wiatru": "M.ŁOW",
        "Ukryta Grota Morskich Diabłów - magazyn": "PIRAT",
        "Góralskie Przejście": "WOJT",
        "Wyspa Rem": "REM",
        "Opuszczony statek - pokład": "KRAB",
        "Kryształowa Sala Smutku": "SNIEG",
        "Babi Wzgórek": "TESC",
        "Ukryty Kanion": "MANTI",
        "Dziki Zagajnik": "ZAGAJ",
        //TODO: ogarnac to tez ^
        "Grota Orczej Hordy p.2 s.3": "BUREK",
        "Grota Orczych Szamanów p.3 s.1": "SHEBA",
        "Kopalnia Żółtego Kruszcu p.2 - sala 1": "GRUB",
        "Cenotaf Berserkerów p.2": "AMUNO",
        "Grota Piaskowej Śmierci": "STWOR",
        "Mała Twierdza - sala główna": "FODUG",
        "Kuźnia Worundriela p.7 - sala 4": "WOREK",
        "Lokum Złych Goblinów": "GONS",
        "Laboratorium Adariel": "ADA",
        "Nawiedzone Kazamaty p.4": "DWK",
        "Ogrza Kawerna p.3": "OGR",
        "Sala Rady Orków": "SK",
        "Sala Królewska": "GRUBA",
        "Wyspa Ingotia - północ": "BYK",
        "Drzewo Dusz p.1": "CHRYZ",
        "Grota Arbor s.2": "CERAS",
        "Zalana Grota": "FURB",
        "Krypty Bezsennych p.3": "TORKA",
        "Przysiółek Valmirów": "BREH",
        "Szlamowe Kanały": "MYSZ",
        "Przerażające Sypialnie": "SADO",
        "Tajemnicza Siedziba": "SEKTA",
        //TODO: ogarnac to tez ^
        "Sala Spowiedzi Konających": "SAT",
        "Sale Rozdzierania": "BERGA",
        "Sala Tysiąca Świec": "ZUF",
        "Ołtarz Pajęczej Bogini": "MARLL",
        "Grota Błotnej Magii": "M.MAD",
        "Arachnitopia p.5": "P5",
        "Jaszczurze Korytarze p.4 - sala 3": "PANC",
        "Krzaczasta grota - korytarz": "SILVA",
        "Źródło Zakorzenionego Ludu": "DENDR",
        "Jaskinia Korzennego Czaru p.1 - sala 1": "DENDR",
        "Złota Góra p.2 s.1": "TOLY",
        "Niecka Xiuh Atl": "CIUT",
        "Potępione Zamczysko - sala ofiarna": "SYBA",
        "Zachodni Mictlan p.8": "JAJO",
        "Wschodni Mictlan p.8": "P9",
        "Katakumby Gwałtownej Śmierci": "CHOP",
        "Grobowiec Seta": "SET",
        "Urwisko Vapora": "TER",
        "Jaskinia Smoczej Paszczy p.2": "TER",
        "Świątynia Hebrehotha - sala ofiary": "VERA",
        "Świątynia Hebrehotha - sala czciciela": "CHAE",
        "Świątynia Hebrehotha - przedsionek": "PUST",
        "Drzewo Życia p.2": "NYMF",
        "Sala Lodowej Magii": "ART",
        "Sala Mroźnych Strzał": "FUR",
        "Sala Mroźnych Szeptów": "ZOR",
        // TITANS:
        "Mroczna Pieczara p.0": "ORLA",
        "Grota Caerbannoga": "KIC",
        "Chata Bandytów - przyziemie": "RENE",
        "Magmowa Pułapka": "ARCY",
        "Sala Goblińskich Narad": "ZOONS",
        "Jaskinia Ulotnych Wspomnień": "ŁOWKA",
        "Więzienie Demonów": "PRZYZ",
        "Grota Jaszczurzych Koszmarów p.2": "MAGUA",
        "Teotihuacan - przedsionek": "TEZA",
        "Sekretne Przejście Kapłanów": "BARB",
        "Przejście Władców Mrozu": "TH",
        // COLOSSUS:
        "Pradawne Wzgórze Przodków": "36",
        "Pieczara Szaleńców - przedsionek": "63",
        "Podmokłe leże - przedsionek": "90",
        "Zmarzlina Amaimona Soplorękiego - przedsionek": "117",
        "Czeluść Chimerycznej Natury - przedsionek": "144",
        "Przepaść Zadumy - przedsionek": "171",
        "Grobowiec Przeklętego Krakania - przedsionek": "198",
        "Grota Przebiegłego Tkacza - przedsionek": "225",
        "Pajęczy Las": "225",
        "Grota Martwodrzewów - przedsionek": "252",
        "Katakumby Antycznego Gniewu - przedsionek": "279",
    }

    const items = () => window.mdma.interface === "ni" ? window.Engine.items.testMyItems() : window.g.item;

    function getCustomTeleportSelector(id) {
        if (window.mdma.interface === 'ni') return document.getElementsByClassName(`item-id-${id}`)[0];
        return document.getElementById(`item${id}`);
    }

    function addItemDivIfMatchedDescription(id, stat, loc) {
        for (const description of Object.keys(customTeleportsDescriptions)) {
            if (!stat.includes(description) || document.getElementById("custom-teleport-description-" + id)) continue;

            const div = document.createElement("div");
            div.innerHTML = customTeleportsDescriptions[description];
            div.id = `custom-teleport-description-${id}`;
            Object.assign(div.style, {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                color: "#fff",
                fontSize: `${div.innerHTML.length < 5 ? 8 : 7}px`,
                textAlign: "center",
                lineHeight: 1.5,
                textShadow: "0 0 2px #000",
                fontFamily: "'Arial Bold', 'Arial Black', Gadget, sans-serif",
                userSelect: "none",
                pointerEvents: "none",
            });

            getCustomTeleportSelector(id).append(div);
        }
    }

    function initAddDescriptionAddon(data) {
        let heroItems;
        !data && (heroItems = items());

        for (const item in data ?? heroItems) {
            const {id, stat, loc} = data ? data[item] : heroItems[item];

            if (loc !== "g" || !stat.includes("custom_teleport") || stat.includes("amount")) continue;

            addItemDivIfMatchedDescription(id, stat, loc);
        }
    }

    initAddDescriptionAddon();

    emitter.after("item", initAddDescriptionAddon, 50);
})();
