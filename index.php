<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet">
    <title>Wouaf Wouaf</title>

    <link rel="stylesheet" href="/assets/css/main.min.css">
    <link rel="stylesheet" href="/assets/css/eighties.css">
    <link rel="stylesheet" href="/assets/css/custom.css">

    <base href="//<?= $_SERVER['HTTP_HOST'] ?>">

    <link href="https://fonts.googleapis.com/css?family=Ropa+Sans:400,400i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
</head>

<body>

<header class="text-center vertical-center">
    <div class="small-container">
        <h1>Wouaf Wouaf</h1>
        <p>Wouaf wouaf is a simple stupid game<br />Click when you see animals in perfect time !</p>
        <p>
            <a id="play" class="button">Start game</a>
            <a id="scores" class="button">View score table</a>
            <a id="reset" class="button">Reset</a>
        </p>
    </div>
</header>

<section class="content-section">
    <div class="installation small-container">
        <h2 id="game-statut"></h2>
        <p id="flash-message"></p>
        <div class="flex-row padding-top">
            <div class="flex-large flex-50" id="game-col-1"></div>
            <div class="flex-large flex-50" id="game-col-2"></div>
        </div>
    </div>
</section>

<a id="reset-all">Reset all saved scores</a>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="/assets/js/script.js"></script>
</body>

</html>