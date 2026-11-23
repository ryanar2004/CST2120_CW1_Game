
/* Getting the rankings table */

const rankingsBody = document.getElementById("rankingsBody");

/* Getting users and scores from local storage */

const users = JSON.parse(localStorage.getItem("cyberEscapeUsers") || "[]");
const scores = JSON.parse(localStorage.getItem("cyberEscapeScores") || "[]");

const rankings = [];

/* Getting each user's highest score */

for (const user of users) {

    const savedScore = scores.find(player =>
        player.userId === user.id
    );

    rankings.push({
        username: user.username,
        score: savedScore ? savedScore.score : 0
    });

}

/* Sorting from highest to lowest score */

rankings.sort((a, b) => b.score - a.score);

/* Displaying the rankings */

if (rankings.length > 0) {

    rankingsBody.innerHTML = "";

    rankings.forEach(function(player, index) {

        const row = document.createElement("tr");

        const rank = document.createElement("td");
        rank.textContent = index + 1;

        const username = document.createElement("td");
        username.textContent = player.username;

        const highScore = document.createElement("td");
        highScore.textContent = player.score;

        row.appendChild(rank);
        row.appendChild(username);
        row.appendChild(highScore);

        rankingsBody.appendChild(row);

    });

}
