  
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
    var bodys = document.getElementById("listBtns")
    bodys.innerHTML = ""
    let buttonName = window.localStorage.key(i)
    //window.localStorage.clear()
    //I think i Need to add the href in the button here...
    while(buttonName != null){
        console.log("name: " + buttonName)
        button = document.createElement("button");
        delButton = document.createElement("button");
        linebreak = document.createElement("br");
        lineSep = document.createElement("HR");

        button.className = "btn-gradient gray"
        button.innerHTML = buttonName;
        type = window.localStorage.getItem(buttonName)
        delButton.className = "btn-gradient white"
        delButton.innerHTML = "X";
        console.log(type)
        
        //I can modify this stuff by using JSON.parse() instead of indexOf
        let newType = JSON.parse(type)
        let HTMLTitle = newType.listName;
        let myEntries = newType.entries;

        let startInd = type.indexOf("HTML") + 6
        let endInd = type.length - 1
        let htmlStr = type.slice(startInd,endInd)

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

//What if I just make it like this
function loadPage(htmlTitle, listEntries){
    console.log("in load()");
    //var myList = window.open("list.html","_blank","width=700,height=700");
    if (mySubWindow == undefined){
        mySubWindow = window.open("","_blank");
    }
    totalEntryCount = 0;
    mySubWindow.document.body.innerHTML = ' \
    <div style = "text-align: center;"> <h1 id="listTitle">TempName</h1> \
    <input id = "searchBar" type="text" placeholder="Search.."> <button id="addBtn">Add</button> \
    <ul id = "searchSuggestions"> </ul> <br> <button id="doneBtn" class="btn-gradient green">Done</button>\
    </div> <button id="copyBtn" class="btn-gradient cyan" style="float:right">Copy</button> <br> <hr> <br>  <table id = "userList">  <tbody> <tr> <th>Rank</th> <th> Title</th> </tr> \
    </tbody> </table>'
    var fileRef = mySubWindow.document.createElement("link");
    fileRef.setAttribute("rel", "stylesheet");
    fileRef.setAttribute("type", "text/css");
    fileRef.setAttribute("href", 'https://mylistmakerhost.github.io/list.css');
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
    
    const input = mySubWindow.document.querySelector("input")
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
        console.log(listInfo)
        el.value = listInfo;
        mySubWindow.document.body.appendChild(el);
        el.select();
        mySubWindow.document.execCommand('copy');
        mySubWindow.document.body.removeChild(el);
    }

    let userList = mySubWindow.document.getElementById("userList")
    
    mySubWindow.focus();

    input.addEventListener("input",updateSearch);
    function updateSearch(e){
        let movieTitleURLS = {}
        console.log(e.target.value);
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
                
                let newResult = result;
                let testResult = JSON.parse(result)
                console.log("data: " + result)
                console.log("test val: " + testResult.results[0].poster_path);
                clearList(suggestionList); //removes previous search results
                //should proll count amount of titles to make sure there's atleast 3
                
                
                
                for (i = 0; i < 3; i++){
                    let movieTitle = testResult.results[i].original_title;
                    let posterURL = testResult.results[i].poster_path;
                    let movieId = testResult.results[i].id
                    movieTitleURLS[movieTitle + movieId] = posterURL
                    let a = mySubWindow.document.createElement("a");
                    a.textContent = movieTitle;
                    a.setAttribute('href','#');
                    let listItem = mySubWindow.document.createElement("li")
                    listItem.appendChild(a);

                    listItem.onclick = function() {
                        input.value= "" // resets search bar
                        clearList(suggestionList) // wipes search suggestions
                        console.log(a.textContent)
                        
                        let d = mySubWindow.document.createElement("div");
                        d.id = "container";

                        if (posterURL != "null"){
                            
                            let curPosterURL = movieTitleURLS[movieTitle + movieId]

                            if ( totalEntryCount % 2 == 0){
                                let bgColor = "#b4b4cb"
                                createEntry(htmlTitle, movieTitle, curPosterURL, movieId, bgColor);
                            }else{
                                let bgColor = "#e1e1ea"
                                createEntry(htmlTitle, movieTitle, curPosterURL, movieId, bgColor);
                            }
                            totalEntryCount++;
                            console.log("entry count: " + totalEntryCount)
                            let newInfo = JSON.parse(window.localStorage.getItem(htmlTitle));
                            console.log("diff PARSED: " + newInfo);
                            newInfo.entries.push(a.textContent + "-:" + movieId + "-:" + curPosterURL)
                            window.localStorage.setItem(htmlTitle,JSON.stringify(newInfo))
                            //call a function that creates new OBJ for dict
                            //window.localStorage.setItem(title.textContent,createObj(newInfo,a.textContent));
                        }
                        
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
// needs to update order of other elements in local storage
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
    entryImage.src = basePosterURL + "w92" + urlStr;
    entryImage.className = "center-img";
    entry.appendChild(entryImage);
    
    console.log("entry image: " + entryImage.src)

    let dText = mySubWindow.document.createElement("div");
    let title = mySubWindow.document.createElement("h2");
    entry.style.backgroundColor=backGroundColor
    let removeBtn = mySubWindow.document.createElement("button");
    removeBtn.className = "btn-gradient red"
    removeBtn.innerHTML = "remove"
    removeBtn.onclick = function() {
        removeEntry(listTitle, entryName, entryID)
    }

    let upArrCon = mySubWindow.document.createElement("p");
    
    let downArrCon = mySubWindow.document.createElement("p")
    let upArr = mySubWindow.document.createElement("i")
    let downArr = mySubWindow.document.createElement("i")
    upArrCon.id = "arrOffset";
    downArrCon.id = "arrOffset";



    upArr.className = "arrow up";
    
    upArrCon.onclick = function() {
        console.log("do something")
        changeOrder(listTitle, entryName, entryID,"up")
    }
    downArrCon.onclick = function() {
        console.log("down something")
        changeOrder(listTitle, entryName, entryID,"down")
    }

    downArr.className = "arrow down";

    upArrCon.appendChild(upArr);
    downArrCon.appendChild(downArr);

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
    console.log("in change")
    let insertInd = -1
    //COPIED SOME OF THE CODE from remove entry
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
    //maybe add a listener for the add button here to close the window... and calls the other function
    //popup_window = window.open('file:///D:/Vscode%20projects/ListMaker/addForm.html','windowNew','width=300, height=300');
    console.log("made2")
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
    console.log("parsed: " + parsedInfo.listName)
    console.log("unparsed: " + userLoadedList)

    createList(parsedInfo.listName,parsedInfo.type,parsedInfo.entries)    


}

function addButton(){
    //popup_window.close();
    let listName = document.getElementById("name").value;
    
    //let genre = document.getElementById("Genre").value;
    let genre = "movie"
    console.log("In addButton name: " + listName + " genre: " + genre)

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
//should change this to createEmptyList
function createList(name, type, listEntries = []){
    console.log("In createList set windowStorage")

    //Default HTML string needs to be inserted here
    //let temp = []
    val = {listName: name, type: type, entries: listEntries}
    
    window.localStorage.setItem(name,JSON.stringify(val)) 
    console.log("calling populate")
    
    populate()

}