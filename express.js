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

    if (requestQuery["sort-column"] !== undefined && requestQuery["sort-direction"] !== undefined) {
        let sortColumn = requestQuery["sort-column"];
        let sortDirection = requestQuery["sort-direction"];

        // Sort
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

    if (requestQuery["pagination-page"] !== undefined && requestQuery["pagination-size"] !== undefined) {
        let paginationPage = requestQuery["pagination-page"];
        let paginationSize = requestQuery["pagination-size"];

        responseData = responseData.slice((paginationPage - 1) * paginationSize, paginationPage * paginationSize);
    }

    response.json({
        "total": data.length,
        "total_filtered": data.length,
        "pagination": {
            "page": Number(requestQuery["pagination-page"]) || 1,
            "page_size": Number(requestQuery["pagination-size"]) || 30,
            "total_pages": Math.ceil(data.length / (requestQuery["pagination-size"] || 30)) || 1,
        },
        "data": responseData
    });
});

app.listen(port, () => {
    console.log(`Development server listening on port ${ port }!`);
});
