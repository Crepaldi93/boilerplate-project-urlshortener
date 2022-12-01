require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Use body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Create one array for full urls and one array for their corresponding shortened versions
var fullUrls = [];
var shortUrls = [];

// Create function to test validity of URL
function isValidUrl(string) {
  let newUrl;
  try {
    newUrl = new URL(string);
  } catch (_) {
    return false;
  }
  return newUrl.protocol === "http:" || newUrl.protocol === "https:"
}

// Add post request to create shortened urls
app.post('/api/shorturl', (req, res) => {
  // Create variable url and store input into it
  let url = req.body.url;

  // Check if url is a valid URL
  if (isValidUrl(url)) {
    // Push new url into fullUrls array and its shortened version into shortUrls array
    fullUrls.push(url);
    shortUrls.push(fullUrls.length);

    // Respond with json object
    res.json({
      original_url: url,
      short_url: fullUrls.length
    });
  } else {
    res.json({error: "invalid url"});
  }
});

// Create post request to redirect shortened urls to full urls
app.get("/api/shorturl/:short_url", (req, res) => {
  let short_url = +req.params.short_url
  // Check if short url is in shortUrls array
  if (shortUrls.includes(short_url)) {
    res.redirect(fullUrls[short_url - 1]);
  } else {
    res.json({error: "No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
