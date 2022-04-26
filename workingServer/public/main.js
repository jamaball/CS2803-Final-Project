fetch("http://www.boredapi.com/api/activity/")
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    })
    .then(data => {
        console.log(data);
        displayActivity(data)
    })
    .catch((error) => console.error("FETCH ERROR:", error));

function displayActivity(data) {
    const activity = data.activity;
    const actDiv = document.getElementById("activity");
    const heading = document.createElement("h2");
    heading.innerHTML = activity;
    actDiv.appendChild(heading);
}