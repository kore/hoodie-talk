"use strict";

var hoodie  = new Hoodie();

$("#toolbar").toolbar({
    "list": function() {alert("List!");},
    "create": function() {alert("Create!");},
});
