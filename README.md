# class
> Allow create scalable, reusable high-quality, strong typed and data-driven JavaScript classes, applications and libraries with one main statement `Klass.Class` or simply `Klass`. 
`Klass.Class` gives the possibility to create a class avoiding create explicitely getters, setters and properties (using `Object.defineProperty` or `Object.defineProperties`) but only by listing the properties. `Klass.Class` allows strong-typed Object Orientated Programming in javascript.

## About

This library is started on April 3rd, 2021.

This library can be used when you want the enterprise features and tools of a language like Java, but you need your code to execute in a JavaScript environment.

For business applications, being able to explicitly specify a data type is extremely useful. For example, you may want to strongly type a salary field, so that it can only hold numeric data with a specific precision (length and decimal positions). 

Also being able to explicitely specify, the accepted values and/or default value is extremely useful and guarantee data quality. For example for title field of type string, you can specify "Mr", "Ms", "Miss", "Doctor", "Professor", "PHD" and "Ing." as only accepted values.

For object of class created with Klass.Class, when attempting to set a value with wrong type to a field an error/exception is thrown.

### Requirements

You need no particular installation as it's needed for typescript.

No transpiler is needed.

Just a browser and load:

  - serenix_object.js
  - xregexpall.js library of **Steven Levithan** that extends javascript regular expression class `RegExp`.
  - serenix_parser_statements.js : statements classes used when parsing default value, expression, intervals and values
  - serenix_statement_parser.js : basic javascript parser used to parse default value, expression, intervals and values
  - serenix_types.js : predefines types (int, unsigned int, byte, unsigned byte, email, ipv4, ipv6, any, ...), provides SereniX.types.Type and it's sub-types (`SereniX.types.Enum`, `SereniX.types.Interval`, `SereniX.types.Union`, `SereniX.types.Intersect`, `SereniX.types.Minus`, ...). For more, see Type object section/block below.
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

Klass.Class can be used as a simple invocation or as value of assign statement. Below are some templates/structures. 
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

Each property is defined using a string element of an array with a specific structure. In the case of pure short syntax, the array represents the list of properties as you can see in the example below.
#### Structure

The short syntax a property is a string that follows the structure of the property pattern below:

"name<data_type:default_value:values:description>"

  - **name**: the property name that is required
  - **data_type**: the data type that can be optional in case of loose-typing. It can be :
    - A string (data type name) or object data type
    - followed by data length limitation and/or followed by quantifier ('*', '+', '?', '{<min>,<max>?}', '{<min>?,<max>}' or '{<occurences>}') 
  - **default_value**: the default value that is optional. When no default value, there shall be no text between the first ':' character and the second ':' character
  - **values**: The possible values that is optional:

    The possible values can be: 
    - **Enumeration/list of values**: values separated by '|'character. See the title property definition in **Short Syntax Example 2**.
    - **Interval**: 
    
      starts and end with open square bracket character '[' or close square bracket character ']':
      - when starts with ']', the minimum value is excluded
      - when ends with '[', the maximum value is excluded
      
      Inside the bracket, the minimum and maximum values delimited by coma (',') character.
      - When no mimimum value specified, the interval accepts value from the lowest possible value to the maximum value
      - When no maximum value specified, the interval accepts value from the minimum value to the highest possible value
      
    - **formula/expression**: a valid javascript expression preceded by '=' character just after the second ':' character. See the definition of **fullName** and **qualifiedName** in the following example.
  - **description**

#### Short Syntax Example 1:
```js
Klass.Class(
    'hr.School', //full class name : the namespace is 'hr' and the (simple) name 'School'
    [
        "name<String(0, 60)>",
        "address<SereniX.types.Object({name: 'Address', fields:{quarter:'string(5,50)', street: 'unsigned int', town: 'string(0,60)'}})>"
    ]
);
```

In the example above, only data types are specified for the two properties. 
  - For name property, the data type is string with limited length : 0 for the minimum length and 60 for the maximum length.
  - For the address property, any object with the specified fields (quarter, street and town) is accepted as data type

#### Short Syntax Example 2: More complex class definition
  The folowing example, create a class and set the created class to variable E. The class creation is followed by some statements to test the class.
  
```js
var E = Klass.Class(
        'hr.Employee', //full class name : the namespace is 'hr' and the (simple) name 'Employee'
        [ //list of properties
        //the property password of type password with min length equals to 12 and max length equals to 18
            'password<SereniX.types.Password({name:"StrongPassword", nameField:"fullName",minLength:12,maxLength:18})>', 
            'echelon<unsigned int:3:1..10>',
        //name is a string with length in the range 0 to 60 with empty string as default value
            'name<String(0,60):"">', 
        //surname is a string with length in the range 0 to 60 with empty string as default value
            'surname<String(0,60):"">', 
        //firstname is a string with length in the range 0 to 60 with empty string as default value
            'firstName<String(0,60):"">', 
        // title property with data type, "Mr" as default value and the list/enumeration of possible values
            'title<Title<dataType:String(20)>:"Mr":Mr|Ms|Miss|Doctor|Professor|PHD|Ing.>',
        //id property accepts only unsigned integer 
            'id<unsigned int>',   
        //fullName it's a read-only property with a formula
            'fullName<String::=((this.firstName ? this.firstName + " " : "") + (this.surname ? this.surname + " " : "") + (this.name ? this.name : "")).trim()>', 
        //salary property with default value 
            'salary<unsigned int:250000>', //
        //category accepts any type and it's default value is 6.
            'category=6', 
        //hired is of Date type with October 1st, 2020 as default value
            'hired<date:"2020-10-01">', 
        //The email property is of type email that is a predefined type in serenix_types.js. 'email' type is basically a string type.
            'email<email(10,25)>', 
            'job<String(0,60):"">',
        //qualifiedName is a read-only property/field with a formula/expression. qualifiedName used this.getFullName() that is the getter of fullName that is also read-only with formula
            'qualifiedName<String::=this.getFullName() + (this.title ? ", " + this.title : "") + (this.job ? ": " + this.job : "")>',
            'bilingual<boolean:0>',
        //the property addresses an array of 1 to 5 strings. Each string (item) with minimum length of 5 characters and maximum length of 200 characters
            'addresses<String(5, 200){1, 5}>', 
        //the property ipv4  of type array of 4 bytes,
            'ipv4<unsigned byte{4}>', 
        //the property ip is of string type: 'ipv4' is a predefined string type.
            'ip<ipv4>', 
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
#### Short Syntax Example 3: class extension with short syntax
  
  To specify the super class, the value can be the full name of the super class or the super class it's (function class). In the example, the full name is used.
  
```js
var M = Klass.Class(
    'hr.Manager',  //the full class name: namespace and simple class name
    'hr.Employee', //parent or super class : the class hr.Manager is a sub-class of hr.Employee
    [
        //the property class is of type string, has default 'junior' and accepts only listed values ('junior', 'experienced', 'senior' and 'general manager' 
        'class<String:junior:junior|experienced|senior|general manager>',
        //collaborators property is of type list that can have zero or many Employee items
        'collaborators<hr.Employee+>',
        //the property projects is of type list of objects and accepts zero or many objects 
        'projects<Object{0,}>',
        //keys is of type Array of any value and has the array [1, 2, 3] has default value
        'keys<Array:[1, 2, 3]>'
    ]
);
```

### Object for description of properties
  
  The following keywords are necessary to define a class using object metadata syntax `Klass.Class({})`: 
  
  - **name** : keyword to specify the class name. 
  
  When a class name contains '.' delimiter(s) :
  
    - If no namespace keyword and nopackage keyword specify, the simple class name is the last token and the namespace the substring before the last '.' in the name string value
    - If namespace keyword or package keyword also specified, it's considered as the base namespace. The effective namespace is the base namespace +  the substring before the last '.' in the name string value
  
  - **namespace** or **package** : 
  - **super**, **parent**, **superClass**, **parentClass**, **extend** or **extends** : to specify the super class (class that is extended). A class is expected as value (any function that is a class).
  - **construct** : A function is expected as value. That function is used to create the class constructor
  - **properties** : for the definition of the properties of the class. The value can be 
  
    - an array of string or object
    - an object
  
  - **methods** : to explicitely specified the methods of the class. 
    - A method with name that coressponds to a getter name (of existing property) will be used as the getter of the property.
    - A method with name that coressponds to a setter name (of existing property) will be used as the setter of the property

  **Accessors (getters and setters) methods  will be automatically created for roperties that does not have explicitely defined methods**.
  
  Below, an example of class creation using of objects for properties description.

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
});
