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
                <th>Action</th>
                <th>Expectation</th>
                <th>Result</th>
                <th>Learning</th>
            </tr>
            ${data.filter(row => !!row).map((row , i) => html.fragment`
            <tr>
                <td>${formatDate(row.date)}</td>
                <td>${row.action}</td>
                <td>${row.expected}</td>
                <td class="${(row.result.state)?classFromState(row.result.state):""}">
                    ${formatResult(row.result)}
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

function formatResult(result) {
    return html.fragment`
        ${(!result.state)?html.fragment`⏳ ${formatDate(result.eta)}<p>`:""}
        ${result.description}
    `;
} 

function classFromState(state) {
    return state === "success" ? "success" : state === "failure" ? "failure" : "mixed";
}