
const express = require("express");
const router = express.Router();
const Post = require('../models/post')

/*
GET ROUTE
ALL BLOG POST OR HOME PAGE
*/
router.get("/", async (req, res) => {
    
    try {        
        let perPage = 20;
        let page = req.query.page || 1;

        const posts = await Post.aggregate([{$sort: {createdAt: -1}}]).skip(perPage * page - perPage).limit(perPage).exec();

        const locals = {
            title: posts.title,
            description: posts.description
        }
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1
        const hasNextpage = nextPage <= Math.ceil(count/perPage);

        // const posts = await Post.find();
        res.render("home", {
            locals,
            posts,
            current: page,
            nextPage: hasNextpage ? nextPage : null,
        });
    } catch (error) {
        console.log(error);   
    }
});

// router.get('post/:id', async(req, res)=>{
//     try {
//         const slug = req.params.id;
//         const posts = await Post.findById
//         res.render('post', {posts})
//     } catch (error) {
        
//     }
// })

/*
GET ROUTE || FIND USER BY ID;
post :id
*/

router.get('post/:id', async(req, res)=>{
    try {    
        const slugId = req.params.id;
        const posts = await Post.findById({_id: slugId});

        const locals = {
            title: posts.title,
            description: posts.description
        }
        res.render('post', {locals, posts })
        // currentRoute: `/post/${slugId}`
    } catch (error) {
        console.log("Cannot get post ID",error)
        
    }
})

/*
GET ROUTE || SEARCH BY ID;
search :id
*/
router.get('/about', async(req, res)=>{
    res.render('about', )
    // {currentRoute: '/'}
})

router.post('search/:id', async(req, res)=>{
    try {
        // const slug = req.params.id;
        // const posts = await Post.findById()

        let searchTerm = req.body.searchTerm;
        const noSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    
        const posts = await Post.find({
          $or: [
            { title: { $regex: new RegExp (noSpecialChar, "i") }},
            { author: { $regex: new RegExp (noSpecialChar, "i") }},
            { tags: { $regex: new RegExp (noSpecialChar, "i") }}
          ]
        });
        res.render('search', posts)
    } catch (error) {
      console.log("There was an error on the Search Page", error);  
    }
})


module.exports = router;