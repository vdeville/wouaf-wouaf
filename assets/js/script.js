/**
 * Wouaf Wouaf is a simple game created by Valentin Deville <contact@valentin-deville.eu> during the 2017 Game Jam of Granville Digital
 *
 * Have fun while playing to my stupid fucking mini game !
 */


// Initialize global scope score variable
var score = 0;

$(document).ready(function () {

    updateGameStatus('Click to play', true);

    /**
     * Start playing...
     */
    $('#play').on('click', function () {
        // When user click on play button
        clearFlash();
        clearGameCols();
        updateGameStatus('Starting...', true);
        // Animate the loading screen before start
        setTimeout(function () {
            updateGameStatus('Playing');
            updateFlashMessage('Click when dog barks !', true);
            score = 0;
            game();
        }, 1500);
    });

    /**
     * Display scoreboard
     */
    $('#scores').on('click', function () {
        updateGameStatus('Top scores');
        clearFlash();
        clearGameCols();
        displayScores();
    });

    /**
     * Arcade style reset button
     */
    $('#reset').on('click', function () {
        location.reload();
    });

    /**
     * REAL DANGEROUS Reset button, empty scoreboard
     */
    $('#reset-all').on('click', function () {
        localStorage.removeItem('scores');
        location.reload();
    });
});

/**
 * Play ! This is the main function, use all others functions to run game.
 */
function game() {
    // Get random image and song, launch chrono(reply timer) and chrono2(time to appears)
    var chrono = randomChrono();
    var chrono2 = randomChrono();
    var image = randomImages();
    var song = randomSongs();

    // Clear current content
    clearGameCols();
    updateFlashMessage(chrono + "s");

    // First async method, time before game next song was play
    setTimeout(function () {
        // Generate random id for this round
        var uid = Math.floor(Math.random() * 1000) + "" + Math.floor(Math.random() * 1000) + "" + Math.floor(Math.random() * 1000);
        // Generate html for this round
        var html = generateHtmlImageSong(image.uri, song.uri, uid);

        // Randomize if image spawn at right or left
        var side = Math.round(Math.random());
        if (side === 0) {
            $('#game-col-1').html(html.image + html.audio);
        } else {
            $('#game-col-2').html(html.image + html.audio);
        }

        // Start the reply timer
        var timer = setTimeout(function () {
            // If user don't click but is correct (example: song is a cat not a dog)
            if (!song.valid) {
                score++;
                // increment score and re-launch new round
                game();
            } else {
                // Reply timer expire, end of the game
                gameOver(score);
            }
        }, chrono * 1000);

        // Initialize event click
        $('#' + uid).on('click', function () {
            if (song.valid) {
                // stop reply timer, increment score and re-launch new round
                clearTimeout(timer);
                score++;
                game();
            } else {
                gameOver(score);
                clearTimeout(timer);
            }
        });

    }, chrono2 * 1000);
}

/**
 * Generate random image/song html object
 * @param img
 * @param song
 * @param uid
 * @returns {{image: string, audio: string}}
 */
function generateHtmlImageSong(img, song, uid) {
    return {
        "image": "<p><img src='/assets/images/" + img + "' id='" + uid + "' class='responsive-image'></p>",
        "audio": "<audio src='/assets/songs/" + song + "' autoplay preload='auto'></audio>"
    }
}

/**
 * Empty flash message
 */
function clearFlash() {
    $('#flash-message').empty();
}

/**
 * Empty game board
 */
function clearGameCols() {
    $('#game-col-1').empty();
    $('#game-col-2').empty();
}

/**
 * Change the message board
 * @param text
 * @param blinking
 */
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

/**
 * Change message in second line of the board
 * @param text
 * @param blinking
 */
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

/**
 * Reaplce board with scoreboard
 */
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

/**
 * Generate score html object
 * @param score
 * @returns {string}
 */
function generateHtmlScore(score) {
    var d = new Date(score.date * 1000);
    var datestring = String("00" + d.getDay()).slice(-2) + "/" + String("00" + d.getMonth()).slice(-2);
    return "<p class='score-object'>" +
                "<strong>User:</strong> " + score.user + "<br />" +
                "<strong>Score:</strong> " + score.score + "<br />" +
                "<strong>Date:</strong> " + datestring +
            "</p>"
}

/**
 * Add score to global scoreboard
 * @param score
 */
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

/**
 * Game Over, clear board
 * @param score
 */
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

/**
 * Get random image from list and percent of validity chance
 * @returns {{valid: boolean, uri: string}}
 */
function randomImages() {
    var image = 0;
    var valid = false;

    var d = Math.random();
    if (d < 0.8) {
        // 80% chance pick in good array
        image = goodImages[Math.floor(Math.random() * goodImages.length)];
        valid = true;
    } else {
        // 20% chance pick in wrong array
        image = wrongImages[Math.floor(Math.random() * wrongImages.length)];
        valid = false;
    }

    return {
        "valid": valid,
        "uri": image + ".jpg"
    }
}

/**
 * Get random song from list and percent of validity chance
 * @returns {{valid: boolean, uri: string}}
 */
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

/**
 * Return random number from a list
 * @returns {number}
 */
function randomChrono() {
    var availableTimes = [0.8, 0.9, 1, 1.2, 1.3];

    return availableTimes[Math.floor(Math.random() * availableTimes.length)]
}