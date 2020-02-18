const startButtonElement = document.querySelector('.start-button');
const firstScreenElement = document.querySelector('.first-screen');
const mainFormElement = document.querySelector('.main-form');
const formCalculateElement = document.querySelector('.form-calculate');
const endButtonElement = document.querySelector('.end-button');
const totalFieldsetElement = document.querySelector('.total');
const fastRangeElement = document.querySelector('.fast-range');

let showElement = function (element) {
    element.style.display = 'block';
};

let hideElement = function (element) {
    element.style.display = 'none';
};

let selectFastRangeHandler = function (evt) {
    const target = evt.target;
    console.log(target, target.classList);

    if (target.classList.contains('want-faster')) {
        target.checked ? showElement(fastRangeElement) : hideElement(fastRangeElement);
    }
};

startButtonElement.addEventListener('click', function () {
    hideElement(firstScreenElement);
    showElement(mainFormElement);
});

endButtonElement.addEventListener('click', function () {
    for (let element of formCalculateElement.elements) {
        if (element.tagName === 'FIELDSET') {
            hideElement(element);
        }
    }
    showElement(totalFieldsetElement);
});

formCalculateElement.addEventListener('change', selectFastRangeHandler);
