
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}



class UI {
    // Add Book to ul
    addBookToList(book) {
        const list = document.querySelector("#book-list");

        // Create a tr element
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="delete">
                <a href="#" class="btn btn-danger">X</a>
            </td>
        `;

        list.appendChild(row);
    }




    deleteBook(target) {
        if (confirm("Are you sure?")) {
            if (target.className === "delete") {
                const isbn = target.parentElement.querySelector('td:nth-child(3)').textContent;
                Store.removeBook(isbn);
                target.parentElement.remove();

                document.getElementById("book-deleted").style.display = "block";
                setTimeout(() => {
                    document.getElementById("book-deleted").style.display = "none";
                }, 3000);
            }
        }
    }




    clearField() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }



    filterBooks() {
        const searchText = document.querySelector("#search").value.toLowerCase();
        const rows = document.querySelectorAll("#book-list tr");

        rows.forEach(function(row) {
            const titleCell = row.querySelector("td:nth-child(1)");
            const authorCell = row.querySelector("td:nth-child(2)");

            if (titleCell.innerText.toLowerCase().includes(searchText) || authorCell.innerText.toLowerCase().includes(searchText)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
}




class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }




    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }




    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }




    static removeBook(isbn) {
        const books = Store.getBooks();
        const updatedBooks = books.filter(book => book.isbn !== isbn);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
    }
}



// DOM LOADED
document.addEventListener("DOMContentLoaded", Store.displayBooks);



// Event Listen for submit
document.querySelector("#book-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    const book = new Book(title, author, isbn);
    const ui = new UI();



    if (title === "" || author === "" || isbn === "") {
        document.getElementById("fill-form").style.display = "block";
        setTimeout(() => {
            document.getElementById("fill-form").style.display = "none";
        }, 3000);
    } else {
        ui.addBookToList(book);
        Store.addBook(book);
        ui.clearField();

        document.getElementById("book-added").style.display = "block";
        setTimeout(() => {
            document.getElementById("book-added").style.display = "none";
        }, 3000);
    }
});




// Delete Event listener
document.querySelector("#book-list").addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.parentElement.className === "delete") {
        const ui = new UI();
        ui.deleteBook(e.target.parentElement);
    }
});




// Clear Event listener
document.querySelector(".clear-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#book-list").innerHTML = null;
    if (localStorage.getItem("books")) {
        localStorage.removeItem("books");
    }

    
    document.getElementById("book-clear").style.display = "block";
    setTimeout(() => {
        document.getElementById("book-clear").style.display = "none";
    }, 3000);
});



document.querySelector("#search").addEventListener("input", function() {
    const ui = new UI();
    ui.filterBooks();
});
