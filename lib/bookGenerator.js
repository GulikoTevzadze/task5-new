import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';

export default function createBookGenerator(seed, region, avgLikes, avgReviews) {
  faker.locale = region;

  function generateBook(index) {
    const bookSeed = `${seed}-${index}`;
    const bookRng = seedrandom(bookSeed);

    const genres = getGenresByRegion(region);
    const randomGenre = genres[Math.floor(bookRng() * genres.length)];

    const authorCount = bookRng() > 0.6 ? 2 : 1;
    const authors = Array(authorCount).fill(null).map(() => faker.person.fullName());

    return {
      id: index,
      isbn: generateIsbn(bookRng),
      title: generateBookTitle(bookRng, region, randomGenre),
      authors,
      publisher: faker.company.name(),
      publishYear: 1950 + Math.floor(bookRng() * 74),
      genre: randomGenre,
      language: getLanguageFromRegion(region),
      pages: 100 + Math.floor(bookRng() * 900),
      likes: generateFractionalCount(avgLikes, bookRng),
      price: (4.99 + bookRng() * 35).toFixed(2),
      reviews: generateReviews(avgReviews, bookRng, region),
      cover: generateCover(bookRng, index, region),
      summary: faker.lorem.paragraphs(2)
    };
  }

  function generateReviews(avgCount, rng, region) {
    const integerReviews = Math.floor(avgCount);
    const probabilityReview = avgCount % 1;

    const reviews = Array(integerReviews)
      .fill(null)
      .map(() => ({
        reviewer: faker.person.fullName(),
        text: faker.lorem.paragraph(),
        rating: Math.floor(rng() * 3) + 3,
        date: faker.date.past({ years: 2 }).toISOString().split('T')[0]
      }));

    if (rng() < probabilityReview) {
      reviews.push({
        reviewer: faker.person.fullName(),
        text: faker.lorem.paragraph(),
        rating: Math.floor(rng() * 3) + 3,
        date: faker.date.past({ years: 2 }).toISOString().split('T')[0]
      });
    }

    return reviews;
  }

  function generateFractionalCount(avgCount, rng) {
    const integerCount = Math.floor(avgCount);
    const probability = avgCount % 1;
    return rng() < probability ? integerCount + 1 : integerCount;
  }

  function generateCover(rng,) {
    const coverPalettes = [
      ['#3498db', '#2980b9', '#1abc9c'],
      ['#e74c3c', '#c0392b', '#d35400'],
      ['#9b59b6', '#8e44ad', '#6c3483'],
      ['#2ecc71', '#27ae60', '#16a085'],
      ['#f1c40f', '#f39c12', '#e67e22'],
      ['#34495e', '#2c3e50', '#7f8c8d']
    ];

    const paletteIndex = Math.floor(rng() * coverPalettes.length);
    const palette = coverPalettes[paletteIndex];

    return {
      bgColor: palette[0],
      fgColor: palette[1],
      accentColor: palette[2],
      type: Math.floor(rng() * 3)
    };
  }

  function generateIsbn(rng) {
    const prefix = "978";
    let digits = prefix;

    for (let i = 0; i < 9; i++) {
      digits += Math.floor(rng() * 10);
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const formattedIsbn = `${digits.substring(0, 3)}-${digits.substring(3, 4)}-${digits.substring(4, 8)}-${digits.substring(8, 12)}-${checkDigit}`;

    return formattedIsbn;
  }

  function getLanguageFromRegion(region) {
    const languages = {
      'en_US': 'English',
      'fr_FR': 'French',
      'ja_JP': 'Japanese'
    };
    return languages[region] || 'Unknown';
  }

  function getGenresByRegion(region) {
    const genres = {
      'en_US': [
        'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller',
        'Horror', 'Biography', 'History', 'Self-Help', 'Business'
      ],
      'fr_FR': [
        'Roman policier', 'Science-fiction', 'Fantaisie', 'Romance',
        'Thriller', 'Horreur', 'Biographie', 'Histoire', 'Développement personnel', 'Affaires'
      ],
      'ja_JP': [
        'ミステリー', 'SF', 'ファンタジー', 'ロマンス', 'スリラー',
        'ホラー', '伝記', '歴史', '自己啓発', 'ビジネス'
      ]
    };
    return genres[region] || genres['en_US'];
  }

  function generateBookTitle(rng, region, genre) {
    const patterns = [
      () => `${faker.word.adjective({ rng })} ${faker.word.noun({ rng })}`,
      () => `The ${faker.word.adjective({ rng })} ${faker.word.noun({ rng })}`,
      () => `${faker.word.noun({ rng })} of ${faker.word.noun({ rng })}`,
      () => `${faker.person.firstName({ rng })}'s ${faker.word.noun({ rng })}`,
      () => `${faker.word.adverb({ rng })} ${faker.word.adjective({ rng })}`,
      () => `${faker.word.verb({ rng })} the ${faker.word.noun({ rng })}`
    ];

    const patternIndex = Math.floor(rng() * patterns.length);
    let title = patterns[patternIndex]();

    if (rng() < 0.3) {
      title += `: ${patterns[Math.floor(rng() * patterns.length)]()}`;
    }

    return title.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return {
    generateBooks: (count, startIndex = 1) =>
      Array.from({ length: count }, (_, i) => generateBook(startIndex + i))
  };
}
