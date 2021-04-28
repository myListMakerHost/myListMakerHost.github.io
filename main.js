  
const APIKEY = '370fd83cf19dac84ad93508558816da3'
let baseURL = 'https://api.themoviedb.org/3/';
let basePosterURL = "https://image.tmdb.org/t/p/";
var popup_window;
var iter = "";
var mySubWindow;
var totalEntryCount = 0 ;
// This is called when web page is loaded
window.onload = function(){
    populate()
}

// This function populates list with buttons that contain names of different list's
function populate(){
    console.log("In populate()")
    i = 0

    let modeSwtich = document.getElementById("lightModeSwitch")

    modeSwtich.addEventListener('change.bootstrapSwitch', function() {
        if (modeSwtich.checked){
            console.log("Dark")
        }else{
            console.log("light")
        }
        console.log("DO SOMETHINGSASD")
    })    
    
    var bodys = document.getElementById("listBtns")
    bodys.innerHTML = ""
    let buttonName = window.localStorage.key(i)

    while(buttonName != null){
        console.log("name: " + buttonName)
        button = document.createElement("button");
        delButton = document.createElement("button");
        linebreak = document.createElement("br");
        lineSep = document.createElement("HR");

        button.className = "btn btn-outline-primary"
        button.style.width = "95%"
        button.innerHTML = buttonName;
        type = window.localStorage.getItem(buttonName)
        delButton.className = "btn btn-outline-danger"
        delButton.innerHTML = "X";
        delButton.style.width="5%"
        console.log(type)
        
        //I can modify this stuff by using JSON.parse() instead of indexOf
        let newType = JSON.parse(type)
        let HTMLTitle = newType.listName;
        let myEntries = newType.entries;

        button.onclick = function() { 
            loadPage(HTMLTitle,myEntries); 
        }
        delButton.onclick = function() {
            console.log("removed: " + HTMLTitle)
            window.localStorage.removeItem(HTMLTitle);
            location.reload(); //refreshes page to provided updated list
        }

        bodys.appendChild(linebreak)
        if (i != 0){
            bodys.appendChild(lineSep)
        }
        bodys.appendChild(button);
        bodys.appendChild(delButton);
        i++;
        buttonName = window.localStorage.key(i);
    }
    console.log("Populated")
}

function switchMode(switchVal){
    if (!switchVal){
        //this is dark mode for main page
        let myTitle = document.getElementById("homeTitle")
        myTitle.style.color="black"
        document.body.style.backgroundColor="white"
        document.getElementById("nameLabel").style.color="black";
        document.getElementById("switchText").style.color="black";
    }else{
        //light mode for main page
        let myTitle = document.getElementById("homeTitle")
        myTitle.style.color="white"
        document.body.style.backgroundColor="rgb(27, 26, 26)";
        document.getElementById("nameLabel").style.color="white";
        document.getElementById("switchText").style.color="white";
    }
}


//What if I just make it like this
function loadPage(htmlTitle, listEntries){
    console.log("in load()");
    //var myList = window.open("list.html","_blank","width=700,height=700");
    if (mySubWindow == undefined){
        mySubWindow = window.open("","_blank");
    }
    totalEntryCount = 0;
    mySubWindow.document.body.innerHTML = `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous"> 
        <link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
        <div style="display:flex; float: left;">
            <p id="switchText">Change Mode</p>

            <label class="switch">
                <input type="checkbox" id="lightModeSwitch">
                <span class="slider round"></span>
            </label>
        </div> 
       <br><br>
        <div style = "text-align: center;"> 
            <h1 id="listTitle">TempName</h1> 
            <input id = "searchBar" type="text" placeholder="Search.."> 
            <ul id = "searchSuggestions"> </ul> 
            <br> 
            <button id="doneBtn" class="btn btn-primary">Done</button>
        </div> 
        <button id="copyBtn" class="btn btn-primary" style="float:right">Copy</button> 
        <br> <hr id="divider"> <br>  
        <table id = "userList">  
            <tbody> 
            <tr> <th style="text-align:center;" class="tableElement">Rank</th> <th style="text-align:center;" class="tableElement"> Title</th> </tr> 
        </tbody>
        </table>`
    var fileRef = mySubWindow.document.createElement("link");
    fileRef.setAttribute("rel", "stylesheet");
    fileRef.setAttribute("type", "text/css");
    fileRef.setAttribute("href", 'https://mylistmakerhost.github.io/main.css');
    mySubWindow.document.head.appendChild(fileRef);
    
    // Will make sure you can close a list window and open a new window
    // without having to refresh page manually
    mySubWindow.addEventListener("beforeunload",function(e){
        location.reload();
    });    
    let title = mySubWindow.document.getElementById("listTitle");
    title.innerHTML = htmlTitle;

    for (let e = 0; e < listEntries.length; e++){
        let entryInfo = listEntries[e].split("-:")
        //TODO add movie ID to entry info so it goes listEntries = [name-:id-:url,...]
        let entryName = entryInfo[0];
        let entryId = entryInfo[1];
        let entryURL = entryInfo[2];
        //need to pass hmlTitle for delete button info
        // need to pass entry name and entry URL for creation of HTML elements need to pass ID for deletion purposes
        if (e % 2 == 0){
            let bgColor = "#b4b4cb"
            createEntry(htmlTitle,entryName,entryURL,entryId,bgColor);

        }else{
            let bgColor = "#e1e1ea"
            createEntry(htmlTitle,entryName,entryURL,entryId,bgColor); 

        }
        totalEntryCount++;
    }
    
    const input = mySubWindow.document.getElementById("searchBar")
    let suggestionList = mySubWindow.document.getElementById("searchSuggestions");
    let mySaveBtn = mySubWindow.document.getElementById("doneBtn");
    let myCopyBtn = mySubWindow.document.getElementById("copyBtn");
    //closes subwindow and refreshes page (So it gets list updated information)
    mySaveBtn.onclick = function() {
        mySubWindow.close();
        location.reload();
    }

    myCopyBtn.onclick = function(){
        let el = mySubWindow.document.createElement('textarea');
        let listInfo = JSON.stringify(window.localStorage.getItem(htmlTitle)) //converts all JSOn info to list
        //load should add a new list entry with this string's info
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.value = listInfo;
        mySubWindow.document.body.appendChild(el);
        el.select();
        mySubWindow.document.execCommand('copy');
        mySubWindow.document.body.removeChild(el);
    }
    let darkNum = 0
    let darkModeCheck = mySubWindow.document.getElementById("lightModeSwitch");
    darkModeCheck.addEventListener("click", function(){
        darkNum++;
        if (darkNum % 2 != 0){
            
            mySubWindow.document.body.style.backgroundColor = "rgb(27, 26, 26)";
            mySubWindow.document.getElementById("switchText").style.color="white";
            mySubWindow.document.getElementById("listTitle").style.color="white";
            mySubWindow.document.getElementById("divider").style.color="white";
            var all = mySubWindow.document.getElementsByClassName('tableElement');
            for (var i = 0; i < all.length; i++) {
                all[i].style.color = 'white';
            }
        }else{
            mySubWindow.document.body.style.backgroundColor = "white";
            mySubWindow.document.getElementById("switchText").style.color="black";
            mySubWindow.document.getElementById("listTitle").style.color="black";
            mySubWindow.document.getElementById("divider").style.color="black";
            var all = mySubWindow.document.getElementsByClassName('tableElement');
            for (var i = 0; i < all.length; i++) {
                all[i].style.color = 'black';
            }

        }

    })
    mySubWindow.focus();
    input.addEventListener("input",updateSearch);
    function updateSearch(e){
        let movieTitleURLS = {}
        userInp = e.target.value
        if (userInp.length >= 3){          
            let url = "".concat(baseURL, 'configuration?api_key=', APIKEY); 
            fetch(url)
            .then((result)=>{
                return result.json();
            })
            .then((data)=>{
                console.log('config:', data);
                console.log('config fetched');
                runSearch(userInp)
            })
            .catch(function(err){
                alert(err);
            });
        }else{
            clearList(suggestionList); //removes previous search results
        }
        
        let runSearch = function (userInp) {
            let url = ''.concat(baseURL, 'search/movie?api_key=', APIKEY, '&query=', userInp);
            fetch(url)
            .then(result=>result.json())
            .then((data)=>{
                //process the returned data
                let result = JSON.stringify(data,null,4);
                let testResult = JSON.parse(result)
                clearList(suggestionList); //removes previous search results              
                for (i = 0; i < 3; i++){
                    let movieTitle = testResult.results[i].original_title;
                    let posterURL = testResult.results[i].poster_path;
                    let movieId = testResult.results[i].id
                    movieTitleURLS[movieTitle + movieId] = posterURL
                    let a = mySubWindow.document.createElement("a");
                    a.textContent = movieTitle;
                    a.setAttribute('href','#');
                    let listItem = mySubWindow.document.createElement("li")
                    let listImg = mySubWindow.document.createElement("img")
                    listImg.src = basePosterURL + "w92" + posterURL
                    listImg.style.paddingLeft ="10px"
                    if (posterURL != null){
                        a.appendChild(listImg)
                    }
                    listItem.appendChild(a);

                    listItem.onclick = function() {
                        input.value= "" // resets search bar
                        clearList(suggestionList) // wipes search suggestions
                        
                        let d = mySubWindow.document.createElement("div");
                        d.id = "container";
                        var bgColor = "#e1e1ea"
                        var curPosterURL = null

                        if ( totalEntryCount % 2 == 0){
                            bgColor = "#b4b4cb"
                        }
                        if (posterURL != null){
                            curPosterURL = movieTitleURLS[movieTitle + movieId]
                        }
                        createEntry(htmlTitle, movieTitle, curPosterURL, movieId, bgColor);
                        let newInfo = JSON.parse(window.localStorage.getItem(htmlTitle));
                        newInfo.entries.push(a.textContent + "-:" + movieId + "-:" + curPosterURL)
                        window.localStorage.setItem(htmlTitle,JSON.stringify(newInfo))

                        totalEntryCount++;

                    }
                    suggestionList.appendChild(listItem);
                }
            })
        }
    }
}
// created this function for readability sake
function clearList(list){
    list.innerHTML = ""
}

//removes entry from localStorage and calls loadPage() to modify display
function removeEntry(listName, title,titleId){
    console.log("title: " + title + " id: " + titleId)
    let listInfo = JSON.parse(window.localStorage.getItem(listName))
    let entryList = listInfo.entries;
    // loop through all entries until found remove element from array and call loadPage()
    for (let i = 0; i < entryList.length; i++){
        let info = entryList[i].split("-:");

        let entryTitle = info[0]
        let entryID = info[1]
        if (entryTitle == title && entryID == titleId){
            entryList.splice(i,1)
            console.log("new list: " + entryList);
        }
    }
    listInfo.entries = entryList;
    window.localStorage.setItem(listName,JSON.stringify(listInfo));
    loadPage(listName,listInfo.entries);
}


//This should take a poster URL and name, then creates an entry and adds it to list
function createEntry(listTitle, entryName, urlStr, entryID, backGroundColor){
    let entry = mySubWindow.document.createElement("div");
    let userList = mySubWindow.document.getElementById("userList");
    entry.id = "container";
    let entryImage = mySubWindow.document.createElement("img");
    if (urlStr == null || urlStr == "null") {
        entryImage.src = "https://i.imgur.com/wiUoT13.png"
    }else{
        entryImage.src = basePosterURL + "w92" + urlStr;
    }
    entryImage.className = "center-img";
    entry.appendChild(entryImage);
    
    let dText = mySubWindow.document.createElement("div");
    let title = mySubWindow.document.createElement("h2");
    entry.style.backgroundColor=backGroundColor
    let removeBtn = mySubWindow.document.createElement("button");
    removeBtn.className = "btn btn-outline-danger"
    removeBtn.innerHTML = "remove"
    removeBtn.onclick = function() {
        removeEntry(listTitle, entryName, entryID)
    }

    let upArrCon = mySubWindow.document.createElement("p");
    
    let downArrCon = mySubWindow.document.createElement("p")
    let upArr = mySubWindow.document.createElement("i")
    let downArr = mySubWindow.document.createElement("i")
    let upBtn = mySubWindow.document.createElement("button");
    let downBtn = mySubWindow.document.createElement("button");

    
    upArrCon.id = "arrOffset";
    downArrCon.id = "arrOffset";
    upBtn.id = "upArrow"
    downBtn.id ="downArrow"

    upArr.className = "arrow up";
    
    upBtn.onclick = function() {
        changeOrder(listTitle, entryName, entryID,"up")
    }
    downBtn.onclick = function() {
        changeOrder(listTitle, entryName, entryID,"down")
    }

    downArr.className = "arrow down";
    upBtn.appendChild(upArr);
    downBtn.appendChild(downArr);
    upArrCon.appendChild(upBtn);
    downArrCon.appendChild(downBtn);

    dText.className = "center-txt";
    title.textContent = entryName;
    dText.appendChild(title);
    dText.append(removeBtn);
    dText.appendChild(upArrCon);
    dText.appendChild(downArrCon);
    
    entry.appendChild(dText);

    let tableRow = mySubWindow.document.createElement("tr");
    let tableOrder = mySubWindow.document.createElement("td");
    let orderText = mySubWindow.document.createElement("h1");
    orderText.style.textAlign = "center";
    orderText.innerHTML = totalEntryCount + 1;
    orderText.className="tableElement"
    tableOrder.appendChild(orderText);
    let tableTitle = mySubWindow.document.createElement("td");
    tableTitle.appendChild(entry)
    tableTitle.style.width="100%"
    tableRow.appendChild(tableOrder);
    tableRow.appendChild(tableTitle);
    userList.appendChild(tableRow);
}


function changeOrder(listName, entry_name, entry_id,direction){
    let listInfo = JSON.parse(window.localStorage.getItem(listName))
    let insertInd = -1
    let entryList = listInfo.entries;
    // loop through all entries until found remove element from array and call loadPage()
    for (let i = 0; i < entryList.length; i++){
        let info = entryList[i].split("-:");

        let entryTitle = info[0];
        let entryID = info[1];
        let moviePost = info[2];
        if (entryTitle == entry_name && entryID == entry_id){
            entryList.splice(i,1); // removes element from array
            console.log("new list: " + entryList);
            if (direction == "up" && i != 0){
                insertInd = i - 1;
            }else if (direction == "down" && i != entryList.length){
                insertInd = i + 1;
            }
            if (insertInd != -1){
                entryList.splice(insertInd,0,entryTitle +"-:" + entryID + "-:" + moviePost)
                listInfo.entries = entryList;
                console.log(listInfo.entries)
        
                window.localStorage.setItem(listName,JSON.stringify(listInfo));
                loadPage(listName,listInfo.entries);
            }
        break;
        }
        
    }

}


function addList(){
    if (document.getElementById("addForm").hidden == false){
        document.getElementById("addForm").hidden= true;
    }else{
        document.getElementById("addForm").hidden= false;
    }
}


function loadList(){
    let userLoadedList = prompt("Please paste list information");
    // I have to do it twice because it think's the output of the first parse is still a string
    let parsedInfo = JSON.parse(JSON.parse(userLoadedList))

    createList(parsedInfo.listName,parsedInfo.type,parsedInfo.entries)    
}

function addButton(){
    //popup_window.close();
    let listName = document.getElementById("name").value;
    
    //let genre = document.getElementById("Genre").value;
    let genre = "movie"

    createList(listName,genre);
}

function getListCount(){
    let i = 0;
    temp = window.localStorage.key(i);
    while( temp != null){
        i++;
        temp = window.localStorage.key(i);
    }
    return (i)
}

// Adds new list to local storage and calls populate with new info
function createList(name, type, listEntries = []){

    val = {listName: name, type: type, entries: listEntries}
    
    window.localStorage.setItem(name,JSON.stringify(val)) 
    populate()
}