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
            console.log(data.token);
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
    player1.addEventListener("input", () => {
        checkUser(usernames);
        console.log(usernames);
    });
    player2.addEventListener("input", () => {
        checkUser(usernames);
    });
}

function checkUser(usernames) {
    var player1 = document.getElementById("p1USER").value;
    var player2 = document.getElementById("p2USER").value;
    console.log(player1);
    var btn = document.getElementById("play");
    if (usernames.includes(player1) && usernames.includes(player2)) {
        btn.removeAttribute("disabled");
    }
    // playBtn(usernames)
}
// function playBtn(usernames){
//     var btn = document.getElementById("play");
//     btn.addEventListener("click", ()=> {

//     })
// }
renderHomePage(main, PAGE_DATA);
