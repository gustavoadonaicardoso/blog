export type Book = {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  storagePath: string;
  pages?: number;
  published: boolean;
};

// Envie o PDF ao bucket privado "library-books" e adicione seus dados aqui.
// A capa opcional deve ficar em public/livros/capas.
export const books: Book[] = [
  // {
  //   slug: 'meu-primeiro-livro',
  //   title: 'Meu primeiro livro',
  //   description: 'Uma breve descrição do conteúdo do livro.',
  //   cover: '/livros/capas/meu-primeiro-livro.webp',
  //   storagePath: 'meu-primeiro-livro.pdf',
  //   pages: 120,
  //   published: true,
  // },
];

export function findPublishedBook(slug: string) {
  return books.find((book) => book.slug === slug && book.published);
}
