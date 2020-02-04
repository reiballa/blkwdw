var express = require('express');
var router = express.Router();
var cors = require('cors');

var socketMap;

const db = require('../metadata/config/mongoConfig')
const spiderRepo = require('../metadata/models/spider')
const Crawler = require('../businessLogic/mainCrawler');
let crawlerInstance = new Crawler();

var app = express();
app.use(cors({origin: 'http://localhost:4200', credentials: true}));
var http = require('http').createServer(app)
const io = require('socket.io')(http);

var socketMap = [];

http.listen(3001,()=>{
  console.log("listening to port 3001");
});

io.on('connection',(socket)=>{
  console.log("Client Connected");
  socketMap.push(socket);
})

/* GET all spiders. */
router.get('/spider', function (req, res) {
    spiderRepo.find({}, (err, results)=>{
      if(err) throw err;
      res.json(results)
    })
})

/* POST a spider. */
router.post('/spider', (req, res) => {
    let newSpider = spiderRepo(req.body);
    newSpider.save((err)=>{
        if(err) throw err;
        res.send("Spider created!")
    });
});

/* POST edit a spider. */
router.post('/spider/edit', (req, res) => {
  spiderRepo.findOneAndUpdate({name: req.body.name}, req.body, () => res.send('updated'))
});

/* POST start a new crawl. */
router.post('/test-crawl', (req, res) => {
  let messages = crawlerInstance.messages.subscribe(res => {
        for (let socketMapObj of socketMap) {
            socketMapObj.emit('crawlUpdate', res);
        }
        if(res == 'finished crawling') messages.unsubscribe();
    })

    crawlerInstance.startCrawl(req.body);
    res.send('Spider '+ req.body.name + ' started crawling')

  });

/* POST stop a running crawl. */
router.get('/stop-crawl', (req, res) => {
  crawlerInstance.stopCrawl()
  res.send('Spider stopped crawling')
});

/* DELETE a spider. */
router.delete('/spider', (req, res) => {
    spiderRepo.deleteOne({name: req.query.name}, (err) => {
        if(err) throw err;
        res.send("Spider deleted!")
    })
});

/* POST add pipelines to a spider. */
router.post('/spider/pipelines', (req, res) => {
  spiderRepo.findOneAndUpdate({name: req.body.spiderName}, {pipelines : req.body.pipelines}, () => res.send('updated'))
});
module.exports = router;
