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
                    "instructions": "",
                    "author": hoodie.account.username
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

        var updateRecipeList = function() {
            hoodie.store.findAll("recipe").done(function (recipes) {
                renderList(".my-recipes", "my-recipes.tpl", recipes);
            });

            hoodie.global.findAll("recipe").done(function (recipes) {
                renderList(".global-recipes", "global-recipes.tpl", recipes);
            });
        };

        var renderList = function(target, template, recipes) {
            $(target).empty();
            recipes.sort(function(a, b) {
                return ((a.title == b.title) ? 0 : ((a.title > b.title) ? 1 : -1));
            });

            Recipe.template.showTemplate(
                target,
                "templates/" + template,
                {"recipes": recipes},
                function () {
                    $(target).find("a").unbind("click");

                    $(target).find("a.share").bind("click", shareRecipe);
                    $(target).find("a.unshare").bind("click", unshareRecipe);
                }
            );
        };

        var shareRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).publish();

            updateRecipeList();
            return false;
        }

        var unshareRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).unpublish();

            updateRecipeList();
            return false;
        }

        return this.each(function() {
            $(this).find(".create button.ingredient").unbind("click");
            $(this).find(".create button.ingredient").bind("click", addIngredient);

            $(this).find(".create form").unbind("submit");
            $(this).find(".create form").bind("submit", addRecipe);

            updateRecipeList();
            hoodie.store.on('add:recipe', updateRecipeList);
            hoodie.global.on('add:recipe', updateRecipeList);
            hoodie.global.on('change:recipe', updateRecipeList);
        });
    };
}(jQuery));
