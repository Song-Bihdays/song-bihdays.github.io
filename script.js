let PAGES_PER_FETCH = 50;
let INIT_TIME = Date.now();
let DATE = new Date();
let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
let searchString = String(DATE.getDate()).padStart(2, "0") + "/" + months[DATE.getMonth()] + "/";
//var yyyy = DATE.getFullYear();

const $ = q => document.querySelector(q);
const firstUppercase = string => string[0].toUpperCase() + string.slice(1);
const pageLog = $("#pageLog");
pageLog.value = "";

let DATA = [];
let BIHDAY_OBJ = {};
let BIHDAY_ARR = [];
let pageIndex = 0;
let successCount = 0;
let imageNames = [];

function log(text=""){
    console.log(text);
    pageLog.value += text + "\n";
    pageLog.scrollTop = pageLog.scrollHeight;
}

log("====LOG START====");
log("script.js working!");

function render(arr){
    let htmlString = "";
    for (let songId in arr){
        let song = arr[songId];
        htmlString += `<div class="songContainer">${(song[4] == "" ? "" : `<img src="${song[5]}" width="220px">`)}<div class="songData"><h3>${+songId+1}. <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(song[0])}" target="_blank">${song[1]}</a></h3><h4>${song[2]}</h4><p>Birthday: ${song[3]}</p></div></div>`;
    }
    $("#songs").innerHTML = htmlString;
}

function fetchImages(i, MAX){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&format=json&iiprop=url&iiurlwidth=220&origin=*&titles=${imageNames.slice(PAGES_PER_FETCH*i, PAGES_PER_FETCH*i+PAGES_PER_FETCH).map(song => "File:" + encodeURIComponent(song)).join("|").replaceAll("%25", "%")}`).then(res => res.json()).then(res => {
        for (let obj of Object.values(res["query"]["pages"])){
            if (obj["imageinfo"] !== undefined){
                if (obj["imageinfo"][0]["thumburl"] !== undefined){
                    successCount++;
                    BIHDAY_OBJ[firstUppercase(obj["title"].slice(5).replaceAll(" ", "_"))][4] = obj["imageinfo"][0]["thumburl"];
                }
            }else if (obj["missing"] !== undefined){
                BIHDAY_ARR.push([...BIHDAY_OBJ[firstUppercase(obj["title"].slice(5).replaceAll(" ", "_"))], ""]);
                delete BIHDAY_OBJ[firstUppercase(obj["title"].slice(5).replaceAll(" ", "_"))];
            }
        }
        if (PAGES_PER_FETCH*i + PAGES_PER_FETCH <= MAX){
            pageIndex++;
            fetchImages(pageIndex, MAX);
            log(`${i * PAGES_PER_FETCH} pages thus far!`);
        }else{
            pageIndex = 0;
            if (successCount == Object.keys(BIHDAY_OBJ).length){
                log("DONE fetching images!");
                let i = BIHDAY_ARR.length;
                for (let song of Object.keys(BIHDAY_OBJ)){
                    BIHDAY_ARR.push(BIHDAY_OBJ[song]);
                    BIHDAY_ARR[i].splice(4, 0, song);
                    i++;
                }
                successCount = 0;
                BIHDAY_OBJ = {};
                for (let song of BIHDAY_ARR){
                    BIHDAY_OBJ[song[0].replaceAll(" ", "_")] = song.slice(1);
                }
                BIHDAY_ARR = [];
                log();
                log("Fetching pageviews...")
                fetchViews(0, BIHDAY_OBJ.length-1);
            }else{
                log(`${successCount}/${Object.keys(BIHDAY_OBJ).length} images fetched.`);
                log("Refetching images...");
                successCount = 0;
                fetchImages(0, Object.keys(BIHDAY_OBJ).length-1);
            }
        }
    });
}

function fetchViews(i, MAX){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageviews&origin=*&titles=${Object.keys(BIHDAY_OBJ).slice(PAGES_PER_FETCH*i, PAGES_PER_FETCH*i+PAGES_PER_FETCH).map(song => encodeURIComponent(song)).join("|")}`).then(res => res.json()).then(res => {
        for (let obj of Object.values(res["query"]["pages"])){
            let totalViews = 0;
            if (obj["pageviews"] !== undefined){
                successCount++;
                totalViews = Object.values(obj["pageviews"]).reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0);
            }
            BIHDAY_OBJ[obj["title"].replaceAll(" ", "_")][5] = totalViews;
        }
        if (PAGES_PER_FETCH*i + PAGES_PER_FETCH <= MAX){
            pageIndex++;
            fetchViews(pageIndex, MAX);
            log(`${i * PAGES_PER_FETCH} pages thus far!`);
        }else{
            if (successCount == Object.keys(BIHDAY_OBJ).length){
                log("DONE fetching pageviews!");
                for (let song of Object.keys(BIHDAY_OBJ)){
                    BIHDAY_ARR.push([song, ...BIHDAY_OBJ[song]]);
                }
                BIHDAY_ARR = BIHDAY_ARR.sort((a, b) => b[6] - a[6]);
                render(BIHDAY_ARR);
            }else{
                log(`${successCount}/${Object.keys(BIHDAY_OBJ).length} pageviews fetched.`);
                log("Refetching pageviews...");
                pageIndex = 0;
                successCount = 0;
                fetchViews(0, Object.keys(BIHDAY_OBJ).length-1);
            }
        }
    });
}

if (localStorage.getItem("SONG_DATA") === null || localStorage.getItem("version") === null){
    log("Fetching cropped data... may take a while");
    fetch("/txt/data/song-data-cropped.txt").then(res => res.text()).then(text => {
        log("Fetched cropped data!");
        localStorage.setItem("SONG_DATA", LZString.compress(text));
        localStorage.setItem("version", 1);
        log("localStorage set up!");
        DATA = text.split("\r\n");
        DATA.pop();
        for (let bihdayData of DATA.filter(data => data.includes(searchString)).map(data => data.split("|"))){
            if (bihdayData[4] != ""){
                BIHDAY_OBJ[firstUppercase(bihdayData[4].replaceAll(" ", "_"))] = bihdayData.slice(0,4);
            }else{
                BIHDAY_ARR.push(bihdayData);
            }
        }
        log();
        log("Fetching images...")
        imageNames = Object.keys(BIHDAY_OBJ);
        fetchImages(0, Object.keys(BIHDAY_OBJ).length-1);
    });
}else{
    DATA = LZString.decompress(localStorage.getItem("SONG_DATA")).split("\r\n");
    DATA.pop();
    log("Fetched localStorage!");
    for (let bihdayData of DATA.filter(data => data.includes(searchString)).map(data => data.split("|"))){
        if (bihdayData[4] != ""){
            BIHDAY_OBJ[firstUppercase(bihdayData[4].replaceAll(" ", "_"))] = bihdayData.slice(0,4);
        }else{
            BIHDAY_ARR.push(bihdayData);
        }
    }
    log();
    log("Fetching images...")
    imageNames = Object.keys(BIHDAY_OBJ);
    fetchImages(0, Object.keys(BIHDAY_OBJ).length-1);
}
