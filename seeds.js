const mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment')
var data = [{
    name: 'Cosy Camp Paradise',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2-W19BJGGJb7a8MYwhkOpS3v8uBSizZWzErvlG5-aYrE5a0Wc',
    description: 'The perfect calm and cosy place to rest your feet after a long day'
},
{
    name: 'Clifftop Views',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsB_is_RsIGw2_PjHIJw3zgchVCj2_9XVLv3ArA7V7mOF8yu9D8g',
    description: 'A favourite haunt of daring Trad climbers looking to rest up next up the ocean of granite avaialable at this site'
},
{
    name: 'Trad Climbers Rest',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyg9k3NuxRHWfrOIuTAf3jYMJkWwYWG95XlTBQx6eTkdF4T6uc',
    description: 'Wonderfull woodland site'
}];

function seedDB(){
Campground.remove({}, function (err) {
        console.log(err);
    })
    console.log('removed');
// add new 
    data.forEach(function(seed){
        Campground.create(seed, function (err,campground) {
            if(err){
                console.log(err);
                
            }else{
                console.log('added camp');
                //comment
                Comment.create(
                    {
                        text:'hey this is a test comment',
                        author: 'Greg'
                    }, function (err,comment) {
                        if (err){
                            console.log(err);
                            
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log('Created new comment');
                            
                        }
                       
                      }
                )
                
            }
          })
    })

};


module.exports = seedDB;

