document.addEventListener("DOMContentLoaded", () => {
    loadSheetData();

    const modal = document.getElementById("bookModal");
    const span = document.getElementsByClassName("close")[0];
    const floatingButton = document.getElementById("floatingButton");

    // Clique no botão flutuante para abrir o modal
    floatingButton.addEventListener("click", () => {
        modal.style.display = "block";
        document.body.classList.add("modal-open");
    });

    // Clique no botão de fechar para fechar o modal
    span.onclick = function() {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // Clique fora do modal para fechar o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    }
});

function loadSheetData() {
    // URL da planilha Google publicada
    const url = 'https://docs.google.com/spreadsheets/d/1UjL-gfXl2zT_GM-PQpc9RVmxlJ23YHXQlJaOg8SX8hU/gviz/tq?tqx=out:json';

    fetch(url)
        .then(response => response.text())
        .then(text => {
            // Extraí o JSON da resposta
            const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.+)\)/);
            if (jsonMatch) {
                const jsonData = jsonMatch[1];
                const data = JSON.parse(jsonData);

                // Exibe os dados na tela
                displayBooks(data.table.rows);
            } else {
                console.error('Erro ao extrair JSON da resposta:', text);
            }
        })
        .catch(error => {
            console.error('Error loading Google Sheets data:', error);
        });
}

function displayBooks(rows) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = '';

    rows.forEach(row => {
        const book = row.c || []; // Verifica se `row.c` existe

        if (book[2].v != '') {
            const bookDiv = document.createElement("div");
            bookDiv.className = "book";

            const img = document.createElement("img");
            const nameBook = book[2] ? book[2].v.replace(/[?!]/g, '').replace(/^\s+|\s+$/g, '') : 'default'; // Verifica se `book[2]` existe
            img.src = `data/images/${nameBook}.jpg`;
            img.onerror = () => {
                img.src = `data/images/emptyState.png`;
            };
            bookDiv.appendChild(img);

            const title = document.createElement("h2");
            title.textContent = book[2].v;
            bookDiv.appendChild(title);

            const description = document.createElement("p");
            description.textContent = book[5] ? book[5].v : ''; // Verifica se `book[5]` existe
            description.className = "summary";
            bookDiv.appendChild(description);

            const author = document.createElement("p");
            author.textContent = book[3] ? `Autor: ${book[3].v}` : ''; // Verifica se `book[3]` existe
            author.className = "author";
            bookDiv.appendChild(author);

            // Verifica a disponibilidade e cria a tag apropriada
            const availability = book[6] ? book[6].v : 'disponível'; // Verifica se `book[6]` existe
            const availabilityTag = document.createElement("div");
            
            if (availability.toLowerCase() === 'indisponível') {
                availabilityTag.className = "availability-tag";
                availabilityTag.innerHTML = `
                    <span>Indisponível</span>
                    <span class="date">Previsão de disponibilidade: ${book[7] ? book[7].f : 'Não disponível'}</span>
                `;
            } else {
                availabilityTag.className = "availability-tag available";
                availabilityTag.textContent = "Disponível";
            }

            bookDiv.appendChild(availabilityTag);
            bookList.appendChild(bookDiv);
        };
    });
}

function filterBooks() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    const books = document.querySelectorAll(".book");
    let found = false;

    books.forEach(book => {
        const title = book.querySelector("h2").textContent.toLowerCase();
        const author = book.querySelector(".author").textContent.toLowerCase();
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
            book.style.display = "";
            found = true;
        } else {
            book.style.display = "none";
        }
    });

    const noResultsMessage = document.getElementById("noResultsMessage");
    if (!found) {
        noResultsMessage.style.display = "block"; // Mostra a mensagem
    } else {
        noResultsMessage.style.display = "none"; // Esconde a mensagem
    }
}
