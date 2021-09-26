# class
> Allow create scalable, reusable high-quality and strong typed JavaScript classes, applications and libraries with one main statement `Klass.Class` or simply `Klass`. 
`Klass.Class` gives the possibility to create a class avoiding create explicitely getters, setters and properties (using `Object.defineProperty` or `Object.defineProperties`) but only by listing the properties.

## Syntax

```
Klass.Class({
    name: 'hr.Employee',
    construct : function() {
    },
    properties : [
    ],
    methods: {
    }
}
```

```
Klass.Class({
    name: 'hr.Manager',
    super: hr.Employee,
    construct : function() {
    },
    properties : {
    },
    methods: {
    }
}
```

### Properties

Two main syntaxes are possible: 

  - Object for description of properties
  
  
  
  - String short syntax for the definition of properties

### Methods

## Examples
```
`SereniX.Class`(
	'hr.School',
	[
		"name<String(0, 60)>",
		"address<SereniX.types.Object({name: 'Address', fields:{quarter:'string(5,50)', street: 'unsigned int', town: 'string(0,60)'}})>"
	]
);

var E = `SereniX.Class`(
		'hr.Employee', 
		[ 
			'password<SereniX.types.Password({name:"StrongPassword", nameField:"fullName",minLength:12,maxLength:18})>', //the property password of type password with min length equals to 12 and max length equals to 18
			'echelon<unsigned int:3:1..10>',
			'name<String(0,60):"">', 
			'surname<String(0,60):"">',
			'firstName<String(0,60):"">',
			'title<Title<dataType:String(20)>:"Mr":Mr|Ms|Miss|Doctor|Professor|PHD|Ing.>',
			'id<unsigned int>',                        
			'fullName<String::=((this.firstName ? this.firstName + " " : "") + (this.surname ? this.surname + " " : "") + (this.name ? this.name : "")).trim()>',
			'salary<unsigned int:250000>',
			'category=6',
			'hired<date:"2020-10-01">', 
			//'password<SereniX.types.Password<name:'StrongPassword', namePropertyName:'fullName'>(12,18)>', //the property password of type password with min length equals to 12 and max length equals to 18
			//'password<SereniX.types.Password(12,18)>', //the property password of type password with min length equals to 12 and max length equals to 18
			'email<email(10,25)>',
			'job<String(0,60):"">',
			'qualifiedName<String::=this.getFullName() + (this.title ? ", " + this.title : "") + (this.job ? ": " + this.job : "")>',
			'bilingual<boolean:0>',
			'addresses<String(5, 200){1, 5}>', //the property addresses an array of 1 to 5 strings. Each string (item) with minimum length of 5 characters and maximum length of 200 characters
			'ipv4<byte{4}>', //the property ipv4  of type array of 4 bytes,
			'ip<ipv4>',
			'manager<hr.Manager?:>',
			'comment<String>'
		]);
		
var e = new E({ name: 'NJIOMO', category: 10 });
try {
	e.setName('KAMGA').setHired(new Date('2018-08-01')).setFirstName('Marc Olivier').setJob("Senior Conultant").setEchelon(11);
} catch (ex) {
	output.innerHTML += "<br/>Exception in class hr.Employee<br/>";
	output.innerHTML += "<br/>==============================<br/><br/>";
	output.innerHTML += "<br/>" + ex.toString() + "<br/><br/>";
}

try {
	e.setTitle('teacher');
} catch (ex) {
	output.innerHTML += "<br/>Exception in class hr.Employee<br/>";
	output.innerHTML += "<br/>==============================<br/><br/>";
	output.innerHTML += "<br/>" + ex.toString() + "<br/><br/>";
}

try {
	e.job = '****************************************** ***** teacher *********************';
} catch (ex) {
	output.innerHTML += "<br/>Exception in class hr.Employee<br/>";
	output.innerHTML += "<br/>==============================<br/><br/>";
	output.innerHTML += "<br/>" + ex.toString() + "<br/><br/>";
}

e.setTitle('Ing.');

e.email = 'kamga_marco@yahoo.com';

output.innerHTML += "<br/>New title: " + e.title + "<br/><br/>";


output.innerHTML += ("<br/>Employee class: " + E.getClassFullName()) + '<br/>';

output.innerHTML += "Qualified name: " + e.getQualifiedName();

e.echelon = 7;
try {
	e.password = 'gvy#4bhjAtBZ95_@1';
} catch (ex) {
	console.error(ex);
}
try {
	e.password = 'gvy#4';
} catch (ex) {
	console.error(ex);
}

var M = `SereniX.Class`(
		'hr.Manager', 
		'hr.Employee', 
		[
			'class<String:junior:junior|experienced|senior|general manager>',
			'collaborators<hr.Employee+>',
			'projects<Object{0,}>',
			'keys<Array:[1, 2, 3]>'
		]
);
```
## License

The MIT License © 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>. See [LICENSE.md](LICENSE.md) for full notice.
