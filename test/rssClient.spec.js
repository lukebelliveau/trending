var Parser = require('rss-parser');
jest.mock('rss-parser');

const rssFeed1 = {
  items: [
    {
      title: 'headline 1'
    },
    {
      title: 'headline 2'
    }
  ]
}

const rssFeed2 = {
  items: [
    {
      title: 'headline 3'
    },
    {
      title: 'headline 4'
    }
  ]
}

describe('getRSSItems', () => {
  const parseURL = jest.fn();

  beforeAll(() => {
    Parser.mockImplementation(() => {
      return {
        parseURL: parseURL
      }
    })
  })

  beforeEach(() => {
    Parser.mockClear();
    parseURL.mockClear();
  })

  it('combines news items from all RSS sources into one list', done => {
    parseURL.mockImplementationOnce(() => Promise.resolve(rssFeed1))
    parseURL.mockImplementationOnce(() => Promise.resolve(rssFeed2))
    const { getRSSItems } = require('../src/rssClient');
    getRSSItems([ 'request 1', 'request 2' ])
    .then(items => {
      expect(items).toEqual([
        ...rssFeed1.items,
        ...rssFeed2.items
      ])
      done();
    })
  })
})