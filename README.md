# Trending

A tool to detect trends from a set of RSS feeds and return these top trends to the user.

## Quick start

**Setup** 

`git clone https://github.com/lukebelliveau/trending.git && cd trending && yarn`

**Run** 

`yarn start` or `npm start`. You should see `TRENDING is listening on port 8080!`

Make a GET request to `localhost:8888/trending` to see results: `curl localhost:8888/trending`.

Results are returned as an array of topics. Each topic has a topic name, and a list of links where the user
can read about the topic:

```
{
  "topics": [
    {
      "topic": "topic 1",
      "links": [
        "https://www.nyt.com/topic-1-makes-awesome-podcast",
        "https://www.cnn.com/topic-1-makes-another-awesome-podcast",
      ]
    }
  ]
}
```

**Test** 

`yarn test` or `npm test`.

## Notes

### What's going on?

Because the assignment asks us to source from three specific sources, it felt appropriate to base the trending rankings in 
data found from those RSS feeds. To accomplish this, I used a tool called [Compromise](https://github.com/spencermountain/compromise), a library for rudimentary natural language processing.

After retrieving all results from the RSS feeds, I create a corpus of news information. For each article, its `contentSnippet` field is
added to the corpus - if no snippet is available, the title of the article is included instead.  Once this corpus is created, I run it
through Compromise's [topics API](https://beta.observablehq.com/@spencermountain/topics-named-entity-recognition) which, in theory,
identifies topics (people, places, and organizations) and the frequency at which they are mentioned.

Once the top trending topics are returned, I compile a list of news links for each topic and return to the user.

The results returned are sometimes accurate, and sometimes in need of improving. The two biggest issues I see with this solution are:
- Compromise has difficulty detecting duplicates. For example, it does not recognize that the strings "United States" and "USA" are
  correspond to the same topic.
- Lack of additional context. APIs provided by services like Twitter or Google Trends could augment this solution to provide more
  relevant results.

### What I'd do with more time

- Add more sources, and fall back on alternates when an RSS feed is unreachable. 
  My endpoint currently returns a 500 if there is trouble hitting any of the RSS endpoints - this could be more robust if more options are added.
- Combine Compromise analysis with Twitter data to get a better handle on what's trending right now.
  - I did consider going straight to the Twitter search API with the RSS results, and determining "trend value" based on how many people were tweeting about a given topic. Unfortunately, the Twitter API has a pretty strict rate limit, so the set of results needs some grooming first. With more time, I'd explore a solution that uses Compromise to narrow down the list of trending topics, then search their popularity on Twitter to order the results by popularity.
- Add some safeguards to `trendFinder.js` to avoid returning common duplicates, discussed in the section above.
  - One possible solution would check each string in the array of topics to see if it can be found as a substring of another topic. This would take O(n^2) -- with more time, I'd like to find a smarter way to do this.
  - I did add one "custom" safeguard, for the string "cnn". A lot of CNN's content snippets contained the string, resulting in CNN itself being a consistent trending topic.
    Unfortunately, the naive solution found in `trendFinder.js` would block CNN from trending, even if CNN was legitimately a trending topic. 