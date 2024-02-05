import connectDb from "../config/connectdb.js";

console.log('1');

//Random Number Function
const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Decimal to Base62 converter
const decimalToBase62 = (decimalNumber) => {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let base62Number = "";

  do {
    const remainder = decimalNumber % 62;
    base62Number = characters.charAt(remainder) + base62Number;
    decimalNumber = Math.floor(decimalNumber / 62);
  } while (decimalNumber > 0);

  // Pad with leading zeros to ensure 7-character length
  while (base62Number.length < 7) {
    base62Number = "0" + base62Number;
  }

  return base62Number.slice(0, 7); // Truncate to 7 characters if longer
};

const minRange = 0;
const maxRange = Math.pow(62, 7);

function generateShortUrl() {
  const randomNum = getRandomNumberInRange(minRange, maxRange);

  const base62Number = decimalToBase62(randomNum);
  return base62Number;
}

const convertUrl = async (req, res) => {
  console.log('2');
  const { longUrl } = req.body;

  // Short URL Generator code
  let shortUrl = generateShortUrl();

  const insertQuery =
    "INSERT INTO url_list (short_url, long_url) VALUES (?, ?)";

  const insertShortUrl = (retryCount = 0) => {
    connectDb.query(insertQuery, [shortUrl, longUrl], (err, result) => {
      if (err) {
        // Handle unique constraint violation (duplicate entry)
        if (err.code === "ER_DUP_ENTRY") {
          console.log("Short URL already exists, generating a new one...");
          if (retryCount < 3) {
            // Generate a new short URL and retry insertion
            shortUrl = generateShortUrl();
            insertShortUrl(retryCount + 1);
          } else {
            console.error("Error inserting data:", err);
            return res
              .status(500)
              .json({ error: "Database error  in generating re try URL" });
          }
        } else {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Database error" });
        }
      } else {
        res.json({ shortUrl, longUrl });
      }
    });
  };

  insertShortUrl(0); // Start the insertion process with default retryCount of 0
};

const getLongUrl = async (req, res) => {
  
  
  const { shortUrl } = req.params;
  console.log(shortUrl);
  
  const selectQuery = "SELECT long_url FROM url_list WHERE short_url = ?";

  connectDb.query(selectQuery, [shortUrl], (err, results) => {
    if (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    const longUrl = results[0].long_url;
    res.redirect(longUrl);
  });
};

export { convertUrl, getLongUrl };
