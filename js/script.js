'use strict';

const DAY_STRING = ['день', 'дня', 'дней'];

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
    mobileTemplatesInputElement = document.getElementById('mobileTemplates'),
    adaptInputElement = document.getElementById('adapt'),
    typeOfSiteElement = document.querySelector('.type-site'),
    maxDeadlineDaysElement = document.querySelector('.max-deadline'),
    rangeDeadlineElement = document.querySelector('.range-deadline'),
    deadlineValueElement = document.querySelector('.deadline-value'),
    checkboxLabels = document.querySelectorAll('.checkbox-label');

let declOfNum = function (n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};

let showElement = function (element) {
    element.style.display = 'block';
};

let hideElement = function (element) {
    element.style.display = 'none';
};

let renderPageTextContent = function (site, total, maxDays, minDays) {
    typeOfSiteElement.textContent = site;
    totalPriceSumElement.textContent = total;
    maxDeadlineDaysElement.textContent = declOfNum(maxDays, DAY_STRING);
    rangeDeadlineElement.min = minDays;
    rangeDeadlineElement.max = maxDays;
    deadlineValueElement.textContent = declOfNum(rangeDeadlineElement.value, DAY_STRING);
};

let priceCalculation = function (element) {
    let result = 0,
        index,
        options = [],
        dataSite = '',
        maxDays,
        minDays;

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
            dataSite = item.dataset.site;
            maxDays = DATA.deadlineDays[index][1];
            minDays = DATA.deadlineDays[index][0]
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
    }

    for (let item of formInputElements) {
        if (adaptInputElement.checked) {
            mobileTemplatesInputElement.removeAttribute('disabled');
        } else {
            mobileTemplatesInputElement.checked = false;
            mobileTemplatesInputElement.setAttribute('disabled', 'disabled');
        }
    }

    for (let item of formInputElements) {
        for (let span of checkboxLabels) {
            if ((span.classList.contains(item.value + '_value')) && item.checked) {
                span.textContent = 'Да';
            } else if ((span.classList.contains(item.value + '_value')) && !item.checked) {
                span.textContent = 'Нет';
            }
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

    renderPageTextContent(dataSite, result, maxDays, minDays);
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
