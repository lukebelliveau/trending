const nlp = require('compromise');

const removeFaultyResults = (trends, termsToRemove) => {
  termsToRemove.forEach(term => {
    const index = trends.indexOf(term)
    if(index != -1) {
      trends.splice(index, 1)
    }
  })

  return trends;
}

const findTrends = items => {
  let headlineCorpus = "";

  items.forEach(item => {
    const value = item.contentSnippet === "" ? item.title : item.contentSnippet
    headlineCorpus += " " + value
  })

  const trends = nlp(headlineCorpus).normalize().topics().out('topk').map(topic => topic.normal )

  return removeFaultyResults(trends, ['cnn']);
}

module.exports = {
  findTrends
}