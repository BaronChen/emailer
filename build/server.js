"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.listen(8000, function () { return console.log("Server running on 8000 with auto restart!"); });
app.get("/", function (req, res) {
    res.send("Awesome! We're live debugging this!");
});
//# sourceMappingURL=server.js.map