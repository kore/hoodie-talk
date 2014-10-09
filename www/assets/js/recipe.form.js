(function( global ) {

    form = function() {
    };

    form.ingredientRow = $(".ingredients").clone(),

    /**
     * Get form values as recipe object
     *
     * @param string form
     */
    form.getRecipe = function(form) {
        var formValues = $(form).serializeArray(),
            ingredient = {},
            recipe = {
                "id": null,
                "title": "",
                "ingredients": [],
                "instructions": "",
                "author": hoodie.account.username
            };

        
        for (var i = 0; i < formValues.length; ++i) {
            switch (formValues[i]["name"]) {
                case "id":
                    recipe.id = formValues[i]["value"] || null;
                    break;
                case "title":
                    recipe.title = formValues[i]["value"] || "";
                    break;
                case "instructions":
                    recipe.instructions = formValues[i]["value"] || "";
                    break;

                case "amount":
                    ingredient = {
                        "amount": formValues[i]["value"],
                        "unit": "g",
                        "name": ""
                    };
                    recipe.ingredients.push(ingredient);
                    break;
                case "unit":
                    ingredient["unit"] = formValues[i]["value"];
                    break;
                case "name":
                    ingredient["name"] = formValues[i]["value"];
                    break;
            }
        }

        return recipe;
    }

    form.addRow = function(e, data) {
        e.preventDefault();

        var newRow = $(form.ingredientRow).clone();
        $("button.ingredient").before(newRow);

        return false;
    }

    // Exports
    global.Recipe = global.Recipe || {};
    global.Recipe.form = form;

})(this);
