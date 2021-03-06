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
    desktopTemplatesInputElement = document.getElementById('desktopTemplates'),
    mobileTemplatesInputElement = document.getElementById('mobileTemplates'),
    adaptInputElement = document.getElementById('adapt'),
    editableInputElement = document.getElementById('editable'),
    desktopTemplatesValueElement = document.querySelector('.desktopTemplates_value'),
    mobileTemplatesValueElement = document.querySelector('.mobileTemplates_value'),
    adaptValueElement = document.querySelector('.adapt_value'),
    editableValueElement = document.querySelector('.editable_value'),
    typeOfSiteElement = document.querySelector('.type-site'),
    maxDeadlineDaysElement = document.querySelector('.max-deadline'),
    rangeDeadlineElement = document.querySelector('.range-deadline'),
    deadlineValueElement = document.querySelector('.deadline-value'),
    calcDescriptionElement = document.querySelector('.calc-description'),
    metrikaYandexInputElement = document.getElementById('metrikaYandex'),
    analyticsGoogleInputElement = document.getElementById('analyticsGoogle'),
    sendOrderInputElement = document.getElementById('sendOrder'),
    cardHeadElement = document.querySelector('.card-head'),
    totalPriceElement = document.querySelector('.total_price'),
    firstFieldsetElement = document.querySelector('.first-fieldset');


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

let extraOptionText = function () {
    let text = '';
    if (metrikaYandexInputElement.checked && analyticsGoogleInputElement.checked && sendOrderInputElement.checked) {
        text = 'Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.';
    } else if (metrikaYandexInputElement.checked || analyticsGoogleInputElement.checked || sendOrderInputElement.checked) {

        text += 'Подключим';

        if ((metrikaYandexInputElement.checked)) {
            text += ' Яндекс Метрику';

            if (analyticsGoogleInputElement.checked && sendOrderInputElement.checked) {
                text += ', Гугл Аналитику и отправку заявок на почту';
                return;
            }
            if (analyticsGoogleInputElement.checked || sendOrderInputElement.checked) {
                text += ' и';
            }
        }

        if (analyticsGoogleInputElement.checked) {
            text += ' Гугл Аналитику';

            if (sendOrderInputElement.checked) {
                text += ' и';
            }
        }

        if (sendOrderInputElement.checked) {
            text += ' отправку заявок на почту';
        }
        text += '.';
    }

    return text;
};


let renderPageTextContent = function (site, total, maxDays, minDays) {
    typeOfSiteElement.textContent = site;
    totalPriceSumElement.textContent = total;
    maxDeadlineDaysElement.textContent = declOfNum(maxDays, DAY_STRING);
    rangeDeadlineElement.min = minDays;
    rangeDeadlineElement.max = maxDays;
    deadlineValueElement.textContent = declOfNum(rangeDeadlineElement.value, DAY_STRING);

    desktopTemplatesValueElement.textContent = desktopTemplatesInputElement.checked ? 'Да' : 'Нет';
    mobileTemplatesValueElement.textContent = mobileTemplatesInputElement.checked ? 'Да' : 'Нет';
    adaptValueElement.textContent = adaptInputElement.checked ? 'Да' : 'Нет';
    editableValueElement.textContent = editableInputElement.checked ? 'Да' : 'Нет';

    calcDescriptionElement.textContent =
        `Сделаем ${site}${adaptInputElement.checked ? ', адаптированный под мобильные устройства и планшеты' : ''}.
         ${editableInputElement.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : ''}
         ${extraOptionText()}`
};

let priceCalculation = function (element = {}) {
    let result = 0,
        index = 0,
        options = [],
        dataSite = '',
        maxDays = 0,
        minDays = 0,
        overDays = 0,
        overPercents = 0;

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
        } else if (item.classList.contains('want-faster') && item.checked) {
            overDays = maxDays - rangeDeadlineElement.value;
            overPercents = overDays * (DATA.deadlinePercents[index] / 100);
        }
    }

    result += DATA.price[index];

    for (let item of formInputElements) {
        if (adaptInputElement.checked) {
            mobileTemplatesInputElement.removeAttribute('disabled');
        } else {
            mobileTemplatesInputElement.checked = false;
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

    result += (result * overPercents);

    renderPageTextContent(dataSite, result, maxDays, minDays);
};

let moveBackTotal = function () {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
        totalPriceElement.classList.remove('totalPriceBottom');
        firstFieldsetElement.after(totalPriceElement);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
    }
};

let moveTotal = function () {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
        totalPriceElement.classList.add('totalPriceBottom');
        endButtonElement.before(totalPriceElement);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
};

let callbackFormHandler = function (evt) {
    const target = evt.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElement(fastRangeElement) : hideElement(fastRangeElement);
        priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

startButtonElement.addEventListener('click', function () {
    hideElement(firstScreenElement);
    showElement(mainFormElement);
    window.addEventListener('scroll', moveTotal);
});

endButtonElement.addEventListener('click', function () {
    for (let item of formFieldsetElements) {
        hideElement(item);
    }
    cardHeadElement.textContent = 'Заявка на разработку сайта';
    hideElement(totalPriceElement);
    showElement(totalFieldsetElement);
});

formCalculateElement.addEventListener('change', callbackFormHandler);

priceCalculation();
