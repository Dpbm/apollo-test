# Apollo + GraphQL

Testing these technologies with nodejs.

## how to use
```bash
pnpm compile && pnpm start
```
after running the project, connect to `http://localhost:4000` and run the queries

## Data

```GraphQL
    Book{
        title: String
        author: Author
    }

    Author{
        name: String
        books: [Book]
    }
```

## Queries

```GraphQL
    books: [Book]
    authors: [Author]
```

## Mutations

```GraphQL
    addBook(title: String, author:String): Book;
    removeBook(title:String): Book;
```

