const express = require('express');
const { getTrends } = require('./app');

const init = (customPort) => {
  const app = express();
  const port = customPort ? customPort : 8888;

  app.get('/', (req, res) => res.send('Welcome to TRENDING! Please make a GET request to /trending to see the top trending topics of the moment.'))

  app.get('/trending', async (req, res) => {
    try {
      const trendResponse = await getTrends();

      res.send(trendResponse)
    } catch (e) {
      console.error('Error')
      res.status(500).send(e.message)
    }
    
  })

  return app.listen(port, () => console.log(`TRENDING is listening on port ${port}!`))
};

module.exports = {
  init
}