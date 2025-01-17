
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Define columns for the schema based on the new JSON structure
        var cols = [
            {
                id: "Id",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "ProjectName",
                alias: "Project Name",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "EmployeeName",
                alias: "Employee full_name",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "EmployeeType",
                alias: "Emp. Type",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "RotationTeam",
                alias: "Rotation Team",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "DateOfHire",
                alias: "Date of Hire",
                dataType: tableau.dataTypeEnum.date
            },
            {
                id: "Phone",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "Email",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "FirstDay",
                alias: "first_day",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                id: "DaysDeployed",
                alias: "Days Deployed",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "ManagerName",
                alias: "Manager Name",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "ProjectLOB",
                alias: "Project Line of Business",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "State",
                alias: "State",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "State",
                alias: "State",
                dataType: tableau.dataTypeEnum.string
            }
        ];

        // Define the table schema
        var tableSchema = {
            id: "bookings",
            alias: "Carbon Booking Information",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://apps.carboncm.com/api/v2/18/4356D3784B004551B7B2426F6AE75CEF/Booking/Bookings%20Map/select.json") // Replace with the actual new API URL
        .done(function(resp) {
            var bookings = resp; // Assuming the JSON response is an array of booking objects

            // Check if the response contains data
            if (bookings && Array.isArray(bookings)) {
                var tableData = [];

                // Iterate over the JSON object
                for (var i = 0, len = bookings.length; i < len; i++) {
                    tableData.push({
                        "Id": bookings[i]["@row.id"],
                        "ProjectName": bookings[i]["Project Name//EQ"],
                        "EmployeeName": bookings[i]["Employee full_name"],
                        "EmployeeType": bookings[i]["Emp. Type"],
                        "RotationTeam": bookings[i]["Rotation Team"],
                        "DateOfHire": bookings[i]["Date of Hire"],
                        "Phone": bookings[i]["Phone"],
                        "Email": bookings[i]["Email"],
                        "FirstDay": bookings[i]["first_day"] === "True", // Assuming "first_day" is a string "True"/"False"
                        "DaysDeployed": bookings[i]["Days Deployed"],
                        "ManagerName": bookings[i]["Manager Name"],
                        "ProjectLOB": bookings[i]["Project Line of Business"],
                        "City": bookings[i]["City"],
                        "State": bookings[i]["State"]
                    });
                }

                table.appendRows(tableData);
            } else {
                console.error("Invalid JSON format or no data found in the response.");
            }

            doneCallback();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Handle the error here
            console.error("Error fetching data:", errorThrown);
            doneCallback();
        });

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Carbon Bookings Information"; // Change the data source name
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
