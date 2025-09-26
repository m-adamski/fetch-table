# Fetch Table

A lightweight, dependency-minimal table generation library for handling remote data.

The library doesn't offer any CSS styling by default, but was created with TailwindCSS in mind—using the configuration,
you can assign CSS classes that suit you to selected HTML elements.

## Installation

The library can be installed in your project in several ways. The first is, of course, downloading the project and
including the JS file in your HTML page:

```html

<script type="text/javascript" src="/dist/table.bundle.js"></script>
```

Instead of downloading the files directly from the repository, you can install them using the NPM tool:

```shell

npm install @m-adamski/fetch-table
```

You can also use UNPKG CDN servers by adding a JS file in your HTML document:

```html

<script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/@m-adamski/fetch-table/dist/table.bundle.min.js"></script>
```

## How to use it?

The first step is to add an empty HTML element that will contain the generated table:

```html

<div id="table">Loading..</div>
```

Then, you can create a new instance of the `FetchTable` and pass it the URL of the data source and the configuration
object:

```javascript
const fetchTable = new FetchTable("#table", {
    ajaxURL: "/ajax-data",
    ajaxMethod: "GET",
    columns: {
        name: {
            type: "text",
            label: "Name",
            sortable: true,
            searchable: true,
        },
        emailAddress: {
            type: "text",
            label: "Email Address",
            sortable: true,
            searchable: true,
        },
        age: {
            type: "text",
            label: "Age",
            sortable: true,
            searchable: true,
        },
        city: {
            type: "text",
            label: "City",
            sortable: true,
            searchable: true,
        },
    },
    components: {
        pagination: {
            active: false,
            pageSize: 20,
            availableSizes: [ 10, 20, 50, 100 ],
            style: "standard"
        },
        search: {
            active: true
        }
    }
});
```

As you can see, the configuration object contains several properties that can be used to customize the table - more
details about them can be found in the documentation below.

## Documentation

This documentation describes the configuration options validated by the `configSchema`. Use it to construct a valid
configuration object for initializing the table.

- ajaxURL (string, required)
    - Endpoint URL used for data fetching.

- ajaxMethod ("GET" | "POST", required)
    - HTTP method used for fetching.

- ajaxHeaders (Record<string, string>, optional)
    - Default:
        - Content-Type: application/json
        - X-Requested-With: XMLHttpRequest
        - X-Requested-By: fetch-table
    - Additional headers to be sent with each request.

- debug (boolean, optional)
    - Default: false
    - Enables console logs and error outputs useful for development.

- columns (Record<string, Column>, required)
    - Map of column keys to their definitions.
    - Each value must conform to the column schema.

- elements (object, optional)
    - Allows customizing CSS classes, attributes, and DOM bindings for generated elements.

- components (object, required)
    - Enables/controls built-in UI components (pagination, search).

### Column Configuration

Example:

```text
columns: {
    name: {
        type: "text",
        label: "Name", 
        sortable: true, 
        searchable: true
    }
}
```

- type ("text" | "html", required)
    - Data rendering type.

- label (string, required)
    - Header text is shown in the table for this column.

- className (string, optional)
    - CSS classes are applied to body cells in this column.

- sortable (boolean, required)
    - Enables sorting by this column when supported by your data source.

- searchable (boolean, required)
    - Includes this column in global search queries.

### Elements Configuration

Example:

```text
elements: {
    table: {
        table: {
            className: "relative min-w-full divide-y divide-gray-300"
        },
        tableHead: {
            tableCell: {
                className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            }
        },
        tableBody: {
            tableBody: {
                className: "divide-y divide-gray-200"
            },
            tableCell: {
                className: "px-3 py-4 text-sm whitespace-nowrap text-gray-500"
            }
        },
        placeholder: {
            className: "text-center py-3",
            innerHTML: "No data available"
        }
    }
}
```

All nested objects in elements accept:

- className (string, optional): CSS classes to apply.
- attributes (Record<string, string>, optional): Arbitrary attributes to set.
- querySelector (string, optional where present): Use an existing element instead of creating one.

**Structure:**

- container (object, optional)
    - container (object, optional): Root container.
        - className, querySelector, attributes
    - header (object, optional): Container header area.
        - className, querySelector, attributes
    - footer (object, optional): Container footer area.
        - className, querySelector, attributes

- table (object, optional)
    - table (object, optional)
        - className, attributes
    - tableHead (object, optional)
        - tableHead (object, optional): Wrapper for thead
            - className, attributes
        - tableRow (object, optional): tr inside thead
            - className, attributes
        - tableCell (object, optional): th cells
            - className, attributes
    - tableBody (object, optional)
        - tableBody (object, optional): Wrapper for tbody
            - className, attributes
        - tableRow (object, optional): tr inside tbody
            - className, attributes
        - tableCell (object, optional): td cells
            - className, attributes
    - placeholder (object, optional)
        - className, innerHTML (string, optional), attributes
        - Rendered when there is no data.

- pagination (object, optional)
    - container (object, optional)
        - className, attributes
    - button (object, optional)
        - primary (object, optional): Default button style
            - className, attributes
        - active (object, optional): Current page button style
            - className, attributes
        - ellipsis (object, optional)
            - className, innerHTML, attributes
        - previous (object, optional)
            - className, innerHTML, attributes
        - next (object, optional)
            - className, innerHTML, attributes
    - sizeSelector (object, optional)
        - container (object, optional)
            - className, attributes
        - select (object, optional)
            - className, attributes
        - option (object, optional)
            - className, attributes

- search (object, optional)
    - container (object, optional)
        - className, attributes
    - input (object, optional)
        - className, attributes

### Components Configuration

Example:

```text
components: {
    pagination: {
        active: true,
        pageSize: 20,
        availableSizes: [ 10, 20, 50, 100 ],
        style: "standard"
    },
    search: {
        active: true,
    },
}
```

- pagination (object, required)
    - active (boolean, required): Enable/disable pagination UI and behavior.
    - pageSize (number, required): Items per page when pagination is active.
    - availableSizes (number[], required): Page size options for the selector.
    - style ("standard" | "simple", required): Visual style for pagination.

- search (object, required)
    - active (boolean, required): Enable/disable the search component.

### Notes

- All properties marked “optional” can be omitted; if omitted and defaults are defined, those defaults are applied.
- Unknown properties are not validated by the schema and may be ignored at runtime.
- Ensure column definitions follow the column schema to avoid validation errors.
- Use querySelector in elements where supported to mount UI into existing DOM nodes; otherwise, components are created
  by the library.

## Customizing functionality

As you may have noticed, when creating a new FetchTable instance, we create ``fetchTable`` constant. This is a variable
that holds the table instance. You can access it later in your code using.

**e.g., custom search input**

```html
<input id="customSearch" type="text" name="customSearch" placeholder="Search.." />
```

```javascript

let searchTimeout = null;
const customSearchElement = document.getElementById("customSearch");
customSearchElement.addEventListener("keyup", function (event) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        fetchTable.client.search = customSearchElement.value;
        fetchTable.refreshData();
    }, 500);
});
```

## License

This project is open-source and free to use for both personal and commercial purposes. License: MIT
