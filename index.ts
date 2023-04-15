import { ApolloServer } from '@apollo/server';

import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
    type Book{
        title: String
        author: Author
    }

    type Author{
        name: String
        books: [Book]
    }


    type Mutation{
        addBook(title: String, author: String): Book
		removeBook(title:String): Book
    }

    type Query{
        books: [Book]
        authors: [Author]
    }
`;

let authors: any = [
	{
		name: 'Kate Chopin',
	},
	{
		name: 'Paul Auster',
	},
];

let books = [
	{
		title: 'The Awakening',
		author: authors[0],
	},

	{
		title: 'City of Glass',
		author: authors[1],
	},
];

authors[0]['books'] = [books[0]];
authors[1]['books'] = [books[1]];

function addBook(args) {
	const { title, author: authorName } = args;

	const authorsSet = new Set(authors.map((author) => author.name));

	let book = { title };
	let author = { name: authorName };

	if (!authorsSet.has(authorName)) {
		authors.push({ name: authorName, books: [book] });
		author['books'] = [book];
		book['author'] = author;
		books.push({ ...book, author });
	} else {
		for (const authorData of authors)
			if (authorData.name === authorName) {
				book['author'] = authorData;

				authorData.books.push(book);
				author['books'] = [...authorData.books, book];

				books.push({ ...book, author });
				break;
			}
	}

	console.log(books, '\n', authors);
	return book;
}

function removeBook(args) {
	const { title } = args;

	const book = books.filter((book) => book.title === title)[0];
	const newBooks = books.filter((book) => book.title !== title);

	for (const actualAuthor of authors)
		if (actualAuthor.name === book['author']['name']) {
			const newAuthorBooks = actualAuthor.books.filter(
				(book) => book.title !== title
			);

			actualAuthor['books'] = newAuthorBooks;
			break;
		}

	books = newBooks;
	return book;
}

const resolvers = {
	Query: {
		books: () => books,
		authors: () => authors,
	},
	Mutation: {
		addBook: (_, args) => addBook(args),
		removeBook: (_, args) => removeBook(args),
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
