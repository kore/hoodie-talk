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
                $(".my-recipes").empty();
                for (var i = 0; i < recipes.length; ++i) {
                    appendRecipe(".my-recipes", recipes[i]);
                }
            });

            hoodie.global.findAll("recipe").done(function (recipes) {
                $(".global-recipes").empty();
                for (var i = 0; i < recipes.length; ++i) {
                    appendRecipe(".global-recipes", recipes[i]);
                }
            });
        };

        var appendRecipe = function(target, recipe) {
            var recipeHtml = "<li>";
            recipeHtml += recipe.title;

            if (recipe["$public"]) {
                recipeHtml += ' <a class="unshare" href="" data-recipe="' + recipe.id + '"><span class="text-success glyphicon glyphicon-check"></span></a>';
            } else {
                recipeHtml += ' <a class="share" href="" data-recipe="' + recipe.id + '"><span class="text-danger glyphicon glyphicon-share"></span></a>';
            }

            recipeHtml += "</li>";
            $(target).append(recipeHtml);
            
            $(target).find("a").unbind("click");
            $(target).find("a.share").bind("click", shareRecipe);
            $(target).find("a.unshare").bind("click", unshareRecipe);
        };

        var shareRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).publish();

            buildList();
            return false;
        }

        var unshareRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).unpublish();

            buildList();
            return false;
        }

        return this.each(function() {
            $(this).find(".create button.ingredient").unbind("click");
            $(this).find(".create button.ingredient").bind("click", addIngredient);

            $(this).find(".create form").unbind("submit");
            $(this).find(".create form").bind("submit", addRecipe);

            buildList();
            hoodie.store.on('add:recipe', buildList);
            hoodie.global.on('add:recipe', buildList);
            hoodie.global.on('change:recipe', buildList);
        });
    };
}(jQuery));
