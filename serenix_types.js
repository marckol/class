//$require_once('serenix_object.js')
if (typeof inBrowser === 'undefined') {
    inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS === 'undefined') {
    globalNS = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
}

var BINARY_REGEXP = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    HEX_REGEXP = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    OCTAL_REGEXP = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    DECIMAL_REGEXP = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

var PRIMITIVE_TYPES = [ "number", "string", "boolean", "null", "undefined", "symbol"];

var PRIMITIVE_TYPE_WRAPPERS = {
    "string": String,
    "number": Number,
    "boolean": Boolean,
    "function": Function /*,
    "symbol": Symbol*/
};

var PRIMITIVE_TYPE_WRAPPERS_MAP = {
    "String": "string",
    "Number": "number",
    "Boolean": "boolean",
    "Function": "function" /*,
    "symbol": Symbol*/
    
};

var TYPE_WRAPPERS = {
    "string": String,
    "number": Number,
    "boolean": Boolean,
    //"symbol": Symbol,
    "date": Date,
    "datetime": Date,
    "time": Date/*,
    "function": Function*/
};

var TYPE_ARGUMENTS = {
    "String": [ ["string"], ["number"], ["boolean"], ["object"], ["date"], ["datetime"], ["time"] ],
    "number": [ ["string"], ["number"] ],
    "boolean": [ ["string"], ["number"], ["boolean"] ],
    "date": [ ["string"], ["number"] ],
    "datetime": [ ["string"], ["number"] ],
    "time": [ ["string"], ["number"] ]/*,
    "function": Function*/
};

var SERENIX_NUMBER_TYPES = [
        "bit",
        "byte",
        "ubyte",
        "signed byte",
        "unsigned byte",
        "short",
        "short int",
        "short integer",
        "signed short",
        "signed short int",
        "signed short integer",
        "unsigned short",
        "unsigned short int",
        "unsigned short integer",
        "int",
        "integer",
        "signed",
        "signed int",
        "signed integer",
        "unsigned",
        "unsigned int",
        "unsigned integer",
        "long",
        "long int",
        "long integer",
        "signed long",
        "signed long int",
        "unsigned long",
        "unsigned long int",
        "long long",
        "long long int",
        "signed long long",
        "signed long long int",
        "unsigned long long",
        "unsigned long long int",
        "float",
        "double",
        "long double",
        "signed long double",
        "unsigned long double",
        "number",
        "numeric",
        "decimal",
        "uint",
        "ulong",
        "ufloat",
        "ubyte",
        "ushort",
        "udouble",
        "uldouble",
        "int4",
        "int8",
        "int16",
        "uint16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "uint16",
        "size"
    ];
/**
 * <b color="red">SERENIX_NOT_NULLABLES</b> is a SereniX system global variable 
 * that contains the list of SereniX basic types that does not 
 * accept <b color="red">null</b> nor <b color="red">undefined</b> values.
 * <p>the values of the list are:</p>
* <ul>
 *     <li><b color="#98C2E6">number</b>: accepts any javascript number value</li>
 *     <li><b color="#98C2E6">string</b>: accepts any javascript string</li>
 *     <li><b color="#98C2E6">boolean</b>: accepts <b color="blue">true</b> or <b color="blue">false</b>.</li>
 *     <li><b color="#98C2E6">bit</b>: accepts <b>0</b> or <b>1</b>.</li>
 *     <li><b color="#98C2E6">byte</b>: </li>
 *     <li><b color="#98C2E6">signed byte</b>: an alias of <b color="#98C2E6">byte</b>.</li>
 *     <li><b color="#98C2E6">unsigned byte</b>: accepts <b color="blue">0</b> to <b color="blue">255</b>.</li>
 *     <li><b color="#98C2E6">ubyte</b>: an alias of <b color="#98C2E6">unsigned byte</b>.</li>
 *     <li><b color="#98C2E6">short</b>: </li>
 *     <li><b color="#98C2E6">short int</b>: </li>
 *     <li><b color="#98C2E6">short integer</b>: </li>
 *     <li><b color="#98C2E6">signed short</b>: </li>
 *     <li><b color="#98C2E6">signed short int</b>: </li>
 *     <li><b color="#98C2E6">signed short integer</b>: </li>
 *     <li><b color="#98C2E6">unsigned short</b>: </li>
 *     <li><b color="#98C2E6">unsigned short int</b>: </li>
 *     <li><b color="#98C2E6">unsigned short integer</b>: </li>
 *     <li><b color="#98C2E6">int</b>: accepts any javascript int value</li>
 *     <li><b color="#98C2E6">integer</b>: accepts any javascript int value. It's an alias of <b color="#98C2E6">int</b></li>
 *     <li><b color="#98C2E6">signed</b>: </li>
 *     <li><b color="#98C2E6">signed int</b>: </li>
 *     <li><b color="#98C2E6">signed integer</b>: </li>
 *     <li><b color="#98C2E6">unsigned</b>: </li>
 *     <li><b color="#98C2E6">unsigned int</b>: </li>
 *     <li><b color="#98C2E6">unsigned integer</b>: </li>
 *     <li><b color="#98C2E6">long</b>: </li>
 *     <li><b color="#98C2E6">long int</b>: </li>
 *     <li><b color="#98C2E6">long integer</b>: </li>
 *     <li><b color="#98C2E6">signed long</b>: </li>
 *     <li><b color="#98C2E6">signed long int</b>: </li>
 *     <li><b color="#98C2E6">unsigned long</b>: </li>
 *     <li><b color="#98C2E6">unsigned long int</b>: </li>
 *     <li><b color="#98C2E6">long long</b>: </li>
 *     <li><b color="#98C2E6">long long int</b>: </li>
 *     <li><b color="#98C2E6">signed long long</b>: </li>
 *     <li><b color="#98C2E6">signed long long int</b>: </li>
 *     <li><b color="#98C2E6">unsigned long long</b>: </li>
 *     <li><b color="#98C2E6">unsigned long long int</b>: </li>
 *     <li><b color="#98C2E6">float</b>: </li>
 *     <li><b color="#98C2E6">double</b>: </li>
 *     <li><b color="#98C2E6">long double</b>: </li>
 *     <li><b color="#98C2E6">signed long double</b>: </li>
 *     <li><b color="#98C2E6">unsigned long double</b>: </li>
 *     <li><b color="#98C2E6">number</b>: </li>
 *     <li><b color="#98C2E6">numeric</b>: </li>
 *     <li><b color="#98C2E6">decimal</b>: </li>
 *     <li><b color="#98C2E6">uint</b>: </li>
 *     <li><b color="#98C2E6">ulong</b>: </li>
 *     <li><b color="#98C2E6">ufloat</b>: </li>
 *     <li><b color="#98C2E6">ubyte</b>: </li>
 *     <li><b color="#98C2E6">ushort</b>: </li>
 *     <li><b color="#98C2E6">udouble</b>: </li>
 *     <li><b color="#98C2E6">uldouble</b>: </li>
 *     <li><b color="#98C2E6">int4</b>: </li>
 *     <li><b color="#98C2E6">int8</b>: </li>
 *     <li><b color="#98C2E6">int16</b>: </li>
 *     <li><b color="#98C2E6">uint16</b>: </li>
 *     <li><b color="#98C2E6">int32</b>: </li>
 *     <li><b color="#98C2E6">uint32</b>: </li>
 *     <li><b color="#98C2E6">int64</b>: </li>
 *     <li><b color="#98C2E6">uint64</b>: </li>
 *     <li><b color="#98C2E6">uint16</b>: </li>
 *     <li><b color="#98C2E6">size</b>: </li>
 * </ul>
 * @type Array
 */
var SERENIX_NOT_NULLABLES = SERENIX_NUMBER_TYPES.concat([ "number", "string", "boolean"]);
/**
 * Alias of the global variable <b color="red">SERENIX_NOT_NULLABLES</b>.
 * <p><b>Note</b>Cette variable ne doit pas être modifie</p>
 * @type Array
 * @see SERENIX_NOT_NULLABLES
 */
var HABEMUS_NOT_NULLABLES = SERENIX_NOT_NULLABLES;
/**
 * 
 * @type type
 */    
var SERENIX_NUMBER_TYPES_MAP = {
    "bit": "bit",
    "byte": "byte",
    "signed byte": "byte",
    "byte char": "byte",
    "b": "byte",
    "unsigned byte": "unsigned byte",
    "unsignedbyte": "unsigned byte",
    "ubyte": "unsigned byte",
    "ub": "unsigned byte",
    "short": "short",
    "short int": "short",
    "signed short": "short",
    "signed short int": "short",
    "unsigned short": "unsigned short",
    "unsigned short int": "unsigned short",
    "us": "unsigned short",
    "int": "int",
    "i": "int",
    "signed": "int",
    "signed int": "int",
    "signedint": "int",
    "unsigned": "unsigned int",
    "unsigned integer": "unsigned int",
    "unsignedinteger": "unsigned int",
    "uint": "unsigned int",
    "ui": "unsigned int",
    "unsigned int": "unsigned int",
    "unsignedint": "unsigned int",
    "long": "long",
    "long int": "long",
    "longint": "long",
    "l": "long",
    "li": "long",
    "signed long": "long",
    "signed long int":"long",
    "signed long integer":"long",
    "unsigned long": "unsigned long",
    "signedlong": "long",
    "signedlongint":"long",
    "signed longint":"long",
    "signedlonginteger":"long",
    "signed longinteger":"long",
    "longinteger":"long",
    "unsignedlong": "unsigned long",
    "ulong": "unsigned long",
    "ul": "unsigned long",
    "unsigned long int": "unsigned long",
    "long long": "long long",
    "long long int": "long long",
    "long long integer": "long long",
    "signed long long": "long long",
    "signed long long int": "long long",
    "signed long long integer": "long long",
    "unsigned long long": "unsigned long long",
    "unsignedlonglong": "unsigned long long",
    "ull": "unsigned long long",
    "unsigned long long int": "unsigned long long",
    "float": "float",
    "real": "float",
    "decimal": "float",
    "numeric" : "number",
    "number" : "number",
    "nombre": "number",
    "double": "double",
    "long double": "long double",
    "f": "float",
    "d": "double",
    "ld": "long double",
    "unsigned float": "unsigned float",
    "unsignedfloat": "unsigned float",
    "signedfloat": "signed float",
    "ufloat": "unsigned float",
    "uf": "unsigned float",
    "unsigned double": "unsigned double",
    "signeddouble": "signed double",
    "unsigneddouble": "unsigned double",
    "udouble": "unsigned double",
    "ud": "unsigned double",
    "unsigned long double": "unsigned long double",
    "uld": "unsigned long double",
    "uldouble": "unsigned long double",            
    "uint4" : "int",
    "int8" : "byte",
    "uint8" : "unsigned byte",
    "int16" : "short",
    "uint16" : "unsigned short",
    "int32" : "int",
    "uint32" : "unsigned int",
    "int64" : "long long",
    "uint64" : "unsigned long long",
    'short integer' : 'short',
    'signed short integer' : 'short',
    'unsigned short integer' : 'unsigned short',
    'integer' : 'int',
    'signed integer' : 'int',
    'long integer' : 'long',
    'signed long double' : 'long double',
    'ushort' : 'unsigned short',
    'size' : 'unigned int'
};    
var SERENIX_MAIN_INTEGER_TYPES = [
        "byte",
        "unsigned byte",
        "short",
        "unsigned short",
        "int",
        "long",
        "unsigned long",
        "long long",
        "unsigned long long",
        "uint",
        "ulong",
        "ubyte",
        "ushort",
        "int4",
        "uint4",
        "int8",
        "uint8",
        "int32",
        "uint32",
        "int16",
        "uint16",
        "int64",
        "uint64",
        "size"
    ];
var SERENIX_INTEGER_TYPES = [
        "byte",
        "signed byte",
        "unsigned byte",
        "short",
        "short int",
        "short integer",
        "signed short",
        "signed short int",
        "signed short integer",
        "unsigned short",
        "unsigned short int",
        "unsigned short integer",
        "int",
        "integer",
        "signed",
        "signed int",
        "signed integer",
        "unsigned",
        "unsigned int",
        "unsigned integer",
        "long",
        "long int",
        "long integer",
        "signed long",
        "signed long int",
        "unsigned long",
        "unsigned long int",
        "long long",
        "long long int",
        "signed long long",
        "signed long long int",
        "unsigned long long",
        "unsigned long long int",
        //"number",
        //"numeric",
        //"decimal",
        "uint",
        "ulong",
        "ubyte",
        "ushort",
        "int4",
        "int8",
        "uint32",
        "uint16",
        "uint64",
        "size"
    ];

var SERENIX_FLOATING_POINT_TYPES = [
    "float",
    "double",
    "long double",
    "signed long double",
    "unsigned long double",
    "signed float",
    "unsigned float",
    "signed double",
    "unsigned double",
    "number",
    "numeric",
    "decimal",
    "udouble",
    "uldouble",
    "ufloat"
];


var SERENIX_INTEGER_TYPES_MAP = {};

var SERENIX_FLOATING_POINT_TYPES_MAP = {};
(function() {
    var k, v;
    for (var i = 0, n = SERENIX_INTEGER_TYPES.length; i < n; i++) {
        k = SERENIX_INTEGER_TYPES[i];
        v = SERENIX_NUMBER_TYPES_MAP[k];
        if (v) {
            SERENIX_INTEGER_TYPES_MAP[k] = v;
        }
    }
    
    for (var i = 0, n = SERENIX_FLOATING_POINT_TYPES.length; i < n; i++) {
        k = SERENIX_FLOATING_POINT_TYPES[i];
        v = SERENIX_NUMBER_TYPES_MAP[k];
        if (v) {
            SERENIX_FLOATING_POINT_TYPES_MAP[k] = v;
        }
    }
})();
/**
 * 
 * <p>'text', 'html-text', 'xml-text', 'yaml-text', 'json-text' and 'code' are 
 * multi lines text</p>
 * @type Array&lt;String&gt;
 */
var SERENIX_STRING_TYPE_NAMES = [ 
    'string', //single line text
    'text', //multi lines text
    'html-text', //multi lines text
    'xml-text', //multi lines text
    'yaml-text', //multi lines text
    'json-text', //multi lines text
    'code', //multi lines text
    'password', //single line text
    'email', //single line text
    'tld',
    'tel',
    'telephon',
    'url',
    'uri',
    'urn',
    'path',
    'filename',
    'propertyname',
    'property name',
    'property_name',
    'namespace',
    'ipv4',
    'ipv6',
    'creditcard',
    'credit card',
    'credit_card'
];

var SERENIX_STRING_TYPES = SERENIX_STRING_TYPE_NAMES;


var SERENIX__TYPE_REGEXPS = {
    "email": "",
    "tel": new RegExp("^(?:(?:(?:00[ ]*|\\+)(\\d{1, 4}))|(?:\\((\\d{1, 4})\\)))[ ]*(?:(\\d{7,12})|(\\d[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?)|(\\d{3}[ -.]?\\d{3}[ -.]?\\d{3}[ -.]?)|(\\d[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?)|(\\d{3}[ -]\\d{4}))$"),
    "url": "",
    "uri": "",
    "name": "",
    "namepace": ""
};


var STRING_DATA_TYPE_CLASSES = {
  'Number': SERENIX_NUMBER_TYPES,
  'String': SERENIX_STRING_TYPE_NAMES,
  'Float': SERENIX_FLOATING_POINT_TYPES,
  'Integer' : SERENIX_INTEGER_TYPES,
  'BigInteger': [ 'biginteger', 'bigint' ],
  'Boolean': ['boolean', 'bool'],
  'Date': [ 'date', 'datetime', 'timestamp', 'time' ],
  'Any': [ 'any', '*' ],
  'Array': [ 'array' ],
  'Object': [ 'object' ],
  'Undefined' : [ 'null', 'undefined' ],
  'Symbol': [ 'symbol' ],
  'Call': [ 'function' /*, 'class'*/ ]
};
var SERENIX_BASIC_DATA_TYPE_NAMES = [];
var SERENIX_MAIN_NUMBER_TYPES = [];
(function() { 
    var names = SERENIX_BASIC_DATA_TYPE_NAMES;
    function add(to, arr) {
        for (var i = 0, n = arr.length; i < n; i++) {
            to[to.length] = arr[i];
        }
    }
    add(names, STRING_DATA_TYPE_CLASSES.Any);
    add(names, SERENIX_NUMBER_TYPES);
    var name2;
    for (var name in SERENIX_NUMBER_TYPES_MAP) {
        if (names.indexOf(name) < 0) {
            names[names.length] = name;
        }
        name2 = name.replace(/\s+/g, "");
        if (names.indexOf(name2) < 0) {
            names[names.length] = name2;
        }
        if (!SERENIX_NUMBER_TYPES_MAP[name2]) {
            SERENIX_NUMBER_TYPES_MAP[name2] = SERENIX_NUMBER_TYPES_MAP[name];
        }
    }
    add(names, SERENIX_STRING_TYPE_NAMES);
    add(names, STRING_DATA_TYPE_CLASSES.Boolean);
    add(names, STRING_DATA_TYPE_CLASSES.Date);
    add(names, STRING_DATA_TYPE_CLASSES.Array);
    add(names, STRING_DATA_TYPE_CLASSES.Object);
    add(names, STRING_DATA_TYPE_CLASSES.Call);
    add(names, STRING_DATA_TYPE_CLASSES.Undefined);
    add(names, STRING_DATA_TYPE_CLASSES.Symbol);
    names = SERENIX_MAIN_NUMBER_TYPES;
    var buf = "";
    for (var i = 0, n = SERENIX_NUMBER_TYPES.length; i < n; i++) {
        name = SERENIX_NUMBER_TYPES[i];
        name2 = SERENIX_NUMBER_TYPES_MAP[name];
        if (name2 === name) {
            names[names.length] = name;
        } else if (!name2) {
            names[names.length] = name;
            //SERENIX_NUMBER_TYPES_MAP[name] = name;
            buf += "\nType '" + name + "' :not mapped";
        }
    }
    console.log(buf);
})();   


var SereniX_deferrableStringTypeConversion = true;

/**
 * 
 * @type RegExp
 */
var EMAIL_REGEXP_CHARSET = /^[\u0000-\u00ff]+$/;

var EMAIL_REGEXP_VALID_FORMAT = /^.+@.+\..+$/;

var EMAIL_VALID_FORMAT = ".+@.+\\..+";

var EMAIL_VALID_FORMAT_FULL = "^.+@.+\\..+$";

var ES6_VALID_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * 
 * @type RegExp
 * @see http://rosskendall.com/blog/web/javascript-function-to-check-an-email-address-conforms-to-rfc822
 */
var RFC822_VALID_EMAIL_REGEXP = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

var RFC822_VALID_EMAIL_PATTERN = "([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22))*\\x40([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d))*";

var RFC822_VALID_EMAIL_PATTERN_FULL = "^([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22))*\\x40([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d))*$";
/**
 * 
 * @type RegExp
 * @link https://www.ietf.org/rfc/rfc3339.txt
 */
var RFC3339_DATETIME_VALUE_REGEXP = /^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])[Tt]([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(?:\.(\d+))?(([Zz])|([\+|\-]([01]\d|2[0-3])))$/;
/**
 * 
 * @type RegExp
 * @link https://www.ietf.org/rfc/rfc3339.txt
 */
var RFC3339_DATETIME_REGEXP = /(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])[Tt]([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(?:\.(\d+))?(([Zz])|([\+|\-]([01]\d|2[0-3])))/;
/**
 * 
 * @type String
 * @link https://www.ietf.org/rfc/rfc3339.txt
 */
var RFC3339_DATETIME_REGEXP_STRING = "(\\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\\d|3[01])[Tt]([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d|60)(?:\\.(\\d+))?(([Zz])|([\\+|\\-]([01]\\d|2[0-3])))";

/**
 * /**
 * 
 * @type RegExp
 */
var RFC3339_DATE_VALUE_REGEXP = /^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/;
/**
 * 
 * @type RegExp
 */
var RFC3339_DATE_REGEXP = /(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])/;
/**
 * 
 * @type String
 */
var RFC3339_DATE_REGEXP_STRING = "(\\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\\d|3[01])";




/**
 * 
 * @type RegExp
 */
var RFC3339_TIME_VALUE_REGEXP = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(?:\.(\d+))?(([Zz])|([\+|\-]([01]\d|2[0-3])))$/;
/**
 * 
 * @type RegExp
 * 
 */
var RFC3339_TIME_REGEXP = /([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(?:\.(\d+))?(([Zz])|([\+|\-]([01]\d|2[0-3])))/;

/**
 * 
 * @type String
 */
var RFC3339_TIME_REGEXP_STRING = "([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d|60)(?:\\.(\\d+))?(([Zz])|([\\+|\\-]([01]\\d|2[0-3])))";

/**
 * 
 * @type RegExp
 */
var ATOM_DATETIME_REGEXP = /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d[+-][0-2]\d:[0-5]\d/;


var ATOM_DATETIME_REGEXP_STRING = "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\\d|3[0-1])T[0-2]\\d:[0-5]\\d:[0-5]\\d[+-][0-2]\\d:[0-5]\\d";


var ISO_DATETIME_VALUE_REGEXP = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

var ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
/**
 * RegExp to test a string for a full ISO 8601 Date
 * Does not do any sort of date validation, only checks if the string is according to the ISO 8601 spec.
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
var ISO_8601_DATETIME_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

var ISO_8601_DATETIME_FULL_STRING = "\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d(\\.\\d+)?(([+-]\\d\\d:\\d\\d)|Z)?";

var ISO_DATETIME_REGEXP_STRING = "([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?";

var TEL_REGEXP = /((?:00|\+)(?:\d{1,3})|(?:\(\d{1,3}\)))?(?:[0-9][1-9]\d{5,7})/;

var PROPERTY_NAME_REGEXP = /[a-zA-Z$_][a-zA-Z$_0-9]*/;

var FILE_TOKEN_REGEXP = /[a-zA-Z$_][a-zA-Z$_0-9]*/;

var IPV4_REGEXP = /^(?:(?:[0-9]|[2-9][0-9]|1[0-9][0-9]?|2(?:[0-4][0-9]|5[1-5]))\.(?:[0-9]|[2-9][0-9]|1[0-9][0-9]?|2(?:[0-4][0-9]|5[1-5]))\.(?:[0-9]|[2-9][0-9]|1[0-9][0-9]?|2(?:[0-4][0-9]|5[1-5]))\.(?:[0-9]|[2-9][0-9]|1[0-9][0-9]?|2(?:[0-4][0-9]|5[1-5])))$/;

var CREDIT_CARD_REGEXP_STRING = "(?:4[0-9]{12}(?:[0-9]{3})?"          // Visa
+ "|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}" // MasterCard
+ "|3[47][0-9]{13}"                   // American Express
+ "|3(?:0[0-5]|[68][0-9])[0-9]{11}"   // Diners Club
+ "|6(?:011|5[0-9]{2})[0-9]{12}"      // Discover
+ "|(?:2131|1800|35\\d{3})\\d{11}"      // JCB
+ ")";
/**
 * 
 */
var CREDIT_CARD_REGEXP = new RegExp('^' + CREDIT_CARD_REGEXP_STRING + '$');
/**
 * 
 */
var CREIT_CARD_NAMES = ['Visa', 'MasterCard', 'American Express', 'Diners Club', 'Discover', 'JCB'];
/**
 * 
 */
var CREDIT_CARD_REGEXPS = {
    "Visa": /^4[0-9]{12}(?:[0-9]{3})?$/, 
    "MasterCard": /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, //MasterCard
    "Master Card": /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, //MasterCard
    "American Express": /^3[47][0-9]{13}$/, // American Express
    "AmericanExpress": /^3[47][0-9]{13}$/, // American Express
    "Diners Club": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,   // Diners Club
    "Diners": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,   // Diners Club
    "Discover": /^6(?:011|5[0-9]{2})[0-9]{12}$/,      // Discover
    "JCB": /^(?:2131|1800|35\\d{3})\\d{11}$/ //      // JCB
};


(function() {
    var keys = Object.keys(CREDIT_CARD_REGEXPS), key;
    for (var k = 0, n = keys.length; k < n; k++) {
        key = keys[k];
        CREDIT_CARD_REGEXPS[key.toLowerCase()] = CREDIT_CARD_REGEXPS[key];
    }
})();


var TypeUtils = extObj(defineClass(
        'SereniX.types.TypeUtils',
        function TypeUtils() {}
    ),
    {
    /**
     * 
     * @param {type} obj
     * @param {type} type
     * @returns {Boolean|Date}
     */
    checkNamedType:function(obj, type) {
        var ltyp = type.toLowerCase();
        if (ltyp === 'any' || ltyp === 'anytype' 
                || ltyp === 'any-type' || ltyp === '') {
            return true; 
        }
        try {
            if (ltyp === 'string' || SereniX.types.String.isString(ltyp)) {
                return typeof obj === 'string';
            }
        } catch (ex) {
            throw ex;
        }

        if (ltyp === 'number') {
            return typeof obj === 'number';
        }

        if (ltyp === 'boolean') {
            return typeof obj === 'boolean';
        }

        if (ltyp === 'function') {
            return typeof obj === 'function';
        }
        if (SereniX.types.Number.getNumberType(type)) {
            return SereniX.types.Number.checkType(obj, type);
        }
        if (ltyp === 'array') {
            return isArray(obj);
        }
        if ([ "date", "datetime", "time" ].indexOf(ltyp) >= 0) {
            return obj instanceof Date;
        }
        switch (ltyp) {
            case '*':
                return isArray(obj);
            case '+':
                return isArray(obj) && obj.length > 0;
            case '#':
                return !isArray(obj) && (obj !== null) && (typeof obj === 'undefined');
            case '?':
                return !isArray(obj);
        }
        return false;
    },
    
    /**
     * 
     * @param {String|Function|Object} type
     * @returns {Boolean}
     */
    isAnyType: function(type) {
        if (isPlainObject(type)) {
            var _type = type.type||type.typeName;
            if (!_type) {
                _type = type.className||type["klass"]||type["class"]||type.ClassName||type["Klass"]||type["Class"];
                if (typeof _type === 'string') {
                    var ns = type.namespace||type.Namespace;
                    if (SereniX.Namespace && ns instanceof SereniX.Namespace) {
                        ns = ns.getFullName();
                    }
                    if (typeof ns === 'string') {
                        _type = ns + '.' + _type;
                        var cls = SereniX.forname(_type);
                        if (typeof cls !== 'function')
                            return false;
                        type = cls;
                    } else {
                        throw new Error("Not yet implemented");
                    }
                }
            }
        }
        return type === 'any' || type === 'Any' 
            || (globalNS.SereniX && SereniX.types && (typeof SereniX.types.AnyType === 'function') 
                    && ((type instanceof SereniX.types.AnyType) || type === SereniX.types.AnyType)); 
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Number|Date|String|Object}
     */
    getMin: function(obj) {
        var min = obj.min;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Min;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimum;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minimum;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minValue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinValue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumValue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinimumValue;
        if (typeof min !== 'undefined') {
            return min;
        }

        min = obj.minVal;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinVal;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumVal;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinimumVal;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minvalue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minvalue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumvalue;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minimumvalue;
        if (typeof min !== 'undefined') {
            return min;
        }

        min = obj.minval;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minval;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumval;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minimumval;
        return min;
    },
    /**
     * 
     * @param {type} obj
     * @returns {Boolean}
     */
    getMinInclude:function(obj) {
        var inc = obj.minInclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.mininclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.minimumInclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.minimuminclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }
        inc = obj.leftOpen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.Leftopen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.LeftOpen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }

        inc = obj.open;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.Open;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        return true;
    },
    /**
     * 
     * @param {type} obj
     * @returns {Boolean}
     */
    getMaxInclude: function(obj) {
        var inc = obj.maxInclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.maxinclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.maximumInclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }

        inc = obj.maximumaxclude;
        if (typeof inc !== 'undefined') {
            return toBool(inc);
        }
        inc = obj.leftOpen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.Leftopen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.LeftOpen;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }

        inc = obj.open;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        inc = obj.Open;
        if (typeof inc !== 'undefined') {
            return !toBool(inc);
        }
        return true;
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Number|Date|String|Object}
     */
    getMax: function(obj) {
        var max = obj.max;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Max;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximum;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maximum;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maxValue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaxValue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumValue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaximumValue;
        if (typeof max !== 'undefined') {
            return max;
        }

        max = obj.maxVal;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaxVal;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumVal;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaximumVal;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maxvalue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maxvalue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumvalue;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maximumvalue;
        if (typeof max !== 'undefined') {
            return max;
        }

        max = obj.maxval;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maxval;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumval;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maximumval;
        return max;
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Number|Date|String|Object}
     */
    getMinLength: function(obj) {
        var min = obj.minLength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinLength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumLength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.MinimumLength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minlength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minlength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.minimumlength;
        if (typeof min !== 'undefined') {
            return min;
        }
        min = obj.Minimumlength;
        return min;
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Number|Date|String|Object}
     */
    getMaxLength: function(obj) {
        var max = obj.maxLength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaxLength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumLength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.MaximumLength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maxlength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maxlength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.maximumlength;
        if (typeof max !== 'undefined') {
            return max;
        }
        max = obj.Maximumlength;
        return max;
    },
    /**
     * 
     * @param {type} obj
     * @returns {Number}
     */
    getCardMin:function(obj) {
        var cm = obj.cardMin;
        if (typeof cm === 'undefined') {
            cm = obj.cardMininimum;
            if (typeof cm === 'undefined') {
                cm = obj.minOccurences;
                if (typeof cm === 'undefined') {
                    cm = obj.minOccur;
                    if (typeof cm === 'undefined') {
                        obj.cardMin;
                        if (typeof cm === 'undefined') {
                            cm = obj.cardMininimum;
                            if (typeof cm === 'undefined') {
                                cm = obj.minOccurences;
                                if (typeof cm === 'undefined') {
                                    cm = obj.minOccur;
                                }
                            }
                        }
                    }
                }
            }
        }
        return cm;
    },
    /**
     * 
     * @param {type} obj
     * @returns {Number}
     */
    getCardMax:function(obj) {
        var cm = obj.cardMax;
        if (typeof cm === 'undefined') {
            cm = obj.cardMaximum;
            if (typeof cm === 'undefined') {
                cm = obj.maxOccurences;
                if (typeof cm === 'undefined') {
                    cm = obj.maxOccur;
                    if (typeof cm === 'undefined') {
                        obj.cardMax;
                        if (typeof cm === 'undefined') {
                            cm = obj.cardMaximum;
                            if (typeof cm === 'undefined') {
                                cm = obj.maxOccurences;
                                if (typeof cm === 'undefined') {
                                    cm = obj.maxOccur;
                                }
                            }
                        }
                    }
                }
            }
        }
        return cm;
    },
    getType: function(type) {
        
        //TODO
        
        return type;
    },
    /**
     * 
     * @param {Array|Object} values
     * @param {String|Function|SereniX.types.Type} type
     * @returns {SereniX.types.Enum|SereniX.types.Interval|SereniX.types.Set}
     */
    getValuesType: function(values, type) {
        var t;
        if (isArray(values)) {
            t = new SereniX.types.Enum({ values: values, dataType: type });
        } else if (values instanceof SereniX.types.VType) {
            t = values;
        } else if (isPlainObject(values)) {
            var vtyp = (values.setType||values.settype||values.type||"").toLowerCase();
            if (vtyp === 'enum' || vtyp === 'enumeration') {
                t = new SereniX.types.Enum(values);
            } else if (vtyp === 'interval' || vtyp === 'range' || vtyp === 'between') {
                t = new SereniX.types.Interval(values);
            } else if (vtyp === 'set') {
                t = new SereniX.types.Set(values);
            }
        } else {
            throw "Incorrect values";
        }
        if (arguments.length > 1 ) {
            t.setDataType(type);
        }
        return t;
    },
    /**
     * 
     * @param {type} obj
     * @param {type} strict
     * @returns {Object}
     */
    getInterval: function(obj, strict) {

        var min = this.getMin(obj),
            max = this.getMax(obj);

        if ((typeof min === 'undefined' || min === null) && (typeof max === 'undefined' || max === null)) {
            return null;
        }
        if (strict) {
            if ((typeof min === 'undefined' || min === null) || (typeof max === 'undefined' || max === null)) {
                return null;
            }
        }
        return { 
            type: 'interval', 
            min: min, 
            max: max, 
            minInclude : this.getMinInclude(obj), 
            maxInclude : this.getMaxInclude(obj)
        };
    },
    /**
     * 
     * @param {type} prop
     * @returns {Array|Object}
     */
    normalizeValues: function(prop) {
        
        var values = prop.values||prop.valuesList||prop.Values||prop.valueslist
                ||prop["enum"]||prop["Enum"]
                ||prop["enumeration"]||prop["Enumeration"]
                ||prop.checkList||prop.CheckList
                ||prop.checklist||prop.Checklist
                ||prop.check||prop.Check
                ||prop.checkValue||prop.CheckValue
                ||prop.checkvalue||prop.Checkvalue
                ||prop.check_value
                ||prop.acceptValue||prop.acceptvalue||prop.accept
                ||prop.AcceptValue||prop.Acceptvalue||prop.Accept
                ||prop.accept_value;
        
        
        
        if (!values) {
            values = prop.predicate||prop.Predicate;
            if (!values) {
                values = prop.condition||prop.Condition;
                if (typeof values === 'string') {
                    values = { type: 'condition', expression: values };
                } else if (isArray(values)) {
                    values = { type: 'condition', operator: 'or', members :  values };
                } else if (typeof values === 'object') {
                    if ((typeof values.type === 'undefined') || values.type === null) {
                        values.type = 'condition';
                    }
                }
            }
        }
       
        if (isArray(values)) {
            return values;
        }
        if (isPlainObject(values)) {
            if (values.type === 'enum' || values.type === 'enumeration') {
                if (isArray(values.values) || isPlainObject(values.values)) {
                    return values;
                }
                throw new Error("Incorrect enumeration");
            }
            var interval = this.getInterval(values);
            if (interval) {
                return interval;
            }
            if (prop.type === 'enum' || prop.type === 'enumeration' || !prop.type) {
                return { type: 'enum', values : values };
            }
            if (prop["enum"]||prop["Enum"]
                ||prop["enumeration"]||prop["Enumeration"] === values) {
                return { type: 'enum', values : values };
            }
        }
        
        var inter = this.getInterval(prop); 
        if (inter) {
            return  inter;
        }
        //interval = prop["interval"]||prop["range"]||prop["Interval"]||prop["Range"],
        if ((values = prop.interval||prop.Interval||prop.range||prop.Range
                ||prop.limits||prop.Limits||prop.bounds||prop.Bounds)) {
            return this.getInterval(values);
        }
        var typeOf;
        if ((typeOf = typeof values) === 'function') {
            return {
                    type: 'function',
                    func: values
                };
        } else if (typeOf === 'object') {
            var list;
            if (typeof (values.check||values.Check) === 'function') {
                return {
                    type: 'method',
                    caller: values, 
                    method: values.check||values.Check, 
                    func: values.check||values.Check 
                };
            } else if (values.type === 'condition') {
                
            } else if ((list = this.getInterval(values))) {
                return list;
            } else if (isArray((list = values.values||values.Values||values.elements||values.Elements||values.tokens||values.Tokens||values.valueslist||values.valuesList||values.list))) {
                if (values.type === 'set' || values.type === 'Set') {
                    var _set = { type: 'set', values: list };
                    var v;
                    if ((v = values.dataType||values.datatype||values.DataType||values.Datatype)) {
                        _set.dataType = v;
                    }
                    if ((v = values.tokenType||values.tokentype||values.TokenType||values.Tokentype)) {
                        _set.tokenType = v;
                    }
                    return _set;
                } else {
                    return list;
                }
            }
        } else if (typeOf === 'string') {
            var svalues = values;
            values = null; //ignore string cases
            //TODO
        } else {
            var values = prop.set||prop.Set||prop.tokens||prop.Tokens;
            if (isArray(values)) {
                return { type: 'set', values: values, tokens: values, dataType: "string", delimiter: DEFAULT_SET_TOKENS_DELIMITER||' ' };
            }
            if (isPlainObject(values)) {
                var name;
                if (!values.type) {
                    values.type = 'set';
                } else {
                    var o = {};
                    for (var n in values) {
                        if (hasOwnProp(values, n)) {
                            o[n] = values[n];
                        }
                    }
                    if (values.dataType) {
                        o.typeName = o.name = values.type;
                        o.type = "set";
                    } else if ((name= values.typeName||values.name)) {
                        o.dataType = values.type;                        
                    }
                    o.type = "set";
                    values = o;
                }
                var v;
                if ((v = values.tokenType||values.tokentype||values.TokenType||values.Tokentype)) {
                    values.tokenType = v;
                }
            } else {
                values = null;
            }
        }
        return values;
    },
    /**
     * Returns <b color="blue">true<b> when the given type metadata/definition 
     * corresponds to the definition of an object of class <b>SereniX.types.SType</b>
     * or returns <b color="blue">false<b> otherwise.
     * @param {Object} tmd  The type metadata/definition
     * @returns {Boolean}
     */
    isSTypeDef : function (tmd) {            
        var props = [ 
            'size', 'length', 'datalength', 'dataLength', 'data_length', 
            'precision', 'fractions', 'decimals', 'scale',
            'minLength', 'maxLength' , 'minlength', 'maxlength' , 
            'min_length', 'max_length'
        ],
        n = props.length;
        for (var i = 0; i <n; i++) {
            if (typeof tmd[props[i]] !== 'undefined') {
                return true;
            }
        }
        return false;
    },
    
    copySTypeAttribs: function(src, obj) {
        var mapping = {
            minLength: 'minLength',
            MinLength: 'minLength',
            'minlength': 'minLength',
            'min_length': 'minLength',
            maxLength: 'maxLength',
            MaxLength: 'maxLength',
            'maxlength': 'maxLength' ,
            'max_length': 'maxLength',
            'precision': 'precision', 
            'fractions': 'precision', 
            'decimals': 'precision',
            'Precision': 'precision', 
            'Fractions': 'precision', 
            'Decimals': 'precision',
            'size': 'size', 'length': 'size', 'datalength': 'size', 'dataLength': 'size', 'data_length': 'size', 
            'Size': 'size', 'Length': 'size', 'Datalength': 'size', 'DataLength': 'size'
        };
        for (var name in mapping) {
            var v = src[name];
            if (typeof v !== 'undefined') {
                obj[mapping[name]] = v;
            }
        }
        return obj;
    },
    getSTypeDef: function(type) {
        var mapping = {
            minLength: 'minLength',
            MinLength: 'minLength',
            'minlength': 'minLength',
            'min_length': 'minLength',
            maxLength: 'maxLength',
            MaxLength: 'maxLength',
            'maxlength': 'maxLength' ,
            'max_length': 'maxLength',
            'precision': 'precision', 
            'fractions': 'precision', 
            'decimals': 'precision',
            'Precision': 'precision', 
            'Fractions': 'precision', 
            'Decimals': 'precision',
            'size': 'size', 'length': 'size', 'datalength': 'size', 'dataLength': 'size', 'data_length': 'size', 
            'Size': 'size', 'Length': 'size', 'Datalength': 'size', 'DataLength': 'size'
        };
        var obj;
        for (var name in mapping) {
            var v = type[name];
            if (typeof v !== 'undefined') {
                if (!obj) {
                    obj = {};
                }
                obj[mapping[name]] = v;
            }
        }
        return obj;
    },
    /**
      * 
     * @param {Object} obj
     * @param {Boolean} strict
     * @returns {undefined} 
     */
    getNullable: function (obj, strict) {
        function _get (def, typ, strict) {
           var n = def.nullable||def.Nullable;        
           if (typeof n === 'undefined' || n === null) {
               n = def["isnull"]||def["isNull"]||def["is_null"];
               if (typeof n === 'undefined'  || n === null) {
                   n = def["notnull"]||def["notNull"]||def["isNotNull"]||def["not_null"]||def["is_not_null"];
                   if (typeof n !== 'undefined' &&  n !== null) {
                       n = !n;
                   }  else {
                       n = def["mandatory"]||def["Manadatory"];
                       if (typeof n === 'undefined' || n === null) {
                           n = def["required"]||def["Required"];
                           if (typeof n === 'undefined' || n === null) {
                               if (isPlainObject(typ)) {
                                   n = _get(typ, null, strict);
                               } else if (!strict) {
                                   n = true;
                               }
                           } else {
                               n =  n ? false : true;
                           }
                       } else {
                           n = toBool(n);
                       }
                   }
               } else {
                   n = toBool(n);
               }
           } else {
               n = toBool(n);
           }
           return n; 
        }
        return _get(obj, obj.type);
    },
    /**
     * 
     * @param {type} obj
     * @returns {unsigned int}
     */
    getSize: function(obj) {
        var s = obj.size;
        if (typeof s === 'undefined') {
            s = obj.Size;
            if (typeof s === 'undefined') {
                s = obj.dataLength;
                if (typeof s === 'undefined') {
                    s = obj.datalength;
                    if (typeof s === 'undefined') {
                        s = obj.digits;
                        if (typeof s === 'undefined') {
                            s = obj.Digits;
                        }
                    }
                }
            }
        }
        return s;
    },
    /**
     * 
     * @param {type} obj
     * @returns {unsigned int}
     */
    getScale: function(obj) {
        var s = obj.scale;
        if (typeof s === 'undefined') {
            s = obj.Scale;
        }
        return s;
    },
    /**
     * 
     * @param {type} obj
     * @returns {unsigned int}
     */
    getPrecision: function(obj) {
        var p = obj.precision;
        if (typeof p === 'undefined') {
            p = obj.Precision;
            if (typeof p === 'undefined') {
                p = obj.fractions;
                if (typeof p === 'undefined') {
                    p = obj.decimals;
                    if (typeof p === 'undefined') {
                        p = obj.Fractions;
                        if (typeof p === 'undefined') {
                            p = obj.Decimals;
                        }
                    }
                }
            }
        }
        return p;
    },
    /**
     * 
     * @param {type} values
     * @returns {type}
     */
    typeFromValues: function (values) {
        if (values) {
            var _types = [], _stypes = {} , t, v, st, arr;
            for (var i = 0, n = values.length; i < n; i++) {
                v = values[i];
                if (v instanceof Date) {
                    t = 'datetime';
                } else {
                    t = typeof v;
                     if (t === 'number') {
                        if (Number.isInteger(v)) {
                            t = 'int';
                        } else {
                            t = 'float';
                        }
                        st = (v < 0 ? "" : "unsigned ") + t;
                        arr = _stypes[t];
                        if (!arr) {
                            _stypes[t] = [st];
                        } else if (arr.indexOf(st) < 0) {
                            _stypes[t][arr.length] = st;
                        }
                    } else {
                        t = t.substring(0, 1).toUpperCase() + t.substring(1);
                    }
                }
                if (_types.indexOf(t) < 0) {
                    _types[_types.length] = t;
                }
            }
            if (_types.length === 1) {
                t = _types[0];
                st = _stypes[t];
                if (st) {
                    if (st.length === 1) {
                        return st[0];
                    } else {
                        return {
                            'type' : 'union',
                            'types' : st
                        };
                    }
                } else {
                    return t;
                }
            } else {
                var res = [];
                for (var i = 0, n = _types.length; i < n; i++) {
                    t = _types[0];
                    st = _stypes[t];
                    if (st) {
                        if (st.length === 1) {
                            res[res.length] = st[0];
                        } else {
                            for (var k = 0, len = st.length; k < len; k++) {
                                res[res.length] = st[k];
                            }
                        }
                    } else {
                        res[res.length] = t;
                    }
                }
                return {
                    'type' : 'union',
                    'types' : res
                };
            }
        } else {
            return SereniX.types.AnyType.getInstance();
        }
    }
});


TypeUtils.isTypeSuperType = function(type) {
    if (typeof type !== 'function') {
        return false;
    }
    var parent, t = type;
    for (;;) {
        parent = t.__SUPER_CLASS__;
        if (parent === SereniX.types.Type) {
            return true;
        }
        if (!parent) {
            return false;
        }
        t = parent; 
        if (typeof t !== 'function') {
            return false;
        }
    }
    
};



TypeUtils.isTypeOrSuperType = function(type, base) {
    if (!base) {
        base = SereniX.types.Type;
    }
    if (type === base) {
        return true;
    }
    if (typeof type !== 'function') {
        return false;
    }
    var parent, t = type;
    for (;;) {
        parent = t.__SUPER_CLASS__;
        if (parent === base) {
            return true;
        }
        if (!parent) {
            return false;
        }
        t = parent; 
        if (typeof t !== 'function') {
            return false;
        }
    }
    
};
/**
 * 
 * @param {type} obj
 * @param {type} type
 * @returns {Boolean}
 */
TypeUtils.isTypeOf = function(obj, type) {
    function checkInstanceof(obj, type) {
        if (obj instanceof type) {
            return true;
        }
        var cname = type.getClassFullName ? 
                        type.getClassFullName() :
                        type.__CLASS_NAME__;
        if (!cname) {
            cname = (type.__CLASS__ ? 
                    type.__CLASS__.__NAME__||type.__CLASS__.NAME||type.name : type.name)||"";
        }
        var ptype = PRIMITIVE_TYPE_WRAPPERS_MAP[cname];
        if (PRIMITIVE_TYPE_WRAPPERS[ptype] === type && typeof obj === ptype) {
            return true;
        }
        throw "Incorrect object!!! Expected type : " + cname;
    }
    if ((typeof type === 'undefined') || (type === null) 
            || this.isAnyType(type)) {
        return true;
    }
    if (type === 'object' || type === 'Object') {
        return isPlainObj(obj);
    }
    if (type instanceof SereniX.types.Type) {
        return type.is(obj);
    }
    if (type === Date) {
        return obj instanceof Date;
    }
    if (typeof type === 'function') { //class type
        return checkInstanceof(obj, type);
    }
    var c = type.checker||type.check||type.validator||type.validater||type.validate;
    if (typeof c === 'function') {
        return c(obj);
    }
    if (isPlainObject(c)) {
        if (typeof c.check === 'function')
            return c.check(obj);
        if (typeof c.isValid === 'function')
            return c.isValid(obj);
        if (typeof c.validate === 'function')
            return c.validate(obj);
        throw "Incorrect type checker/validator";
    }

    
    var _nullable, _type;
    if (isPlainObject(type)) {
        _type = type.type||type.name;
        _nullable = type.nullable;
        if (typeof _nullable === 'undefined') {
            _nullable = true;
        }
    } else if (typeof type === 'string' || typeof type === 'function') {
        _nullable = true;
        _type = type;
    } else
        throw new Error("Incorrect type");
    
    if (obj === null && (typeof _nullable === 'undefined' || _nullable)) {
        return true;
    }
    if (_type === String) {
        return (typeof obj === 'string') || (obj instanceof _type);
    }
    if ((typeof _type === 'function')) {
        return checkInstanceof(obj, _type);
    }
    if (typeof _type === "object") {
        var typ = _type.type||_type.name||"";
        if (typeof typ === "string") {
            if (!this.checkNamedType(obj, _type.type||_type.name)) {
                return false;
            }
        } else if ((typeof typ === 'function')) {
            if (!(obj instanceof _type)) {
                return false;
            }
        } else if (typ === String) {
            return (typeof obj === 'string') || (obj instanceof _type);
        }  else if (typ instanceof SereniX.types.Type) {
            return typ.is(obj);
        } else {
            return SereniX.types.Type.is(obj, _type);
        }
    } else if (typeof _type === "string") {
        return this.checkNamedType(obj, type);
    }
};

/**
 * 
 * @param {type} sval
 * @param {type} nullStringVal
 * @returns {Boolean}
 */
TypeUtils.isNullStringValue = function(sval, nullStringVal) {

    if (nullStringVal === undefined || nullStringVal === null) {
        if (TypeUtils.NULL_STRING_VALUES) {
            return TypeUtils.NULL_STRING_VALUES.indexOf(sval) >= 0;
        }
        return sval === '\\null\\' || sval === '\'null\''|| sval === '\"null\"';
    }
    return nullStringVal ===  sval;
};

TypeUtils.NULL_STRING_VALUES = [ '\\null\\' ];

/**
 * 
 * @param {String} ltyp  The lowercae type name
 * @returns {Boolean}
 */
TypeUtils.isIntegerType = function(ltyp) {
    return SERENIX_INTEGER_TYPES.indexOf(ltyp) >= 0 || SERENIX_INTEGER_TYPES_MAP[ltyp];
};
/**
 * 
 * @param {String} ltyp  The lowercae type name
 * @returns {Boolean}
 */
TypeUtils.isFloatingPointType = function(ltyp) {
    return SERENIX_INTEGER_TYPES.indexOf(ltyp) >= 0 || SERENIX_INTEGER_TYPES_MAP[ltyp];
};
/**
 * 
 * @param {String} ltyp  The lowercae type name
 * @returns {Boolean}
 */
TypeUtils.isStringType = function(ltyp) {
    return SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0;
};


var SERENIX_MAIN_INTEGER_TYPES = [
        "byte",
        "unsigned byte",
        "short",
        "unsigned short",
        "int",
        "long",
        "unsigned long",
        "long long",
        "unsigned long long",
        "uint",
        "ulong",
        "ubyte",
        "ushort",
        "int4",
        "uint4",
        "int8",
        "uint8",
        "int32",
        "uint32",
        "int16",
        "uint16",
        "int64",
        "uint64",
        "size"
    ];
var SERENIX_INTEGER_TYPES = [
        "byte",
        "signed byte",
        "unsigned byte",
        "short",
        "short int",
        "short integer",
        "signed short",
        "signed short int",
        "signed short integer",
        "unsigned short",
        "unsigned short int",
        "unsigned short integer",
        "int",
        "integer",
        "signed",
        "signed int",
        "signed integer",
        "unsigned",
        "unsigned int",
        "unsigned integer",
        "long",
        "long int",
        "long integer",
        "signed long",
        "signed long int",
        "unsigned long",
        "unsigned long int",
        "long long",
        "long long int",
        "signed long long",
        "signed long long int",
        "unsigned long long",
        "unsigned long long int",
        //"number",
        //"numeric",
        //"decimal",
        "uint",
        "ulong",
        "ubyte",
        "ushort",
        "int4",
        "int8",
        "uint32",
        "uint16",
        "uint64",
        "size"
    ];

var SERENIX_FLOATING_POINT_TYPES = [
    "float",
    "double",
    "long double",
    "signed long double",
    "unsigned long double",
    "signed float",
    "unsigned float",
    "signed double",
    "unsigned double",
    "number",
    "numeric",
    "decimal",
    "udouble",
    "uldouble",
    "ufloat"
];


var SERENIX_INTEGER_TYPES_MAP = {};

var SERENIX_FLOATING_POINT_TYPES_MAP = {};
(function() {
    var k, v;
    for (var i = 0, n = SERENIX_INTEGER_TYPES.length; i < n; i++) {
        k = SERENIX_INTEGER_TYPES[i];
        v = SERENIX_NUMBER_TYPES_MAP[k];
        if (v) {
            SERENIX_INTEGER_TYPES_MAP[k] = v;
        }
    }
    
    for (var i = 0, n = SERENIX_FLOATING_POINT_TYPES.length; i < n; i++) {
        k = SERENIX_FLOATING_POINT_TYPES[i];
        v = SERENIX_NUMBER_TYPES_MAP[k];
        if (v) {
            SERENIX_FLOATING_POINT_TYPES_MAP[k] = v;
        }
    }
})();
/**
 * 
 * @type Array
 */
var SERENIX_STRING_TYPE_NAMES = [ 
    'string',
    'text',
    'password',
    'email',
    'rfc822_email',
    'es6_email',
    'js_email',
    'tld',
    'tel',
    'telephon',
    'url',
    'uri',
    'urn',
    'path',
    'filename',
    'propertyname',
    'namespace'
];


var SERENIX__TYPE_REGEXPS = {
    "email": "",
    "tel": new RegExp("^(?:(?:(?:00[ ]*|\\+)(\\d{1, 4}))|(?:\\((\\d{1, 4})\\)))[ ]*(?:(\\d{7,12})|(\\d[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?)|(\\d{3}[ -.]?\\d{3}[ -.]?\\d{3}[ -.]?)|(\\d[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?\\d{2}[ -.]?)|(\\d{3}[ -]\\d{4}))$"),
    "url": "",
    "uri": "",
    "name": "",
    "namepace": ""
};


//========================================================================
//------------------------         Class : Type       --------------------
//========================================================================

/**
 * 
 * @class Namespace node (NSNode)
 * @returns {NSNode}
 */
function NSNode() {}

NSNode.__CLASS__ = NSNode;

NSNode.__CLASS_NAME__ = "NSNode";
/**
 * 
 * @class SereniX.types.Type
 * @abstract
 */
defineClass(
    'SereniX.types.Type', //class name
    function Type() {}, //constructor
    NSNode, // super class
    {
        getName: function() {
            return this.__name_||"";
        },
        setName : function(name) {
            if (typeof name === 'undefined') {
                throw new Error("Undefined name");
            }
            if (name === null) {
                throw new Error("Null name");
            }
            if (name instanceof String) {
                name = name.valueOf();
            }
            if (typeof name !== 'string') {
                throw new Error("Expected string argument");
            }
            this.__name_ = name;
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isList: function() {
            return false;
        },
        /**
         * 
         * @param {type} obj
         * @returns {Boolean}
         */
        is : function(obj) {
            throw "Abtract method call";
        },
        /**
         * 
         * @returns {Boolean}
         */
        isSized: function() {
            return false;
        }
    }
);
/**
 * 
 * @param {type} type
 * @returns {String|Function|SereniX.types.Type|SereniX.types.SType|SereniX.types.Intersect|SereniX.types.Set|SereniX.types.Union|SereniX.types.Minus|SereniX.types.Interval|SereniX.types.Enum}
 */
SereniX.types.Type.getInstance=function(type) {
    if (arguments.length === 0) {
        throw new Error("Argument expected");
    }
    if (!type || type === 'any') {
        return SereniX.types.AnyType.getInstance();
    }
    if (typeof type === 'string') {
        var ltyp = type.toLowerCase();
        if (["number", "string", "boolean", "date", "datetime", "time", "function", "object"].indexOf(ltyp) >= 0) {
            return ltyp;
        }
        if (SERENIX_NUMBER_TYPES.indexOf(ltyp) >= 0 || SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0) {
            return ltyp;
        }
        if (["any", "anytype", "any-type"].indexOf(ltyp) >= 0) {
            return SereniX.types.AnyType.getInstance();
        }
        if (ltyp === '*' || ltyp === '+' || ltyp === '?' || ltyp === '#') {
            return SereniX.types.WildcardType.getInstance(ltyp);
        }
        try {
            return SereniX.Klass.forname(type);
        } catch (ex) {}
        try {
            return SereniX.types.Type.forname(type);
        } catch (ex) {}
    } else if (typeof type === 'function') {
        return type;
    } else if (type instanceof  SereniX.types.Type) {
        return type;
    } else if (typeof type === 'object') {
        var otype = type.dataType||type.datatype||type.DataType||type.Datatype||type.type||type.Type;
        if (otype === '*' || otype === '+' || otype === '?' || otype === '#') {
            return SereniX.types.WildcardType.getInstance(otype);
        }
        if (otype === 'union' || otype === '+' || otype === 'sum' || otype === 'add' || otype === 'u') {
            return new SereniX.types.Union(type);
        }        
        if (otype === 'intersect' || otype === 'intersection' || otype === 'inter' || otype === 'i') {
            return new SereniX.types.Intersect(type);
        }
        if (otype === 'minus' || otype === 'difference' || otype === 'diff' || otype === 'substract' || otype === 's' || otype === '-') {
            return new SereniX.types.Minus(type);
        }
        if (otype === 'enum' || otype === 'enumeration') {
            return new SereniX.types.Enum(type);
        }
        if (otype === 'interval' || otype === 'range') {
            return new SereniX.types.Interval(type);
        }
        if (otype === 'set' || otype === 'tokens') {
            return new SereniX.types.Set(type);
        }
        var ltyp = otype.toLowerCase();
        var keys = Object.keys(type);
        if (keys.length === 1) {
            return ltyp;
        }
        if ((SERENIX_NUMBER_TYPES.indexOf(ltyp) >= 0 
                || SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0 
                || ltyp === 'function') && !TypeUtils.isSTypeDef(type)) {
            return ltyp;
        }
        try {
            var c = SereniX.Klass.forname(otype);
            if (!TypeUtils.isSTypeDef(type)) {
                return c;
            }
            otype.type = c;
        } catch (ex) {}
        try {
            var t = SereniX.types.Type.forname(otype);
            if (!TypeUtils.isSTypeDef(type)) {
                return t;
            }
            otype.type = t;
        } catch (ex) {}
        
        return new SereniX.types.SType(otype);
    }
};
/**
 * 
 * @param {type} type
 * @param {type} ignoreCase
 * @returns {Boolean}
 */
SereniX.types.Type.isFloatingPointType = function(type, ignoreCase) {    
    return SERENIX_FLOATING_POINT_TYPES.indexOf(arguments.length > 1 && ignoreCase ? 
            type.toLowerCase() : type) >= 0;
};

/**
 * <ul>
 * <li>For argument type of type string that is an known type (javascript 
 * primitive type name or primitive type derivation) or that has an 
 * existing/defined type of class with name equals to the value of the argument, 
 * returns the equivalent class or type.</li>
 * <li>For  argument type of type string that is an unknown type and the global 
 * variable <b>SereniX_deferrableStringTypeConversion</b> value is 
 * <b color="blue">false</b>, an exception is thrown.</li>
 * <li>Argument that is a class (function) or an instance of SereniX.types.Type 
 * is returned identically.</li>
 * </ul>
 * @param {String|Function|SereniX.types.Type|Object} type Type of name of a type.
 * @returns {String|Function|SereniX.types.Type}
 */
SereniX.types.Type.normalizeType = function(type) {
    if (typeof type === 'undefined' || type === null || type === '') {
        return SereniX.types.AnyType.getInstance();
    }
    var t;
    if ((type instanceof SereniX.types.Type) || (typeof type === 'function')) {
        t = type;
    } else if (isPlainObject(type) ) {
        t = SereniX.types.Type.getInstance(type);
    } else if (typeof type === 'string') {
        try {
            t = SereniX.Klass.forname(type);
        }catch (e) {
            try {
                t = SereniX.types.Type.forname(type);
            }catch (e2) {}
        }
        if (!t) {
            var ltyp = type.toLowerCase();
            if (['string', 'number', 'boolean', 'function', 'undefined'].indexOf(ltyp) >= 0
                || (SERENIX_NUMBER_TYPES.indexOf(ltyp) >= 0)
                || (SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0)) {
                t = ltyp;
            } else if (["any", "anytype", "any-type"].indexOf(ltyp) >= 0) {
                t = SereniX.types.AnyType.getInstance();
            } else if (ltyp === '*' || ltyp === '+' || ltyp === '?' || ltyp === '#') {
                return SereniX.types.WildcardType.getInstance(ltyp);
            } else {
                t = globalNS[type];                
                if (!(typeof t === 'function' || t instanceof SereniX.types.Type)) {
                    if (!SereniX_deferrableStringTypeConversion) {
                        if (/[ \t]/.test(type)) {
                            throw new Error("Unknown type: '" + type + "'");
                        }
                    }
                }
            }
            return t||type;
        }
    } else {
        throw new Error("Incorrect type");
    }
    return t;
};
/**
 * <p>Returns true when the type of the given object or value corresponds to the 
 * given type or the given object is an instanceof of the given type (class). 
 * Otherwise, returns false.</p>
 * @param {Number|String|Boolean|Function|Object} obj  Object or value to check 
 *         the type or instanceof if the given object is not of primitive type.
 * @param {String|Function|Array|Object} type
 * <ul>
 * <li>String: primitive type ('<b color="blue">number</b>', '<b color="blue">boolean</b>', '<b color="blue">string</b>') or class name.</li>
 * <li>Function: </li>
 * <li>Array: </li>
 * <li>Object: Valid type must have field names
 * <ul>
 * <li>'type' or 'Type'</li>
 * <li> and 'types', 'Types', 'sets' or 'Sets'</li>
 * </ul>
 * </li>
 * </ul>
 * @returns {Boolean}
 * @throws {Error} When type argument is incorrect
 */
SereniX.types.Type.is = function(obj, type) {
    if (type instanceof SereniX.types.Type) {
        return type.is(obj);
    }
    if (['boolean', 'number'].indexOf(typeof type) >= 0) {
        throw new Error("Incorrect type argument. Found: " + type);
    }
    
    if (!type) {
        throw new Error("Incorrect type argument: empty  string, undefined or null");
    }
    if (type === 'object' || type === 'Object') {
        return isPlainObject(obj);
    }
    if (typeof type === 'function') {
        if (type === Number) {
            if (typeof obj === 'number') {
                return true;
            }
        } else if (type === String ) {
            if (typeof obj === 'string') {
                return true;
            }
        } else  if (type === Boolean ) {
            if (typeof obj === 'boolean') {
                return true;
            }
        } else  if (type === Array ) {
            return isArray(obj);
        }/* else  if (type === Function ) {
            if (typeof obj === 'boolean') {
                return true;
            }
        }*/
        return obj instanceof type;
    }
    if (isArray(type)) {
        return SereniX.types.Union.is(obj, type);
    }
    if (typeof type === 'object') {
        var t = (type.type||type.Type||"").toLowerCase();
        if (['union', '+', 'u', 'add', 'sum' ].indexOf(t) >= 0) {
            return SereniX.types.Union.is(obj, type.types);
        }
        if (['intersect', 'inter', 'i' ].indexOf(t) >= 0) {
            return SereniX.types.Intersect.is(obj, type.types);                
        }

        if (['minus', 'diff', 'difference', 'substract', '-', 'm' ].indexOf(t) >= 0) {
            return SereniX.types.Minus.is(obj, type.types);                
        }
        throw new Error("Incorrect type: type is an invalid object");
    }

    if (typeof type !== 'string') {
        throw new Error("Incorrect type: type is an object");
    }
    try {
        return obj instanceof SereniX.Klass.forname(type);
    } catch (ex) {}
    try {
        return SereniX.types.Type.forname(type).is(obj);
    } catch (ex) {}
    var ltyp = type.toLowerCase();
    var ranges = SERENIX_NUMBER_TYPE_INTERVALS[ltyp];
    if (!ranges) {
        ranges = SERENIX_NUMBER_TYPE_INTERVALS[SERENIX_NUMBER_TYPES_MAP[ltyp]];
    }
    if (ranges) {
        if (typeof obj !== 'number') {
            return false;
        }
        return ranges.min <= obj && obj <= ranges.max;
    }
    if (SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0) {
        if (typeof obj !== 'string') {
            return false;
        }
        return SereniX.types.String.isTypeOf(obj, type);
    }
    if (ltyp === 'array') {
        return isArray(obj);
    }
    if (['string', 'boolean', 'number', 'object', 'function'].indexOf(ltyp)  >= 0) {
        return typeof obj === ltyp;
    }
    if (ltyp === 'object') {
        return isPlainObject(obj);
    }
    if (['any', 'anytype', 'any-type' ].indexOf(ltyp)  >= 0) {
        return true;
    }
    if (ltyp === 'null') {
        return obj === null;
    }
    if (ltyp === 'undefined') {
        return typeof obj === 'undefined';
    }
    if ([ 'date', 'time', 'datetime'].indexOf(ltyp) >= 0) {
        return obj instanceof Date;
    }
    throw new Error("Unknown type: '" + type + "'");
};
/**
 * <p>Returns true when the type of the given object or value corresponds to the 
 * given type or the given object is an instanceof of the given type (class). 
 * Otherwise, returns false.</p>
 * <p><b>This function is an alias of SereniX.types.Type.is function.</b></p>
 * @param {Number|String|Boolean|Function|Object} obj  Object or value to check 
 *         the type or instanceof if the given object is not of primitive type.
 * @param {String|Function|Array|Object} type
 * @returns {Boolean}
 * @see SereniX.types.Type.is
 */
SereniX.types.is = SereniX.types.Type.is;
/**
 * Defines a type in a namepace
 * @param {String} name
 * @param {SereniX.types.Type} type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.define = function(name, type) {
    var t = SereniX.types;
    if (!t.TypeUtils.isValidTypeName(name)) {
        throw new Error("Invalid type name: '" + name + "'");
    }
    if (!(type instanceof t.Type)) {
        throw new Error("Invalid type argument: it should be an instance of SereniX.types.Type class.");
    }
    var i = name.lastIndexOf(".");
    if (i > 0) {
        var ns = t.Namespace.ns(name.substring(0, i));
        ns[name.substring(i + 1)] = type;
    } else {
        globalNS[name] = type;
    }
    return type;
};
/**
 * Returns the defined type correponding to the given name.
 * @param {String} name  The name to get the type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.forname=function(name) {
    var i = name.lastIndexOf("."), type;
    if (i > 0) {
        var tokens = name.split('.'), own = globalNS;
        for (var i = 0, n = tokens.length; i < n; i++) {
            own = own[tokens[i]];
            if (!own) {
                var ns = "";
                for (var k = 0; k <= i; k++) {
                    if (k > 0) {
                        ns += ".";
                    }
                    ns += tokens[k];
                }
                if (k < n - 1) {
                    if (!own) throw new Error("The namespace " + ns + " does not exist.");
                } else {
                    if (!own) throw new Error("No type found: " + name);
                    if (!(own instanceof SereniX.types.Type)) {
                        throw new Error(name + " is not an instance of SereniX.types.Type");
                    }
                    type = own;
                }
            }
        }
    } else {
        type = globalNS[name];
        if (!type) {
            throw new Error("No type found: " + name);
        }
    }
    return type;
};
/**
 * Returns the defined type correponding to the given name.
 * @param {String} name  The name to get the type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.forName = SereniX.types.Type.forname;
/**
 * Returns the defined type correponding to the given name.
 * @param {String} name  The name to get the type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.fromname = SereniX.types.Type.forname;
/**
 * Returns the defined type correponding to the given name.
 * @param {String} name  The name to get the type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.fromName = SereniX.types.Type.forname;
/**
 * 
 * <p>An alias of SereniX.types.Type.define()method.
 * @param {String} name
 * @param {SereniX.types.Type} type
 * @returns {SereniX.types.Type}
 */
SereniX.types.Type.def = SereniX.types.Type.define;
/**
 * 
 * <p>An alias of SereniX.types.Type.define()method.
 * @param {String} name
 * @param {SereniX.types.Type} type
 * @returns {SereniX.types.Type}
 */
SereniX.types.typedef = SereniX.types.Type.define;
/**
 * 
 * <p>An alias of SereniX.types.Type.define()method.
 * @param {String} name
 * @param {SereniX.types.Type} type
 * @returns {SereniX.types.Type}
 */
var $typedef = SereniX.types.Type.define;
/**
 * 
 * <p>An alias of SereniX.types.Type.define()method.
 * @param {String} name
 * @param {SereniX.types.Type} type
 * @returns {SereniX.types.Type}
 */
var typedef = SereniX.types.Type.define;
/**
 * <p>Returns true when the type of the given object or value corresponds to the 
 * given type or the given object is an instanceof of the given type (class). 
 * Otherwise, returns false.</p>
 * <p><b>This function is an alias of SereniX.types.Type.is function.</b></p>
 * @param {Number|String|Boolean|Function|Object} obj  Object or value to check 
 *         the type or instanceof if the given object is not of primitive type.
 * @param {String|Function|Array|Object} type
 * @returns {Boolean}
 * @see SereniX.types.Type.is
 */
var $is = SereniX.types.Type.is;


//========================================================================
//------------------------        Class : AnyType     --------------------
//========================================================================

/**
 * 
 * @class SereniX.types.AnyType
 */
extObj(
defineClass(
    'SereniX.types.AnyType',
    
    function AnyType() {
        this._name = 'any';
    },
        
    SereniX.types.Type, 
    {
        /**
         * 
         * @returns {String}
         */
        getName : function() {
            return "any";
        },       
        /**
         * 
         * @param {String} name
         * @returns {SereniX.types.WildcardType}
         */
        setName : function(name) {
            return this;
        },
         /**
         * 
         * @param {type} obj
         * @returns {Boolean}
         */
        is: function(obj) {
            return true;
        }
    }
),
{
    getInstance:function(symbol) {
        if (!this.$$___INSTANCE__) {
            this.$$___INSTANCE__ = new SereniX.types.AnyType();
            var desc = {value: this.$$___INSTANCE__, writable: false};
            Object.defineProperty(this, "ANY", desc);
            Object.defineProperty(this, "ANY_TYPE", desc);
            Object.defineProperty(SereniX, "ANY_TYPE", desc);
        }
        return this.$$___INSTANCE__;
    }
});



// Sets/Initialize  SereniX.types.AnyType.ANY and SereniX.types.AnyType.ANY_TYPE
SereniX.types.AnyType.getInstance();

Object.defineProperties(SereniX.types.AnyType.prototype, {
    name: { get: SereniX.types.AnyType.prototype.getName, set: SereniX.types.AnyType.prototype.setName }
});

/**
 * 
 * @class SereniX.types.WildcardType
 */
// creates class with static methods
extObj(defineClass(
    'SereniX.types.WildcardType',
    
    /**
     * 
     * @param {String} symbol
     * @returns {WildcardType}
     * @constructor 
     */
    function WildcardType(symbol) {
        if (typeof symbol === "string") {
            this._symbol = symbol;
        }
    },
    SereniX.types.Type,
    {
        /**
         * 
         * @returns {String}
         */
        getName : function() {
            return "";
        },
        /**
         * 
         * @param {String} name
         * @returns {SereniX.types.WildcardType}
         */
        setName : function(name) {
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getSymbol : function() {
            return this._symbol;
        },
        /**
         * 
         * @param {String} symbol
         * @returns {SereniX.types.WildcardType}
         */
        setSymbol : function(symbol) {
            if( ['*', '+', '?', '#'].indexOf(this._symbol) >= 0) {
                throw "Non updatable property";
            }
            this._symbol  = symbol;
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isOneOrMany:function() {
            return this._symbol === '+';
        },
        /**
         * 
         * @returns {Boolean}
         */
        isZeroOrMany:function() {
            return this._symbol === '*';
        },
        /**
         * 
         * @returns {Boolean}
         */
        isList:function() {
            return this._symbol === '*' || this._symbol === '+';
        },
        
        /**
         * 
         * @returns {Boolean}
         */
        isMultiple:function() {
            return this._symbol === '*' || this._symbol === '+';
        },
        /**
         * 
         * @returns {Boolean}
         */
        isZeroOrOne:function() {
            return this._symbol === '?';
        },
        /**
         * 
         * @param {type} obj
         * @returns {Boolean}
         */
        is: function (obj) {
            return SereniX.types.WildcardType.checkSType(obj, this.getSymbol());
        }
    }
    ),
   {
            getInstance:function(symbol) {
                var i = this.INSTANCES[symbol];
                if (i) return i;
                throw "[SereniX.types.WildcardType] : Incorrect symbol: '" + symbol + "'";
            },
            is: function(obj, type) {
                var symbol, t = t=typeof type;
                if (t === 'object') {
                    symbol = typeof t.getSymbol === 'function'? t.getSymbol() : t.symbol;
                    if (!symbol) {
                        return false;
                    }
                } else if (t === 'string') {
                    symbol =  type;
                } else {
                    return false;
                }
                return this.checkStringType(obj, symbol);
            },
            /**
             * Check
             * @param {type} obj    The object to check the type
             * @param {String} stype  The string type to check the object
             * @returns {Boolean}
             */
            checkSType:function(obj, stype) {
                switch (stype) {
                    case '*':
                        return isArray(obj);
                    case '+':
                        return isArray(obj) && obj.length > 0;
                    case '#':
                        return !isArray(obj) && (obj !== null) && (typeof obj === 'undefined');
                    case '?':
                        return !isArray(obj);
                    default:
                        throw "Incorrect wildcard stype stype: '" + stype + "'";
                }
            }
        }
); 

SereniX.types.WildcardType.INSTANCES = {
    '*' : new SereniX.types.WildcardType('*'),
    '+' : new SereniX.types.WildcardType('+'),
    '?' : new SereniX.types.WildcardType('?'),
    '#' : new SereniX.types.WildcardType('#')
};

Object.defineProperties(SereniX.types.WildcardType.prototype, {
    name: { get: SereniX.types.WildcardType.prototype.getName, set: SereniX.types.WildcardType.prototype.setName },
    symbol: { get: SereniX.types.WildcardType.prototype.getSymbol, set: SereniX.types.WildcardType.prototype.setSymbol }
});

/**
 * <h3>Sized Type class</h3>
 * 
 * @class SereniX.types.SType
 */
defineClass(
    'SereniX.types.SType',
    /**
     * 
     * @param {type} o
     * @constructor
     */
    function SType(o) {
        if (isPlainObject(o)) {
            this.setDataType(o.dataType||o.datatype||o.DataType||o.Datatype||o.type||o.Type);
            var K = SereniX.types.TypeUtils;
            this.setSize(K.getSize(o));
            this.setPrecision(K.getPrecision(o));
            this.setScale(K.getScale(o));
            this.setMinLength(K.getMinLength(o));
            this.setMaxLength(K.getMaxLength(o));            
        }  else if (arguments.length > 5) {
            this.setDataType(arguments[0]);
            this.setSize(arguments[1]);
            this.setPrecision(arguments[2]);
            this.setScale(arguments[3]);
            this.setMinLength(arguments[4]);
            this.setMaxLength(arguments[5]); 
        } else if (arguments.length === 5) {
            this.setDataType(arguments[0]);
            this.setSize(arguments[1]);
            this.setPrecision(arguments[2]);
            this.setMinLength(arguments[3]);
            this.setMaxLength(arguments[4]);
        }
    },
    SereniX.types.Type,
    {
        getDataType : function() {
            return this.__dataType_;
        },
        /**
         * 
         * @param {type} dt
         * @returns {SereniX.types.SType}
         */
        setDataType: function(dt) {
            if (typeof dt === 'function' || dt instanceof SereniX.types.Type) {
                this.__dataType_ = dt;
            } else {
                this.__dataType_ = SereniX.types.Type.getInstance(dt);
            }
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getSize : function() {
            return this.__size_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.SType}
         */
        setSize: function(s) {
            this.__size_ = s;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getPrecision : function() {
            return this.__precision_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.SType}
         */
        setPrecision: function(s) {
            this.__precision_ = s;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getScale : function() {
            return this.__scale_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.SType}
         */
        setScale: function(s) {
            this.__scale_ = s;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getMinLength : function() {
            return this.__minLength_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.SType}
         */
        setMinLength: function(s) {
            this.__minLength_ = s;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getMaxLength : function() {
            return this.__maxLength_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.SType}
         */
        setMaxLength: function(s) {
            this.__maxLength_ = s;
            return this;
        },
        /**
         * 
         * @param {type} obj
         * @returns {Boolean}
         */
        is: function(obj) {
            var dt = this.getDataType(), o = obj;
            if (dt === String || dt === 'String' || dt === 'string') {
                dt = 'string';
                if (o instanceof String) {
                    o = o.valueOf();
                }
            } else if (dt === Number || dt === 'Number' || dt === 'number') {
                dt = 'number';
                if (o instanceof Number) {
                    o = o.valueOf();
                }
            } else if (dt === Boolean || dt === 'Boolean' || dt === 'boolean' || dt === 'Bool' || dt === 'bool') {
                return true;
            } else if (dt === Function || dt === 'Function' || dt === 'function') {
                dt = 'function';
            }
            if (dt instanceof SereniX.types.Type) {
                if (!dt.is(o)) {
                    return false;
                }
            }
            if (!SereniX.types.TypeUtils.isTypeOf(o, dt)) {
                return false;
            }
            
            if (SERENIX_INTEGER_TYPES.indexOf(dt) >= 0) {
                o = o.toString();
                var n = o.length;
                if (o[0] === '+' || o[0] === '-') {
                    n--;
                }
                var s = this.getSize();
                if (typeof s !== 'undefined' && s !== null &&  n > s) {
                    return false;
                }
                if ( (o.indexOf(".") > 0) || (n > this.getSize())) {
                    return false;
                }
            } else if (SERENIX_FLOATING_POINT_TYPES.indexOf(dt) >= 0) {
                o = o.toString();
                var n = o.length;
                if (o[0] === '+' || o[0] === '-') {
                    n--;
                }
                var i = o.indexOf('.');
                if (i > 0) {
                    n--;
                }
                var s = this.getSize();
                if (typeof s !== 'undefined' && s !== null &&  n > s) {
                    return false;
                }
                s = this.getPrecision();
                if (typeof s !== 'undefined' && s !== null &&  (o.length - i - 1) > s) {
                    return false;
                }
            } else if (SERENIX_STRING_TYPE_NAMES.indexOf(dt) >= 0) {
                if (o instanceof String) {
                    o = o.valueOf();
                }
                if (typeof o !== 'string') {
                    return false;
                }
                var s = this.getSize(), n = o.length;
                if (typeof s !== 'undefined' && s !== null &&  n !== s) {
                    return false;
                }
                s = this.getMinLength();
                if (typeof s !== 'undefined' && s !== null &&  n < s) {
                    return false;
                }
                
                s = this.getMaxLength();
                if (typeof s !== 'undefined' && s !== null &&  n > s) {
                    return false;
                }
            }
            
            //TODO
            
            return true;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isSized: function() {
            return true;
        }
    }
);

defineProperties(SereniX.types.SType.prototype, [ 'dataType', 'size', 'precision', 'scale', 'minLength', 'maxLength' ]);


defineClass(
    //class full name
    'SereniX.types.ArrayType',
    /**
     * 
     * @param {String} type  The type that is refered to
     * @constructor
     */
    function ArrayType(type) {
        this.setType(type);
    }, 
    // the super class
    SereniX.types.Type,
    //instance methods
    {
        /**
         * 
         * @returns {String} 
         */
        getType: function() {
            return 'Array';
        },
        /**
         * Sets the reference type
         * @param {String} type
         * @returns {SereniX.types.ArrayType} 
         */
        setType : function(type) {
            this.__type_ = 'Array';
            return this;
        },
        /**
         * 
         * @returns {String} 
         */
        getItemType: function() {
            return this.__itemType_;
        },
        /**
         * Sets the item type
         * @param {String} itemType
         * @returns {SereniX.types.ArrayType} 
         */
        setItemType : function(itemType) {
            this.__itemType_ = itemType;
            return this;
        },
        /**
         * Returns true if the given object or value is an instance of or a 
         * type of the reference class or type.
         * @param {type} obj  Object or value to check type
         * @returns {Boolean}
         */
        is : function(obj) {
            if (!isArray(obj)) return false;
            var typ;
            if (typ = this.__itemType_) {
                var TypeUtils = SereniX.types.TypeUtils;
                for (var i = 0, n = obj.length; i < n; i++) {
                    if (!TypeUtils.isTypeOf(obj[i], type))
                        return false;
                }
            }
            return true;
        }
    }
);
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.ArrayType.prototype.is
 * @see SereniX.types.ArrayType.prototype.is
 */
SereniX.types.ArrayType.prototype.isTypeOf = SereniX.types.ArrayType.prototype.is;
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.ArrayType.prototype.is
 * @see SereniX.types.ArrayType.prototype.is
 */
SereniX.types.ArrayType.prototype.accept = SereniX.types.ArrayType.prototype.is;

defineClass(
    //class full name
    'SereniX.types.RefType',
    /**
     * 
     * @param {String} type  The type that is refered to
     * @constructor
     */
    function RefType(type) {
        this.setType(type);
    }, 
    // the super class
    SereniX.types.Type,
    //instance methods
    {
        /**
         * 
         * @returns {String} 
         */
        getType: function() {
            return this.__type_;
        },
        /**
         * Sets the reference type
         * @param {String} type
         * @returns {SereniX.types.RefType} 
         */
        setType : function(type) {
            if (type instanceof String) {
                type = type.valueOf();
            }
            if (typeof type !== 'string') {
                throw new Error("String argument expected");
            }
            if (!type) {
                throw new Error("Empty string argument");
            }
            if (SereniX.types.Number.getNumberType(type) 
                    || type === 'function' || SereniX.types.Boolean.isTypeOf(type) 
                    || SereniX.types.String.isString(type)) {
                throw new Error("Type '" + type + "' can not be a reference");
            }
            this.__type_ = type;
            return this;
        },
        /**
         * Returns true if the given object or value is an instance of or a 
         * type of the reference class or type.
         * @param {type} obj  Object or value to check type
         * @returns {Boolean}
         */
        is : function(obj) {
            var T;
            try {
                T = SereniX.Klass.forname(this.__type_);
                return obj instanceof T;
            } catch (ex) {
                try {
                    T = Type.forname(this.__type_);
                    if (!T) {
                        throw new Error("Type not defined");
                    }
                    return T.is(obj);
                } catch (ex) {
                    throw new Error("Type not defined");
                }
            }
        }
    }
);
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.RefType.prototype.is
 * @see SereniX.types.RefType.prototype.is
 */
SereniX.types.RefType.prototype.isTypeOf = SereniX.types.RefType.prototype.is;
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.RefType.prototype.is
 * @see SereniX.types.RefType.prototype.is
 */
SereniX.types.RefType.prototype.accept = SereniX.types.RefType.prototype.is;


/**
 * <h3>Type (Class or Entity) Join class</h3>
 * 
 * <p>In the class or entity definition, the property it's for the 
 * class or entity where the join is define and the dual it's for the 
 * external/outer class or entity.</p>
 * @class SereniX.types.TypeJoin
 */
defineClass(
    'SereniX.types.TypeJoin', 
    /**
     * Constructs the type join.
     * @param {String|Function|Object} tObj The type (external class or entity) 
     *  or the join metadata/definition object having type 
     * @param {Object|Array&lt;String&gt;|String} [join]  The join/link definition.
     *  <p>When not specified, it's obtained in the join metadata/definition 
     *  object if needed</p>
     * @param {String|Array&lt;String&gt;} [dual="pair"]
     * @returns {TypeJoin}
     * @constructor
     */
    function TypeJoin(tObj, join, dual) {
        this.__join_ = {};
        var type;
        if (arguments.length === 0) {
            this.__type_ = null;
        } else {
            if (arguments.length === 1) {
                if (!isPlainObject(tObj)) {
                    throw new Error("Incorrect argument");
                }
                type = tObj.externalEntity||tObj.outerEntity||tObj.externalClass||tObj.outerClass||tObj.type||tObj.Type;
                join = tObj.join||tObj.mapping||tObj.link||tObj.Join||tObj.Mapping||tObj.Link;
                dual = tObj.dual||tObj.dualType||tObj.joinType||tObj.linkType||'pair';
            } else {
                type = tObj;
            }
            this.setType(type);
            this.put(join, dual);
        }
    }, 
    //no super class
    null, 
    {
        /**
         * Returns the dual/mapping of the given property.
         * <p>In the class or entity definition, the property it's for the 
         * class or entity where the join is define and the dual it's for the 
         * external/outer class or entity.</p>
         * <p><b>Note</b>: It's only from the (stored) property name to get the 
         * dual name, not from the dual name to the property name.</p>
         * @param {String} prop The property to get the dual/mapping
         * @returns {String}
         */
        dual: function(prop) {
            return this.__join_[prop];
        },
        /**
         * 
         * Adds one or many entries to the join/mapping
         * <h3>Syntax</h3>
         * <ul>
         * <li><b>put</b>(prop: String, dual:String) :
         * <p>Adds or replaces an entry to the join/mapping.</p></li>
         * <li><b>put</b>(prop: Object) :
         * <p> Adds and/or replaces entries to the join/mapping</p></li>
         * <li><b>put</b>(prop: Array&lt;String&gt;, dual:String) : 
         * <p>Adds and/or replaces entries to the join/mapping</p>
         * <p>Possible values of dual are:</p>
         * <ul>
         * <li>'pair': 
         * <p>The array represents pairs : the pair <b color="orange">i</b> is 
         * represented by element <b color="orange">2*i</b> for property and 
         * element <b color="orange">2*i + 1</b> for dual. The first pair
         * index  is <b color="orange">0</b>.</p>
         * </li>
         * <li>'auto', 'auto-join' or 'autojoin' : 
         * <p>Each element of the array represents a pair that have the same 
         * value for the property and for the dual.</p>
         * </li>
         * </ul>
         * </li>
         * <li><b>put</b>(prop: Array&lt;String&gt;, dual:Array&lt;String&gt;) :
         * <p>Adds and/or replaces entries to the join/mapping</p></li>
         * <li><b>put</b>(prop: Array&lt;String&gt;) :<p> adds and/or replaces entries 
         * to the join/mapping.</p> 
         * <p>The array represents pairs : the pair <b color="orange">i</b> is 
         * represented by element <b color="orange">2*i</b> for property and 
         * element <b color="orange">2*i + 1</b> for dual. The first pair
         * index  is <b color="orange">0</b>.</p></li>
         * </ul>
         * @param {String|Object|Array} prop Property or properties
         * @param {String|Array} dual  The type of the dual mapping or the duals of properties.
         * @returns {SereniX.types.TypeJoin}
         */
        put: function(prop, dual) {
            function setArray(arr, type, self) {
                var n = arr.length, i = 0;
                if (isArray(arr[0])) {
                    var link;
                    for (; i < n; i++) {
                        link = arr[i];
                        self.__join_[link[0]] = link[1];
                    }
                } else if (type === 'pair') {
                    var mod = (n%2), len = (n - mod)/2;
                    for (; i < len; i++) {
                        self.__join_[arr[2*i]] = arr[2*i + 1];
                    }
                    if (mod) {
                        self.__join_[arr[i = n - 1]] = arr[i];
                    }

                } else if (type === 'auto' || type === 'auto-join' || type === 'autojoin') {
                    var link;
                    for (; i < n; i++) {
                        self.__join_[link = arr[i]] = link;
                    }
                } else {
                    throw new Error("Incorrect array join definition ");
                }
            }
            
            if (isPlainObject(prop)) {
                var d;
                for (var p in prop) {
                    if (hasOwnProp(prop, p)) {
                        d = prop[p];
                        if (!d || typeof d !== 'string') {
                            throw new Error("Incorrect argument");
                        }
                        this.__join_[p] = d;
                    }
                }
            }
            else if (arguments.length === 1) {
                if (!prop) {
                    throw new Error("Incorrect argument");
                }
                if (prop instanceof String) {
                    prop = prop.valueOf();
                }
                if (isArray(prop)) {
                    setArray(prop, 'pair', this);                    
                } else if (typeof prop === 'string') {
                    this.__join_[prop] = prop;
                }
            } else if (isArray(prop)) {
                if (dual instanceof String) {
                    dual = dual.valueOf();
                }
                if (typeof dual === 'string') {
                    setArray(prop, dual, this);
                } else if (isArray(dual)) {
                    var p, d;
                    for (var i = 0, n = prop.length; i < n; i++) {
                        p = prop[i];
                        d = dual[i];
                        if (!p || typeof p !== 'string') {
                            throw new Error("Incorrect argument");
                        }
                        if (!d || typeof d !== 'string') {
                            throw new Error("Incorrect argument");
                        }
                        this.__join_[p] = d;
                    }
                }
            } else {
                if (!prop || !dual || typeof prop !== 'string' || typeof dual !== 'string') {
                    throw new Error("Incorrect arguments");
                }
                this.__join_[prop] = dual;
            }
            return this;
        },
        /**
         * 
         * @returns {SereniX.types.TypeJoin}
         */
        clear:function() {
            this.__join_ = {};
            return this;
        },
        /**
         * 
         * <p>When many entries (first arguments an array or a plain object), 
         * clears eisting entries and adds new entries to the join/mapping.</p>
         * <p>When only one entry adds or replaces entry to the join/mapping.</p> 
         * <h3>Syntax</h3>
         * <ul>
         * <li><b>set</b>(prop: String, dual:String) :
         * <p>Adds an entry to the join/mapping</p></li>
         * <li><b>set</b>(prop: Object) :
         * <p> Adds entries to the join/mapping</p></li>
         * <li><b>set</b>(prop: Array&lt;String&gt;, dual:String) : 
         * <p>Adds entries to the join/mapping</p></li>
         * <li><b>set</b>(prop: Array&lt;String&gt;, dual:Array&lt;String&gt;) :
         * <p>Adds entries to the join/mapping</p></li>
         * <li><b>set</b>(prop: Array&lt;String&gt;) :<p> adds and/or replaces entries 
         * to the join/mapping.</p> 
         * <p>The array represents pairs : the pair <b color="orange">i</b> is 
         * represented by element <b color="orange">2*i</b> for property and 
         * element <b color="orange">2*i + 1</b> for dual. The first pair
         * index  is <b color="orange">0</b>.</p></li>
         * </ul>
         * @param {String|Object|Array} prop
         * @param {String|Array} dual
         * @returns {SereniX.types.TypeJoin}
         */
        set: function(prop, dual) {
            if (isPlainObject(prop) || isArray(prop)) {
                this.clear();
            }
            this.put.apply(this, arguments);
            return this;
        }, 
        /**
         * Returns the property names of the join/mapping
         * @returns {Array}
         */
        getProperties : function() {
            return Object.keys(this.__join_);
        }
    }
);

Object.defineProperties(SereniX.types.TypeJoin.prototype, {
    properties : { 
        //Returns the property names of the join/mapping
        get: SereniX.types.TypeJoin.prototype.getProperties, 
        //Sets the the join/mapping
        set: SereniX.types.TypeJoin.prototype.set 
    }
});


/**
 * 
 * @alias SereniX.types.TypeJoin.prototype.dual
 * @see SereniX.types.TypeJoin.prototype.dual
 */
SereniX.types.TypeJoin.prototype.getReverse = SereniX.types.TypeJoin.prototype.dual;
/**
 * 
 * @alias SereniX.types.TypeJoin.prototype.dual
 * @see SereniX.types.TypeJoin.prototype.dual
 */
SereniX.types.TypeJoin.prototype.getDual = SereniX.types.TypeJoin.prototype.dual;
/**
 *
 * @type SereniX.types.TypeJoin.prototype.set|globalNS.SereniX.types.TypeJoin.prototype.set|Namespace@call;ns.TypeJoin.prototype.set <p>When many entries (first arguments an array or a plain object), 
 * clears eisting entries and adds new entries to the join/mapping.</p>
 * <p>When only one entry adds or replaces entry to the join/mapping.</p>
 * @alias SereniX.types.TypeJoin.prototype.set
 * @see SereniX.types.TypeJoin.prototype.set
 */
SereniX.types.TypeJoin.prototype.setProperties = SereniX.types.TypeJoin.prototype.set;
/**
 * 
 * Returns the property names of the join/mapping
 * @alias SereniX.types.TypeJoin.prototype.getProperties
 * @see SereniX.types.TypeJoin.prototype.getProperties
 */
SereniX.types.TypeJoin.prototype.props = SereniX.types.TypeJoin.prototype.getProperties;


defineClass(
    //class full name
    'SereniX.types.JoinType',
    /**
     * 
     * @param {String} type  The type that is refered to
     * @constructor
     */
    function JoinType(type) {
        if (arguments.length > 0) {
            this.setType(type.type||type.entity||type.class||type.Type||type.Entity||type.Class);
            this.setJoin(type.join||type.link||type.fields||type.mapping||type.links);
        }
    }, 
    // the super class
    SereniX.types.Type,
    //instance methods
    {
        /**
         * 
         * @returns {String} 
         */
        getType: function() {
            return this.__type_;
        },
        /**
         * Sets the reference type
         * @param {String} type
         * @returns {SereniX.types.JoinType} 
         */
        setType : function(type) {
            if (type instanceof String) {
                type = type.valueOf();
            }
            if (typeof type === 'string') {
                if (!type) {
                    throw new Error("Empty string argument");
                }
                if (SereniX.types.Number.getNumberType(type) 
                        || type === 'function' || SereniX.types.Boolean.isTypeOf(type) 
                        || SereniX.types.String.isString(type)) {
                    throw new Error("Type '" + type + "' can not be a reference");
                }
            } else if (typeof type !== 'function' && !(type instanceof Function)) {
                throw new Error("class/function  or string argument expected");
            }
            this.__type_ = type;
            return this;
        },
        
        /**
         * 
         * @returns {TypeJoin} 
         */
        getJoin: function() {
            return this.__join_;
        },
        
        setJoin: function(join) {
            this.__join_ = TypeJoin.getInstance(join);
            return this;
        },
        /**
         * Returns true if the given object or value is an instance of or a 
         * type of the reference class or type.
         * @param {type} obj  Object or value to check type
         * @returns {Boolean}
         */
        is : function(obj) {
            var T;
            try {
                T = SereniX.Klass.forname(this.__type_);
                return obj instanceof T;
            } catch (ex) {
                try {
                    T = Type.forname(this.__type_);
                    if (!T) {
                        throw new Error("Type not defined");
                    }
                    return T.is(obj);
                } catch (ex) {
                    throw new Error("Type not defined");
                }
            }
        }
    }
);
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.JoinType.prototype.is
 * @see SereniX.types.JoinType.prototype.is
 */
SereniX.types.JoinType.prototype.isTypeOf = SereniX.types.JoinType.prototype.is;
/**
 * Returns true if the given object or value is an instance of or a 
 * type of the reference class or type.
 * @alias SereniX.types.JoinType.prototype.is
 * @see SereniX.types.JoinType.prototype.is
 */
SereniX.types.JoinType.prototype.accept = SereniX.types.JoinType.prototype.is;

/**
 * 
 * @param {Object} type
 * @returns {ManyToManyJoinType}
 * @class
 */
defineClass(
    //class full name
    'SereniX.types.ManyToManyJoinType',
    /**
     * 
     * @param {String} type  The type that is refered to
     * @constructor
     */
    function ManyToManyJoinType(type) {
        if (arguments.length === 1) {
            var a = arguments[0];
            this.setType(a.type||a.entity||a.class||a.Type||a.Entity||a.Class);
            this.setJoin(a.join||a.link||a.fields||a.mapping||a.links);
            var v = a.occurences||a.cardinality;
            if (v)
                this.setOccurences(v);
            v = a.outerType||a.outerEntity||a.outerClass||a.outerType||a.outerEntity||a.outerClass;
            if (v)
                this.setOuterType(v);
            v = a.outerJoin||a.outerLink||a.outerFields||a.outerMapping||a.outerLinks;
            this.setOuterJoin(v);
            if (v)
                v = a.outerOccurences||a.outerCardinality;
            if (v)
                this.setOuterOccurences(v);
        } else if (arguments.length === 2) {
            var a = arguments[0], o = arguments[1];
            
            if (haqOwnprop(a,'type') || haqOwnprop(a,'class') || haqOwnprop(a,'entity')) {
                
                this.setType(a.type||a.entity||a.class||a.Type||a.Entity||a.Class);
                this.setJoin(a.join||a.link||a.fields||a.mapping||a.links);
                var v = a.occurences||a.cardinality;
                if (v)
                    this.setOccurences(v);
                
                this.setOuterType(o.type||o.entity||o.class||o.Type||o.Entity||o.Class);
                this.setOuterJoin(o.join||o.link||o.fields||o.mapping||o.links);
                var v = o.occurences||o.cardinality;
                if (v)
                    this.setOuterOccurences(v);
            } else {
                this.setType(a);
                this.setJoin(o);
            }            
        } else if (arguments.length === 4) {
            
            this.setType(arguments[0]);
            this.setJoin(arguments[1]);
            this.setOuterType(arguments[2]);
            this.setOuterJoin(arguments[3]);
            
        } else if (arguments.length > 5) {
            
            this.setType(arguments[0]);
            this.setJoin(arguments[1]);
            if (arguments[2])
                this.setOccurences(arguments[2]);
            this.setOuterType(arguments[3]);
            this.setOuterJoin(arguments[4]);
            if (arguments[5])
                this.setOuterOccurences(arguments[5]);
        }
    }, 
    // the super class
    SereniX.types.JoinType,
    //instance methods
    {
        setOccurences: function(occ) {
            this.__occurences_ = occ;
            return this;
        },
        getOccurences: function() {
            return this.__occurences_;
        },
        /**
         * 
         * @retOuterurns {String} 
         */
        getOuterType: function() {
            return this.__outerType_;
        },
        /**
         * Sets the reference type
         * @param {String} type
         * @returns {SereniX.types.JoinType} 
         */
        setOuterType : function(type) {
            if (type instanceof String) {
                type = type.valueOf();
            }
            if (typeof type === 'string') {
                if (!type) {
                    throw new Error("Empty string argument");
                }
                if (SereniX.types.Number.getNumberType(type) 
                        || type === 'function' || SereniX.types.Boolean.isTypeOf(type) 
                        || SereniX.types.String.isString(type)) {
                    throw new Error("Type '" + type + "' can not be a reference");
                }
            } else if (typeof type !== 'function' && !(type instanceof Function)) {
                throw new Error("class/function  or string argument expected");
            }
            this.__outerType_ = type;
            return this;
        },
        
        /**
         * 
         * @returns {TypeJoin} 
         */
        getOuterJoin: function() {
            return this.__outerJoin_;
        },
        
        setOuterJoin: function(join) {
            this.__outerJoin_ = TypeJoin.getInstance(join);
            return this;
        },
        setOuterOccurences: function(occ) {
            this.__outerOccurences_ = occ;
            return this;
        },
        getOuterOccurences: function() {
            return this.__outerOccurences_;
        }
    }
);

/**
 * 
 * @class SereniX.types.VType
 * @abstract
 */
extObj(defineClass(
    'SereniX.types.VType',
    //set the statics methods of the class and returns the constructor
    function VType() {}, 
    SereniX.types.Type,
    {
        /**
         * 
         * @returns {serenix_class_baseAnonym$127.methods.__dataType_}
         */
        getDataType:function() {
            return this.__dataType_;
        },
        /**
         * 
         * @param {String|Function|SereniX.types.Type} dt
         * @returns {SereniX.types.VType}
         */
        setDataType:function(dt) {
            if (typeof dt === 'function' || dt instanceof SereniX.types.Type) {
                this.__dataType_ = dt;
            } else {
                this.__dataType_ = SereniX.types.Type.getInstance(dt);
            }
            return this;
        },
        /**
         * 
         * @returns {Function}
         */
        getCompare:function() {
            return this.__compare_;
        },
        /**
         * 
         * @param {Object|Function} comp
         * @returns {SereniX.types.Interval}
         */
        setCompare: function(comp) {
            if (typeof comp === 'undefined' || comp === null) {
                this.__compare_ = this.$___compare___ = null;
            } else if (isPlainObject(comp)) {
                if (typeof comp.compare === 'function') {
                    function __compare__(o1, o2) {
                        return __compare__.compare.compare.apply(__compare__.compare, [01, o2]);
                    }
                    __compare__.compare = comp;
                    this.__compare_ = comp;
                    this.$___compare___ = __compare__;
                } else {
                    throw "Incorrect comparator";
                }                
            } else if (typeof comp === 'function') {
                this.__compare_ = this.$___compare___ = comp;
            } else {
                throw "Incorrect comparator";
            }
            
            return this;
        }
    }),
    {
        /**
         * 
         * @param {type} values
         * @returns {SereniX.types.Interval|SereniX.types.Enum|SereniX.types.Set}
         */
        getInstance: function(values) {
            var type = (values.setType||values.type||values.Type||"").toLowerCase(), K = SereniX.types.TypeUtils;
            if (!type) {
                if (typeof K.getMin(values) !== 'undefined' || typeof K.getMax(values) !== 'undefined') {
                    return new SereniX.types.Interval(values);
                }
                return new SereniX.types.Enum(values);
            }
            if (type === 'enum' || type === 'enumeration') {
                return new SereniX.types.Enum(values);
            }
            if (type === 'interval' || type === 'range' || type === 'between') {
                return new SereniX.types.Interval(values);
            }
            if (type === 'set' || type === 'tokens') {
                return new SereniX.types.Set(values);
            }
        }
    }
);
defineProperties(SereniX.types.VType.prototype, [
        "dataType", "compare"
    ]);
/**
 * 
 * @class SereniX.types.Enum
 */
defineClass(
    'SereniX.types.Enum', 
    /**
     * 
     * @param {type} s
     * @returns {Enum}
     */
    function Enum(s) {
            this.$$___initialized___ = false;
            if (s instanceof String) {
                s = s.valueOf();
            }
            if ((isPlainObject(s) || isArray(s)) && typeof arguments[1] === 'string' || arguments[1] instanceof String) {
                this.setValues(s);
                this.setName(arguments[1]);
            } else if ((isPlainObject(arguments[1]) || isArray(arguments[1])) && typeof s === 'string') {
                this.setValues(arguments[1]);
                this.setName(s);
            } else if (arguments.length > 1 ) {
                this.setValues([].splice.call(arguments));
            } else if (isPlainObject(s)) {
                var values = s.values||s.Values||s.items||s.Items||s.elements||s.Elements||s.tokens||s.Tokens;
                if (isArray(values) || isPlainObject(values)) {
                    this.setValues(values);
                    var c = s.compare||s.comparator;
                    if (typeof c === 'function') {
                        this.$___compare___ = c;
                    } else if (isPlainObject(c) && typeof c.compare === 'function') {
                        function __compare__(v1, v2) {
                            return __compare__.comparator.compare(v1, v2);
                        }
                        __compare__.comparator = c;
                        this.$___compare___ = __compare__;
                    }
                    var dt = s.dataType||s.datatype;
                    if (!dt) {
                        if (s.setType && s.type && s.type !== s.type) {
                            dt = s.type;
                        }
                    }
                    if (dt) {
                        this.setDataType(dt);
                    }
                } else {
                    this.setValues(s);
                }
                
            } else if (isArray(s)) { 
                this.setValues(s);
            }
            this.$$___initialized___ = arguments.length === 0 ? false : true;
    },
    SereniX.types.VType,
    {
        /**
         * 
         * @returns {String} 
         */
        getType:function() {
            return "enum";
        },
        /**
         * 
         * @returns {Array} 
         */
        getValues: function() {
            return this.$$___values___.slice();
        },
        /**
         * 
         * @param {type} values
         * @returns SereniX.types.Enum
         */
        setValues: function(values) {
            if (this.$$___initialized___) {
                throw new Error("It's not allowed to change the values of an enumeration");
            }
            if (isArray(values)) {
                var v;
                this.$$___values___ = [];
                for (var i = 0, n = values.length; i < n; i++) {
                    v = values[i];
                    if (this.$$___values___.indexOf(v) >= 0) {
                        throw new Error("The list of values is not distinct");
                    }
                    this.$$___values___[i] = v;
                }
            } else if (isPlainObject(values)) {
                var v, _values = [], set = function(v) { throw new Error("Read only property: unauthoried modification"); };
                for (var name in values) {
                    if(!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
                        throw new Error("Incorrect enumeration value name: '" + name + "'");
                    }
                    var fname = "$$___" + name + "___";
                    this[fname] = v = values[name];
                    function __get__() {
                        return this[__get__.fname];
                    }
                    __get__.fname = fname;
                    Object.defineProperty(this, name, { configurable: false, get: __get__, set: set });
                    _values[_values.length] = v;
                }
                this.$$___values___ = _values;
            } else {
                incorrectArg(); //throw "Incorrect argument";
            }
            
            this.$$___initialized___ = true;
            return this;
        },
        /**
         * 
         * @param {type} val
         * @returns {boolean}
         */
        is:function(val) {
            var c = this.$___compare___, values = this.$$___values___, v;
            if (c) {
                for (var i = 0, n = values.length; i < n; i++) {
                    if (c(v, val) === 0) {
                        return true;
                    }
                }
                return false;
            } else {
                return values.indexOf(val) >= 0;
            }
        }
    }
);


/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Enum.prototype.isTypeOf = SereniX.types.Enum.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Enum.prototype.isTypeof = SereniX.types.Enum.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Enum.prototype.accept = SereniX.types.Enum.prototype.is;

defineProperties(SereniX.types.Enum.prototype, [ "dataType", "values"]);






/**
 * 
 * @class SereniX.types.Set
 */
defineClass(
    'SereniX.types.Set',
    
    /**
     * 
     * @param {type} s
     * @returns {undefined}
     */
    function Set(s) {
        this.__delimiter_ = ' ';
        this.__dataType_ = 'string';
        this.__tokenType_ = 'string';
        if (arguments.length > 1 ) {
            this.setValues([].splice.call(arguments));
        } else if (isPlainObject(s)) {
            this.setValues(s.values||s.Values||s.tokens||s.Tokens);
            var delim = s.delimiter||s.delim||s.separator
                    ||s.Delimiter||s.Delim||s.Separator||' ';
            if (delim)
                this.setDelimiter(delim);
            if (s.tokenType) {
                this.setTokenType(s.tokenType);
            }
            var dt = s.dataType||s.datatype;
            if (!dt) {
                if (s.setType && s.type && s.type !== s.type) {
                    dt = s.type;
                }
            }
            if (dt) {
                this.setDataType(dt);
            }
        } else if (isArray(s)) { 
            this.setValues(s);
        }
    },
    SereniX.types.VType,
    
    {
        getDelimiter: function() {
            return this.__delimiter_;
        },
        /**
         * 
         * @param {String} delim
         * @returns {SereniX.types.Set}
         */
        setDelimiter: function(delim) {
            if (delim instanceof String) {
                delim = delim.valueOf();
            }
            if (typeof delim === 'undefined' || delim === null) {
                delim = null;
            } else if (typeof delim !== 'string') {
                throw new Error("Expected string argument");
            }
            this.__delimiter_ = delim;
            return this;
        },
        /**
         * 
         * @param {Array} values
         * @returns {SereniX.types.Set}
         */
        setValues: function(values) {
            if (!isArray(values)) {
                throw new Error("Expected array argument");
            }
            
            if (typeof this.__tokenType === 'undefined' 
                    || this.__tokenType === null 
                    || this.__tokenType === 'any' 
                    || this.__tokenType === '*') {
                this.__values_ = values.slice();
            }  else {
                this.__values_ = [];
                var tokenType = this.__tokenType;
                for (var i = 0, n = values.length, v; i < n; i++) {
                    v = values[i];
                    if (!TypeUtils.isTypeOf(v, tokenType)) {
                        throw new Error("Incorrect values");
                    }
                    this.__values_[i] = v;
                }
            }          
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getType:function() {
            return "set";
        },
        /**
         * 
         * @returns {SereniX.types.Type|String|Function}
         */
        getTokenType:function() {
            return this.__tokenType_;
        },
        /**
         * 
         * @param {String|Function|SereniX.types.Type} tokenType
         * @returns {undefined}
         */
        setTokenType:function(tokenType) {
            if (['string', 'function'].indexOf(typeof tokenType) < 0 & !(tokenType instanceof SereniX.types.Type)) {
                incorrectArg();
            }
            this.__tokenType_ = tokenType;
            return this;
        },
        /**
         * 
         * @param {type} value
         * @returns {Boolean}
         */
        is: function(value) {
            var values = this.getValues(), tokenType = this.getTokenType();
            if (typeof value === 'string') {
                var token, tokens = value.split(this.getDelimiter()||' ');
                for (var i = 0, n = tokens.length; i < n; i++) {
                    token = tokens[i];
                    if (tokenType && !SereniX.types.TypeUtils.isTypeOf(token, tokenType)) {
                        return false;
                    }
                    if (values.indexOf(token) < 0) {
                        return false;
                    }
                }
            } else if (isArray(value)) {
                var token;
                for (var i = 0, n = value.length; i < n; i++) {
                    token = value[i];
                    if (tokenType && !SereniX.types.TypeUtils.isTypeOf(token, tokenType)) {
                        return false;
                    }
                    if (values.indexOf(token) < 0) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        }
    }
);

defineProperties(SereniX.types.Set.prototype, [ "values", "delimiter", "tokenType", "dataType" ]);
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Set.prototype.isTypeOf = SereniX.types.Set.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Set.prototype.isTypeof = SereniX.types.Set.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Set.prototype.accept = SereniX.types.Set.prototype.is;
/**
 * 
 * @class SereniX.types.Interval
 */
defineClass(
    'SereniX.types.Interval',
    /**
     * 
     * @returns {undefined}
     */
    function Interval() {
        function setArray(a, self) {
            if (a.length === 2) {
                self.__min_ = a[0];
                self.__max_ = a[1];
            } else if (a.length > 2) {
                self.__min_ = a[0];
                self.__minInclude_ = typeof (v = a[1]) === 'undefined' ? true : toBool(v);
                self.__max_ = a[2];
                self.__maxInclude_ = a.length > 3 ? (typeof (v = a[3]) === 'undefined' ? true : toBool(v)) : true;
            }  else {
                self.__maxInclude_ = true;
                self.__minInclude_ = true;
            }
        }
        var K = SereniX.types.TypeUtils;
        var a,v;
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isPlainObject(a)) {
                this.__minInclude_ = typeof (v = K.getMinInclude(a)) === 'undefined' ? true : toBool(v);
                this.__maxInclude_ = typeof (v = K.getMaxInclude(a)) === 'undefined' ? true : toBool(v);
                this.__min_ = K.getMin(a);
                this.__max_ = K.getMax(a);
                this.setCompare(a.compare||a.comparator||a.comparater||a.comparison);                
            } else if (isArray(a)) {
                setArray(a);
            } else {
                throw new Error("Incorrect argument");
            }
        } else {
            setArray([].slice.call(arguments), this);
        }        
    },
    SereniX.types.VType,
    
    {   
        /**
         * 
         * @returns {type}
         */
        getMin : function() {
            return this.__min_;
        },
        /**
         * 
         * @param {type} min
         * @returns {SereniX.types.Interval}
         */
        setMin : function(min) {
            this.__min_ = min;
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isMinInclude : function() {
            return this.__minInclude_;
        },
        /**
         * 
         * @param {Boolean} minInclude
         * @returns {SereniX.types.Interval}
         */
        setMinInclude : function(include) {
            this.__minInclude_ = include;
            return this;
        },
        
        /**
         * 
         * @returns {type}
         */
        getMax : function() {
            return this.__max_;
        },
        /**
         * 
         * @param {type} max
         * @returns {SereniX.types.Interval}
         */
        setMax : function(max) {
            this.__max_ = max;
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isMaxInclude : function() {
            return this.__maxInclude_;
        },
        /**
         * 
         * @param {Boolean} maxInclude
         * @returns {SereniX.types.Interval}
         */
        setMaxInclude : function(include) {
            this.__maxInclude_ = include;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getType:function() {
            return "interval";
        },
        
        /**
         * 
         * @param {type} o
         * @returns {Boolean}
         */
        is:function(o) {
            var dt = this.getDataType();
            if (dt) {
                if (!SereniX.types.TypeUtils.isTypeOf(o, dt)) {
                    return false;
                }
            }
            var m = this.__min_, M = this.__max_, c = this.$___compare___;
            if (c) {
                var c1 = c(m, o),
                    c2 = c(M, o);
                return ((typeof m === 'undefined' || m === null) 
                            || (this.__minInclude_ ? c1 <= 0 : c1 < 0))  
                        && (typeof M === 'undefined' || M === null 
                            || (this.__maxInclude_ ? c2 >= 0 : c2 > 0));
            } else {
                if (m instanceof Date) {
                    m = m.getTime();
                }
                if (M instanceof Date) {
                    M = M.getTime();
                }
                if (o instanceof Date) {
                    o = o.getTime();
                }
                return ((typeof m === 'undefined' || m === null) 
                            || (this.__minInclude_ ? m <= o : m < o))  
                        && (typeof M === 'undefined' || M === null 
                            || (this.__maxInclude_ ? M >= o : M > o));
            }
        }
    }
);

defineProperties(SereniX.types.Interval.prototype, [ 
        "min", 
        "minInclude", 
        "max", 
        "maxInclude" 
          
    ]);


/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Interval.prototype.isTypeOf = SereniX.types.Interval.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Interval.prototype.isTypeof = SereniX.types.Interval.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Interval.prototype.accept = SereniX.types.Interval.prototype.is;




/**
 * 
 * @class SereniX.types.Types
 */
defineClass(
    //full class name
    'SereniX.types.Types',
    /**
     * 
     * @param {type} types
     * @returns {Types}
     * @constructor
     */
    function Types(types) {
        if (isArray(types)) {
            this.setTypes(types);
        } else if (isPlainObject(types)) {
            var _types = types.types||types.Types||types.elements||types.Elements;
            if (isArray(_types)) {
                this.setTypes(_types);
            } else {
                incorrectArg();
            }
        } else if (types) {
            incorrectArg();
        }
    },
    //super class
    SereniX.types.Type,
    //instance methods
    {
         /**
         * 
         * @returns {String}
         */
        getType:function() {
            throw "Abstract method call";
        },
        /**
         * Returns a copy of the types.
         * @returns {Array}
         */
        getTypes:function() {
            var types = [];
            var ts = this.__types_, n = ts.length;
            for (var i = 0; i < n; i++) {
                types[i] = ts[i];
            }
            return types;
        },
        /**
         * 
         * @param {type} action
         * @param {type} caller
         * @param {type} result
         * @returns {Arguments}
         */
        forEach:function(action, caller, result) {
            if (arguments.length === 1) {
                var f;
                if (typeof action === 'function') {
                    var types = this._types, n = types.length;
                    for (var i = 0; i < n; i++) {
                        action(types[i]);
                    }
                } else if (typeof action === 'object' && action 
                        && typeof (f = action.process||action.compute||action.exec||action.execute||action["do"]) === 'function') {
                    var types = this._types, n = types.length;
                    for (var i = 0; i < n; i++) {
                        f.apply(action, [types[i]]);
                    }
                }
            } else if (arguments.length === 2) {
                if (typeof action === 'function') {
                    var types = this._types, n = types.length;
                    for (var i = 0; i < n; i++) {
                        action.apply(caller, [types[i]]);
                    }
                }  else if (typeof action === 'object' && action 
                        && typeof (f = action.process||action.compute||action.exec||action.execute||action["do"]) === 'function') {
                    var types = this._types, n = types.length, 
                        result = arguments[1];
                    for (var i = 0; i < n; i++) {
                        f.apply(action, [types[i], result]);
                    }
                    return result;
                }
            } else if (arguments.length > 2) {
                var types = this._types, n = types.length;
                if (caller) {
                    for (var i = 0; i < n; i++) {
                        action.apply(caller, [types[i], result]);
                    }
                } else {
                    action(types[i], result);
                }
                return result;
            }
        },
        /**
         * 
         * @param {type} types
         * @returns {serenix_class_baseAnonym$110.methods}
         */
        setTypes:function(types) {
            if (arguments.length === 0) {
                throw "At leat one argument required";
            }
            if (arguments.length === 1 && !isArray(types)) {
                types = [arguments[0]];
            } else if (arguments.length > 1) {
                types = arguments;
            }
            this.__types_ = [];
            var n = types.length;
            for (var i = 0; i < n; i++) {
                this.add(types[i]);
            }
            return this;
        },
        add:function(type) {
            var typ = SereniX.types.Type.normalizeType(type);
            if (this.__types_.indexOf(typ) < 0) {
                this.__types_[this.__types_.length] = typ;
            }
            return this;
        },
        /**
         * 
         * @param {type} ndx
         * @param {type} type
         * @returns {undefined}
         */
        insert:function(ndx, type) {
            var typ = SereniX.types.Type.normalizeType(type);
            if (this.__types_.indexOf(typ) < 0) {
                this.__types_.splice(ndx, 0, typ);
            }
            return this;
        },
        /**
         * 
         * @param {type} t
         * @returns {SereniX.types.Types}
         */
        remove : function(t) {
            if (Number.isInteger(t)) {
                if (t >= 0 && this._types.length > t) {
                    var typ = this.__types_[t];
                    this.__types_.splice(t, 1);
                    return typ;
                }
                return undefined;
            } else {
                var i = this._types.indexOf(t);
                if (i < 0) {
                    throw "Not found";
                } else {
                    this.__types_.splice(t, 1);
                }
                return this;
            }
        },
        /**
         * 
         * @returns {Boolean}
         */
        isEmpty:function() {
            return this.__types_.length === 0;
        },
        /**
         * 
         * @returns {unsigned int}
         */
        size: function() {
            return this.__types_.length;
        },
        /**
         * 
         * @param {type} index
         * @returns {Array}
         */
        get: function(index) {
            if (index < 0 || index > this.__types_.length ) {
                throw new Error("Index out of bounds");
            }
            return this.__types_[index];
        }
    }
);
/*properties : {
        types : {type: "Array<SereniX.types.Type|Function|String>", defaultValue: []},
        length: { type: "unsigned int", readOnly: true, get: 'size', persistent: false }
    },*/
defineProperties(SereniX.types.Types.prototype, ['types', { name: 'length', readOnly: true, get: 'size'}]);

/**
 * 
 * @class SereniX.types.Union
 */
extObj(defineClass(
    'SereniX.types.Union',
    function Union() {
        SereniX.types.Types.apply(this, [].slice.call(arguments));
    },
    SereniX.types.Types,
    {
        is: function(obj) {
            return SereniX.types.Union.is(obj, this.getTypes());
        },
        /**
         * 
         * @returns {String}
         */
        getType:function() {
            return "union";
        }
    }
    ),
    {
        is : function(obj, types) {
            for (var i = 0, n = types.length; i < n; i++) {
                if (SereniX.types.Type.is(obj, types[i])) {
                    return true;
                }
            }
            return false;
        }
    }
);


/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Union.prototype.isTypeOf = SereniX.types.Union.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Union.prototype.isTypeof = SereniX.types.Union.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Union.prototype.accept = SereniX.types.Union.prototype.is;


/**
 * 
 * @class SereniX.types.Minus
 */
extObj(defineClass(
    'SereniX.types.Minus',
    function Minus() {},
    SereniX.types.Types,
    {
        is: function(obj) {
            return SereniX.types.Minus.is(obj, this.getTypes());
        },
        /**
         * 
         * @returns {String}
         */
        getType:function() {
            return "minus";
        }
    },
    {
        is : function(obj, types) {
            var n = types.length;
            if (n === 0 || !SereniX.types.Type.is(obj, types[0])) {
                return false;
            }
            for (var i = 1; i < n; i++) {
                if (SereniX.types.Type.is(obj, types[i])) {
                    return false;
                }
            }
            return true;
        }
    })
);



/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Minus.prototype.isTypeOf = SereniX.types.Minus.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Minus.prototype.isTypeof = SereniX.types.Minus.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Minus.prototype.accept = SereniX.types.Minus.prototype.is;

/**
 * 
 * @class SereniX.types.Intersect
 */
extObj(defineClass(
    'SereniX.types.Intersect',
    function Intersect() {},
    SereniX.types.Types,
    {
        
        is: function(obj) {
            return SereniX.types.Intersect.is(obj, this.getTypes());
        },
        /**
         * 
         * @returns {String}
         */
        getType:function() {
            return "intersect";
        }
    }
), {
    is: function(obj, types) {
        var n = types.length;
        if (n === 0) {
            throw new Error("Empty types list");
        }
        for (var i = 0; i < n; i++) {
            if (!SereniX.types.Type.is(obj, types[i])) {
                return false;
            }
        }
        return true;
    }
});



/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Intersect.prototype.isTypeOf = SereniX.types.Intersect.prototype.is;
/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Intersect.prototype.isTypeof = SereniX.types.Intersect.prototype.is;

/**
 * 
 * @alias
 * @returns {boolean}
 */
SereniX.types.Intersect.prototype.accept = SereniX.types.Intersect.prototype.is;








/**
 * 
 * @type {Object}
 */
var SERENIX_NUMBER_TYPE_FORMATS = {
    "byte" : [ "%c" ],
    "signed byte" : [ "%c","%hhi" ],
    "unsigned byte" : [ "%c","%hhu" ],
    "short" : [ "%hi" ],
    "short int" : [ "%hi" ],
    "signed short" : [ "%hi" ],
    "signed short int" : [ "%hi" ],
    "unsigned short" : [ "%hu" ],
    "unsigned short int" : [ "%hu" ],
    "int" : [ "%i","%d" ],
    "signed" : [ "%i","%d" ],
    "signed int" : [ "%i","%d" ],
    "unsigned" : [ "%u" ],
    "unsigned int" : [ "%u" ],
    "long" : [ "%li" ],
    "long int" : [ "%li" ],
    "long integer" : [ "%li" ],
    "signed long" : [ "%li" ],
    "signed long int" : [ "%li" ],
    "signed long integer" : [ "%li" ],
    "unsigned long" : [ "%lu" ],
    "unsigned long int" : [ "%lu" ],
    "unsigned long integer" : [ "%lu" ],
    "long long" : [ "%lli" ],
    "long long int" : [ "%lli" ],
    "long long integer" : [ "%lli" ],
    "signed long long" : [ "%lli" ],
    "signed long long int" : [ "%lli" ],
    "signed long long integer" : [ "%lli" ],
    "unsigned long long" : [ "%llu" ],
    "unsigned long long int" : [ "%llu" ],
    "unsigned long long integer" : [ "%llu" ],
    "float" : [ "%f","%F","%g","%G","%e","%E","%a","%A" ],
    "double" :[ "%lf","%lF","%lg","%lG","%le","%lE","%la","%lA" ],
    "long double" :[ "%Lf","%LF","%Lg","%LG","%Le","%LE","%La","%LA" ],
    "int64" : [ "%lli" ],
    "uint64" : [ "%llu" ]
};


/**
 * 
 * @type {Object}
 */
var SERENIX_NUMBER_TYPE_INTERVALS = {
    "bit" : { min: 0, max: 1 },
    "byte" : { min: -128, max: 127 },
    "signed byte" : { min: -128, max: 127 },
    "unsigned byte" : { min: 0, max: 255 },
    "ubyte" : { min: 0, max: 255 },
    "short" : { min: -32768, max: 32767 }, //-32768 to 32767
    "short int" : { min: -32768, max: 32767 }, //-32768 to 32767
    "signed short" : { min: -32768, max: 32767 }, //-32768 to 32767
    "signed short int" : { min: -32768, max: 32767 }, //-32768 to 32767
    "unsigned short" : { min: 0, max: 65535 },
    "unsigned short int" : { min: 0, max: 65535 },
    "int" : { min: -2147483648, max: 2147483647 }, //-2147483648 to 2147483647
    "signed" : { min: -2147483648, max: 2147483647 }, //-2147483648 to 2147483647
    "signed int" : { min: -2147483648, max: 2147483647 }, //-2147483648 to 2147483647
    "signed integer" : { min: -2147483648, max: 2147483647 }, //-2147483648 to 2147483647
    "unsigned" : { min: 0, max: 4294967295 },
    "unsigned int" : { min: 0, max: 4294967295 },
    "unsigned integer" : { min: 0, max: 4294967295 },
    "uint" : { min: 0, max: 4294967295 },
    "long" : { min: -4294967296, max: 4294967295 },
    "long int" : { min: -4294967296, max: 4294967295 },
    "long integer" : { min: -4294967296, max: 4294967295 },
    "signed long" : { min: -4294967296, max: 4294967295 },
    "signed long int" : { min: -4294967296, max: 4294967295 },
    "signed long integer" : { min: -4294967296, max: 4294967295 },
    "unsigned long" : { min: 0, max: 9223372036854775807 },
    "unsigned long int" : { min: 0, max: 9223372036854775807 },
    "unsigned long integer" : { min: 0, max: 9223372036854775807 },
    "long long" : { min : -9223372036854770808, max: 9223372036854775807}, //-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
    "int64": { min : -9223372036854770808, max: 9223372036854775807}, //-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
    "long long int" : { min : -9223372036854770808, max: 9223372036854775807},
    "long long integer" : { min : -9223372036854770808, max: 9223372036854775807},
    "signed long long" : { min : -9223372036854770808, max: 9223372036854775807},
    "signed long long int" : { min : -9223372036854770808, max: 9223372036854775807},
    "signed long long integer" : { min : -9223372036854770808, max: 9223372036854775807},
    "unsigned long long" : { min : 0, max: 18446744073709551615}, //  
    "unsigned long long int" : { min : 0, max: 18446744073709551615},
    "unsigned long long integer" : { min : 0, max: 18446744073709551615},
    "uint64" : { min : 0, max: 18446744073709551615},
    "float" : { min: 3.4e-38, max: 3.4e+38},
    "unsigned float": { min: 0, max: 6.8e+38 },
    "double" :{ min: 1.7e-308, max: 1.7e+308 },
    "unsigned double" : {min: 0, max: 3.14e+308},
    "long double" :{ min: 1.7e-308, max: 1.7e+308 },
    "unsigned long double" : { min: 0}
};



/**
 * 
 * 
 * @class SereniX.types.Number
 */
var NumberValue = extObj(
    defineClass(
        "SereniX.types.Number",    
        /**
         * 
         * @returns {Number}
         * @constructor
         */
        function Number() {
            this.__value_ = 0;
            this.__type_ = 'number';
            if (arguments.length === 1) {
                var a = arguments[0];
                if (typeof a === 'number') {
                    this.__value_ = arguments[0];
                } else if (typeof a === 'string') {
                    a = a.toLowerCase();
                    if (SERENIX_NUMBER_TYPES.indexOf(a) >= 0) {
                        this.__type_ = a;
                    } else if (a[0] === '0') {
                        try {
                            var v = parseFloat(a);
                            if (!Number.isNaN(v)) {
                                this.__type_ = "number";
                            }
                        } catch (e) {
                            incorrectArg();
                        }
                    } else {
                        incorrectArg();
                    }
                } else if (a instanceof Date) {
                    this.__type_ = "number";
                    this.__value_ = a.getTime();
                } else {
                    incorrectArg();
                }
            }
        },

        //instance methods
        {

            /**
             * 
             * @returns {String}
             */
            getType: function() {
                return this.__type_||'number';
            },
            /**
             * 
             * @param {String} type
             * @returns {SereniX.types.Number}
             */
            setType : function(type) {
                var ltyp = type.toLowerCase();
                if (SERENIX_NUMBER_TYPES.indexOf(ltyp) < 0) {
                    throw new Error("Incorrect number type: '" + type + "'");
                }
                this.__type_ = ltyp;
                return this;
            },
            /**
             * 
             * @returns {Number}
             */
            getValue: function() {
                return this.__value_;
            },

            /**
             * 
             * @param {Number} v
             * @returns {undefined}
             */
            setValue: function(v) {
                nullExcept(v); //throw an eception if v is null
                var _v = v;
                if (typeof v === 'string') {
                    _v = parseFloat(v);
                    if (Number.isNaN(_v)) {
                        throw new Error("Incorrect argument");
                    }
                } else if (v instanceof Date) {
                    _v = v.getTime();
                }
                if (!SereniX.types.Number.checkType(_v, this.getType())) {
                    if (v instanceof Date) {
                        throw new Error("The date integer value (" + _v + ") is out of bounds : " + v);
                    }
                    throw new Error("Incorrect integer value : " + v);
                }
                this.__value_ = _v;
            },
            /**
             * 
             * @returns {Number}
             */
            valueOf:function() {
                return this.getValue();
            },
            /**
             * 
             * @param {type} obj
             * @returns {Number}
             */
            compareTo : function(obj) {
                if (obj === null) {
                    return null;
                }
                if (!(obj instanceof SereniX.types.Number)) {
                    throw "The object to compare with is not an instance of SereniX.types.Number";
                }
                v1 = this.getValue();
                v2 = obj.getValue();
                return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0);
            },
            /**
             * 
             * @param {type} obj
             * @returns {Boolean}
             */
            equals : function(obj) {
                if (obj === null) {
                    return false;
                }
                if (!(obj instanceof SereniX.types.Number)) {
                    throw "The object to compare with is not an instance of SereniX.types.Number";
                }
                return this.getValue() === obj.getValue();
            },
            /**
             * 
             * @param {type} num
             * @returns {Boolean}
             */
            equalsTo : function(num) {
                return this.equals(num);
            },
            /**
             * 
             * @returns {String}
             */
            toString:function() {
                return "" + this.getValue();
            },
            /**
             * 
             * @returns {String}
             */
            toJSON:function() {
                return "{ type: '" + this.getType() + "', value: " + this.getValue() + " }";
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isNumberValue :function() {
                return SereniX.types.Number.isNumber(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isIntegerValue: function() {
                return SereniX.types.Number.isInteger(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isJSIntegerValue: function() {
                return SereniX.types.Number.isJSInteger(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isJSIntValue: function() {
                return SereniX.types.Number.isJSInt(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isIntValue: function () {
                return SereniX.types.Number.isInt(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isCIntValue: function () {
                return SereniX.types.Number.isCInt(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isCIntegerValue: function () {
                return SereniX.types.Number.isCInteger(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isBasicIntValue: function () {
                return SereniX.types.Number.isBasicInt(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isBasicIntegerValue: function () {
                return SereniX.types.Number.isBAsicInteger(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isLIntValue: function () {
                return SereniX.types.Number.isLInt(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean|Number}
             */
            isLIntegerValue: function () {
                return SereniX.types.Number.isInteger(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isLongValue: function () {
                return SereniX.types.Number.isLong(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isShortValue: function () {
                return SereniX.types.Number.isShort(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isByteValue: function () {
                return SereniX.types.Number.isByte(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isBitValue: function () {
                return SereniX.types.Number.isBit(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isJSFloatValue: function () {
                return SereniX.types.Number.isJSFloat(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isFloatValue: function () {
                return SereniX.types.Number.isFloat(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isJSDoubleValue: function () {
                return SereniX.types.Number.isJSDouble(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isLongDoubleValue: function () {
                return SereniX.types.Number.isLongDouble(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isDoubleValue: function () {
                return SereniX.types.Number.isDouble(this.getValue());
            },

            /**
             * 
             * 
             * @returns {Boolean}
             */
            isUnsignedShortValue: function () {
                return SereniX.types.Number.isUnsignedShort(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isUnsignedLongValue: function () {
                return SereniX.types.Number.isUnsignedLong(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isUnsignedByteValue: function () {
                return SereniX.types.Number.isUnsignedByte(this.getValue());
            },
            /**
             * 
             * 
             * @returns {undefined}
             */
            isUnsignedFloatValue: function () {
                return SereniX.types.Number.isUnsignedFloat(this.getValue());
            },
            /**
             * 
             * 
             * @returns {undefined}
             */
            isUnsignedDoubleValue: function () {
                return SereniX.types.Number.isUnsignedDouble(this.getValue());
            },
            /**
             * 
             * 
             * @returns {undefined}
             */
            isUnsignedLongDoubleValue: function () {
                return SereniX.types.Number.isNumber(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isUnsignedIntValue: function() {
                return SereniX.types.Number.isNumber(this.getValue());
            },

            /**
             * 
             * 
             * @returns {undefined}
             */
            isNan:function () {
                return this.isNaN(this.getValue());
            },
            /**
             * 
             * 
             * @returns {unresolved}
             */
            isNaN:function () {
                return SereniX.types.Number.isNaN(this.getValue());
            }, 
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isPositiveValue: function() {
                return SereniX.types.Number.isPositive(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isPositiveOrZeroValue: function() {
                return SereniX.types.Number.isPositiveOrZero(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isPositiveOrNulValue: function() {
                return SereniX.types.Number.isPositiveOrNul(this.getValue());
            },
            /**
             * 
             * 
             * @returns {Boolean}
             */
            isNegativeValue: function() {
                return SereniX.types.Number.isNegative(this.getValue());
            },
             /**
              * 
              * 
              * @returns {Boolean}
              */
            isNegativeOrZeroValue: function() {
                return SereniX.types.Number.isNegativeOrZero(this.getValue());
            }
        }        
    ),/* add static fields and methods */
        {
            compare: function(n1, n2) {
                if (n1 instanceof Number || n1 instanceof SereniX.types.Number ) {
                    n1 = n1.valueOf();
                }
                if (n2 instanceof Number || n2 instanceof SereniX.types.Number) {
                    n2 = n2.valueOf();
                }
                if (typeof n1 === 'number') {
                    if (typeof n2 === 'number') {
                        return n1 < n2  ? - 1 : n1 > n2 ? 1 : 0; 
                    }                    
                }
                throw new Error("Not comparable arguments");
            },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isNumber:function(v) {
                    return Number.isInteger(v) || Number.isFloat(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isInteger: function(v) {
                    return Number.isInteger(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isJSInteger: function(v) {
                    return Number.isInteger(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isJSInt: function(v) {
                    return Number.isInteger(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isInt:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32,767 && v < +32,767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isCInt:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32,767 && v < +32,767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isCInteger:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32,767 && v < +32,767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isBasicInt:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32,767 && v < +32,767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isBasicInteger:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32,767 && v < +32,767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isLInt:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -2147483648 && v <= 2147483647;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean|Number}
                 */
                isLInteger:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    } 
                    return v >= -2147483648 && v <= 2147483647;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isLong:function (v) {
                    return Number.isInteger(v) && v >= -9223372036854775808 && v <= 9223372036854775807;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isShort:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -32767 && v < +32767;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isByte:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= -128 && v < 128;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isBit:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v === 0 || v === 1;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isJSFloat:function (v) {
                    return Number.isFloat(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isFloat:function (v) {
                    return v >= 3.4e-38 && v < 3.4e+38;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isJSDouble:function (v) {
                    return Number.isFloat(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isLongDouble:function (v) {
                    return Number.isFloat(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isDouble:function (v) {
                    return v >= 1.7e-308 && v < 1.7e+308;
                },

                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isUnsignedShort:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= 0 || v <= 65535;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isUnsignedLong:function (v) {
                    if (!Number.isInteger(v)) {
                        return false;
                    }
                    return v >= 0 && v <= +18446744073709551615;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isUnsignedByte:function (v) {
                    return v >= 0 && v < 256;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {undefined}
                 */
                isUnsignedFloat:function (v) {
                    return v >= 0 && v < 6.8e+38;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {undefined}
                 */
                isUnsignedDouble:function (v) {
                    return v >= 0 && v < 3.14e+308;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {undefined}
                 */
                isUnsignedLongDouble:function (v) {
                    return SereniX.types.Number.isNumber(v) && v >= 0;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isUnsignedInt:function(v) {
                    return Number.isInteger(v) && v >= 0 && v <= 4294967295;
                },

                /**
                 * 
                 * @param {type} v
                 * @returns {undefined}
                 */
                isNan:function (v) {
                    return Number.isNaN(v);
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {unresolved}
                 */
                isNaN:function (v) {
                    return Number.isNaN(v);
                }, 
                /**
                 * 
                 * @param {Number} v
                 * @returns {Boolean}
                 */
                isPositive:function(v) {
                    return v > 0;
                },
                /**
                 * 
                 * @param {Number} v
                 * @returns {Boolean}
                 */
                isPositiveOrZero:function(v) {
                    return v >= 0;
                },
                /**
                 * 
                 * @param {Number} v
                 * @returns {Boolean}
                 */
                isPositiveOrNul:function(v) {
                    return v >= 0;
                },
                /**
                 * 
                 * @param {type} v
                 * @returns {Boolean}
                 */
                isNegative:function(v) {
                    return v < 0;
                },
                 /**
                  * 
                  * @param {type} v
                  * @returns {Boolean}
                  */
                isNegativeOrZero:function(v) {
                    return v <= 0;
                },
            /**
             * @constant
             * @type Array&lt;String&gt;
             */
            TYPES : SERENIX_NUMBER_TYPES,
            /**
             * @constant
             */
            TYPE_FORMATS : SERENIX_NUMBER_TYPE_FORMATS,
            /**
             * 
             * @constant
             */
            TYPE_INTERVALS: SERENIX_NUMBER_TYPE_INTERVALS,
            /**
             * 
             * @constant
             */
            TYPES_MAP : SERENIX_NUMBER_TYPES_MAP,
            /**
             * 
             * @type Array&lt;String&gt;
             * @constant
             */
            FLOATING_POINT_TYPES : SERENIX_FLOATING_POINT_TYPES,
            /**
             * Returns the nornalized number type name corresponding to the given
             * type argument.
             * <p><b>The given type argument can be the short name of a type.</b></p>
             * @param {String} type
             * @returns {String}
             */
            getNumberType: function(type) {
                var ltyp = type.toLowerCase();
                if (SereniX.types.Number.TYPES.indexOf(ltyp) >= 0) {
                    return ltyp;
                }
                return SereniX.types.Number.TYPES_MAP[ltyp]||null;
            },
            /**
             * 
             * @param {type} type
             * @returns {SereniX.types.Number@arr;TYPE_INTERVALS}
             */
            getTypeInterval: function(type) {
                var typ;
                if (type === 'integer') {
                    typ = "int";
                } else {
                    typ = type.replace(/\s+integer$/, ' int');
                }    
                var i = SereniX.types.Number.TYPE_INTERVALS[typ];
                if (i) {
                    return i;
                }
                var t = SereniX.types.Number.TYPES_MAP[typ];
                if (t) {
                    i = SereniX.types.Number.TYPE_INTERVALS[t];
                    if (i) {
                        return i;
                    }
                }
                return null;
            },
            /**
             * Checks true if the type of the given value or object corresponds to 
             * the typeof of the given object.
             * @param {Number|Boolean|String|Object|Array} obj The value or object 
             * to check
             * @param {String} type
             * @returns {undefined}
             */
            checkType:function(obj, type) {
                function check(v, i) {
                    var min = i.min,
                        max = i.max ;
                    return (min === undefined || min === null || v >= min) 
                            && (max === undefined || max === null || v <= max);
                }
                if (typeof obj !== 'number') {
                    return false;
                }
                var ltyp = type.toLowerCase();
                if (["number", "numeric"].indexOf(ltyp) >= 0) {
                    return true;
                }
                if (!this.isFloatingPointType(ltyp) && !Number.isInteger(obj)) {
                    return false;
                }
                var i = this.getTypeInterval(ltyp);
                if (i) {
                    return check(obj, i);
                }
                return true;
            },
            getInteger: function(v, radix) {
                if (arguments.length > 1) {
                    return parseInt(v, radix);
                }
                if (typeof v === 'string') {
                    v = v.trim();
                    if (v.match(/^[-+]?0[xX]/)) {
                        return parseInt(v, 16);
                    } else if (v.match(/^0/)) {
                        return parseInt(v, 8);
                    } else if (v.match(/^[0-9]+$/)) {
                        return parseInt(v);
                    } else {
                        return parseInt("a");
                    }        
                }
                if(Number.isInteger(v)) {
                    return v;
                }
                throw new Error("Can not be converted to integer");
            },
            /**
             * 
             * @param {String} sval
             * @param {String} type
             * @param {Boolean} [ignoreCase=false]
             * @returns {Number}
             */
            valueFromString: function(sval, type, ignoreCase) {
                var v;
                if (sval === 'null' || sval === 'Null') {
                    return null;
                }
                if (sval === 'undefined') {
                    return undefined;
                }
                v = this.isFloatingPointType(
                        type, 
                        arguments.length > 2 ? ignoreCase : false) ? 
                            parseFloat(sval) : this.getInteger(sval);

                if (Number.isNaN(v)) {
                    throw new Error("Incorrect number string value: '" + sval + "'");
                }
                if (this.checkType(v, type))
                    return v;
                throw new Error("The value is out of bounds: '" + sval + "'");
            },
            /**
             * 
             * @param {String} type
             * @param {Boolean} [ignoreCase=false]
             * @returns {Boolean}
             */
            isValidType: function(type, ignoreCase) {
                var typ = arguments.length > 1 && ignoreCase ? 
                        type.toLowerCase() : type;
                return SERENIX_NUMBER_TYPES.indexOf(typ) >= 0 
                        || SERENIX_NUMBER_TYPES_MAP[typ];
            },
            /**
             * 
             * @param {String} type
             * @param {Boolean} [ignoreCase=false]
             * @returns {Boolean}
             */
            isFloatingPointType: function(type, ignoreCase) {
                var typ = arguments.length > 1 && ignoreCase ? 
                        type.toLowerCase() : type;

                return SERENIX_FLOATING_POINT_TYPES.indexOf(
                        SERENIX_NUMBER_TYPES_MAP[typ]||typ) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isByteType : function(type) {
                return [
                    "byte",
                    "signed byte"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isUnsignedByte:function(type) {
                return ["unsigned byte", "ubyte", "ub"].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isShortType: function(type) {
                 return [
                                "short",
                                "short int",
                                "short integer",
                                "signed short",
                                "signed short int",
                                "signed short integer"
                            ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isUnsignedShortType: function(type) {
                return [
                    "unsigned short",
                    "unsigned short int",
                    "unsigned short integer",
                    "ushort", "us"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isIntType: function(type) {
                return [
                    "int",
                    "integer",
                    "signed",
                    "signed int",
                    "signed integer",
                    "int4"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isUnsignedIntType: function(type) {
                return [
                    "unsigned",
                    "unsigned int",
                    "unsigned integer",
                    "uint"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isLongType: function(type) {
                return [
                    "long",
                    "long int",
                    "long integer",
                    "signed long",
                    "signed long int",
                    "signed long integer",
                    "unsigned long",
                    "unsigned long int",
                    "unsigned long integer",
                    "int8"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isUnsignedLongType: function(type) {
                return [
                    "unsigned long",
                    "unsigned long int",
                    "unsigned long integer",
                    "ulong",
                    "ul"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isLongLongType: function(type) {
                return [
                    "long long",
                    "long long int",
                    "long long integer",
                    "signed long long",
                    "signed long long int",
                    "signed long long integer",
                    "uint64"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isUnsignedLongLongType:function(type) {
                return [
                    "unsigned long long",
                    "unsigned long long int"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isFloatType:function(type) {
                return [
                    "float",
                    "real",
                    "signed float",
                    "signed real",
                    "reel",
                    "rÃ©el",
                    "f"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isNumberType: function(type) {
                return [                
                    "numeric",
                    "number"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {String} type
             * @returns {Boolean}
             */
            isDoubleType: function(type) {
                return[
                    "double",
                    "signed double",
                    "d"
                ].indexOf(type) >= 0;
            },
            isUnsignedDoubleType: function(type) {
                return[
                    "unsigned double",
                    "ud"
                ].indexOf(type) >= 0;
            },
            /**
             * 
             * @param {type} type
             * @returns {Boolean}
             */
            isLongDoubleType: function(type) {
                return[
                    "long double",
                    "signed long double",
                    "ldouble",
                    "ld"
                ].indexOf(type) >= 0;
            },

        }
    );
/*"properties": {
        "instance": {
            "type" : { 
                "name": "string", 
                "defaultValue": "number", 
                "values": SERENIX_NUMBER_TYPES
            },
            "value" : { 
                //"type": "number", "defaultValue" : 0
                "type": "${this.type}", "defaultValue" : 0
            }
        }
    },*/
defineProperties(SereniX.types.Number.prototype, [ 'type', 'value']);
/**
 * 
 * 
 * @class SereniX.types.Integer
 */
var IntegerValue = defineClass(
    //class name
    "SereniX.types.Integer",
    
    /**
     * 
     * @returns {undefined}
     * @constructor
     */
    function Integer() {
        this.__type_ = "int";
        if (arguments.length === 1) {
            var o = arguments[0];
            if (isArray(o)) {
                var type = o[1];
                if (typeof type === 'string' && type) {
                    this.setType(type);
                }
                this.setValue(o[0]);
            } else if (isPlainObject(o)) {
                var type = o.type||o.Type||"";
                if (typeof type === 'string' && type) {
                    this.setType(type);
                }
                var v = typeof o.value === 'undefined' ? o.value : o.Value;
                if (typeof v !== 'undefined')
                    this.setValue(v);
            } else if (typeof o === 'number') {
                this.setValue(o);
            } else if (typeof o === 'string') {
                this.setType(o);
            }
        } else if (arguments.length > 1) {
            var type = arguments[1];
            if (typeof type === 'string' && type) {
                this.setType(type);
            }
            this.setValue(arguments[0]);
        }
    },
    //super class
    SereniX.types.Number,
    //instance methods
    {
        /**
         * 
         * @param {type} type
         * @returns {unresolved}
         */
        setType: function(type) {
            var ltyp = type.toLowerCase();
            if (SERENIX_INTEGER_TYPES.indexOf(ltyp) < 0) {
                throw new Error("Incorrect type name: '" + type + "'");
            }
            return SereniX.types.Number.prototype.setType.apply(this, [ltyp]);
        },
        /**
         * 
         * @param {type} val
         * @param {type} round
         * @returns {undefined}
         */
        setValue: function(val, round) {
            if (arguments.length === 1 || typeof round === 'undefined' || round === null) {
                SereniX.types.Number.prototype.setValue.call(this, val);
            } else if (typeof round === 'function') {
                SereniX.types.Number.prototype.setValue.call(this, round(val));
            } else if (toBool(round)) {
                var sign = val < 0 ? -1 : 1;
                val = Math.abs(val);
                var f = Math.floor(val);
                SereniX.types.Number.prototype.setValue.call(this, sign*(f + (val - f < 0.5 ? 0 : 1)));
            } else {
                SereniX.types.Number.setValue.call(this, val);
            }
        }
    }
); 
/*properties: {
    "type" : { 
        "name": "string", 
        "defaultValue": "int", 
        "values": SERENIX_INTEGER_TYPES
    }
},*/
defineProperties(SereniX.types.Integer.prototype, [ 'type', 'value']);

/**
 * 
 * 
 * @class SereniX.types.Integer
 */
var FloatValue = defineClass(
    "SereniX.types.FloatingPointValue",
    /**
     * 
     * @returns {undefined}
     */
    function FloatingPointValue() {
        this.__type_ = "float";
        if (arguments.length === 1) {
            var f = arguments[0];
            if (isArray(f)) {
                var type = f[1];
                if (typeof type === 'string' && type) {
                    this.setType(type);
                }
                this.setValue(f[0]);
            } else if (isPlainObject(f)) {
                var type = f.type||f.Type||"";
                if (typeof type === 'string' && type) {
                    this.setType(type);
                }
                var v = typeof f.value === 'undefined' ? f.value : f.Value;
                if (typeof v !== 'undefined')
                    this.setValue(v);
            } else if (typeof f === 'number') {
                this.setValue(f);
            } else if (typeof f === 'string') {
                this.setType(f);
            }
        } else if (arguments.length > 1) {
            var type = arguments[1];
            if (typeof type === 'string' && type) {
                this.setType(type);
            }
            this.setValue(arguments[0]);
        }
    },
    SereniX.types.Number,
    {
        /**
         * 
         * @param {type} type
         * @returns {unresolved}
         */
        setType: function(type) {
            var ltyp = type.toLowerCase();
            if (SERENIX_FLOATING_POINT_TYPES.indexOf(ltyp) < 0) {
                throw new Error("Incorrect type name: '" + type + "'");
            }
            return SereniX.types.Number.prototype.setType.apply(this, [ltyp]);
        }
    }
);


/*properties: {
        "type" : { 
            "name": "string", 
            "defaultValue": "float", 
            "values": SERENIX_FLOATING_POINT_TYPES
        }
    },*/
defineProperties(SereniX.types.Integer.prototype, [ 'type', 'value']);

SereniX.types.FloatValue = SereniX.types.FloatingPointValue;


var NUMBER_TYPE_WRAPPERS = {};

var NUMBER_WRAPPER_TYPES = {};

(function() {
    function getClassName(name) {
        var cn = "", ofs = 0;
        for (var i = 0, n = name.length; i < n; i++) {
            if (" \t\n\b\0-_".indexOf(name[i]) >= 0) {
                if (ofs < i) {
                    cn += name.substring(ofs, ofs + 1).toUpperCase() + name.substring(ofs + 1, i);
                } 
                ofs = i + 1;
            }
        }
        if (ofs < i) {
            cn += name.substring(ofs, ofs + 1).toUpperCase() + name.substring(ofs + 1);
        }
        return cn;
    };
    function build(classNames, _super, types) {
        function construct(className, type) {
            return eval("(function() {  return function " + className + "() {"
                + "\n    this.__type_ = '" + type + "'" 
                + "\n    if (arguments.length > 0) {"
                +  "\n        var v = arguments[0];"
                + (classNames[type] ? 
                  "\n        if (typeof v === 'string') {"
                + "\n            this.setValue(toInteger(v));"
                + "\n        } else if (Number.isInteger(v)) {"
                + "\n            this.setValue(v);"
                + "\n        } else if (v instanceof String) {"
                + "\n            this.setValue(toInteger(v.valueOf()));"
                + "\n        } else if (Number.isInteger(v)) {"
                + "\n            this.setValue(v.valueOf());"
                + "\n        }" :
                  "\n        if (typeof v === 'string') {"
                + "\n            this.setValue(parseFloat(v));"
                + "\n        } else if (typeof v === 'number') {"
                + "\n            this.setValue(v);"
                + "\n        } else if (v instanceof String) {"
                + "\n            this.setValue(parseFloat(v.valueOf()));"
                + "\n        } else if (v instanceof  Number)) {"
                + "\n            this.setValue(v.valueOf());"
                + "\n        }"
                )
                +          " else {"
                + "\n            throw new Error('Incorrect argument');"
                + "\n        }"
                + "\n    }" //if (arguments.length > 0) {
                + "\n};" // returned function
                + "\n})();"
            );
        }
        var className, cls;
        for (var type in classNames) {
            className = classNames[type];
            globalNS[type] = cls = defineClass( 
                'SereniX.types.' + className,
                
                construct(className, type),
                
                _super,
                
                {
                    setType: function(type) {
                        return this;
                    }
                }
            );
            cls.getFullName = cls.getClassFullName = cls.getFullClassName = function() {
                return this.__CLASS_FULL_NAME__;
            };
            cls.__NAMESPACE_NAME__ = 'SereniX.types';
            cls.__FULL_CLASS_NAME__ = cls.__CLASS_FULL_NAME__ = 'SereniX.types.' + className;
            defineProperties(cls.prototype, ["type"]);
        }
        
        
        var key, type, cn, c;
        for (var i = 0; i < types.length; i++) {
            key = types[i];
            type = SERENIX_NUMBER_TYPES_MAP[key];
            if (key !== 'integer' && key !== type) {
                cn = getClassName(key);
                c = SereniX[classNames[type]];
                if (c)
                    globalNS[cn] = SereniX[cn] = c;
            }
        }
    }
    var classNames = {
        "bit" : "Bit",
        "byte" : "Byte",
        "unsigned byte" : "UnsignedByte",
        "short": "Short",
        "unsigned short" : "UnsignedShort",
        "int": "Int",
        "unsigned int": "UnsignedInt",
        "long" : "Long",
        "unsigned long" : "UnsignedLong",
        "long long": "LongLong",
        "unsigned long long": "UnsignedLongLong"
    };
    var fClassNames = {
        "float": "Float",
        "unsigned float": "UnsignedFloat",
        "double": "Double",
        "unsigned double": "UnsignedDouble",
        "long double": "LongDouble",
        "unsigned long double": "UnsignedLongDouble"
    };
    
    
    
    function putWrap(map) {
        var ctyp;
        for (var type in map) {
            ctyp = 'SereniX.types.' + map[type];
            NUMBER_TYPE_WRAPPERS[type] = ctyp;
            NUMBER_WRAPPER_TYPES[ctyp] = type;
        }
    }
    
    putWrap(classNames);
    
    putWrap(fClassNames);
    
    build(classNames, SereniX.types.Integer, SERENIX_INTEGER_TYPES);
    
    build(fClassNames, SereniX.types.FloatingPointValue, SERENIX_FLOATING_POINT_TYPES);
    
   
})();

var SERENIX_TYPE_UNWRAP_CLASSES = {
    "number": Number, 
    "numeric": Number,
    "decimal": Number,
    "string": String, 
    "boolean": Boolean,
    "bit": SereniX.types.Bit,
    "byte": SereniX.types.Byte,
    "ubyte": SereniX.types.UnsignedByte,
    "signed byte": SereniX.types.Byte,
    "unsigned byte": SereniX.types.UnsignedByte,
    "short": SereniX.types.Short,
    "short int": SereniX.types.Short,
    "short integer": SereniX.types.Short,
    "signed short": SereniX.types.Short,
    "signed short int": SereniX.types.Short,
    "signed short integer": SereniX.types.Short,
    "unsigned short": SereniX.types.UnsignedShort,
    "unsigned short int": SereniX.types.UnsignedShort,
    "unsigned short integer": SereniX.types.UnsignedShort,
    "int": SereniX.types.Int,
    "integer": SereniX.types.Int,
    "signed": SereniX.types.Int,
    "signed int": SereniX.types.Int,
    "signed integer": SereniX.types.Int,
    "unsigned": SereniX.types.UnsignedInt,
    "unsigned int": SereniX.types.UnsignedInt,
    "unsigned integer": SereniX.types.UnsignedInt,
    "long": SereniX.types.Long,
    "long int": SereniX.types.Long,
    "long integer": SereniX.types.Long,
    "signed long": SereniX.types.Long,
    "signed long int": SereniX.types.Long,
    "unsigned long": SereniX.types.UnsignedLong,
    "unsigned long int": SereniX.types.UnsignedLong,
    "long long": SereniX.types.LongLong,
    "long long int": SereniX.types.LongLong,
    "signed long long": SereniX.types.LongLong,
    "signed long long int": SereniX.types.LongLong,
    "unsigned long long": SereniX.types.UnsignedLongLong,
    "unsigned long long int": SereniX.types.UnsignedLongLong,
    "float": SereniX.types.Float,
    "double": SereniX.types.Double,
    "long double": SereniX.types.LongDouble,
    "signed long double": SereniX.types.LongDouble,
    "unsigned long double": SereniX.types.UnsignedLongDouble,
    "uint": SereniX.types.UnsignedInt,
    "ulong": SereniX.types.UnsignedLong,
    "ufloat": SereniX.types.UnsignedFloat,
    "ubyte": SereniX.types.UnsignedByte,
    "ushort": SereniX.types.UnsignedShort,
    "udouble": SereniX.types.UnsignedDouble,
    "uldouble": SereniX.types.UnsignedLongDouble,
    /*"int4": ,
    "int8": ,
    "int16": ,
    "uint16": ,
    "int32": ,
    "uint32": ,
    "int64": ,
    "uint64": ,
    "uint16": ,
    "size" : */
};






/**
 * 
 * 
 * @class SereniX.types.String
 */
var StringValue = extObj(defineClass(
        "SereniX.types.String",    
        function String() {}
    ), 
    {
        isString: function(type) {
           return SERENIX_STRING_TYPE_NAMES.indexOf(type) >= 0;
        },
        /**
         * 
         * @param {type} type
         * @returns {ltype|Boolean}
         */
        isStringType: function(type) {
           return type.toLowerCase() === 'string';
        },
        /**
         * 
         * @param {type} type
         * @returns {ltype|Boolean}
         */
        isEmailType: function(type) {
           return type.toLowerCase() === 'email';
        },
        /**
         * 
         * @param {type} type
         * @returns {ltype|Boolean}
         */
        isRFC822EmailType: function(type) {
           return type.toLowerCase() === 'rfc822_email';
        },
        
        /**
         * 
         * @param {type} type
         * @returns {ltype|Boolean}
         */
        isES6EmailType: function(type) {
           return type.toLowerCase() === 'es6_email';
        },
        /**
         * 
         * @param {type} type
         * @returns {unresolved}
         */
        getStringType: function(type) {
            var ltype = type.toLowerCase();
            if (SERENIX_STRING_TYPE_NAMES.indexOf(ltype) >= 0) {
                return ltype;
            }
            return null;
        }
    }
);

SereniX.types.String.TYPE_NAMES = SERENIX_STRING_TYPE_NAMES;

SereniX.types.String.isType = function(type) {
    return SERENIX_STRING_TYPE_NAMES.indexOf(type) >= 0;
};

SereniX.types.String.isTypeOf= function(val, type) {
    if (val instanceof String) {
        val = val.valueOf();
    }    
    if (typeof val !== 'string') {
        return false;
    }
    if (SERENIX_STRING_TYPE_NAMES.indexOf(type) < 0) {
        return false;
    }
    switch (type.toLowerCase()) {
        case 'name' :
            break;
        case 'email' :
        case 'mail' :
        case 'mailto' :
            return !!EMAIL_REGEXP_VALID_FORMAT.test(val);
        case 'rfc822_email':
            return RFC822_VALID_EMAIL_REGEXP.test(val);
        case 'es6_email':
            return ES6_VALID_EMAIL_REGEXP.test(val);
        case 'js_email':
            return JS_EMAIL_REGEXP.test(val);
        case 'ascii_email':
            return ASCII_EMAIL_REGEXP.test(val);
        case 'tld' :
            break;
        case 'tel' :
        case 'telephon' :
        case 'phone' :
            return TEL_REGEXP.test(val);        
        case 'creditcard':
        case 'credit_card':
        case 'credit card':
        case 'credit-card':
            return CREDIT_CARD_REGEXP.test(val);
        case 'url' :
            break;
        case 'uri' :
            break;
        case 'urn' :
            break;
        case 'path' :
            break;
        case 'filename' :
            break;
        case 'propertyname' :
            return /^[a-zA-Z$_][a-zA-Z$_0-9]*$/.test(val);
        case 'namespace' :
        case 'namespacename' :
            return /^[a-zA-Z$_][a-zA-Z$_0-9]*(?:\.[a-zA-Z$_][a-zA-Z$_0-9]*)*$/.test(val);
        case 'ipv4' :
            return IPV4_REGEXP.test(val); 
        case 'ipv6' :
            break;
    }
    return true;
};


/**
 * <h3>List Type class</h3>
 * @class SereniX.types.LType
 */
defineClass(
    'SereniX.types.LType',
    /**
     * 
     * @param {type} o
     * @returns {LType}
     * @constructor
     */
    function LType(o) {
        this.__cardMin_ = 0;
        this.__cardMax_ = null;
        if (isPlainObject(o)) {
            this.setDataType(o.itemType||o.itemtype||o.elementType||o.ItemType
                    ||o.Itemtype||o.ElementType
                    ||o.Datatype||o.DataType||o.type||o.Type);
            
            var K = SereniX.types.TypeUtils;
            this.setCardMin(K.getCardMin(o));
            this.setCardMax(K.getCardMax(o));  
            return;
        } else if (arguments.length > 1) {
            o = arguments;
        } else {
            return;
        }
        if (o.length > 2) {
            this.setDataType(o[0]);
            this.setCardMin(o[1]);
            this.setCardMax(o[2]);
        } else if (o.length === 2) {
            if ((typeof o[0] === 'number') || (o[0] instanceof Number)) {
                this.setCardMin(o[0]);
                this.setCardMax(o[1]);
            } else {
                this.setDataType(o[0]);
                this.setCardMin(o[1]);
            }
        }
    },
    //super class
    SereniX.types.Type,
    //instance (prototype) methods
    {
        /**
         * 
         * @returns {String|Function|SereniX.types.Type:SereniX.types.ANY_TYPE}
         */
        getDataType : function() {
            return this.__dataType_;
        },
        /**
         * 
         * @param {type} dt
         * @returns {SereniX.types.SType}
         */
        setDataType: function(dt) {
            if (typeof dt === 'function' || dt instanceof SereniX.types.Type) {
                this.__dataType_ = dt;
            } else {
                this.__dataType_ = SereniX.types.Type.getInstance(dt);
            }
            return this;
        },
        /**
         * 
         * @returns {unsigned int}
         */
        getCardMin : function() {
            return this.__cardMin_;
        },
        /**
         * 
         * @param {unsigned int} cardMin
         * @returns {SereniX.types.LType}
         */
        setCardMin: function(cardMin) {
            if (cardMin instanceof Number) {
                cardMin = cardMin.valueOf();
            }
            if (typeof cardMin !== 'number' || Math.floor(cardMin) !== cardMin) {
                throw new Error("Unsigned int argument expected");
            }
            this.__cardMin_ = cardMin;
            return this;
        },
        /**
         * 
         * @returns {unsigned int}
         */
        getCardMax : function() {
            return this.__cardMax_;
        },
        /**
         * 
         * @param {unsigned int} cardMax
         * @returns {SereniX.types.LType}
         */
        setCardMax: function(cardMax) {
            if (typeof cardMax === 'undefined' || cardMax === null) {
                cardMax = null;
            } else {
                if (cardMax instanceof Number) {
                    cardMax = cardMax.valueOf();
                }
                if (typeof cardMax !== 'number' || Math.floor(cardMax) !== cardMax) {
                    throw new Error("Unsigned int argument expected");
                }
            }
            this.__cardMax_ = cardMax;
            return this;
        },
        /**
         * 
         * @param {type} obj
         * @returns {Boolean}
         */
        is: function(obj) {
            var count, dt = this.getDataType();
            if (isArray(obj)) {
                count = obj.length;
                var c = this.getCardMin();
                if (typeof c !== 'undefined' && c !== null && count < c) {
                    return false;
                }
                var c = this.getCardMax();
                if (typeof c !== 'undefined' && c !== null && count > c) {
                    return false;
                }
                for (var i = 0; i < count; i++) {
                    if (!SereniX.types.Type.is(obj[i], dt)) {
                        return false;
                    }
                }
                return true;
            } else if (obj instanceof SereniX.types.List) {
                count = obj.size();
                var c = this.getCardMin();
                if (typeof c !== 'undefined' && c !== null && count < c) {
                    return false;
                }
                var c = this.getCardMax();
                if (typeof c !== 'undefined' && c !== null && count > c) {
                    return false;
                }
                for (var i = 0; i < count; i++) {
                    if (!SereniX.types.Type.is(obj.get(i), dt)) {
                        return false;
                    }
                }
                return true;
            }
            
            return false;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isList: function() {
            return true;
        },
        /**
         * 
         * <p>This method is an alia of getDataType() method.</p>
         * @returns {String|Function|SereniX.types.Type}
         */
        getItemType:function() {
            return this.getDataType();
        },
        /**
         * 
         * <p>This method is an alia of setDataType() method.</p>
         * @param {String|Function|SereniX.types.Type} ityp
         * @returns {SereniX.types.LType}
         */
        setItemType: function(ityp) {
            return this.setDataType(ityp);
        },
        /**
         * 
         * <p>This method is an alia of getCardMin() method.</p>
         * @returns {unsigned int}
         */
        getMinOccurences:function() {
            return this.getCardMin();
        },
        /**
         * 
         * <p>This method is an alia of setCardMin() method.</p>
         * @param {unsigned int} cmin
         * @returns {SereniX.types.LType}
         */
        setMinOccurences:function(cmin) {
            return this.setCardMin(cmin);
        },
        /**
         * 
         * <p>This method is an alia of getCardMax() method.</p>
         * @returns {unsigned int}
         */
        getMaxOccurences:function() {
            return this.getCardMax();
        },
        /**
         * 
         * <p>This method is an alia of setCardMax() method.</p>
         * @param {unsigned int} cmax
         * @returns {SereniX.types.LType}
         */
        setMaxOccurences:function(cmax) {
            return this.setCardMax(cmax);
        }
        
    }
);


/**
 * 
 * @returns {Boolean}
 */
SereniX.types.LType.isOccurencesType = function() {
    return true;
};
SereniX.types.LType.occurencesType = true;
/**
 * 
 * @returns {Boolean}
 */
SereniX.types.LType.isSizedType = function() {
    return false;
};

SereniX.types.LType.sizedType = false;

defineProperties(SereniX.types.LType.prototype, [ 'dataType', 'cardMin', 'cardMax' ]);









//SereniX.types.Boolean.STRICT_BOOLEAN
defineClass(
    'SereniX.types.Boolean',
    
    function Boolean(o) {
        this.__strict_ = true;
        if (o instanceof Boolean || o instanceof Number || o instanceof String) {
            o = o.valueOf();
        }
        if (typeof o !== 'undefined' & o !== null) {
            this.__strict_ = toBool(o);
        }
    },
    SereniX.types.Type,
    
    {
        /**
         * 
         * @returns {Boolean}
         */
        isStrict : function() {
            return this.__strict_;
        },
        /**
         * 
         * @returns {Boolean}
         */
        getStrict : function() {
            return this.__strict_;
        },
        /**
         * 
         * @param {type} strict
         * @returns {Boolean}
         */
        setStrict : function(strict) {
            this.__strict_ = strict;
            return this;
        }
    }
);

defineProperties(SereniX.types.Boolean.prototype, [ 'strict']);
/**
 * 
 * @param {String} type
 * @returns {Boolean}
 */
SereniX.types.Boolean.isTypeOf = function(type) {
    if (type instanceof String) {
        type = type.valueOf();
    }
    if (typeof type !== 'string') {
        return false;
    }
    return ['boolean', 'bool'].indexOf(type.toLowerCase()) >= 0;    
};

SereniX.types.Boolean.getValue = function(o) {
    return toBool(o);
};

SereniX.types.Boolean.STRICT_BOOLEAN = new SereniX.types.Boolean();

SereniX.types.Boolean.STRICT_BOOLEAN.isStrict =  function() {
    return true;
};

SereniX.types.Boolean.STRICT_BOOLEAN.setStrict =  function() {
    return this;
};


SereniX.types.Boolean.STRICT_BOOLEAN.getValue = function(o) {
    return toBool(o);
};


defineClass(
    'SereniX.types.Array',    
    function TArray(o) {
        if (isPlainObject(o)) {
            this.setItemType(o.itemType||o.itemtype||o.ItemType||o.Itemtype||o.elementType||o.ElementType);
            this.setParamTypes(o.paramTypes||o.ParamTypes||o.parameterTypes||o.ParameterTypes);
            this.setCardMin(o.cardMin||o.cardmin||o.minOccurences||o.CardMin||o.Cardmin||o.MinOccurences||0);
            var max = o.cardMax||o.cardmax||o.maxOccurences||o.CardMax||o.Cardmax||o.MaxOccurences;
            if (typeof max === 'undefined') {
                max = null;
            }
            this.setCardMax(max);
        } 
    },
    SereniX.types.Type,    
    {
        setItemType: function() {
            return this.__itemType_;
        },
        /**
         * 
         * @returns {Array}
         */
        getParamTypes : function() {
            return this.__ptypes_;
        },
        /**
         * 
         * @param {Array} paramTypes
         * @returns {SereniX.types.Array}
         */
        setParamTypes : function(paramTypes) {
            this.__ptypesMap_ = {};
            this.__nameIndexes_ = {};
            if (typeof paramTypes === 'undefined' || paramTypes === null) {
                this.__ptypes_ = null;
            } else {
                this.__ptypes_ = [];
                var t;
                for (var i = 0, n = paramTypes.length; i < n; i++) {
                    t = paramTypes[i];
                    if (t.name && t.type) {
                        this.__ptypesMap_[t.name] = t.type;
                        this.__nameIndexes_[t.name] = i; 
                    }
                    this.__ptypes_[i] = t;
                }
            }
            return this;
        },
        is: function(arr) {
            if (typeof arr !== 'array' && !(arr instanceof Array)) {
                return false;
            }
            var dt = this.getItemType(), o = arr;
            if (!dt || dt === 'any' || dt === 'Any' || dt === '*') {
                return true;
            }
            if (dt === 'array' || dt === 'Array') {
                var e;
                for (var i = 0, n = arr.length; i < n; i++) {
                    e = arr[i];
                    if (typeof e !== 'array' && !(e instanceof Array)) {
                        return false;
                    }
                }
                return true;
            }
            
            if (dt === 'object' || dt === 'Object') {
                var e;
                for (var i = 0, n = arr.length; i < n; i++) {
                    e = arr[i];
                    if (!isPlainObject(e) ) {
                        return false;
                    }
                }
                return true;
            }
            if (typeof dt === 'string') {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (!TypeUtils.isTypeOf(arr[i], dt)) {
                        return false;
                    }
                }
                return true;
            }
            if (typeof dt.is === 'function') {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (!dt.is(arr[i])) {
                        return false;
                    }
                }
                return true;
            }
            if (typeof dt.isTypeOf === 'function') {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (!dt.isTypeOf(arr[i])) {
                        return false;
                    }
                }
                return true;
            }
            
            if (typeof dt.accept === 'function') {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (!dt.accept(arr[i])) {
                        return false;
                    }
                }
            }
            
            return true;
        }
    }
);


defineProperties(SereniX.types.Array.prototype, [ 'itemType', 'paramTypes', 'cardMin<unsigned int>', 'cardMax<unsigned int>' ]);






defineClass(
    "SereniX.types.List",

    function List() {
        
    },
    {
        add:function(e) {
            this.__els_[this.__els_.length] = e;
            return this;
        },
        /**
         * 
         * 
         * @param {type} index
         * @param {type} e
         * @returns {SereniX.types.List}
         */
        insert:function(index, e) {
            this.__els_.splice(index, 0, e);
            return this;
        },
        /**
         * 
         * @returns {undefined}
         */
        addAll:function() {
            var n = arguments.length;
            if (n > 1) {
                for (var i = 0; i < n; i++ ) {
                    this.add(arguments[i]);
                }
            } else if (n === 1 ) {
                var a = arguments;
                if (isArray(a)) {
                    for (var i = 0; i < n; i++ ) {
                        this.add(a[i]);
                    }
                } else {
                    this.add(a);
                }
            }
            return this;
        },
        
        /**
         * 
         * @param {Number} index
         * @param {Array} elements
         * @returns {SereniX.types.List}
         */
        insertAll:function(index, elements) {
            var n = elements.length;
            for (var i = n - 1; i >= 0; i-- ) {
                this.insert(index, elements[i]);
            }
            return this;
        },
        /**
         * 
         * @returns {Number}
         */
        size: function() {
            return this.__els_.length;
        },
        /**
         * 
         * @param {Number} index
         * @returns {type}
         */
        get: function(index) {
            return this.__els_[index];
        },
        /**
         * 
         * @param {unsigned int} index
         * @param {type} e
         * @returns {SereniX.types.List}
         */
        set: function(index, e) {
            if (index < this.__els_.length) {
                this.__els_[index] = e;
            } else {
                this.__els_.splice(index, 1, e);
            }
            return this;
        },
        /**
         * 
         * @param {type} e
         * @returns {SereniX.types.List|Number|String|Boolean|Function|Object|Array}
         * @throws {Error}
         */
        remove: function(e) {
            if (Number.isInteger(e)) {
                return this.__els_.splice(e, 1)[0];
            }
            var i = this.__els_.indexOf(e);
            if (i >= 0) {
                this.__els_.splice(e, 1);
                return this;
            }
            throw new Error("The element is not in the list");
        },
        /**
         * 
         * @param {type} e
         * @param {type} rep
         * @returns {Boolean|SereniX.types.List}
         */
        replace: function(e, rep) {
            for (var i = 0, n = this.__els_.length; i < n; i++) {
                if (e === this.__els_[i]) {
                    this.__els_[i] = rep;
                    return this;
                }
            }
            return false;
        },
        /**
         * 
         * @param {Function} predicate
         * @returns {Number}
         */
        findIndex: function(predicate) {          
            var els = this.__els_, n= els.length;
            for (var i = 0; i < n; i++) {
                if (predicate(els[i])) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 
         * @param {Function} predicate  The predicate as function takes one  
         *     argument which is used to check whether the predicate is true or 
         *     false.
         * @returns {Object}
         * @throws {NoDataFound} When no element found
         */
        find: function(predicate) { 
            var els = this.__els_, n= els.length, e;
            for (var i = 0; i < n; i++) {
                e = els[i];
                if (predicate(e)) {
                    return e;
                }
            }
            throw new NoDataFound("No element/item found");
        },
        /**
         * 
         * @param {Function} predicate The predicate as function takes one  
         *     argument which is used to check whether the predicate is true or false.
         * @returns {Array}
         */
        findAll: function(predicate) { 
            var els = this.__els_, n= els.length, e, result = [];
            for (var i = 0; i < n; i++) {
                e = els[i];
                if (predicate(e)) {
                    result[result.length] = e;
                }
            }
            return result;
        },
        /**
         * 
         * @param {Object} predicate  The predicate object with the method 
         *     isTrue.  The method isTrue takes one argument which is used to 
         *     check whether the predicate is true or false.
         * @returns {Number}
         */
        tfindIndex: function(predicate) {          
            var els = this.__els_, n= els.length;
            for (var i = 0; i < n; i++) {
                if (predicate.isTrue(els[i])) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 
         * @param {Object} predicate  The predicate object with the method 
         *     isTrue.  The method isTrue takes one argument which is used to 
         *     check whether the predicate is true or false.
         * @returns {type}
         * @throws {NoDataFound} When no element found
         */
        tfind: function(predicate) { 
            var els = this.__els_, n= els.length, e;
            for (var i = 0; i < n; i++) {
                e = els[i];
                if (predicate.isTrue(e)) {
                    return e;
                }
            }
            throw new NoDataFound("No element/item found");
        },
        /**
         * 
         * @param {Object} predicate The predicate object with the method 
         *     isTrue.  The method isTrue takes one argument which is used to 
         *     check whether the predicate is true or false.
         * @returns {Array}
         */
        tfindAll: function(predicate) { 
            var els = this.__els_, n= els.length, e, result = [];
            for (var i = 0; i < n; i++) {
                e = els[i];
                if (predicate.isTrue(e)) {
                    result[result.length] = e;
                }
            }
            return result; 
        },
        /**
         * 
         * @param {type} e
         * @param {Function|Object} [compare=null]
         * @returns {Number}
         */
        indexOf: function(e, compare) { 
            if ((!compare) || e === null) {
                return this.__els_.indexOf(e);
            }
            var els = this.__els_, n= els.length;
            if (typeof compare === 'function') {
                var els = this.__els_, n= els.length;
                for (var i = 0; i < n; i++) {
                    if (compare(e, els[i]) === 0) {
                        return i;
                    }
                }
                return -1;
            } else if (isPlainObject(compare)) {
                if (typeof compare.equals === 'function') {
                    for (var i = 0; i < n; i++) {
                        if (compare.equals(e, els[i]) === 0) {
                            return i;
                        }
                    }
                    return -1;
                } else if (compare.compare === 'function') {
                    for (var i = 0; i < n; i++) {
                        if (compare.compare(e, els[i]) === 0) {
                            return i;
                        }
                    }
                    return -1;
                }
                throw new Error("Incorrect comparator"); 
            } else if (typeof compare !== 'undefined' && compare !== null) {
                throw new Error("Incorrect comparator"); 
            }
            if (['number', 'string', 'boolean', 'function'].indexOf(typeof e) >= 0) {
                return this.__els_.indexOf(e);
            }
            if (typeof e.equals === 'function') {
                for (var i = 0; i < n; i++) {
                    if (e.equals(els[i])) {
                        return i;
                    }
                }
                return -1;
            }
            if (typeof e.equalsTo === 'function') {
                for (var i = 0; i < n; i++) {
                    if (e.equalsTo(els[i])) {
                        return i;
                    }
                }
                return -1;
            }
            return this.__els_.indexOf(e);
        },
        /**
         * 
         * @param {type} callback
         * @param {type} caller
         * @returns {undefined}
         */
        forEach : function(callback, caller) {
            if (caller) {
                var els = this.__els_, n= els.length;
                for (var i = 0; i < n; i++) {
                    callback.apply(caller, [ els[i], i, this ]);
                }
            } else {
                var els = this.__els_, n= els.length;
                for (var i = 0; i < n; i++) {
                    callback.call(els[i], i, this);
                }
            }
        },
        /**
         * 
         * @returns {Array}
         */
        toArray:function() {
            return [].slice(this.__els_);
        },
        /**
         * 
         * @param {type} o
         * @param {Function|Object} [compare=null]
         * @returns {Boolean}
         */
        equals: function(o, compare) {
            if (this === o) {
                return true;
            }
            if (!(o instanceof SereniX.types.List)) {
                return false;
            }
            var els1 = this.__els_, els2 = o.__els_, n = els1.length;
            if (n !== els2.length) {
                return false;
            }
            if (n === 0) {
                return true;
            }
            for (var i = 0; i < n; i++) {
                if (els1[i] !== els2[i]) {
                    return false;
                }
            }
            return true;
        }
    }
);



defineClass(
    "SereniX.types.TList",    
    
    function TList() {
        this.__els_ = [];
        if (arguments.length > 1) {
            for (var i = 0, n = arguments.length; i < n; i++) {
                this.add(arguments[i]);
            }
        } else if (arguments.length === 1) {
            var a = arguments;
            if (isArray(a)) {
                for (var i = 0, n = a.length; i < n; i++) {
                    this.add(a[i]);
                }
            } else if (typeof a === 'string' || typeof a === 'function') {
                this.setItemType(a);
            } else if (typeof a === 'object') {
                //TODO
            }
        }
    },
    SereniX.types.List,
    {
        add:function(e) {
            if (SereniX.types.TList.__checkAdd(e, this)) {
                this.__els_[this.__els_.length] = e;
                return this;
            }
            throw new Error("Incorrect element");
        },
        /**
         * 
         * 
         * @param {type} index
         * @param {type} e
         * @returns {SereniX.types.List}
         */
        insert:function(index, e) {
            if (SereniX.types.TList.__checkAdd(e, this)) {
                this.__els_.splice(index, 0, e);
                return this;
            }    
            throw new Error("Incorrect element");
        }
    }
);

Object.defineProperty(SereniX.types.TList.prototype,"length",
        { 
            get: SereniX.types.List.prototype.size, 
            set: function() { throw new Error("Read only property");} 
        }
);

/*
 * SereniX.types.TList.prototype,
 * properties : [
        "itemType<String|Function>@",
        "acceptNull<Boolean:true:true|false>@"
    ],
 * 
 */

SereniX.types.TList.__checkAdd = function(item, list) {
    var itemType = list.getItemType();
    if (typeof itemType !== 'undefined' || itemType !== null) {
        if (!TypeUtils.isTypeOf(item, itemType)) {
            throw new Error("Incorrect item's type/class");
        }
    }
    if ((item === null || typeof item === 'undefined') && !list.isAcceptNull()) {
        nullExcept();
    }
    return true;
};




defineClass(
    "SereniX.types.OList",
    
    function OList() {
        this.__els_ = [];
        if (arguments.length > 1) {
            for (var i = 0, n = arguments.length; i < n; i++) {
                this.add(arguments[i]);
            }
        } else if (arguments.length === 1) {
            var o = arguments;
            if (isArray(o)) {
                for (var i = 0, n = o.length; i < n; i++) {
                    this.add(o[i]);
                }
            } else if (typeof o === 'string' || typeof o === 'function') {
                this.setItemType(o);
            } else if (typeof o === 'object') {
                this.setItemType(o.itemType||o.itemtype||o.itemClass||o.itemclass||"any");
                this.setCardMin(o.cardMin||o.minOccurences||o.minElements||o.minItems||o.min||0);
                this.setCardMax(o.cardMax||o.maxOccurences||o.maxElements||o.maxItems||o.max||null);                
            }
        }
    },
    
    SereniX.types.TList,
    
    {
        /**
         * 
         * @param {type} e
         * @returns {SereniX.types.List}
         */
        add:function(e) {
            if (SereniX.types.OList.__checkAdd(e, this)) {
                this.__els_[this.__els_.length] = e;
                return this;
            }
            throw new Error("Incorrect element");
        },
        /**
         * 
         * 
         * @param {type} index
         * @param {type} e
         * @returns {SereniX.types.List}
         */
        insert:function(index, e) {
            if (SereniX.types.OList.__checkAdd(e, this)) {
                this.__els_.splice(index, 0, e);
                return this;
            }    
            throw new Error("Incorrect element");
        },
        /**
         * 
         * @param {type} e
         * @returns {SereniX.types.List|Number|String|Boolean|Function|Object|Array}
         * @throws {Error}
         */
        remove: function(e) {
            if (Number.isInteger(e)) {
                return this.__els_.splice(e, 1)[0];
            }
            if (!SereniX.types.OList.__checkRemove(this)) {
                throw new Error("Can not remove element");
            }
            var i = this.__els_.indexOf(e);
            if (i >= 0) {
                this.__els_.splice(e, 1);
                return this;
            }
            throw new Error("The element is not in the list");
        }
    }
);
/**
 * 
 * @private
 * @param {type} item
 * @param {SereniX.types.List} list
 * @returns {Boolean}
 */
SereniX.types.OList.__checkAdd = function(item, list) {
    var itemType = list.getItemType();
    if (typeof itemType !== 'undefined' || itemType !== null) {
        if (!TypeUtils.isTypeOf(item, itemType)) {
            throw new Error("Incorrect item's type/class");
        }
    }
    if ((item === null || typeof item === 'undefined') && !list.isAcceptNull()) {
        nullExcept();
    }
    var cmax = list.getCardMax(), len = list.size();
    if (typeof cmax === 'number' && cmax >= 0) {
        if (len >= cmax) {
            throw new Error("Too many items/elements");
        }
    }
    return true;
};

/**
 * 
 * @private
 * @param {SereniX.types.List} list
 * @returns {Boolean}
 */
SereniX.types.OList.__checkRemove = function( list) {
    if (list.getCardMin() <= list.size()) {
        throw new Error("The number of items/elements is less than the minimum required");
    }
    return true;
};


defineProperties(SereniX.types.OList.prototype, [
        "cardMin",
        "cardMax"
    ]);

defineClass(
    "SereniX.types.Pair",
    function Pair() {
        if (arguments.length === 0) {
            return ;
        }
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0])) {
            args = args[0];
        }
        if (args.length === 1) {
            var a = args[0];
            if (isArray(a)) {
                this.setFirst(a[0]);
                this.setSecond(a[1]);
            } else if (typeof a === 'object') {
                this.setFirst(a.first);
                this.setSecond(a.second);
            }
        } else {
            this.setFirst(args[0]);
            this.setSecond(args[1]);
        }
        
    },
    
    {   
        /**
         * 
         * @returns {type}
         */
        getFirst: function() {
            return this.__first_;
        },
        /**
         * 
         * @param {type} first
         * @returns {serenix_typesAnonym$107}
         */
        setFirst: function(first) {
            this.__first_ = first;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getSecond: function() {
            return this.__second_;
        },
        /**
         * 
         * @param {type} second
         * @returns {Pair}
         */
        setSecond: function(second) {
            this.__second_ = second;
            return this;         
        },
        /**
         * 
         * @returns {undefined}
         */
        set: function() {
            if (arguments.length === 0) {
                throw new Error("Arguments expected");
            }
            var args = [].slice.call(arguments);
            while (args.length === 1 && isArray(args[0])) {
                args = args[0];
            }
            if (args.length === 1) {
                var a = args[0];
                if (isArray(a)) {
                    this.setFirst(a[0]);
                    this.setSecond(a[1]);
                } else if (typeof a === 'object') {
                    this.setFirst(a.first);
                    this.setSecond(a.second);
                }
            } else {
                this.setFirst(args[0]);
                this.setSecond(args[1]);
            }
        },
        /**
         * 
         * @returns {Array}
         */
        toArray : function() {
            return [this.__first, this.__second];
        },
        get: function(k) {
            if (k instanceof Number || k instanceof String) {
                k = k.valueOf();
            }
            if (typeof k === 'number') {
                if (k === 0) {
                    return this.getFirst();
                }
                if (k === 1) {
                    return this.getSecond();
                }
            } else if (typeof k === 'string') {
                switch(k.toLowerCase()) {
                    case 'first':
                    case '1st':
                        return this.getFirst();
                    case 'second':
                    case '2nd':
                        return this.getSecond();
                }
            }
        }
    }
);

defineProperties(SereniX.types.Pair.prototype, [ "first", "second" ]);



defineClass(
    "SereniX.types.Map",
    function Map() {
        this._entries = {};
        this.__size__ = 0;
        if (arguments.length === 1) {
            if (arguments[0]) {
                this.setAll(arguments[0]);
            }
        } else if (arguments.length > 0) {
            SereniX.types.Map.prototype.setAll.apply(this, arguments);
        }
    },
    
    {
        getValueType: function() {
            return this.__valueType_;
        },
        setValueType: function(type) {
            this.__valueType_ = type;
            return this;
        },
        /**
         * 
         * @param {type} key
         * @returns {serenix_class_baseAnonym$47.methods._entries}
         */
        get:function(key) {
            return this._entries[key];
        },
        /**
         * 
         * @param {String} key
         * @param {type} value
         * @returns {SereniX.types.Map}
         */
        set:function(key, value) {
            if (typeof key !== 'string') {
                throw "Expected String key";
            }
            if (typeof this._entries[key] === 'undefined') {
                this.__size__++;
            }
            this._entries[key] = value;
            return this;
        },
        /**
         * 
         * @returns {SereniX.types.Map}
         */
        setAll:function() {
            if (arguments.length === 1) {
                var a = arguments[0];
                if (isArray(a)) {
                    var n = a.length;
                    n = (n - (n % 2))/2;
                    for (var i = 0; i < n; i++) {
                        this.set(a[2*i], a[2*i + 1]);
                    }
                    this.__size__ += n;
                } else if (typeof a === 'object') {
                    this._entries = [];
                    for (var k in a) {
                        this.set(k, a[k]);
                        this.__size__++;
                    }
                } else {
                    incorrectArg(); //throw "Incorrect argument" exception;
                }
            } else if (arguments.length > 1) {
                var n = arguments.length;
                n = (n - (n % 2))/2;
                for (var i = 0; i < n; i++) {
                    this.set(arguments[2*i], arguments[2*i + 1]);
                }
                this.__size__ += n;
            }
            return this;
        },
        /**
         * 
         * @returns {SereniX.types.Map}
         */
        put:function() {
            if (arguments.length === 1) {
                var a = arguments[0];
                if (isArray(a)) {
                    this._entries = [];
                    var n = a.length;
                    n = (n - (n % 2))/2;
                    for (var i = 0; i < n; i++) {
                        this.set(a[2*i], a[2*i + 1]);
                    }
                    this.__size__ = n;
                } else if (typeof a === 'object') {
                    this._entries = [];
                    this.__size__ = 0;
                    for (var k in a) {
                        this.set(k, a[k]);
                        this.__size__++;
                    }
                } else {
                    incorrectArg(); //throw "Incorrect argument" exception;
                }
            } else if (arguments.length > 1) {
                this._entries = [];
                var n = arguments.length;
                n = (n - (n % 2))/2;
                for (var i = 0; i < n; i++) {
                    this.set(arguments[2*i], arguments[2*i + 1]);
                }
                this.__size__ = n;
            }
            return this;
        },
        /**
         * 
         * @param {String} key
         * @returns {Number|String|Boolean|Function|Object}
         */
        remove:function(key) {
            if (typeof key !== 'string') {
                throw "Expected String key";
            }
            var v = this._entries[key];
            
            if (typeof v !== 'undefined') {
                delete this._entries[key];
                this.__size__--;
            }
            return v;
        },
        /**
         * 
         * @param {String} key
         * @returns {Boolean}
         */
        containsKey: function(key) {
            if (typeof key !== 'string') {
                throw "Expected String key";
            }
            return typeof this._entries[key] !== 'undefined';
        },
        /**
         * 
         * @param {String} key
         * @returns {Boolean}
         */
        hasKey: function(key) {
            return this.containsKey(key);
        },
        /**
         * 
         * @returns {Array&lt;String&gt;}
         */
        keys:function() {
            var ks = [];
            for (var k in this._entries) {
                ks[ks.length] = k;
            }
            return ks;
        },
        /**
         * 
         * @returns {unsigned int}
         */
        size : function() {
            return this.__size__;
        },
        /**
         * 
         * @param {Function} p The function to process or the processor
         * @param {Object} caller  The caller is optional and it's use only 
         *                         when the first argument is a function.
         * @returns {undefined}
         */
        forEach: function(p, caller) {
            var caller = null, f;
            if (arguments.length === 1) {
                var p = arguments[0];
                if (p && (typeof p === 'object')) {
                    var f = p.process||p.func||p["function"]||p.action;
                    if (typeof f === 'function') {
                        var args = [];
                        for (var k in this._entries) {
                            args[0] = k;
                            args[1] = this._entries[k];
                            p.apply(p, args);
                        }
                    } else {
                        incorrectArg(); //throw "Incorrect argument" exception;
                    }
                } else if (typeof p === 'function') {
                    for (var k in this._entries) {
                        p(k, this._entries[k]);
                    }
                } else {
                    throw "Expected function argument";
                }
            } else if (arguments.length > 1) {
                if (caller && (typeof caller === 'object')) {
                    var args = [];
                    for (var k in this._entries) {
                        args[0] = k;
                        args[1] = this._entries[k];
                        p.apply(caller, args);
                    }
                } else {
                    for (var k in this._entries) {
                        p(k, this._entries[k]);
                    }
                }
            }
        }
    }
);


defineProperties(SereniX.types.Map.prototype, ["valueType"]);

SereniX.types.RefTypes = {
    bindings : {},
    getRefType: function(type) {
        var t = this.bindings[type];
        if (!t) {
            this.bindings[type] = t = new SereniX.types.RefType(type);
        }
        return t;
    }
};


extObj(defineClass(
    'SereniX.types.Password',
    function Password() {
        function intVal(v) {
            if (v < 0) {
                throw new Error("Incorrect arguments");
            }
            return Math.floor(v);
        }
        this.__minDigits_ = 1;
        this.__minLength_ = 12;
        this.__maxLength_ = 15;
        this.__minDigits_ = 1;
        this.__maxDigits_ = 4;
        this.__minSpecialChars_ = 1;
        this.__mixedLetters_ = true;
        this.__name_ = "";
        if (arguments.length === 1) {
            var a = arguments[0];
            if (typeof a  === 'number') {
                this.__length_ = intVal(a);
            } else if (isPlainObject(a)) {
                if (typeof a.length === 'number') {
                    this.__length_ = intVal(a.length);
                } else if (typeof a.size === 'number') {
                    this.__length_ = intVal(a.size);
                } else {
                    var v = SereniX.types.TypeUtils.getMinLength(a);
                    if (typeof v === 'number')
                        this.__minLength_ = intVal(v);
                    v = SereniX.types.TypeUtils.getMaxLength(a);
                    if (typeof v === 'number')
                        this.__maxLength_ = intVal(v);
                }
                if (typeof a.digits === 'number') {
                    this.__digits_ = intVal(a.digits);
                }
                if (typeof a.minDigits === 'number') {
                    this.__minDigits_ = intVal(a.minDigits);
                }
                if (typeof a.maxDigits === 'number') {
                    this.__maxDigits_ = intVal(a.maxDigits);
                }
                if (typeof a.specialChars !== 'undefined') {
                    this.__minSpecialChars_ = intVal(a.specialChars);
                } else if (typeof a.specialCharacters !== 'undefined') {
                    this.__minSpecialChars_ = intVal(a.specialCharacters);
                }

                if (typeof a.minSpecialChars !== 'undefined') {
                    this.__minSpecialChars_ = intVal(a.minSpecialChars);
                } else if (typeof a.minSpecialCharacters !== 'undefined') {
                    this.__minSpecialChars_ = intVal(a.minSpecialCharacters);
                }
                if (typeof a.maxSpecialChars !== 'undefined') {
                    this.__maxSpecialChars_ = intVal(a.maxSpecialChars);
                } else if (typeof a.maxSpecialCharacters !== 'undefined') {
                    this.__maxSpecialChars_ = intVal(a.maxSpecialCharacters);
                }
                if (typeof a.mixedLetters !== 'undefined' && a.mixedLetters !== null) {
                    this.__mixedLetters_ = toBool(a.mixedLetters);
                } else if (typeof a.mixed !== 'undefined' && a.mixed !== null) {
                    this.__mixedLetters_ = toBool(a.mixed);
                }
                var v = a.nameField||a.nameProperty||a.nameFieldName||a.namePropertyName;
                if (v instanceof String) {
                    v = v.valueOf();
                }
                if (v && typeof v === 'string') {
                    this.__namePropertyName_ = v;
                }
                v = a.loginField||a.loginProperty||a.loginFieldName||a.loginPropertyName;
                if (v instanceof String) {
                    v = v.valueOf();
                }
                if (v && typeof v === 'string') {
                    this.__loginPropertyName_ = v;
                }
                var v = a.name||a.typeName||a.Name||a.TypeName;
                if (v instanceof String) {
                    v = v.valueOf();
                }
                if (v && typeof v === 'string') {
                    this.setName(v);
                }
            }
        } else if (arguments.length > 1) {
            var v = arguments[0];
            if (v instanceof String || v instanceof Number) {
                v = v.valueOf();
            }
            if (typeof v === 'string') {
                this.__loginPropertyName_ = v;
                v = arguments[1];
                if (typeof v === 'number') {
                    this.__length_ = intVal(v);
                } else if (typeof v === 'string') {
                    this.__namePropertyName_ = v;
                }
            } else if (typeof v === 'number') {
                this.__minLength_ = intVal(v);
                this.__maxLength_ = intVal(arguments[1]);
            }
        }
    },
    //super class
    SereniX.types.Type,
    //instance members
    {   
        
        /**
         * 
         * @param {String} v
         * @returns {SereniX.types.Password}
         */
        setName: function(v) {
            this.__name_ = v;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getName: function() {
            return this.__name_;
        },
        /**
         * 
         * @returns {type}
         */
        getMinLength : function() {
            return this.__minLength_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.Password}
         */
        setMinLength: function(s) {
            this.__minLength_ = s;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getMaxLength : function() {
            return this.__maxLength_;
        },
        /**
         * 
         * @param {type} s
         * @returns {SereniX.types.Password}
         */
        setMaxLength: function(s) {
            this.__maxLength_ = s;
            return this;
        },
        /**
         * 
         * @param {String} pwd
         * @param {Object} thisObj
         * @returns {Boolean}
         */
        is : function(pwd, thisObj) {
            if (pwd instanceof String) {
                pwd = pwd.valueOf();
            }
            if (typeof pwd !== 'string') {
                return false;
            }
            if (isPlainObject(thisObj)) {
                var lpwd = pwd.toLowerCase();
                if (this.__loginPropertyName_) {
                    var login = (thisObj[this.__loginPropertyName_]||"").toLowerCase();
                    if (login === lpwd) {
                        return false;
                    }
                }
                if (this.__namePropertyName_) {
                    var tokens = (thisObj[this.__namePropertyName_]||"").trim().toLowerCase().split(/\s+/g);
                    for (var i = 0, n = tokens.length; i < n; i++) {
                        if (lpwd.indexOf(tokens[i]) >= 0) {
                            return false;
                        }
                    }
                }
            }
            var len = pwd.length;
            if (typeof this.__length_ === 'number') {
                if (len !== this.__length_) {
                    return false;
                }
            } else {
                if (typeof this.__minLength_ === 'number') {
                    if (len < this.__minLength_) {
                        return false;
                    }
                }
                if (typeof this.__maxLength_ === 'number') {
                    if (len > this.__maxLength_) {
                        return false;
                    }
                }
            }
            var DIGITS= "0123456789";
            var LOWERS= "abcdefghijklmnopqrstuvwxyz";
            var UPPERS= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var digits = 0, lowers = 0, uppers = 0;
            var ch;
            for (var i = 0; i < len; i++) {
                ch = pwd[i];
                if (LOWERS.indexOf(ch) >= 0) {
                    lowers++;
                } else if (UPPERS.indexOf(ch) >= 0) {
                    uppers++;
                } else if (DIGITS.indexOf(ch) >= 0) {
                    digits++;
                }
            }
            
            if (this.__mixedLetters_) {
                if (lowers === 0 || uppers === 0) {
                    return false;
                }
            }
            
            if (typeof this.__digits_ === 'number') {
                if (this.__digits_ !== digits) {
                    return false;
                }
            } else {
                if (typeof this.__minDigits_ === 'number') {
                    if (this.__minDigits_ > digits) {
                        return false;
                    }
                }
                if (typeof this.__maxDigits_ === 'number') {
                    if (this.__maxDigits_ < digits) {
                        return false;
                    }
                }
            }
            var specials = len - (digits + lowers + uppers);
            if (typeof this.__specialChars_ === 'number') {
                if (this.__specialChars_ !== specials) {
                    return false;
                }
            } else {
                if (typeof this.__minSpecialChars_ === 'number') {
                    if (this.__minSpecialChars_ > specials) {
                        return false;
                    }
                }
                if (typeof this.__maxSpecialChars_ === 'number') {
                    if (this.__maxSpecialChars_ < specials) {
                        return false;
                    }
                }
            }
            return true;
        } // end method is
    } //end Password instance members
),{
    /**
     * 
     * @returns {Boolean}
     */
    isSizedType : function() {
        return true;
    },

    sizedType : true,

    /**
     * 
     * @returns {Boolean}
     */
    hasArguments : function() {
        return true;
    }
    
});

var Password = SereniX.types.Password;




defineClass(
    'SereniX.types.OTypeField',
    /**
     * 
     * @param {type} fo
     * @returns {OTypeField}
     * @class OTypeField
     */
    function OTypeField(fo) {
        if (fo instanceof String) {
            fo = fo.valueOf();
        }
        if (typeof fo === 'string') {
            this.setName(fo);
            var a = [].slice.call(arguments);
            if (a.length > 1 && isPlainObject(a[1]) 
                    || typeof a[1] === 'string' 
                    || typeof a[1] === 'function') {
                this.setType(a[1]);
                if (a.length > 2) {
                    this.setOptional(a[2]);
                }
            } else {
                this._name = "";
            }
        } else if (isPlainObject(fo)) {
            this.setName(fo.name||fo.Name||fo.typeName||fo.TypeName);
            this.setType(fo.type||fo.Type);
        } else {
            this._name = "";
        }
    },
    {
        
            
        /**
         * 
         * @param {type} name
         * @returns {Param}
         */
        setName: function(name) {
            this._name = name;
            return this;
        },
        /**
         * 
         * @returns {String} 
         */
        getName: function() {
            return this._name;
        },
        /**
         * 
         * @param {type} type
         * @returns {OTypeField}
         */
        setType: function(type) {
            this._type = SereniX.types.Type.getInstance(type);
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getType: function() {
            return this._type;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isOptional: function() {
            return this.__optional;
        },
        
        /**
         * 
         * @returns {Boolean}
         */
        isRequired :  function() {
            return !this.isOptional();
        },
        
        /**
         * 
         * @param {Boolean} o
         * @returns {OTypeField}
         */
        setOptional: function(o) {
            this.__optional = arguments.length === 0 ? true : typeof o === 'string' ? ['false', 'no', 'n', 'nok','ko', 'f', '0'].indexOf(o.toLowerCase()) < 0 : !!o;
            return this;
        },
        
        /**
         * 
         * @param {Boolean} required
         * @return {OTypeField}
         */
        setRequired :  function(required) {
            return this.setOptional(!toBool(required));
        }
    },
    { //aliases
        /**
         * 
         * @type isOptional|StatementElt.isOptional
         */
        'setNullable' :  'setOptional',
        /**
         * 
         * @type isOptional|StatementElt.isOptional
         */
        'isNullable': 'isOptional',

    
        /**
         * 
         * @type isRequired|StatementElt.isRequired
         */
        'isMandatory': 'isRequired',
    
    
        /**
         * 
         * @type setRequired|StatementElt.setRequired
         */
        'setMandatory' : 'setRequired'
    }
);
    
defineClass(
    'SereniX.types.Structure',
    function Structure(s) {
        if (isArray(s)) {
            this.setFields(s);
        } else if (isPlainObject(s)) {
            var fields = s.fields||s.Fields;
            if (isArray(fields) || isPlainObject(fields)) {
                this.setFields(fields);
            } else {
                this.setFields(s);
            }
        } else {
            this.__fields = [];
            this.__fieldTypes = {};
            this.__fieldMap = {};
            this.__fieldNames = [];
        }
    },
    
    {
        /**
         * 
         * @param {type} fields
         * @returns {Structure}
         */
        setFields: function(fields) {
            this.__fields = [];
            this.__fieldTypes = {};
            this.__fieldMap = {};
            this.__fieldNames = [];
            var F = SereniX.types.OTypeField;
            if (isArray(fields)) {
                var n = fields.length, fo, i = 0, name;
                for (; i < n; i++) {
                    fo = fields[i];
                    if (!(fo instanceof F)) {
                        fo= new F(fo);
                    }
                    this.__fields[i] = fo;
                    this.__fieldTypes[name= fo.getName()] = fo.getType();
                    this.__fieldMap[name] = fo;
                    this.__fieldNames[i] = name;
                }
            } else if (isPlainObject(fields)) {
                var fo, i = 0, v, o;
                for (var name in fields) {
                    if (hasOwnProp(fields, name)) {
                        fo = new F(name, v = fields[name]);
                        o = fo.option;
                        if (typeof o === 'undefined') {
                            o = fo.optional;
                            if (typeof o === 'undefined') {
                                o = fo.nullable;
                                if (typeof o === 'undefined') {
                                    o = fo.isNull;
                                    if (typeof o === 'undefined') {
                                        o = fo.is_null;
                                    }
                                }
                            }
                        }
                        if (typeof o !== 'undefined') {
                            fo.setOptional(toBool(o));
                        } else {
                            o = fo.option;
                            if (typeof o === 'undefined') {
                                o = fo.required;
                                if (typeof o === 'undefined') {
                                    o = fo.mandatory;
                                    if (typeof o === 'undefined') {
                                        o = fo.isNotNull;
                                        if (typeof o === 'undefined') {
                                            o = fo.is_not_null;
                                        }
                                    }
                                }
                            }
                            fo.setOptional(typeof o === 'undefined' ? true : !toBool(o));
                        }
                        this.__fields[i++] = fo;
                        this.__fieldTypes[name= fo.getName()] = fo.getType();
                        this.__fieldMap[name] = fo;
                        this.__fieldNames[i] = name;
                    }
                }
            } else {
                throw new Error("Incorrect argument");
            }
            return this;
        },
        
        /**
         * 
         * @param {String} fname The field name
         * @returns {Boolean}
         */
        hasField: function(fname) {
            return !!this.__fieldTypes[fname];
        },
        /**
         * 
         * @param {type} fname The field name
         * @returns {String|Function|SereniX.types.Type}
         */
        getType: function(fname) {
            return this.__fieldTypes[fname];
        },
        /**
         * 
         * @param {String|Number} fo The field name or the fieldindex
         * @returns {OTypeField}
         */
        getField: function(fo) {
            if (fo instanceof Number || fo instanceof String) {
                fo = fo.valueOf();
            }
            if (Number.isInteger(fo)) {
                return this.__fields[fo];
            }
            if (typeof fo === 'string') {
                return this.__fieldMap[fo];
            }
            throw new Error("Incorrect argument");
        },
        /**
         * 
         * @param {OTypeField|Object} fo
         * @returns {Structure}
         */
        addField: function(fo) {
            if (!(fo instanceof OTypeField)) {
                fo = new OTypeField(fo);
            }
            var name = fo.getName();
            if (this.__fieldMap[name]) {
                throw new Error("Field already exists with the ame name: '" + name + "'");
            }
            this.__fields[this.__fields.length] = fo;
            this.__fieldTypes[name] = fo.getType();
            this.__fieldMap[name] = fo;
            this.__fieldNames[this.__fieldNames.length] = name;
            return this;
        }
    }
);


defineClass(
    'SereniX.types.ObjectType',
    /**
     * 
     * @param {type} [nt]
     * @returns {NamedType}
     * @class NamedType
     */
    function ObjectType(nt) {
        
        if (nt instanceof String) {
            nt = nt.valueOf();
        }
        if (typeof nt === 'string') {
            this.setName(nt);
            if (arguments.length > 1 && isPlainObject(arguments[1])) {
                this.setStructure(arguments[1]);
            }
        } else if (isPlainObject(nt)) {
            this.setName(nt.name||nt.Name||nt.typeName||nt.TypeName||"");
            this.setStructure(nt.structure||nt.Structure||nt.fields||nt.Fields||nt.properties||nt.Properties);
        }
    },
    
    SereniX.types.Type,
   
    {
    
        /**
         * 
         * @param {type} name
         * @returns {Param}
         */
        setName : function(name) {
            this._name = name;
            return this;
        },
        /**
         * 
         * @returns {String} 
         */
        getName : function() {
            return this._name;
        },
        /**
         * 
         * @param {Object|Array} s  The structure metadata/definition or the structure' fields.
         * @returns {NamedType}
         */
        setStructure : function(s) {
            this._structure = s instanceof SereniX.types.Structure ? s : new SereniX.types.Structure(s);
            return this;
        },
        /**
         * Returns true if the object is of this type
         * @param {type} obj
         * @param {Boolean} [strict=SereniX.types.ObjectType.IS_TYPE_DEFAULT_STRICT]
         * @returns {Boolean}
         */
        is : function(obj, strict) {
            if (arguments.length === 0) {
                throw new Error("The value/object argument not specified");
            }
            if (typeof strict === 'undefined' || strict === null) {
                var s = SereniX.types.ObjectType.IS_TYPE_DEFAULT_STRICT;
                if (typeof s === 'string') {
                    s = s.toLowerCase();
                    if (s === 'none' || s === 'all') {
                        strict = s;
                    } else if (s === 'no' || s === '0') {
                        strict = false;
                    }  else if (s === 'yes' || s === '1') {
                        strict = true;
                    } else if (!s) {
                        strict = strict = true;
                    } else {
                        strict = toBool(strict);
                    }
                } else {            
                    strict = true;
                }
            }
            if (strict instanceof Boolean || strict instanceof Number || strict instanceof String ) {
                strict = strict.valueOf();
            }
            var _strict;
            if (typeof strict === 'string') {
                strict = strict.toLowerCase();
                if (strict !=='all' && strict !== 'none') {
                    strict = toBool(strict);
                }
            } else if (typeof strict === 'boolean') {
                _strict = false;
            } else if (typeof strict === 'number') {
                _strict = strict - 1;
                if (_strict <0) {
                    _strict = false;
                }
                if (strict <0) {
                    strict = false;
                }
            }
            if (!isPlainObject(obj)) {
                return false;
            }
            var s = this._structure, names = s.__fieldNames.slice(), val, type;        
            
            for (var name in obj) {
                if (hasOwnProp(obj, name)) {
                    val = obj[name];
                    type = s.getType(name);
                    if (!type) {
                        if (strict && strict !== 'none') {
                            return false;
                        }
                    } else if (type.isTypeOf(val, _strict)) {
                        names.splice(names.indexOf(name), 1);
                    } else {
                        return false;
                    }
                }
            }
            if (names.length === 0) {
                return true;
            }
            for (var i = 0, n = names.length; i < n; i++) {
                if (!s.getField(names[i]).isOptional()) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 
         * @param {String} [name]
         * @returns {SereniX.types.ObjectType}  The registered object
         */
        register : function(name) {
            SereniX.types.ObjectType.register(this, name);
            return this;
        },
        /**
         * 
         * @param {String} [name]
         * @returns {SereniX.types.ObjectType}
         */
        unregister : function(name) {
            SereniX.types.ObjectType.unregister(this, arguments.length ? name : this.getName());
            return this;
        },
        /**
         * 
         * @param {type} name
         * @returns {unresolved}
         */
        getField : function(name) {
            return this.__structure_.getField(name);
        }
    }
);

SereniX.types.ObjectType.__types__ = {};
/**
 * 
 * @param {ObjectType} type
 * @param {String} [name]
 * @returns {undefined}
 */
SereniX.types.ObjectType.register = function(type, name) {
    if (!(type instanceof SereniX.types.ObjectType)) {
        throw new Error("Incorrect object type");
    }
    name = name||type.getName();
    var types = this.__types__;
    if (types[name]) {
        throw new Error("A type already registered with the same name");
    }
    types[name] = type;
    globalNS[name] = type;
    var o = globalNS, tokens = name.split(/\./g), last = tokens.length - 1;
    for (var i = 0; i < last; i++) {
        o = o[tokens[i]]||{};
    };
    o[tokens[last]] = type;
};
/**
 * 
 * @param {String|SereniX.types.ObjectType|Object} type
 * @returns {SereniX.types.ObjectType}
 */
SereniX.types.ObjectType.getInstance=function(type) {
    if (type instanceof SereniX.types.ObjectType) return type;
    if (typeof type === 'string') {
        return SereniX.types.ObjectType.getType(type);
    }
    if (isPlainObj(type)) {
        return new SereniX.types.ObjectType(type);
    }
};
/**
 * 
 * @param {String|SereniX.types.ObjectType} t
 * @returns {undefined}
 */
SereniX.types.ObjectType.unregister = function(t) {
    var name;
    if (typeof t === 'string') {
        delete this.__types__[name = t];
    } else {
        delete this.__types__[name=t.getName()];
    }
    var tokens = name.split(/\./g), o = globalNS, last = tokens.length - 1;
    for (var i = 0; i < last; i++) {
        o = o[tokens[i]];
        if (!o) return false;
    };
    delete o[tokens[last]];
    if (last) {
        delete globalNS[name];
    }
};

SereniX.types.ObjectType.getType = function(name) {
    return this.__types__[name];
};

SereniX.types.ObjectType.prototype.create = function(props) {
    var o = {}, p, f, Types = SereniX.types.Types, fields = this.getFields();
    Object.defineProperty(o, '__', { value: this, writable: false, enumerable: false, configurable: false });
    if (isPlainObj(props)) {
        fields.forEach(function(f) {
            n = f.getName();
            var v = props[n];
            if (((v === undefined || v=== null) && !f.isOptional()) || !Types.isTypeOf(v, f.getType())){
                throw new Error("Incorrect value for field '" + n + "'");
            }
            function _get() {
                return this[_get.key];
            }
            function _set(v) {
                if (((v === undefined || v === null) && !_set.field.isOptional()) || !Types.isTypeOf(v, _set.field.getType())) {
                    throw new Error("Incorrect value");
                }
                this[_set.key] = v;
            }
            _set.field = f;
            _get.property = _set.property = n;  
            _get.key = _set.key = "__" + n + "_";
            Object.defineProperty(o, n, {
                get: _get,
                set: _set,
                enumerable: true
            });
            o[n] = v;
        });
    }
    return o;
};

SereniX.types.ObjectType.IS_TYPE_DEFAULT_STRICT = 'none';

var ObjectType = SereniX.types.ObjectType;

ObjectType.prototype.isTypeOf = ObjectType.prototype.is;

ObjectType.prototype.accept = ObjectType.prototype.is;

SereniX.types.Object = ObjectType;


defineClass(
    'SereniX.types.VariableType',
    /**
     * 
     * @param {type} [nt]
     * @returns {NamedType}
     * @class NamedType
     */
    function VariableType(nt) {
        this._base = "any";
        if (nt instanceof String) {
            nt = nt.valueOf();
        }
        if (typeof nt === 'string') {
            this.setName(nt);
            if (arguments.length > 1) {
                this.setBase(arguments[1]||"any");
            }
            this.setVariableName(arguments[2]||this._name);
        } else if (isPlainObject(nt)) {
            this.setName(nt.name||nt.Name||nt.typeName||nt.TypeName||"");
            this.setBase(nt.base||nt.Base||nt.default||nt.Default);
            this.setVariableName(nt.variableName||nt.VariableName||nt.variable||nt.Variable);
        }
    },
    
    SereniX.types.Type,
   
    {
    
        /**
         * 
         * @param {type} name
         * @returns {Param}
         */
        setName : function(name) {
            this._name = name;
            return this;
        },
        /**
         * 
         * @returns {String} 
         */
        getName : function() {
            return this._name;
        },
        /**
         * 
         * @param {String|Function|SereniX.types.Type} base  The structure metadata/definition or the structure' fields.
         * @returns {VariableType}
         */
        setBase : function(base) {
            if (base instanceof String) {
                base = base.valueOf();
            }
            var t = typeof base;
            if ((t === 'string' && base) || t === 'function' || t instanceof Function || base instanceof SereniX.types.Type) {
                this._base = base;
                return this;
            }
            
        },
        /**
         * 
         * @returns {String|Function|SereniX.types.Type}
         */
        getBase: function() {
            return this._base||'any';
        },
        /**
         * 
         * @param {String} name The variable name
         * @returns {VariableType}
         */
        setVariableName : function(name) {
            this._varName = name;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getVariableName: function() {
            return this._varName;
        },
        /**
         * Returns true if the object is of this type
         * @param {type} value
         * @param {Boolean} [strict=SereniX.types.ObjectType.IS_TYPE_DEFAULT_STRICT]
         * @returns {Boolean}
         */
        is : function(value, strict) {
            if (arguments.length < 2) {
                strict=SereniX.types.ObjectType.IS_TYPE_DEFAULT_STRICT;
            }
            var varTypes = this.__$$object$$__ ? this.__$$object$$__.__$$variableTypes$$__ : {};
            
            var type = varTypes[this._varName]||this._base||'any',
                t = typeof type;
            if (t === 'function') {
                return value instanceof type;
            }
            if (t === 'string') {
                return SereniX.types.Type.isTypeOf(value, type);
            }
            if (type instanceof SereniX.types.Type) {
                return type.is(value, strict);
            }
            throw new Error("Incorrect type");
        },
        /**
         * 
         * @param {String} [name]
         * @returns {SereniX.types.ObjectType}  The registered object
         */
        register : function(name) {
            SereniX.types.VariableType.register(this, name);
            return this;
        },
        /**
         * 
         * @param {String} [name]
         * @returns {SereniX.types.ObjectType}
         */
        unregister : function(name) {
            SereniX.types.VariableType.unregister(this, arguments.length ? name : this.getName());
            return this;
        }
    }
);

/**
 * 
 * @property {object} Temporary object: shall be setted checking the type of a value to set property value.
 */
Object.defineProperty(SereniX.types.VariableType.prototype, 'object', {
    get: function() {
        return this.__$$object$$__;
    },
    set : function(o) {
        if (!isPlainObj(o)) throw new Error("Incorrect argument: plain object expected");
        this.__$$object$$__ = o;
    },
    configurable: true,
    enumerable: true
});

/**
 * 
 * @alias SereniX.types.VariableType
 * @name SereniX.types.VarType
 * @class SereniX.types.VarType
 */
SereniX.types.VarType = SereniX.types.VariableType;
/**
 * 
 * @alias SereniX.types.VariableType
 * @name VarType
 * @class VarType
 */
var VarType =  SereniX.types.VariableType;
/**
 * 
 * @alias SereniX.types.VariableType
 * @name VariableType
 * @class VariableType
 */
var VariableType = VarType;
/**
 * 
 * @alias SereniX.types.VariableType.prototype.is
 * @function
 */
VarType.prototype.isTypeOf = VarType.prototype.is;
/**
 * 
 * @alias SereniX.types.VariableType.prototype.is
 * @function
 */
VarType.prototype.accept = VarType.prototype.is;



SrnX = SereniX;