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

            var recipe = getRecipeFromForm(e.target);
            hoodie.store.add("recipe", recipe);

            return false;
        };

        var buildList = function() {
            hoodie.store.findAll("recipe").done(function (recipes) {
                for (var i = 0; i < recipes.length; ++i) {
                    appendRecipe(".list ul.recipes", recipes[i]);
                }
            });

            hoodie.store.on('add:recipe', function(recipe) {
                appendRecipe(".list ul.recipes", recipe);
            });
        };

        var appendRecipe = function(target, recipe) {
            var recipeHtml = "<li>";

            recipeHtml += recipe.title;

            if (recipe["$public"]) {
                recipeHtml += ' <span class="glyphicon glyphicon-check"></span>';
            } else {
                recipeHtml += ' <a class="share" href="" data-recipe="' + recipe.id + '"><span class="glyphicon glyphicon-share"></span></a>';
            }

            recipeHtml += "</li>";

            $(target).append(recipeHtml);
            
            $(target).find("a.share").unbind("click");
            $(target).find("a.share").bind("click", shareRecipe);
        };

        var shareRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).publish();

            return false;
        }

        return this.each(function() {
            $(this).find(".create button.ingredient").unbind("click");
            $(this).find(".create button.ingredient").bind("click", addIngredient);

            $(this).find(".create form").unbind("submit");
            $(this).find(".create form").bind("submit", addRecipe);

            buildList();
        });
    };
}(jQuery));
