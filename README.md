# wordle-help
**Warning: Spoilers in `words.txt`**

If you suck at Wordle like I do, this API is for you.

https://wordle-helper.yodacode.repl.co
```
Wordle Helper API
GET /hint   | Get a good starting word for today that will make your friends think you're lucky  
GET /help   | Get words in order for people that really need help
GET /answer | Get the answer if you're really that bad

For all routes, you can pass yesterdays word with ?yesterday=<word>, otherwise responses will be given in the timezone of the server
```