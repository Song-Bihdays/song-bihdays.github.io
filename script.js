let PAGES_PER_FETCH = 50;
let INIT_TIME = Date.now();
let DATE = new Date();
let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
let searchString = String(DATE.getDate()).padStart(2, "0") + "/" + months[DATE.getMonth()] + "/";
//var yyyy = DATE.getFullYear();

const $ = q => document.querySelector(q);
const firstUppercase = string => string == "" ? "" : string[0].toUpperCase() + string.slice(1);
const pageLog = $("#pageLog");
pageLog.value = "";

let DATA = [];
let BIHDAY_OBJ = {};
let BIHDAY_ARR = [];
let pageIndex = 0;
let successCount = 0;
let imageNames = [];
let IMAGE_OBJ = {};

function log(text=""){
    console.log(text);
    pageLog.value += text + "\n";
    pageLog.scrollTop = pageLog.scrollHeight;
}

log("====LOG START====");
log("script.js working!");

function render(arr){
    // arr: [link, name, artist, bihday, [image(s)]]
    console.log(arr);
    let htmlString = "";
    for (let songId in arr){
        let song = arr[songId];
        htmlString += `<div class="songContainer"><div class="imageContainer">${song[4].length == 0 ? "" : song[4].map(img => `<img src="${img}" width="220px">`).join("<br>")}</div><div class="songData"><h3>${+songId+1}. <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(song[0])}" target="_blank">${song[1]}</a></h3><h4>${song[2]}</h4><p>Birthday: ${song[3]}</p></div></div>`;
    }
    $("#songs").innerHTML = htmlString;
}

function fetchImages(i, MAX){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&format=json&iiprop=url&iiurlwidth=220&origin=*&titles=${imageNames.slice(PAGES_PER_FETCH*i, PAGES_PER_FETCH*i + PAGES_PER_FETCH).map(song => "File:" + encodeURIComponent(song)).join("|")}`.replaceAll("%25", "%")).then(res => res.json()).then(res => {
        for (let obj of Object.values(res["query"]["pages"])){
            if (obj["imageinfo"] !== undefined){
                if (obj["imageinfo"][0]["thumburl"] !== undefined){
                    successCount++;
                    IMAGE_OBJ[decodeURIComponent(firstUppercase(obj["title"].slice(5).replaceAll(" ", "_")))] = obj["imageinfo"][0]["thumburl"];
                }else{
                    console.log("FAIL!");
                }
            }else if (obj["missing"] !== undefined){
                console.log("FAIL!")
                //BIHDAY_ARR.push([...BIHDAY_OBJ[decodeURIComponent(firstUppercase(obj["title"].slice(5).replaceAll(" ", "_")))], ""]);
                //delete IMAGE_OBJ[decodeURIComponent(firstUppercase(obj["title"].slice(5).replaceAll(" ", "_")))];
            }else{
                console.log("FAIL3!")
            }
        }

        if (PAGES_PER_FETCH*i + PAGES_PER_FETCH < MAX){
            log(`${i * PAGES_PER_FETCH + PAGES_PER_FETCH} pages thus far!`);
            pageIndex++;
            fetchImages(pageIndex, MAX);
        }else{
            pageIndex = 0;
            console.log(IMAGE_OBJ)
            if (successCount == MAX){
                log(`DONE fetching images! (${successCount})`);
                //let i = BIHDAY_ARR.length;
                let BIHDAY_OBJ_2 = {};
                for (let song of Object.keys(BIHDAY_OBJ)){
                    let arr = song.split("|");
                    arr.push([]);
                    for (let image of BIHDAY_OBJ[song]){
                        arr[4].push(IMAGE_OBJ[image.replaceAll(" ", "_")]);
                    }
                    
                    //console.log(arr[4].length == 0)
                    /*BIHDAY_ARR.push(arr);
                    BIHDAY_ARR[i].splice(4, 0, song);
                    i++;*/

                    // if there is already a page
                    if (Object.keys(BIHDAY_OBJ_2).includes(arr[0].replaceAll(" ", "_"))){
                        BIHDAY_OBJ_2[arr[0].replaceAll(" ", "_")]. push(arr);
                    }else{
                        BIHDAY_OBJ_2[arr[0].replaceAll(" ", "_")] = [arr];
                    }

                    // BIHDAY_OBJ data structure: { link : [[link, name, artist, bihday, [images...]]] }
                }
                successCount = 0;
                BIHDAY_OBJ = BIHDAY_OBJ_2;
                /*for (let song of BIHDAY_ARR){
                    BIHDAY_OBJ[song[0].replaceAll(" ", "_")] = song.slice(1);
                }
                BIHDAY_ARR = [];*/
                console.log(BIHDAY_OBJ);
                log();
                log("Fetching pageviews...")
                fetchViews(0, MAX);
            }else{
                log(`${successCount}/${MAX} images fetched.`);
                log("Refetching images...");
                successCount = 0;
                fetchImages(0, MAX);
            }
        }
    });
}

function fetchViews(i, MAX){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageviews&origin=*&titles=${Object.keys(BIHDAY_OBJ).slice(PAGES_PER_FETCH*i, PAGES_PER_FETCH*i + PAGES_PER_FETCH).map(song => encodeURIComponent(song)).join("|")}`).then(res => res.json()).then(res => {
        for (let obj of Object.values(res["query"]["pages"])){
            let totalViews = 0;
            if (obj["pageviews"] !== undefined){
                successCount++;
                totalViews = Object.values(obj["pageviews"]).reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0);
            }
            BIHDAY_OBJ[obj["title"].replaceAll(" ", "_")] = BIHDAY_OBJ[obj["title"].replaceAll(" ", "_")].map(song => [...song, totalViews]); // BIHDAY_OBJ data structure: { link : [[link, name, artist, bihday, [image(s)...], views]...] }
        }
        if (PAGES_PER_FETCH*i + PAGES_PER_FETCH <= MAX){
            log(`${i * PAGES_PER_FETCH + PAGES_PER_FETCH} pages thus far!`);
            pageIndex++;
            fetchViews(pageIndex, MAX);
        }else{
            if (successCount == Object.keys(BIHDAY_OBJ).length){
                log(`DONE fetching pageviews! (${successCount})`);
                /*for (let song of Object.keys(BIHDAY_OBJ)){
                    BIHDAY_ARR.push([song, ...BIHDAY_OBJ[song]]);
                }*/
                BIHDAY_ARR = Object.values(BIHDAY_OBJ).flat();
                BIHDAY_ARR = BIHDAY_ARR.sort((a, b) => b[5] - a[5]);
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


// INIT
function init(){
    for (let bihdayData of DATA.filter(data => data.includes(searchString)).map(data => data.split("|"))){
        // bihdayData: link, name, artist, bihday, image(s)
        // BIHDAY_OBJ structure: { link|name|artist|bihday : [images] }
        BIHDAY_OBJ[bihdayData.slice(0,4).join("|")] = bihdayData.slice(4).map(image => decodeURIComponent(firstUppercase(image.replaceAll(" ", "_").replaceAll(/%([^\d].)/g,"%25$1")))).filter(image => image != "");
    }
    console.log(BIHDAY_OBJ);
    log();
    log("Fetching images...");
    for (let imageName of Object.values(BIHDAY_OBJ).flat().filter(x => x.length > 0)){
        if (!imageNames.includes(imageName)){
            imageNames.push(imageName);
        }
    }
    //console.log(imageNames);
    fetchImages(0, imageNames.length);
}

if (localStorage.getItem("SONG_DATA") === null || localStorage.getItem("version") !== "2"){
    log("Fetching data... may take a while");
    fetch("song-data.txt").then(res => res.text()).then(text => {
        log("Fetched data!");
        localStorage.setItem("SONG_DATA", LZString.compress(text));
        localStorage.setItem("version", "2");
        log("localStorage set up!");
        DATA = text.split("\r\n");
        DATA.pop();
        init();
    });
}else{
    DATA = LZString.decompress(localStorage.getItem("SONG_DATA")).split("\r\n");
    DATA.pop();
    log("Fetched localStorage!");
    init();
}
