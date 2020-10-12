const express = require('express')

var csv = require('csv');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://192.168.0.15:40017";


const app = express()
const port = 3000

//app.use(cors())






app.get('/vikesh-test', async (req, res) => {
  res.send("succ")  
})







app.get('/import-colors', (req, res) => {
    
    const bfj = require('bfj');
    const fs = require('fs');
  
    // let path = "uploads/vikesh_sample.json";
    let path = "static_files/color.json";
    let options = {};
  
  // By passing a readable stream to bfj.parse():
    bfj.parse(fs.createReadStream(path), options)
      .then(data => {
        
        MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("vikesh");
            
            dbo.collection("colors").insertMany(data, function(err, resUlt) {
                
                if(err){
                    res.send('some error occured')
                }else{
                    res.send('Colors have been imported')
                }
                db.close();
              });
        });

      })
      .catch(error => {
        //console.log(error)
        res.send('file not found');
      });

  })





  app.get('/import-shapes', (req, res) => {
    
    const bfj = require('bfj');
    const fs = require('fs');
  
    // let path = "uploads/vikesh_sample.json";
    let path = "static_files/shape.json";
    let options = {};
  
  // By passing a readable stream to bfj.parse():
    bfj.parse(fs.createReadStream(path), options)
      .then(data => {
        
        MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("vikesh");
            
            dbo.collection("shapes").insertMany(data, function(err, resUlt) {
                
                if(err){
                    res.send('some error occured')
                }else{
                    res.send('Shapes have been imported')
                }
                db.close();
              });
          });

      })
      .catch(error => {
        //console.log(error)
        res.send('file not found');
      });

  })






  app.get('/import-csv', async (req, res) => {


    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];
    


    

    MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("vikesh");
    
        



        fs.createReadStream('static_files/Diamon_stock_sheet.csv')
        .pipe(csv())
        .on('data', async (data) => {
            results.push(data);
            


            try {


                var colorName = await getLookup(data.Color,'colors',db);
                var shapeName = await getLookup(data.Shape,'shapes',db)



                data.Color = colorName;
                data.Shape = shapeName;


                await dbo.collection("diamonds").insertOne(data, async function(err, resUlt) {
                
                    
                    
                });


            } catch (err) {
                console.log(err)
            }
            



        })
        .on('end', () => {
            //console.log("results.length ",results.length);
            res.send('done')
            
        });






        
    });


    



  })



function getLookup(name,collectionName,db) {

    return new Promise(function(resolve, reject) {
     
        var dbo = db.db("vikesh");
            
            dbo.collection(collectionName).findOne({name:name}, async function(err, result) {

                if (err){
                    console.log('error')
                    reject(name)
                }else{
                    resolve(result._id)
                }
    
          
                //db.close();
              });
        
    })
}










//https://stackoverflow.com/questions/34530348/correct-way-to-insert-many-records-into-mongodb-with-node-js


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})