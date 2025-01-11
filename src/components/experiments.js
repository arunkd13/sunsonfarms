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
                    background-color: #00FFBB;
                }
                .mixed {
                    background-color: #FFD36B;
                }
                .failure {
                    background-color: #FF95AD;
                }
            </style>
            <tr class="header">
                <th>Date</th>
                <th>Experiment</th>
                <th>Observations</th>
                <th>Learning</th>
            </tr>
            ${data.filter(row => !!row).map((row , i) => html.fragment`
            <tr>
                <td>${formatDate(row.date)}</td>
                <td>
                    ${row.action}<p>
                    <strong>Expectation:</strong> ${row.expected}
                </td>
                <td class="${(row.result)?classFromResult(row.result):""}">
                    ${(!row.result)?html.fragment`⏳ ${formatDate(row.eta)}<p>`:""}
                    ${formatObservations(row.observations)}
                </td>
                <td>${row.learning}</td>
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

function classFromResult(result) {
    return result === "success" ? "success" : result === "failure" ? "failure" : "mixed";
}