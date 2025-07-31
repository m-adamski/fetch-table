import express from "express";
import path from "path"

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use("/dist", express.static("dist"));
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "test/e2e/index.html"));
});

app.get("/ajax-data", (request, response) => {
    let data = [
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "John"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Doe"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "john.doe@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Jane"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Doe"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "jane.doe@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Michael"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Smith"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "michael.smith@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Emily"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Johnson"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "emily.johnson@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "William"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Brown"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "william.brown@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Sarah"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Davis"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "sarah.davis@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "James"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Wilson"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "james.wilson@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Emma"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Taylor"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "emma.taylor@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "David"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Anderson"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "david.anderson@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Olivia"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Martinez"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "olivia.martinez@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Daniel"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Thomas"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "daniel.thomas@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Sophia"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Garcia"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "sophia.garcia@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Joseph"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Rodriguez"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "joseph.rodriguez@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Isabella"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Lee"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "isabella.lee@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Alexander"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "White"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "alexander.white@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Mia"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Harris"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "mia.harris@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Christopher"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Clark"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "christopher.clark@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Ava"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Lewis"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "ava.lewis@example.com"
            }
        ],
        [
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: "Matthew"
            },
            {
                column: "lastName",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "Walker"
            },
            {
                column: "emailAddress",
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500",
                value: "matthew.walker@example.com"
            }
        ]
    ];
    const requestQuery = request.query;


    if (requestQuery["sort-column"] !== undefined && requestQuery["sort-direction"] !== undefined) {
        let sortColumn = requestQuery["sort-column"];
        let sortDirection = requestQuery["sort-direction"];

        // Sort
        data = data.sort((a, b) => {
            let aColumn = a.find(column => column.column === sortColumn);
            let bColumn = b.find(column => column.column === sortColumn);

            if (sortDirection === "ASC") {
                if (aColumn.value < bColumn.value) {
                    return -1;
                } else if (aColumn.value > bColumn.value) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (aColumn.value > bColumn.value) {
                    return -1;
                } else if (aColumn.value < bColumn.value) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    // setTimeout(() => {
    response.json({
        "data": data
    });
    // }, 3000);
});

app.listen(port, () => {
    console.log(`Development server listening on port ${ port }!`);
});
