(function(){SchoolsCollection = new Meteor.Collection('schools');
JsonCollection = new Meteor.Collection('json');
AuthorsCollection = new Meteor.Collection('authors');
BooksCollection = new Meteor.Collection('books');

var input_box_val;

if (Meteor.isClient) {

		Meteor.startup(function(){
			
			Session.set('selected_school',null);
			Session.set('selected_school_author',null);
			Session.set('selected_school_name',null);

		$('.mainPage').show();
		$('.schools-Info').hide();
		$('.modal').hide();
		$('.remove').hide();
		$('.contact').hide();
	});
  
  Template.navbar.school_name = function(){  	 
    	return Session.get('selected_school_name');
  }

  Template.navbar.events({
  	'click 	#login-buttons-password': function(){
  		var name=$('#login-email').val();
  		var password=$('#login-password').val();
  		Accounts.createUser({name:name,password:password});
  	}

  });


  Template.mainpage.events({
	'keyup #school-search':function(){
			 var schools_name_js=[    
			  	'West Virginia Wesleyan College',
			  	'West Virginia University Institute of Technology',
			  	'West Virginia University at Parkersburg',
			   	'West Virginia University',
			   	'West Virginia State University',
			  	'Winona State University',
			   	'Wichita State University',
				'Arizona State University West',
				'Indiana State University',
				'Western Carolina University',
			    'Virginia Wesleyan College',
			   	'Virginia Union University',
				'Virginia Polytechnic Institute and State University',
				'Virginia State University',
				'Virginia Military Institute',
				'Villa Julie College',
				'Villanova University',
				'Virginia Intermont College',
				'Virginia Commonwealth University',
				'Valdosta State University',
				'Utica College of Syracuse University',
				'Urbana University',
				'University of La Verne',
				'Upper Iowa University',
				'UC Santa Cruz',
				'UC Santa Barbara',
				'University of California System',
				'Trevecca Nazarene University',
				'Transylvania University',
				'Toccoa Falls College',
				'Talladega College',
				'Tacoma campus',
				'Oklahoma State University System',
				'Southwestern Oklahoma State University',
				'Susquehanna University',
				'Sistema Universitario Ana G. Méndez',
				'Southwest Minnesota State University',
				'Southeastern Oklahoma State University',
				'Sonoma State University',
				'Soka University of America',
				'Santa Fe',
				'Sinte Gleska University',
			   	'Sierra Nevada College',
			   	'Siena Heights University',
			   	'Siena College',
			   	'Laura Alvin Siegal College of Judaic Studies',
			   	'South Florida Bible College  Theological Seminary',
			  	'Southeastern Louisiana University',
			   	'South Dakota State University',
			  	'Santa Clara University',
			 	'South Carolina State University',
			   	'Southern California Institute of Architecture',
			   	'University of South Carolina System',
			   	'Salve Regina University',
				];
			    $( "#school-search" ).autocomplete({
			      source: schools_name_js,
			      select: function( event, ui ) {
			      	input_box_val=ui.item.value;
			      }		     
			    });			    			    		
	},
	'click #btn_go':function(){
		$('.mainPage').hide();
		$('.schools-Info').show();
		console.log(input_box_val);
		Meteor.subscribe('get_all_school_name',input_box_val);

		var selected_school=SchoolsCollection.findOne({name:input_box_val});

		Session.set('selected_school',selected_school._id);
		Session.set('selected_school_name',selected_school.name);

		Meteor.subscribe('get_authors_name',selected_school._id);

		var authors_by_school=AuthorsCollection.find({school_id:selected_school._id});
		authors_by_school.forEach(function(data){
			console.log(data._id);
			Session.set('selected_school_author',data._id)
		});

		//console.log(authors_by_school.name);
	}

});

	// Template.schoolsInfo=function(){
	// 	$('.mainpage').hide();
	// }

	Template.schoolsInfo.events({
		'click #post-book':function(){
			console.log('click');
			if(Meteor.userId()== null )
				alert('You have to login to post a book');
			else
				$('.modal').show();
			
		},

		'click .save' : function(){
			var title=$('.title').val();
			var isbn=$('.isbn').val();
			var author=$('.author').val();
			var class_name=$('.class').val();
			var professor=$('.professor').val();
			var desc=$('.description').val();
			var selected_school_id=Session.get('selected_school');
			var selected_school_name=Session.get('selected_school_name');
			console.log(selected_school_name);
			var user_id=Meteor.userId();
			var d = new Date();

			var month = d.getMonth()+1;
			var day = d.getDate();

			var output = ((''+month).length<2 ? '0' : '') + month + '/' +
			    ((''+day).length<2 ? '0' : '') + day+ '/' +d.getFullYear() ;
			//console.log(output);
			var book=[title,isbn,author,class_name,professor,desc,selected_school_id,user_id,output,selected_school_name];
						
			Meteor.call('add_book',book,function (one,two){});
			$('.modal-body').find('input[type="text"]').val('');
			$('.description').val('');
			$('.modal').hide();

		},

		'click .close' : function(){
			$('.modal-body').find('input[type="text"]').val('');
			$('.description').val('');
			$('.modal').hide();
		}
	});

	Template.booksInfo.books = function(){
		var selected_school_id=Session.get('selected_school');
		console.log(selected_school_id);
		Meteor.subscribe('get_books',selected_school_id);
		var books=BooksCollection.find({school_id:selected_school_id}).fetch();
		console.log(books);
		// books.forEach(function(data){
		// 	console.log(books.name);
		// });
		

		return BooksCollection.find({school_id:selected_school_id}).fetch();
	}

	Template.deleteBook=function(){
		var user_id=Meteor.userId();

		var btn_delete=$('.remove').attr('name');

		if(user_id == btn_delete)
			$('.remove').show();
		return;
	}
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    SchoolsCollection.remove({});
    AuthorsCollection.remove({});
    //BooksCollection.remove({});

  
 
    var schools_name=[    
  	'West Virginia Wesleyan College',
  	'West Virginia University Institute of Technology',
  	'West Virginia University at Parkersburg',
   	'West Virginia University',
   	'West Virginia State University',
  	'Winona State University',
   	'Wichita State University',
	'Arizona State University West',
	'Indiana State University',
	'Western Carolina University',
    'Virginia Wesleyan College',
   	'Virginia Union University',
	'Virginia Polytechnic Institute and State University',
	'Virginia State University',
	'Virginia Military Institute',
	'Villa Julie College',
	'Villanova University',
	'Virginia Intermont College',
	'Virginia Commonwealth University',
	'Valdosta State University',
	'Utica College of Syracuse University',
	'Urbana University',
	'University of La Verne',
	'Upper Iowa University',
	'UC Santa Cruz',
	'UC Santa Barbara',
	'University of California System',
	'Trevecca Nazarene University',
	'Transylvania University',
	'Toccoa Falls College',
	'Talladega College',
	'Tacoma campus',
	'Oklahoma State University System',
	'Southwestern Oklahoma State University',
	'Susquehanna University',
	'Sistema Universitario Ana G. Méndez',
	'Southwest Minnesota State University',
	'Southeastern Oklahoma State University',
	'Sonoma State University',
	'Soka University of America',
	'Santa Fe',
	'Sinte Gleska University',
   	'Sierra Nevada College',
   	'Siena Heights University',
   	'Siena College',
   	'Laura Alvin Siegal College of Judaic Studies',
   	'South Florida Bible College  Theological Seminary',
  	'Southeastern Louisiana University',
   	'South Dakota State University',
  	'Santa Clara University',
 	'South Carolina State University',
   	'Southern California Institute of Architecture',
   	'University of South Carolina System',
   	'Salve Regina University',
	];

	//JsonCollection.insert(abc);

	for(var i=0;i<schools_name.length;i++){
		 SchoolsCollection.insert({name:schools_name[i]});
	}

	var schoolsArrId = new Array();
	var schoolsArrName = new Array();
	var schoolsTemp = SchoolsCollection.find();
	if(schoolsTemp){
					schoolsTemp.forEach(function(data){
						schoolsArrId.push(data._id);
						schoolsArrName.push(data.name);

					});
	}
	
	AuthorsCollection.insert({school_id:schoolsArrId[0],school_name:schoolsArrName[0],name:'krunal'})
	AuthorsCollection.insert({school_id:schoolsArrId[0],school_name:schoolsArrName[0],name:'abc'})
	AuthorsCollection.insert({school_id:schoolsArrId[1],school_name:schoolsArrName[1],name:'xyz'})
	AuthorsCollection.insert({school_id:schoolsArrId[1],school_name:schoolsArrName[1],name:'pqrs'})
	AuthorsCollection.insert({school_id:schoolsArrId[2],school_name:schoolsArrName[2],name:'lmno'})
	AuthorsCollection.insert({school_id:schoolsArrId[3],school_name:schoolsArrName[3],name:'nicolson'})

	var authorsArrId = new Array();
	var authorsArrName = new Array();
	var authorsSchoolId = new Array();
	var authorsSchoolName = new Array();
	var authorsTemp = AuthorsCollection.find();
	if(authorsTemp){
					authorsTemp.forEach(function(data){
						authorsArrId.push(data._id);
						authorsArrName.push(data.name);
						authorsSchoolId.push(data.school_id);
						authorsSchoolName.push(data.school_name);
					});
					console.log(authorsArrId)
					console.log(authorsArrName)
					console.log(authorsSchoolId)
					console.log(authorsSchoolName)
	}

	BooksCollection.insert({author_id:authorsArrId[0],author_name:authorsArrName[0],school_id:authorsSchoolId[0],school_name:authorsSchoolName[0],name:'title_1'})
	BooksCollection.insert({author_id:authorsArrId[1],author_name:authorsArrName[1],school_id:authorsSchoolId[0],school_name:authorsSchoolName[0],name:'title_2'})
	BooksCollection.insert({author_id:authorsArrId[2],author_name:authorsArrName[1],school_id:authorsSchoolId[2],school_name:authorsSchoolName[1],name:'title_3'})
	BooksCollection.insert({author_id:authorsArrId[3],author_name:authorsArrName[1],school_id:authorsSchoolId[2],school_name:authorsSchoolName[1],name:'title_4'})
	BooksCollection.insert({author_id:authorsArrId[4],author_name:authorsArrName[2],school_id:authorsSchoolId[3],school_name:authorsSchoolName[2],name:'title_5'})
	BooksCollection.insert({author_id:authorsArrId[5],author_name:authorsArrName[3],school_id:authorsSchoolId[4],school_name:authorsSchoolName[3],name:'title_6'})


   
  });
	Meteor.methods({
		'add_book' : function(data){
			BooksCollection.insert({title:data[0],isbn:data[1],author_name:data[2],class_name:data[3],professor_name:data[4],description:data[5],school_id:data[6],author_id:data[7],date:data[8],school_name:data[9]});
			console.log('clicked');
		}
	});
  Meteor.publish('get_all_school_name',function(data){
  		 return SchoolsCollection.findOne({name:data});
  });

  Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, {fields: {'nested.things': 1}});
});

  Meteor.publish('get_authors_name',function(data){
  		return AuthorsCollection.find({school_id:data});
  });

   Meteor.publish('get_books',function(data){
   		console.log(data);
  		 return BooksCollection.find({school_id:data});
  });

}

})();
