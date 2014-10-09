"use strict";

/**
 * Recipe handling
 */
;(function($) {
    $.fn.recipe = function(hoodie) {
        var hoodie = hoodie;

        var addRecipe = function(e, data) {
            e.preventDefault();

            var recipe = Recipe.form.getRecipe(e.target);
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

                    $(target).find("a.mine").bind("click", showRecipe);
                    $(target).find("a.shared").bind("click", showSharedRecipe);
                    $(target).find("a.share").bind("click", shareRecipe);
                    $(target).find("a.unshare").bind("click", unshareRecipe);
                }
            );
        };

        var showRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.store.find("recipe", recipeId).done(function(recipe) {
                $('#toolbar').trigger("displayPage", {page: "recipe"});
                Recipe.template.showTemplate(
                    ".recipe",
                    "templates/recipe.tpl",
                    recipe
                );
            });

            updateRecipeList();
            return false;
        }

        var showSharedRecipe = function(e, data) {
            e.preventDefault();

            var recipeId = $(e.currentTarget).data("recipe");
            hoodie.global.find("recipe", recipeId).done(function(recipe) {
                $('#toolbar').trigger("displayPage", {page: "recipe"});
                Recipe.template.showTemplate(
                    ".recipe",
                    "templates/recipe.tpl",
                    recipe
                );
            });

            updateRecipeList();
            return false;
        }

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
            $(this).find(".create button.ingredient").bind("click", Recipe.form.addRow);

            $(this).find(".create form").unbind("submit");
            $(this).find(".create form").bind("submit", addRecipe);

            updateRecipeList();
            hoodie.store.on('add:recipe', updateRecipeList);
            hoodie.global.on('add:recipe', updateRecipeList);
            hoodie.global.on('change:recipe', updateRecipeList);

            hoodie.account.on('signup changeusername signin reauthenticated signout', updateRecipeList);
        });
    };
}(jQuery));
