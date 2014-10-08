"use strict";

var hoodie  = new Hoodie();

$("#toolbar").toolbar({
    "list": function() {},
    "create": function() {},
});

$(".content").recipe(hoodie);
