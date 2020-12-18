const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    console.log(req.body);

    // Save post data to MailChimp!
    client.setConfig({
        apiKey: "98ed5adc72311545ce8cd3e374bdf5b8-us7",
        server: "us7",
    });


    const run = async () => {
        const response = await client.lists.batchListMembers("e5399f1bf4", {
            members: [{
                email_address: req.body.email,
                email_type: "text",
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.name,
                    MESSAGE: req.body.message,
                    PHONE: req.body.phone,
                }
            }],
        });
        console.log(response);
        var error_code;
        if (response.error_count == 0) {
            error_code = "";
        } else {
            error_code = response.errors[0].error_code;
        }
        var res_json = {
            err_code: error_code,
            err_count: response.error_count
        }
        res.send(res_json);


    };
    run();
    // res.send("RECEIVED!");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port: 3000");
});