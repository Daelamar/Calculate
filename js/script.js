'use strict';
const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDays: [[2, 7], [3, 10], [7, 14]],
    deadlinePercents: [20, 17, 15]
};

const startButtonElement = document.querySelector('.start-button'),
    firstScreenElement = document.querySelector('.first-screen'),
    mainFormElement = document.querySelector('.main-form'),
    formInputElements = mainFormElement.querySelectorAll('input'),
    formFieldsetElements = mainFormElement.querySelectorAll('fieldset'),
    formCalculateElement = document.querySelector('.form-calculate'),
    endButtonElement = document.querySelector('.end-button'),
    totalFieldsetElement = document.querySelector('.total'),
    fastRangeElement = document.querySelector('.fast-range'),
    totalPriceSumElement = document.querySelector('.total_price__sum'),
    mobileTemplatesInputElement = document.querySelector('#mobileTemplates');

let showElement = function (element) {
    element.style.display = 'block';
};

let hideElement = function (element) {
    element.style.display = 'none';
};

let priceCalculation = function (element) {
    let result = 0,
        index,
        options = [];

    if (element.name === 'whichSite') {
        for (let item of formInputElements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElement(fastRangeElement);
    }

    for (let item of formInputElements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
    }

    for (let item of formInputElements) {
        if (item.value === 'adapt' && item.checked) {
            mobileTemplatesInputElement.removeAttribute('disabled');

        } else if (item.value === 'adapt' && !item.checked) {
            mobileTemplatesInputElement.setAttribute('disabled', 'disabled');
        }
    }

    options.forEach(function (key) {
        if (typeof (DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key];
            } else {
                result += DATA.price[index] * DATA[key] / 100;
            }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA.desktopTemplates[index] / 100;
            } else {
                result += DATA[key][index];
            }
        }
    });

    result += DATA.price[index];

    totalPriceSumElement.textContent = result;
};

let callbackFormHandler = function (evt) {
    const target = evt.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElement(fastRangeElement) : hideElement(fastRangeElement);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

startButtonElement.addEventListener('click', function () {
    hideElement(firstScreenElement);
    showElement(mainFormElement);
});

endButtonElement.addEventListener('click', function () {
    for (let item of formFieldsetElements) {
        hideElement(item);
    }
    showElement(totalFieldsetElement);
});

formCalculateElement.addEventListener('change', callbackFormHandler);
