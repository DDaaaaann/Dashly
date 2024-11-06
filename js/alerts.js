if (dateTime.getDay() === 5) {
    document.getElementById('alerts').style.display = 'block';
    document.getElementById('alert1').innerText = "It's friday!";
    document.getElementById('alert2').innerText = "Log your hours.";
} else if(dateTime.getDay() === 3) {
    document.getElementById('alerts').style.display = 'block';
    document.getElementById('alert1').innerText = "Woensdag, oh woensdag, schoonste dag der dagen..";
    document.getElementById('alert2').innerText = "'s Ochtends nog een halve week, en 's middags maar twee dagen.";
}