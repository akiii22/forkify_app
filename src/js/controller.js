import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchViews from "./views/searchViews.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookMarksView from "./views/bookMarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (import.meta.hot) {
  import.meta.hot.accept();
}

const controlRecipes = async function () {
  //1 Loading recipe
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getResultPage());
    bookMarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    //2. Rendering recipe
    recipeView.render(model.state.recipe);
    //Render The bookmark
    bookMarksView.render(model.state.bookmarks);

    //Change id in the  url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchViews.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    resultsView.render(model.getResultPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Update the results view and pagination buttons
  resultsView.render(model.getResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  //Update the recipe view
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookMarksView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show Loading spinner
    addRecipeView.renderSpinner();
    //Upload the new Recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //closeFormWindow
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error("💣", err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
  searchViews.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
