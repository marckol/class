# class
> Allow create scalable, reusable high-quality, strong typed and data-driven JavaScript classes, applications and libraries with one main statement `Klass.Class` or simply `Klass`. 
`Klass.Class` gives the possibility to create a class avoiding create explicitely getters, setters and properties (using `Object.defineProperty` or `Object.defineProperties`) but only by listing the properties.

## About

This library is started on April 3rd, 2021.

This library can be used when you want the enterprise features and tools of a language like Java, but you need your code to execute in a JavaScript environment.

For business applications, being able to explicitly specify a data type is extremely useful. For example, you may want to strongly type a salary field, so that it can only hold numeric data with a specific precision (length and decimal positions). 

Also being able to explicitely specify, the accepted values and/or default value is extremely useful and guarantee data quality. For example for title field of type string, you can specify "Mr", "Ms", "Miss", "Doctor", "Professor", "PHD" and "Ing." as only accepted values.

For object of class created with Klass.Class, when attempting to set a value with wrong type to a field an error/exception is thrown.

### Requirements
You need no particular installation as it's needed for typescript. Just a browser and load:

  - serenix_object.js
  - xregexpall.js
  - serenix_parser_statements.js
  - serenix_statement_parser.js
  - serenix_types.js
  - serenix_class_base.js.

## Getters and Setters

  - Each property has a getter. If it's not defined in the methods, it's automatically created. If the property is a boolean, the name of the getter starts with 'is'.Otherwise, it starts with 'get'.
  - Each property (not read-only) has a setter with name starting with 'set'. If it's not defined in the methods, it's automatically created. When automatically created, the setter returns the object to allow method or field chaining. 

## Main predefined types: 

### Number
  - **bit**: 0 or 1
  - **byte**: -128 to 127
  - **unsigned byte**: 0 to 255
  - **short**: -32768 to 32767
  - **unsigned short**: 0 to 65535
  - **int**: -2147483648 to 2147483647
  - **unsigned int**: 0 to 4294967295
  - **long**: -4294967296 to 4294967295
  - **unsigned long**: 0 to 9223372036854775807
  - **long long**: -9223372036854770808 to 9223372036854775807,
  - **int64**: -9223372036854770808 to 9223372036854775807
  - **unsigned long long**: 0 to 18446744073709551615,
  - **uint64**: 0 to 18446744073709551615
  - **float**: 3.4e-38 to 3.4e+38
  - **number** : 
  - **double**: 1.7e-308 to 1.7e+308
  - **long double**: 1.7e-308 to 1.7e+308
  - **unsigned float**: 0 to 6.8e+38
  - **unsigned double**: 0 to 3.14e+308
  
### String
  - **string**  
  - **password**
  - **tel**
  - **url**
  - **email**
  - **rfc822_email** 
  - **es6_email**

### Boolean

For boolean type **boolean** or **bool** can be used

### any

Use **any** for loosed typing. If a property has not defined data type, it's data type is setted to **any**.

### javascript class

Any javascript class is a valid type. 

### Type object

Accepted Type object are instance of the abstract class SereniX.types.Type and must implement the method `is`.

Predefined Type Object are defined in serenix_types.js

Below are predefined Type object:

  - SereniX.types.AnyType : this type accepts any value of any type
  - SereniX.types.WildcardType
  - SereniX.types.SType : Sized Type class (can have minLength, maxLength, precision, size properties)
  - SereniX.types.TArray
  - SereniX.types.ArrayType  
  - SereniX.types.VType
  - SereniX.types.Enum : for type with restricted list of values that are accepted
  - SereniX.types.Set
  - SereniX.types.Interval
  - SereniX.types.Union
  - SereniX.types.Minus
  - SereniX.types.Intersect
  - SereniX.types.ObjectType : SereniX.types.Object is an alias.
  - SereniX.types.RefType
  - SereniX.types.VariableType
  - SereniX.types.JoinType
  - SereniX.types.ManyToManyJoinType

## JSON string

To get correct JSON string of an object name e for example, use `e.toJSONString()` statement instead of JSON.stringify(e). JSON.stringify will not produce correct field name.

## Syntax

```
Klass.Class({
    name: 'hr.Employee', //full class name : the namespace is 'hr' and the (simple) name 'Employee'
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

```
Klass.Class(
    <full class name>
    [ //array of properties and/or named functions/methods
        
    ]
)
```

```
Klass.Class(
    <full class name>
    <parent class>, //parent or super class : the class hr.Manager is a sub-class of hr.Employee
    [ //array of properties and/or named functions/methods
        
    ]
)
```


### Properties

Two main syntaxes are possible: 

  - Object for description of properties
  
  
  
  - String short syntax for the definition of properties

### Methods

## Examples

### String short syntax for the definition of properties

```js
Klass.Class(
    'hr.School', //full class name : the namespace is 'hr' and the (simple) name 'School'
    [
        "name<String(0, 60)>",
        "address<SereniX.types.Object({name: 'Address', fields:{quarter:'string(5,50)', street: 'unsigned int', town: 'string(0,60)'}})>"
    ]
);
```

```js
var E = Klass.Class(
        'hr.Employee', //full class name : the namespace is 'hr' and the (simple) name 'Employee'
        [ //list of properties
            'password<SereniX.types.Password({name:"StrongPassword", nameField:"fullName",minLength:12,maxLength:18})>', //the property password of type password with min length equals to 12 and max length equals to 18
            'echelon<unsigned int:3:1..10>',
            'name<String(0,60):"">', //name is a string with length in the range 0 to 60 with empty string as default value
            'surname<String(0,60):"">', //surname is a string with length in the range 0 to 60 with empty string as default value
            'firstName<String(0,60):"">', //firstname is a string with length in the range 0 to 60 with empty string as default value
            'title<Title<dataType:String(20)>:"Mr":Mr|Ms|Miss|Doctor|Professor|PHD|Ing.>',
            'id<unsigned int>', //id property accepts only unsigned integer                        
            'fullName<String::=((this.firstName ? this.firstName + " " : "") + (this.surname ? this.surname + " " : "") + (this.name ? this.name : "")).trim()>', //fullName it's a read-only property with a formula
            'salary<unsigned int:250000>', //
            'category=6', //category accepts any type and it's default value is 6.
            'hired<date:"2020-10-01">', //hired is of Date type with October 1st, 2020 as default value
            'email<email(10,25)>', //The email property is of type email that is a predefined type in serenix_types.js. 'email' type is basically a string type.
            'job<String(0,60):"">',
	    //qualifiedName is a read-only property/field with a formula/expression. qualifiedName used this.getFullName() that is the getter of fullName that is also read-only with formula
            'qualifiedName<String::=this.getFullName() + (this.title ? ", " + this.title : "") + (this.job ? ": " + this.job : "")>',
            'bilingual<boolean:0>',
            'addresses<String(5, 200){1, 5}>', //the property addresses an array of 1 to 5 strings. Each string (item) with minimum length of 5 characters and maximum length of 200 characters
            'ipv4<unsigned byte{4}>', //the property ipv4  of type array of 4 bytes,
            'ip<ipv4>', //the property ip is of string type: 'ipv4' is a predefined string type.
            'manager<hr.Manager?:>',
            'comment<String>'
        ]);
        
var e = new E({ name: 'NJIOMO', category: 10 }); //Instantiation of the class hr.Employee setted to variable E
try {
    //methods chaining
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
```

```js
var M = Klass.Class(
	'hr.Manager', 
	'hr.Employee', //parent or super class : the class hr.Manager is a sub-class of hr.Employee
	[
		'class<String:junior:junior|experienced|senior|general manager>',
		'collaborators<hr.Employee+>',
		'projects<Object{0,}>',
		'keys<Array:[1, 2, 3]>'
	]
);
```

### Object for description of properties

```js
var Component = Klass.Class({
    name : "SereniX.ui.Component",   
    /**
     * 
     * @param {Object} comp
     * @constructor
     */
    construct:function(comp) {
        function _set(comp, self) {
            var e = comp.id||comp.Id||comp.ID||comp.elementId||comp.ElementId
                    ||comp.element||comp.Element||comp.componentId
                    ||comp.component||comp.containerId||comp.container||"";
            if (e instanceof String) {
                e = e.valueOf();
            }
            if (typeof e === 'string' && e) {
                self.setId(e);
                self.getElement();
            } else if (isDOMElt(e)) {
                self._element__ = e;
                self.__id_ = e.id||"";
                if (!e.parentNode) {
                    document.getElementsByTagName("body")[0].appendChild(e);
                }
                var style, tag = (e.tagName||e.nodeName).toLowerCase(), pos = comp.stylePosition||comp.cssPosition||comp.stylePos||comp.cssPos||comp.style;
                if (['absolute', 'relative', 'static', 'flex'].indexOf(pos) >= 0) {
                    e.style.position = pos;
                } else if (pos !== 'default' && ['input', 'label', 'a', 'button', 'table', 'img'].indexOf(tag) < 0 && !(style = cssStyle(e)) || style.position !== 'absolute') {
                    e.style.position = SERENIX_DEFAULT_CONTAINER_STYLE_POSITION;
                }
                e.__component__ = self;
                Object.defineProperty(e, 'component', { get : function() {return this.__component__;} });
            }
        }
        if (comp instanceof String) {
            comp = comp.valueOf();
        }
        if (isDOMElt(comp)) {
            this._element__ = comp;
            this.__id_ = comp.id||"";
            var style, tag = (comp.tagName||comp.nodeName).toLowerCase();
            if (['input', 'label', 'a', 'button', 'table', 'img'].indexOf(tag) < 0 
                    && (!(style = cssStyle(comp)) || style.position !== 'absolute')) {
                comp.style.position = SERENIX_DEFAULT_CONTAINER_STYLE_POSITION;
            }
            comp.__component__ = this;
            Object.defineProperty(comp, 'component', { get : function() {return this.__component__;} , configurable: true});
        } else if (comp && typeof comp === 'object') {
            _set(comp, this);
            this.setName(comp.name||comp.Name||comp.NAME||"");
            this.setCaption(comp.caption||comp.Caption||comp.CAPTION
                    ||comp.label||comp.Label||comp.LABEL||comp.libelle||"");
            if (!this.__caption_) {
                var html = comp.html;
                if (isPlainObj(html)) {
                    var caption = html.label||html.caption||html.title||html.text;
                    if (typeof caption === 'string') {
                        this.__caption_ = { html: true, text : caption };
                    }
                }
            }
            if (typeof this.setPlaceholder === 'function') {
                var placeholder = comp.placeholder||comp.Placheholder;
                if (placeholder instanceof String) {
                    placeholder = placeholder.valueOf();
                }
                if (placeholder) {
                    this.setPlaceholder(placeholder);
                }
            }
            if (typeof this.setTooltip === 'function') {
                this.setTooltip(comp.tooltip||comp.Tooltip||comp.TOOLTIP
                        ||comp.tooltipText||comp.tooltip_text||comp.tooltiptext||"");
            }
            if (!(this instanceof SereniX.ui.Container || this instanceof SereniX.ui.CField)) {
                this.setInputType(comp.inputType||comp.InputType
                        ||comp.contentType||comp.ContentType||comp.type||comp.Type||"textField");
            }
            if (typeof this.setDataType === 'function') {
                var dataType = comp.dataType||comp.datatype;
                if (typeof dataType === 'string' && dataType) {
                    this.setDataType(dataType);
                }
            }
            var v = comp.maxWidth||comp.MaxWidth, vp;
            if (v instanceof Number || v instanceof String) {
                v = v.valueOf();
            }
            if (typeof v === 'string') {
                v = v.toLowerCase();
            }
            if (v === 'viewport') {
                vp = new Viewport();
                v = vp.width;
            } else if (v === 'container') {
                throw new Error("Not yet supported");
            } else if (typeof v === 'string') {
                v = toPx(v);
            } else if (v !== undefined && (typeof v !== 'number' || v <= 0)) {                
                throw new Error("Incorrect max width: " + (comp.maxWidth||comp.MaxWidth));
            }
            this.__maxWidth_ = v;
            v = comp.maxHeight||comp.MaxHeight;
            if (v instanceof Number || v instanceof String) {
                v = v.valueOf();
            }
            if (typeof v === 'string') {
                v = v.toLowerCase();
            }
            if (v === 'viewport') {
                vp = vp||(new Viewport());
                v = vp.height;
            } else if (v === 'container') {
                throw new Error("Not yet supported");
            } else if (typeof v === 'string') {
                v = toPx(v);
            } else if (v !== undefined && (typeof v !== 'number' || v <= 0)) {                
                throw new Error("Incorrect max width: " + (comp.maxWidth||comp.MaxWidth));
            }
            this.__maxHeight_ = v;
        } else if (comp && typeof comp === 'string') {
            _set(comp, this);
        } else {
            this.__id_ = "";
            this.__name_ = "";
            this.__caption_ = "";
            this.__tooltip_ = "";
            this.__inputType_ = "textField";
        }
    },
    properties: [
        { name: "id", type: "string" },
        { name: "name", type: "string" },
        { name: "minWidth", type: "unsigned int" },
        { name: "minHeight", type: "unsigned int" },
        { name: "maxWidth", type: "unsigned int", nullable: true },
        { name: "maxHeight", type: "unsigned int", nullable: true },
        { name: "caption", type: "string|function|SereniX.TextPattern|Object" },
        { name: "tooltip", type: "string|function|SereniX.TextPattern|Object" },
        { name: "parent", type: "SereniX.ui.Container|SereniX.ui.CField" }
    ],
    methods : {
        getType: function() {
            return 'component';
        },
        isBande : function() {
            return false;
        },
        
        /**
         * 
         * @returns {String}
         */
        getId:function() {
            return this.__id_;
        },
        /**
         * 
         * @param {String} id
         * @returns {SereniX.ui.Component}
         */
        setId: function(id) {
            if (id instanceof String) {
                id = id.valueOf();
            }
            if (typeof id !== 'string') {
                throw new Error("Incorrect argument");
            }
            this.__id_ = id;
            if (this._element__) {
                this._element__.id = id;
            }
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getInputType:function() {
            return this.__inputType_||"textField";
        },
        /**
         * 
         * @param {String} inputType
         * @returns {SereniX.ui.Component}
         */
        setInputType:function(inputType) {
            this.__inputType_ = inputType;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getName : function() {
            return this.__name_||"";
        },
        /**
         * 
         * @param {String} name
         * @returns {SereniX.ui.Component}
         */
        setName : function(name) {
            if (name instanceof String) name = name.valueOf();
            if (typeof name !== 'string') {
                throw new Error("[SereniX.ui.Component]: String argument expected");
            }
            this.__name_ = name;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getCaption : function() {
            return this.__caption_;
        },
        /**
         * 
         * @param {type} caption
         * @returns {SereniX.ui.Component}
         */
        setCaption : function(caption) {
            var type = typeof caption;
            if (type !== 'string' && type !== 'function' 
                    && !(type === 'object' && typeof caption.getCaption === 'function')) {
                throw new Error("[SereniX.ui.Component]: String argument expected");
            }
            this.__caption_ = caption;
            return this;
        }
	}
}
```

## License

The MIT License © 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>. See [LICENSE.md](LICENSE.md) for full notice.
