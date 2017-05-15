const express = require('express');
const app = express();
const User = require('../db/models/User');
const Garden = require('../db/models/Garden')
const Plant = require('../db/models/Plant')
const Forum = require('../db/models/Forum')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const request = require('request');
const cron = require('node-cron');

var date = new Date();

cron.schedule('10 * * * *', function(){
  let api_key = 'key-b90d2dcc5bdd42c5abceba45568ea1dd';
  let domain = 'sandboxa7ed15c3bb5b4de696ad9041ddcadb4a.mailgun.org';
  let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  const OPEN_WEATHER_MAP_URL = 'http://api.openweathermap.org/data/2.5/weather?&appid=b625bae7d54136d7e2d33c6a3f383f9e&units=metric';
  let encodedLocation = encodeURIComponent('Lafayette, CA');
  let requestUrl = `${OPEN_WEATHER_MAP_URL}&q=${encodedLocation}`;
  let hotWeatherAlert = {
    from: 'Plantr <postmaster@sandboxa7ed15c3bb5b4de696ad9041ddcadb4a.mailgun.org>',
    to: 'skebaish1992@gmail.com',
    subject: 'Warning: Your garden may be experiencing exceess heat today',
    text: 'Heat Warning',
    html: '<html><img src=' +"https://c1.staticflickr.com/3/2841/34191201701_1d8b5dcec9_b.jpg" + '></html>'
  };
  let coldWeatherAlert = {
    from: 'Plantr <postmaster@sandboxa7ed15c3bb5b4de696ad9041ddcadb4a.mailgun.org>',
    to: 'skebaish1992@gmail.com',
    subject: 'Warning: Your garden may be experiencing excees cold today',
    text: 'Cold Warning',
    html: '<html><img src=' +"https://c1.staticflickr.com/5/4179/34164138582_a460eccfd7_b.jpg" + '></html>'
  };
  let temperature;
  request.get(requestUrl, function(err, andrewChung) {
    if (err) {
      console.error('There was an error getting the hardiness zone on the server: ', err);
      andrewChung.status(404);
    } else {
      // description = andrewChung .andrewChung .weather[0].description;
      let weatherData = (JSON.parse(andrewChung.body))
      let weather = weatherData.weather[0].description;
      mailgun.messages().send(hotWeatherAlert, function (error, body) {
        if (error) {
          console.error("You had an error sending your emails out: ", error);
          andrewChung.send(404);
        } else {
          console.log("The body is ", body);
          andrewChung.status(200).send(body);
        }
      })
    }
  });
})

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use('/', express.static('public'));
mongoose.connect('mongodb://test:test@ds015750.mlab.com:15750/plantrdb', function(err) {
  if (err) {
    console.error('There has been an error connection to the server: ', err);
  } else {
    console.log('connection with database successful');
  }
});

const db = mongoose.connection;

/*--------------------GET REQUEST---------------------------------------------*/
app.get('/api/users', function(req, res, next) {
  User.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the user info: ', err);
      res.status(404);
    } else {
      console.log('Successful get request for user info');
      res.status(200).send(data);
    }
  })
});

app.get('/api/users/:email', function(req, res, next) {
  let userInfo;
  User.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting a specific user info: ', err);
      res.status(404);
    } else {
      data.forEach((user) => {
        if (user.email === req.params.email) {
          userInfo = user;
        }
      })
      console.log('Successful get request for specific user info');
      res.status(200).send(userInfo);
    }
  })
});

app.get('/api/users/hardiness', function(req, res, next) {
  request.get('https://phzmapi.org/' + req.query.zipCode + '.json', function(err, data) {
    if (err) {
      console.error('There was an error getting the hardiness zone on the server: ', err);
      res.status(404);
    } else {
      console.log('Successful get request for hardiness zone API');
      res.status(200).send(data.body);
    }
  })
})

app.get('/api/gardens', function(req, res, next) {
  Garden.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the garden info: ' , err);
      res.status(404);
    } else {
      console.log('Successful get request for garden info');
      res.status(200).send(data);
    }
  })
});

app.get('/api/gardens/:email', function(req, res, next) {
  let userGardens = [];
  Garden.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the garden info: ' , err);
      res.status(404);
    } else {
      data.forEach((garden) => {
        if (req.params.email === garden.profileEmail) {
          userGardens.push(garden);
        }
      });
      console.log('Successful get request for user garden info');
      res.status(200).send(userGardens);
    }
  })
});

app.get('/api/plants', function(req, res, next) {
  Plant.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the plant info: ', err);
      res.status(404);
    } else {
      console.log('Successful get request for plant info');
      res.status(200).send(data);
    }
  })
});

app.get('/api/forum', function(req, res, next) {
  let email = req.query
  Forum.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the forum info: ', err);
      res.status(404);
    } else {
      console.log('Successful get request for forum info');
      res.status(200).send(data);
    }
  })
});

app.get('/api/forum/:email', function(req, res, next) {
  Forum.find({}, (err, data) => {
    if (err) {
      console.error('There was an error getting the specific forum info: ', err);
      res.status(404);
    } else {
      console.log('Successful get request for specific forum info');
      res.status(200).send(data);
    }
  })
});

/*--------------------POST REQUEST---------------------------------------------*/

app.post('/api/users', (req, res, next) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    profilePhoto: req.body.profilePhoto,
    about: req.body.about
    // gardens: req.body.gardens, <-- possible addition
    // coverPhoto: req.body.coverPhoto, <-- possible addition
  });
  user.save({}, (err, data)=> {
    if (err) {
      console.error('There was an error saving the user info onto the server: ', err);
      res.status(500);
    } else {
      console.log('Successfully posting user info on the server');
      res.status(200).send(data);
    }
  });
});

app.post('/api/gardens', (req, res, next) => {
  var garden = new Garden({
    gardenId: req.body.gardenId,
    plantId: req.body.plantId,
    gardenGrid: req.body.gardenGrid,
    plantGrid: req.body.plantGrid,
    userEmail: req.body.userEmail,
    gardenName: req.body.gardenName,
    gardenImage: req.body.gardenImage,
    profilePicture: req.body.profilePicture,
    profileEmail: req.body.profileEmail,
    profileNickname: req.body.profileNickname,
    hardinessZone: req.body.hardinessZone
  });
  garden.save({}, (err, data) => {
    if (err) {
      console.error('There was an error saving the garden info onto the server: ', err);
      res.status(500);
    } else {
      console.log('Successfully posting garden info on the server');
      res.status(200).send(data);
    }
  });

  let api_key = 'key-b90d2dcc5bdd42c5abceba45568ea1dd';
  let domain = 'sandboxa7ed15c3bb5b4de696ad9041ddcadb4a.mailgun.org';
  let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  // console.log("Here is your gardenName", garden.gardenName)
  let data = {
    from: 'Plantr <postmaster@sandboxa7ed15c3bb5b4de696ad9041ddcadb4a.mailgun.org>',
    to: 'skebaish1992@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!',
    html: '<html>Inline image here: <img src="https://www.sciencea-z.com/shared/images/units/plant-life.jpg"></html>'
  };
  // mailgun.messages().send(data, function (error, body) {
  //   console.log(error);
  //   if (error) {
  //     console.log("You had an error", error);
  //   } else {
  //     console.log("The body is ", body);
  //   }
  // });
});

app.post('/api/plants', (req, res, next) => {
  let plant = new Plant({
    plantId: req.body.plantId,
    image: req.body.image
  });
  plant.save({}, (err, data) => {
    if (err) {
      console.error('There was an error saving the plant info onto the server: ', err);
      res.status(500);
    } else {
      console.log('Successfully posting plant info on the server');
      res.status(200).send(data);
    }
  });
});

app.post('/api/forum', (req, res, next) => {
  let forum = new Forum({
    profile: req.body.profile,
    title: req.body.title,
    message: req.body.message,
    nickname: req.body.nickname,
    email: req.body.email,
    replies: req.body.replies,
    time: req.body.time
  });
  forum.save({}, (err, data) => {
    if (err) {
      console.error('There was an error saving the forum info onto the server: ', err);
      res.status(500);
    } else {
      console.log('Successfully posting plant info on the server');
      res.status(200).send(data);
    }
  });
});

/*--------------------PUT REQUEST-----------------------------------------*/
// updating the user About Me
app.put('/api/users/:id', (req, res, next) => {
  User.findById(req.body.id, (err, result) => {
    if (err) {
      console.error('There has been a serverside error updating the aboutMe: ', err);
      res.status(500);
    } else {
      result.about = req.body.about;
      result.save((err) => {
        if (err) {
          console.error('There has been a serverside error saving the updated aboutMe: ', err);
          res.status(500);
        } else {
          console.log('Successfully updated an AboutMe on the server');
          res.status(200).send(result);
        }
      });
    }
  });
});

// posting replies on the server
app.put('/api/forum', (req, res, next) => {
  Forum.findById(req.body.id, (err, result) => {
    if (err) {
      console.error('There has been a serverside error posting the replies: ', err);
      res.status(500);
    } else {
      result.replies.push(req.body.replies);
      result.save((err) => {
        if (err) {
          console.error('There has been a serverside error saving the posted replies: ', err);
          res.status(500);
        } else {
          console.log('Successfully posting a reply on the server');
          res.status(200).send(result);
        }
      });
    }
  });
});

// updating posts on the server
app.put('/api/forum/:id', (req, res, next) => {
  Forum.findById(req.body.id, (err, result) => {
    if (err) {
      console.error('There has been a serverside error updating the posts: ', err);
      res.status(500);
    } else {
      result.message = req.body.message;
      result.title = req.body.title;
      result.save((err) => {
        if (err) {
          console.error('There has been a serverside error saving the updated posts: ', err);
          res.status(500);
        } else {
          console.log('Successfully updated a post on the server');
          res.status(200).send(result);
        }
      });
    }
  });
});

// updating replies on the server
app.put('/api/forum/:id/:replyId', (req, res, next) => {
  let modifiedId;
  Forum.findById(req.params.id, (err, result) => {
    if (err) {
      console.error('There has been a serverside error updating the replies: ', err);
      res.status(500);
    } else {
      result.replies.forEach((key, i) => {
        if (key.message === req.body.params.oldMessage) {
          modifiedId = i;
        }
      });
      let newMessage = result.replies[modifiedId];
      newMessage['message'] = req.body.params.message;
      result.replies.splice(modifiedId, 1, newMessage)
      result.save(function(err) {
        if (err) {
          console.error('There was an error saving your reply on the server: ', err);
          res.status(500);
        } else {
          console.log('Successfully saved a reply on the server');
          res.status(200).send(result);
        }
      });
    }
  });
});

/*--------------------DELETE REQUEST-----------------------------------------*/
// deleting posts made by users
app.delete('/api/forum/:id', (req, res, next) => {
  Forum.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
      console.error('There was an error deleting your post: ', err);
      res.status(500);
    } else {
      console.log('Successfully deleted a post on the server');
      res.status(200).send(result);
    }
  });
});

// deleting replies made by users
app.delete('/api/forum/:id/:replyId', (req, res, next) => {
  let deleteId;
  Forum.findById(req.params.id, (err, result) => {
    if (err) {
      console.error('There has been a serverside error deleting the replies: ', err);
      res.status(500);
    } else {
      result.replies.forEach( (key, i) => {
        if (key['replyUser']['clientID'] === req.params.replyId) {
          deleteId = i;
        }
      });
      result.replies.splice(deleteId, 1);
      result.save((err) => {
        if (err) {
          console.error('There was an error deleting your reply from the server: ', err);
          res.status(500);
        } else {
          console.log('Successfully deleted a reply from the server');
          res.status(200).send(result);
        }
      });
    }
  });
});


app.use((err, req, res, next) => {
  console.log('Something failed');
  res.status(500).send({"Error" : err.message})
});

app.listen(process.env.PORT || 3000);
