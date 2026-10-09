import express from "express";
import path from "path"
import fs from "fs";

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use("/dist", express.static("dist"));
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "test/e2e/index.html"));
});

app.get("/ajax-data", (request, response) => {
    const data = JSON.parse(fs.readFileSync("test/e2e/example.json", "utf8"));
    const requestQuery = request.query;
    let responseData = data;

    let search = requestQuery["search"];
    let sortColumn = requestQuery["sort-column"];
    let sortDirection = requestQuery["sort-direction"];
    let paginationPage = Number(requestQuery["pagination[page]"]) || 1;
    let paginationSize = Number(requestQuery["pagination[size]"]) || 10;
    let filter = requestQuery["filter"]; // Can be string or array

    if (filter !== undefined && typeof filter === "string") {
        filter = [ filter ];
    }

    if (search !== undefined) {
        responseData = responseData.filter(item => {
            let matches = false;
            item.forEach(column => {
                if (column.value.toLowerCase().includes(search.toLowerCase())) {
                    matches = true;
                }
            });

            return matches;
        });
    }

    if (sortColumn !== undefined && sortDirection !== undefined) {
        responseData = responseData.sort((a, b) => {
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

    if (filter !== undefined) {
        // Convert ['type=Member', 'department=Sales'] into {type: 'Member', department: 'Sales'}
        const filterObject = Object.fromEntries(
            filter.map(currentFilter => currentFilter.split("="))
        );

        for (const [ key, value ] of Object.entries(filterObject)) {
            responseData = responseData.filter(item => {
                // item is now an array of objects
                // currentItem is now an object { column: 'lastName', value: 'Baker' }
                for (let currentItem of item) {
                    if (currentItem["column"] === key && currentItem["value"] === value) {
                        return true;
                    }
                }
            });
        }
    }

    let totalRecords = responseData.length;
    if (paginationPage !== undefined && paginationSize !== undefined) {
        responseData = responseData.slice((paginationPage - 1) * paginationSize, paginationPage * paginationSize);
    }

    response.json({
        "totalRecords": totalRecords,
        "pagination": {
            "page": paginationPage,
            "pageSize": paginationSize,
            "totalPages": Math.ceil(totalRecords / paginationSize),
        },
        "data": responseData
    });
});

app.listen(port, () => {
    console.log(`Development server listening on port ${ port }!`);
});
