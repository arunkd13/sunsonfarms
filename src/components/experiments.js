import {html} from "npm:htl";

export function ExperimentsTable(data) {
    data.sort((a, b) => {
        return a.date < b.date
    });
    return html`
        <style>
            .success {
                background-color: #33FF99;
            }
            .mixed {
                background-color: #FFD36B;
            }
            .failure {
                background-color: #FF95AD;
            }
            ul {
                padding-left: 30px;
                list-style: none;
            }
            li.todo:before {
              content: '☐ ';
            }
            li.done:before {
              content: '🗹 ';
            }
        </style>
        ${data.filter(row => !!row).map((row , i) => html.fragment`
            <a href="#${row.id}">🧪</a> <strong id="${row.id}">${formatDate(row.date)}</strong>
            <div class="grid grid-cols-3">
                <div class="card">
                    <p>${formatList(row.crops, "🌱")}
                    <p>${row.action}
                    <p><strong>Expectation:</strong> ${row.expected}
                </div>
                <div class="card ${(row.result)?classFromResult(row.result):""}">
                    ${(!row.result)?html.fragment`<strong>ETA:</strong> ⏳ ${formatDate(row.eta)}<p>`:""}
                    ${formatObservations(row.observations)}
                </div>
                ${(!!row.learning || !!row.followup)?html.fragment`
                    <div class="card">
                        <p>${row.learning}</p>
                        ${(row.followup)?html.fragment`
                            <p><strong>Followup:</strong><br>
                                <ul>
                                    ${row.followup.map((followup, i) => formatFollowup(followup))}
                                </ul>
                            </p>
                        `:""}
                    </div>`:""}
            </div>
        `)}
    `
}

function formatFollowup(followup) {
    if (followup) {
        const state = (!!followup.id)?"done":"todo";
        return html.fragment`
            <li class="${state}">
                ${(!!followup.id)?html.fragment`
                    <a href="#${followup.id}">${followup.note}</a>
                `:html.fragment`
                    ${followup.note}
                `}
            </li>
        `
    }
    return "";
}

function formatDate(date) {
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

function formatObservations(observations) {
    if (observations) {
        return html.fragment`
            ${observations.map(observation => html.fragment`
                <p>
                    <strong>${formatDate(observation.date)}</strong><br>
                    ${observation.note}
                </p>
                `
            )}
        `;
    }

    return "";
} 

function formatList(list, title) {
    if (list !== null && Array.isArray(list) && list.length > 0) {
        return html.fragment`
             ${title} ${list.join(", ")}
        `;
    }
    return "";
}

function classFromResult(result) {
    return result === "success" ? "success" : result === "failure" ? "failure" : "mixed";
}