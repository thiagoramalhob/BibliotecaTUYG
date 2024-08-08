document.addEventListener("DOMContentLoaded", () => {
    loadExcelData();

    const modal = document.getElementById("bookModal");
    const span = document.getElementsByClassName("close")[0];
    const floatingButton = document.getElementById("floatingButton");

    //clique no botão flutuante para abrir o modal
    floatingButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    //clique no botão de fechar para fechar o modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    //clique fora do modal para fechar o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

function loadExcelData() {
    const url = './data/inventarioDeLivros.xlsx';

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const books = XLSX.utils.sheet_to_json(firstSheet);

            displayBooks(books);
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);
        });
}

function displayBooks(books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = '';

    books.forEach(book => {

        const bookDiv = document.createElement("div");
        bookDiv.className = "book";

        const img = document.createElement("img");
        img.src = `data/images/${book["Nome do Livro"]}.jpg`;
        img.onerror = () => {
            img.src = `data/images/emptyState.png`;
        };
        bookDiv.appendChild(img);

        const title = document.createElement("h2");
        title.textContent = book["Nome do Livro"];
        bookDiv.appendChild(title);

        const description = document.createElement("p");
        description.textContent = book.Resumo;
        description.className = "summary";
        bookDiv.appendChild(description);

        const author = document.createElement("p");
        author.textContent = `Autor: ${book.Autor}`;
        bookDiv.appendChild(author);

        // const editora = document.createElement("p");
        // editora.textContent = `Editora: ${book.Editora}`;
        // bookDiv.appendChild(editora);

        bookList.appendChild(bookDiv);
    });
}

function filterBooks() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    const books = document.querySelectorAll(".book");

    books.forEach(book => {
        const title = book.querySelector("h2").textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            book.style.display = "";
        } else {
            book.style.display = "none";
        }
    });
}
