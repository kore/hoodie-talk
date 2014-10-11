var request = require('request'),
    follow = require('follow'),
    markdownpdf = require("markdown-pdf");

var couchPort = '6009';

if (process.env.COUCH_PORT) {
    couchPort = process.env.COUCH_PORT;
}
var couchUrl = 'http://localhost:' + couchPort;
var globalShareDbUrl = couchUrl + '/hoodie-plugin-global-share';

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
        globalShareDbUrl + '/_all_docs?include_docs=true',
        function (error, response, body) {
            var documents = JSON.parse(body).rows;
            // retrieve only the recipe rows
            var recipeRows = documents.filter(function (doc) {
                return doc.id.substring(0, 7) === 'recipe/';
            });

            // Retrieve to document of every view
            var recipes = recipeRows.map(function (row) {
                return row.doc;
            })

            markdownpdf().from.string(
                // format the recipe documents
                recipes.map(formatRecipe).join("\n\n")
            ).to("document.pdf", function () {
                    console.log("Done")
                })
        }
    )
}

// Always regenerate the pdf at the beginning
generatePdf();

follow(
    {
        db: globalShareDbUrl,
        feed: 'continuous',
        since: 'now',
        include_docs: false
    },
    function (error, change) {
        // Only listen to changes of recipes
        if (change.id.substring(0, 7) === 'recipe/') {
            generatePdf();
        }
    }
);

