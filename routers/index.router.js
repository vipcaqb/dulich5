const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var passport = require('passport');
var session = require('express-session')

const User = mongoose.model('User');
const Topic = mongoose.model('Topic');

//render login page
router.get('/login',(req,res) =>{
    res.render('login');
});
router.post('/register',(req,res,next) =>{
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.save((err,doc)=>{
        if(!err) {
            console.log('saving succeeded');
            res.send(doc);
        }
        else {
            if(err.code = 11000)
                res.status(422).send('Duplicate username');
            else return next(err);
        }
    });
});
//home page
router.get('/', async (req,res) =>{
    var newTopic = await Topic.find().limit(12);
    console.log(newTopic[0]._id)
    res.render('index',{
        "newTopic" : newTopic
    })
})

//read one news
router.get('/:itemId',async (req,res) =>{
    var item =await Topic.findById(req.params.itemId);
    res.render("read-one",{data: item});
})


//get all topics
router.get('/dashboard/topic/getall/:page',async (req,res) =>{
    try {
        var AllOfTopics = await Topic.find().limit(5).skip((req.params.page-1)*5);
        res.render('admin-dashboard/index',{"AllOfTopics":AllOfTopics, pagenumber:req.params.page});
    } catch (error) {
        res.json({message: error});
    }
});


//create a new topic
router.get('/dashboard/topic/create',(req,res) =>{
    res.render('admin-dashboard/add');
})

router.post('/dashboard/topic/create',(req,res) => {
        var topic = new Topic();
        topic.title = req.body.title;
        topic.sortContent = req.body.sortContent;
        topic.fullContent = req.body.fullContent;
        topic.location = req.body.location;
        topic.author = "admin";
        topic.category = req.body.category;
        topic.smallImageUrl = req.body.smallImageUrl;
        topic.largeImageUrl = req.body.largeImageUrl;
        topic.isHot = req.body.isHot;
        var d = new Date();
        topic.time = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        console.log(req.params.title)
        //save data

        topic.save((err,doc)=>{
            if(!err){
                console.log("Luu du lieu topic thanh cong!");
                res.redirect('/dashboard/topic/getall/1')
            }
            else{
                console.log(err);
            }
        }); 


});
// delete a topic
router.delete('/dashboard/topic/delete/:topicId',async (req,res) =>{
    try {
        const id = await Topic.findByIdAndDelete(req.params.topicId);
        console.log("Xoa topic thanh cong");
        res.redirect('/dashboard/topic/getall')
    } catch (error) {
        res.json({
            message: error
        });
    }
});

//show detail a topic
router.get('/dashboard/topic/:topicId', async (req,res) =>{
    try {
        const topic = await Topic.findById(req.params.topicId);
        console.log("Lay du lieu thanh cong");
        res.render('single-post');
    } catch (error) {
        res.json({
            message: error
        });
    }
});

//edit a topic
router.put('/topic/edit/:topicId', async (req,res) =>{
    try {
        var updated = await Topic.findOneAndUpdate({_id:req.params.topicId},{
            $set: {
                title: req.body.title,
                sortContent: req.body.sortContent,
                fullContent: req.body.fullContent,
                location: req.body.location,
                category: req.body.category
            }
        },
        { useFindAndModify: false });
        console.log("Cap nhat thanh cong");
        res.redirect('/dashboard/topic')
    } catch (error) {
        res.json({message:error});
    }
});

router.get('/about',(req,res) =>{
    res.render('about')
})

router.get('/archive',(req,res) =>{
    res.render('archive')
})

router.get('/contact',(req,res) =>{
    res.render('contact')
})


module.exports = router;