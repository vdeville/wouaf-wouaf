$(document).ready(function () {

    updateGameStatus('Click to play', true);

    $('#play').on('click', function () {
        clearFlash();
        clearGameCols();
        updateGameStatus('Starting...', true);
        setTimeout(function () {
            updateGameStatus('Playing');
            updateFlashMessage('Click when dog barks !', true);
        }, 1500);


        // Get random images and song, launch chrono
        var chrono = randomChrono();
        var image = randomImages();
        var song = randomSongs();

        image.valid = false;
        song.valid = false;

        console.log(image);
        console.log(song);

        // Start the timer
        var timer = setTimeout ( function () {
            if(image.valid === false && song.valid === false){
                // silent
                clearTimeout(timer);
            } else {
                clearTimeout(timer);
                gameOver(1);
            }
        }, 1000 );

    });

    $('#scores').on('click', function () {
        updateGameStatus('Top scores');
        clearFlash();
        clearGameCols();
        displayScores();
    });

    $('#reset').on('click', function () {
        location.reload();
    });

    $('#reset-all').on('click', function () {
        localStorage.removeItem('scores');
        location.reload();
    });


});

function clearFlash() {
    $('#flash-message').empty();
}

function clearGameCols() {
    $('#game-col-1').empty();
    $('#game-col-2').empty();
}

function updateGameStatus(text, blinking) {
    blinking = blinking || false;
    var gamestatut = $('#game-statut');
    gamestatut.text(text);

    if (blinking) {
        gamestatut.addClass('blink');
    } else {
        gamestatut.removeClass('blink');
    }
}

function updateFlashMessage(text, blinking) {
    blinking = blinking || false;
    var flashmessage = $('#flash-message');
    flashmessage.text(text);

    if (blinking) {
        flashmessage.addClass('blink');
    } else {
        flashmessage.removeClass('blink');
    }
}

function displayScores() {
    var html1 = "";
    var html2 = "";
    var scores = JSON.parse(localStorage.getItem('scores'));

    if (scores === null) {
        html1 = "<p>No scores available</p>"
    } else {
        $.each(scores, function (index, value) {
            if (index % 2 === 0) {
                html1 += generateHtmlScore(value);
            } else {
                html2 += generateHtmlScore(value);
            }
        });
    }

    $('#game-col-1').html(html1);
    $('#game-col-2').html(html2);
}

function generateHtmlScore(score) {
    var d = new Date(score.date * 1000);
    var datestring = String("00" + d.getDay()).slice(-2) + "/" + String("00" + d.getMonth()).slice(-2);
    return "<p class='score-object'><strong>User:</strong> " + score.user + "<br />" +
        "<strong>Score:</strong> " + score.score + "<br />" +
        "<strong>Date :</strong> " + datestring +
        "</p>"
}

function addTopScore(score) {
    var currentScores = localStorage.getItem('scores');

    if (currentScores === null) {
        currentScores = [];
    } else {
        currentScores = JSON.parse(currentScores);
    }

    var object = {
        "user": "Unknow",
        "score": score,
        "date": Date.now()
    };

    currentScores.push(object);

    localStorage.setItem('scores', JSON.stringify(currentScores));
}

function gameOver(score){
    clearGameCols();
    updateGameStatus("Game Over", true);
    updateFlashMessage("Your score: " + score);
    addTopScore(score);
}

var goodImages = [1, 8, 9, 10, 12, 17, 18, 19, 20, 21, 22, 23];
var wrongImages = [2, 3, 4, 5, 6, 7, 11, 13, 14, 15, 16];
var goodSongs = [1, 2, 3, 4, 5, 6, 7, 8];
var wrongSongs = [10, 11];

function randomImages() {
    var image = 0;
    var valid = false;

    var d = Math.random();
    if (d < 0.8) {
        // 80% pick in good array
        image = goodImages[Math.floor(Math.random() * goodImages.length)];
        valid = true;
    } else {
        // 20% pick in wrong array
        image = wrongImages[Math.floor(Math.random() * wrongImages.length)];
        valid = false;
    }

    return {
        "valid": valid,
        "uri": image + ".jpg"
    }
}

function randomSongs() {
    var song = 0;
    var valid = false;

    var d = Math.random();
    if (d < 0.6) {
        // 60% pick in good array
        song = goodSongs[Math.floor(Math.random() * goodSongs.length)];
        valid = true;
    } else {
        // 40% pick in wrong array
        song = wrongSongs[Math.floor(Math.random() * wrongSongs.length)];
        valid = false;
    }

    return {
        "valid": valid,
        "uri": song + ".mp3"
    }
}

function randomChrono() {
    var availableTimes = [0.5, 0.8, 1, 1.2, 1.8, 2, 2.2];

    return availableTimes[Math.floor(Math.random() * availableTimes.length)]
}