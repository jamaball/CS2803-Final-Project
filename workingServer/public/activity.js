function getBored(id) {
    fetch("http://www.boredapi.com/api/activity/")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            displayActivity(data, id)
        })
        .catch((error) => console.error("FETCH ERROR:", error));


}

function displayActivity(data, id) {
    const activity = data.activity;
    const actDiv = document.getElementById(id);
    actDiv.innerHTML = "<p>" + activity + "</p>";
}

getBored("activity1");
getBored("activity2");
getBored("activity3");
getBored("activity4");
getBored("activity5");

window.onload = function() {
    const sub1 = document.getElementById("sub1");
    sub2 = document.getElementById("sub2");
    sub3 = document.getElementById("sub3");
    sub4 = document.getElementById("sub4");
    sub5 = document.getElementById("sub5");

    date1 = document.getElementById("personalDate1");
    date2 = document.getElementById("personalDate2");
    date3 = document.getElementById("personalDate3");
    date4 = document.getElementById("personalDate4");
    date5 = document.getElementById("personalDate5");

    sub1.addEventListener("click", e => {
        const datePicker = document.getElementById("personalDate1");
        if (datePicker.value != "") {
            alert("eventAdded!");
            sub1.remove();
        }
    });
    sub2.addEventListener("click", e => {
        const datePicker = document.getElementById("personalDate2");
        if (datePicker.value != "") {
            alert("eventAdded!");
            sub2.remove();
        }
    });
    sub3.addEventListener("click", e => {
        const datePicker = document.getElementById("personalDate3");
        if (datePicker.value != "") {
            alert("eventAdded!");
            sub3.remove();
        }
    });

    sub4.addEventListener("click", e => {
        const datePicker = document.getElementById("personalDate4");
        if (datePicker.value != "") {
            alert("eventAdded!");
            sub4.remove();
        }
    });

    sub5.addEventListener("click", e => {
        const datePicker = document.getElementById("personalDate5");
        if (datePicker.value != "") {
            alert("eventAdded!");
            sub5.remove();
        }
    });

}