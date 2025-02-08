import {html} from "npm:htl";

export function ExperimentsTable(data) {
    data.sort((a, b) => {
        return a.date < b.date
    });
    return html`
        <table>
            <style>
                th, td {
                    padding: 5px;
                }
                .header th {
                    font-weight: bold;
                }
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
            <tr class="header">
                <th>Experiment</th>
                <th>Observations</th>
                <th>Learning</th>
            </tr>
            ${data.filter(row => !!row).map((row , i) => html.fragment`
            <tr>
                <td>
                    <strong>${formatDate(row.date)}</strong>
                    <p>${row.action}
                    <p>${formatList(row.crops, "🌱")}
                    <p><strong>Expectation:</strong> ${row.expected}
                </td>
                <td class="${(row.result)?classFromResult(row.result):""}">
                    ${(!row.result)?html.fragment`⏳ ${formatDate(row.eta)}<p>`:""}
                    ${formatObservations(row.observations)}
                </td>
                <td>
                    ${row.learning}
                    ${(row.followup)?html.fragment`
                        <p>
                            Followup<br>
                            <ul class='todo'>
                                ${row.followup.map((followup, i) => html.fragment`
                                    <li>${followup.note}</li>
                                `)}
                            </ul>
                        </p>
                    `:""}
                </td>
            </tr>
                `)}
        </table>
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