var score = 0;
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

        score = 0;

        game();

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

function game() {
    // Get random images and song, launch chrono
    var chrono = randomChrono();
    var chrono2 = randomChrono();
    var image = randomImages();
    var song = randomSongs();

    clearGameCols();
    updateFlashMessage(chrono + "s");

    setTimeout(function () {
        var uid = Math.floor(Math.random() * 1000) + "" + Math.floor(Math.random() * 1000) + "" + Math.floor(Math.random() * 1000);
        var html = generateHtmlImageSong(image.uri, song.uri, uid);

        var side = Math.round(Math.random());

        if (side === 0) {
            $('#game-col-1').html(html.image + html.audio);
        } else {
            $('#game-col-2').html(html.image + html.audio);
        }

        // Start the timer
        var timer = setTimeout(function () {
            console.log(song);
            if (song.valid === false){
                console.log("good");
                score++;
                game();
            } else {
                console.log("timer expired");
                gameOver(score);
            }
        }, chrono * 1000);

        $('#' + uid).on('click', function () {
            if(song.valid === false){
                console.log("game over");
                gameOver(score);
            } else {
                console.log("good");
                clearTimeout(timer);
                score++;
                game();
            }
        });

    }, chrono2 * 1000);
}

function generateHtmlImageSong(img, song, uid) {
    return {
        "image": "<p><img src='/assets/images/" + img + "' id='" + uid + "' class='responsive-image'></p>",
        "audio": "<audio src='/assets/songs/" + song + "' autoplay preload='auto'></audio>"
    }
}

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
        "<strong>Date:</strong> " + datestring +
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

function gameOver(score) {
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
    var availableTimes = [0.8, 0.9, 1, 1.2, 1.3];

    return availableTimes[Math.floor(Math.random() * availableTimes.length)]
}