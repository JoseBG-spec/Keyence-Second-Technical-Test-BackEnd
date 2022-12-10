const express = require('express')
const fileRoute = express.Router()
const multer  = require('multer')
const path = require('path')
const XLSX = require('xlsx')
let csv = require("csvtojson");


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, "file"+ path.extname(file.originalname)) //Appending .jpg
    }
  })
const upload = multer({ storage : storage })

let UserModel = require('../models/User')

fileRoute.post('/upload-file', upload.single('file'), function (req, res, next) {
    //console.log(req.file)
    if(req.file){
    let workbook = XLSX.readFile(req.file.path);
    XLSX.writeFile(workbook, './uploads/convertions/file.csv', { bookType: "csv" });
    //let sheet_name_list = workbook.SheetNames;
    //let csvFile = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name_list[0]])
    //console.log(csvFile)
    
    //From CSV to JSON
    
    csv()
    .fromFile("./uploads/convertions/file.csv")
    .then(function(jsonArrayObj){ //when parse finished, result will be emitted here. 
        //console.log(jsonArrayObj.slice(0,-1).length)
        let jsonfile = jsonArrayObj.slice(0,-1)
        
        jsonfile.forEach(element => {
          let day = element.Date.split('/')[0].length > 1 ? element.Date.split('/')[0] : '0' + element.Date.split('/')[0]
          let month = element.Date.split('/')[1].length > 1 ? element.Date.split('/')[1] : '0' + element.Date.split('/')[1]
          element.Date = "20" + element.Date.split('/')[2] + "-" + month + "-" + day

          let punch = element['Punch In'].split(':')[0].length > 1 ? element['Punch In'].split(':')[0] : '0' + element['Punch In'].split(':')[0]
          element['Punch In'] =  punch + ":" +element['Punch In'].split(':')[1]

          punch = element['Punch Out'].split(':')[0].length > 1 ? element['Punch Out'].split(':')[0] : '0' + element['Punch Out'].split(':')[0]
          element['Punch Out'] =  punch + ":" +element['Punch Out'].split(':')[1]
          
        });
        //console.log(jsonfile)
        UserModel.insertMany(jsonfile,(err,data)=>{  
            if(err){  
                console.log(err);  
            }else{  
                res.json(data)  
            }  
        });
    })
    }   
  })

module.exports = fileRoute