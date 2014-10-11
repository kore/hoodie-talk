var request = require('request'),
    follow = require('follow'),
    markdownpdf = require("markdown-pdf");

var couchPort = '6009';

if (process.env.COUCH_PORT) {
    couchPort = process.env.COUCH_PORT;
}

var couchUrl = 'http://localhost:' + couchPort;
var globalShareDb = couchUrl + '/hoodie-plugin-global-share';

function formatTitle(recipe) {
    return '#' + recipe.title + ' by ' + recipe.author + "\n";
}

function formatIngredients(recipe) {
    console.log(recipe.ingredients);
    return "### Ingredients\n"
        + recipe.ingredients.map(function (ingredient) {
            return ' - ' + ingredient.amount + ingredient.unit + ' ' + ingredient.name + "\n" ;
        })
        + "\n";
}

function formatInstructions(recipe) {
    return "### Instructions\n" + recipe.instructions;
}

function formatRecipe(recipe) {
    return formatTitle(recipe)
    + formatIngredients(recipe)
    + formatInstructions(recipe);
};

function generatePdf() {
    request(
        globalShareDb + '/_all_docs?include_docs=true',
        function (error, response, body) {
            var documents = JSON.parse(body).rows;
            var recipeRows = documents.filter(function (doc) {
                return doc.id.substring(0, 7) === 'recipe/';
            });
            var recipes = recipeRows.map(function (row) {
                return row.doc;
            })

            console.log(recipes);
            markdownpdf().from.string(
                recipes.map(formatRecipe).join("\n\n")
            ).to("document.pdf", function () {
                    console.log("Done")
                })
        }
    )
}

generatePdf();

follow(
    {
        db: globalShareDb,
        feed: 'continuous',
        since: 'now',
        include_docs: false
    },
    function (error, change) {
        if (change.id.substring(0, 7) === 'recipe/') {
            generatePdf();
        }
    }
);

