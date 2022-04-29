fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
        method: 'GET',
        headers: {
            'X-API-KEY': 'INmm8Up+eR5LFxceuG9wBQ==RrtWqiyt1hP3xvhP',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    })
    .then(data => {
        console.log(data);
        displayquote(data);
    })
    .catch((error) => console.error("FETCH ERROR:", error));

function displayquote(data) {
    const quote = data[0].quote;
    const authorData = data[0].author;
    console.log(quote);
    const qDiv = document.getElementById("quote");
    qDiv.innerHTML = "\"" + quote + "\"";
    const author = document.getElementById("author");
    author.innerHTML = "- " + authorData;
}