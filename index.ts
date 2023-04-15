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

const resolvers = {
	Query: {
		books: () => books,
		authors: () => authors,
	},
	Mutation: {
		addBook: (_, args) => addBook(args),
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
