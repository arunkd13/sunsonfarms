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
            .todo {
                list-style-type: "☐ ";
            }
        </style>
        ${data.filter(row => !!row).map((row , i) => html.fragment`
            <strong>🧪 ${formatDate(row.date)}</strong>
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
                ${(!!row.learning)?html.fragment`
                    <div class="card">
                        <p>${row.learning}</p>
                        ${(row.followup)?html.fragment`
                            <p><strong>Followup:</strong><br>
                                <ul class='todo'>
                                    ${row.followup.map((followup, i) => html.fragment`
                                        <li>${followup.note}</li>
                                    `)}
                                </ul>
                            </p>
                        `:""}
                    </div>`:""}
            </div>
        `)}
    `
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