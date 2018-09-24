const { getRSSItems } = require('./rssClient');
const { findTrends } = require('./trendFinder');

const getTrends = async () => {
    const items = await getRSSItems([ 
      'http://rss.cnn.com/rss/cnn_topstories.rss', 
      'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      'http://feeds.foxnews.com/foxnews/latest',
    ])

    const trends = findTrends(items);

    return {
      topics: addLinks(trends.slice(0, 5), items)
    }
}

const addLinks = (trends, items) => {
  let results = [];
  trends.forEach(trend => {
    let links = [];
    items.forEach(item => {
      if(item.title.toLowerCase().includes(trend) || item.contentSnippet.toLowerCase().includes(trend)) {
        links.push(item.guid)
      }
    })

    results.push({
      topic: trend,
      links: links,
    })
  })

  return results;
}

module.exports = {
  getTrends
};