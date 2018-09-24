const Parser = require('rss-parser')
const parser = new Parser();

const parseRSSFeed = async url => {
  const rss = await parser.parseURL(url);
  return rss.items;
};

const getRSSItems = async urls => {
  let rssRequests = [];

  urls.forEach(url => {
    rssRequests.push(parseRSSFeed(url))
  })

  try {
    const rawResults = await Promise.all(rssRequests);

    return [].concat.apply([], rawResults)
  } catch (e) {
    throw new Error('Error retrieving RSS from one or more feeds. Please try again later.');
  }

  
}

module.exports = {
  getRSSItems
};