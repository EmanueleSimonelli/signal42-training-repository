
function getQueryString(page) {
    var elements = document.querySelector('form').elements;
    var query = [
        ['ssp_ids', Array.from(elements['ssp'].querySelectorAll('option'))
            .filter(function(option) { return option.selected; })
            .map(function(option) { return option.value; })
            .join(',')
        ],
        ['page', page],
        ['page-size', elements['page-size'].value],
        ['from-date', elements['from-date'].value],
        ['to-date', elements['to-date'].value],
    ];
    return query.map(function (pair) { return pair[0] + '=' + pair[1] }).join('&');
}

function showLoader() {
    var loader = document.querySelector('.loader');
    loader.setAttribute('data-open', '');
    loader.setAttribute('aria-hidden', 'false');
}

function hideLoader() {
    var loader = document.querySelector('.loader');
    loader.removeAttribute('data-open');
    loader.setAttribute('aria-hidden', 'true');
}

// Navigate while showing the loading indicator. The loader stays visible until
// the browser replaces the document with the freshly rendered page, which is
// helpful when a large page size makes the request take a while to come back.
function navigate(url) {
    showLoader();
    location.assign(url);
}

// Hide the loader when the page is restored from the back/forward cache,
// otherwise it would stay visible after navigating back.
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        hideLoader();
    }
});

function toggle(modal) {
    if (modal.hasAttribute('data-open')) {
        modal.removeAttribute('data-open');
    } else {
        document.querySelectorAll('[data-open]').forEach(function(modal) {
            modal.removeAttribute('data-open');
        });
        var closer = modal.querySelector('.closer');
        if (closer) {
            closer.addEventListener('click', function() {
                modal.removeAttribute('data-open');
                closer.removeEventListener('click', arguments.callee);
            });
        }
        modal.setAttribute('data-open', '');
    }
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    navigate('/sellers?' + getQueryString(0));
});

document.querySelector('.filters-opener').addEventListener('click', function(event) {
    event.preventDefault();
    toggle(document.querySelector('.filters'));
});

document.querySelector('.select-all').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelectorAll('#ssp option').forEach(function(option) {
        option.selected = true;
    });
});

document.querySelector('.select-numeric').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelectorAll('#ssp option').forEach(function(option) {
        option.selected = ssps[option.value].hasNumericId;
    });
});

document.querySelector('.clear-dates').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelectorAll('#from-date,#to-date').forEach(function(input) {
        input.value = '';
    });
});

document.querySelector('.pagination .prev').addEventListener('click', function(event) {
    event.preventDefault();
    navigate('/sellers?' + getQueryString(Math.max(page - 1, 0)));
});

document.querySelector('.pagination .next').addEventListener('click', function(event) {
    event.preventDefault();
    navigate('/sellers?' + getQueryString(page + 1));
});

document.querySelectorAll('.results td:not(:first-child)').forEach(function(result) {
    result.addEventListener('click', function() {
        var modal = document.querySelector('.details');
        modal.querySelector('.seller-id').innerHTML = result.querySelector('.seller-id').innerHTML;
        modal.querySelector('.seller-name').innerHTML = result.querySelector('.seller-name').innerHTML;
        modal.querySelector('.seller-domain').innerHTML = result.querySelector('.seller-domain').innerHTML;
        if (result.querySelector('.import-date')) {
            modal.querySelector('.import-date').innerHTML = result.querySelector('.import-date').innerHTML;
            modal.querySelector('.import-date-section').classList.add('visible');
        }
        var closer = modal.querySelector('.closer');
        if (closer) {
            closer.addEventListener('click', function() {
                modal.removeAttribute('data-open');
                closer.removeEventListener('click', arguments.callee);
            });
        }
        modal.setAttribute('data-open', '');
    });
});
