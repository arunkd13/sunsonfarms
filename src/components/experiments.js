import {html} from "npm:htl";

export function ExperimentsTable(data) {
    return html`
        <table>
            <style>
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
            <tr>
                <td>Date</td>
                <td>Action</td>
                <td>Result</td>
                <td>Learning</td>
            </tr>
            ${data.filter(row => !!row).map((row , i) => html.fragment`
            <tr>
                <td>${formatDate(row.date)}</td>
                <td>${row.action}</td>
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
    if (!result.state) {
        return html.fragment`⏳ ${formatDate(result.eta)}`;
    }
    return html.fragment`${result.description}`;
} 

function classFromState(state) {
    return state === "success" ? "success" : state === "failure" ? "failure" : "mixed";
}