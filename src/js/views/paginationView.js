import View from "./View";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateButtonMarkupNext(currentPage);
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateButtonMarkupPrevious(currentPage);
    }
    //Other pages
    if (currentPage < numPages) {
      return `
      ${this._generateButtonMarkupPrevious(
        currentPage
      )} ${this._generateButtonMarkupNext(currentPage)}
      `;
    }
    //Page 1, and there are no pages
    return "";
  }
  _generateButtonMarkupNext(currentPage) {
    return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
  }

  _generateButtonMarkupPrevious(currentPage) {
    return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
      `;
  }
}

export default new PaginationView();
