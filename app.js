let dataGen = '';
let github_str = '';
let gitlab_str = '';
let github_user = {};
let gitlab_user = {};

function searchFunc() {    
    let search_str = document.querySelector("#input_field input").value;
    if( search_str ) {
        dataGen = genFunc(search_str);
        dataGen.next();
    }
};


function* genFunc(u_name) {
    const github_fetch = yield ajax("https://api.github.com/users/" + u_name);
    github_user = github_fetch;

    if( github_user.message === "Not Found" ) {
        document.getElementById("github_area").innerHTML = "No user found";
    }
    else {
        github_str = `
            <div>
                <img src="${github_user.avatar_url}" width="100px">
                <h3>${github_user.name}</h3>
                <p>Username: ${github_user.login}</p>
                <p>Total Repos: ${github_user.public_repos}</p>
                <p>Total Gist: ${github_user.public_gists}</p>
            </div>
        `;
        document.getElementById("github_area").innerHTML = github_str;
    }

    const gitlab_fetch = yield ajax("https://gitlab.com/api/v4/users?username=" + github_user.login);
    gitlab_user = gitlab_fetch;

    if( gitlab_user.length === 0 || !gitlab_user ) {
        document.getElementById("gitlab_area").innerHTML = "No user found";
    } 
    else {
        gitlab_str = `
            <div>
                <img src="${gitlab_user[0].avatar_url}" width="100px">
                <h3>${gitlab_user[0].name}</h3>
                <p>Username: ${gitlab_user[0].username}</p>
            </div>
        `;
        document.getElementById("gitlab_area").innerHTML = gitlab_str;
    }
};

function ajax(url) {
    fetch(url)
        .then(resp => resp.json())
        .then(data => dataGen.next(data))
        .catch(err => console.error(err));
};