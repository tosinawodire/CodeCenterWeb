const express = require('express'),
mongoose = require('mongoose'),
ejs = require('ejs'),
app = express();


app.use(express.urlencoded({extended:true})) // encode the content of our form
app.use(express.static('public')); //recognize the public folder
app.set('view engine', 'ejs'); //engine responsible for rendering EJS

mongoose.connect('mongodb://localhost:27017/tccDB', {useNewUrlParser:true, useUnifiedTopology:true}); //conncetion to the mongodb database
    
//var dt = new Date();
//console.log(dt);

// var date = dt.getFullYear() + '-' +(dt.getMonth()+1)+ '-'+dt.getDate();
// //var time = dt.getHours()+ ':' + dt.getMinutes() + ':' +dt.getSeconds();
// var hour = dt.getHours();
// var min = dt.getMinutes();
// var sec = dt.getSeconds();

//var timer = date + " " +time;
//console.log(timer);


function showTime() { 
	let time = new Date(); 
	let hour = time.getHours(); 
	let min = time.getMinutes(); 
	let sec = time.getSeconds(); 
	am_pm = "AM"; 

	if (hour > 12) { 
		hour -= 12; 
		am_pm = "PM"; 
	} 
	if (hour == 0) { 
		hr = 12; 
		am_pm = "AM"; 
	} 

	hour = hour < 10 ? "0" + hour : hour; 
	min = min < 10 ? "0" + min : min; 
	sec = sec < 10 ? "0" + sec : sec; 

	timer = hour + ":"
			+ min + ":" + sec + am_pm; 

	
} 
showTime(); 
setInterval(showTime, 1000); 


const studentSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },

    gender:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    dateRegistered:{
        type:Date,
        default:Date.now

    }


});
const Student = new mongoose.model('Student', studentSchema)

app.get('/', (req,res)=>{
    res.render('home', {timeOfDay:timer});
})

app.get('/about', (req,res)=>{
    res.render('about', {timeOfDay:timer});
})

app.get('/course', (req,res)=>{
    res.render('course', {timeOfDay:timer});
})

app.get('/contact', (req,res)=>{
    res.render('contact', {timeOfDay:timer});
})

app.get('/register', (req,res)=>{
    res.render('register', {timeOfDay:timer});
})

app.post('/register', (req,res)=>{
   const{firstName, lastName, gender, course} = req.body;

   const newStudent = new Student({
    firstName, lastName, gender, course
   })

   newStudent.save(function(err){
       if(err){
           console.log(err)
       }else
       {
           res.redirect('register')
       }

   })

})

app.get('/applicant', (req, res)=>{
    	Student.find(function(err, result){
            if (err){
                console.log(err)

            }else{
                //console.log(result);
                res.render('applicant', {record:result, timeOfDay:timer})
            }
        })
}
)


app.get('/edit/:id', function(req, res){
    //console.log(req.params.id);
   // res.send('edit page');
   Student.find({_id:req.params.id}, function(err, result){
       if(err){
           console.log(err)
       }else{
           let id = req.params.id;
           result.forEach(function (r){
               fname = r.firstName;
               lname = r.lastName;
               gend = r.gender;
               prog = r.course;

               res.render('edit',   
                    {timeOfDay:timer, 
                     id:id,
                     fname:fname,
                     lname:lname,
                     gend:gend,
                     prog:prog
                     })
          
           })
           
       }
   })
})

app.post('/edit/:id', (req,res)=>{
    const{firstName, lastName, gender, course} = req.body;
 
   
   Student.updateOne({_id:req.params.id}, 
    {firstName:firstName,
    lastName:lastName,
    gender:gender,
    course:course },function(err){
        if(err){
            console.log(err);
        }else{
            //res.send('Successfully Updated');
           // const message= 'Successfully updated';
            res.redirect('/applicant')
        }
    })
}) 
 

app.get('/delete/:id', function(req, res){
    
    Student.deleteOne({_id:req.params.id}, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect('/applicant');
        }
    })

})

app.listen(2100, function(){
    console.log("server has started at port 2100")
})