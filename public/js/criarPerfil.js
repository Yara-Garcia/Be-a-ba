document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.parentElement.classList.toggle('show');
    });
});

document.querySelectorAll('.dropdown-search').forEach(search => {
    search.addEventListener('input', function () {
        var filter = this.value.toLowerCase();
        var labels = this.parentElement.querySelectorAll('label');
        labels.forEach(function (label) {
            var text = label.textContent.toLowerCase();
            if (text.includes(filter)) {
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
    });
});

window.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-search') && !event.target.matches('.checkbox')) {
        var dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove('show');
        });
    }
});

const modules = {
    modulo1: ["Transação A", "Transação B"],
    modulo2: ["Transação C", "Transação D"],
    modulo3: ["Transação E", "Transação F"]
};

const transactions = {
    "Transação A": ["Função A1", "Função A2"],
    "Transação B": ["Função B1", "Função B2"],
    "Transação C": ["Função C1", "Função C2"],
    "Transação D": ["Função D1", "Função D2"],
    "Transação E": ["Função E1", "Função E2"],
    "Transação F": ["Função F1", "Função F2"]
};

document.querySelectorAll('#dropdownModules .checkbox').forEach(input => {
    input.addEventListener('change', function () {
        const selectedModules = Array.from(document.querySelectorAll('#dropdownModules .checkbox:checked')).map(el => el.value);
        const transactionDropdown = document.querySelector('#transactionsDropdown .dropdown-content');


        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'dropdown-search';
        searchInput.placeholder = 'Buscar...';


        while (transactionDropdown.firstChild) {
            transactionDropdown.removeChild(transactionDropdown.firstChild);
        }

        transactionDropdown.appendChild(searchInput);

        let transactionItems = new Set();
        selectedModules.forEach(module => {
            modules[module].forEach(transaction => {
                transactionItems.add(transaction);
            });
        });

        transactionItems.forEach(transaction => {
            const label = document.createElement('label');
            label.className = 'dropdown-item';
            label.innerHTML = `<input type="checkbox" value="${transaction}">${transaction}`;
            label.querySelector('input').addEventListener('change', function () {
                if (this.checked) {
                    openFunctionsModal(transaction);
                }
            });
            transactionDropdown.appendChild(label);
        });
        document.getElementById('transactionsDropdown').style.display = selectedModules.length ? 'block' : 'none';
    });
});

function openFunctionsModal(transaction) {
    const modalBody = document.querySelector('#functionsModal .modal-body');
    modalBody.innerHTML = '';
    transactions[transaction].forEach(func => {
        const label = document.createElement('label');
        label.className = 'dropdown-item';
        label.innerHTML = `<input type="checkbox" value="${func}">${func}`;
        modalBody.appendChild(label);
    });
    $('#functionsModal').modal('show');
}