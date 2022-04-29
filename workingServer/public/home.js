async function getEvents() {
    console.log("does it make here");
    try {
        let eventArr = await fetch("/getEvents");
        let jsonObj = await eventArr.json();
        var ul = document.getElementById("eventlist");
        for (let i = 0; i < 4; i++) {
            let createStr = jsonObj.events[i].untildate.toString() + " days until " + jsonObj.events[i].description + " on " + jsonObj.events[i].date
            var li = document.createElement("li");
            const breakPoint = document.createElement('br');
            li.setAttribute('id', 'todoelem')
            li.appendChild(document.createTextNode(createStr));
            li.appendChild(breakPoint);
            ul.appendChild(li);
            console.log(i)
        }
    } catch (error) {
        console.log("Booo")
    }

}

let refresh = document.getElementById("refresh");
refresh.addEventListener("click", async() => {
    let ul = document.getElementById("eventlist");
    if (ul.childElementCount < 4) {
        await getEvents();
    } else {
        return;
    }
})