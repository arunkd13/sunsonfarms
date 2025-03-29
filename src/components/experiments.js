import {html} from "npm:htl";

export function ExperimentsTable(data) {
    const groups = data.reduce((accumulator, item) => {
        if (!(item?.location)) {
            accumulator.other.push(item);
        } else if (item.location?.foodforest) {
            accumulator.foodforest.push(item);
        }
        else if (item.location?.field) {
            accumulator.field.push(item);
        } else {
            accumulator.other.push(item);
        }

        return accumulator;
    }, {
        field: [],
        foodforest: [],
        other: [],
    });

    return html`
        <style>
            ul {
                padding-left: 30px;
                list-style: none;
            }
        </style>
        ${formatLocationBasedExperiments(groups.field, 'field')}
        ${formatLocationBasedExperiments(groups.foodforest, 'foodforest')}
        ${formatOtherExperiments(groups.other, 'other')}
    `;
}

function formatLocationBasedExperiments(data, prop) {
    function linearizeLocation(location, prop) {
        return location[prop] * 10 + location[prop].bed;
    }
    data.sort((a, b) => {
        return linearizeLocation(a.location, prop) - linearizeLocation(b.location, prop);
    });
    return html.fragment`
        ${data.map(data => html.fragment`
            <h3>📍 ${prop} ${data.location[prop]} ${data.location.bed?html.fragment`, bed ${data.location.bed.toString()}`:""}</h3>
            ${formatExperiment(data)}
        `)}
    `;
}

function formatOtherExperiments(data, prop) {
    return html.fragment`
        <h3>Other</h3>
        ${data.map(data => html.fragment`
            ${formatExperiment(data)}
        `)}
    `;
}

function formatExperiment(row) {
    return html.fragment`
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
            li.todo:before {
              content: '☐ ';
            }
            li.done:before {
              content: '🗹 ';
            }
        </style>
        ${html.fragment`
            <a href="#${row.id}">🧪</a> <strong id="${row.id}">${formatDate(row.date)}</strong>
            ${formatList(row.crops, "🌱")}
            <div class="grid grid-cols-3">
                <div class="card">
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
        `}
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