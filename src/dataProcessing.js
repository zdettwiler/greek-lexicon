import axios from 'axios';

/**
 *
 * @param {Array} words
 */
function uniqueWordsCounts(words) {
  return words.reduce((acc, cur) => {
    if (acc[cur.greek]) {
      acc[cur.greek] = {
        ...acc[cur.greek],
        countsBook: acc[cur.greek].countsBook + 1,
      };
    } else {
      acc[cur.greek] = {
        ...cur,
        countsBook: 1,
      };
    }

    return acc;
  }, {});
}

/**
 *
 * @param {Object} words
 */
function rareUniqueWordsCounts(words) {
  return Object.values(words).reduce((acc, cur) => {
    if (cur.countsNT <= 30) {
      acc[cur.greek] = cur;
    }

    return acc;
  }, {});
}

export default async function getData() {
  let data;
  try {
    data = await axios.get('https://raw.githubusercontent.com/tyndale/STEPBible-Data/master/TAGNT%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC-BY.txt');
  } catch (e) { console.log(e, data); }

  const rows = data.data.trim().split('\n');
  const headings = rows[65];
  console.log(headings.split('\t'));
  rows.splice(0, 67);

  // get all Tyndale words
  const allTyndaleWords = rows.reduce((acc, cur) => {
    const values = cur.split('\t');
    const ref = values[0].split('.');

    if (values[8] && values[8].includes('Tyn')) {
      acc.push({
        book: ref[0],
        chapter: parseInt(ref[1], 10),
        verse: parseInt(ref[2], 10),
        greek: values[6],
        english: values[7],
      });
    }
    return acc;
  }, []);
  console.log('All Tyndale Words', allTyndaleWords.length, allTyndaleWords[0]);

  // all unique greek words and their counts in whole NT
  const uniqueWordsNT = uniqueWordsCounts(allTyndaleWords);
  console.log('Unique Tyndale Words', Object.keys(uniqueWordsNT).length);

  // all of John
  const johnWords = allTyndaleWords.reduce((acc, cur) => {
    if (cur.book === '44_Jhn') {
      acc.push({
        ...cur,
        countsNT: uniqueWordsNT[cur.greek].countsBook,
      });
    }
    return acc;
  }, []);
  console.log('John', johnWords.length, johnWords[0]);

  // all unique greek words and their counts in John
  const uniqueJohnWords = uniqueWordsCounts(johnWords);
  console.log('Unique John Words', Object.keys(uniqueJohnWords).length, uniqueJohnWords);

  // all rare unique greek words and their counts in John
  const rareUniqueJohnWords = rareUniqueWordsCounts(uniqueJohnWords);
  console.log('Rare Unique John Words', Object.keys(rareUniqueJohnWords).length);

  // group all unique words into verses
  const groupedRareUniqueJohnWords = Object.values(rareUniqueJohnWords).reduce((book, word) => {
    const bookEdit = book;
    if (bookEdit[word.chapter]) {
      // group by verse
      if (bookEdit[word.chapter][word.verse]) {
        bookEdit[word.chapter][word.verse] = [
          ...bookEdit[word.chapter][word.verse],
          word,
        ];
      } else {
        bookEdit[word.chapter][word.verse] = [word];
      }
    } else {
      bookEdit[word.chapter] = {
        [word.verse]: [word],
      };
    }

    return bookEdit;
  }, {});
  console.log('Grouped Rare Unique John Words', Object.keys(groupedRareUniqueJohnWords).length, groupedRareUniqueJohnWords);

  return groupedRareUniqueJohnWords;
}
