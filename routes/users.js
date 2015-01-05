var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/:id/show',function(req,res){
    console.log('Request for id'+req.params.id);
    res.json({id:'1',username:'Rahul',teamName:'bucaneers'})
});
module.exports = router;
