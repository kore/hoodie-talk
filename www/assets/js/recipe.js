"use strict";

/**
 * Recipe handling
 */
;(function($) {
    $.fn.recipe = function(hoodie) {
        var ingredientRow = $(".ingredients").clone(),
            hoodie = hoodie;

        var addIngredient = function(e, data) {
            e.preventDefault();

            var newRow = $(ingredientRow).clone();
            $("button.ingredient").before(newRow);

            return false;
        };

        var getRecipeFromForm = function(form) {
            var formValues = $(form).serializeArray(),
                ingredient = {},
                recipe = {
                    "type": "recipe",
                    "title": "",
                    "ingredients": [],
                    "instructions": ""
                };

            
            for (var i = 0; i < formValues.length; ++i) {
                switch (formValues[i]["name"]) {
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
        };

        var addRecipe = function(e, data) {
            e.preventDefault();

            hoodie.store.add(getRecipeFromForm(e.target);

            return false;
        };

        return this.each(function() {
            $(this).find(".create button.ingredient").unbind("click");
            $(this).find(".create button.ingredient").bind("click", addIngredient);

            $(this).find(".create form").unbind("submit");
            $(this).find(".create form").bind("submit", addRecipe);
        });
    };
}(jQuery));
