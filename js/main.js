/**
 * Search bars
 */

var searchBarYou = document.getElementById("search-bar-you");

searchBarYou.addEventListener("keypress", function (e) {
    // If pressed enter
    if (e.keyCode == 13) {
        var youUrl = "https://you.com/search?q="+ encodeURIComponent(this.value) + "&tbm=youchat"
        window.location = youUrl;

        return false
    }
});


/**
 * Interval which the clock will be updated (in milliseconds).
 */
const dateTime = new Date();
const clockInterval = 100;
const tabKeyCode = 9;
const enterKeyCode = 13;
const escapeKeyCode = 27;
const clockElement = document.getElementById('clock');

/**
 * Return a string containing the formatted current date and time.
 */
function getDateTime() {
    let day = dateTime.getDate();
    let month = dateTime.getMonth() + 1;
    let hour = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    if (hour < 0) {
        hour = 24 + hour;
    }

    let date = (day < 10 ? '0' + day : day) + '-' + (month < 10 ? '0' + month : month) + '-' + dateTime.getFullYear();
    let time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

    return date + '\n' + time;
}

function setClock() {
    clockElement.innerText = getDateTime();
}


setClock();

setInterval(() => {
    setClock();
}, clockInterval);

document.addEventListener('keypress', (event) => {
    if (event.keyCode == escapeKeyCode) {
        searchBarElement.blur();
        searchBarElement.value = '';
    } else if (event.keyCode != tabKeyCode && event.keyCode != enterKeyCode) {
        searchBarElement.focus();
    }
});

if (dateTime.getDay() === 5) {
    document.getElementById('alert').style.display = 'block';
    document.getElementById('alert1').innerText = "It's friday!";
    document.getElementById('alert2').innerText = "Log your hours.";
} else if(dateTime.getDay() === 3) {
    document.getElementById('alert').style.display = 'block';
    document.getElementById('alert1').innerText = "Woensdag, oh woensdag, schoonste dag der dagen..";
    document.getElementById('alert2').innerText = "'s Ochtends nog een halve week, en 's middags maar twee dagen.";
}
console.log(dateTime.getDay())