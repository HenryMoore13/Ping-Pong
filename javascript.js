var PAGE_DATA = {};

let main = document.querySelector("main");

function renderPage(main, id) {
    let page = document.getElementById(id).innerHTML;
    main.innerHTML = page;
}

function renderHomePage(main, PAGE_DATA) {
    renderPage(main, "homePage");

    let signUpBtn = document.querySelector("#signUpBtn");
    let loginBtn = document.querySelector("#loginBtn");

    signUpBtn.addEventListener("click", () => {
        renderPage(main, "registerPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            signUp(PAGE_DATA);
        });
    });

    loginBtn.addEventListener("click", () => {
        renderPage(main, "loginPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            login(PAGE_DATA);
        });
    });
}

function signUp(data) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordRepeat = document.querySelector("#passwordRepeat").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            password_repeat: passwordRepeat
        })
    })
        .then(response => response.json())
        .then(obj => {
            data.token = obj.token;
            data.username = username;
            renderUserHome(main, PAGE_DATA);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function login(data) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(obj => {
            data.token = obj.token;

            data.username = username;
            renderUserHome(main, PAGE_DATA);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function getUsers(token, PAGE_DATA) {
    return fetch("https://bcca-pingpong.herokuapp.com/api/users/", {
        method: "GET",
        headers: { Authorization: `Token ${token}` }
    })
        .then(response => response.json())
        .then(obj => {
            return (PAGE_DATA.users = obj);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function renderUserHome(main, PAGE_DATA) {
    var source = document.getElementById("userHomePage").innerHTML;
    var template = Handlebars.compile(source);

    getUsers(PAGE_DATA.token, PAGE_DATA).then(() => {
        var usernames = [];
        for (var user of PAGE_DATA.users) {
            usernames.push(user.username);
        }
        console.log(usernames);
        var html = template({
            user: PAGE_DATA.username,
            players: PAGE_DATA.users
        });
        main.innerHTML = "";
        main.insertAdjacentHTML("beforeend", html);

        document.getElementById("newGameBtn").addEventListener("click", () => {
            renderNewGame(PAGE_DATA, usernames);
        });
        return usernames;
    });
}

function inputPlayers(PAGE_DATA) {
    PAGE_DATA.users = getUsers(PAGE_DATA.token);
    console.log(PAGE_DATA.users);
}

function renderNewGame(PAGE_DATA, usernames) {
    var source = document.getElementById("gameWindow").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        player1: PAGE_DATA.player_1,
        player2: PAGE_DATA.player_2
    });
    var block = document.querySelector("#gameArea");
    block.innerHTML = "";
    block.insertAdjacentHTML("beforeend", html);
    isVal(usernames);
}
function isVal(usernames) {
    var player1 = document.getElementById("p1USER");
    var player2 = document.getElementById("p2USER");
    console.log(player1);
    console.log(player1);
    player1.addEventListener("input", () => {
        checkUser(usernames);
    });
    player2.addEventListener("input", () => {
        checkUser(usernames);
    });
    total(usernames);
}

function checkUser(usernames) {
    var player1 = document.getElementById("p1USER").value;
    var player2 = document.getElementById("p2USER").value;

    PAGE_DATA.player_1 = player1;
    PAGE_DATA.player_2 = player2;

    var btn = document.getElementById("play");
    if (usernames.includes(player1) && usernames.includes(player2)) {
        btn.removeAttribute("disabled");
    }
    nameVal(player1, player2);
}
function nameVal(player1, player2) {
    var btn = document.querySelector("#play");
    var game = document.querySelector("#playTime");

    btn.addEventListener("click", () => {
        game.removeAttribute("hidden");
        document.querySelector("#ply1Name").innerText = player1;
        document.querySelector("#ply2Name").innerText = player2;
        document.getElementById("userInputs").hidden = true;
    });
}
function total(usernames) {
    // var player1 = document.getElementById("p1USER").value;
    // var player2 = document.getElementById("p2USER").value;
    player1 = PAGE_DATA.player_1;
    player2 = PAGE_DATA.player_2;
    var p1UP = document.getElementById("ply1UCount");
    p1UP.addEventListener("click", () => {
        var score1 = document.getElementById("ply1Score");
        let newScore = Number(score1.innerText) + 1;
        score1.innerText = newScore;
        var end = document.getElementById("endGame");
        if (newScore == 10) {
            document.getElementById("playTime").hidden = true;
            end.hidden = false;
            winner(document.querySelector("#ply1Name").innerText, usernames);
        }
    });
    var p1D = document.getElementById("ply1DCount");
    p1D.addEventListener("click", () => {
        var score1 = document.getElementById("ply1Score");
        let newScore = Number(score1.innerText) - 1;
        score1.innerText = newScore;
    });

    var p2UP = document.getElementById("ply2UCount");
    p2UP.addEventListener("click", () => {
        var score2 = document.getElementById("ply2Score");
        let newScore = Number(score2.innerText) + 1;
        score2.innerText = newScore;
        console.log(newScore);
        var end = document.getElementById("endGame");
        if (newScore == 10) {
            document.getElementById("playTime").hidden = true;
            end.hidden = false;
            win(document.querySelector("#ply2Name").innerText, usernames);
        }
    });
    var p2D = document.getElementById("ply2DCount");
    p2D.addEventListener("click", () => {
        var score2 = document.getElementById("ply2Score");
        let newScore = Number(score2.innerText) - 1;
        score2.innerText = newScore;
    });
}
function winner(player, usernames) {
    document.getElementById("winner").innerText = player;
    var newBtn = document.getElementById("startNew");
    newBtn.addEventListener("click", () => {
        renderNewGame(PAGE_DATA, usernames);
    });
}
function win(player, usernames) {
    document.getElementById("winner").innerText = player;
    var newBtn = document.getElementById("startNew");
    newBtn.addEventListener("click", () => {
        renderNewGame(PAGE_DATA, usernames);
    });
}
renderHomePage(main, PAGE_DATA);
