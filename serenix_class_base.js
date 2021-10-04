/* 
 * The MIT License
 *
 * Copyright 2020-2021 Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



//$require_once('serenix_object.js');
//$require_once('serenix_types.js');

//$require_once("xregexp-all.js");

//$require_once("serenix_parser_statements.js" ;
//$require_once("serenix_statement_parser.js");
//$require_once("serenix_evaluator.js");

if (typeof inBrowser === 'undefined') {
    inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS ==="undefined") {
    if (typeof window ==="undefined") {
        window=globalNS=typeof global!=="undefined" ? global : typeof self!=="undefined" ? self: this;
    } else {
        globalNS = window;
    }
}

if (!globalNS.isArray) {
    globalNS.isArray = Array.isArray;
}

if (!globalNS.hasOwnProp) {
    /**
     * 
     * @param {Object} o  The object
     * @param {String} n  Property name
     * @returns {Boolean}
     */
    globalNS.hasOwnProp = function (o, n) {
        return Object.prototype.hasOwnProperty.call(o, n);
    };
}

if (!globalNS.toBool) {
    /**
     * 
     * @type Array&lt;String&gt;
     */
    SereniX_STRING_TRUE_VALUES = ['true', '1', 'on', 'yes', 'y', 't', 'oui', 'ok', 'o'];
    /**
     * 
     * @type Array&lt;String&gt;
     */
    SereniX_STRING_FALSE_VALUES = ['false', '0', 'off', 'no', 'n', 'f', 'non', 'ko', 'nok'];
    /**
     * 
     * @param {Boolean|Number|String} b The boolean  brepresention. It can be a 
     *     string, anumber or a boolean <b>This parameter is mandatory</b>
     * @returns {Boolean} The returned values are <b color="blue">true</b> or  
     *     <b color="blue">false</b>.
     */
    globalNS.toBool = function(b) {
        if (b === null || b === '' || b === undefined) {
            if (arguments.length > 1) {
                var defVal = arguments[1];
                if (typeof defVal === 'boolean') {
                    return defVal;
                }
                if (typeof defVal === 'string') {
                    defVal = defVal.toLowerCase();
                    if (SereniX_STRING_TRUE_VALUES.indexOf(defVal) >= 0) {
                        return true;
                    }
                    if (SereniX_STRING_FALSE_VALUES.indexOf(defVal) >= 0) {
                        return false;
                    }
                }
            }
            return false;
        }
        var type = typeof b;
        if (type === 'boolean') {
            return b;
        }
        if (type === 'number' ) {
            return b === 0 ? false : true;
        }
        if (type === 'undefined') {
            return false;
        }
        if (type !== 'string' ) {
            throw "Incorrect argument";
        }
        var s = b.toLowerCase();
        if (SereniX_STRING_TRUE_VALUES.indexOf(s) >= 0) {
            return true;
        }
        if (SereniX_STRING_FALSE_VALUES.indexOf(s) >= 0) {
            return false;
        }
    };
}
//import SereniX.types.Array : require serenix_types.js loaded
var TArray =  SereniX.types.Array;



var DEFAULT_SET_TOKENS_DELIMITER = " ";

var SUPER_CLASS_CONSTRUCTOR_INHERITENCE = true;

var OUTER_VALUES_TYPE_MARKER = ';';

var OUTER_VALUES_TYPE_OPENER = '<';

var OUTER_VALUES_TYPE_CLOSER = '>';

var INNER_CLASS_VALUES_TYPE_OPENER = "{{";

var INNER_CLASS_VALUES_TYPE_CLOSER = "}}";
/**
 * 
 * @type String
 */
var SERENIX_REF_TYPE_MARKER_SYMBOL = "";

var DEFAULT_VALUE_KEYWORDS = { 
    "now" : function(type, format) {
        var now = Date.now();
        if (type === 'string') {
            if (!format) {
                return "'" + now + "'";
            }
            var dt = new Date(now);
            return dt.format(format);
        } else if (type === 'datetime') {
            return new Date(now);
        } else if (type === 'date') {
            var dt = new Date(now);
            dt.setHours(0,0,0,0);
            return dt;
        } else if (type === 'number') {
            return now;
        }
        return now;
    }, 
    "sysdate" : function(type, format) {
        var dt = new Date();
        dt.setHours(0,0,0,0);
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd");
        }
        return dt;
    }, 
    "systimestamp": function(type, format) {
        var dt = new Date();
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd HH:mm:ssZ");
        }
        return dt;
    }, 
    "sysdatetime": function(type, format) {
        var dt = new Date();
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd HH:mm:ssZ");
        }
        return dt;
    }, 
    "today": function(type, format) {
        var dt = new Date();
        dt.setHours(0,0,0,0);
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd");
        }
        return dt;
    }, 
    "yesterday": function(type, format) {
        var dt = new Date();
        dt.setHours(0,0,0,0);
        dt.setTime(dt.getTime() - 24*60*60*1000);
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd");
        }
        return dt;
    }, 
    "tomorrow":function(type, format) {
        var dt = new Date();
        dt.setHours(0,0,0,0);
        dt.setTime(dt.getTime() + 24*60*60*1000);
        if (type === 'string') {
            return dt.format(format||"yyyy-MM-dd");
        }
        return dt;
    }, 
    "systime":function(type, format) {
        var dt = new Date();
        dt.setYear(0);
        dt.setMonth(0);
        dt.setDate(1);
        if (type === 'string') {
            return dt.format(format||"HH:mm:ss");
        }
        return dt;
    },
    "sysyear":function(type, format) {
        var dt = new Date();
        dt = dt.getYear();
        if (type === 'string') {
            return "" + dt;
        }
        return dt;
    },
    "sysmonth":function(type, format) {
        var dt = new Date();
        dt = dt.getMonth();
        if (type === 'string') {
            return "" + dt;
        }
        return dt;
    },
    "sysday":function(type, format) {
        var dt = new Date();
        dt = dt.getDate();
        if (type === 'string') {
            return "" + dt;
        }
        return dt;
    }
};

DEFAULT_VALUE_KEYWORDS.sys_timestamp = DEFAULT_VALUE_KEYWORDS.systimestamp;
DEFAULT_VALUE_KEYWORDS.sys_datetime = DEFAULT_VALUE_KEYWORDS.sysdatetime;
DEFAULT_VALUE_KEYWORDS.sys_date = DEFAULT_VALUE_KEYWORDS.sysdate;
DEFAULT_VALUE_KEYWORDS.sys_year = DEFAULT_VALUE_KEYWORDS.sysyear;
DEFAULT_VALUE_KEYWORDS.sys_month = DEFAULT_VALUE_KEYWORDS.sysmonth;
DEFAULT_VALUE_KEYWORDS.sys_day = DEFAULT_VALUE_KEYWORDS.sysday;
DEFAULT_VALUE_KEYWORDS.sys_time = DEFAULT_VALUE_KEYWORDS.systime;
DEFAULT_VALUE_KEYWORDS.current_timestamp = DEFAULT_VALUE_KEYWORDS.systimestamp;
DEFAULT_VALUE_KEYWORDS.current_datetime = DEFAULT_VALUE_KEYWORDS.sysdatetime;
DEFAULT_VALUE_KEYWORDS.current_date = DEFAULT_VALUE_KEYWORDS.sysdate;
DEFAULT_VALUE_KEYWORDS.current_year = DEFAULT_VALUE_KEYWORDS.sysyear;
DEFAULT_VALUE_KEYWORDS.current_month = DEFAULT_VALUE_KEYWORDS.sysmonth;
DEFAULT_VALUE_KEYWORDS.current_day = DEFAULT_VALUE_KEYWORDS.sysday;
DEFAULT_VALUE_KEYWORDS.current_time = DEFAULT_VALUE_KEYWORDS.systime;

if (!String.prototype.equals) {
    String.prototype.equals = function(s) {
        if (s instanceof String) {
            return this.toString() === s.toString();
        }
        if (typeof s !== 'string') {
            return false;
        }
        return this.toString() === s;
    };
}
/**
 * Returns true if o is primitive number or object number. Otherwise, returns false.
 * @param {type} o
 * @returns {Boolean}
 */
function isNum(o) {
    return typeof o === 'number' || o instanceof Number;
} 

/**
 * 
 * @param {type} o
 * @returns {Boolean}
 */
function isBoolean(o) {
    return typeof o === 'boolean' || o instanceof Boolean;
}
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 */
function isString(o) {
    return typeof o === 'string' || o instanceof String;
}
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 */
function isFunc(o) {
    return typeof o === 'function' || o instanceof Function;
}
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 */
function isPrimtiveType(o) {
    return PRIMITIVE_TYPES.indexOf(typeof o) >= 0 || o === null;
}
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 * @see isPrimtiveType
 */
var isPrimtive = isPrimtiveType;
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 * @see isPrimtiveType
 */
var $isPrimtive = isPrimtiveType;

/**
 * 
 * @param {type} o
 * @returns {Boolean}
 * @see isPrimtiveType
 */
var isJSPrimtive = isPrimtiveType;
/**
 * 
 * @param {type} o
 * @returns {Boolean}
 * @see isPrimtiveType
 */
var $isJSPrimtive = isPrimtiveType;

/**
 * Check if the given value is a plain object: <b>an object that is not an array 
 * nor a function</b>.
 * Returns <b color="blue">true</b> if it's a plain object and 
 * <b color="blue">false</b> otherwise.
 *
 * @param {*} val The value to check if it's a plain object
 * @returns {Boolean}
 */
function isPlainObject(val) {
    return typeof val === 'object' 
            && Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @type RegExp
 */
SereniX.DOUBLE_QUOTED_SUBSTRING_BASE_RE  = /"[^"]*"/;
/**
 * 
 * @type RegExp
 */
SereniX.SINGLE_QUOTED_SUBSTRING_BASE_RE  = /'[^']*'/;

/**
 * 
 * @type String
 */
globalNS["SERENIX_JS_SINGLE_QUOTED_SUBSTRING_ESCAPER"] = '\\';
/**
 * 
 * @type String
 */
globalNS["SERENIX_JS_DOUBLE_QUOTED_SUBSTRING_ESCAPER"] = '\\';
/**
 * Regular expression of a single quoted string with '\' as 
 * single quote escaper.
 * @type RegExp
 */
globalNS["SERENIX_JS_SINGLE_QUOTED_SUBSTRING_RE"]  = /'(?:[\\]'|[^'])*'/;
/**
 * Regular expression of a double quoted string with '\' as double quote 
 * escaper.
 * @type RegExp
 */
globalNS["SERENIX_JS_DOUBLE_QUOTED_SUBSTRING_RE"]  = /"(?:[\\]"|[^"])*"/;
/**
 * Regular expression of a quoted string with '\' as quote escaper.
 * @type RegExp
 */
globalNS["SERENIX_JS_QUOTED_SUBSTRING_RE"]  = /(?:"(?:[\\]"|[^"])*)|(?:'(?:[\\]'|[^'])*')"/;

/**
 * Regular expression of a single quoted string with single quote character as 
 * single quote escaper.
 * @type RegExp
 */
globalNS["SERENIX_SINGLE_QUOTED_SUBSTRING_RE"]  = /'(?:''|[^'])*'/;
/**
 * Regular expression of a double quoted string with double quote character as 
 * double quote escaper.
 * @type RegExp
 */
globalNS["SERENIX_DOUBLE_QUOTED_SUBSTRING_RE"]  = /"(?:""|[^"])*"/;
/**
 * Regular expression of a double quoted string with double quote character as 
 * double quote escaper.
 * @type RegExp
 */
globalNS["SERENIX_QUOTED_SUBSTRING_RE"]  = /(?:"(?:""|[^"])*")|(?:'(?:''|[^'])*')/;
/**
 * 
 * @type RegExp
 */
var SERENIX_QUOTED_STRING_RE  = /^(?:"(?:(""|[^"])*)")|(?:'(?:(''|[^'])*)')$/;
/**
 * 
 * @type Array
 */
var SERENIX_REGEXP_MODIFIERS = ['m', 'g', 'i'];
/**
 * 
 * @type Array
 */
var SERENIX_QUOTES = ['\'', '"', '`'];

/**
 * 
 * @type Array
 */
var JS_QUOTES = ['\'', '"'];
/**
 * 
 * @type Array
 */
var SERENIX_DEFAULT_QUOTES = SERENIX_QUOTES;
/**
 * 
 * @type Array
 */
var SERENIX_QUOTES_ESCAPES = [ '\\', 'quote'];

/**
 * 
 * @type Array
 */
var JS_QUOTES_ESCAPES = [ '\\' ];
/**
 * 
 * @type Array
 */
var SERENIX_DEFAULT_QUOTES_ESCAPES = [ '\\', 'quote'];
/**
 * 
 * @param {type} x
 * @returns {Boolean}
 */
function isRegExp (x) {
    return Object.prototype.toString.call(x) === '[object RegExp]';
}

/**
 * Generates and returns the regular expression to match quoted strings and that
 * corresponds to the given quote(s), escapes and full (match start at the 
 * begining of the string and end at the end of the string).
 * @param {char|String|Array&lt;char&gt;} qt Single chararacter representing a 
 *          quote or string representing multiple quotes or array of single 
 *          characters representing multiple quotes
 * @param {String|Array&lt;String&gt;} esc The escape's symbol(s) of the quote.
 *          <p>When the value is a string, it must a single  
 *          character representing opening and closing quote ("'", '"', '`', 
 *          ...) or one of the keyword <b color="blue">quote</b> or 
 *          <b color="blue">self</b> to specify that the quote can be escaped 
 *          using the quote itseltf. When the value is an array of strings,
 *          each string must belongs to the previous specifications.</p>
 * @param {Boolean} full  Math the full string/text ?
 *          <ul>
 *          <li>The value <b color="blue">true</b> means that regular expression will 
 *          match if and only only if the string starts and ends with the the 
 *          quote.</li>
 *          <li>The value <b color="blue">false</b> means that it can match
 *          a part of a string.</li>
 *          <ul>
 * @returns {String} The generated regular expreion
 */
function getSQuotedStringRe(qt, esc, full, groupKey) {
    var q,err = false;
    if (isArray(qt)) {
        if (qt.length === 0) {
            err = true;
        } else {
            for (var i = 0, n = qt.length; i < n; i++) {
                if (!isString(q = qt[i]) || qt.length === 0) {
                    err = true;
                    break;
                }
            }
        }
    } else if ((typeof qt !== 'string' && !isArray(qt)) || qt.length === 0) {
        err = true;
    }
    if (err) {
        throw new Error('Expected single character or array of single characters');
    }
    
    if (!esc) {
        esc = ['\\'];
    } else if (esc === 'self') {
        esc = [esc];
    } else if (!isArray(esc)) {
        throw new Error('Incorrect escaper');
    }
    var e, re = "", _self = false;
    for (var i = 0, n = qt.length; i < n; i++) {
        q = qt[i];
        for (var k = 0, l = esc.length; k <l; k++) {
            e = esc[k];
            if ((e === 'self' || e === 'quote')) {
                if (!_self) {
                    e = q;
                    _self = true;                    
                } else {
                    continue;
                }
            } else if (e === '\\') e = "\\\\";
            if (re) re += "|";
            re += e + q  ;
        }
        re = q + "((?:" + re + "|[^" + q+ "])*)" + q ;
    }
    if (full) {
        re = "^" + re + "$";
    }
    if (typeof groupKey === 'string') {
        if (!groupKey.startsWith('?')) {
            if (!groupKey.startsWith('<')) {
                groupKey = "?<" + groupKey + ">";
            } else {
                groupKey = "(?" + groupKey;
            }
        }
        re = "("+ groupKey + re + ")";
    } else if (groupKey) {
        re = "(" + re + ")";
    }
    return re;
}

/**
 * Generates and returns the regular expression to match quoted strings and that
 * corresponds to the given quote(s), escapes, modifiers
 * @param {char|String|Array&lt;char&gt;} qt Single chararacter representing a 
 *          quote or string representing multiple quotes or array of single 
 *          characters representing multiple quotes
 * @param {String|Array&lt;String&gt;} esc The escape's symbol(s) of the quote.
 *          <p>When the value is a string, it must a single  
 *          character representing opening and closing quote ("'", '"', '`', 
 *          ...) or one of the keyword <b color="blue">quote</b> or 
 *          <b color="blue">self</b> to specify that the quote can be escaped 
 *          using the quote itseltf. When the value is an array of strings,
 *          each string must belongs to the previous specifications.</p>
 * @param {String|Array&lt;String&gt;} [modifiers=""] The modifiers of the 
 *          regular epression.  A modifier is on of the following letters:
 *          <ul>
 *          <li><b color="blue">g</b> enables “global” matching. When using the 
 *          replace() method, specify this modifier to replace all matches, 
 *          rather than only the first one.</li>
 *          <li><b color="blue">i</b> makes the regex match case 
 *              insensitive.</li>
 *          <li><b color="blue">m</b> enables “multi-line mode”. In this mode, 
 *          the caret and dollar match before and after newlines in the 
 *          subject string.</li>
 *          <ul>
 * @param {Boolean} full  Math the full string/text ?
 *          <ul>
 *          <li>The value <b color="blue">true</b> means that regular expression will 
 *          match if and only only if the string starts and ends with the the 
 *          quote.</li>
 *          <li>The value <b color="blue">false</b> means that it can match
 *          a part of a string.</li>
 *          <ul>
 * @returns {RegExp} The generated regular expreion
 */
function getQuotedStringRe(qt, esc, modifiers, full) {
    var re = getSQuotedStringRe(qt, esc, full);
    
    if (isArray(modifiers)) {
        var i = intersect(SERENIX_REGEXP_MODIFIERS, modifiers);
        if (i.length < modifiers.length) {
            throw "Incorrect modifiers";
        }
        modifiers = modifiers.join("");
        
    } else if (typeof modifiers === "string") {
        var m = modifiers.replace(/\s/g, "");
        var i = intersect(SERENIX_REGEXP_MODIFIERS, m);
        if (i.length < m.length) {
            throw "Incorrect modifiers! '" + modifiers + "'";
        }
        modifiers = m;
    } else if (!modifiers) {
        modifiers = "";
    } else {
        throw "Incorrect modifiers";
    }
    return new RegExp(re, modifiers);
}
/**
 * 
 * @param {Object|String} o
 * @returns {RegExp}
 */
function getRegExp(o) {
    if (isRegExp(o)) { return o; }
    if (typeof o === 'string') { return new RegExp(o); }
    var exp = o.expression||o.regexp||o.regex||o.re;
                    
    if (typeof exp === 'string') {
        var mo = o.mo||o.flags;
        if (isString(mo)) {
            var err = false;
            if (mo.length <= 3) {
                var m, g, i;
                for (var i = 0, n = mo.length; i < n; i++) {
                    switch (mo[i]) {
                        case 'm':
                            if (m) {
                                err = true;
                            }
                            m = true;
                            break;
                        case 'g':
                            if (m) {
                                err = true;
                            }
                            g = true;
                            break;
                        case 'i':
                            if (i) {
                                err = true;
                            }
                            i = true;
                            break;    
                    }
                }
            } else
                err = true;

            if (err)
                throw new Error("Incorrect regular epreion mo : '" + mo + "'");
        }
        exp = new RegExp(exp, mo||'');
    } else if (!isRegExp(exp)) {
        throw new Error("Incorrect o object");
    }
}

/**
 * Returns Date object with "1970-01-01" for the date and the time 
 * corresponding to the given string value.
 * @param {type} sval
 * @returns {stringToTime.t|Date}
 */
function stringToTime(sval) {
    var t = new Date(sval);
    if (Number.isNaN(t.getTime())) {
        if (sval.indexOf("-") < 0) {
            if (sval.indexOf("/") < 0) {
                sval = "1970-01-01 " + sval.trim();
                return new Date(sval);
            }
        }
        return t;
    }
    t.setFullYear(1970);
    t.setMonth(0);
    t.setDate(1);
    return t;
}
/**
 * <p>Converts the given value to an int value. When the given value to convert is 
 * an empty string, returns null. When the value is an instance of Date, returns
 * the return of v.getTime() that is the number of milliseconds since since 
 * January 1, 1970, 00:00:00 UTC.</p> 
 * <ul><li>When the given value to convert is a string and starts with '0x' or '0X', 
 * the value of radix used for conversion is 16 whether the radix is specified 
 * or not.</li>
 * <li>When the given value to convert 
 * is a string and starts with '0' or '0', the value of radix used for 
 * conversion is 8 whether the radix is specified or not.</li></ul>
 * @param {String|Date} v 
 * @param {int} radix This parameter is optional 
 * @returns {int|null}
 */
function toInteger(v, radix) {
    if (v === '') { return null; }
    if(typeof v === 'number' && (!Number.isFinite(v) || Number.isInteger(v)) ) {
        return v;
    }
    if (typeof v === 'undefined') {
        throw new Error("Argument with undefined value");
    }
    if (typeof v === null) {
        throw new Error("Null argument");
    }
    if (v instanceof Date) {
        return v.getTime();
    }
    if (v === 'true' || v === true) {
        return 1;
    }
    if (v === 'false' || v === false) {
        return 0;
    }
    if (arguments.length > 1) {
        if (!Number.isInteger(v)) {
            throw "Incorrect radix argument";
        }
        return parseInt(v, radix);
    }
    if (typeof v === 'string') {
        v = v.trim();
        if (v.match(/^[-+]?0[xX]/)) {
            return parseInt(v, 16);
        } else if (v.match(/^0/)) {
            return parseInt(v, 8);
        } else if (v.match(/^[1-9][0-9]*$/)) {
            return parseInt(v);
        } else {
            // return a value that is not a number : the call of Number.isNaN
            // with the retuen value will return true
            return parseInt("a");
        }        
    }
    
    throw new Error("Can not converted to integer");
}

/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
function isNoValue(v) {
   return (v === null) || (typeof v === 'undefined');
}
if (typeof SereniX === 'undefined') {
    SereniX = {};
}

if (!SereniX.Exception) {
    /**
     * 
     * @param {String} msg
     * @param {String} code
     * @param {String} name
     * @param {Number} status
     * @param {type} cause
     * @returns {ValueError}
     * @class ValueError
     */
    function Exception(msg, code, name, status, cause) {
        if (msg instanceof String || msg instanceof Number) {
            msg = msg.valueOf();
        }
        if (arguments.length === 1) {
            if (isPlainObject(msg)) {
                code = msg.code;
                msg = msg.msg||msg.message;
                status = msg.status;
                name = msg.name;
                cause = msg.cause;
            } else if (typeof msg === 'number') {
                status = msg;
                msg = "";
            }
        } else if (typeof code === 'number') {
            var x = status;
            status = code;
            if (typeof name === 'string') {
                if (typeof x === 'etring') {
                    code = name;
                    name = x;
                }
            }
        } else if (typeof name === 'number') {
            var x = status;
            status = name;
            if (x instanceof Error) {
                name = typeof cause === 'string' ? cause : "";
                cause = x;
            } else if (typeof x === 'string') {
                name = x;
            }
        }
        this.__ = {};
        this.__.code_ = code||"";
        this.__.name_ = name||"";
        this.__.status_ = status;
        this.__.message_ = msg||"Value error";
        try {
            this.__.stack_ = (new Error(this.___message_, cause)).stack;
        } catch (e) {}
        Object.defineProperties(this, {
            message : { value : this.__.message_, writable: false, enumerable: false, configurable: true},
            code : { value : this.__.code_, writable: false, enumerable: false, configurable: true},
            status : { value : this.__.status_, writable: false, enumerable: false, configurable: true},
            name : { value : this.__.name_, writable: false, enumerable: false, configurable: true},
            stack : { value : this.__.stack_, writable: false, enumerable: false, configurable: true}
        });
    }
    Exception.prototype = new Error();
    Exception.__CLASS__ = Exception.prototype.__CLASS__ = Exception;

    Exception.__CLASS_NAME__ = Exception.prototype.__CLASS_NAME__ = "ValueError";
    SereniX.Exception = Exception;
}
/**
 * 
 * @param {String} msg
 * @param {String} code
 * @param {String} name
 * @param {Number} status
 * @param {type} cause
 * @returns {ValueError}
 * @class ValueError
 */
function PropertyDefinitionError(msg, code, name, status, cause) {
    SereniX.Exception.apply(this, arguments);
}
PropertyDefinitionError.prototype = new SereniX.Exception();

PropertyDefinitionError.__CLASS__ = PropertyDefinitionError.prototype.__CLASS__ = ValueError;

PropertyDefinitionError.__CLASS_NAME__ = PropertyDefinitionError.prototype.__CLASS_NAME__ = "ValueError";



/**
 * 
 * @param {String} msg
 * @param {String} code
 * @param {String} name
 * @param {Number} status
 * @param {type} cause
 * @returns {ValueError}
 * @class ValueError
 */
function ValueError(msg, code, name, status, cause) {
    SereniX.Exception.apply(this, arguments);
}
ValueError.prototype = new SereniX.Exception();

ValueError.__CLASS__ = ValueError.prototype.__CLASS__ = ValueError;

ValueError.__CLASS_NAME__ = ValueError.prototype.__CLASS_NAME__ = "ValueError";




/**
 * 
 * @param {String} msg
 * @param {String} code
 * @param {String} name
 * @param {Number} status
 * @param {type} cause
 * @returns {ValueError}
 * @class ValueError
 */
function RangeError(msg, code, name, status, cause) {
    RangeError.__SUPER_CLASS__.apply(this, arguments);
}


RangeError.prototype = new ValueError();

RangeError.__CLASS__ = RangeError.prototype.__CLASS__ = RangeError;

RangeError.__CLASS_NAME__ = RangeError.prototype.__CLASS_NAME__ = "RangeError";

RangeError.__SUPER_CLASS__ = RangeError.prototype.__SUPER_CLASS__ = ValueError;



/**
* Each call of incorrect() function, throws an incorrect value exception.
* @param {type} v
* @param {String} [msg="Incorrect value"] The error message.
* @returns {undefined}
* @throws {Error} 
*/
function incorrectValue(v, msg) {
   var s = null === v  
           ? "null" : (typeof v === ' undefined'  
           ? 'undefined': valueToString(v, 2 /* max level */));
   throw new ValueError((msg||"Incorrect value") + ": " + s);
}
/**
* Each call of incorrect() function, throws an incorrect value exception.
* <p>This function is alias of incorrectValue function.</p>
* @param {type} v
* @param {String} [msg="Incorrect value"] The error message.
* @returns {undefined}
* @throws {Error} 
*/
var incorrect = incorrectValue;
/**
* Each call of incorrect() function, throws an incorrect value exception.
* <p>This function is alias of incorrectValue function.</p>
* @param {type} v
* @param {String} [msg="Incorrect value"] The error message.
* @returns {undefined}
* @throws {Error} 
*/
var incorrectVal = incorrectValue;
/**
* Throws an eception when the given value is null or undefined.
* @param {type} v
* @returns {undefined}
* @throws {Error} 
*/
function noValue(v) {
   if (v === null ) {
       throw new ValueError("Null value");
   }
   if (typeof v === 'undefined') {
       throw new ValueError("Undefined value");
   }
}
/**
 * Throws an eception when the given value is null.
 * @param {type} v
 * @param {String} [msg="Null value"] The error message.
 * @returns {undefined}
 * @throws {Error} 
 */
function nvlExcept(v, msg) {
   if (v === null ) {
       throw new ValueError(msg||"Null value");
   }
}
var nullExcept = nvlExcept;

var nullError = nvlExcept;

var nvlError = nvlExcept;
/**
 * Each call of incorrectArg() function, throws an incorrect value exception.
 * @param {String} [msg="Incorrect argument"]
 * @returns {undefined}
 * @throws {Error} 
 */
function incorrectArg(msg) {
    throw new Error(msg||"Incorrect argument");
}
/**
 * Each call of incorrectArgs() function, throws an incorrect value exception.
 * @param {String} [msg="Incorrect arguments"]
 * @returns {undefined}
 * @throws {Error} 
 */
function incorrectArgs(msg) {
    throw new Error(msg||"Incorrect arguments");
}


/**
 * Each call of unexpectedChar() function, throws an unexpected charcater exception.
 * @param {char} [ch]
 * @param {Number} [num]
 * @param {Number} [column]
 * @param {String} [msg="Unexpected character"]
 * @returns {undefined}
 * @throws {Error} 
 */
function unexpectedChar(ch, num, column, msg) {
    var a = arguments, 
        len = a.length, index = false, lineNum = false;
        m;
    if (len === 2 && typeof num ==="number") {
        index = num;
        
    } else if (len === 3 && typeof num ==="number" && typeof column ==="string") {
        index = num;
        var m = msg;
        msg =  column;
        column = m;        
    } else {
        lineNum = num;
        m = (len > 1 && typeof a[1] === 'string' ? a[1]
            : (len > 3 && typeof a[3] === 'string' ? a[3] : ""))||"Unexpected charcater";
    }
    if (!m) m = m = "Unexpected charcater";
    if (len > 0) {
        m += ": '" + ch + "'";
    }
    if (typeof lineNum !== 'undefined' && lineNum !== false) {
        m += ' at line ' + num;
        if (typeof column ==="number") {
            m += " and column " + column;
        }
    } else if (index !== false) {
        m += ' at index ' + index;
    }
    throw new Error(m);
}
/**
 * 
 * @param {type} v
 * @returns {Boolean}
 */
function isUndef(v) {
    return typeof v === 'undefined';
}
/**
 * Throws an eception when the given value is undefined.
 * @param {type} v
 * @returns {undefined}
 * @throws {Error}
 */
function undef(v) {
   if (typeof v === 'undefined') {
       throw new ValueError("Undefined value");
   }
}
/**
 * Throws an eception when the given value is undefined.
 * @param {type} v
 * @returns {undefined}
 * @throws {Error}
 */
var undefExcept = undef;
/**
 * Throws an eception when the given value is undefined.
 * @param {type} v
 * @returns {undefined}
 * @throws {Error}
 */
var undefError = undef;


function NoDataFound(message) {
    this.___name_ = 'NoDataFound';
    this.___message_ = message||"No data found";
    try {
        this.stack = (new Error()).stack;
    } catch (e) {

    }
}

NoDataFound.prototype = new Error();

function CheckReturn() {
    
}

CheckReturn.__CLASS__ = CheckReturn;

CheckReturn.__CLASS_NAME__ = "CheckReturn";

CheckReturn.prototype.__CLASS__ = CheckReturn;

CheckReturn.prototype.__CLASS_NAME__ = "CheckReturn";

function CheckError(code, message) {
    if (arguments.length > 1) {
        this.__code_ = code;
        this.__message_ = message||"";
    }
}

CheckError.__CLASS__ = CheckError;

CheckError.__CLASS_NAME__ = "CheckError";

CheckReturn.prototype = new CheckReturn();

CheckError.prototype.__CLASS__ = CheckError;

CheckError.prototype.__CLASS_NAME__ = "CheckError";

CheckError.prototype.getCode = function() {
    return this.__code_;
};

CheckError.prototype.getMessage = function() {
    return this.__message_||"";
};

Object.defineProperties(CheckError.prototype, {
    code : { get : CheckError.prototype.getCode, set:function() { throw new Error("Read only property"); }},
    message : { get : CheckError.prototype.getMessage, set:function() { throw new Error("Read only property"); }}
});


function CheckSuccess(returnValue, message) {
    if (isPlainObject(returnValue)) {
        
    } else if (arguments.length > 1) {
        this.__returnValue_ = returnValue;
        this.__message_ = message||"";
        this.__valued__ = true;
    } else if (arguments.length=== 1) {
        this.__returnValue_ = returnValue;
        this.__valued__ = true;
    } else {
        this.__valued__ = false;
    }
}

CheckSuccess.__CLASS__ = CheckSuccess;

CheckSuccess.__CLASS_NAME__ = "CheckSuccess";

CheckReturn.prototype = new CheckReturn();

CheckSuccess.prototype.__CLASS__ = CheckSuccess;

CheckSuccess.prototype.__CLASS_NAME__ = "CheckSuccess";

CheckSuccess.prototype.getReturnValue = function() {
    return this.__returnValue_;
};
/**
 * 
 * @returns {Boolean}
 */
CheckSuccess.prototype.isValued = function() {
    return !!this.__valued__;
};

CheckSuccess.prototype.getMessage = function() {
    return this.__message_||"";
};

Object.defineProperties(CheckSuccess.prototype, {
    returnValue : { get : CheckSuccess.prototype.getReturnValue, set:function() { throw new Error("Read only property"); }},
    message : { get : CheckSuccess.prototype.getMessage, set:function() { throw new Error("Read only property"); }},
    valued : { get : CheckSuccess.prototype.isValued, set:function() { throw new Error("Read only property"); }}
});




Object.defineProperties(NoDataFound.prototype, {
    name: { 
        configurable: true, 
        enumerable: true, 
        get:function() { return this.___name_; },
        set:function() { throw new Error("Read only property"); }
    },
    message: { 
        configurable: true, 
        enumerable: true, 
        get:function() { return this.___message_; },
        set:function() { throw new Error("Read only property"); }
    } 
});


/**
 * 
 * @param {type} value
 * @param {type} maxLevel
 * @param {type} level
 * @param {type} json
 * @returns {String}
 */
function valueToString(value, maxLevel, level, json) {
    if (value === null) return 'null';
    if (typeof value === 'undefined' ) return 'undefined';
    if (value instanceof Date) {
        var qt = level > 1 ? '"': '';
        if (json) {
            return qt + "\\/Date(" + value.getTime() + ")\\/" + qt;
        }
        return qt + value.toString() + qt;
    }
    if (isRegExp(value)) {
        var qt = level > 1 ? '"': '';
        if (json) {
            return qt + "\\/RegExp(" + value.toString() + ")\\/" + qt;
        }
        return qt + value.toString() + qt;
    }
    var tof = typeof value;
    if ( tof === 'number') {
        return "" + value;
    }
    
     else if (tof === 'function') {
        return value.toString();
    }
     else if (tof === 'string') {
        return '"' + value.replace(/["]/g, "\\\"") + "'";
    }
    
    if (json === 'null' || typeof json === 'undefined') {
        json = true;
    }
    if (level === 'null' || typeof level === 'undefined' || level <= 0) {
        level =  1;
    }
    if (arguments.length === 1) {
        maxLevel = null;
    }
    
    var C = value.__CLASS__,  cname = false, sval;
    tof = typeof C;
    if (tof === 'function') {
        if (typeof C.getClassFullName === 'function') {
            cname = C.getClassFullName();
        } else {
            cname = value.__CLASS_FULL_NAME__||value.__CLASS_NAME__||C.name||"";
        }
    } else if (tof === 'string') {
        cname = C;
    } else if (C) {
        cname = value.__CLASS_FULL_NAME__||value.__CLASS_NAME__||C.name||"";
    }
    var exclusions = false;
    
    if (cname !== false) {
        if (Number.isInteger(maxLevel) && level > maxLevel) {
            sval =  "{...}";
        }
        if (value === C) { //If the value is a class
            return (cname ? "`//Class: '" + cname + "\n// ===============" 
                    : "//  Anonymous class\n// ===============" )
                            + "\n" + C.toString() + "`";
        } else { //If the value is an instance of a class
            if (typeof value.toJSON === 'function') {
                return value.toJSON();
            } else if (typeof value.toJSONString === 'function') {
                return value.toJSONString();
            }
            exclusions = ["__CLASS__", "__CLASS_NAME__", "__SINCE__", 
                "__VERSION__", "__AUTHOR__", "defProperty", "__NAME__",
                "__NAMESPACE__", "__NAMESPACE_NAME__", "__NAMESPACE_NAME___",
                "__proto__"
            ];
            
        }
        
    }
    if (!exclusions) {
        exclusions = [];
    }
    var indent = "", innerIndent;
    for (var i = 0; i < level; i++) {
        indent += "  ";
    }
    innerIndent = indent + "  ";
    
    if (isArray(value)) {
        var _json = indent + "[", k = 0, n = value.length;
            
        for (; k < n; k++) {
            if (k > 0) {
                _json += ",\n";
            }
            _json += innerIndent + valueToString(value[k], maxLevel, level + 1, json);
            k++;
        }
        _json += "\n" + indent + "]";
        return _json ;
    }
    
    var _json = indent + "{", k = 0;
            
    for (var name in value) {
        if (hasOwnProp(value, name) && exclusions.indexOf(name) < 0) {
            if (k > 0) {
                _json += ",\n";
            }
            _json += innerIndent + "\"" + name + "\": " + valueToString(value[name], maxLevel, level + 1, json);
            k++;
        }
    }
    _json += "\n" + indent + "}";
    return _json ;

}

/**
 * 
 * Tous les fichiers sources de base seront dans le répertoire .../libs/base et 
 * les autres au moins dans un repertoire de .../libs . Par exemple le fichier 
 * serenix_xml_http_request.js sera dans le répertoire .../libs/ajax
 */


if (typeof globalNS["$isJSInt"] !== 'function') {
    globalNS["$isJSInt"] = function(val) {
        if (typeof val === 'number') {
            return Math.floor(val) === val;
        }
        return false;
    };
}


if (typeof Array.isArray !== 'function') {
   Array.isArray = function(obj) {
       return Object.prototype.toString.call(obj) === '[object Array]';
   };
};

if (typeof globalNS.isArray !== 'function') {
    globalNS.isArray = Array.isArray;
}
if (typeof globalNS.$isArray !== 'function') {
    globalNS.$isArray = Array.isArray;
}

if (!globalNS["SereniX_forname"]) {
    /**
     * Returns the variable object corresponding to the given name.
     * @param {type} name The variable name to search corresponding object.
     * @returns {Object}
     */
    globalNS["SereniX_forname"] = function(name) {
        if (name.startsWith(".")) {
            throw new Error("Incorrect name: starts with '.' : \"" + name + "\"");
        }
        if (name.endsWith(".")) {
            throw new Error("Incorrect name: ends with '.'");
        }
        var args = arguments;
        var pos, own = globalNS, ns, offset = 0;
            while ((pos = name.indexOf('.', offset)) > 0) {
                if (offset === pos) {
                    throw new Error("Incorrect name: too many consecutive charcaters '.' at index position " + (offset - 1));
                }
                ns = own[name.substring(offset, pos)];
                if (!ns) {
                    throw new Error("No parent object corresponding to the name : \"" + name.substring(0, offset) + "\"");
                }
                offset = pos + 1;
                own = ns;
            }
            var o = own[offset === 0 ? name : name.substring(offset)];
            if (!o) {
                var notFoundMsg;
                if (args.length > 1 && typeof args[1] === 'string') {
                    notFoundMsg = args[1];
                }
                throw new Error(notFoundMsg||"No object found");
            }
            return o;
    };
};

if (!globalNS["SereniX_use"]) {
    /**
     * The purpose of SereniX_use function is to create a variable as alias 
     * with the given class as value. When an alias is specified, the variable 
     * name is the alias value, otherwise the variable name is the short name 
     * of the class.
     * <p>The possible invocations are :</p>
     * <ul>
     * <li>SereniX_use( <b><i>{Function|String}</i></b> <b color="red">cls<b> )</li>
     * <li>SereniX_use( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{String}</i></b> alias, <b><i>{Object}</i></b> ctx )</li>
     * <li>SereniX_use( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{String}</i></b> alias )</li>
     * <li>SereniX_use( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{Object}</i></b> ctx, <b><i>{String}</i></b> alias )</li>
     * <li>SereniX_use( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{Object}</i></b> ctx )</li>
     * </ul>
     * Where 
     * <ul>
     * <li>the parameter <b color="red">cls<b> represents the class to set the use or the class 
     * name of the class to set the use;</li>
     * <li><b color="green">alias<b> the name of the variable to create with the given class as value;</li>
     * <li><b color="green">ctx<b> reperesents the alias context/owner (where to 
     * create the alias). When is undefined or null, the global object 
     * <b color="red">window<b> is used as owner.</li>
     * </ul>
     * @returns {Function} The function representing the class to use.
     */
    globalNS["SereniX_use"] = function() {
        var a= arguments,
            cls = a[0], 
            alias = false, 
            ctx = null;
    
        if (a.length === 2) {
            if (typeof a[1] === 'object') {
                ctx = a[1];
                alias = false;
            }
        } else if (a.length > 2) {
            if (typeof a[1] === 'object') {
                ctx = a[1];
                alias = typeof a[2] === 'string' ? a[2] : false;
            } else if (typeof a[1] === 'string') {
                alias = a[1];
                a = a[2];
                ctx = !isArray(a)  && (typeof a) === 'object' ? a :null;
            }
        }
        function forname(name) {
            if (name.startsWith(".")) {
                throw new Error("Incorrect name: starts with '.' : \"" + name + "\"");
            }
            if (name.endsWith(".")) {
                throw new Error("Incorrect name: ends with '.'");
            }            
            if (globalNS.SereniX && (typeof SereniX.Klass === 'function')) {
                return SereniX.Klass.forname(name);
            }
            if (typeof globalNS["Klass"] === 'function') {
                return Klass.forname(name);
            }
            var pos, own = globalNS, ns, offset = 0;
            while ((pos = name.indexOf('.', offset)) > 0) {
                if (offset === pos) {
                    throw new Error("Incorrect name: too many consecutive charcaters '.' at index position " + (offset - 1));
                }
                ns = own[name.substring(offset, pos)];
                if (!ns) {
                    throw new Error("No parent corresponding to the name");
                }
                offset = pos + 1;
                own = ns;
            }
            var cls = own[offset === 0 ? name : name.substring(offset)];
            if (!cls) {
                throw new Error("No class found");
            }
            if (typeof cls !== 'function') {
                throw new Error("The object corresponding to the given name is not a class");
            }
            return cls;
        }
        var c;
        if (typeof cls === 'string') {
            if (!alias) {
                var i = cls.lastIndexOf(".");
                if (i === 0) {
                    throw new Error("Incorrect name: '" + cls + "'");
                }
                alias = i > 0 ? cls.substring(i + 1) : cls;
            }
            c = forname(cls);
            if (!cls) {
                throw new Error("Undefined namespace, class, type or variable: " + cls);
            }
        } else if (typeof cls === 'function') {
            c = cls;
        } else if (globalNS['SereniX'] 
                && (((typeof SereniX.Namespace === 'function') 
                    && cls instanceof SereniX.Namespace) ||
                    ((typeof SereniX.types.Type === 'function') 
                        && cls instanceof SereniX.types.Type)
                    )
                ) {
            c = cls;
        } else {
            throw new Error("The first argument is not a class nor a namespace");
        }
        if (typeof alias === 'string' && alias !== '') {
            (ctx||globalNS)[alias] = c;
        } else {
            alias = typeof cls.getClassFullName === 'function' ? cls.getClassFullName() : 
                    ( typeof cls.getFullClassName === 'function' ? cls.getFullClassName() : 
                    ( typeof cls.getFullName === 'function' ? cls.getFullName() : 
                    cls.__CLASS_FULL_NAME__||cls.__FULL_NAME__||cls.__CLASS_PATH__||cls.__PATH__));

            if (!alias) alias = ( typeof cls.getClassName === 'function' ? cls.getClassName() :
                    cls.__CLASS_NAME__||cls.__NAME__||"");
            if (typeof alias === 'string' && name !== '') {
                var i = alias.lastIndexOf(".");
                (ctx||globalNS)[i < 0 ? alias : alias.substring(i + 1)] = c;
            }
        }
        return c;
    };
}


//========================================================================
//------------------------      Namespace class       --------------------
//========================================================================


/**
 * <div>
 * <div class="title"><b>Namespace</b> class</div>
 * <div>
 * <p><b>Note</b>: Only simple name (a valid name without the '.' namespace 
 * delimiter) are accepted.</p>
 * <p>To create the namespace corresponding to a name 
 * with '.' delimiter, use <b color="blue">Namespace.ns</b> function or 
 * <b color="blue">Namespace.namespace</b> function with the name as argument. 
 * For this case the parent namespace is accessible via the parent field of the 
 * Namespace object or via the getParent()
 * method.</p>
 * </div>
 * </div>
 * @param {string} name The simple name of the namespace. 
 *     <p>A simple name is a name that only has lower or upper 'a' to 'z' 
 *     characters, '$', '_' and digits ('0' to '9' characters) and not starts 
 *     with digit character.</p>
 *     <p>To avoid exception to be thrown, use SereniX.Namespace.namespace(name)
 *     to create such namespace.</p>
 * @returns {Namespace}
 * @class
 * @author Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>
 */
function Namespace(name) {
    var args = arguments;
    if (args.length === 0) {
        throw new Error("A valid namespace: name is mandatory");
    } else {
        name = args[0];
        if (typeof name !== 'string') {
            throw new Error("Incorrect namespace: name argument is not a string");
        }
        if (typeof name === '') {
            throw new Error("Incorrect namespace name: the name is empty");
        }
    }
    if (!Namespace.isValidName(name)) {
        throw new Error("Incorrect namespace name: the name contains '.'.\nUse SereniX.Namespace.namespace(name) to create such namespace.");
    }
    this._name__ = this.__NAME__ = this.__NAMESPACE_NAME__ = name;
    this._parent = null;
    this.namespace = null;
    this._elements = [];
}

Namespace.prototype = new NSNode();

(function(N) {
    
    N.__CLASS_NAME__ = "Namespace";

    N.__NAME__ = "Namespace";

    N.__CLASS__ = N;

    N.__SINCE__ = "July 2020";

    N.__VERSION__ = "1.0";

    N.__AUTHOR__ = "Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>";
    
    /**
     * 
     * @param {String} name
     * @returns {Namespace}
     */
    N.forname = function(name) {
        var NS = this;
        var obj = SereniX_forname(name);
        if (obj instanceof NS) {
            return obj;
        }
        throw new Error("the given name ('" + name + "') does not correspond to a namespace.");
    };
    /**
     * 
     * <p>Alias of Namespace.forname() method.</p>
     * @param {String} name
     * @returns {Namespace}
     */
    N.forName = Namespace.forname;
    /**
     * 
     * <p>Alias of Namespace.forname() method.</p>
     * @param {String} name
     * @returns {Namespace}
     */
    N.fromName = Namespace.forname;
    /**
     * 
     * <p>Alias of Namespace.forname() method.</p>
     * @param {String} name
     * @returns {Namespace}
     */
    N.fromName = Namespace.forname;


    /**
     * Returns true if the argument elt is an instance of SereniX.Klass or an 
     * instance of SereniX.Klass or cls is a function with elt.__CLASS__ and 
     * valid string value of elt.__CLASS_NAME__ or cls.__NAME__. 
     * This function also returns true for named class or function.
     * Otherwise, returns false. 
     * @param {Fuction|Class|Object} elt
     * @returns {Boolean}
     */
    N.isValidElement = function(elt) {
        var K = SereniX.Klass||globalNS["Klass"], 
            C = SereniX.Namespace||globalNS.Namespace;
        if (elt instanceof K || elt instanceof C) {
            return true;
        } else if (typeof elt === 'function' || elt instanceof Function) {
            if (elt === elt.__CLASS__ && (elt.__CLASS_NAME__ ||elt.__NAME__)) {
                return true;
            } else if (typeof elt.name === 'string' && elt.name !== '') {
                return true;
            }
            //TODO
        }
        //TODO
        return false;
    };
    /**
     * 
     * @param {SereniX.Namespace|SereniX.Klass|Function} elt
     * @returns {String}
     */
    N.getElementName = function(elt) {
        var NS = this;
        if (elt instanceof NS) {
            return elt.getName();
        }
        if (typeof elt !== 'function') {
            throw new Error("Incorrect argument: must of type 'function'");
        }
        if (typeof elt.getSimpleName === 'function') {
            return elt.getSimpleName();
        }
        
        if (typeof elt.getShortName === 'function') {
            return elt.getShortName();
        }
        var name = elt.__CLASS_NAME__||elt.__NAME__||elt.name;
        
        if (!name) {
            if (typeof elt.getClassShortName === 'function') {
                return elt.getClassShortName();
            }
            if (typeof elt.getClassName === 'function') {
                name = elt.getClassName();
            } else if (typeof elt.getClassFullName === 'function') {
                name = elt.getClassFullName();
            } else if (typeof elt.getFullClassName === 'function') {
                name = elt.getFullClassName();
            } else {
                return null;
            }
        }
        
        var i = name.lastIndexOf(".");
        if (i >= 0) {
            return name.substring(i + 1);
        }
        return name;
    };

    /**
     * 
     * @param {String} name
     * @returns {Boolean}
     */
    N.isValidName = function(name) {
        var type = typeof name;
        if (type !== 'string') {
            throw new Error("Incorrect argument: string expected but found " + type);
        }
        /*var chars = "[a-zA-Z$_]", 
                digits = "[0-9]";
        
        return new RegExp("^" + chars + "(" + chars + "|" + digits + ")*").test(name);*/
        return /^[a-zA-Z$_]+[a-zA-Z$_0-9]*$/.test(name);
    };
    /**
     * 
     * @param {type} name
     * @returns {Boolean}
     */
    N.isValidFullName = function(name) {
        return /^[a-zA-Z$_]+[a-zA-Z$_0-9]*(?:.[a-zA-Z$_]+[a-zA-Z$_0-9]*)*$/.test(name);
    };
    /**
     * Returns the namespace corresponding to the given namespace name when the 
     * first argument is a string or bind the given elements (first argument as 
     * array) to given namespace. 
     * <p><b>If the namespace name contains '.', many namespaces will be created 
     * and linked hierarchically</b>.</p>
     * <p>When the first argument is an array of string to bind to namespace 
     *     considering that it's an array of pairs, specify it by setting the 
     *     third parameter to true.</p>
     * <p>When the method is called with at least three arguments with the first
     *     argument as an array and the second as a string, the second argument 
     *     represents the namespace and the third represents the parent of the 
     *     namespace</p>
     * 
     * @param {String|Array&lt;String|Namespace&gt;} ns  The namspace name to create when the argument is a string or the list of elements to bind (add or attach) to a namespace
     * @param {Namespace|Strring|...} [_=null]     *     
     * @returns {Namespace} The created or existing namespace when the first argument it's a string
     */
    N.ns = function(ns, _) { 
        'use strict';
        var NS = this;
        
        var _parent;
        
        function _getOrCreate(nsName, parent) {
            var ns, pkg = "", 
                    subs = [], _subs = false,
                    name, 
                    p, o = 0, created, 
                    end= false,
                    nsObj = null;


            while (!end) {
                p = nsName.indexOf('.', o);
                if (p > 0) {
                    name = nsName.substring(o, p);
                    o = p + 1;
                } else {
                    name = o === 0 ? nsName : nsName.substring(o);
                    end = true;
                }
                if (_subs) {
                    subs[subs.length] = name;
                } else {
                    var _pkg = pkg === '' ? name : pkg + '.' + name;
                    created = false;
                    ns = globalNS[_pkg];
                    if (!ns) {                        
                        if (parent !== null) {
                            ns = parent[name];
                            if (!ns) {
                                ns  = new NS(name);
                                parent[name] = ns;
                                parent.addChild(ns);
                            } else if (!(ns instanceof NS)) {
                                ns = NS.createNamespace(name, ns, parent, pkg, subs, ns);
                            } else if (parent._elements.indexOf(ns) < 0) {
                                parent._elements[parent._elements.length] = ns;
                            }                            
                        } else {
                            ns  = new NS(name);
                        }
                        pkg = _pkg;
                        globalNS[pkg] = ns;
                        parent = ns;                        
                    } else if (!(ns instanceof NS)) {
                        _subs = true;
                        nsObj = ns;
                    } else {
                        parent = ns;
                        pkg = _pkg;
                    }                    
                }
            }
            if (_subs) {
                ns = NS.createNamespace(name, nsObj, parent, pkg, subs);
            }
            return ns;
        }
        
        function bindList(elts, ns, parent) {
            var _nsp;
            if (typeof parent === 'string') {
                var _p = Namespace.ns(parent);
                if (!_p) {
                    throw new Error("Incorrect parent namespace");
                }
                parent = _p;
            }
            if (typeof ns === 'string') {
                _nsp = _getOrCreate(ns, parent||null);
                if (!_nsp) {
                    throw new Error("Namespace element " + ns + " does not exist or is incorrect");
                }
            } else if (ns instanceof NS) {
                if (parent instanceof NS) {
                    parent.addChild(ns);
                }
                _nsp = ns;
            } else {
                incorrectArg(); //throw exception
            }
            var len = elts.length, _name;
            for (var i = 0; i < len; i++) {
                _e = elts[i];
                if (NS.isValidElement(_e)) {
                    _nsp.addElement(_e);
                } else if (typeof _e === 'string') {
                    _name = _e;
                    _e = SereniX.forname(_e);
                    if (!_e) {
                        throw new Error("Namespace element " + elts[i] + " does not exist or is incorrect");
                    }
                    if (NS.isValidElement(_e)) {
                        _nsp.addElement(_e);
                    } else {
                        var p = _name.indexOf(".");
                        if (p < 0) {
                            _nsp[_name] = _e;
                        } else {
                            throw new Error("Incorrect element");
                        }
                    }
                } else if (isPlainObject(_e)) {
                    throw new Error("Not yet supported");
                } else if (isArray(_e)) {
                    if (_e.length !== 2 || typeof _e[0] !== 'string') {
                        throw new Error("Incorrect element " + i);
                    }
                    if (NS.isValidElement(_e[1])) {
                        _getOrCreate(_e[0], _nsp).addElement(_e[1]);
                    } else {
                        _nsp[_e[0]] = _e[1];
                    }
                } else {
                    throw new Error("Incorrect element " + i);
                }               
            }
        }
        
        var nsName, elts, parent = _;
        var notBool = true;
        if (typeof ns === 'string') {
            if (isArray(arguments[1])) {
                nsName = ns;
                elts = arguments[1];  
                parent = arguments.length > 2 ? typeof arguments[2] === 'boolean' ? null : arguments[2] : null;
            } else if (arguments.length > 2 && isArray(arguments[2])) {
                nsName = ns;
                //parent = _;
                
                elts = arguments[2]; 
            }
        } else if ((arguments.length === 2 && isArray(ns) && !isArray(ns[0]) && typeof arguments[1] === 'string') 
                    || (arguments.length > 2 && ((notBool = typeof arguments[2]) !== 'boolean' || ! arguments[2]))) {
            nsName = arguments[1],
            elts = arguments[0],
            parent = notBool ? arguments[2] : null;
        }
        if(elts) {
            return bindList(elts, nsName, parent);
        }        
        if (!parent) {
            parent = null;
        }
        
        if (typeof ns=== 'string') {
            return _getOrCreate(ns, parent);
        } else if (isArray(ns) && ns.length > 0) {            
            var _e, e = ns[0], len = ns.length;
            if (isArray(e)) {
                for (var i = 0; i < len; i++) {
                    e = ns[i];
                    _e = e[0];
                    if (typeof _e === 'string') {
                        _e = SereniX.forname(_e);
                        if (!_e) {
                            throw new Error("Namespace element " + e + " does not exist or is incorrect");
                        }
                    }
                    _getOrCreate(e[1], parent).addElement(_e);
                }
                return true;
            } else if (typeof e === 'string') {
                var name, n = (len - (len%2))/2;
                for (var i = 0; i < n; i++) {
                    _e = SereniX.forname(ns[2*i]);
                    name = ns[2*i + 1];
                    if (typeof _e === 'string') {
                        _e = SereniX.forname(e);
                        if (!_e) {
                            throw new Error("Namespace element " + e + " does not exist or is incorrect");
                        }
                    }
                    _getOrCreate(name, parent).addElement(_e);
                    return true;
                }
            }
        }  else if (isPlainObject(ns)) {
            nsName = ns.namespace||ns.Namespace||ns.namespaceName||ns.NamespaceName||ns.name||ns.Name;
            if (isArray(ns.elements)) {
                return bindList(ns.elements, nsName, ns.parent||null);
            } else {
                return _getOrCreate(nsName);
            }
        }
    };
    /**
     * 
     * @param {String} name  The simple name of the namespace
     * @param {Object} obj  Object that contains entries that will be added to the namespace: the namespace members/elements.
     * @param {Namespace} parent  
     * @param {String} pkg  The full name of the namespace
     * @param {Array&lt;String&gt;|String} subs
     * @param {Number} [ofs]
     * @param {Object} [nsObj]  The existing object in the parent namespace to be substituted
     * @returns {Namespace}
     */
    N.createNamespace = function(name, obj, parent, pkg, subs, ofs, nsObj) {
        if (subs instanceof String) {
            subs = subs.valueOf();
        }
        if (typeof subs === 'string') {
            subs = subs.split(".");
        }
        if (arguments.length === 0) {
            throw new Error("At least one string argument is expected");
        }
        if (Object.prototype.toString.call(ofs) === '[object Object]') {
            if (typeof nsObj === 'number') {
                var _ofs = nsObj;
                nsObj = ofs;
                ofs = _ofs;
            } else {
                nsObj = ofs;
                ofs = 0;
            }
        } else if (arguments.length < 6 || (typeof ofs !== 'number')) {
            ofs = 0;
        }
        var NS = this;
        var ns  = new NS(name);
        pkg = pkg ? pkg + '.' + name : name;
        globalNS[pkg] = ns;
        if (parent instanceof NS) {
            if (nsObj) {
                parent[name] = undefined;
            }
            parent.addChild(ns);
        }
        if ((arguments.length === 1) 
                || (obj === null) 
                || isArray(obj)
                || (typeof obj !== 'object')) {
            return ns;
        }
        if (isArray(subs) && subs.length > 0) {
            var sub = false;
            for (var n in obj) {
                if (!sub && (ofs < subs.length) && (sub = subs[ofs]) === n) {
                    ns = this.createNamespace(sub, obj[n], ns, 
                            pkg ? pkg + '.' + sub : sub, subs, ++ofs);
                    sub = true;
                } else {
                    ns[n] = obj[n];
                }
            }
            var len = subs.length, child;
            if (ofs < len && !sub) {
                for (var i = ofs; i < n; i++) {
                    sub = subs[i];
                    child= new NS(sub);
                    ns.addChild(child);
                    pkg += '.' + sub;
                    globalNS[pkg] = child;
                    ns = child;
                }
            }
        } else {
            for (var n in obj) {
                ns[n] = obj[n];
            }
        }
        return ns;
    }; 
    /**
     * Normalizes existing namespace or creates a normalized namespace
     * @param {String|Object|Array} ns
     * @param {Number} [depth]
     * @returns {Namespace|Boolean}
     */
    N.normalize = function(ns, depth) {
        var NS = this;
        
        function join(arr, i) {
            var str = "";
            for (var k = 0, n = arr.length; k <= i && k < n; i++) {
                str += (k > 0 ? '.' : '') + arr[k];
            }
            return str;
        }
        
        function normalizeObj(obj, parent, depth) {
            if (depth === 0) {
                return false;
            } else if (typeof depth === 'number') {
                depth--;
            }
            var _ns, parent, e;
            for (var name in obj) {
                if (hasOwnProp(obj, name)) {
                    _ns = this.ns(name, parent);
                    e = ns[name];
                    if ((typeof e === 'function' && e.__CLASS__ === e) || (e instanceof NS)) {
                        _ns.addChild(e);
                    } else if (isPlainObject(e)) {
                        normalizeObj(e, _ns, depth);
                    } else {
                        _ns[name] = e;
                    }
                }
            }
        }
        
        function _processNS(Namespace, ns, depth) {
            var o;
            depth--;
            if (depth === 0) {
                return false;
            }
            var child;
            for (var name in ns) {
                if (hasOwnprop(ns, name)) {
                    o = ns[name];
                    if (o instanceof NS) {
                        if (ns._elements.indexOf(o) < 0) {
                            ns._elements[ns._elements.length] = o;
                            o._namespace_ = o.__namespace__ = o.__NAMESPACE___ = o.__NAMESPACE__ = ns;
                            if (!hasOwnProp(o, 'namespace')) {
                                o.namespace = ns;
                            }
                        }
                    } else if (typeof o === 'function') {
                        if (Namespace.isValidElement(o)) {
                            ns[name] = undefined;
                            ns.addChild(o);
                        }
                    } else if (isPlainObject(o)) {
                        ns[name] = undefined;
                        child = Namespace.ns(name, parent);
                        for (var n in o) {
                            if (hasOwnprop(o, n)) {
                                child[n] = o[n];
                            }
                        }
                        _processNS(Namespace, child, depth);
                    }
                }
            }
        }
        
        if (ns instanceof String) {
            ns = ns.valueOf();
        }
        if (typeof ns === 'string') {
            var _ns = globalNS[ns];
            if (!_ns) {
                ns = this.ns(ns);
            } else {
                ns = ns.split('.');
                var parent = null, tok, nsObj;
                for (var i = 0, n = ns.length; i < n; i++) {
                    tok = ns[i];
                    if (parent) {
                        nsObj = parent[tok];
                        if (nsObj instanceof NS) {
                            if (parent._elements.indexOf(nsObj) < 0) {
                                parent._elements[parent._elements.length] = nsObj;
                            }
                        } else if (isPlainObject(nsObj)) {
                            parent[tok] = undefined;
                            _ns = this.ns(tok, parent);
                            for (var name in nsObj) {
                                if (hasOwnProp(nsObj, name)) {
                                    _ns[name] = nsObj[name];
                                }
                            }
                            parent = _ns;
                        } else if (!hasOwnprop(parent, tok)) {
                            parent = this.ns(tok, parent);
                        } else {
                            throw new Error("existing field " + join(ns, i));
                        }
                    } else {
                        parent = this.ns(tok);
                    }
                }
                ns = parent;
            }
            if (typeof depth=== 'number') {
                (function finalize(ns, depth) {
                    if (depth > 0) {
                        var parent = ns.__NAMESPACE___||ns.__NAMESPACE__;
                        depth--;
                        var _ns, e;
                        for (var name in ns) {
                            if (hasOwnProp(ns, name)) {
                                e = ns[name];
                                if (NS.isValidElement(e) && ns._elements.indexOf(e) < 0 && e !== parent) {
                                    ns[name] = undefined;
                                    ns.addChild(e);
                                    if (e instanceof Namespace) {
                                        finalize(e, depth);
                                    }
                                }
                            }
                        }
                    }
                })(ns, depth);
            }
            return ns;
        } else if (ns instanceof NS) {
            _processNS(NS, ns, depth);
            return ns;
        } else if (isPlainObject(ns)) {
            normalizeObj(ns, null, depth);
        } else if (isArray(ns)) {
            var _ns;
            for (var i = 0, n = ns.length; i < n;i++) {
                _ns = ns[i];
                if (isPlainObject(_ns)) {
                    this.normalize(_ns, null, depth);
                }
            }
        }
    };
    
    N.RESERVED_WORDS = [
            'export', 'import', 'addElement', 'addEntries', 'addEntry', 
            'isSamePath', 'equals', 'add', 
            '__NAMESPACE__', '__NAMESPACE___', '__NAMESPACE_NAME__', '__NAME__',
            '_namepace_', 'namespace',
            'addNElements', 'addNElts', 'addNamedElements',
            'addChild', 'appendChild', 'addElement', 
            'removeChild', 'removeElement',
            'name','child', 'getChild','getChildsCount', 'getChildrenCount', 
            'getElementsCount', 'getPath', 'getFullName', 'getSimpleName',
            'getName', 'setName', 'getParent'
        ];

    var _ = N.prototype;
    
    _.__CLASS_NAME__ = "Namespace";

    _.__CLASS__ = N;

    _.__SINCE__ = "July 2020";

    _.__VERSION__ = "1.0";

    _.__AUTHOR__ = "Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>";
    /**
     * Returns the name of the name space.
     * @returns {string}
     */
    _.getName = function() {
        return this._name__;
    };
    /**
     * Setting name is not allowed.
     * @param {string} name
     * @throws {Exception} Throws an exception when this method is 
     * called/invocated.
     */
    _.setName = function(name) {
        throw new Error("Setting name is not allowed");
    };
    /**
     * 
     * @returns {Namespace._parent}
     */
    _.getParent = function() {
        return this._parent;
    };
    /**
     * 
     * @returns {String}
     */
    _.toString = function() {
        var str = "", parent = this.getParent();
        if (parent) {
            str = parent.toString() + '.';
        }
        str += this.getName();
        return str;
    };
    
    /**
     * 
     * @returns {String}
     */
    _.getFullName = function() {
        var str = "", parent = this.getParent();
        if (parent) {
            str = parent.toString() + '.';
        }
        str += this.getName();
        return str;
    };
    /**
     * 
     */
    _.getSimpleName = this.getName;
    
    /**
     * 
     * @returns {String}
     */
    _.getPath = this.getFullName;
    
    /**
     * 
     * @returns {int}
     */
    _.getElementsCount= function() {
        return this._elements.length;
    };
    /**
     * 
     * @returns {int}
     */
    _.getChildrenCount= function() {
        return this._elements.length;
    };
    /**
     * 
     * @returns {int}
     */
    _.getChildsCount= function() {
        return this._elements.length;
    };
    /**
     * 
     * @param {int} ndx
     * @returns {Klass|Namespace}
     */
    _.getChild = function(ndx) {
        if ($isJSInt(ndx)) {
            if (ndx >= 0) {
                if (ndx < this._elements.length) {
                    return this._elements[ndx];
                } else {
                    throw new Error("The given child index is greater than the number of elements or equals to the number of elements");
                }
            } else {
                throw new Error("Positive integer argument expected");
            }
        } else {
            var typ = (ndx instanceof Date ? 'Date' : (typeof ndx));
            throw new Error("Positive integer argument expected but found : " + typ);
        }
    };
    /**
     * <ul>
     * <li>When the argument is of string type, if there's a child with the 
     * same name, returns that child; otherwise, creates a corresponding 
     * namespace, add it to the current namsepace and return the namespace 
     * created. returns </li>
     * <li>When the argument is of positive int type, returns the corresponding 
     * child or throw an exception with the following message: 
     * <b color="red">'The given child index is greater than the number of 
     * elements or equals to the number of elements'</b>.</li>
     * <li>When the argument is an instanceof SereniX.Namespace or of function type 
     * returns a positive 
     * integer or zero if the the argument is a child of the current namespace, 
     * otherwise, returns -1.</li>
     * </ul>
     * @param {String|int|Namespace} child
     * @returns {int|Namespace}
     * @throws {Exception} 
     */
    _.child = function(child) {
        var NS = this.__CLASS__;
        if (typeof child === 'string') {
            if (child.indexOf(".") >= 0) {
                var ofs = 0, p, parent = null, ns;
                for (;;) {
                    p = child.indexOf(".", ofs);
                    if (p < 0) {
                        ns = new NS(child.substring(ofs));
                        if (parent === null) {
                            this.addChild(ns);
                        } else {
                            parent.addChild(ns);
                        }
                        return ns;
                    } else {
                        ns = new NS(child.substring(ofs, p));
                        if (parent === null) {
                            this.addChild(ns);
                        } else {
                            parent.addChild(ns);
                        }
                        ofs = p + 1;
                    }
                }
            } else {
                var n = this._elements.length, e;
                for (var i = 0; i < n; i++) {
                    e = this._elements[i];
                    if (e.getName() === child) {
                        return e;
                    }
                }
                var ns = new NS(child);
                this.addChild(ns);
                return ns;
            }
        } else if ($isJSInt(child)) {
            if (child >= 0) {
                if (child < this._elements.length) {
                    return this._elements[child];
                } else {
                    throw new Error("The given child index is greater than the number of elements or equals to the number of elements");
                }
            } else {
                throw new Error("Positive integer argument expected");
            }
        } else if (child instanceof NS) {
            return this._elements.indexOf(child);
        } else if (typeof child === 'function') {
            return this._elements.indexOf(child);
        } else {
            throw new Error("Incorrect argument");
        }
    };
    /**
     * 
     * @param {Klass|Namespace} elt
     * @returns {Namespace}
     */
    _.addChild = function(elt) {
        var NS = this.__CLASS__;
        if (NS.isValidElement(elt)) {
            var name = NS.getElementName(elt);
            var e  = this[name];
            if (!e ) {
                this[name] = elt;
                this._elements[this._elements.length] = elt;
            } else if (e !== elt) {
                throw new Error("An other element (namespace or class) already exists with the same name"
                    + "\nNamepace: " + this.getFullName()
                    + "\nElement name: " + name);
            }
            elt.namespace = this; 
            elt._parent = this;
            elt.__NAMESPACE__ = this;
            elt.__namespace__ = this;
            elt.__NAMESPACE___ = this;
            elt.__NAMESPACE_NAME___ = this.getFullName();
        } else {
            throw new Error("Only classes and namespaces can be added to the namespace");
        }
        return this;
    };
    /**
     * 
     * @param {int|String|Namespace} child
     * @returns {Namespace}
     */
    _.removeChild = function(child) {
        var NS = this.__CLASS__;
        var e, name, ndx;
        if (typeof child === 'number') {
            if (child <0 || child >= this._elements.length) {
                throw new Error("child index out of bounds: " + child);
            }
            e = this._elements[child];
            ndx = child;
            name = NS.getElementName(e);
        } else if (typeof child === 'string') {
            if (child === '') {
                throw new Error("Child/element empty name");
            }
            e = this[child];
            if (typeof e === 'undefined' || e === null) {
                throw new Error("Unknown namespace element: '" + child + "'");
            }
            ndx = this._elements.indexOf(e);
            name = child;
        } else if (NS.isValidElement(child)) {
            ndx = this._elements.indexOf(child);
            if (ndx < 0) {
                return null;
            }
            e = child;
            name = NS.getElementName(e);
        } else {
            throw new Error("Invalid Namespace element/child");
        }
        
        var pkg = this.getFullName();
        
        try {
            delete globalNS[pkg];
        } catch (e) {}
        
        delete this[name];
        this._elements.splice(ndx, 1);
        
        delete e.namespace; 
        delete e._parent;
        delete e.__NAMESPACE__;
        delete e.__namespace__;
        delete e.__NAMESPACE___;
        delete e.__NAMESPACE_NAME___;
        return this;
    };
    
    
    _.appendChild = _.addChild;
    
    
    _.addElement = _.addChild;
    /**
     * 
     * @returns {Namespace}
     */
    _.addElements=function() {
        var args = [].slice.call(arguments);
        while ((args.length === 1) && (isArray(args[0]))) {
            args = args[0];
        }
        var n = args.length;
        for (var i = 0; i < n; i++) {
            this.addChild(args[i]);
        }
        return this;
    };
    function def(name, obj) {
        if (typeof Object.defineProperty === 'function') {
            function _get() {
                return _get.__obj;
            }
            _get.__obj = obj;
            function _set() {
                throw new Error("Read only property");
            }
            Object.defineProperty(this, name, { set : _set, get: _get });
        } else {
            this[name] = obj;
        }
    }
    /**
     * Adds an entry ("property") to the namespace with the given name.
     * If there is already an entry with the same name, throws an exception. 
     * Otherwise, set the value of the entry with the  given object and 
     * returns the namespace.
     * @param {String} name
     * @param {Object|Array} obj  The object to set the entry/property's value.
     * @returns {Namespace}
     * @throws {Error}
     */
    _.addEntry = function(name, obj) {
        if (typeof name === 'undefined' || name === null) {
            throw new Error("Null or undefined name");
        }
        if (typeof name !== 'string') {
            throw new Error("Incorrect name argument");
        }
        if (!name) {
            throw new Error("Empty name");
        }
        if (typeof this[name] !== 'undefined') {
            throw new Error("An other element (namespace or class) already exists with the same name"
                    + "\nNamepace: " + this.getFullName()
                    + "\nElement name: " + name);
        }
        def(name, obj);
        return this;
    };
    /**
     * 
     * @param {type} ns
     * @param {type} obj
     * @returns {Namespace}
     */
    _.put = function(ns, obj) {
        if (typeof ns === 'string') {
            this.addEntry(ns, obj);
            return this;
        }
        function addObj(obj, self) {
            for (var name in obj) {
                if (name !== '__proto__' && hasOwnProp(obj, name)) {                    
                    self.addEntry(name, obj[name]);
                }
            }
        }
        if (isPlainObject(ns)) {
            addObj(ns, this);
            var args = [].slice.call(arguments);
            for (var i = 1, n = args.length; i < n; i++) {
                obj = args[i];
                if (!isPlainObject(obj)) {
                    throw new Error("Incorrect argumentt");
                }
                addObj(obj, this);
            }
        }
        return this;
    };
    _.put["[[native]]"] = true;
    /**
     * 
     * @returns {Namespace}
     */
    _.set = function() {
        var ns = arguments[0], obj;
        if (ns instanceof String) {
            ns = ns.valueOf();
        }
        if (typeof ns === 'string') {
            if (typeof ns === 'undefined' || ns === null) {
                throw new Error("Null or undefined namespace name");
            }
            if (typeof ns !== 'string') {
                throw new Error("Incorrect namespace name argument");
            }
            if (!ns) {
                throw new Error("Empty namespace name");
            }
            def(ns, arguments[1]);
            return this;
        }
        function addObj(obj) {
            for (var name in obj) {
                if (name !== '__proto__' && hasOwnProp(obj, name)) {
                    if (typeof name === 'undefined' || name === null) {
                        throw new Error("Null or undefined namespace name");
                    }
                    if (typeof name !== 'string') {
                        throw new Error("Incorrect namespace name argument");
                    }
                    if (!name) {
                        throw new Error("Empty namespace name");
                    }
                    def(name, obj[name]);
                }
            }
        }
        if (isPlainObject(ns)) {
            addObj(ns);
            var args = [].slice.call(arguments);
            for (var i = 1, n = args.length; i < n; i++) {
                obj = args[i];
                if (!isPlainObject(obj)) {
                    throw new Error("Incorrect argumentt");
                }
                addObj(obj);
            }
        }
    };
    _.set["[[native]]"] = true;
    /**
     * 
     * <p>This method is an alia of addEntry() method.</p>
     * @param {String} name
     * @param {Object|Array} elt
     * @returns {Namespace}
     * @see addEntry()
     */
    _.addNElement = _.addNElt = _.addNamedElement = _.addEntry;
    /**
     * Adds entries to the namespace.
     * @param {Object|Array} elts The array or plain object representing the 
     *      list of  pairs (name and value) to add to the namespace a entries.
     * @returns {Namespace}
     * @throws {Error}
     */
    _.addEntries=function(elts) {
        if (isPlainObject(elts)) {
            if (elts.hasOwnProperty) {
                for (var name in elts) {                
                    this.addNElement(name, elts[name]);
                }
            }
        } else if (isArray(elts)) {
            if (elts.length === 0) return this;
            var e = elts[0], n = elts.length;
            if (typeof e === 'string') {
                n =   (n - (n % 2))/2;
                for (var i = 0; i < n; i++) {
                    this.addNElement(elts[2*i], elts[2*i+1]);
                }                
            } else if (isArray(e)) {
                for (var i = 0; i < n; i++) {
                    e = elts[i];
                    this.addNElement(e[0], e[1]);
                }
            } else if (isPlainObject(e)) {
                var key, valName;
                if (e.hasOwnProperty) {
                    key = e.hasOwnProperty("name") ? "name" 
                        : e.hasOwnProperty("Name") ? "Name" 
                        : e.hasOwnProperty("key") ? "key" 
                        : e.hasOwnProperty("Key") ? "Key" : "";
                    valName = e.hasOwnProperty("value") ? "value" 
                        : e.hasOwnProperty("Value") ? "Value" : "";                
                } else {
                    key = typeof e.name !== 'undefined' ? "name" 
                        : typeof e.Name !== 'undefined' ? "Name" 
                        : typeof e.key !== 'undefined' ? "key" 
                        : typeof e.Key !== 'undefined' ? "Key" : "";
                    valName = typeof e.value !== 'undefined' ? "value" 
                        : typeof e.Value !== 'undefined' ? "Value" : "";
                }
                if (!key && valName) {
                    throw new Error("[Namepace]: Incorrect argument");
                }
                for (var i = 0; i < n; i++) {
                    e = elts[i];
                    this.addNElement(e[key], e[valName]);
                }
            } else {
                throw new Error("[Namepace]: Incorrect argument");
            }
        }
        return this;
    };
    /**
     * 
     * @param {Object|Array} elts
     * @returns {Namespace}
     */
    _.addNElements = _.addNElts = _.addNamedElements = _.addEntries;
    _.add = function() {
        if (arguments.length === 0) return this;
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0])) {
            args = args[0];
        }
        var v, N = SereniX.Namespace, K = SereniX.Klass;
        if (args.length === 1) {
            var a = args[0];
            if (isPlainObject(a)) {
                for (var name in a) {
                    if (a.hasOwnProperty(name)) {
                        v = a[name];
                        if (v instanceof N || v instanceof K) {
                            N.ns(name, this).addChild(v);
                        } else {
                            this.addEntry(name, v);
                        }
                    }
                }
                return this;
            } else if (isArray(a)) {
                args = a;
            }
        }
    };
    /**
     * <p>Exports elements of the namespace to a specified detination or to  
     * window when no detination specified.</p>
     * <p>When the filter is not specified, only namespace variables (fields) 
     * and methods with names not in Namespace.RESERVED_WORDS will be 
     * exported</p>
     * <h3>Syntax:</h3>
     * <ul>
     * <li><b color="orange">export</b>(filter Array&lt;String&lt; [, to : Object|Function|String])</li>
     * <li><b color="orange">export</b>(to : Object|Function|String [, filter Array&lt;String&lt;|Function|Object])</li>
     * </ul>
     * @param {Object} [to=window] The destination of the export
     * @param {Array|Function|Object} [filter=null]
     * @returns {Namespace|Object}  
     *   <p>When the value of the parameter 'to' is a string, the return value 
     *   is the object (existing or created) corresponding to the string.
     *   Otherwise, this namespace is returned.</p>
     *   @see Namespace.RESERVED_WORDS
     */
    _.export = function(to, filter) {
        if (to instanceof String) {
            to = to.valueOf();
        }
        var returnThis = true;
        if (isArray(to) || to === '*') {
            if (isPlainObject(filter) || ['string', 'function'].indexOf(typeof filter) >= 0) {
                var temp = to;
                to = filter;
                filter = temp === '*'? false : temp;
            } else {
                filter = to;
                to = globalNS;
            }
        } else if (!to) {
            to = globalNS;            
        } else if (typeof to === 'string') {
            var own = globalNS, toks = to.split("."), tok;
            for (var i = 0, n = toks.length; i < n; i++) {
                tok = toks[i];
                to = own[tok];
                if (!to) {
                    to = {};
                }
                own[tok] = to;
            }
            returnThis = false;
        }
        var e;
        if (!filter) {
            var exclusions = this.__CLASS__.RESERVED_WORDS;
            for (var name in this) {
                if (hasOwnProp(this, name) && exclusions.indexOf(name) < 0) {
                    e = this[name];
                    to[name] = e;
                }
            }
        } else if (isArray(filter)) {
            for (var name in this) {
                if (hasOwnProp(this, name) && filter.indexOf(name) >= 0) {
                    e = this[name];
                    to[name] = e;
                }
            }
        } else if (typeof filter === 'function') {
            for (var name in this) {
                if (hasOwnProp(this, name) && filter(name)) {
                    e = this[name];
                    to[name] = e;
                }
            }
        } else {
            var key;
            if ( (key = typeof filter.filter === 'function' ? 'filter' : typeof filter.accept === 'function' ? 'accept' : null)) {
                for (var name in this) {
                    if (hasOwnProp(this, name) && filter[key](name)) {
                        e = this[name];
                        to[name] = e;
                    }
                }
            } else {
                var v,defVal;
                for (var name in this) {
                    if (hasOwnProp(this, name) && (key = filter[name])) {
                        if (key === true) {
                            key = name;
                        } else if (isPlainObject(key)) {
                            if (hasOwnProp(key, 'defaultValue')) {
                                v = key.defaultValue;
                                defVal = true;
                            } else if (hasOwnProp(key, 'DefaultValue')) {
                                v = key.defaultValue;
                                defVal = true;
                            } else if (hasOwnProp(key, 'default')) {
                                v = key.default;
                                defVal = true;
                            } else {
                                defVal = false;
                            }
                            key = key.alias||key.Alias||key.name||key.Name||name;
                        }
                        
                        e = this[name];
                        to[key] = (typeof e === 'undefined' || e === null) && defVal ? v : e;
                    }
                }
            }
        }
        return returnThis ? this : to;
    };
    _.export["[[native]]"] = true;
    /**
     * 
     * @param {Namespace|Function|Object|String} from
     * @param {Array&lt;String&gt;|Function|Object} filter
     * @returns {Namespace}
     */
    _.import = function(from, filter) {
        var _from = from;
        if (from instanceof String) {
            _from = from = from.valueOf();
        }
        if (typeof from === 'string') {
            var toks = from.split('.'), own = globalNS;
            for (var i = 0, n = toks.length; i < n; i++) {
                from = own[toks[i]];
                if (!from) {
                    throw new Error("Undefined from object: " + _from);
                }
                own = from;
            }
        }
        if (from instanceof this.__CLASS__) {
            from.export(this, filter);            
        }
        if (!isPlainObject(from) && typeof from !== 'function' && !isArray(from)) {
            throw new Error("Incorrect 'from' argument");
        }
        var v,defVal, key;
        function add(own, name) {
            if (key === true) {
                key = name;
            } else if (isPlainObject(key)) {
                if (hasOwnProp(key, 'defaultValue')) {
                    v = key.defaultValue;
                    defVal = true;
                } else if (hasOwnProp(key, 'DefaultValue')) {
                    v = key.defaultValue;
                    defVal = true;
                } else if (hasOwnProp(key, 'default')) {
                    v = key.default;
                    defVal = true;
                } else {
                    defVal = false;
                }
                key = key.alias||key.Alias||key.name||key.Name||name;
            }

            var e = own[name];
            if (exclusions.indexOf(key) < 0) {
                own[key] = (typeof e === 'undefined' || e === null) && defVal ? v : e;
            }
        }
        var exclusions = this.__CLASS__.RESERVED_WORDS, method;
        if (!filter) {            
            for (var name in from) {
                if (hasOwnProp(from, name) && exclusions.indexOf(name) < 0) {
                    this[name] = from[name];
                }
            }
        } else if (typeof filter === 'function') {
            for (var name in from) {
                if (hasOwnProp(from, name) && (key = filter(name)) ) {
                   add(this, name);
                }
            }
        } else if ( (method = typeof filter.filter === 'function' ? 'filter' : typeof filter.accept === 'function' ? 'accept' : null)) {
            for (var name in this) {
                if (hasOwnProp(this, name) && (key = filter[method](name))) {
                    add(this, name);
                }
            }
        } else {            
            for (var name in from) {
                if (hasOwnProp(this, name) && (key = filter[name])) {
                    add(this, name);
                }
            }
        }
        return this;
    };
    
    _.import["[[native]]"] = true;
    /**
     * 
     * @param {Object} obj
     * @returns {Boolean}
     */
    _.isSamePath = function(obj) {
        var NS = this.__CLASS__;
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof NS)) {
            return false;
        }
        return this.getFullName() === obj.getFullName();
    };
    /**
     * 
     * @param {type} obj
     * @returns {Boolean}
     */
    _.equals = function(obj) {
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof this.__CLASS__)) {
            return false;
        }
        return this.getFullName() !== obj.getFullName();
    };
    
    
    /**
    * Creates the namespace corresponding to the given namespace name. 
    * <p>This function is an alias of Namespace.ns method.</p>
    * @param {String} nsName  The namspace name
    * @param {Namespace} [parent=null]
    * @returns {Namespace} The created namespace
    * @see Namespace.ns()
    */
    N.namespace = N.ns;
    
    N.prototype = _;

})(Namespace);



/**
 * Creates the namespace corresponding to the given namespace name. 
 * <p>This function is an alias of Namespace.ns method.</p>
 * @param {String} nsName  The namspace name
 * @param {Namespace} [parent=null]
 * @returns {Namespace} The created namespace
 * @see Namespace.ns()
 */
var $ns = (function(nsName, parent) {
    var N = Namespace, create = N.ns;
    var n = function() {
        return create.apply(N, arguments);
    };
    return n;
})();
/**
 * Creates the namespace corresponding to the given namespace name. 
 * <p>This function is an alias of Namespace.ns method.</p>
 * @param {String} nsName  The namspace name
 * @param {Namespace} [parent=null]
 * @returns {Namespace} The created namespace
 * @see Namespace.ns()
 */
var $namespace = $ns;

/**
 * Creates the namespace corresponding to the given namespace name. 
 * <p>This function is an alias of Namespace.ns method.</p>
 * @param {String} nsName  The namspace name
 * @param {Namespace} [parent=null]
 * @returns {Namespace} The created namespace
 * @see Namespace.ns()
 */
var ns = $ns;

/**
 * Creates the namespace corresponding to the given namespace name. 
 * <p>This function is an alias of Namespace.ns method.</p>
 * @param {String} nsName  The namspace name
 * @param {Namespace} [parent=null]
 * @returns {Namespace} The created namespace
 * @see Namespace.ns()
 */
var namespace = $ns;

globalNS.SereniX = (function() {
    var S;
    if (globalNS.SereniX) {
        S = globalNS.SereniX;
        if (S instanceof Namespace) {
            return S;
        }
        var props = {},
            reserved = [
                "__CLASS__", 
                "__CLASS_NAME__", 
                "__NAMESPACE__",
                "NAMESPACE_NAME__", 
                "name", 
                "_name"
        ];
        for (var name in S) {
            props[name] = S[name];
        }
        S = Namespace.ns("SereniX");

        for (var key in props) {
            if (reserved.indexOf(key) >= 0) {
                S[key] = props[name];
            }
        }
    } else {
        S =Namespace.ns("SereniX");
    }
    return S;
})();

SereniX.Namespace = Namespace;

(function() {
/**
 * 
 * @type Namespace.ns
 */
SereniX.ns = function () {
    return Namespace.ns.apply(Namespace, arguments);
};

})();

//normalize SereniX.types namespace. If SereniX.types not an instance of 
//SereniX.Namespace, convert the object to become and instanceof Namespace class.
Namespace.normalize('SereniX.types', 1);



/**
 * <h3>Base Class class: Klass</h3>
 * 
 * <p>The base class that is used to create new classes which objects are  
 * instance of this class (<b color="blue">Klass</b>).</p>
 * <p>The class creation seems to be as most declarative as possible and you 
 * does not need to explicitely code accessors (getters and setters) of the 
 * properties ecept when rules or constraints are not easy to only declare 
 * them.</p>
 * <p>To create a new class or extend a class use 
 * <b color="blue">Klass.createClass</b> or it's alias 
 * <b color="blue">Klass.Class</b>. In this case, the super class is optional 
 * in the arguments or the options.</p>
 * <p>You can extend a class calling <b color="blue">Klass.extendClass</b> 
 * method. In this case, the super class is required in the arguments or the 
 * options.</p>
 * <ul> 
 * <li>A property of a class can be setted as a string that is parsed to get final 
 * property object.</li>
 * <li>Default value can be string  expression that needs to be well parsed and 
 * well evaluated when creating an instance of a class.</li>
 * </ul>
 * <p>For that, the class creation javascript librairies requires 
 * serenix_parser_statements.js and serenix_statement_parser.js and 
 * need the following classes that are binded to SereniX.prog namespace:</p>
 * <ul>
 * <li>AliasDName</li>
 * <li>AParam</li>
 * <li>Accessor</li>
 * <li>Aggregation</li>
 * <li>All</li>
 * <li>AnonymousFunction</li>
 * <li>AQString</li>
 * <li>ArrayDimension</li>
 * <li>ArrayType</li>
 * <li>ArrowFunction</li>
 * <li>As</li>
 * <li>AsEntry</li>
 * <li>AsList</li>
 * <li>Assign</li>
 * <li>AutoIncrement</li>
 * <li>BaseIndex</li>
 * <li>Block</li>
 * <li>Call</li>
 * <li>Catch</li>
 * <li>ChainedExpressions</li>
 * <li>ChainedStatements</li>
 * <li>Class</li>
 * <li>ClassBody</li>
 * <li>Command</li>
 * <li>Comment</li>
 * <li>Comments</li>
 * <li>Conditional</li>
 * <li>Constructor</li>
 * <li>Continue</li>
 * <li>DataTypeToken</li>
 * <li>DOptions</li>
 * <li>Declaration</li>
 * <li>DefaultCase</li>
 * <li>DefaultEName</li>
 * <li>DefaultStatement</li>
 * <li>DOEntry</li>
 * <li>DoWhile</li>
 * <li>EList</li>
 * <li>EName</li>
 * <li>EmptyStatement</li>
 * <li>EQString</li>
 * <li>Expression</li>
 * <li>Field</li>
 * <li>FControl</li>
 * <li>ForStatement</li>
 * <li>ForControl</li>
 * <li>For</li>
 * <li>ForInControl</li>
 * <li>ForIn</li>
 * <li>ForOfControl</li>
 * <li>ForOf</li>
 * <li>FType</li>
 * <li>Func</li>
 * <li>Getter</li>
 * <li>Setter</li>
 * <li>Grouping</li>
 * <li>IComment</li>
 * <li>If</li>
 * <li>IfCase</li>
 * <li>Interface</li>
 * <li>InterfaceBody</li>
 * <li>Import</li>
 * <li>ImportElements</li>
 * <li>ImportSelection</li>
 * <li>ImportExportElt</li>
 * <li>Index</li>
 * <li>Instantiation</li>
 * <li>Invocation</li>
 * <li>LROperation</li>
 * <li>LStatement</li>
 * <li>Label</li>
 * <li>Litteral</li>
 * <li>Loop</li>
 * <li>MAssign</li>
 * <li>Method</li>
 * <li>EModule</li>
 * <li>NVariable</li>
 * <li>NamedFunction</li>
 * <li>NamedType</li>
 * <li>NTypeField</li>
 * <li>NoBodyStatement</li>
 * <li>NoCondition</li>
 * <li>Null</li>
 * <li>NullCoalescing</li>
 * <li>Numeric</li>
 * <li>OCIndex</li>
 * <li>OCRef</li>
 * <li>ODAssign</li>
 * <li>Param</li>
 * <li>Params</li>
 * <li>AQString</li>
 * <li>QString</li>       
 * <li>QSPattern</li>
 * <li>QuotedHintStatement</li>
 * <li>RefChain</li>
 * <li>Reference</li>
 * <li>RestEName</li>
 * <li>RestParam</li>
 * <li>Return</li>
 * <li>SBlock</li>
 * <li>SDeclaration</li>
 * <li>SIterator</li>
 * <li>Setter</li>
 * <li>Signature</li>
 * <li>SingleAssign</li>
 * <li>SkipableElt</li>
 * <li>SpreadEName</li>
 * <li>Statement</li>
 * <li>StatementElt</li>
 * <li>SType</li>
 * <li>Switch</li>
 * <li>TailEName</li>
 * <li>Throw</li>
 * <li>Try</li>
 * <li>UnaryOperation</li>
 * <li>Undefined</li>
 * <li>UnionType</li>
 * <li>VArray</li>
 * <li>VEName</li>
 * <li>VObject</li>
 * <li>VRegExp</li>
 * <li>Value</li>
 * <li>Variable</li>
 * <li>While</li>
 * <li>With</li>
 * <li>DataTypeToken</li>
 * <li>ParamTypes</li>
 * <li>FType</li>
 * <li>SType</li>
 * <li>Structure</li>
 * <li>NamedType</li>
 * <li>UnionType</li>
 * <li>Interface</li>
 * <li>InterfaceBody</li>
 * <li>Signature</li>
 * </ul>
 * <h3>Prerequisites</h3>
 * <ul>
 * <li>At least ES5 browser or any javascript engine that supports at least ES5</li>
 * <li>Object.defineProperty</li>
 * <li>Object.defineProperties</li>
 * <li>Object.keys</li>
 * </ul>
 * <h3>Class creation usage</h3>
 * The call of <b color="navy">Klass</b> as an invocation of function will 
 * create a class using the method <b color="orange">Klass.createClass</b> with 
 * the given arguments.
 * @returns {Function}
 * @class Klass Base class
 * @see Klass.createClass
 */
function Klass() {
    if (!(this instanceof Klass)) {
        return Klass.createClass.apply(Klass, arguments);
    }
}


/**
 * 
 * @type NSNode
 */
Klass.prototype = new NSNode();
/**
 * 
 * @constant
 * @returns {undefined}
 */
Klass.__CLASS__ = Klass;
/**
 * 
 * @constant
 * @type String
 */
Klass.__CLASS_NAME__ = "Klass";
/**
 * 
 * @constant
 * @type String
 */
Klass.__SINCE__ = "July 2020";
/**
 * 
 * @constant
 * @type String
 */
Klass.__VERSION__ = "1.0";
/**
 * 
 * @type String
 * @constant
 */
Klass.__AUTHOR__ = "Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>";

/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to true to 
 * guarantee  static member (method or field) creation when creating class using
 * Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
Klass.STATIC = true;

/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to true to 
 * guarantee  static member (method or field) creation when creating class using
 * Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
Klass.static = true;
/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to true to 
 * guarantee  static member (method or field) creation when creating class using
 * Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
var STATIC = true;
/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to false to 
 * guarantee  non static member (method or field) creation when creating class 
 * using Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
var NOT_STATIC = false;
/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to false to 
 * guarantee  non static member (method or field) creation when creating class 
 * using Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
var NO_STATIC = false;
/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to false to 
 * guarantee  non static member (method or field) creation when creating class 
 * using Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
Klass.NO_STATIC = false;
/**
 * 
 * <p><b>Note: This value must always be evaluate as boolean to false to 
 * guarantee  non static member (method or field) creation when creating class 
 * using Klass.createClass or it's aliases.</b></p>
 * @type Boolean
 * @constant
 */
Klass.NOT_STATIC = false;

/**
 * 
 * @returns {String}
 */
Klass.getClassName = function() {
    var cls = this.__CLASS__;
    if (typeof cls === 'function') {
        if (cls.__CLASS_NAME__) {
            return cls.__CLASS_NAME__;
        } else if (cls.__NAME__) {
            return cls.__NAME__;
        }
    } else if (typeof cls === 'string') {
        return cls;
    }
    return "Klass";
};

/**
 * Returns the full name of the class.
 * @returns {String}
 */
Klass.getClassFullName = function() {
    var cls = this.__CLASS__;
    if (typeof cls === 'function') {
        if (cls.__CLASS_NAME__||cls.__NAME__) {
            var name = cls.__CLASS_NAME__
                    ||cls.__NAME__;
            
            if (!name) {
                name = cls.name||"";
            }
            var ns = cls.__NAMESPACE_NAME___||cls.__NAMESPACE_NAME__
                    ||cls.__NAMESPACE__
                    ||cls.namespace;
            
            if (typeof ns === 'string' && ns) {
                return ns + "." + name;
            } else if (typeof ns.getFullName === 'function') {               
                return (ns.getFullName()||"") + "." + name;
            } else if (typeof ns.getPath === 'function') {               
                return (ns.getPath()||"") + "." + name;
            } else if (typeof ns.getName === 'function') {               
                return (ns.getName()||"") + "." + name;
            }
        }
        return name;
    }
    return "Klass";
};

/**
 * Returns the full name of the class.
 * @returns {String}
 */
Klass.getFullClassName = Klass.getClassFullName;
/**
 * Returns the full name of the class.
 * @returns {String}
 */
Klass.getFullName = Klass.getClassFullName;


/**
 * defProperty(obj, name, getter, setter)
 * defProperty(obj, name, writable, value)
 * 
 * @returns {undefined}
 */
Klass.defProperty = function() {
    var args = arguments, obj = args[0], 
            name = args[1], 
            getter = null, 
            setter = null, 
            writable = null,
            value = null,
            valueSetted = false;
    
    var desc = { enumerable: true, configurable: true};
    if (args.length > 2) {
        var a = args[2];
        if (typeof a === 'boolean') {
            writable = a;
            if (args.length > 3) {
                value = args[3];
                valueSetted = true;
            }
        } else if (typeof a === 'function') {
            getter = a;
            if (args.length > 3) {
                setter = typeof args[3] === 'function' ? args[3] : null;
            }
        }
    }
    
    if (writable !== null) {
        desc.writable = writable;
        desc.value = valueSetted ? value : null;
    } else if (typeof getter === 'function' || typeof setter === 'function') {
        if (typeof getter === 'function') { 
            desc.getter = desc.get = getter;
        } else if (typeof setter === 'function') { 
            desc.setter = desc.set = setter;
        } else {
            //TODO
        }
    } else {
        //TODO
    }
    Object.defineProperty(obj, name, desc);
    return obj;
};

/**
 * 
 * @param {String} name
 * @returns {Object}
 */
Klass.getStaticProperty = function(name) {
    return this.__CLASS__.__definedProperties___[name];
};
/**
 * Returns the property (static property if _static is 
 * true) definition object that corresponds to the given property name.
 * @param {String} name The property name
 * @param {Boolean} [_static=false]
 * @returns {Object}
 */
Klass.getProperty = function(name, _static) {
    var c = this.__CLASS__, o = _static ? c: c.prototype;
    return o.__definedProperties___[name];
};


/**
 * Returns the type of the type of the property (static property if _static is 
 * true) that corresponds to the given property name.
 * @param {String} name The property name
 * @param {Boolean} [_static=false]
 * @returns {String|Function|SereniX.types.Type}
 */
Klass.getPropertyType = function(name, _static) {
    var c = this.__CLASS__, o = _static ? c: c.prototype;
    return o.__definedProperties___[name].type;
};

/**
 * 
 * @param {String} name The static property name
 * @returns {String|Function|SereniX.types.Type}
 */
Klass.getStaticPropertyType = function(name) {
    return this.__CLASS__.__definedProperties___[name].type;
};


/**
 * 
 * @param {Object} obj
 * @param {type} property
 * @param {Function} get  The getter method : <b>it's optional</b>
 * @param {Function} set  The setter method : <b>it's optional</b>
 * @returns {Object}
 */
Klass.createObjectProperty = function (obj, property, get, set, className, namespace) {  
    
    if (arguments.length > 2) {
        if (typeof arguments[2] === 'function') {
            get = arguments[2];
        }
        if (arguments.length > 3) {
            if (typeof arguments[3] === 'function') {
                set = arguments[3];
            } else {
                set = null;
            }
        }
    } else {
        get = set = null;
    }
    
    var desc = { enumerable: true, configurable: true}, 
        name //the property name
        ;
    
    if (typeof property === 'string') {
        name = property;
        if (typeof get === 'function') {
            desc.getter = desc.get = get;
        } else if (typeof get === 'object') {
            //TODO
        } else if ((typeof get === 'boolean' && get) 
                || (typeof get !== 'boolean')) {
            desc.getter = desc.get = function __GETTER__() {
                return this[__GETTER__.name];
            };
            __GETTER__.name = "_" + property + "-";
        } 
        if (typeof set === 'function') {
                desc.setter = desc.set = set;
        } else if (typeof get === 'object') {
            //TODO
        } else if ((typeof get === 'boolean' && get) 
                || (typeof get !== 'boolean')) {

            desc.setter = desc.set = function __SETTER__(value) {
                this[__SETTER__.name] = value;
                return this;
            };
            __SETTER__.name = "_" + property + "-";
        }
        Object.defineProperty(obj, name, desc);
        return obj;
    } else {
        name = property["propertyName"]||property["propertyname"]
            ||property["property"]||property["name"];
        if (typeof name !== 'string') {
            throw new PropertyDefinitionError("Incorrect property name object");
        }

        if (typeof name === '') {
            throw new PropertyDefinitionError("Empty property name");
        }
    }
    
    var value = property["readonly"]||property["readOnly"]||property["ReadOnly"];
    
    if (typeof value === 'undefined') {
        value = property["writable"]||property["Writable"]
                ||property["readwrite"]||property["readWrite"]
                ||property["ReadWrite"];
        
        if (typeof value === 'boolean') {
            desc["writable"] = value;
        } else if (typeof value === 'string') {
            desc["writable"] = toBool(value);
        }
        
    } else if (typeof value === 'boolean') {
        desc["writable"] = !value;
    } else if (typeof value === 'string') {
        desc["writable"] = !toBool(value);
    }
    
    value = property["default"]||property["defaultValue"] 
            || property["defaultvalue"]||property["value"];
    if (typeof value !== 'undefined') {
        desc["value"] = value;
    }
    
    
    var values = property["values"]||property["enum"]||property["enumeration"],
        interval = property["interval"]|| property["range"]||null,
        check = property["check"],
        cfunc = null;

    if (className) {
        if (namespace) {
            className = namespace + '.' + className;
        }
    }

    var getCheckEnumFunc = function(values) {
        
        var eFunc = function __CHECK_ENUM__() {
            var msgs = globalNS["__SERENIX_MESSAGES__"]||{};
            if (!(msgs instanceof SereniX.msg.Messages)) {
                msgs = new SereniX.msg.Messages(msgs);
            }
            var getErrorMessage = function(values, value) {
                var msg = "", n = values.length;
                if (n === 1) {
                    msg = msgs.msg("the_expected_value_is","The expected value is") + " " + getValueString(values[0]);
                } else if (n > 1) {
                    msg = "The expected value should be one of the followings: ";
                    for (var i = 0; i < n; i++) {
                        if (i > 0) {
                            msg += ', ';
                        }
                        msg += getValueString(values[i]);
                    }
                }
                msg +=  "; "+ msgs.msg("but_given_value_is","but given value is") + " " + getValueString(value) 
                        + '.';
                
                return msg;
            };
            function getValueString(v) {
                if (typeof v === 'undefined' || v === null) {
                    return 'null';
                }
                if (typeof v === 'string') {
                    return "'" + v + "'";
                } else if (v instanceof Date) {
                    return "'" + v.toString() + "'";
                }
                return "" + v;
            }
            var value = this[__CHECK_ENUM__.fieldName];
            var i  = __CHECK_ENUM__.values.indexOf(value);
            if (i < 0) {
                throw new ValueError(getErrorMessage(__CHECK_ENUM__.values, value));
            }
            return true;
        };
        
        __CHECK_ENUM__.values = values;
        
        return eFunc;
    };
    
    var getIntervalFunc = function(interval) {
        var ifunc = function __CHECK_INTERVAL__(value) {
            var v = this[__CHECK_INTERVAL__.fieldName];
            if ((__CHECK_INTERVAL__.includeMin && value < v)
                || (!__CHECK_INTERVAL__.includeMin && value <= v)
                || (__CHECK_INTERVAL__.includeMax && value > v)
                || (!__CHECK_INTERVAL__.includeMax && value >= v)
            ) {
                throw new RangeError("Out of bound value");
            }
            return true;
        };
        __CHECK_INTERVAL__.min = interval.min||interval.minimum||interval.minValue||interval.minimumValue;
        __CHECK_INTERVAL__.max = interval.max||interval.maximum||interval.maxValue||interval.maximumValue;
        var v = interval.includeMin||interval.includeMinimum||interval.includemin||interval.includeminimum;
        if (typeof v=== 'boolean') {
            __CHECK_INTERVAL__.includeMin = v;
        } else {
            v = interval.excludeMin||interval.excludeMinimum||interval.excludemin||interval.excludeminimum;
            __CHECK_INTERVAL__.includeMin = typeof v=== 'boolean' ? !v : true;
        }
        v = interval.includeMax||interval.includeMaximum||interval.includemax||interval.includemaximum;
        if (typeof v=== 'boolean') {
            __CHECK_INTERVAL__.includeMax = v;
        } else {
            v = interval.excludeMax||interval.excludeMaximum||interval.excludemax||interval.excludemaximum;
            __CHECK_INTERVAL__.includeMax = typeof v=== 'boolean' ? !v : true;
        }
        return ifunc;
    };
    
    var getArrayIntervalFunc = function(interval) {
        return getIntervalFunc({min: interval[0], max : interval[1]});
    };
    
    if (isArray(values)) {
        cfunc = getCheckEnumFunc(values);
    } else if (isArray(interval)) {
        cfunc = getArrayIntervalFunc(interval);
    } else if (interval) {
        cfunc = getIntervalFunc(interval);
    } else if (typeof check === 'function') {
        cfunc = check;
    }
    
    var getter = property["get"]||property["getter"]
            ||property["Get"]||property["Getter"]
            || property["getValue"]||property["getvalue"]||null;
    var setter = property["set"]||property["setter"] 
            ||property["Set"]||property["Setter"]
            || property["setValue"]||property["setvalue"]||null;
    
    if (typeof cfunc === 'function') {
        cfunc.fieldName = "__" + name + "__";
        if (setter) {
            var _setter = function __SETTER__(value) {
                if (!__SETTER__.control(value)) {
                    throw new ValueError("Incorrect value");
                }
                __SETTER__.__SET__(value);
            };
            __SETTER__.__SET__ = setter;
            __SETTER__.control = cfunc;
            __SETTER__.fieldName = cfunc.fieldName;
            setter = _setter;
        } else {
            setter = function __SETTER__(value) {
                if (!__SETTER__.control(value)) {
                    throw new ValueError("Incorrect value");
                }
                this[__SETTER__.fieldName] = value;
            };
            __SETTER__.control = cfunc;
            __SETTER__.fieldName = cfunc.fieldName;
        }
        if (getter) {
            var _getter = function __GETTER__() {
                var v = this[__GETTER__.fieldName] = __GETTER__.__GET__();
                return v;
            };
            __GETTER__.fieldName = cfunc.fieldName;
            __GETTER__.__GET__ = getter;
            getter = _getter;
        } else {
            getter = function __GETTER__() {
                return this[__GETTER__.fieldName];
            };
            __GETTER__.fieldName = cfunc.fieldName;
        }
    }
    
    
    if (typeof setter === 'function') {
        desc["set"] = setter;
    }
    
    if (typeof getter === 'function') {
        desc["get"] = getter;
    }
    if (typeof setter !== 'function') {
        value = property["writable"]||property["write"]
                ||property["readwrite"]||property["readWrite"]
                ||property["read-write"];
        if (typeof value === 'boolean') {
            desc["writable"] = value;
        }
    }
    
    value = property["configurable"];
    if (typeof value === 'boolean') {
        desc["configurable"] = !value;
    }
    
    value = property["enumerable"];
    if (typeof value === 'boolean') {
        desc["enumerable"] = value;
    }
    Object.defineProperty(obj, name, desc);
    return obj;
};


/**
 * 
 * @param {Function} Cls
 * @param {String|Object} property
 * @returns {Function}
 */
Klass.createClassProperty = function (Cls, property) {
    Cls = Klass.createObjectProperty(Cls, property);
    return Cls;
};
/**
 * 
 * @param {Function} Cls
 * @param {String|Object} property
 * @returns {Function}
 */
Klass.createInstanceProperty = function (Cls, property) {
    Cls.prototype = Klass.createObjectProperty(Cls.prototype, property);
    return Cls;
};
/**
 * Sets the following fields or methods both at class (static)  
 * level and instance (class prototype and object) level.
 * <ul>
 * <li>__CLASS__ : the class </li>
 * <li>__CLASS_NAME__: the class simple/short name</li>
 * <li>__NAMESPACE__: the namespace</li>
 * <li>__NAMESPACE_NAME__: the namespace name </li>
 * <li>getSimpleName() : returns the class simple/short name</li>
 * <li>getFullName() : returns the class simple/short name</li>
 * <li>getClassName() : returns the class simple/short name</li>
 * <li>getClassSimpleName() : returns the class simple/short name</li>
 * <li>getClassFullName() : returns the class full name</li>
 * <li>getFullClassName() : returns the class full name</li>
 * <li>getNamespace(): returns the namespace</li>
 * </ul>
 * @param {Function|Klass} cls
 * @param {String} name
 * @param {String|SereniX.Namespace} namespace
 * @returns {Function}
 */
Klass.setMainMetadata = function(cls, name, namespace) {
    if (typeof cls !== 'function') {
        return null;
    }
    var p = cls.prototype;
    cls.__CLASS__ = cls;
    cls.__CLASS_NAME__ = cls.__NAME__ = name;
    p.__CLASS__ = cls;
    p.__CLASS_NAME__ = name;
    if (typeof namespace === 'undefined' || namespace === null || namespace === '') {
        return;
    }
    if (typeof namespace === 'string') {
        var _ns = SereniX.Namespace.ns(namespace);
        cls.__NAMESPACE__ = _ns;
        cls.__NAMESPACE_NAME__ = namespace;
        _ns.addElement(cls);
    } else if (namespace instanceof SereniX.Namespace) {
        namespace.addElement(cls);
        cls.__NAMESPACE__ = namespace;
        cls.__NAMESPACE_NAME__ = namespace.getFullName();
    } else if (isArray(namespace)) {
        var n = namespace.length, _ns, ns, path = "", parent = null;;
        for (var i = 0; i < n; i++) {
            _ns = namespace[i];
            if (typeof _ns === 'string') {
                path = path ? path + '.' + _ns : _ns;
                ns = SereniX.ns(_ns);
                globalNS[path] = ns;
                if (parent === null) {
                    parent.addChild(ns);
                }
                parent = ns;
            } else {
                throw new Error("Incorrect namespace argument");
            }
        }
        if (n > 0) {
            cls.__NAMESPACE__ = ns;
            cls.__NAMESPACE_NAME__ = path;
        }
    }  else if (typeof namespace === 'object') {
        //TODO
    }

    /**
    * 
    * @returns {String}
    */
    cls.getSimpleName = function() {
        return this.__CLASS_NAME__;
    };
    cls.getClassSimpleName= function() {
        return this.__CLASS_NAME__;
    };
    /**
     * 
     * @returns {String}
     */
    cls.getClassShortName = function() {
        return this.__CLASS_NAME__;
    };
   /**
    * 
    * @returns {String}
    */
    cls.getFullName = function() {
        if (this.namespace) {
            return this.namespace.getFullName() + '.' + this.getSimpleName();
        }
        return this.getSimpleName();
    };
    
    p.__CLASS__ = cls;
    
    p.__CLASS_NAME__ = name;
    /**
     * 
     * @returns {undefined}
     */
    p.getKlassName = function() {
        return this.__CLASS_NAME__;
    };
    /**
     * 
     * @returns {undefined}
     */
    p.getKlass = function() {
        return this.__CLASS__;
    };
    /**
     * 
     */
    p.getClassFullName = function() {
        return this.__CLASS__.getFullName();
    };
    /**
     * 
     */
    p.getKlassFullName = function() {
        return this.__CLASS__.getFullName();
    };
    /**
     * 
     * @returns {undefined}
     */
    p.getClassName = function() {
        return this.__CLASS_NAME__;
    };
    /**
     * 
     * @returns {String}
     */
    cls.getClassName = function() {
        return this.__CLASS_NAME__;
    };
    /**
     * 
     * @returns {String}
     */
    cls.getClassSimpleName = function() {
        return this.__CLASS_NAME__;
    };
    
    /**
     * 
     * @returns {String}
     */
    cls.getClassShortName = function() {
        return this.__CLASS_NAME__;
    };

    /**
     * 
     * @returns {Klass}
     */
    cls.getKlass = function() {
        return this.__CLASS__;
    };
    /**
     * 
     * @returns {Namespace}
     */
    cls.getNamespace = function() {
        return this.namespace ? this.namespace : null;
    };
    cls.prototype = p; //secure the changes made in the class prototype 
                        //variable p despite the browser used.
    return cls;
};
/**
 * Sets the metadata of the class
 */
Klass.setMainMetadata(Klass, 'Klass', 'SereniX');
/**
 * Normalizes in one object, the  properties, methods and fields of the class 
 * and instance from given arguments etracted from the metadata 
 * (class definition) of the class. After normalization, returns the normalied 
 * object.
 * @param {Object|Array} properties The properties of the instance and/or of the class (static properties)
 * @param {Object|Array} methods    The methods of the instance and/or of the class (static properties)
 * @param {Object|Array} inst       The elements (properties, methods and/or fields) of the class instance
 * @param {Object|Array} statics    The static elements (properties, methods and/or fields) of the class
 * @returns {Object}
 */
Klass.getClassAttribs = function(properties, methods, inst, statics) {
    var attribs = {};
    var instanceProps1 = false, clsProps1 = false;
    var instanceMethods1 = false, clsMethods1 = false;
    var instanceProps2 = false, clsProps2 = false;
    var instanceMethods2 = false, clsMethods2 = false, 
            instanceFields1 = false, classFields1 = false,
            instanceFields2 = false, classFields2 = false;
    
    
    var _instance = false, _statics = false;
    
    
    function set(attrs, props1, props2, methods1, methods2, fields1, fields2, type, obj) {
        if (methods1 || props1 || methods2 || props2 || fields1 || fields2) {
            attrs[type] = {};            
            var elts = [];
            if (props1 || methods1 || fields1) {
                elts[elts.length] = { properties: props1 , methods: methods1, fields : fields1 };
            }
            if (props2 || methods2 || fields2) {
                elts[elts.length] = { properties: props2 , methods: methods2, fields : fields2 }; 
            }
            attrs[type].elements = elts;
            if (props1) {
                if (props2) {
                    attrs[type].properties = [props1, props2];
                } else {
                    attrs[type].properties = [props1];
                }
            } else if (props2) {
                attrs[type].properties = [props2];                
            }
            if (methods1) {
                if (methods2) {
                    attrs[type].methods = [methods1, methods2];
                } else {                    
                    attrs[type].methods = [methods1];
                }
            } else if (methods2) {
                attrs[type].methods = [methods2];
            }
            
            attrs[type].object = obj||null;
        }
        return attrs;
    } // end set function
    
    if (isArray(methods)) {
        instanceMethods1 = methods;
        _instance = true;
    } else if (methods) {
        instanceMethods1 = methods.instance||methods.prototype||methods.object||methods.properties;
        clsMethods1 = methods.statics||methods["static"]||methods["class"]
                ||methods["Class"]||methods["klass"]||methods["Klass"]||false;
        if (!instanceMethods1 && !clsMethods1) {
            instanceMethods1 = methods;
        }
        if (instanceMethods1) {
            _instance = true;
        }
        if (clsMethods1) {
            _statics = true;
        }
    }
    var _pfield;
    function pval(obj, fields) {
        _pfield = "";
        var v;
        for (var i = 0, n = fields.length; i < n; i++) {
            v = obj[_pfield=fields[i]];
            if (v) {
                return v;
            }
        }
        _pfield = "";
    }

    if (isArray(properties)) {
        instanceProps1 = properties;
        _instance = true;
    } else if (properties) {
        var staticFields = ["statics", "static", "class",
                "Class", "klass", "Klass"];
        instanceProps1 = properties.instance||properties.prototype||properties.object||properties.properties||false;
        clsProps1 = pval(properties, staticFields)||false;
        if (!instanceProps1) {
            if (clsProps1) {
                instanceProps1 = {};
                for (var k in properties) {
                    if (k !== '_prop_' && k !== '__prop__' && staticFields.indexOf(k) < 0) {
                        instanceProps1[k] = properties[k];
                    }
                }
            } else {
                instanceProps1 = properties;
            }
        }
        if (instanceProps1) {
            _instance = true;
        }
        if (clsProps1) {
            _statics = true;
        }
    }
    if (inst) {
        instanceProps2 = inst.properties||inst.Properties||inst.props||false;
        instanceMethods2 = inst.methods||inst.Methods||inst.functions||false;
        instanceFields2 = inst.fields||inst.Fields||false;
        if (instanceProps2 || instanceMethods2 || instanceFields2)
            _instance = true;
        else {
            var exclusions = ['__proto__'];
            for (var name in inst) {
                if (exclusions.indexOf(name) < 0) {
                    if (typeof inst[name] === 'function') {
                        if (!instanceMethods2) {
                            instanceMethods2 = { };
                        }
                        instanceMethods2[name] = inst[name];
                    } else {
                        if (!instanceFields2) {
                            instanceFields2 = { };
                        }
                        instanceFields2[name] = inst[name];
                    }
                }
            }
            _instance = instanceMethods2 || instanceFields2 ? true: false;
        }
    }

    if (statics) {
        clsProps2 = statics.properties||statics.Properties||statics.props||false;
        clsMethods2 = statics.methods||statics.Methods||statics.functions||false;
        classFields2 = statics.fields||statics.Fields||false;
        if (clsProps2 || clsMethods2 || classFields2)
            _statics = true;
        
        var exc = _statics ? [ "properties", "methods", "fields", "Properties", 
                "Methods","Fields", "__proto__"]: ["__proto__"];
        for (var name in statics) {
            if (exc.indexOf(name) < 0) {
                if (typeof statics[name] === 'function') {
                    if (!clsMethods2) {
                        clsMethods2 = { };
                    }
                    clsMethods2[name] = statics[name];
                } else {
                    if (!classFields2) {
                        classFields2 = { };
                    }
                    classFields2[name] = statics[name];
                }
            }
        }
        _statics = clsMethods2 || classFields2 ? true: false;
    }
    if ( _instance ) {
        attribs = set(attribs, 
            instanceProps1, instanceProps2, 
            instanceMethods1, instanceMethods2, 
            instanceFields1, instanceFields2, 
            "instance");
    }
    if ( _statics ) {
        attribs = set(attribs, 
            clsProps1, clsProps2, 
            clsMethods1, clsMethods2, 
            classFields1, classFields2, 
            "statics", statics);
    }
    return attribs;
};

/**
 * Sets the class attributes (properties, methods or fields) and the 
 * instance/prototype attributes from the given attributes 
 * metadata (parameter attribs).
 * @param {Function} Cls The javascript function representing the class
 * @param {Object} attribs    The attributes metadata elements (properties, 
 *     methods or fields) of the  class and/or the instance.
 * @returns {Function} The modified javascript function representing the class
 */
Klass.processClass = function(Cls, attribs) {    
    
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass : Klass;
    
    function processAttribs(owner, attribs, type, Cls) {
        var tobj = attribs[type];
        var elts;
        if (tobj && (elts = tobj.elements)) {
            var e;
            for (var i = 0, n = elts.length; i < n; i++) {
                e = elts[i];
                if (e.properties) {
                     K.copyProps(owner, e.properties, e.methods, Cls);
                }
                if (e.methods) {
                    K.copyMethods(owner, e.methods, Cls);
                }
                if (e.fields) {
                    K.copyFields(owner, e.fields, Cls);
                }
            }
        }
    }
    
    processAttribs(Cls.prototype, attribs, "instance", Cls);

    processAttribs(Cls, attribs, "statics", Cls);

    return Cls;
};
/**
 * 
 * @param {Object} props
 * @param {Object} classAttribs
 * @returns {Function}
 */
Klass.initClass= function(props, classAttribs) {
    function doInherit(cls, _this, args) {
        var sc = cls.__SUPER_CLASS__;
        if (cls.__inherit__) {
            sc.apply(_this, args);
        } else {
            if (sc.__defineClassProps__) 
                sc.__defineClassProps__.call(_this.__CLASS__);
            if (sc.__defineInstanceProps__) 
                sc.__defineInstanceProps__.call(_this);
        }
    }
    /**
     * 
     * @param {Function|Object} construct
     * @param {Boolean} inherit
     * @param {String} constructName
     * @returns {Function}
     */
    function _getClass(construct, inherit, constructName, className) {
        if (!className) {
            className = "_Class__";
        }
        if (construct && inherit) {
            var _Class__ = eval("(function() { return function " + className + "() {"
 +"\n                var args = [].slice.call(arguments);"
 +"\n                " + className + ".doInherit(" + className + ", this, args);"
 +"\n                " + className + ".__CONSTRUCTOR__.apply(this, args);"
 +"\n            };})()");
            _Class__.doInherit = doInherit;  
            _Class__.__inherit__ = true;
            _Class__.__CONSTRUCTOR__ = construct;
            if (constructName) {
                _Class__.__CONSTRUCTOR_NAME__ = _Class__.__CONSTRUCTOR__.__NAME__ = constructName;
            }
            return _Class__;
        }
        if (inherit) {
            var _Class__ = eval("(function() { return function " + className + "() {"
 +"\n                " + className + ".doInherit(" + className + ", this, [].slice.call(arguments));"
 +"\n            };})()");
            _Class__.doInherit = doInherit;
            _Class__.__inherit__ = true;
            return _Class__;
        }
        if (construct) {
            var _Class__ = eval("(function () { return function " + className + "() {"
 +"\n                var args = [].slice.call(arguments);"
 +"\n                " + className + ".__CONSTRUCTOR__.apply(this, args);"
 +"\n            }; })()");
            _Class__.__CONSTRUCTOR__ = construct;
            if (constructName) {
                _Class__.__CONSTRUCTOR_NAME__ = _Class__.__CONSTRUCTOR__.__NAME__ = constructName;
            }
            return _Class__;
        }
        var _Class__ = eval("(function() { return function "+ className + "() {}; })()");
        return _Class__;
    }
    
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass :  Klass,
        co = props.construct, 
        cName = props.constructName||"",
        sci = globalNS["SUPER_CLASS_CONSTRUCTOR_INHERITENCE"];

    if (!cName && co && co.name) {
        cName = co.name;
    }
    var _className = props._className||props.name||"_Class__";
    var pos = _className.lastIndexOf(".");
    if (pos >= 0) {
        _className = _className.substring(pos + 1);
    }

    //the super class constructor inheritence
    sci = typeof sci !== 'undefined' ? true : (sci ? true : false);
    
    function hasInstanceProp(classAttribs) {
        var ps;
        if (!classAttribs || !classAttribs.instance || !(ps = classAttribs.instance.properties) || ps.length === 0)
            return false;
        for (var i = 0, n = ps.length; i < n; i++) {
            if (isArray(ps[i]) && ps[i].length > 0)
                return true;
            if (isPlainObject(ps[i])) {
                for (var name in ps[i]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    if (!co && hasInstanceProp(classAttribs)) {
        co = function(opts) {
            if (!opts || !isPlainObject(opts)) {
                return;
            }
            
            for (var name in opts) {
                if ((!Object.hasOwnProperty || Object.hasOwnProperty.call(opts, name)) && [
                    'toString', 'toLocaleString', '__proto__', '__CLASS__, __CLASS_NAME__', 
                    '__NAME__', '__NAMESPACE__', '__NAMESPACE_NAME__', '__NAMESPACE_NAME___', 
                    '__AUTHOR__', '__SINCE__', '__VERSION__' ].indexOf(name) < 0) {
                    this[name] = opts[name];
                }
            }
        };
    }

    if (typeof co === 'function') {
        return _getClass(co, sci, cName, _className);
    }
    if (isPlainObject(co)) {
        var inherit = typeof co.inherit === 'boolean' ? 
            co.inherit : toBoolean(co.inherit);
   
        return _getClass(co.method||co.construct||co.__construct__||co.func||co["function"]
                        ||co["procedure"], 
                    inherit === null ? sci: inherit, cName, _className);
    }
    return _getClass(co, sci, cName, _className);
};
/**
 * 
 * @param {Function} Cls
 * @param {type} md    The class metadata/definition
 * @param {array} classExclusions  The names of properties of the parent class to exclude at class level.
 * @param {array} instanceExclusions  The names of properties of the parent class to exclude at prototype (instance) level.
 * @param {Function} parentClass The parent class
 * @param {Boolean} preExists
 * @returns {undefined}
 */
Klass.buildClass = function(Cls, md, classExclusions, instanceExclusions, parentClass, preExists) {
    
    function add(arr, data) {
        for (var i = 0; i < data.length; i++) {
            arr[arr.length] = data[i];
        }
        return arr;
    }
    
    
    var args = arguments;
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass :  Klass;
    while (args.length === 1 && isArray(args[0])) {
        args = args[0];
    }
    if (typeof args[args.length - 1] === 'function') {
        parentClass = args[args.length - 1];
        if (args.length === 2) {
            md = false;
            classExclusions = false;
            instanceExclusions = false;
        } else if (args.length === 3) {
            classExclusions = false;
            instanceExclusions = false;
        }
        preExists = false;
    } else if (args.length === 2) {
        parentClass = md.parentClass||md.superClass;
    } else if (args.length > 2) { 
        if (typeof args[args.length - 1] === 'boolean') {
            preExists = args[args.length - 1];
            if (typeof args[args.length - 2] === 'function') {
                parentClass = args[args.length - 2];
                if (args.length === 3) {
                    md = false;
                    classExclusions = false;
                    instanceExclusions = false;
                } else if (args.length === 4) {
                    classExclusions = false;
                    instanceExclusions = false;
                }
            } else if (args.length === 3) {
                parentClass = md.parentClass||md.superClass;
            }
        }        
    }
    //get normalized attributes (properties, methods and fields) of the class
    //the normalized attributesobject contains static (class level) elements 
    //and instance (class prototype level) elements.
    var classAttribs = K.getClassAttribs(            
        md.properties||md.props||md.Properties||md.Props,
        md.methods||md.functions||md.Methods||md.Functions,
        md.instance||md.prototype||md.proto||md.object
                ||md.Instance||md.Prototype
                ||md.Proto||md.Object, 
        md.statics||md["static"]||md["class"]||md["klass"]
                ||md["Statics"]||md["Static"]||md["Class"]
                ||md["Klass"]
    );

    
    if (!preExists) {
        
        Cls = K.initClass(md, classAttribs);
        
        var parentClassExclusions = false;
        if (!parentClass || (parentClass === K)) {
            parentClassExclusions = [ 
                "createClass", "__CLASS__", "__CLASS_NAME__", "__SINCE__", 
                "__VERSION__", "__AUTHOR__", "defProperty", "__NAME__",
                "__NAMESPACE__", "__NAMESPACE_NAME__", "__NAMESPACE_NAME___",
                "__namespace__", "_namespace_", 
                "__inherit__",
                "CLASS_PARAMETER_TYPE_SYMBOLS",
                "createObjectProperty", "createClassProperty", "initClass",
                "createInstanceProperty", "Class", "setMainMetadata", "getClassAttribs",
                "processClass", "buildClass", "normalizeField", "copyFields", 
                "copyInstanceFields", "copyElements", "getGetterName", "doInherit", 
                "getSetterName", "getBooleanGetterName", "addStringProperty", 
                "addProperty", "getMethodsCheck", "setParamTypesCheck", 
                "__DEFAULT_PARAM_TYPES_CHECK", "getStringCheck", "normalizeValues",
                "addNProperty", "copyProps",
                "copyInstanceMethods", "copyClassMethods", "copyMethods", "forname", "isClass",
                "EXTENSION_EXCLUSIONS", "extend", "createClass", 
                "_setElts", "_getProp", "metadataFromArray", "extFunc",
                "isValidPropertyName", "getPropFromString", "extendClass", 
                "getParamTypesCheck", "getConstructor", "addProperties", "copyProps",
                "addProps", "copyPropsPreExist", "createDefaultGetter", "createDefaultSetter",
                "doInherit", "ext", "getAccessors", "metadataFromArgs", 
                "createException", "Exception", "exception", "createError",
                "__definedProperties___"
            ];
        } else if (md.construct) {
            parentClassExclusions = [ '__CONSTRUCTOR__', 'constructName', '__CONSTRUCTOR_NAME__', 
                "__CLASS__", "__CLASS_NAME__", "__SINCE__", 
                "__VERSION__", "__AUTHOR__", "__NAME__",
                "__NAMESPACE__", "__NAMESPACE_NAME__", "__NAMESPACE_NAME___",
                "__namespace__", "_namespace_", "__inherit__", "__definedProperties___" ];
        }
        //the class inherit properties, fields and methods from the parent class
        Cls = K.extend(Cls, parentClass||K, parentClassExclusions, classAttribs);
        
        if (typeof md.inherit !== 'undefined' && md.inherit !== null) {
            Cls.__inherit__ = toBool(md.inherit);
        }
        
        K.setMainMetadata(Cls, md.name, md['namespace']||md['nameSpace']||'');

    }
    
    /** add class to namespace */
    var ns = md["namespace"]||md["Namespace"]||md["ns"];
    var NS = globalNS.SereniX && SereniX.Namespace ? SereniX.Namespace : globalNS["Namespace"];
    if (NS && (ns instanceof NS)) {
        ns.addElement(Cls);
    } else if (ns) {
        $ns(ns).addElement(Cls);
    }
    
    if (typeof md.destruct === 'function') {
        Cls.prototype.__destruct = md.destruct;
    }

    // Sets the class attributes (properties, methods or fields) and the 
    // instance/prototype attributes
    Cls = this.processClass(Cls, classAttribs, preExists);
    
    
    if (!isArray(instanceExclusions)) {
        instanceExclusions = [];
    }
    
    instanceExclusions = add(instanceExclusions, [ 
        "instance", "prototype", "proto", "object", "Instance", 
        "Prototype", "Proto", "Object",
        "properties", "Properties", "md", "Props", "methods", "Methods", 
        "functions", "Functions", "statics", "static", "Statics", "Static", 
        "class", "klass", "Class", "Klass", "name", "namespace", "Name", 
        "Namespace", "className", "classname",
        "construct", "__construct", "Construct", "Constructor", 
        "constructor", "destruct", "__destruct", "Destruct", "Destructor", 
        "destructor", "fields", "Fields", "constructName",
        "__definedAliases___", "__definedProperties___"
    ]);
    var constructorName = md.constructName;
    if (constructorName) {
        instanceExclusions[instanceExclusions.length] = constructorName;
    }    
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass : Klass;
    //Copy the fields setted at the first level of the class metadata/definition
    //object as the class name, constructor, properties and/or methods.
    Cls = K.copyInstanceFields(Cls, md, instanceExclusions);
    
    if (!isArray(classExclusions)) {
        classExclusions = [];
    }   
    Cls.prototype.toJSONString = function() {
        var str = "";
        var keys = Object.keys(this), v, self = this;
        keys.forEach(function(k, i) {
            if ((v = self[k]) != undefined) {
                str += (str ? "," : "") 
                    + '"'
                    + (/^__[a-z][a-zA-Z$_]*_$/.test(k) ? k.substring(2, k.length - 1) : k) 
                    +  '"'
                    + ":" ;
                if (typeof v === 'object' && v) {
                    str += typeof v.toJSONString === 'function'? v.toJSONString() : JSON.stringify(v);
                } else {
                    str += JSON.stringify(v);
                }
            }
        });
        str = "{" + str + "}";
        return str;
    };
    return Cls;
};

/**
 * 
 * @param {type} field
 * @returns {Object}
 */
Klass.normalizeField = function(field) {
    function getValue(field) {
        var v = field.value;
        if (typeof v === 'undefined') {
            v = field.Value;
            if (typeof v === 'undefined') {
                v = field.defaultValue;
                if (typeof v === 'undefined') {
                    v = field.DefaultValue;
                } else
                    return null;
            }
        }
        return v;
    }
    if (typeof field === 'string') {
        return { "name": field, "value" : null };
    }
    var name = field["name"]||field["Name"];
    if (name) {
        return { 
            "name": name, 
            value :  getValue(field)
        };
    }
    if (isArray(field)) {
        if (typeof field[0] !== 'string') {
            throw new Error("Incorrect array field");            
        }
        return  { name: field[0], value: field[1] };
    }
    var v, i = 0, entries = [];
    for (var key in field) {
        v = field[key];
        entries[i] = [ key, v];
        i++;
    }
    if (i === 1) {
        return { "name": entries[0][0], "value" : entries[0][1] };
    }
    return null;
};
/**
 * 
 * @param {Function|Object} obj
 * @param {type} fields
 * @param {array} exclus
 * @param {Function} Cls
 * @returns {Function|Object}
 */
Klass.copyFields = function(obj, fields, exclus, Cls) {
    var exclusions;
    if (typeof arguments[2] === 'function') {
        exclusions = Cls;
        Cls = exclus;
        exclus = exclusions;
    } else {
        exclusions = exclus;
    }
    if (isArray(fields)) {
        if (exclusions) {
            var n = fields.length, name, prop;
            for (var i = 0; i < n; i++) { 
                prop = this.normalizeField(fields[i]);
                if (prop && exclusions.indexOf(prop.name) < 0) {
                    obj[prop.name] = prop.value;
                }
            }
        } else {
            var n = fields.length, name, prop;
            for (var i = 0; i < n; i++) { 
                prop = this.normalizeField(fields[i]);
                obj[prop.name] = prop.value;
            }
        }
    } else if (exclusions) {
        for (var name in fields) { 
            if (exclusions.indexOf(name) < 0) {
                obj[name] = fields[name];
            }
        }
    } else {
        for (var name in fields) {        
            obj[name] = fields[name];
        }
    }
    return obj;
};

/**
 * 
 * @param {Function} Cls
 * @param {type} fields
 * @param {array} exclusions
 * @returns {Function}
 */
Klass.copyInstanceFields = function(Cls, fields, exclusions) {
    Cls.prototype = this.copyFields(Cls.prototype, fields, exclusions, Cls);
    return Cls;
};


/**
 * 
 * @returns {String}
 */
Klass.getGetterName = function () {
    function coalesce(obj, fields) {
        var v;
        for (var i = 0, n = fields.length; i < n; i++) {
            if ((v = obj[fields[i]]) !== undefined && v !== null) return v;
        }
    }
 
    
    var args = arguments, name = args[0], bool;
    bool = args.length > 1 ? args[1] : false;
    if (Object.prototype.toString.call(bool) === '[object Object]') {
        var p = bool;
        var _$typ = (p.type||p.Type||""), _boolTyp;
        
        if (typeof _$typ === 'string') {
            if (['boolean', 'bool'].indexOf(_$typ.toLowerCase()) >= 0) {
                var _null = coalesce(p, ['nullable', 'isNull', 'is_null', 'optional']);
                if (_null === undefined) {
                    _null = coalesce(p, ['isNotNull', 'is_not_null', 'required', 'mandatory']);
                    if (_null !== undefined) {
                        _null = !_null;
                    }
                } else {
                    _null = !!_null;
                }
                bool = _null === undefined && ['boolean', 'bool'].indexOf(_$typ) >= 0 || _null;
            } else bool = false;            
        } else bool = false;
    }
    var gName, n = name.length;
    if (bool) {
        gName = 'is';
    } else {
        gName = 'get';
    }
    gName += name[0].toUpperCase() + (n > 1 ? name.substring(1) : '');
    return gName;
};
/**
 * 
 * @returns {String}
 */
Klass.getSetterName = function () {
    var args = arguments, name = args[0];
    var sName = 'set', n = name.length;
    sName += name[0].toUpperCase() + (n > 1 ? name.substring(1) : '');
    return sName;
};
/**
 * 
 * @returns {String}
 */
Klass.getBooleanGetterName = function () {
    var args = arguments, name = args[0], bool;
    bool = args.length > 1 ? args[1] : false;
    var gName = 'is', n = name.length;
    gName += name[0].toUpperCase() + (n > 1 ? name.substring(1) : '');
    return gName;
};

/**
 * 
 * @param {Function|Object} obj
 * @param {String} name The property string/name
 * @param {Function} Cls The class
 * @returns {Function|Object}
 */
Klass.addStringProperty=function(obj, name, Cls) {
    
    var i = name.indexOf("<");
    var fname = "_" + name;
    if (i < 0) {        
        obj[fname] = null;                    
        var gName= this.getGetterName(name);
        obj[gName] = function __Getter__() {
            return this[__Getter__.__fieldName__];
        };
        __Getter__.__fieldName__= fname;

        var sName = this.getSetterName(name);
        obj[sName] = function __Setter__(val) {
            this[__Setter__.__fieldName__] = val;
        };
        __Setter__.__fieldName__= fname;
        return obj;
    }
    var K = globalNS.SereniX && SereniX.KlassUtils ? 
            SereniX.KlassUtils : KlassUtils;
    return this.addProperty(obj, K.getPropFromString(name), Cls);
};
/**
 * 
 * @param {Function|Object} obj
 * @param {Object} prop
 * @param {Object} accessors
 * @param {Function} Cls
 * @returns {Function}
 */
Klass.addProperty=function(obj, prop, accessors, Cls) {
    if (typeof arguments[2] === 'function') {
        var f = arguments[2];
        accessors = Cls;
        Cls = f;
    }
    if (typeof prop === 'undefined' || prop === null) {
        throw new Error("Undefined or null property");
    }
    var name = prop.name||prop.Name;
    if ((!name) || (typeof name !== 'string')) {
        throw new Error("Incorrect property name");
    }
    return this.addNProperty(obj, name, prop, accessors, false, Cls);
};

/**
 * 
 * @param {Function|Object} obj
 * @param {Object} props
 * @param {Object} accessors
 * @returns {Function}
 */
Klass.addProperties=function(obj, props, accessors) {
    function getGetterName(accessors, prop, _this) {
        var gName = prop.getterName;
        if (gName) {
            return gName;
        }
        var type = prop.type||prop.Type||"",
            tname = (typeof type === 'string' ? type : 
                (typeof type.getType === 'function' ? 
                    type.getType()||"" : type.type||type.name||"")).toLowerCase(),
            boolType = ['boolean', 'bool' ].indexOf(tname) < 0;
    
        gName = boolType ? 
            _this.getGetterName(name) : _this.getBooleanGetterName(name);
        if (!accessors[gName] && boolType) {
            var gn = _this.getGetterName(name);
            get = accessors[gn];
            if (get) {
                gName = gn;
            }
        }
        return gName;
    }
    function getSetterName(prop, _this) {
        return prop.setterName||_this.getSetterName(name);
    }
    /**
     * 
     * @param {type} accessors
     * @param {type} prop
     * @param {type} name
     * @returns {Object}
     */
    function getAccessors(accessors, prop, name) {
        var acc = accessors[name], gName,sName;
        if (!acc) {
            var get, set, gName, sName;
            gName = getGetterName(accessors, prop, this);
            sName = getSetterName(prop, this);
            get = accessors[gName];
            
            set = accessors[sName];

            if (get || set) {
                acc = { 
                    "get" : get, 
                    "set": set, 
                    getterName : gName, 
                    setterName: sName
                };
                acc["getter"] = get;
                acc["setter"] = set;
            }
        } else {
            if (!acc.getterName) {
                acc.getterName = getGetterName(accessors, prop, this);
            }
            if (!acc.setterName) {
                acc.setterName = getSetterName(prop, this);
            }
        }
        return acc;
    } //end getAccessors function
    
    var prop, acc, get, set, type, 
        K = globalNS.SereniX && SereniX.KlassUtils ? 
                SereniX.KlassUtils : KlassUtils;
    if (isArray(props)) {
        var name;
        for (var i = 0, n = props.length; i < n; i++) {
            prop = props [i];
            if (typeof prop === 'string') {
                prop = K.getPropFromString(prop);
            } else if (isArray(prop)) {
                prop = K.getPropFromArray(prop);
            } else if (!isPlainObject(prop)) {
                throw new Error("Incorrect property metadata at index " + i + ". Expected plain object, String or array.");
            }
            name = prop.name;
            acc = getAccessors(accessors, prop, name);
            this.addNProperty(obj, name, prop, acc, true);
        }
        return this;
    }
    for (var name in props) {
        prop = props[name];
        if (typeof prop === 'string') {
            var i = prop.indexOf("<");
            if (i < 0) {
                prop = { "name": name, "type" : prop, nullable: true };
            } else {                
                prop = K.fromString(K.createContext(prop, //the tring representation of the property attributes (type name for eample)
                            0, i, true), {}, "type");
            }
        } else if (isArray(prop)) {
            prop = K.getTypeFromArray(prop);
            if (typeof prop.nullable === 'undefined' || prop.nullable === null) {
                prop.nullable = true;
            }
        } else if (!isPlainObject(prop)) {
            throw new Error("Incorrect peoperty type");
        }
        acc = getAccessors(accessors, prop, name);
        this.addNProperty(obj, name, prop, acc, true);
    }
    return this;
};
/**
 * 
 * @param {Function|Object} obj
 * @param {Object} props
 * @param {Object} accessors
 * @returns {Function}
 */
Klass.addProps = Klass.addProperties;
/**
 * 
 * @param {Object} obj
 * @param {type} pname
 * @param {Object} methods
 * @param {type} type
 * @returns {Object}
 */
Klass.getAccessors = function(obj, pname, methods, type) {
    var typeName = (typeof type === 'string' ? type : 
            (typeof type.getType === 'function' ? 
                type.getType()||"" : type.type||type.name||"")).toLowerCase();
    var getter, setter, 
            boolType = ['boolean', 'bool'].indexOf(typeName) >= 0,
            gName= boolType ? this.getBooleanGetterName(pname) : this.getGetterName(pname),
            sName = this.getSetterName(pname);
    if (methods) {
        getter = methods[gName];
        if (!getter && boolType) {
            var gn= this.getGetterName(pname);
            getter = methods[gn];
            if (getter) {
                gName = gn;
            }
        }
        setter = methods[sName];
    }
    return  {
        'getter' : getter, 
        'getterName' : gName, 
        'setter' :  setter,
        'setterName' : sName
    };
};
/**
 * 
 * @param {type} obj
 * @param {type} pname
 * @param {type} methods
 * @param {type} type
 * @returns {Object}
 */
Klass.getPreExistsAccessors = function(obj, pname, methods, type) {
    var typeName = (typeof type === 'string' ? type : 
            (typeof type.getType === 'function' ? 
                type.getType()||"" : type.type||type.name||"")).toLowerCase();
    var getter, setter, 
            boolType = ['boolean', 'bool'].indexOf(typeName) >= 0,
            gName= boolType ? this.getBooleanGetterName(pname) : this.getGetterName(pname),
            sName = this.getSetterName(pname);
    if (methods) {
        getter = methods[gName];
        if (!getter && boolType) {
            var gn= this.getGetterName(pname);
            getter = methods[gn];
            if (getter) {
                gName = gn;
            }
        }
        setter = methods[sName];
    }
    if (!getter) {
        getter = obj[gName];
        if (!getter && boolType) {
            var gn= this.getGetterName(pname);
            getter = obj[gn];
            if (getter) {
                gName = gn;
            }
        }
    }
    if (!setter) {
        setter = obj[sName];
    }
    return  {
        'getter' : getter, 
        'getterName' : gName, 
        'setter' :  setter,
        'setterName' : sName
    };
};
/**
 * 
 * @param {String} fname
 * @param {String|Number|Boolean|Array|Object} defaultValue
 * @param {boolean} [valued=true]
 * @returns {Function} The getter method/function created
 */
Klass.createDefaultGetter = function(fname, defaultValue, valued) {
    if (arguments.length === 2) {
        valued = false;
    } else if (arguments.length < 3) {
        valued = true;
    }
    if (valued) {
        
        /**
         * 
         * @returns {unresolved}
         */
        function __Getter__() {
            var v = this[__Getter__.__fieldName__];
            return typeof v !== 'undefined' && v !== null ? v : __Getter__.__defaultValue__;
        };
        __Getter__.__fieldName__= fname;
        __Getter__.__defaultValue__= defaultValue;
        return  __Getter__;
    }  else if (typeof defaultValue === 'function') {
        /**
         * 
         * @returns {unresolved}
         */
        function __Getter__() {
            var v = this[__Getter__.__fieldName__];
            return typeof v !== 'undefined' && v !== null ? v : __Getter__.__defaultValue__();
        };
        __Getter__.__fieldName__= fname;
        __Getter__.__defaultValue__= defaultValue;
        return  __Getter__;
    } else {
        /**
         * 
         * @returns {unresolved}
         */
        function __Getter__() {
            return this[__Getter__.__fieldName__];
        };
        __Getter__.__fieldName__= fname;
        return  __Getter__;
    }
};
/**
 * 
 * @param {String} fname   The field/property name
 * @param {Function} tcheck The function used to check the value argument of the setter.
 * @returns {Function} The setter method/function created
 */
Klass.createDefaultSetter = function(fname, tcheck, binding) {
    if (binding) {
        if (tcheck) {
            /**
             * 
             * @param {type} val
             * @returns {undefined}
             */
            function __Setter__(val) {
                var lastVal = this[__Setter__.__fieldName__];
                if (!__Setter__.check.call(this, val)) {
                    throw new ValueError("Incorrect value");
                }
                this[__Setter__.__fieldName__] = val;
                if (val) {
                    val[__Setter__.__binding__] = this;
                } else if (lastVal) {
                    delete lastVal[__Setter__.__binding__];
                }
                return this;
            };
            __Setter__.check = tcheck;
            __Setter__.__fieldName__= fname;
            __Setter__.__binding__= binding;
            return __Setter__;
        } else {
            /**
             * 
             * @param {type} val
             * @returns {undefined}
             */
            function __Setter__(val) {
                var lastVal = this[__Setter__.__fieldName__];
                this[__Setter__.__fieldName__] = val;
                if (val) {
                    val[__Setter__.__binding__] = this;
                } else if (lastVal) {
                    delete lastVal[__Setter__.__binding__];
                }
                return this;
            };
            __Setter__.__fieldName__= fname;
            __Setter__.__binding__= binding;
            return __Setter__;
        }
    } else if (tcheck) {
        /**
         * 
         * @param {type} val
         * @returns {undefined}
         */
        function __Setter__(val) {
            if (!__Setter__.check.call(this, val)) {
                throw new ValueError("Incorrect value");
            }
            this[__Setter__.__fieldName__] = val;
            return this;
        };
        __Setter__.check = tcheck;
        __Setter__.__fieldName__= fname;
        return __Setter__;
    } else {
        /**
         * 
         * @param {type} val
         * @returns {undefined}
         */
        function __Setter__(val) {
            this[__Setter__.__fieldName__] = val;
            return this;
        };
        __Setter__.__fieldName__= fname;
        return __Setter__;
    }
};


/**
 * 
 * <p>When a property has a formula/expression it's automatically read-only.</p>
 * @param {Function|Object} obj
 * @param {String} pname  The name of the property
 * @param {Object|String} prop  The definition of the property or data type of the property
 * @param {Object} accessors
 * @param {Boolean} entry  <p>Optional with true as default value.</p>
 * @param {Function} Cls
 * @returns {Function|Object}
 */
Klass.addNProperty = function(obj, pname, prop, accessors, entry, Cls) {
    if (arguments.length < 5) {
        entry = true;
    }
    if (pname === 'ipv4') {
        console.log('ipv4');
    }
    if (pname === 'collaborators') {
        console.log('collaborators');
    }
    if (isString(prop)) {
        var readOnly, re = /^\s*read[-]?only\s*:\s*/i;
        if (readOnly= re.exec(prop)) {
            prop = prop.substring(readOnly[0].length);
        }
        if (SERENIX_NUMBER_TYPES.indexOf(prop) >= 0 || prop === 'string') {
            prop = {type: prop, nullable: false};
        } else if (SERENIX_STRING_TYPE_NAMES.indexOf(prop) >= 0) {
            prop = {type: prop, nullable: true};
        } else {
            try {
                prop = KlassUtils.getTypeFromString(prop);
                if (['function', 'string'].indexOf(typeof prop) >= 0  || ['union', 'minus', 'interset', 'interval', 'enum'].indexOf(prop.type) >= 0) {
                    prop = {type: prop};
                }
            } catch (exception) {
                prop = { type: prop };
            }
        }
        if (readOnly) prop.readOnly = true;
    } else if (prop === null && entry) {
        prop = {defaultValue: null };
    }
    
    
    var K = globalNS.SereniX && SereniX.KlassUtils ?
            SereniX.KlassUtils : KlassUtils;

    var def = K.__processProperty(prop, pname, entry, Cls);
    
    var fname = (this.fieldNamePrefix||"__") + pname + (this.fieldNameSufix||"_"),
        getter= prop.getter||prop.get||prop.Getter||prop.Get, 
        setter = prop.setter||prop.set||prop.Setter||prop.Set,
        gName = prop.getterName,
        sName = prop.setterName;

    if (getter instanceof String) {
        getter = getter.valueOf();
    }
    
    if (setter instanceof String) {
        setter = setter.valueOf();
    }
    if (typeof getter === 'string' && getter) {
        if (!gName) {
            gName = getter;            
        }
        getter = undefined;
    }
    
    if (typeof setter === 'string' && setter) {
        if (!sName) {
            sName = setter;            
        }
        setter = undefined;
    }

    var readOnly, 
        formula = prop.formula||prop.Formula
                    ||prop.expression||prop.Expression
                    ||prop.calc||prop.Calc
                    ||prop.calculate||prop.Calculate,
        hasFormula;
    if (typeof formula !== 'undefined' && formula !== null ) {
        hasFormula = true;
        readOnly = true;
    } else { 
        var v = prop.readOnly||prop.readonly||prop["read-only"];
        if (typeof v === 'undefined') {
            v = prop.writable;
            if ( typeof v === 'undefined' || v === null || v === '') {
                v = prop.Writable;
                if ( typeof v === 'undefined' || v === null || v === '') {
                    readOnly = false;
                } else {
                    readOnly = !toBool(v);
                }
            } else {
                readOnly = !toBool(v);
            }
        } else {
            readOnly = toBool(v);
        }
    }

    if (typeof getter === 'string' && getter) {
        gName = getter;
    }

    if (!readOnly && typeof setter === 'string' && setter) {
        sName = setter;
    }
    
    var QS = SereniX.QString||globalNS.QString,
            ES = SereniX.EQString||globalNS.EQString,
            S = SereniX.VString||globalNS.VString,
            L = SereniX.Litteral||globalNS.Litteral,
            V = SereniX.Value||globalNS.Value, 
            A = SereniX.VArray||globalNS.VArray,
            O = SereniX.VObject||globalNS.VObject,
            E = SereniX.Expression||globalNS.Expression,
            R = SereniX.VRegExp||globalNS.VRegExp;
    
    function getArray(arr) {
        var elts = arr._value, e, r, list = [];
        for (var i = 0, n = elts.length; i < n; i++) {
            e = elts[i];
            r = toVal(e);
            if (!r || !r.valued) {
                return null;
            }
            list[i] = r.value;
        }
        return { value: list, valued : true };
    }
    
    function getObj(obj) {
        var props = obj._value, result = {}, v;
        for (var k in props) {
            v = toVal(props[k]);
            if (!v || !v.valued) {
                return null;
            }
            result[k] = v.value;                        
        }
        return { value: result, valued : true };
    }
    
    function toVal(val) {
        if (!(val instanceof E)) {
            return { 
                value : val,
                valued : true 
            };
        }
        var v, valued = false ;
        if (val instanceof QS || val instanceof S) {
            v = val.getValue();
            valued = true;
        } else if (val instanceof O) {
            v = getObj(val);
            if (v && v.valued) {
                valued = true;
                v = v.value;
            }
        } else if (val instanceof A) {
            v = getArray(val);
            if (v && v.valued) {
                valued = true;
                v = v.value;
            }
        } else if (val instanceof L || val instanceof R || val instanceof V) {
            v = val.valueOf();
            valued = true;
        } 
        return { value: v, valued : valued };
    }
    
    function setAliases(aliases) {
        if (isArray(aliases)) {
            var n = aliases.length, al;
            for (var i = 0; i < n; i++) {
                al = aliases[i];
                if (typeof al === 'string' && al !== '') {
                    K.defineProperty(obj, al, desc);
                    obj.__definedAliases___[al] = pname;
                }
            }
        }
    }   
    function coalesce(obj, fields) {
        var v;
        for (var i = 0, n = fields.length; i < n; i++) {
            if ((v = obj[fields[i]]) !== undefined && v !== null) return v;
        }
    }
      
    function defineAliases() {
        var als = prop["aliases"]||prop["Aliases"], 
            al = prop["alias"]||prop["Alias"];
        if ((als || al) && !obj.__definedAliases___) {
            obj.__definedAliases___ = {};
        }
        if (isArray(als)) {
            setAliases(als);
        }

        if (typeof al === 'string' && al !== '') {
            K.defineProperty(obj, al, desc);
            obj.__definedAliases___[al] = pname;
        } else if (isArray(al)) {
            setAliases(al);
        }
    }
    
    
    if (!obj.__definedProperties___) {
        obj.__definedProperties___ = {};
    }
    
    if (hasFormula) {
        var func, val;
        if (formula instanceof String) {
            formula = formula.valueOf();
        }
        if (typeof formula === 'function') {
            func = formula;
        } else if (typeof formula === 'string') {
            func = K.getExprEvaluator(formula);
        } else {
            val = toVal(formula);
            if (val.valued) {
                val = val.value;
            } else {
                func = K.getExprEvaluator(formula);
            }
        }
        var _set = function() { throw new Error("Read only property"); }, desc;
        
        
        desc = func ? { 
                configurable: true,
                enumerable: true, 
                get: func, 
                "getter": func
            } : { 
                configurable: true,
                enumerable: true, 
                writable : false,
                value : val
            };
        desc.formula = prop.formula;
        if (typeof prop.stringFormula) {
            desc.stringFormula = prop.stringFormula;
        }else if (typeof prop.formula === 'function') {
            desc.stringFormula = prop.formula.toString();
        } else if (typeof formula === 'string') {
            desc.stringFormula = formula;
        }
        desc.type = prop.type;
        
        K.defineProperty(obj, pname, desc); 
        if (!func) {
            function _g() {
                return _g.value;
            };
            _g.value = val;
            func = _g;
        }
        if (accessors) {
            //the getter name
            gName = accessors.getterName||gName;
        }
        obj[gName||this.getGetterName(pname, prop)] =  func;
        defineAliases();
        return obj;
    }
    if (accessors) {
        //the getter name
        gName = accessors.getterName||gName,
        //the setter name
        sName = accessors.setterName||sName;        
        
        if (!gName) {
            gName = this.getGetterName(pname, prop);
        }
        if (!readOnly && !sName)
            sName = this.getSetterName(pname);

        getter = accessors[gName]||accessors.getter||accessors.get||getter; 
        if (!readOnly) {
            setter = accessors[sName]||accessors.setter||accessors.set||setter;
        }
       
    } else {    
        if (!gName)
            gName = this.getGetterName(pname);
        if (!readOnly && !sName)
            sName = this.getSetterName(pname);
    }
    
    
    
    var defaultValue, _defVal = hasOwnProp(def, 'defaultValue');
    var v, valued = false ;
    if (_defVal) {
        defaultValue = def.defaultValue;        
        v = toVal(defaultValue);
        valued = v.valued;
        v = v.value;
    } else if (hasOwnProp(def, 'defaultValueCalc')) {
        defaultValue = def.defaultValueCalc;
    }
    
    var calc;
    if (valued) {
        obj[fname] = v;
    } else if (typeof defaultValue === 'function') {
        calc = defaultValue;
    } else if (E && defaultValue instanceof E) {
        calc = K.getExprEvaluator(defaultValue);
    }
    
    
    if (!getter) {
        getter = obj[gName]||(_defVal ? this.createDefaultGetter(fname, calc||v, valued) : this.createDefaultGetter(fname));
    }
    obj[gName] = getter;
    var desc;
    if  (readOnly) {
        desc = { 
            configurable: true,
            enumerable: true, 
            get: getter, 
            "getter": getter,
            type: prop.type
        };
    } else {
        if (!setter) {
            setter = this.createDefaultSetter(fname, def.tcheck);
        }

        obj[sName] = setter;
        
        desc = { 
            configurable: true,
            enumerable: true, 
            get: getter, 
            "getter": getter, 
            set: setter, 
            "setter": setter,
            type: prop.type
        };
    }
    
    
    
    K.defineProperty(obj, pname, desc);  
    
        
    defineAliases();
    
    return obj;
};

/**
 * 
 * @param {Function|Object} obj
 * @param {type} props
 * @param {Object} methods
 * @param {array} exclus
 * @param {Function} Cls
 * @returns {undefined}
 */
Klass.copyProps = function(obj, props, methods, exclus, Cls) {
    var exclusions;
    if (typeof arguments[3] === 'function') {
        exclusions = Cls;
        Cls = exclus;
        exclus = exclusions;
    } else {
        exclusions = exclus;
    }
    var K = globalNS.SereniX && SereniX.KlassUtils ? 
                SereniX.KlassUtils : KlassUtils;
    if (isArray(props)) {
        var n = props.length, pname,prop;
        if (exclusions) {            
            for (var i = 0; i < n; i++) {
                prop = K.normalizeProp(props[i]);
                pname = prop.name||prop.Name;
                if (exclusions.indexOf(pname) < 0) {                    
                    obj = this.addProperty(obj, prop, methods, Cls);
                }
            }
        } else {
            for (var i = 0; i < n; i++) {                
                obj = this.addProperty(obj, K.normalizeProp(props[i]), methods, Cls);
            }
        }
    } else if (exclusions) {
        for (var pname in props) {
            if (exclusions.indexOf(pname) < 0) {
                obj = this.addNProperty(obj, pname, props[pname], methods, true, Cls);
            }
        }
    } else {
        for (var pname in props) {        
            obj = this.addNProperty(obj, pname, props[pname], methods, true, Cls);
        }
    }
    return obj;
};

/**
 * 
 * @param {Function|Object} obj
 * @param {type} props
 * @param {Object} methods
 * @param {array} exclusions
 * @returns {undefined}
 */
Klass.copyPropsPreExist = function(obj, props, methods, exclusions) {
    var K = globalNS.SereniX && SereniX.KlassUtils ? 
                SereniX.KlassUtils : KlassUtils;
    if (isArray(props)) {
        var n = props.length, pname,prop;
        if (exclusions) {            
            for (var i = 0; i < n; i++) {
                K.normalizeProp(props[i]);
                pname = prop.name||prop.Name;
                if (exclusions.indexOf(pname) < 0) {
                    obj = this.addProperty(obj, prop, methods);
                }
            }
        } else {
            for (var i = 0; i < n; i++) {                
                obj = this.addProperty(obj, K.normalizeProp(props[i]), methods);
            }
        }
    } else if (exclusions) {
        for (var pname in props) {
            if (exclusions.indexOf(pname) < 0) {
                obj = this.addNProperty(obj, pname, props[pname], methods, true);
            }
        }
    } else {
        for (var pname in props) {        
            obj = this.addNProperty(obj, pname, props[pname], methods, true);
        }
    }
    return obj;
};



/**
 * 
 * @param {Klass} Cls
 * @param {type} methods
 * @param {array} exclusions
 * @returns {undefined}
 */
Klass.copyInstanceMethods = function(Cls, methods, exclusions) {
    var p = Cls.prototype;
    if (exclusions) {
        for (var name in methods) {
            if (exclusions.indexOf(name) < 0) {
                p[name] = methods[name];
            }
        }
    } else {
        for (var name in methods) {        
            p[name] = methods[name];
        }
    }
    Cls.prototype = p;
    return Cls;
};

/**
 * 
 * @param {Klass} Cls
 * @param {type} methods
 * @param {array} exclusions
 * @returns {undefined}
 */
Klass.copyClassMethods = function(Cls, methods, exclusions) {
    if (exclusions) {
        for (var name in methods) {
            if (exclusions.indexOf(name) < 0) {
                Cls[name] = methods[name];
            }
        }
    } else {
        for (var name in methods) {        
            Cls[name] = methods[name];
        }
    }
    
    return Cls;
};
/**
 * 
 * @param {Object} obj
 * @param {Object} methods
 * @param {Array} exclus
 * @param {Function} Cls;
 * @returns {Object}
 */
Klass.copyMethods = function(obj, methods, exclus, Cls) {
    var exclusions;
    if (typeof arguments[2] === 'function') {
        exclusions = Cls;
        Cls = exclus;
        exclus = exclusions;
    } else {
        exclusions = exclus;
    }
    if (exclusions) {
        for (var name in methods) {
            if (exclusions.indexOf(name) < 0) {
                obj[name] = methods[name];
            }
        }
    } else {
        for (var name in methods) {        
            obj[name] = methods[name];
        }
    }
    
    return obj;
};

/**
 * /**
 * Returns the class object corresponding to the given class name
 * @param {String} className
 * @returns {Function}
 */
Klass.forname = function(className) {
    var cls = SereniX_forname(className);
    if (typeof cls !== 'function') {
        throw new Error("The corresponding object is not a class");
    }
    return cls;
};
/**
 * 
 * @param {type} obj
 * @returns {Boolean}
 */
Klass.isClass = function (obj) {
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass :  Klass;
    if (obj === K) {
        return true;
    }
    if (typeof obj === 'function') {
        //TODO
        return true;
    }
    return false;
};
/**
 * The list of uppercase keywords that is used to define metadata. 
 * <p><b>Do not use it as a property, field or method of a class or 
 * instance definition.</b>
 * @type Array&ltString&gt;
 */
Klass.EXTENSION_EXCLUSIONS = [
    "__CLASS__", "__CLASS_NAME__", "__PARENT__", "__PARENT_CLASS__", 
    "__SUPER__", "__SUPER_CLASS__", "__NAME__", "__PARENT_NAME__", 
    "__SINCE__", "__VERSION__", "__AUTHOR__", "__SEE__",
    "__COMMENT__", "__DESCRIPTION__", "__PURPOSE__",
    "SINCE", "VERSION", "AUTHOR", "SEE",
    "COMMENT", "DESCRIPTION", "PURPOSE",
    "__definedProperties___", "__definedAliases___"
];
/**
 * 
 * @type Array
 */
Klass.CLASS_PARAMETER_TYPE_SYMBOLS = [ '@'];
/**
 * 
 * @param {Function} Cls  The class that will inherit from the parent or super class
 * @param {Function} Parent   The parent or super class
 * @param {Array&lt;String&gt;}  parentClassExclusions
 * @param {Object} classAttribs
 * @returns {SereniX.Klass}
 */
Klass.extend = function(Cls, Parent, parentClassExclusions, classAttribs) {
    
    Cls.prototype = new Parent();
    
    var defProps = {}, ps = Cls.prototype.__definedProperties___;
    for (var n in ps) {
        defProps[n] = ps[n];
    }
    
    Cls.prototype.__definedProperties___ = defProps;
    
    var exclusions = this.EXTENSION_EXCLUSIONS||[];
    
    if (isArray(parentClassExclusions)) {
        var exc = [];
        for (var i = 0; i < exclusions.length; i++) {
            exc[i] = exclusions[i];
        }
        for (var i = 0; i < parentClassExclusions.length; i++) {
            exc[exc.length] = parentClassExclusions[i];
        }
        exclusions = exc;
    }
    var KU = (globalNS.SereniX && SereniX.KlassUtils ? 
                        SereniX.KlassUtils : KlassUtils);
              
    /**
     * 
     * If the getter and/or the setter are defined in the sub class/object, a 
     * new javascript property descriptor is returned.
     * Otherwise, the inherited javascript property descriptor is returned.
     * @param {type} defProps The defined properties of the parent class/object.
     * @param {type} name  The name of the property (inherited or not)
     * @param {type} methods  The methods list of the sub class/object
     * @returns {Object}  The javacript property descriptor used to define a property
     */
    function getDesc(defProps, name, methods) {
        var desc = defProps[name]; 
        if (!desc) {
            return desc;
        }
        if (methods) {
            var g = methods[desc.getterName], s = methods[desc.setterName];
            if (g || s) { // redefined getter or redefined setter in the 
                          // sub class/object
                desc = { 
                    get: g||desc.get, 
                    set: s||desc.set, 
                    configurable : desc.configurable, 
                    enumerable:  desc.enumerable,
                    getterName: desc.getterName,
                    setterName: desc.setterName
                };
                desc.getter = desc.get;
                desc.setter = desc.set;
            }
        }
        
        return desc;
    }
    /**
     * Extends the new class or object to inherit properties and methods of the super class or object.
     * @param {type} co    The new class or object
     * @param {type} sco  The super class or super object to extend
     * @param {type} methods The newly defined methods for the new class or object
     * @returns {unresolved}
     */
    function ext(co, sco, methods) {
        if (!sco) {
            return co;
        }
        var defProps = sco.__definedProperties___||{}, 
                defAliases = sco.__definedAliases___||{}, 
                defined = [],
                src,
                desc,
                _desc;
        co.__definedAliases___ = defAliases;
        for (var name in sco) {
            if (exclusions.indexOf(name) < 0) {
                if (name === 'collaborators') {
                    name.toString();
                }
                if (name === 'choices' || name === 'collaborators') {
                    name.toString();
                }
                if (name === 'constructor') {
                    //TODO
                } else if (typeof defProps[name] === 'undefined' ) { // a field (not a class property) or a method
                    try {
                        co[name] = sco[name];
                    } catch (e) {}
                } else if (defined.indexOf(name) < 0) { // if the property not already defined
                    src = defAliases[name];
                    if (src) { // if the property name corresponds to an alias of a source property  (src)                     
                        if (defined.indexOf(src) < 0) { // if the source property not yet defined
                            desc = getDesc(defProps, src, methods);
                            if (desc) {
                                KU.defineProperty(co, src, desc);
                                defined[defined.length] = src;
                            }
                        } else {
                            desc = co.__definedProperties___[src];
                        }
                        
                    } else {
                        desc = getDesc(defProps, name, methods);
                    }
                    if (desc) {
                        KU.defineProperty(co, name, desc); //define the alias property if the namecorresponds to an alias or define the property
                        defined[defined.length] = name;
                    }
                }
            }
        }
        return co;
    }
    
    Cls = ext(Cls, Parent, parentClassExclusions, 
            classAttribs.statics  ? classAttribs.statics.methods : false);
    
    Cls.prototype = ext( Cls.prototype, Parent.prototype, 
            classAttribs.instance  ? classAttribs.instance.methods : false);
    
    
    Cls.__PARENT__ = Parent;
    Cls.__PARENT_CLASS__ = Parent;
    Cls.__SUPER__ = Parent;
    Cls.__SUPER_CLASS__ = Parent;
    
    Cls.prototype.__SUPER_CLASS__ = Cls.prototype.__SUPER__ = Parent;
    
    
 
    if (Parent.__CLASS_NAME__) {
        Cls.__SUPER_CLASS_NAME__ = Parent.__CLASS_NAME__;
    } else if (Parent.__NAME__) {
        Cls.__SUPER_CLASS_NAME__ = Parent.__NAME__;
    } else if (typeof Parent.__CLASS__ === 'function') {
        var pc = Parent.__CLASS__;
        if (pc.__CLASS_NAME__) {
            Cls.__SUPER_CLASS_NAME__ = pc.__CLASS_NAME__;
        } else if (pc.__NAME__) {
            Cls.__SUPER_CLASS_NAME__ = pc.__NAME__;
        }
    }
    return Cls;
};

Klass.getConstructor = function(md, className) {
    if (md.name === 'Enum' || className === 'Enum') {
        console.log("Enum");
    }
    var c;
    if (isPlainObject(md.construct||md.__construct__||md._construct_||md.__constructor__||md._constructor||md._constructor_)) {
        c = md.construct||md.__construct__||md._construct_||md.__constructor__||md._constructor||md._constructor_;
        if (!md.construct) {
            md.construct = c;
        }
        if (typeof c.construct === 'function') {
            c.name = "construct";
        } else if (typeof c.__constructor__ === 'function') {
            c.name = "__constructor__";
        } else if (typeof c.__construct__ === 'function') {
            c.name = "__construct__";
        }
    } else {
        c = { className : false};
        if (typeof md.construct === 'function') {
            c.construct = md.construct;
            c.name = "construct";
        } else if (typeof md.__construct === 'function') {
            c.construct = md.__construct;
            c.name = "__construct";
        } else if (typeof md._constructor === 'function') {
            c.construct = md._constructor;
            c.name = "_constructor";
        } else if (typeof md.__constructor__ === 'function') {
            c.construct = md.__constructor__;
            c.name = "__constructor__";
        } else if (typeof md.__construct__ === 'function') {
            c.construct = md.__construct__;
            c.name = "__construct__";
        } else if (typeof md.__constructor === 'function') {
            c.name = "__constructor";
            c.construct = md.__constructor;
            c.name = "__constructor";
        } else if (typeof md[className] === 'function') {
            c.construct = md[className];
            c.name = className;
            c.className = true;
        } else {
            var cname = "__" + className + "__";
            if (typeof md[cname] === 'function') {
                c.name = cname;
                c.construct = md[cname];
                c.className = true;

            } else {
                return null;
            }
        }
    }
    return c;
};

Klass.metadataFromArray = function(arr) {
    var name = arr[0], ns = "", md, p, i = 0, a, type, step = 1,
            props, methods, sprops, smethods;
    for (var i = 0, n = arr.length; i < n; i++) {
        a = arr[i];
        switch (step) {
            case 1:
                name = a;
                p = name.lastIndexOf(".");
                if (p > 0) {
                    name = name.substring(0, p);
                    ns = name.substring(p + 1);
                    step += ns ? 2 : 1;
                } else if (p === 0) {
                    name = name.substring(1);
                    step++;
                }
                md = { name: name, namespace: ns };
                if ( i + 1 < n && isArray(arr[i + 1])) {
                    step  = 5;
                }
                break;
            case 2: //namepace
                type = typeof a;
                if (type === 'string') {

                } else if (type === 'object') {
                    md.namespace = a;
                    step++;
                } else if (type === 'function') {
                    if ( i + 1 < n && typeof arr[i + 1] === 'function') {
                        md.parentClass = a;
                        md.contruct = arr[i + 1];
                        step = 5;
                    }
                }
                if ( i + 1 < n && isArray(arr[i + 1])) {
                    step  = 5;
                }
                break;
            case 3: //super
                type = typeof a;
                if (type === 'string') {
                    md.parentClass = this.forname(a);
                    step++;
                } else if (type === 'function') {                          
                    if ( i + 1 < n && typeof arr[i + 1] === 'function') {
                        md.parentClass = a; 
                        md.contruct = arr[++i];                            
                    } else {
                        md.contruct = a;
                    }
                    step = 5;
                }
                if ( i + 1 < n && isArray(arr[i + 1])) {
                    step  = 5;
                }
                break;
            case 4: //construct
                if (typeof a !== 'function') {
                    throw new Error("The contructor's unction e<pected");
                }
                md.construct = a;
                break;
            case 5:
                if (i + 1 < n ) { //properties
                    props = a;
                    step++;
                } else {
                    var props = [], methods = {}, sprops = [], smethods = {};
                    this._setElts(a, props, methods, sprops, smethods);
                    step = 8;
                }                    
                break;
            case 6: //methods
                methods = a;
                step++;
                break;
            case 7:
                if ( i + 1 < n ) { //static properties
                    sprops = a;
                } else { 
                    if (isArray(a)) {

                    } else if (isPlainObject(a)) {

                    } else
                        incorrectArgs(); //throw "Incorrect arguments" exception;
                }
                step++;
                break;
            case 8: //static methods
                smethods = a;
                break;                    
        }
    }
    var _methods = false;
    for (var n in methods) {
        _methods = true;
        break;
    }

    var _smethods = false;
    for (var n in smethods) {
        _smethods = true;
        break;
    }
    if (props.length > 0 && _methods) {
        md.instance = { properties: props, methods: methods };
    } else if (props.length > 0) {
        md.properties = props;
    } else if (_methods) {
        md.methods = methods;
    }

    if (sprops.length > 0 && _smethods) {
        md.statics = { properties: sprops, methods: smethods };
    } else if (sprops.length > 0) {
        md.statics = { properties: sprops };
    } else if (_smethods) {
        md.statics = { methods: smethods };
    }
    return md;
};
/**
 * 
 * @param {Array|Object} elts
 * @param {Array} props
 * @param {Object} methods
 * @param {Array} sprops
 * @param {Object} smethods
 * @returns {undefined}
 * @private
 */
Klass._setElts = function(elts, props, methods, sprops, smethods) {
    var KU = globalNS.SereniX && SereniX.KlassUtils ? SereniX.KlassUtils : KlassUtils;
    function addMethod(e, name, methods) {
        var n, m;
        m = e.method||e.Method||e.Function||e["function"]||e[e.name];
        if (typeof m === 'function') {
            methods[name] = m;
            return true;
        }
        if (m) { //
            throw new Error("Incorrect argument");
        }
        return false;
    } 
    var md, _methods = false, _smethods = false;
    if (arguments.length === 2) {
        md = arguments[1];
        props = [], methods = {} , sprops = [], smethods = {};
    }
    if (isArray(elts)) {
        var e, t;            
        for (var k = 0, len = elts.length; k < len; k++) {
            e = elts[k];
            if (isArray(e) || (t = typeof e) === "string") {
                props[props.length] = e;
            } else if (isPlainObject(e)) {
                if (KU.isStatic(e)) {
                    if (!addMethod(e, e.name, smethods)) {
                        sprops[sprops.length] = e;
                    } else
                        _smethods = true;
                } else if (!addMethod(e, e.name, methods)) {
                    props[props.length] = e;
                } else
                    _methods = true;
            } else if (t === 'function') {
                if (!e.name) {
                    throw new Error("Unepected anonymous function");
                }
                methods[e.name] = e;
                _methods = true;
            } else
                throw new Error("Incorrect argument");
        }
    } else if (isPlainObject(elts)) {
        var v;
        for (var key in elts) {
            v = elts[key];
            if (typeof v === 'function') {
                methods[key] = v;
            } else if (isArray(v)) {
                props[props.length] = this._getProp(key, v);
            } else if (isPlainObject(v)) {
                if (KU.isStatic(v)) {
                    if (!addMethod(v, key, smethods)) {
                        sprops[sprops.length] = this._getProp(key, v);
                    } else
                        _smethods = true;
                } else if (!addMethod(v, key, methods)) {
                    props[props.length] = this._getProp(key, v);
                } else
                    _methods = true;
            }
        }
    } else
        incorrectArgs(); //throw "Incorrect arguments" exception;
    if (md) {        

        if (props.length > 0) {
            if (_methods) {
                md.instance = { properties : props, methods: methods };
            } else
                md.instance = { properties : props};
        } else if (_methods) {
            md.instance = { methods: methods };
        }
        
        
        if (sprops.length > 0) {
            if (_smethods) {
                md.statics = { properties : sprops, methods: smethods };
            } else
                md.statics = { properties : sprops};
        } else if (_smethods) {
            md.statics = { methods: smethods };
        }
    }
};
/**
 * 
 * @param {type} k
 * @param {type} v
 * @returns {Object}
 * @private
 */
Klass._getProp = function(k, v) {
    var p;
    if (isArray(v)) {
        p = [k];
        for (var i = 0, n = v.length; i < n; i++) {
            p[i + 1] = v[i];
        }
        return p;
    }
    if (isPlainObject(v)) {
        p = { name: k};
        for (var n in v) {
            p[n] = v[n];
        }            
        return p;
    }
    if ( [ 'string', 'function' ].indexOf(typeof v ) >= 0) {
        return { name: k, type: v };
    }
    incorrectArgs(); //throw "Incorrect arguments" exception;
};
/**
 * 
 * @param {type} args
 * <ul>
 * <li>The first element is a function</li>
 * <li>The first element is a string that represents the  class full name:
 *     <ul>
 *     <li>The second element is of type function:
 *          <ul>
 *            <li>The third element is of type booleanthe value true specify 
 *            that the second element represents the super class and the value 
 *            false specify that the the second element represents the 
 *            constructor of the class. </li>
 *            <li>Else:</li>
 *          </ul>
 *     </li>
 *     <li>The second element is of type string:
 *          <ul>
 *            <li>The third element is of type boolean: the value true specify 
 *            that the second element represents the super class and the value 
 *            false specify that the the second element represents the 
 *            constructor of the class. </li>
 *            <li>Else:</li>
 *          </ul>
 *     </li>
 *     </ul>
 * </li>
 * <li>The first element is a plain object</li>
 * <li>Other, an exception is thrown.</li>
 * </ul>
 * @returns {Object}
 */
Klass.metadataFromArgs = function(args) {
    function arrayToMeta(md, elts) {
        var e, props, methods, sprops, smethods, _static, count, f, fname;
        var K = globalNS.SereniX && SereniX.KlassUtils ? SereniX.KlassUtils : KlassUtils;
        for (var i = 0, n = elts.length; i < n; i++) {
            e = elts[i];
            if (typeof e === 'function') {
                if (!e.name) {
                    throw new Error("Unepected anonymous function");
                }
                if (!methods) {
                    methods = { };
                }
                methods[e.name] = e;
            } else if (typeof e === 'string') {
                if (!props) {
                    props = [];
                }
                props[props.length] = e;
            } else if (isPlainObject(e)) {
                if (typeof e.name === 'string') {
                    if (K.isStatic(e)) {
                        if (!sprops) {
                            sprops = [];
                        }
                        sprops[sprops.length] = e;
                    } else {
                        if (!props) {
                            props = [];
                        }
                        props[props.length] = e;
                    }
                }  else {
                    _static = false;
                    count = 0;
                    for (var name in e) {
                        if (name === 'static' || name === 'Static') {
                            _static = e[name];
                        } else {
                            f = e[name];
                            if (typeof f !== 'function' || count === 1) {
                                incorrectArgs(); //throw "Incorrect arguments" exception;
                            }
                            count = 1;
                            fname = name;
                        }
                    }
                    if (_static) {
                        smethods[fname] = f;
                    } else {
                        methods[fname] = f;
                    }
                }
            } else if (isArray(e)) {
                if (!props) {
                    props = [];
                }
                props[props.length] = K.getPropFromArray(e);
            }
        }
        var p = md.lastIndexOf(".");
        if (p === 0) {
            throw "Incorrect class name: '" + md + "'";
        }
        if (p > 0) {
            md = {namespace: md.substring(0, p), name: md.substring(p + 1) };
        } else
            md = { name: md };
        if (props && methods) {
            md.instance = {properties: props, methods : methods };
        } else if (props) {
            md.properties = props;
        } else if (methods) {
            md.methods = methods;
        }

        if (sprops && smethods) {
            md.statics = {properties: sprops, methods : smethods };
        } else if (sprops) {
            md.statics = {properties: sprops };
        } else if (smethods) {
            md.statics = {methods : smethods };
        }
        return md;
    }
    
    var md = args[0], Cls = false, offset;
    var ext, preExists;
    if (typeof md === 'function') {
        var f = md;                
        md = args[1];
        if (typeof md === 'object' && md) {
            Cls = ext(f, md);
            preExists = true;
        } else if (typeof md === 'string' && md) {
            Cls = this.extFunc(f, md);
            md = {};
        } else if (typeof md === 'function') {
            md = { parentClass: md };
        } else {
            md = {};
        }
        if (!Cls) {
            Cls = this.extFunc(f);
        }
    } else if (typeof md === 'string') { 
        var p = md.lastIndexOf(".");
        
        var a = args[1];
        if (typeof a === 'function') {
            if (p > 0) {
                md = {namespace: md.substring(0, p), name: md.substring(p + 1)};
            } else {
                md = {name: md};
            }
            if (args[2] === true) {//the second argument is the super class
                md.super = a;
            } else {   //the second argument is the constructor of the class
                md.construct = a;
                if (md.name === a.name) {
                    Cls = a;
                    preExists = true;
                    md.preExists = true;
                }
            }
            offset = 3;
        } else if (isPlainObject(a)) {
            var _md = { name: md };
            for (var n in a) {
                if (n !== md) {
                    _md[n] = a[n];
                }
            }
            md = _md;
        } else if (isArray(a)) {
            md = arrayToMeta(md, a);
        } else if (typeof a === 'string') {
            if (args[2] === true) {//the second argument is the full name of super class
                md.super = Klass.forname(a);
            } else {   //the second argument is the full name of the constructor of the class
                md.construct = Klass.forname(a);
                preExists = true;
                md.preExists = true;
            }
            offset = 3;
        }
    } else if (isPlainObject(md)) {
        ext = args[1];
        if (typeof ext === 'boolean') {
            md.parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"];
        } else if (typeof ext === 'function') {
            md.parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"];
            if (md.parentClass) {

            } else {
                md.parentClass = ext;
            }
        } else if (typeof ext === 'string') {

        } else if (typeof ext === 'object') {

        }
    }
    else {
        throw "Incorrect class metadata arguments";
    }
    return [Cls, md, offset];
};
/**
 * 
 * @returns {Function}
 */
Klass.extFunc = function() {
    var Cls = arguments[0], p = Cls.prototype, 
        namespace = false,
        cname = false,
        a = arguments,
        len = arguments.length;
    var NS = globalNS.SereniX && SereniX.Namespace ? SereniX.Namespace : Namespace;
        
    if (typeof Cls !== 'function') {
        incorrectArgs(); //throw "Incorrect arguments" exception;
    }

    if (len > 2 && !(typeof a[3] === 'string' && a[3].length > 0)) {
        len = 2;
    }
    if (len > 2) {
        namespace = a[1];
        cname = a[2];
    } else if (len === 2) {
        a = a[1];
        if (a instanceof NS) {
            namespace = a;
        } else if (isPlainObject(a) && a) {
            namespace = a.namespace||a.Namespace||a.package||a.Package||false;
            cname = a.name||a.Name||a.className||a.ClassName||a["class"]||a.Class||false;
            if (!namespace && cname) {
                var i = cname.lastIndexOf('.');
                if (i > 0) {
                    namespace = cname.substring(0, i);
                    cname = cname.substring(i + 1);
                }
            }
        } else if (typeof a === 'string' && a.length > 0) {
            if (!Cls.name) {
                var i = a.lastIndexOf('.');
                if (i > 0) {
                    namespace = a.substring(0, i);
                    cname = a.substring(i + 1);
                }
            } else {
                namespace = a;
            }
        }
    }
    Cls.prototype = new SereniX.Klass();            
    Cls.__CLASS__ = Cls;
    if (cname) {
        Cls.__CLASS_NAME__ = cname;
    } else if (Cls.name) {
       Cls.__CLASS_NAME__ = Cls.name; 
    }
    if (typeof Object.hasOwnProperty === 'function') {
        for (var name in p) {
            if (Object.hasOwnProperty(name)) {
                Cls.prototype[name] = p[name];
            }
        }
    } else {
        for (var name in p) {
            Cls.prototype[name] = p[name];
        }
    }
    if (namespace instanceof NS) {
        namespace.addElement(Cls);
    } else if (namespace) {
        NS.ns(namespace).addElement(Cls);
    }
    return Cls;
};



/**
 * Creates or extends a class from the given arguments.
 * <p><b color="blue">"__CLASS__"</b>, <b color="blue">"__CLASS_NAME__"</b> and 
 * <b color="blue">"__NAME__"</b> are reserved keywords and are used to store 
 * the class and class name in the class and in the prototype of the class.</p>
 * <p><b color="blue">"__NAMESPACE__"</b> and 
 * <b color="blue">"__NAMESPACE_NAME__"</b> are alo reserved keywords and are
 * used to store the namespace and namespace name in the class and in the 
 * prototype of the class.</p>
 * <h3>Parameters</h3>
 * <p>Many possibilities offered when creating a class:</p>
 * <ul>
 * <li>The first argument is a function</li>
 * <li>The first argument is a string that represents the  class full name:
 *     <ul>
 *     <li>The second argument is of type function:
 *          <ul>
 *            <li>The third argument is of type booleanthe value true specify 
 *            that the second argument represents the super class and the value 
 *            false specify that the the second argument represents the 
 *            constructor of the class. </li>
 *            <li>Else:</li>
 *          </ul>
 *     </li>
 *     <li>The second argument is of type string:
 *          <ul>
 *            <li>The third argument is of type boolean: the value true specify 
 *            that the second argument represents the super class and the value 
 *            false specify that the the second argument represents the 
 *            constructor of the class. </li>
 *            <li>Else:</li>
 *          </ul>
 *     </li>
 *     </ul>
 * </li>
 * <li>The first argument is a plain object</li>
 * <li>Other, an exception is thrown.</li>
 * </ul>
 * 
 * <h3>Main invocations</h3>
 * <p>The main invocations/calls are:</p>
 * <ul>
 * <li>createClass(Object md) :  The medata contains all the properties to create
 * the class.
 *  <ul>
 *     <li>To specify the class name, use 'name' field. The class can include the 
 *     namespace of the class using '.' character to separate namespaces and class 
 *     name. The last token represents the simple/basic class name (name without the
 *     namespace).The full class name accept the same syntax as java full class 
 *     name.</li>
 *     <li>To specify separately the namespace, use 'namespace' field.</li>
 *     <li>For class extension, use of one the following field in bold style to 
 *     specify the parent class:
 *         <ul>
 *         <li><b color="navy">extends</b>: </li>
 *         <li><b color="blue">parentClass</b></li>
 *         <li><b color="blue">parent</b></li>
 *         <li><b color="blue">super</b></li>
 *         <li><b color="blue">superClass</b></li>
 *         </ul>
 *     </li>
 *     <li>To specify a constructor use 'construct' field.</li>
 *     <li>For class members, there are many possibilities:
 *          <ul>
 *              <li>use 'properties' and 'methods' fields to separate methods 
 *              from properties. Each field can be can be an array or a plain 
 *              object. </li>
 *              <li>use the field 'members' to specify class members (fields/properties and methods): the 'members' field can be an array or a plain object.</li>
 *          </ul>
 *     </li>
 *  </ul>
 * </li>
 * <li>createClass(Object md, String superClass)</li>
 * <li>createClass(Object md, Function superClass)</li>
 * <li>createClass(Object md, boolean ext)</li>
 * <li>createClass(String name, Object md)</li>
 * <li>createClass(String name, Object md, String superClass)</li>
 * <li>createClass(String name, Object md, Function superClass)</li>
 * <li>createClass(String name, Object md, boolean ext)</li>
 * </ul>
 * 
 * <h3>Notes</h3>
 * <p>It's possible to define instance fields at the first level of the class 
 * metadata/definition. In this case, the following names can not be used as 
 * field name: <b color="blue">"instance"</b>, <b color="blue">"prototype"</b>, 
 * <b color="blue">"proto"</b>, <b color="blue">"object"</b>, 
 * <b color="blue">"Instance"</b>, <b color="blue">"Prototype"</b>, 
 * <b color="blue">"Proto"</b>, <b color="blue">"Object"</b>, 
 * <b color="blue">"properties"</b>, <b color="blue">"Properties"</b>, 
 * <b color="blue">"props"</b>, <b color="blue">"Props"</b>, 
 * <b color="blue">"methods"</b>, <b color="blue">"Methods"</b>, 
 * <b color="blue">"functions"</b>, <b color="blue">"Functions"</b>, 
 * <b color="blue">"statics"</b>, <b color="blue">"static"</b>, 
 * <b color="blue">"Statics"</b>, <b color="blue">"Static"</b>, 
 * <b color="blue">"class"</b>, <b color="blue">"klass"</b>, 
 * <b color="blue">"Class"</b>, <b color="blue">"Klass"</b>, 
 * <b color="blue">"name"</b>, <b color="blue">"namespace"</b>, 
 * <b color="blue">"Name"</b>, <b color="blue">"Namespace"</b>, 
 * <b color="blue">"className"</b>, <b color="blue">"classname"</b>, 
 * <b color="blue">"construct"</b>, <b color="blue">"__construct"</b>, 
 * <b color="blue">"Construct"</b>, <b color="blue">"Constructor"</b>, 
 * <b color="blue">"constructor"</b>, <b color="blue">"destruct"</b>, 
 * <b color="blue">"__destruct"</b>, <b color="blue">"Destruct"</b>, 
 * <b color="blue">"Destructor"</b>, <b color="blue">"destructor"</b>, 
 * <b color="blue">"fields"</b>, <b color="blue">"Fields"</b>.
 * </p>
 * 
 * A property of a class can be setted as a string that is parsed to get final 
 * property object.
 * default value can be string  expression that needs to be well parsed and 
 * well evaluated when creating an instance of a class.
 * <p><b>For that, the class creation javascript librairies requires 
 * serenix_parser_statements.js and serenix_statement_parser.js and 
 * need the following classes :</b></p>
 * 
 * <ul>
 * <li>AliasDName</li>
 * <li>AParam</li>
 * <li>Accessor</li>
 * <li>Aggregation</li>
 * <li>All</li>
 * <li>AnonymousFunction</li>
 * <li>AQString</li>
 * <li>ArrayDimension</li>
 * <li>ArrayType</li>
 * <li>ArrowFunction</li>
 * <li>As</li>
 * <li>AsEntry</li>
 * <li>AsList</li>
 * <li>Assign</li>
 * <li>AutoIncrement</li>
 * <li>BaseIndex</li>
 * <li>Block</li>
 * <li>Call</li>
 * <li>Catch</li>
 * <li>ChainedExpressions</li>
 * <li>ChainedStatements</li>
 * <li>Class</li>
 * <li>ClassBody</li>
 * <li>Command</li>
 * <li>Comment</li>
 * <li>Comments</li>
 * <li>Conditional</li>
 * <li>Constructor</li>
 * <li>Continue</li>
 * <li>DataTypeToken</li>
 * <li>DOptions</li>
 * <li>Declaration</li>
 * <li>DefaultCase</li>
 * <li>DefaultEName</li>
 * <li>DefaultStatement</li>
 * <li>DOEntry</li>
 * <li>DoWhile</li>
 * <li>EList</li>
 * <li>EName</li>
 * <li>EmptyStatement</li>
 * <li>EQString</li>
 * <li>Expression</li>
 * <li>Field</li>
 * <li>FControl</li>
 * <li>ForStatement</li>
 * <li>ForControl</li>
 * <li>For</li>
 * <li>ForInControl</li>
 * <li>ForIn</li>
 * <li>ForOfControl</li>
 * <li>ForOf</li>
 * <li>FType</li>
 * <li>Func</li>
 * <li>Getter</li>
 * <li>Setter</li>
 * <li>Grouping</li>
 * <li>IComment</li>
 * <li>If</li>
 * <li>IfCase</li>
 * <li>Interface</li>
 * <li>InterfaceBody</li>
 * <li>Import</li>
 * <li>ImportElements</li>
 * <li>ImportSelection</li>
 * <li>ImportExportElt</li>
 * <li>Index</li>
 * <li>Instantiation</li>
 * <li>Invocation</li>
 * <li>LROperation</li>
 * <li>LStatement</li>
 * <li>Label</li>
 * <li>Litteral</li>
 * <li>Loop</li>
 * <li>MAssign</li>
 * <li>Method</li>
 * <li>EModule</li>
 * <li>NVariable</li>
 * <li>NamedFunction</li>
 * <li>NamedType</li>
 * <li>NTypeField</li>
 * <li>NoBodyStatement</li>
 * <li>NoCondition</li>
 * <li>Null</li>
 * <li>NullCoalescing</li>
 * <li>Numeric</li>
 * <li>OCIndex</li>
 * <li>OCRef</li>
 * <li>ODAssign</li>
 * <li>Param</li>
 * <li>Params</li>
 * <li>AQString</li>
 * <li>QString</li>       
 * <li>QSPattern</li>
 * <li>QuotedHintStatement</li>
 * <li>RefChain</li>
 * <li>Reference</li>
 * <li>RestEName</li>
 * <li>RestParam</li>
 * <li>Return</li>
 * <li>SBlock</li>
 * <li>SDeclaration</li>
 * <li>SIterator</li>
 * <li>Setter</li>
 * <li>Signature</li>
 * <li>SingleAssign</li>
 * <li>SkipableElt</li>
 * <li>SpreadEName</li>
 * <li>Statement</li>
 * <li>StatementElt</li>
 * <li>SType</li>
 * <li>Switch</li>
 * <li>TailEName</li>
 * <li>Throw</li>
 * <li>Try</li>
 * <li>UnaryOperation</li>
 * <li>Undefined</li>
 * <li>UnionType</li>
 * <li>VArray</li>
 * <li>VEName</li>
 * <li>VObject</li>
 * <li>VRegExp</li>
 * <li>Value</li>
 * <li>Variable</li>
 * <li>While</li>
 * <li>With</li>
 * <li>DataTypeToken</li>
 * <li>ParamTypes</li>
 * <li>FType</li>
 * <li>SType</li>
 * <li>Structure</li>
 * <li>NamedType</li>
 * <li>UnionType</li>
 * <li>Interface</li>
 * <li>InterfaceBody</li>
 * <li>Signature</li>
 * </ul>
 * @returns {Function}  Class that inherits SereniX.Klass class at the basic 
 * level : the objects of the created class are instance of SereniX.Klass.
 */
Klass.createClass = function() {    
    
    if (arguments.length === 0) { 
        throw new Error("The metadata argument is mandatory"); 
    }
    var Cls, construct;
    //Sets the base 'Klass' class function to guarantee that createClass method
    //still execute well it's exported as a function and the function is called.
    //SereniX.Klass is the preferred way and guarantee good result when 
    //createClass is called outside this file wheter class is overriden or not 
    //by an other library.
    //for cases where createClass is called below before the main class 'Klass'
    //is binded/added to SereniX namespace Klass is used.
    var K = globalNS.SereniX && SereniX.Klass ? SereniX.Klass : Klass;
    
          
    function ext(f, md) {
        var Cls = f, namespace;
        if (!Cls.__CLASS_NAME__) {
            Cls.__CLASS_NAME__  = md.name||md.className||md.Classname||f.name||"";
        }
        Cls.__CLASS__ = Cls;
        var parentClass = md.parentClass||md.ParentClass
                ||md.superClass||md.SuperClass
                ||md.Super||md["super"];
        var proto = false;
        var ns = md.namespace||md.Namespace||md.ns;
        if (parentClass) {
            proto = Cls.prototype;                        
            if (!(proto instanceof parentClass)) {
                Cls.prototype = new parentClass();

                var exclusions = [ '__proto__', '_proto_', '__CLASS_NAME__', '__CLASS__'];
                for (var fname in proto) {
                    if (proto.hasOwnProperty(fname)) {
                        Object.defineProperty(Cls.prototype, 
                            Object.getOwnPropertyDescriptor(proto, fname)
                        );
                    } else if (exclusions.indexOf(fname) < 0) {
                        Cls.prototype[fname] = proto[fname];
                    }
                }
            }
            Cls.prototype.__CLASS_NAME__ = Cls.__CLASS_NAME__;
            Cls.prototype.__CLASS__ = Cls.__CLASS__;
        }
        if (ns instanceof Namespace) {
            if (ns !== Cls.namespace) {
                if (Cls.namespace instanceof Namespace ) {
                    Cls.namespace.removeChild(Cls);
                }
                Cls.namespace = ns;
                Cls.__NAMESPACE__ = ns;
                Cls.__NAMESPACE_NAME__ = ns.name||"";
                ns.addChild(Cls);  
            }
        } else if (['function', 'object'].indexOf(typeof ns) >= 0) {
            Cls.namespace = ns;
            Cls.__NAMESPACE__ = ns;
            Cls.__NAMESPACE_NAME__ = ns.name||"";
        } else if ('string' === typeof ns) {
            Cls.__NAMESPACE_NAME__ = ns;
        }
        return Cls;
    }
    
    function finalizeMeta(args, ofs, md) {
        if (args.length === ofs + 1) {
            K._setElts(args[ofs], md);
        } else if (args.length >= ofs + 4) {
            var p =  ofs + 1;
            if (isArray(args[p]) || isPlainObject(args[p])) {
                md.instance = { properties : args[ofs], methods:args[p] };
            } else if (!args[p]) {
                md.instance = { properties : args[ofs] };
            }
            p++;
            var p2 = p + 1;
            if (isArray(args[p])) {
                if (isArray(args[p2]) || isPlainObject(args[p2])) {
                    md.statics = { properties : args[p], methods:args[p2] };
                } else {
                    md.statics = { properties: args[p] };
                }
            } else if (!args[p] && isArray(args[p2])) {
                md.statics = { methods : args[p2] };
            }
        }
        return md; 
    }
    function _finalizeAttribs(md, arr, o) {
        var props, sprops, methods, smethods, e,
            KU = globalNS.SereniX && SereniX.KlassUtils ? SereniX.KlassUtils :  KlassUtils;
        
        for (var i = 0, n = arr.length; i < n; i++) {
            e = arr[i];
            if (typeof e === 'string' && e) {
                if (!props) props = [];
                props[props.length] = e;
            } else if (isPlainObject(e)) {
                if (KU.isStatic(e)) {
                    if (!sprops) sprops = [];
                    sprops[sprops.length] = e;                    
                } else {
                    if (!props) props = [];
                    props[props.length] = e;
                }
            } else {
                throw new Error("Incorrect properties array list");
            }            
        }
        if (isArray(methods)) {
            var m;
            for (var i = 0, n = arr.length; i < n; i++) {
                e = arr[i];
                if (typeof e === 'string' && e) {
                    if (!methods) methods = [];
                    methods[methods.length] = e;
                } else if (isPlainObject(e) && typeof (m = e.method||e.Method||e.func||a.Func||e["function"]||e.Function) === 'function') {
                    if (KU.isStatic(e)) {
                        if (!smethods) smethods = [];
                        smethods[smethods.length] = m;
                    } else {                        
                        if (!methods) methods = [];
                        methods[methods.length] = m;
                    }
                } else {
                    throw new Error("Incorrect properties array list");
                }            
            }
        }
        
        if (props && methods) {
            md.instance = { properties : props, methods: methods };
        } else if (props) {
            md.properties = props;
        } else if (methods) {
            md.methods = methods;
        }
        if (sprops && smethods) {
            md.statics = { properties : sprops, methods: smethods };
        } else if (sprops) {
            md.statics = { properties : sprops };
        } else if (smethods) {
            md.statics = {methods: smethods };
        }
        return md;
    }
    function _initXClass(args, numargs) {
        var md = args[1],
            a;
        if (typeof md === 'function') {
            if (numargs === 3 && isArray(args[2])) {
                md = finalizeMeta(args, 2, {parentClass : args[0], construct: args[1]});
            } else if (numargs > 5) {
                md = {parentClass : args[0], construct: args[1]};
                //TODO
            } else if (numargs > 2) {
                a = args[2];
                if (isPlainObject(a)) {
                    md = a;
                    md.parentClass = args[0];
                    md.construct = args[1];
                } else if (isArray(a)) {
                    var m = args[3];
                    if (isPlainObject(m) || isArray(m)) {
                        md = _finalizeAttribs({Class : args[0], parentClass: args[1]}, a, m);
                    }
                }
            }
        } else if (isArray(md)) {

        } else if (isPlainObject(md)) {
            md.parentClass = args[0];
            md.name = md["className"]||md["ClassName"]||md["Classname"]||md["name"];
        }
        return md;
    }
    
    function _initNClass(args, numargs, K) {
        var md, name = args[0];
        var p = name.lastIndexOf(".");
        if (p === 0) {
            incorrectArgs(); //throw "Incorrect arguments" exception;
        }
        if (p > 0) {
            var _ns = name.substring(0, p);
            name = name.substring(p+ 1);
            md = { name: name, namespace: _ns }; 
        } else
            md = { name: name };
        if (numargs > 1 && isArray(args[1])) {
            md = finalizeMeta(args, 1, md, K); 
        } else if (numargs > 1) {
            if ((typeof args[1] === 'string')) {
                if (p > 0) {
                    var parentClass;
                    try {
                        parentClass = K.forname(args[1]);
                    } catch (ex) {}
                    if (parentClass) {
                        md.parentClass = parentClass;
                    } else {
                        incorrectArgs(); //throw "Incorrect arguments" exception;
                    }
                } else {
                    var parentClass;
                    try {
                        parentClass = K.forname(args[1]);
                    } catch (ex) {}
                    if (parentClass) {
                        md.parentClass = parentClass;
                    } else {
                        md.namespace = args[1];
                    }
                } 
                finalizeMeta(args, 2, md, K);
                //TODO
            } else if ((typeof args[1] === 'function')) {
                var c = args[1];
                if (c.__CLASS__ || c.__CLASS_NAME__) {
                    md.parentClass = c;
                } else {
                    md.construct = c;
                }
                finalizeMeta(args, 2, md, K);
            }
        }
        return md;
    }

    function init(args) {
        var constructName = null;
    
        var Cls = false, parentClass = null, md, name,preExists = false;

        if (args.length === 1) {            
            md = args[0];
            if (isArray(md)) {
                if (md.length === 2) {
                    var r = K.metadataFromArgs(args);
                    Cls = r[0];
                    md = r[1];
                    name = md.name;
                } else {
                    md = K.metadataFromArray(md);
                }
            } else if (typeof md === 'object') {
                if (typeof md === 'function') {
                   return K.extFunc(md);
                }
                
                parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"]||md["extends"];
                if (parentClass)
                    md.parentClass = parentClass;
                
            } else if (typeof md === 'string') {
                md = { name: md };
            } else {
                throw new Error("Incorrect argumment");
            }
            name = md.name;
        } else if (args.length === 2) {
            var r = K.metadataFromArgs(args);
            Cls = r[0];
            md = r[1];
            name = md.name;   
            if (typeof md.preExists === 'boolean') {
                preExists =  md.preExists;
                delete md.preExists;
            }
        } else if (args.length > 2) {
            if (K.isClass(args[0])) { //The first arguname  represent a class             
                md = _initXClass(args, args.length, K);
            } else if (typeof args[0] === 'string' && args[0] !== '') {
                if (typeof args[2] === 'boolean') {
                    md = K.metadataFromArgs(args);
                } else {
                    md = _initNClass(args, args.length, K);
                }
            }
        }

        if (name === 'Locale') {
            console.log("============================================");
            console.log("SereniX.Locale debug");
            console.log("============================================");
        }
        if (!name) {
            if (!md) {
                incorrectArgs(); //throw "Incorrect arguments" exception;
            }
            name = md["className"]||md["ClassName"]||md["Classname"]||md["name"];
            if (!name) {
                incorrectArgs(); //throw "Incorrect arguments" exception;
            }
        }
        
        var pos;
        if ((pos = name.lastIndexOf(".")) >= 0) {
            var ns = md.namespace||md.Namespace||"";
            md.namespace = (ns ? ns + "." : "") + name.substring(0, pos);
            if (md.Namespace) {
                md.Namespace = md.namespace;
            }
            name = md.name = name.substring(pos + 1);
        }
        
        if (typeof md.parentClass === 'string' && md.parentClass !== '') {
            var pc = pc = K.forname(md.parentClass);
            if (!pc) {
                throw "Super/parent class " + md.parentClass + " does not exists";
            }
            md.parentClass = pc;            
        }

        
        var destruct = md.destruct||md.__destruct||md._destructor
                ||md.__destructor__||md.__destruct__||md.__destructor;
        
        
        if (!Cls) {
            if (md.name === 'Enum') {
                console.log("Enum");
            }
            construct = K.getConstructor(md);
            if (construct) {
                constructName = construct.name;
                construct = construct.construct;
            }
        }
        if (!md.construct && construct) {
            md.construct = construct;
            if (constructName) {
                md.constructName = constructName;
            }
        }
        destruct && (md.destruct = destruct);
        
        md.name = name;
        return [ Cls, md, preExists];
    }  //end init
    
    function setSuper(Cls) {
        Cls.getSuper = Cls.getSuperClass = 
                Cls.getSuperKlass = 
                Cls.getParent = Cls.getParentClass = 
                Cls.getParentKlass = function() {
            return this.__SUPER__;
        };
        var setter = function(v) {
            throw "Read-only property";
        };
        Cls = K.defProperty(Cls, 'Super', Cls.getSuper, setter);
        Cls = K.defProperty(Cls, 'SuperClass', Cls.getSuperClass, setter);
        Cls = K.defProperty(Cls, 'SuperKlass', Cls.getSuperKlass, setter);
        Cls = K.defProperty(Cls, 'Parent', Cls.getParent, setter);
        Cls = K.defProperty(Cls, 'ParentClass', Cls.getParentClass, setter);
        Cls = K.defProperty(Cls, 'ParentKlass', Cls.getParentKlass, setter);
    } //end setSuper
    
    
    /***************   processing section  **********/
    
    var res= init(Array.prototype.slice.call(arguments));
    
    if (typeof res === 'function') {
        return res;
    }
    
    Cls = res[0]; //the created or updated class
    var md = res[1]; //the metadata

    Cls = K.buildClass(Cls, md, res.length > 2 ? res[2] : false /* preExists */);
    
    setSuper(Cls);
    
    function ext(props, O) {        
        if (isPlainObj(props)) {
            Object.keys(props).forEach(function(name){
                if (["__CLASS__", "__CLASS_NAME__", "__CONSTRUCTOR__", "__NAMESPACE__", "__NAMESPACE_NAME__"].indexOf(name) < 0) {
                    O[name] = props[name];
                }
            });            
        } else if (isArray(props)) {
            var n = props.length;
            if (isPlainObj(props[0])) {
                var p;
                for (var i = 0; i < n; i++) {
                    p = props[i];
                    if (typeof (name = prop.name) !== 'string' || !name) {
                        throw new Error("Incorrect properties definition");
                    }
                    O[name] = props.value;
                }
            } else if (typeof props[0] === 'string') {
                var r, name;
                n = (n- (r=n%2))/2;
                for (var i = 0; i < n; i++) {
                    name = props[2*i];
                    if (typeof name !== 'string' || !name) {
                        throw new Error("Incorrect properties definition");
                    }
                    O[name] = props[2*i + 1];
                }
            }
        }
    };
    Cls.staticExt = function(props) {
        ext(props, this);
    };
    Cls.ext = function(props) {
        ext(props, this.prototype);
    };
    return Cls;
};

/**
 * Creates or extends a class from the given arguments.
 * <p>The main invocations/calls of the method are:</p>
 * <ul>
 * <li>Class(Object md) :  The medata contains all the property to create the class</li>
 * <li>Class(Object md, String superClass)</li>
 * <li>Class(Object md, Function superClass)</li>
 * <li>Class(Object md, boolean ext)</li>
 * <li>Class(String name, Object md)</li>
 * <li>Class(String name, Object md, String superClass)</li>
 * <li>Class(String name, Object md, Function superClass)</li>
 * <li>Class(String name, Object md, boolean ext)</li>
 * </ul>
 * <p><p><b color="green">SereniX.Klass.Class</b><b> is an alias of SereniX.Klass.Class</b>.</p>
 * @returns {SereniX.Klass}
 */
Klass.Class = Klass.createClass;


//========================================================================
//------------------------  Class utils : KlassUtils  --------------------
//========================================================================

/**
 * 
 * @class
 * @returns {SereniX.Klass}
 */
var KlassUtils = extObj(
        defineClass(
            "SereniX.KlassUtils",
            function KlassUtils() {},
            SereniX.types.TypeUtils
        ), 
        {
        normalizeProp:function(prop) {
            if (typeof prop === 'string') {
                if (prop === 'projects<Object{0,}>'
                    || prop === 'category=6'
                   ) {
                    console.log(prop);
                }
                prop = this.getPropFromString(prop);
            } else if (typeof prop === 'undefined' || prop === null) {
                throw new Error("Undefined or null property");
            }
            return prop;
        },
        /**
         * 
         * @param {type} pTypesCheck
         * @returns {SereniX.KlassUtils}
         */
        setParamTypesCheck: function (pTypesCheck)  {
            this._paramTypesCheck = pTypesCheck;
            return this;
        },
        /**
         * 
         * @returns {Function}
         */
        getParamTypesCheck: function () {    
            return this._paramTypesCheck||this.checkParamTypes;
        },
        /**
         * 
         * @param {Object|String} o
         * @returns {Function}
         */
        getExpressionFunc: function(o) {
            if (o instanceof String) {
                o = o.valueOf();
            }
            if (typeof o === 'string') {
                o = o.trim();
            }
            if (!o) {
                return null;
            }
            var e;
            if (typeof o === 'string') {
                e = this.processExpression(o, 0, o.length);
            } else {
                var E = SereniX.Expression||globalNS.Expression; 
                if (typeof E === 'function') {
                    e = E.getInstance(o);
                } else {
                    throw new Error("Incorrect check object");
                }
            }
            return this.getExprEvaluator(e);
        },
        /**
         * 
         * @param {type} re
         * @returns {Function}
         */
        getRegexFunc: function(re) {
            function __check(str) {
                if (str instanceof String) {
                    str = str.valueOf();
                }
                if (typeof str !== 'string') {
                    throw new Error("Incorrect argument");
                }
                if (__check.re.exec(str)) {
                    return true;
                }
                throw new Error("String does not match regular expression");
            }
            __check.re = re;
            return __check;
        },
        /**
         * 
         * @param {String} prop
         */
        getDependencyDataTypeCheck: function (prop) {
            var str = "";
            var dataType = prop.dataType||prop.type||"";
            if (dataType === 'string') {
                str += "if (" + prop.name + " instanceof String) {"
                + "\n    " + prop.name + " = " + prop.name + ".valueOf();"
                + "\n}"
                + "\nif (typeof " + prop.name + " !== 'string') {"
                + "\n    throw new ValueError(\"Expected argument of string type\");"
                + "\n}";
            }
            //TODO: other cases
            return str;
        },
        /**
         * 
         * @param {type} check
         * @param {Object} prop
         * @returns {Function}
         */
        getDependencyCheck : function(check, prop) {
            if (check.type === 'linked-values') {
                function _checkDependency(val) {
                    return _checkDependency.values.is(val, this);
                };
                _checkDependency.values = new SereniX.types.LinkedValues(check);
                return { process: _checkDependency, returnValue : true }
            }
            function getGetter(dependency) {
                var key = dependency.substring(0, 1).toUpperCase() + dependency.substring(1);
                return 'typeof this.is' + key + " === 'function' ? " + 'this.is' + key + "() : get" + key+ '()'; 
            }
            
            function  stringValue(val, m) {
                if (typeof val === 'string') {
                    return '"' + val.replace(/"/g, '\\"') + '"';
                }
                //TODO
                return "" + val;
            }
            
            function normalizeType(type) {
                switch(type.toLowerCase()) {
                    case 'enum':
                    case 'enumeration':
                    case 'values':
                    case 'contains':
                    case 'in':
                        return 'enum';
                    case 'interval':
                    case 'range':
                    case 'between':
                        return 'interval';
                    case 'ranges':
                        return 'ranges';
                    case 'value':
                    case 'equals':
                        return 'equals';
                    case 'different':
                        return 'different';
                    case 'linked-values':
                        return 'linked-values';
                    default:
                        return '';
                }
            }
            
            function intervalCondition(interval, propName, negate) {
                var min, max;
                var infinity = typeof Infinity === 'undefined' ? undefined : Infinity;
                if (isArray(interval)) {
                    if (interval.length === 1) {
                        min=interval[0];
                        if (min === undefined || min === null) {
                            throw new Error("Incorrect interval");
                        } else {
                            return propName + (negate ? "<" : ">=") + stringValue(min);
                        }
                    } else if (interval.length > 1) {
                        min=interval[0];
                        max=interval[1];
                        if (min === undefined || min === null) {
                            if (max === undefined || min === null || max === infinity) {
                                throw new Error("Incorrect interval");
                            }
                            return negate ?  propName +  ">" + stringValue(max) : propName +  "<=" + stringValue(max) ;
                        } else if (max === undefined || min === null || max === infinity) {
                            return propName + (negate ? "<" : ">=") + stringValue(min);
                        } else {
                            return negate ?  propName +  "<" + stringValue(min) + " || " + propName +  ">" + stringValue(max) : propName +  ">=" + stringValue(min) + " && " + propName +  "<=" + stringValue(max) ;
                        }
                    } else {
                        throw new Error("Incorrect interval");
                    }
                }
            }
            
            function enumCondition(propertyValues, propName, negate) {
                var cond = "[";
                for (var i = 0, n = propertyValues.length; i < n; i++) {
                    if (i > 0) {
                        cond += ", ";
                    }
                    cond += stringValue(propertyValues[i]);
                }
                cond += "].indexOf(" + propName + ") " + (negate ? "<" : ">=") + " 0";
                return cond;
            }
            
            function stringCondition(propertyValues, propName, not) {
                not = !!not;
                if (isPlainObject(propertyValues)) {
                    var type, negate = !!(propertyValues.negate||propertyValues.negation||propertyValues.not);
                    negate = negate && not ? false : negate||not;

                    switch(type = normalizeType(
                        hasOwnProp(propertyValues, 'type') 
                                && typeof propertyValues.type === 'string' ?
                            propertyValues.type                        
                        : hasOwnProp(propertyValues, 'operator') 
                                && typeof propertyValues.operator === 'string' ?
                            propertyValues.operator                        
                        : hasOwnProp(propertyValues, 'relation') 
                                && typeof propertyValues.relation === 'string'? 
                            propertyValues.relation                        
                        : hasOwnProp(propertyValues, 'condition') 
                                && typeof propertyValues.condition === 'string'? 
                            propertyValues.condition
                        : "")) {
                            case 'interval':
                                return intervalCondition(
                                    propertyValues.values||propertyValues.Values
                                        ||propertyValues.range
                                        ||propertyValues.interval
                                        ||propertyValues.Range
                                        ||propertyValues.Interval,
                                    propName, negate);
                            case 'enum':
                                return enumCondition(propertyValues.values||propertyValues.Values||propertyValues.list||propertyValues.List, propName, negate);
                            case 'equals':
                                return propName + (negate ? '!==' : '===') + stringValue(propertyValues.value||propertyValues.Value);
                            case 'looseequals':
                                return propName + (negate ? '!=' : '==') + stringValue(propertyValues.value||propertyValues.Value);
                                break;
                            case 'different':
                                return propName + (negate ? '===' : '!==') + stringValue(propertyValues.value||propertyValues.Value);
                            case 'ranges':
                                
                                break;
                            case 'linked-values':
                                
                                break;
                    }
                } else if (isArray(propertyValues)) {
                    return enumCondition(propertyValues, propName, not);
                }
            }
            
            function condition(values, nullOrUndefined) {
                var cond = "", v;
                for (var name in values) {
                    if (hasOwnProp(values, name)) {
                        if (cond) {
                            cond += " && ";
                        }
                        if ((v = values[name]) === undefined) {
                            cond += nullOrUndefined ? 'typeof this.' + name + " === 'undefined' || this." + name + " === null" : "this." + name + "  === null";
                        } else if (v === null) {
                            cond += nullOrUndefined ? 'typeof this.' + name + " === 'undefined' || this." + name + " === null" : "this." + name + "  === undefined";
                        } else {
                            cond += "this." + name + " === "  + stringValue(v);
                        }
                    }
                }
                return cond ? cond : "true";
            }
            var dependency = check.dependency||check.dependent||check.property;
            
            var func = this.getDependencyDataTypeCheck(prop)||"";
            
                       
            function _defaultValue(m) {
                var val = { defined : false };
                if (hasOwnProp(m, 'propertyDefaultValue')) {
                    val.value = m.propertyDefaultValue;
                    val.defined = true;
                } else if (hasOwnProp(m, 'propertyDefVal')) {
                    val.value = m.propertyDefVal;
                    val.defined = true;
                } else if (hasOwnProp(m, 'propertyDefault')) {
                    val.value = m.propertyDefault;
                    val.defined = true;
                } else if (hasOwnProp(m, 'defaultValue')) {
                    val.value = m.defaultValue;
                    val.defined = true;
                }
                 else if (hasOwnProp(m, 'default')) {
                    val.value = m.default;
                    val.defined = true;
                }
                return val;
            }
            
            if (typeof dependency === 'string' && dependency) {
                var matches = check.matches||check.match;
                if (isPlainObject(matches)) {

                } else if (isArray(matches)) {
                    var dependentValue, propertyDefVal, propertyValues, m, n = matches.length, values;
                    if (n > 0) {
                        values = matches[0].properties||matches[0].values||matches[0].Properties||matches[0].Values;
                        if (isPlainObject(values)) {
                            func += "\nvar " + dependency + " = " + getGetter(dependency) + ";";
                            var match;
                            for (var i = 0; i < n; i++) {
                                match = matches[i];
                                values = match.properties||match.values;
                                propertyDefVal = _defaultValue(match);
                                func += "\n" + (i === 0 ? "" : "else ") + "if (" + condition(values) + ") {";
                                func += "\n    if (" + prop.name + ") {";
                                func += "\n        if (" + stringCondition(propertyValues,prop.name, true) + ") {";
                                func += "\n            throw new Error(\"" + (check.error ? check.error : "value does not match") + "\");";
                                func += "\n        }";
                                func += "\n        return " + prop.name + ";";
                                if (propertyDefVal.defined) {
                                    func += "\n    }  else {";
                                    func += "\n        return " + stringValue(propertyDefVal.value) + ";";                                
                                }
                                func += "\n    }";
                                func += "\n}";
                            }
                        } else if (values) {
                            throw new Error("Incorrect dependency definition");
                        } else {
                            func += "\nvar " + dependency + " = " + getGetter(dependency) + ";";
                            for (var i = 0; i < n; i++) {
                                m= matches[i];
                                dependentValue = m.dependentValue||m.propertyValue||m.property||m.value;
                                propertyValues = m.propertyValues||m.matchValues||m.match;
                                propertyDefVal = _defaultValue(m);
                                func += "\n" + (i === 0 ? "" : "else ") + "if (" + dependency + " === " + stringValue(dependentValue, m) + ") {";
                                func += "\n    if (" + prop.name + ") {";
                                func += "\n        if (" + stringCondition(propertyValues,prop.name, true) + ") {";
                                func += "\n            throw new Error(\"" + (check.error ? check.error : "value does not match") + "\");";
                                func += "\n        }";
                                func += "\n        this.__" + prop.name + "_ = " + prop.name + ";";
                                if (propertyDefVal.defined) {
                                    func += "\n    }  else {";
                                    func += "\n        this.__" + prop.name + "_ = " + stringValue(propertyDefVal.value) + ";";                                
                                }
                                func += "\n    }";
                                func += "\n}";
                            }
                            func += " else if (" + dependency + ") {"
                                    + "\n    throw new Error(\"Incorrect " + dependency + "\");"
                                    + "\n}";
                        }
                    }
                    if (func) {
                        return { process: eval("(function() {return function _check_dependency(" + prop.name + ") {\n" + func + "\n};})()" ), returnValue : true } ;
                    }
                } else {
                    throw new Error("Incorrect dependency definition");
                }
            }
        },
        /**
         * 
         * @param {type} type
         * @param {Object} prop
         * @param {String} name
         * @returns {Function}
         */
        getTypeCheck: function(type, prop, name) { 
            var nullable = this.getNullable(prop);
            
            var not = false, 
                owner, 
                checkDependency,
                check,
                _check = prop ? prop.check||prop.checker
                        ||prop.validate||prop.validator||prop.validater
                        ||prop.Check||prop.Checker
                        ||prop.Validate||prop.Validator||prop.Validater : false,
                dependency = prop? prop.dependency||prop.Dependency : false;
            
            if (isPlainObject(dependency)) {
                dependency = this.getDependencyCheck(dependency, prop);
            }
            if (isRegExp(_check)) {
                check = this.getRegexFunc(_check);
            } else if (isPlainObject(_check)) {
                if (_check.type === 'dependency' || hasOwnProp(_check, 'dependency') 
                        || hasOwnProp(_check, 'dependencies')) {                    
                    checkDependency =  this.getDependencyCheck(_check, prop);
                } else {
                    owner = _check;
                    not = toBool(typeof check.not !== 'undefined' ? check.not : (typeof check.negate !== 'undefined' ? check.negate: check.negation));
                    check = _check.check||_check.validate||_check.is||_check.process||_check.accept;
                    if (!check) {
                        check = this.getExpressionFunc(owner);
                    } else if (isRegExp(check)) {                
                        check = this.getRegexFunc(check);
                        owner = null;
                    } else if (check.type === 'regexp' || check.type === 'regex' || check.type === 're') {
                        check = this.getRegexFunc(getRegExp(check));  
                        owner = null;
                    } else if (typeof check !== 'function') {
                        var E = SereniX.Expression||globalNS.Expression; 
                        if (typeof E === 'function') {
                            check = E.getInstance(owner);
                        } else {
                            throw new Error("Incorrect check object");
                        }
                    }
                }
            } else if (typeof _check === 'string') {

            } else if (_check) {
                var E = SereniX.Expression||globalNS.Expression; 
                if (typeof E === 'function' && check instanceof E) {

                }
                throw new Error("Incorrect check object");
            }
            
            if (check) {
                if (dependency) {
                    check = [check, dependency];
                }
            } else if (checkDependency) {
                check = dependency ? [checkDependency, dependency] : checkDependency;
            } else {
                check = dependency;
            }

            return  this.getCheck(type, check, owner, not, nullable, name);

        },
        /**
         * 
         * @param {type} e
         * @returns {Function}
         */
        getExprEvaluator : function(e) {
            var proc = this.evaluator||this.expressionProcessor;
            if (typeof proc === 'function') {
                /**
                 * 
                 * @param {Object} [thisArg]
                 * @returns {type}
                 */
                function _eval_(thisArg) {
                    return _eval_.eval(_eval_.expr, thisArg||this);
                }
                _eval_.eval = proc;
                _eval_.expr = e;
                return _eval_;
            } else if (isPlainObject(proc) && typeof proc.eval === 'function') {
                /**
                 * 
                 * @param {Object} [thisArg]
                 * @returns {type}
                 */
                function _eval_(thisArg) {
                    return _eval_.proc.eval(_eval_.expr, thisArg||this);
                }
                _eval_.proc = proc;
                _eval_.expr = e;
                return _eval_;
            } else {
                var Ev = globalNS.SereniX ? SereniX.JsEvaluator||globalNS.JsEvaluator : globalNS.JsEvaluator;
                if (typeof Ev === 'function') {
                    var ev = new Ev();
                    this.evaluator = ev;
                    /**
                     * 
                     * @param {Object} [thisArg]
                     * @returns {type}
                     */
                    function _eval_(thisArg) {
                        return _eval_.evaluator.eval(_eval_.expr, thisArg||this);
                    }
                    _eval_.evaluator = ev;
                    _eval_.expr = e;
                    return _eval_;
                }
                /**
                 * 
                 * @param {Object} [thisArg]
                 * @returns {type}
                 */
                function _eval_(thisArg) {
                    var func = eval("(function() {return function () { return " +_eval_.expr.toString() + ";};})()");
                    return func.call(thisArg||this);
                }
                _eval_.expr = e;
                return _eval_;
            }
        },
        /**
         * 
         */
        processCheckResult: function(result, v) {
            if (result instanceof CheckSuccess) {
                return result.valued ? result.returnValue : v;
            }
            if (result instanceof CheckError || result === false) {
                incorrect(v);
            }
            return new CheckSuccess(v);
        },
        /**
         * 
         * @param {type} type
         * @param {Function|RegExp|String} check
         * @param {Object} owner
         * @param {Boolean} not
         * @param {Boolean} nullable
         * @param {String} name
         * @returns {Function}
         * @todo not argument consideration when the return value is not aboolean
         */
        getCheck:function(type, check, owner, not, nullable, name) {
            function _getType(type) {
                if (!type) {
                    type = SereniX.types.AnyType.getInstance();
                }
                if (type instanceof SereniX.types.Type) {
                    return type;
                }
                var _type = type;
                if (typeof _type === 'object') {
                    _type = _type.type||_type.name;
                }
                if (typeof _type === 'string') {
                    if (_type.startsWith("${") && _type.endsWith("}")) {
                        return eval(_type.substring(2, _type.length - 1));
                    }
                    try {
                        return SereniX.types.Type.getInstance(KlassUtils.getTypeFromString(_type));
                    } catch (err) {}
                    return _type;
                }
                return type;
            }
            
            if (check instanceof String) {
                check = check.valueOf();
            }
            
            if (isArray(check)) {
                //TODO : not argument consideration when the return value is not aboolean
                function fcheck(v) {
                    var checks = fcheck.checks,
                        c, func, result;
                    for (var i = 0, n = checks.length; i < n; i++) {
                        c = checks[i];
                        if (typeof c === 'function') {                            
                            result = c.call(this, v);
                            if (result instanceof CheckSuccess) {
                                v = result.valued ? result.returnValue : v;
                            } else if (result instanceof CheckError) {
                                return result;
                            } else if (!result) {
                                throw new PropertyDefinitionError("Incorrect check");
                            }
                        } else if (isPlainObject(c)) {
                            func = c.process||c.callable||c['function']||c.func||c.method||c.check
                                    ||c.Process||c.Callable||c.Function||c.Func||c.Method||c.Check;
                            result = func.call(this, v);
                            if (c.returnValue||c['return']||c.ReturnValue||c.Return) {
                                if (result instanceof CheckSuccess) {
                                    v = result.valued ? result.returnValue : v;
                                } else if (result instanceof CheckError) {
                                    return result;
                                } else {
                                    v = result;
                                }
                            }
                        } else {
                            throw new PropertyDefinitionError("Incorrect check");
                        }
                    }
                    return new CheckSuccess(v);
                }
                fcheck.checks = check;
                check = fcheck;
            } else if (isPlainObject(check)) {
                var func = check.process||check.callable||check['function']||check.func||check.method||check.check
                        ||check.Process||check.Callable||check.Function||check.Func||check.Method||check.Check;
                var returnValue = check.returnValue||check['return']||check.ReturnValue||check.Return;                
                if (typeof func === 'function') {
                    if (returnValue) {
                        function _check__(v) {
                            var result = _check__.func.call(this, v);
                            if (result instanceof CheckSuccess) {
                                v = result.valued ? result.returnValue : v;
                            } else if (result instanceof CheckError) {
                                incorrect(v);
                            } else {
                                return result;
                            }
                        }
                        _check__.func = func;
                        check = _check__;
                    } else if (!owner) {
                        owner = check;
                        check = func;
                    }
                } else {
                    throw new PropertyDefinitionError("Incorrect check");
                }
            } else if (typeof check === 'string') {
                if (check = check.trim()) {
                    var sre = ">|>=|<|<=|==|=|!=|<>|(?:(?:between|eq|lt|gt|ne|le|ge)\\b)", re, op;
                    var match, i, token, operators = [ '>', '>=', '<', '<=', '==', '=', '!=', '<>', 'between', 'eq', 'lt', 'gt', 'ne', 'le', 'ge'];
                    var expr, operand, link
                    if (match = (re = new RegExp("^(?:" + sre + ")", "g")).exec(check)) { //property criteria 
                        op = match[0];
                        i = re.lastIndex;
                        re = new XRegExp("&&|\|\||[()[]{}*%,;:?!&+-]|\.|/|\||\\band\\b|\\bor\\b|\\bnot\\b" + sre, "g");
                        while (match = re.exec(check)) {
                            switch(token) {
                                case '<':
                                case 'lt' :
                                    break;
                                case '<=' :
                                case 'le' :
                                    break;
                                case '>':
                                case 'gt' :
                                    break;
                                case '>=' :
                                case 'ge' :
                                    break;
                                case '===' :
                                case 'eq' :
                                    break;
                                case '==' :
                                    break;
                                case '!==' :
                                case '<>' :
                                case 'ne' :
                                    break;
                                case '!=' :
                                    break;
                                case '(':
                                    break;
                                case ')' :
                                    break;
                                case '[':
                                    break;
                                case ']' :
                                    break;
                                case '{':
                                    break;
                                case '}' :
                                    break;
                                case 'and':
                                case '&&':
                                    break;
                                case 'or':
                                case '||':
                                    break;
                                default:
                                    break;
                            }
                            
                            i = re.lastIndex;
                        }
                    } else { //condition
                        
                    }
                }
            }

            if (type && check && owner && not && nullable) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return new CheckSuccess(v);
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.apply(__CHECK_TYPE__.caller, [v])) {
                        incorrect(v);
                    }
                    
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check && owner && nullable) {
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            ) {
                        incorrect(v);
                    }
                    return this.processCheckResult(__CHECK_TYPE__.check.apply(__CHECK_TYPE__.caller, [v]));
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && (typeof check === 'function') && not && nullable) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.call(this, v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && isRegExp(check) && not && nullable) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || !__CHECK_TYPE__.check.test(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check && not && nullable) {
                //TODO : not argument consideration when the return value is not aboolean
                throw new Error("[KlassUtils.getCheck]: case not yet implemented");
            } else if (type && (typeof check === 'function') && nullable) {
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.call(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && isRegExp(check) && nullable) {
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || !__CHECK_TYPE__.check.test(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check && nullable) {
                throw new Error("[KlassUtils.getCheck]: case not yet implemented");
            } else if (type && nullable) {
                function __CHECK_TYPE__(v) {
                    if (v === null || typeof v === 'undefined') {
                        return true;
                    }
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))) {
                        incorrect(v);
                    }
                    return true;
                }
                __CHECK_TYPE__.type = type; 
            } else if (type && check && owner && not) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.apply(__CHECK_TYPE__.caller, [v])) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check && owner) {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || !__CHECK_TYPE__.check.apply(__CHECK_TYPE__.caller, [v])) {
                        incorrect(v);
                    }                
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && (typeof check === 'function') && not) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.call(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && isRegExp(check) && not) {
                //TODO : not argument consideration when the return value is not aboolean
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || __CHECK_TYPE__.check.test(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check && not) {
                throw new Error("[KlassUtils.getCheck]: case not yet implemented");
            } else if (type && (typeof check === 'function')) {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || !__CHECK_TYPE__.check.call(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && isRegExp(check)) {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))
                            || !__CHECK_TYPE__.check.test(v)) {
                        incorrect(v);
                    }
                }
                __CHECK_TYPE__.caller = owner;
                __CHECK_TYPE__.check = check;
                __CHECK_TYPE__.type = type;
            } else if (type && check) {
                throw new Error("[KlassUtils.getCheck]: case not yet implemented");
            } else if (type) {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))) {
                        incorrect(v);
                    }
                    return true;
                }
                __CHECK_TYPE__.type = type; 
            } else {
                //TODO
            }


            if (nullable) {
                if (typeof check === 'function') {
                    function __CHECK_TYPE__(v) {
                        if (v === null || typeof v === 'undefined') {
                            return true;
                        }
                        var t = _getType.call(this, __CHECK_TYPE__.type);
                        if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))) {
                            incorrect(v);
                        }
                        if (__CHECK_TYPE__.check(v)) {
                            return true;
                        }
                        incorrect(v);
                    }
                    __CHECK_TYPE__.check = check;
                    __CHECK_TYPE__.type = type;        
                    return __CHECK_TYPE__;
                } else if (isRegExp(check)) {
                    function __CHECK_TYPE__(v) {
                        if (v === null || typeof v === 'undefined') {
                            return true;
                        }
                        var t = _getType.call(this, __CHECK_TYPE__.type);
                        if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))) {
                            incorrect(v);
                        }
                        if (__CHECK_TYPE__.regex.test(v)) {
                            return true;
                        }
                        incorrect(v);
                    }
                    __CHECK_TYPE__.regex = check;
                    __CHECK_TYPE__.type = type;        
                    return __CHECK_TYPE__;
                } else if (!this.isAnyType(type)) {
                    function __CHECK_TYPE__(v) {
                        if (v === null || typeof v === 'undefined') {
                            return true;
                        }
                        var t = _getType.call(this, __CHECK_TYPE__.type);
                        if (!(t instanceof SereniX.types.Type ? t.is(v, this) : SereniX.KlassUtils.isTypeOf(v, t))) {
                            incorrect(v);
                        }
                        return true;
                    }
                    __CHECK_TYPE__.type = type;        
                    return __CHECK_TYPE__;
                }
            } else if (!this.isAnyType(type)) {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    var t = _getType.call(this, __CHECK_TYPE__.type);
                    if (!SereniX.KlassUtils.isTypeOf(v, __CHECK_TYPE__.type)) {
                        incorrect(v); //throw an eception
                    }
                    return true;
                }
                __CHECK_TYPE__.type = type;        
                return __CHECK_TYPE__;
            } else {
                function __CHECK_TYPE__(v) {
                    noValue(v); //throw an eception when v is null or undefined.
                    return true;
                }       
                return __CHECK_TYPE__;
            }
            if (!__CHECK_TYPE__) {
                function __CHECK_TYPE__(v) {
                    if (v == undefined) return true;
                    if (!SereniX.KlassUtils.isTypeOf(v, __CHECK_TYPE__.type)) {
                        incorrect(v); //throw an eception
                    }
                    return true;
                }
                __CHECK_TYPE__.type  = type||SereniX.types.AnyType.getInstance();
            }
            return __CHECK_TYPE__;
            
        },

        /**
         * 
         * @param {type} obj
         * @param {type} type
         * @returns {Boolean}
         */
        isTypeOf : function(obj, type) {
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
                //PRIMITIVE_TYPE_WRAPPERS_MAP require serenix_types.js loaded
                var ptype = PRIMITIVE_TYPE_WRAPPERS_MAP[cname];
                if (PRIMITIVE_TYPE_WRAPPERS[ptype] === type && typeof obj === ptype) {
                    return true;
                }
                //NUMBER_TYPE_WRAPPERS require serenix_types.js loaded
                var _typ = NUMBER_WRAPPER_TYPES[cname];
                if (_typ) {
                    return SereniX.types.TypeUtils.isTypeOf(obj, _typ);
                }
                throw new Error("Incorrect object!!! Expected type : " + cname);
            }
            if (type instanceof SereniX.types.Type) {
                return type.is(obj);
            }
            if ((typeof type === 'undefined') || (type === null) 
                    || this.isAnyType(type)) {
                return true;
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

            if (isNoValue(obj)) {
                if (SERENIX_NOT_NULLABLES.indexOf(_type) >= 0 || !(typeof _nullable === 'undefined' || _nullable)) {
                    throw new Error("Incorrect value: null or undefined value");
                }
                return true;
            }
            if (_type === String) {
                return (typeof obj === 'string') || (obj instanceof _type);
            }
            if ((typeof _type === 'function')) {
                return checkInstanceof(obj, _type);
            }
            //this.checkNamedType is a static method inherited from SereniX.types.TypeUtils
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
        },
        /**
         * Returns the given value/object if it matches the given type. Otherwise, throws an exception.
         * @param {type} obj  The value/object to check the type 
         * @param {type} type
         * @returns {Boolean}
         * @throws {Error}
         */
        value : function(obj, type) {
            
            /*---------------------------------------------------*/
            /*-------------*    Inner functions    --------------*/
            /*---------------------------------------------------*/
            function checkInstanceof(obj, type) {
                function isNoValue(v) {
                    return v === null || v === undefined;
                }
                if (obj instanceof type || isNoValue(obj)) {
                    return obj;
                }
                var cname = type.getClassFullName ? 
                                type.getClassFullName() :
                                type.__CLASS_NAME__;
                if (!cname) {
                    cname = (type.__CLASS__ ? 
                            type.__CLASS__.__NAME__||type.__CLASS__.NAME||type.name : type.name)||"";
                }
                //PRIMITIVE_TYPE_WRAPPERS_MAP require serenix_types.js loaded
                var ptype = PRIMITIVE_TYPE_WRAPPERS_MAP[cname];
                if (PRIMITIVE_TYPE_WRAPPERS[ptype] === type && typeof obj === ptype) {
                    return new type(obj); //wrapping or auto-boxing of the value
                }
                //NUMBER_TYPE_WRAPPERS require serenix_types.js loaded
                var _typ = NUMBER_WRAPPER_TYPES[cname];
                if (_typ) {
                    if (SereniX.types.TypeUtils.isTypeOf(obj, _typ)) {
                        return new type(obj); //wrapping or auto-boxing of the value
                    }
                }
                throw new ValueError("Incorrect " + (isPlainObject(obj) ? "object" : "value") + ": Expected type : " + cname);
            }
            function error(obj) {
                throw new ValueError("Incorrect " + (isPlainObject(obj) ? "object" : "value"));
            }
            function _value(v, ok) {
                return ok ? v : error(obj);
            }
            
            function getClass(type) {
                if (['number', 'numeric', 'decimal'].indexOf(type) >= 0) {
                    return Number;
                }
                try {
                    return Klass.forname(type);
                } catch (err) {
                    return null;
                }                
            }
            
            function notNullableValue(type) {
                var wrapperClass = getClass(type);
                return wrapperClass && obj instanceof wrapperClass ? obj.valueOf() : _value(obj, TypeUtils.isTypeOf(obj));
            }
            
            /*---------------------------------------------------*/
            /*-------------*    function process    -------------*/
            /*---------------------------------------------------*/
            
            if (type instanceof SereniX.types.Type) {
                return _value(obj, type.is(obj));
            }
            if ((typeof type === 'undefined') || (type === null)
                    || this.isAnyType(type)) {
                return obj;
            }
            
            if (type === Date) {
                return _value(obj, isNoValue(obj) || obj instanceof Date);
            }
            if (typeof type === 'function') { //class type
                return checkInstanceof(obj, type);
            }
            //set the checker/validator function or object
            var c = type.checker||type.check||type.validator||type.validater||type.validate;
            var func;
            if ((func = (typeof c === 'function')) || (function(obj, c) {
                if (isPlainObject(c)) {
                    var check;
                    if ((typeof (check = c.check) === 'function' && c.check(obj)) 
                            || (typeof (check = c.isValid) === 'function' && c.isValid(obj)) 
                            || (typeof (check = c.validate) === 'function' && c.validate(obj)))
                        return true;
                    if (check) {
                        error(obj);
                    }
                    throw new Error("Incorrect type checker/validator");
                }
            })(obj, c)) {
                return func ? _value(obj, c(obj)) : obj;
            }

            var _nullable, _type;
            if (isPlainObject(type)) {
                _type = type.type||type.name||type.Type||type.Name;
                _nullable = type.nullable;
                if (typeof _nullable === 'undefined') {
                    _nullable = true;
                }
            } else if (typeof type === 'string') {
                if (SERENIX_NOT_NULLABLES.indexOf(type) >= 0) {
                    if (isNoValue(_nullable)) {
                        throw new Error("Incorrect value: null or undefined value");
                    }
                    return notNullableValue(type);
                } else {
                    _type = getClass(type)||(function(t) {
                        try {
                            t = SereniX.types.Type.forname(t)||t;
                            _nullable = !(t instanceof SereniX.types.Type.forname); 
                        } catch (ex) {
                            _nullable = true;
                        }
                        return t;
                    })(type);
                }                
            } else if (typeof type === 'function') {
                _nullable = true;
                _type = type;
            } else
                throw new Error("Incorrect type");
            // if obj is null or undefined
            if (isNoValue(obj)) {
                if (isNoValue(_nullable) || toBool(_nullable)) {
                    return obj;
                }                
                throw new Error("Incorrect value: null or undefined value");
            }
            if (_type === String) {
                if (obj instanceof _type) {
                    return obj;
                }
                if (typeof obj === 'string') {
                    return new String(obj);
                }
                throw new Error("Incorrect " + (isPlainObject(obj) ? "object" : "value") + ": Expected type : " + cname);
            }
            if ((typeof _type === 'function')) {
                return checkInstanceof(obj, _type);
            }
            if (_type && typeof _type === "object") {
                var typ = _type.type||_type.name||"";
                if (typeof typ === "string") {
                    //this.checkNamedType is a static method inherited from SereniX.types.TypeUtils
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
                //this.checkNamedType is a static method inherited from SereniX.types.TypeUtils
                return this.checkNamedType(obj, type);
            }
        },
        getTypeSize: function(o) {
            var s, v;
            v = this.getSize(o);
            if (typeof v !== 'undefined' && v !== null) {
                s = {size : v};
            }
            v = this.getMinLength(o);
            if (typeof v !== 'undefined' && v !== null) {
                if (!s) {
                    s = {};
                }
                s.minLength = v;
            }
            v = this.getMaxLength(o);
            if (typeof v !== 'undefined' && v !== null) {
                if (!s) {
                    s = {};
                }
                s.maxLength = v;
            }
            return s;
        },
        getTypeOptions: function(opts, paramTypes) {
            if (!opts) {
                opts = {};
            }
            if (paramTypes) {

                for (var i = 0, n = paramTypes.length, ptyp; i < n; i++) {
                    ptyp = paramTypes[i];
                    switch(ptyp.name||"") {
                        case "type":
                        case "Type":
                        case "typeName":
                        case "TypeName":
                        case "name":
                        case "Name":
                            opts.type = ptyp.value||ptyp.type||ptyp.name;                                        
                            break;
                        case "loginPropertyName":
                        case "LoginPropertyName":
                        case "loginField":
                        case "LoginField":
                            opts.loginPropertyName = ptyp.value||ptyp.type||ptyp.name;
                            break;
                        case "namePropertyName":
                        case "NamePropertyName":
                        case "nameField":
                        case "NameField":
                            opts.namePropertyName = ptyp.value||ptyp.type||ptyp.name;
                            break;
                        case "digits":
                        case "Digits":
                            opts.digits = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                        case "minDigits":
                        case "MinDigits":
                            opts.minDigits = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                        case "maxDigits":
                        case "MaxDigits":
                            opts.maxDigits = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                        case "size":
                        case "Size":
                        case "length":
                        case "Length":
                            opts.length = opts.size = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                        case "minLength":
                        case "MinLength":
                            opts.minLength = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                        case "maxLength":
                        case "MaxLength":
                            opts.maxLength = parseInt(ptyp.value||ptyp.type||ptyp.name, 10);
                            break;
                    }
                }
            }
            return opts;
        },
        getType : function(typ) {            
            if (typeof typ === 'string') {                
                try {
                    return Klass.forname(typ);
                } catch (err) {}
                try {
                    return SereniX.types.Type.forname(typ);
                } catch (err) {}
                var ltyp = typ.toLowerCase();
                if (ltyp === 'any') {
                    return SereniX.types.AnyType.getInstance();
                } else if (['*', '+', '?', '#'].indexOf(ltyp) >= 0) {
                    return WildcardType.getInstance(typ);
                }
                if (SERENIX_NUMBER_TYPES.indexOf(typ) >= 0 || SERENIX_STRING_TYPES.indexOf(typ) >= 0) return typ;
            } else if (typeof typ === 'function' || typ instanceof Function || typ instanceof SereniX.types.Type) return typ;
            else if (isPlainObj(typ)) {
                return SereniX.types.Type.getInstance(typ);
            } else {
                throw new Error("Incorrect type");
            }
            return SereniX.types.Type.getInstance(typ);
        },
        /**
         * 
         * @param {String} type
         * @param {type} values
         * @param {type} types
         * @param {Object} prop
         * @returns {SereniX.types.Union|SereniX.types.Enum|SereniX.types.Interval|SereniX.types.Intersect|SereniX.types.Minus|SereniX.types.SType|Function}
        */
        strToType : function(type, values, types, prop) {
            var t = SereniX.types, _typ, ltyp; 
            if ((ltyp = type.toLowerCase()) === 'array') {
                _typ = ltyp;
            } else if (ltyp === 'list') {
                //TODO
            } else if (['union', 'minus', 'intersect'].indexOf(ltyp) >= 0) {                    
                if (!isArray(types)  && types.length > 0) {
                    throw "Incorrect type";
                }
                _typ = ltyp === 'union' ? new t.Union(types) 
                        : (ltyp === 'minus' ? new t.Minus(types) 
                        : new t.Intersect(types) );
            } else if (['enum', 'enumeration'].indexOf(ltyp) >= 0) {                    
                if (!isArray(values)  && types.length > 0) {
                    throw "Incorrect type";
                }
                _typ = new t.Enum(values);
            } else if (['interval', 'range', 'ranges'].indexOf((ltyp = type.toLowerCase())) >= 0) { 
                var min = this.getMin(prop);
                var max = this.getMax(prop);
                if (!values) {
                    if (typeof min !== 'undefined'
                                || typeof max !== 'undefined')  {
                        values = new t.Interval(prop);
                    } else
                        throw "Incorrect type";
                } else if (isPlainObject(values)) {
                    _typ = new t.Interval(values);
                } else {
                    throw "Incorrect type";
                }

            } else if (['set'].indexOf((ltyp = type.toLowerCase())) >= 0) {                    
                if (!isArray(values)) {
                    throw "Incorrect type";
                }
                _typ = new t.Interval(values);
            } else {
                if (SERENIX_NUMBER_TYPES_MAP[ltyp]) {
                    _typ = ltyp;
                    var size = this.getSize(prop),
                        scale = this.getScale(prop),
                        precision = this.getPrecision(prop);
                    if (typeof size !== 'undefined'
                            || typeof precision !== 'undefined'
                            || typeof scale !== 'undefined')  {
                        _typ = new t.SType({
                            type: _typ, 
                            size: size, 
                            precision : precision, 
                            scale: scale
                        });
                    }
                } else if (SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0) {
                    _typ = ltyp;
                    var minLength = this.getMinLength(prop),
                        maxLength = this.getMaxLength(prop),
                        size = this.getSize(prop);
                    if (typeof size !== 'undefined'
                            || typeof minLength !== 'undefined'
                            || typeof maxLength !== 'undefined')  {
                        _typ = new t.SType({
                            type: _typ, 
                            size: size, 
                            minLength : minLength, 
                            maxLength: maxLength
                        });
                    }
                } else if (ltyp === 'boolean' || ltyp === 'bool') {
                    if (t.Boolean) {
                        _typ = t.Boolean.STRICT_BOOLEAN;
                    } else {
                        _typ = 'boolean';
                    }
                } else {
                    var C;
                    try {
                        C = Klass.forname(type);
                    } catch (e) {}
                    if (C === String) {
                        _typ = ltyp;
                    } else if (typeof C === 'function') {
                        _typ = C ;
                    } else {
                        _typ = this.getTypeFromString(type); 
                    }
                }
            }
            return _typ;
        },
        /**
         * @param {type} args 
         * @param {type} Cls 
         */
        normalizeTypeCallArgs : function(args, Cls) {
            var _this = this;
            function _getType(_this, typ, Cls) {
                if (typeof typ === 'string')
                    return _getTypeFromString(_this, fields[name], Cls);                
                if (typeof typ === 'function' || typ instanceof SereniX.types.Type)
                    return typ;
                if (isPlainObject(typ))
                    return _this.getTypeFromObj(typ);                
                throw new Error("Incorrect object type definition");
            }
            function _getTypeFromString(_this, styp, Cls) {
                if (['Number', 'Boolean', 'String', 'Function'].indexOf(styp) >= 0) {
                    //TODO
                }
                var ltyp = styp.toLowerCase();
                if (SERENIX_BASIC_DATA_TYPE_NAMES.indexOf(ltyp) >= 0) {
                    return ltyp; 
                }
                return _this.getTypeFromObj(_this.getTypeFromString(styp), Cls);
            }
            
            if (isPlainObject(args)) {
                var fields = args.fields||args.properties||args.structure;
                if (fields instanceof String) {
                    fields = fields.valueOf();
                    if (!fields) {
                        throw new Error("Incorrect object type definition");
                    }
                }
                if (!fields) {
                    fields = args;
                    args =  { fields: args };
                } else if (isPlainObject(fields)) {
                    var typeName = args.typeName||args.TypeName||args.name||args.Name;
                    if (typeName instanceof String) {
                        typeName = typeName.valueOf();
                    }
                    if (typeName && typeof typeName !== 'string') {
                        throw new Error("Incorrect object type definition");
                    }
                } else if (typeof fields === 'string') {
                    args =  { fields: args };
                    fields = args.fields;
                } else {
                    throw new Error("Incorrect object type definition");
                }
                var typ;
                for (var name in fields) {
                    if (hasOwnProp(fields, name)) {
                        typ = fields[name];
                        fields[name] = _getType(this, typ, Cls);
                    }
                }
            } else if (isArray(args)) {
                var n = args.length, field, fields = args, args = {};
                if (n > 0) {
                    field = fields[0];
                    if (typeof field === 'string' || field instanceof String ) {
                        if ((n % 2) > 0) {
                            throw new Error("Incorrect object type definition");
                        }
                        n /= 2;
                        for (var i = 0; i < n; i++) {
                            field = fields[i];
                            args[field[2*i]] = _getType(this, field[2*i+1], Cls);
                        }
                    } else if (isArray(field)) {
                        for (var i = 0; i < n; i++) {
                            field = fields[i];
                            args[field[0]] = _getType(this, field[1], Cls);
                        }
                    } else {
                        //function oval returns the first valid value of the 
                        //given fields. Requires library serenix_object.js
                        var nameField = oval(field, ['name', 'fieldName', 'propertyName', 'field', 'property']),
                            typeField = oval(field, ['type', 'dataType', 'typeName' ], /*lower*/true);
                        for (var i = 0; i < n; i++) {
                            field = fields[i];
                            args[field[nameField]] = _getType(this, field[typeField], Cls);
                        }
                    }
                }
            }
            
            return args;
        },
        /**
         * 
         * @private
         * @param {String} atype
         * @param {Array|Object} values
         * @param {Array|Object} types
         * @param {String} scope
         * @param {Object} prop
         * @param {Function} klass  It's useful when the scope of the type definition is 'class'
         * @param {type} check
         * @returns {SereniX.types.Union|SereniX.types.Enum|SereniX.types.Interval|SereniX.types.Intersect|SereniX.types.Minus|SereniX.VType}
        */
        getStringPropType : function(atype, values, types, scope, prop, klass, check) {
            function defineType(type, name, scope) {
                if (scope === 'global' || scope === 'outer' ) {
                    var ndx = name.lastIndexOf(".");
                    if (ndx < 0) {
                        if (typeof type.setName === 'function') {
                            type.setName(name);
                        }
                         globalNS[name] = type;
                    } else {
                        var tname = name.substring(ndx + 1);
                        type.setName(tname);
                        Namespace.ns(name.substring(0, ndx))[tname] = type;
                    }
                } else if (scope === 'class') {
                    var own = klass, ofs = 0;
                    for (;;) {
                        ndx = name.indexOf(".", ofs);
                        if (ndx < 0) {
                            var tname = name.substring(ofs);
                            if (typeof type.setName === 'function') {
                                type.setName(name);
                            }
                            own[tname] = type;
                            break;
                        } else {                            
                            own[name.substring(ofs, ndx)] = {};
                            ofs = ndx + 1;
                        }
                    }
                }
            }
            var type = typeof atype === 'string' ? atype : atype.dataType||atype.type;    
                
            if (SERENIX_REF_TYPE_MARKER_SYMBOL && type.startsWith(SERENIX_REF_TYPE_MARKER_SYMBOL)) {
                return SereniX.types.RefTypes.getRefType(type.startsWith(SERENIX_REF_TYPE_MARKER_SYMBOL.length));
            }
            if (type === 'set' && (values === undefined || values === null)) {
                console.log("Set null or undefined values");
            }
            var _typ = this.strToType(type, values, types, prop), typeName = ""; 
            if (typeof _typ === 'undefined' ||_typ === null || _typ === '') {
                if (values) {
                    _typ = this.getValuesType(values);
                    if (_typ) {
                        typeName = typeof atype === 'string' ? type : atype.type||atype.name||type;
                    } else {
                        throw new Error("Incorrect data type definition or unknown data type: '" + type + "'");
                    }
                } else if (globalNS.SERENIX_REF_TYPE_MARKER_SYMBOL) { //if reference type
                    throw new Error("Unknown data type: '" + type + "'");
                } else {
                    _typ = SereniX.types.RefTypes.getRefType(type);
                }
            } else {
                if (values) {
                    var vt = this.getValuesType(values);                    
                    if (vt) {
                        vt.setDataType(_typ);
                        _typ = vt;
                    }
                    if (atype.dataType && atype.type) {
                        typeName = atype.type;
                    } else {
                        typeName = prop.typeName||prop.name||prop.className;                            
                    }
                } else if (SereniX.types.TypeUtils.isTypeOrSuperType(_typ, SereniX.types.ObjectType) && isPlainObject(prop.typeCallArgs) || isArray(type.typeCallArgs)) {
                    var args = prop.typeCallArgs;
                    _typ = new _typ(this.normalizeTypeCallArgs(args, klass));
                    typeName = args.typeName||args.TypeName||args.name||args.Name||args.type||args.Type;
                } else {
                    if (isPlainObject(atype)) {
                        typeName = atype.name||atype.Name;
                    }
                    if (!typeName) {
                        var args = prop.typeCallArgs;
                        if (isPlainObject(args)) {
                            typeName = args.typeName||args.TypeName||args.name||args.Name||args.type||args.Type;
                        }
                    }
                }
            }
            if (typeName && typeof typeName === 'string') {
                defineType(_typ, typeName, scope);
            }
            return _typ;
        },
        /**
         * 
         * @param {type} otype
         * @returns {unresolved}
         */
        getClasses : function(otype) {
            return otype["classes"]||otype["Classes"]
                    ||otype["classesList"]||otype["ClassesList"]
                    ||otype["klasses"]||otype["Klasses"]
                    ||otype["klassesList"]||otype["KlassesList"];
        },
        /**
         * 
         * @param {type} values
         * @returns {SereniX.types.Set|SereniX.types.Interval|SereniX.types.Enum}
         */
        getValuesType: function (values) {
            if (isArray(values) || values.type === 'enum' || values.type === 'enumeration') {
                return new SereniX.types.Enum(values);                        
            } else if (values.type === 'interval' || values.type === 'range') {
                return new SereniX.types.Interval(values);                        
            } else if (values.type === 'set' || values.type === 'set') {
                return new SereniX.types.Set(values);                        
            }
        },
        /**
         * 
         * @private
         * @param {type} obj
         * @param {Function} Cls
         * @returns {SereniX.types.Intersect|String|SereniX.types.Union|SereniX.types.Interval|SereniX.types.Enum|SereniX.types.Minus|SereniX.VType|SereniX.types.SType}
        */
        getTypeFromObj : function(obj, Cls) {
            /**
             * 
             * @param {type} obj
             * @returns {undefined}
             */
            function getScope(obj) {
                var scope = obj.typeScope||obj.scope||'';
                if (scope) {
                    if (['global', 'g', 'outer', 'out' ].indexOf(scope) >= 0) {
                        scope = 'global';
                    } else if (['class', 'c', 'local', 'l', 'inner', 'innerclass', 'inner-class', 'i' ].indexOf(obj.typeScope) >= 0) {
                        scope = 'class';
                    } else if (['property', 'p' ].indexOf(obj.typeScope) >= 0) {
                        scope = 'property';
                    } else {
                        scope = 'class';
                    }
                } else if (obj.outerType || obj.globalType || obj.outer || obj.global) {
                    scope = 'global';
                } else {
                    scope = 'class';
                }
                return scope;
            }
            var dataType = obj.dataType||obj.datatype,
                tokenType = obj.tokenType||obj.tokentype,
                type = obj.type||obj.Type||obj.typeName||obj.TypeName||obj.name||obj.Name,
                paramTypes = obj.paramTypes||obj.parameterTypes,
                _type,
                values = this.normalizeValues(obj);
            var _dataType = !!dataType;
            if (paramTypes) {
                for (var i = 0, n = paramTypes.length, ptyp; i < n; i++) {
                    ptyp = paramTypes[i];
                    switch(ptyp.name||"") {
                        case "dataType":
                        case "datatype":
                            dataType = ptyp.value||ptyp.type||ptyp.name;;
                            break;
                        case "tokenType":
                        case "tokentype":
                            tokenType = ptyp.value||ptyp.type||ptyp.name;;
                            break;
                    }
                }
            }
            _type = dataType||type;

            var atype;
            if (dataType && (type || tokenType)) {
                obj.dataType = dataType;
                obj.type = type||"";
                if (tokenType) {
                    obj.tokenType = tokenType;
                }
                atype = obj;
            } else {
                atype = _type;
            }
            
            if (_type === 'SereniX.types.ObjectType' || _type === 'SereniX.types.Object') {
                console.log("SereniX.types.ObjectType");
            }

            var types = obj["types"]||obj["Types"]||this.getClasses(obj);
            if (typeof _type === 'string') {  
                if (atype === 'set') {
                    console.log("set type");
                }
                var t= this.getStringPropType(atype, values, types, getScope(obj), obj, Cls),
                    opts;
                    //opts = this.parseObject(str, i, n);
                    
                    
                if (typeof t === 'function' 
                        && SereniX.types.TypeUtils.isTypeOrSuperType(t) 
                        && t.sizedType && (opts = obj.typeCallArgs||this.getTypeSize(obj))) {
                    t = new t(this.getTypeOptions(opts, paramTypes));
                    var typ = opts.typeName||opts.type||opts.name||opts.Name;
                    if (typ) {
                        obj.type = typ;
                        obj.dataType = t;
                    }
                    return t;
                } else if (t instanceof SereniX.types.SType) {
                    //added on Sept 29, 2021
                    console.log("Already of type SereniX.types.SType\n" + JSON.stringify(t));
                } else { 
                    var st;
                    if ((st = this.getSTypeDef(obj))) {
                        st.type = t;
                        return new SereniX.types.SType(st);
                    }
                }
                return t;
            } else if (!type && types) {
                return new SereniX.types.Union(types);
            } else if (values) {
                var t = this.getValuesType(values);
                if (!t)
                    throw new Error("Incorrect type");
                if (dataType) {
                    t.setDataType(dataType);
                } else {
                    t.setDataType(type);
                }    
                return t;
            } else {
                return new SereniX.types.SType(obj);
            }
        },
        /**
         * Computes the type of the effective class property and returns it.
         * @param {type} prop The property object that defines/gives the type of the 
         * effective and final property of the class. The property can be an element in the 
         * properties array list or is an entry in the properties object/map. 
         * If prop argument is an entry value in the properties, prop represents 
         * the type object of the effective property. 
         * @param {Boolean} entry   Is prop argument an entry of in the properties map/object
         * @returns {undefined}
         */
        getPropertyType : function(prop, entry, Cls) {
            /**
             * 
             * @param {type} prop
             * @returns {unresolved}
             */
            function getClass(prop) {
                return prop["class"]||prop.Class||prop.klass||prop.Klass
                        ||prop["className"]||prop["classname"]
                        ||prop.Class||prop.ClassName||prop.Classname
                        ||prop.klass||prop.klassName||prop.klassname
                        ||prop.Klass||prop.KlassName||prop.Klassname;
            }
            
            
            /**
             * 
             * @private
             * @param {type} type
             * @param {type} values
             * @param {type} set
             * @param {type} nullable
             * @param {type} prop
             * @returns {Object}
             */
            function normalizeType(type, values, set, nullable, prop) {

                var itemType = prop.itemType||prop.Itemtype,
                    ptypes = prop.paramTypes||prop.parameterTypes,
                    minLength = _this.getMinLength(prop),
                    maxLength = _this.getMaxLength(prop),
                    size = _this.getSize(prop),
                    scale = _this.getScale(prop),
                    precision = _this.getPrecision(prop),
                    nullable;

                if (typeof values === 'undefined' 
                        || typeof  set === 'undefined' 
                        || typeof  itemType === 'undefined' 
                        || typeof  ptypes === 'undefined' 
                        || typeof  nullable === 'undefined') {
                    nullable = _this.getNullable(type);
                    if (typeof  nullable === 'undefined') {
                        type.nullable = true;
                    }
                    return type;
                }

                var updated = false;
                if (!values) {                
                    if (!set) {
                        values = this.normalizeValues(type);
                        if (values) {
                            updated = true;
                        } else {
                            set = type["set"]||type["Set"];
                            if (set) {
                                updated = true;
                            }
                        }
                    }
                }
                if (!updated) {
                    if (ptypes) {
                        updated = true;
                    } else {
                        if (itemType) {
                            updated = true;
                        } else if (ptypes) {
                            updated = true;
                        } else if (typeof nullable !== 'undefined' && nullable !== null) { //? true : toBool(nullable);
                            updated = true;
                        }
                    }
                }
                if (!updated) {
                    return type;
                }
                var _typ = {};
                for (var name in type) {
                    _typ[name] = type[name];
                }
                if (values) {
                    _typ.values = values;
                } else if (set) {
                    _typ.set = set;
                }
                if (ptypes) {
                    _typ.ptypes = ptypes;
                }
                if (itemType) {
                    _typ.itemType = itemType;
                }
                return _typ;
            }

            var type = prop.type||prop["typeName"]||prop["typename"]
                    ||prop["TypeName"]||prop["Typename"]||getClass(prop),
                types = prop["types"]||prop["Types"]||this.getClasses(prop),
                values = this.normalizeValues(prop),
                set = prop["set"]||prop["Set"]||prop["tokens"]||prop["Tokens"],            
                nullable = this.getNullable(prop),
                min = this.getMin(prop),
                max = this.getMax(prop),
                _this = this;
            if (entry) {
                if (!type) {
                    type =  prop.name||prop.Name;                
                    if (type) {
                        prop.type = type;
                    }
                }
            }




            if (!values && (typeof min !== 'undefined' 
                        || typeof max !== 'undefined')) {
                values = new SereniX.types.Interval(prop);
            }

            if (!type && !types) {
                if (!values) return SereniX.types.AnyType.getInstance();
                try {
                    if (values instanceof SereniX.VType) { return values; }
                } catch (ex) {}
                if (isArray(values)) {
                    return new SereniX.types.Enum({ type: this.typeFromValues(values), values : values, nullable: nullable });
                } else if (isPlainObject(values)) {
                    return SereniX.VType.getInstance(values);
                } else if (isArray(set)) {
                    return new SereniX.types.Set({ type: "set", values : set, tokenType: this.typeFromValues(set) });
                } else if (isPlainObject(set)) {
                    return  new SereniX.types.Set(set);
                } else {
                    return SereniX.types.AnyType.getInstance();
                }
            }
            var itemType = prop.itemType||prop.Itemtype;
            if (!type) {
                if (types) {
                    var n = types.length, _types = [];
                    for (var i = 0; i < n; i++) {
                        _types[i] = this.getPropertyType(types[i], Cls);
                    }
                    type = new SereniX.types.Union(_types);
                } else if (!itemType) {
                    return SereniX.types.AnyType.getInstance();
                }
            } else if (isPlainObject(type) && !(type instanceof SereniX.types.Type)) {
                return this.getTypeFromObj(type, Cls); 
            } else if (isArray(type)) {
                type = new SereniX.types.Union(type);
            }


            var ptypes = prop.paramTypes||prop.parameterTypes, md;

            if (itemType) {
                itemType = this.getPropertyType(itemType, Cls);
                if (!type) {
                    md = ptypes ? { itemType :itemType, paramTypes : ptypes } : { itemType :itemType };
                } else if (ptypes) {
                    md = { type : type, itemType :itemType, paramTypes : ptypes };
                } else {
                    md = { type : type, itemType :itemType };
                }
            } else if (ptypes) {
                md = { type : type, paramTypes : ptypes };
            }
            if (typeof type === 'string') {
                if (type === 'object') {
                    type = Object;
                } else {
                    try {
                        type = Klass.forname(type);
                    } catch (ex) {
                        try {
                            type = SereniX.types.Type.forname(type);
                        } catch (e) {
                            try {
                                var t = KlassUtils.getTypeFromString(type);
                                if (isPlainObject(t)) {
                                    t = SereniX.types.Type.getInstance(t);
                                    if (t) {
                                        type = t;
                                    }
                                }
                            } catch(err) {
                                console.log(type);
                            }
                        }
                    }
                }
            } else if (typeof type === 'function') {
                if (type === Number) {

                } else if (type === String ) {

                } else  if (type === Boolean ) {

                } else {

                }
            }
            var K = SereniX.KlassUtils,
                cmin = K.getCardMin(prop),
                cmax = K.getCardMax(prop);
            if (typeof cmin === 'undefined' && typeof cmax === 'undefined') {
                if (md && md.itemType) {
                    return new TArray(md);
                }
                return md ? new SereniX.types.SType(md) : type;
            }  else if (cmax > 1 || cmax === undefined || cmax === null){
                if (!md) return new TArray({ itemType: type, cardMin: cmin, cardMax: cmax });
                md.cardMin = cmin;
                md.cardMax = cmax;
                return new TArray(md);
            } else {
                if (!md) {
                    
                } else {
                    
                }
                throw new Error("Not yet supported");
            }       
        }, //end getPropertyType function
        getDefaultValue:  function(prop) {
            var v = prop["defaultValue"];
            if (typeof v === 'undefined') {
                v = prop["defaultvalue"];
                if (typeof v === 'undefined') {
                    v = prop["default"];
                    if (typeof v === 'undefined') {
                        v = prop["DefaultValue"];
                        if (typeof v === 'undefined') {
                            v = prop["Default"];
                        }
                    }
                }
            }
            return v;
        },
        /**
         * 
         * @param {type} prop  Class property (member)
         * @param {type} pname property name
         * @param {type} entry
         * @param {type} Cls
         * @returns {KlassUtils.__processProperty.serenix_class_baseAnonym$49}
         */
        __processProperty: function(prop, pname, entry, Cls) {
            if (typeof prop === 'undefined') {
                if (entry)
                    throw new Error("Incorrect property definition");
                else
                    throw new Error("Undefined property");
            }
            if (prop instanceof String) {
                prop = prop.valueOf();
            }
            
            if (entry) {
                if (prop === null) {
                    prop = { name: pname, defaultValue: null };
                } else if (typeof prop === 'string') {
                    prop  = this.getTypeFromString(prop);
                } else if (isArray(prop) 
                        || (prop instanceof Date) 
                        || ((typeof prop !== 'undefined') && (typeof type === 'object'))) {
                    prop = { type: pname, defaultValue: prop };
                }
            }
            var type = this.getPropertyType(prop, entry, Cls);
            
            var tcheck = this.getTypeCheck(type, prop, pname);
            return  { defaultValue: this.getDefaultValue(prop), tcheck : tcheck, type: type };
        },
        /**
         * Returns false if the given element is an element that belongs to an instance 
         * (class prototype), returns true for element if element belongs to a class . 
         * @param {Object} e  The descriptor of an element (property or method)
         * @returns {Boolean}
         */
        isStatic: function (e) {   
            function getBool() {
                var e = arguments[0], s;
                for (var i = 1, n = arguments.length; i < n; i++) {
                    s = e[arguments[i]];
                    if (typeof s === 'boolean') {
                        return s;
                    }
                    if (s === 0) {
                        return false;
                    }
                    if (!(typeof s === 'undefined' || i === null || i === '')) {
                        return toBool(s);
                    }
                }
                return null;
            }
            var s = getBool(e, "static", "Static", "class", "Class"); 

            if ( s !== null) {
                return s;
            }
             var i;
            return typeof (i = e.instance||e.Instance) === 'undefined' || i === null || i === '' ? false : !toBool(i);
        },
        /**
         * 
         * @param {type} obj
         * @param {type} name
         * @param {type} desc
         * @returns {undefined}
         */
        defineProperty: function(obj, name, desc) {
            if (!obj.__definedProperties___) {
                obj.__definedProperties___ = {};
            }
            Object.defineProperty(obj, name, desc);
            obj.__definedProperties___[name] = desc;
        },
        /**
         * 
         * @param {String} name
         * @returns {unresolved}
         */
        isValidPropertyName: function(name) {
            return /^[a-zA-Z_$](?:[a-zA-Z_$]|[0-9])*$/.test(name);
        },
        isValidTypeName: function(name) {
            return /^[a-zA-Z_$](?:[a-zA-Z_$]|[0-9])*(?:(?:[.][a-zA-Z_$](?:[a-zA-Z_$]|[0-9])*)|(?:[ ][a-zA-Z_$](?:[a-zA-Z_$]|[0-9])*))*$/.test(name);
        },
        /**
         * 
         * @param {type} str
         * @param {type} ofs
         * @param {type} i
         * @returns {type}
         */
        getIntervalValue: function(str, ofs, i) {
            var s = str.substring(ofs, i).trim();
            if (s === 'Infinity' || s === 'POSITIVE_INFINITY' || s === 'Number.POSITIVE_INFINITY') {
                return Number.POSITIVE_INFINITY;
            }
            if (s === 'NEGATIVE_INFINITY' || s === 'Number.NEGATIVE_INFINITY') {
                return Number.NEGATIVE_INFINITY;
            }
            return s === '' ? null: this.stringToValue(s);
        },
        /**
         * 
         * @param {type} str
         * @param {type} i
         * @param {type} n
         * @param {Object} ctx
         * @returns {Object}
         */
        __getWrappedValues: function(str, i, n, ctx) { //tstring, i, n, ctx
            
            function closeValues(value, state, ofs, i, values, firstSpace) {
                end = firstSpace < 0 ? i : firstSpace;
                if (state === COMMA) {
                    if (ofs === end) {
                        if (isArray(values) && values.length === 0) {
                            throw new Error("Unepected character ']'");
                        }
                    }
                    value = this.stringToValue(str.substring(ofs, end));
                } else if (state === VALUE) {
                    if (ofs < end) {
                        throw new Error("Unepected character ']'");
                    }
                } else if (ofs < end) {
                    if (value) {
                        throw new Error("Unepected character ']'");
                    }
                    value = this.stringToValue(str.substring(ofs, end));
                } else {

                }
                if (value) {
                    if (!values.values) {
                        values.values = [value];
                    } else if (isArray(values.values)) {
                        values.values[values.values.length] = value;
                    } else {
                        values.max = value;
                    }
                }
                return [ values, this.skipSpaces(str, i + 1, n ) ];
            }
            
            i = this.skipSpaces(str, i, n );
            var ch = str[i++], 
                ofs = i, 
                _range = null, 
                firstSpace = -1, 
                values;
            if (ch === ']') {
                values = { type: "interval", minInclude: false};
            } else if (ch === '{') {
                values = { type: "set", values: []};
            } else if (ch !== '[' && ch !== '{') {
                throw "Unexpected character";
            }
            var typeChar = ch;
            var OPENER = 1,
                COMMA = 2, 
                state = OPENER,
                VALUE = 3, 
                INTERVAL_VALUES_DELIM = 4, 
                value = null, end;

            while (i < n) {
                ch = str[i];
                if (ch === ']' || ch === '[' || ch === '}') {
                    values = closeValues(value, state, ofs, i, values, firstSpace);
                    if (values[0].type === "interval") {
                        values[0].maxInclude = ch === ']';
                    }
                    return values;
                } else if (ch === ',') {
                    if (_range === true 
                            || state === COMMA 
                            || (values && !values.values) //interval case
                            || (state !== VALUE && (end = firstSpace < 0 ? i : firstSpace) >= end )
                            ) {
                        throw new Error("Unepected character ','");
                    }
                    if (!values) {
                        values = { type: "enum", values: [] };
                    }
                    values.values[values.values.length] = state !== VALUE ? 
                            this.stringToValue(str.substring(ofs, end)) : value;
                    value = null;
                    _range = false;
                    state = COMMA;
                    ofs = i = this.skipSpaces(str, i + 1, n );
                    firstSpace = -1;
                } else if (ch === '"' || ch === '\'') { //quoted string

                } else if (str.startsWith("\\/", i)) {

                } else if (str.startsWith("..", i)) {
                    if (_range === false || state === INTERVAL_VALUES_DELIM || (values && values.type !== 'interval')) {
                        throw new Error("Unepected character '.'");
                    }
                    value = this.getIntervalValue(str.substring(ofs, firstSpace < 0? i : firstSpace));
                    if (values) {
                        values.min = value;
                    } else {
                        values = { 
                            type : "interval", 
                            min : value,
                            minInclude : true
                        };
                    }
                    _range = true;
                    value = null;
                    ofs = i = this.skipSpaces(str, i + 2, n);
                    state = INTERVAL_VALUES_DELIM;
                } else if (" \t\n\r\b\0".indexOf(ch) >= 0) {
                    if (ofs < i) {
                        firstSpace = i;
                        i = this.skipSpaces(str, i, n );
                    } else {
                        ofs = i = this.skipSpaces(str, i, n );
                    }
                } else if (ch === ':') {
                    if (state === OPENER && typeChar === '{' && ofs < i) {
                        return null;
                    } else {
                        unexpectedChar(ch, i);
                    }
                } else {
                    i++;
                }
            }
            throw new Error("Unepected end");
        },
        /**
         * 
         * @param {String} tstring  The string representation of the type
         * @param {Number} [i=0]
         * @param {Number} [n=tstring.length]
         * @param {Array} [stops]
         * @returns {Object} The computed type from the given string.
         */
        getTypeFromString: function(tstring, i, n, stops) {
            function __getType(_this) {
                end = firstSpaces < 0 ? i : firstSpaces;
                if (interval) {
                    interval.max = _this.getIntervalValue(tstring, ofs, end);
                    typ = interval;
                    interval = null;
                    ofs = i;
                } else if (ofs < end) {
                    if (typ) {
                        throw new Error("Unexpected chacater '|'");
                    }
                    typ = tstring.substring(ofs, end);
                    if (typ === 'object') {
                        typ = Object;
                    } else {
                        try {
                            var C = Klass.forname(typ);
                            typ = C;
                        } catch(ex) {
                            try {
                                typ = SereniX.types.Type.forname(typ);
                            } catch (ex2) {}
                        }
                    }
                    ofs = i;
                } else {
                    if (state !== PARAM_TYPES) {
                        throw new Error("Unexpected chacater '|'");
                    }
                }
                return typ;
            }
            
            var  stack, ofs = 1;
            if (isArray(arguments[1])) {
                stack = arguments[1];
                ofs = 2; 
            } else if (typeof arguments[1] === 'string') {
                stack = [arguments[1]];
                ofs = 2;
            }
            i = arguments[ofs++]||0, 
            n = arguments[ofs++]||tstring.length;
            var key = arguments[ofs++]||"type";
            
            ofs = i;
            stops = stack||stops||[];
            stack = undefined;
            
            if (tstring === '' 
                    || tstring.toLowerCase() === 'any' 
                    || tstring.toLowerCase() === '{any}'
                    || tstring === '*' 
                    || tstring === '{*}'
                    || tstring.toLowerCase() === 'all') {
                return  { 
                    "type": SereniX.types.AnyType.getInstance(),
                    "nullable" :  true
                };
            }
            if (tstring === 'date' || tstring === 'Date') {
                return  { 
                    "type": Date,
                    "nullable" :  true
                };
            }
            
            if (tstring === '<String|Array<String>') {
                console.log("====================================================");
                console.log("            Debug class creation                    ");
                console.log("----------------------------------------------------");
                console.log("Method: KlassUtils.getTypeFromString\nParameter: \"" + tstring + "\"");
                console.log("====================================================");
            }
            
            
            
            var ch, firstSpaces = -1, end, 
                    interval = false, ctx, typ, types,
                    state = 0, TYPE = 1, PARAM_TYPES = 2, UNION = 3, COMMA = 4, 
                    INTERVAL = 5, ENUM = 6, SET = 7, VALUES = 8, TYPE_ARGS = 9, 
                    CARDINALITY = 10, TYPE_VALUE =  11;
            var sized = 0, _cardinality, typeName = "", stop = false, type, self = this;
            
            i = this.skipSpaces(tstring, i, n);
            
            var tvalues, numRe = /\d+(?:\.\d+)?/g, strRe = /(?:"((?:[^"]|\\")+)")|(?:'((?:[^']|\\')+)')/g;
            
            function readString() {
                strRe.lastIndex = i;
                var v = strRe.exec(tstring);
                if (v) {
                    v=v[1]||v[2];
                    i = self.skipSpaces(tstring, strRe.lastIndex, n);
                    if (i === n || tstring[i] === '|') {
                        state = TYPE_VALUE;
                        return v;
                    }
                }
                throw new Error("Unexpected character: '" + tstring[i] + "'");
            }
            
            function readNumber() {
                numRe.lastIndex = i;
                var v = parseFloat(numRe.exec(tstring)[0]);
                i = self.skipSpaces(tstring, numRe.lastIndex, n);
                if (i === n || tstring[i] === '|') {
                    state = TYPE_VALUE;
                    return v;
                }
                throw new Error("Unexpected character: '" + tstring[i] + "'");
            }
            
            
            while (i < n || stop) {
                ch = tstring[i];
                if (' \t\n\r\b\0'.indexOf(ch) >= 0) {
                    if (firstSpaces < 0) {
                        firstSpaces = i;
                    }
                    i = this.skipSpaces(tstring, i, n);
                } else {
                    switch(ch) {
                        case '<':
                            if (interval || typ) {
                                throw new Error("Unepected character '<'");
                            }
                            typ = this.fromString(this.createContext(tstring, ofs, i, true, true), {}, 'type');   
                            ofs = i = this.skipSpaces(tstring, typ.index, n);
                            typ = typ.prop;
                            if (types) {
                                types.types[types.types.length] = typ;
                                typ = null;
                            }                    
                            
                            state = PARAM_TYPES;
                            break;
                        case '|':
                            if (state !== TYPE_VALUE) {
                                typ = __getType(this);  
                                if (typ) {
                                    if (!types) {
                                        types = {
                                            type: "union",
                                            types: [typ]
                                        };
                                    } else if (types.type === 'union') {
                                        types.types[types.types.length] = typ;
                                    } else {
                                        types.types[types.types.length] = typ;                                              
                                        types = {
                                            type: "union",
                                            types: [types.types]
                                        };
                                    }
                                    typ = null;
                                }
                            }
                            ofs = i = this.skipSpaces(tstring, i + 1, n);
                            state = UNION;
                            break;
                        case ',':
                            typ = __getType(this);                    
                            if (typ) {
                                if (!types) {
                                    types = {
                                        type: "set",
                                        types: [typ]
                                    };
                                } else if (types.type === 'set') {
                                    types.types[types.types.length] = typ;
                                } else {
                                    var ts = types;                                               
                                    types = {
                                        type: "set",
                                        types: [typ]
                                    };
                                    ts.types[ts.types.length] = types;
                                    if (!stack) {
                                        stack = [ ts ];
                                    } else {
                                        stack[stack.length] = ts; 
                                    }
                                }
                                typ = null;
                            } 
                            ofs = i = this.skipSpaces(tstring, i + 1, n);
                            state = COMMA;
                            break;
                        case '.':
                            if (i + 1 < n && tstring[i+1] === '.') { //range case
                                interval = { type : 'interval', min: this.getIntervalValue(tstring, ofs, i) };
                                i += 2;
                                state = INTERVAL;
                            } else {//name case                    
                                i++;
                            }
                            break;
                        case '[': // enum or interval/range open marker/wrapper
                        case ']': // interval/range open marker/wrapper
                        case '{': // set open marker/wrapper  
                            if ((state === PARAM_TYPES) || (ofs < (end = firstSpaces < 0 ? i : firstSpaces))) {
                                throw new Error("Unexpected chacater '" + ch +"'");
                            }                    
                            typ = this.__getWrappedValues(tstring, i, n, ctx);
                            if (typ) {
                                i = typ[1];
                                typ = typ[0];
                                if (types) {
                                    types.types[types.types.length] = typ;
                                    typ = null;
                                } 
                                ofs = i = this.skipSpaces(tstring, i, n);
                                state = VALUES;
                            } else if (ch === '{' && (state === 0 || state === UNION)) {
                                typ = this.parseObject(tstring, i, n);
                                i = typ.i;
                                var klass = {}, typeObj = {};
                                typ = new SereniX.types.ObjectType(
                                    this.normalizeTypeCallArgs(
                                        typ.object, //the arguments
                                        klass
                                    )
                                );
                                state = TYPE;
                            } else {
                                unexpectedChar(ch, i); //throw "Unexpected character: '" + ch + "' at index " + i;
                            }
                            break;
                        case '(':
                            var p;
                            if (_cardinality || (sized > 0) || (p = tstring.indexOf(')', i + 1)) <= 0) {
                                unexpectedChar(ch, i); //throw "Unexpected character: '" + ch + "' at index " + i;
                            }
                            typ = { type: tstring.substring(ofs, i).trim() };
                            // skip '(' and spaces
                            i = this.skipSpaces(tstring, i + 1, n); 
                            ofs = i =  tstring[i] === '{'
                                ? this.readTypeCallArgs(typ, tstring, i, n) 
                                : this.readSizes(typ, tstring, i, n);
                            sized = 1;
                            if (i < n) {
                                ch = tstring[i];
                                if (ch === '{') {
                                    var o_ = this.readOccurences(typ, tstring, i, n);
                                    ofs = i = o_[1];
                                    typ = o_[0];
                                    sized = 2;
                                } else if (['*', '+', '?', '#'].indexOf(ch) >= 0) {
                                    ofs = i = this.setCardinality(type, ch);
                                    sized = 2;
                                }
                            }
                            
                            state = TYPE_ARGS;
                            break;
                        case '*':
                        case '+':
                        case '?':
                        case '#':
                            i = this.processCardinality(tstring, i, n, ctx, sized, _cardinality, ch, typeName, refType) - 1;
                            typeName = "";
                            sized = 2;
                            state = CARDINALITY;
                            _cardinality = ch;
                            break;
                        default :
                            if ((ch === '"' || ch === "'") && (state === UNION || state === 0)) {
                                (tvalues||(tvalues=[])).push(readString());
                                state = TYPE_VALUE;
                            } else if (/\d/.test(ch) ) {
                                if ((state === UNION || (state === 0 && ofs === i))) {
                                    (tvalues||(tvalues=[])).push(readNumber());
                                    state = TYPE_VALUE;
                                } else {
                                    i++;
                                }
                            } else if (stops.indexOf(ch) >= 0) {
                                stop = true;
                                i = this.skipSpaces(tstring, i + 1, n);
                            } else if (state === PARAM_TYPES) {
                                throw new Error("Unexpected chacater '" + ch +"'");
                            } else {
                                i++;
                            }
                    }
                    if (firstSpaces >= 0) {
                        firstSpaces = -1;
                    }
                }
            }
            if (ofs < i) {
                //typ = tstring.substring(ofs);
                typ = __getType(this);
                if (state === INTERVAL) {
                    throw new Error("Not yet supported");
                } else if (state === UNION) {
                    types.types[types.types.length] = typ;
                }
            } else if (interval) {
                return { prop: interval, index: i };
            }
            if (tvalues) {
                var enumType = new SereniX.types.Enum({ type: this.typeFromValues(tvalues), values : tvalues, nullable: false});
                if ((typeof types === 'object' && types)) {
                    if (types.type === 'union') {
                        types.types.push(enumType);
                        return types;
                    } else {
                        throw new Error("Incorrect type");
                    }
                } else if (types && types.length) {
                    types.push(enumType);
                    return types;
                }
                return enumType;
            } else if (types) {
                return types;
            }
            
            if (typ) {
                return typ;
            }
        },

        /**
         * 
         * @type type
         */
        TYPE_DEFAULT_PATTERNS : {
            "date": [["\\/Date(", ")\\/"]],
            "datetime": [["\\/Datetime(", ")\\/"], ["\\/DateTime(", ")\\/"], ["\\/Date(", ")\\/"]],
            "time": [["\\/Time(", ")\\/"], ["\\/Date(", ")\\/"]],
            "regex": [["\\/Regexp(", ")\\/"]],
            "regexp": [["\\/Regexp(", ")\\/"]]
        },
        /**
         * 
         * @param {String} s
         * @param {char} qt
         * @param {Array&lt;String&gt;} esc
         * @returns {undefined}
         */
        unescapeQString: function(s, qt, esc) {
            var re = "", n = esc.length, e;
            for (var i = 0; i < n; i++) {
                e = esc[i];
                if (e === 'self' || e === 'quote') {
                    e = qt;
                } else if (e === '\\') {
                    e = "\\\\";
                }
                if (re) {
                    re += "|";
                }
                re += e + qt;
            }
            re= new RegExp(re, 'g');
            return s.replace(re, qt);
        },
        getQStringValue: function(sval, quotes, start, end) {
            var esc;
            if (arguments.length === 2) {
                if (isArray(quotes) || typeof quotes === 'string') {
                    start = 0;
                    end = sval.length;            
                } else if (isPlainObject(quotes)) {
                    var o = quotes;
                    esc = o.escapeChar||o.escape||o.escapeChars||o.escapes||o.escapechar||o.escapechars||o.esc;
                    quotes = o.quotes||o.quote;
                } else {
                    start = arguments[1];
                }
            } else if (arguments.length === 3) {
                if (isPlainObject(quotes)) {
                    var o = quotes;
                    esc = o.escapeChar||o.escape||o.escapeChars||o.escapes||o.escapechar||o.escapechars||o.esc;
                    quotes = o.quotes||o.quote;
                } else if (!isArray(quotes) && typeof quotes !== 'string') {
                    start = arguments[1];
                    end = arguments[1];
                                
                }
            }
            if (!quotes) quotes = SERENIX_DEFAULT_QUOTES;
            if (!esc) esc = ['\\', 'self'];
            
            if (!start) start = 0;
            if ((typeof end === 'undefined') || (end === null) || (end === '') || (end === false) || (end < 0)) {
                end = sval.length;
            }
            try {
                var full = end === sval.length, m;
                var str = full ? sval: sval.substring(start, end), re;
                for (var i = 0, n = quotes.length, q; i < n; i++) {
                    re = getQuotedStringRe((q = quotes[i]), esc, "", full);
                    if ((m = str.match(re)) !== null) {
                        m = m[0];
                        return this.unescapeQString(m.substring(1, m.length - 1), q, esc);
                    }
                }
            } catch (ex) {
                var s = sval[start],
                    e = sval[end - 1];
                for (var i = 0, n = quotes.length, q; i < n; i++) {
                    if (s === (q = quotes[i]) && e === q) {
                        return sval.substring(start + 1, end - 1);
                    }
                }
            }
            return null;
        },
        /**
         * 
         * @param {String} sval
         * @param {type} type
         * @returns {Number|Date|Regex|Boolean|String}
         */
        stringToValue: function (sval, type) {
            function toVal(sval, _this) {
                var s = sval.trim();
                //"\/Date(1234656000000)\/"
                if (s.startsWith("\\/Date(") && s.endsWith(")\\/")) {
                    var _v = sval.substring(7, end - 2).trim(), 
                        dt = toInteger(_v);
                
                    if (Number.isNaN(dt)) {
                        if ((_v.startsWith("\"") && sval.endsWith("\"")) 
                                || (_v.startsWith("\"") && sval.endsWith("\""))) {
                            _v = v.substring(1, _v.length - 1);
                        }
                        v = new Date(_v);
                    } else {
                        v = new Date(dt);
                    }
                } else if ((s.startsWith("\\/Regex(") || s.startsWith("\\/regex(")) && s.endsWith(")\\/")) {
                    return new RegExp(s.substring(8, end - 2));
                } else if ((v = _this.getQStringValue(sval)) === null) {
                    var f = parseFloat(sval);
                    if (!Number.isNaN(f)) {
                        v = f;
                    } else {
                        //TODO: parse an evaluate expression
                        v = sval;
                    }
                }
                return v;
            }
            function className(name) {
                if (name === 'date')
                    return 'Date';
                if (name === 'regex' || name === 'regexp' || name === 'Regexp')
                    return 'Regex';
                return name;
            }
            var v = sval;
            var start = 0, end = sval.length - 1 ;
            if (!type) {        
                return toVal(sval, this);
            }
            if (typeof type === 'string') {
                var ltyp = type.toLowerCase();
                if (globalNS.SereniX && SereniX.types.Number) {
                    if (SereniX.types.Number.isValidType(ltyp)) {
                        return SereniX.types.Number.valueFromString(sval, ltyp);
                    }
                }
                if (ltyp === 'boolean') {
                    return toBool(sval); 
                }
                var ps = this.TYPE_DEFAULT_PATTERNS[ltyp];
                if (!ps) {            
                    switch(ltyp) {
                        case 'date':
                            return this.getDate(sval);
                        case 'datetime':
                           return this.getDatetime(sval);
                        case 'time':
                            return this.getTime(sval);
                    }
                    return toVal(sval, this);
                }
                if (!isArray(ps)) {
                    ps = [ ps ];
                }
                var b, e, cls, cname;
                for (var i = 0, n = ps.length, p; i < n; i++) {
                    p = ps[i];
                    if (isArray(p)) {
                        b = p[0]||"";
                        e = p[1]||"";                
                    } else {
                        b = p.start||p.begin||"";
                        e = p.end||"";
                    }
                    if (b && e) {
                        if ((sval.startsWith(b)) && sval.endsWith(e)) {
                            var _end = b.endsWith("(") || b.endsWith(":")  ? 
                                b.length - 1 : (b.endsWith(": ") ? b.length - 2 : b.length);
                            cname = className(b.substring(2, _end));
                            cls = globalNS[cname];
                            if (!cls) {
                                cls = SereniX.forName(cname);
                            }
                            return new cls(sval.substring(b.length, sval.length - e.length));
                        }
                    } else if (b) {
                        if (sval.startsWith(b)) {
                            var _end = b.endsWith("(") || b.endsWith(":")  ? 
                                b.length - 1 : (b.endsWith(": ") ? b.length - 2 : b.length);
                            cname = className(b.substring(2, _end));
                            cls = globalNS[cname];
                            if (!cls) {
                                cls = SereniX.forName(cname);
                            }
                            return new cls(sval.substring(b.length, sval.length - e.length));
                        }
                    } else if (e) {
                        //TODO
                    }
                }
                switch(ltyp) {
                    case 'date':
                        var d = new Date(sval);
                        d.setHours(0,0,0,0);
                        return d;
                    case 'datetime':
                        return new Date(sval);
                    case 'time':
                        var t = stringToTime(sval);
                        return t;
                }
            }
            return v;
        },
        /**
         * 
         * @param {String} ltyp  The lowercae type name
         * @returns {Boolean}
         */
        isIntegerType: function(ltyp) {
            return SERENIX_INTEGER_TYPES.indexOf(ltyp) >= 0 || SERENIX_INTEGER_TYPES_MAP[ltyp];
        },
        /**
         * 
         * @param {String} ltyp  The lowercae type name
         * @returns {Boolean}
         */
        isFloatingPointType: function(ltyp) {
            return SERENIX_INTEGER_TYPES.indexOf(ltyp) >= 0 || SERENIX_INTEGER_TYPES_MAP[ltyp];
        },
        /**
         * 
         * @param {String} ltyp  The lowercae type name
         * @returns {Boolean}
         */
        isStringType: function(ltyp) {
            return SERENIX_STRING_TYPE_NAMES.indexOf(ltyp) >= 0;
        },
        /**
         * 
         * @param {String} part     The key part extracted in the string properties
         * @param {String} strProp  The string properties
         * @param {String} key      The property/key name
         * @param {Object} ctx      The context
         * @param {Number|String|Boolean|Object} defaultValue 
         * @returns {Object}
         */
        _getSizedTypeProp: function(part, strProp, key, ctx, defaultValue) {
            var _this = this;
            function newType(name, key, _this, defVal) {
                if (!_this.isValidTypeName(name)) {
                    throw "Invalid type name: '" + name + '\'';
                }
                if (!key || key === 'type') {
                    return typeof defVal === 'undefined' ?  { type: name } : { 
                        type: name, 
                        defaultValue: defVal 
                    };
                }
                var p = typeof defVal === 'undefined' ?  { } : {
                    defaultValue: defVal 
                };
                p[key] = name;
                return p;
            }
            
            function setSizes(_this, prop, type, sizes) {
                if (!sizes || sizes.length === 0) {
                    return prop;
                }
                var ltyp = type.toLowerCase(), s;
                if (_this.isStringType(ltyp)) {
                    if (sizes.length === 1) {
                        s = "" + sizes[0];
                        if (s.endsWith("+")) {
                            prop.minLength = toInteger(s.substring(0, s.length - 1).trim());
                        } else if (s[0] === '<' ){
                            prop.minLength = 0;
                            prop.maxLength = s[1] === '=' ? toInteger(s.substring(0, s.length - 2).trim()) : toInteger(s.substring(0, s.length - 1).trim()) - 1;
                        } else if (s[0] === '>'){
                            prop.minLength = s[1] === '=' ? toInteger(s.substring(0, s.length - 2).trim()) : toInteger(s.substring(0, s.length - 1).trim()) - 1;
                        } else {
                            prop.minLength = 0;
                            prop.maxLength = prop.size = toInteger(sizes[0]);
                        }
                        return prop;
                    } else if (sizes.length === 2) {
                        prop.minLength = (s = sizes[0]) === '' ? 0 : toInteger(s);
                        prop.maxLength = toInteger(sizes[1]);
                        return prop;
                    }
                } else if (_this.isIntegerType(ltyp)) {
                    if (sizes.length === 1) {
                        prop.size = toInteger(sizes[0]);
                        return prop;
                    } else if (sizes.length === 2) {
                        if ((s = sizes[0]) !== '') prop.size =  toInteger(s);
                        if ((s = sizes[1]) !== '') prop.scale =  toInteger(s);
                        return prop;
                    }
                }  else if (_this.isFloatingPointType(ltyp)) { 
                    if (sizes.length === 1) {
                        prop.size = toInteger(sizes[0]);
                        return prop;
                    } else if (sizes.length > 1) {
                        if ((s = sizes[0]) !== null) prop.size =  toInteger(s);
                        if ((s = sizes[1]) !== null) prop.preciion =  toInteger(s);
                        if (sizes.length === 3) {
                            if ((s = sizes[2]) !== null) prop.scale =  toInteger(s);
                        }
                        return prop;
                    }     
                }
                throw "Incorrect number of elements";
            }
            /**
             * 
             * @param {Object} prop 
             * @param {Array} occ 
             */
            function setOccurences(prop, occ) {
                if (!occ || occ.length === 0)
                    return prop;
                var min = 0, max;
                if (occ.length === 1) {
                    min = max =  toInteger(occ[0]);
                } else if (occ.length === 2) {
                    if (occ[0] !== '' && occ[0] !== null) min =  toInteger(occ[0]);
                    if (typeof occ[1] !== 'undefined' && occ[1] !== '' && occ[1] !== null) {
                        max =  toInteger(occ[1]);
                        if (Number.isInteger(min) && Number.isInteger(max)) {
                            if (max < min) {
                                throw new Error("The cardinality min is greater than the cardinality max");
                            }
                        }
                    }
                    
                } else        
                    throw new Error("Incorrect occurences number of elements");
                if ( (max === Number.POSITIVE_INFINITY) || (typeof max === 'undefined') || (max === null) || min > 1 || max > 1 ) {
                    prop = { type: new SereniX.types.Array({
                            itemType: _this.getTypeFromObj(prop),
                            cardMin: min,
                            cardMax : max 
                        }), defaultValue: [], nullable: false };
                } else {
                    if (min === 0) {
                        prop.nullable = true;
                    }            
                }
                return prop;
            }
            
            function intArray(arr) {
                arr.forEach(function(e, i, arr) {
                    e = e.trim();
                    arr[i] = e === '' ? Number.POSITIVE_INFINITY : toInteger(e);
                });
                return arr;
            }
            
            var tname, //the type name
                i = part.indexOf('(');
            if (i === 0) {
                throw "Invalid property name: '" + strProp + '\'';
            }
            var sizes, //sizes restriction of the type
                occ = false, //occurrences of the type
                p;
            var len = part.length;
            if (i > 0) {
                p = part.indexOf(')', i + 1);
                if (p < 0)
                    throw "Invalid property name: '" + part + '\'';
                tname = part.substring(0, i).trim();
                sizes = intArray(part.substring(i + 1, p).trim().split(/\s*,\s*/));
                i = ++p;
                
                for (; p < len; p++) {
                    if (" \t\n\r\b\0".indexOf(part[p]) < 0) break;
                }
                if (p < len) {
                    if (!ctx.cardinality) {
                        if (part[p] !== '{')
                            throw "Invalid property declaration: '" + strProp + '\'';
                        i = part.indexOf('}', ++p);
                        if (i < 0 || (i !== len - 1)) {
                            throw "Invalid property declaration: '" + strProp + '\'';
                        }
                        occ = intArray(part.substring(p, i).trim().split(/\s*,\s*/));
                    }
                }
                
            } else if (!ctx.cardinality) {  
                p = part.indexOf('{');
                if (p === 0) {
                    throw "Invalid property name: '" + strProp + '\'';
                }
                if (p < 0) {
                    tname = part.trim();
                } else {
                    tname = part.substring(0, p).trim();
                    i= part.indexOf('}', ++p);
                    if (i < 0 || (i !== len - 1)) {
                        throw "Invalid property declaration: '" + strProp + '\'';
                    }
                    occ = intArray(part.substring(p, i).trim().split(/\s*,\s*/));
                }
            }
            if (ctx.cardinality) {
                tname = part.trim();
                switch(ctx.cardinality) {
                    case '?':
                        occ = [0, 1];
                        break;
                    case '*':
                        occ = [0, Number.POSITIVE_INFINITY];
                        break;
                    case '+':
                        occ = [1, Number.POSITIVE_INFINITY];
                        break;
                    case '#':
                        occ = [1, 1];
                        break;
                }
            }
            ctx.cardinality = false;    
            return setOccurences(setSizes(this, newType(tname, key, this, defaultValue), tname, sizes), occ);
        },
        NAME_CHARS : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY$_",
        DIGITS: "0123456789",
        SPACES: " \t\n\r\b\0",
        MODIFIERS: {
            visibility : ['p', 'private', 'P', 'protected', 'public', '#'], 
            delimiter : ':', 
            terminators : ':/#',
            modifiers : ['p', 'private', 'P', 'protected', 'public', '#', 's', 'static', 'f', 'final'],
            aliases :  {'p': 'private', 'P': 'protected', 's': 'static', 'f': 'final'}
        },
        /**
         * 
         * @param {type} strProp
         * @param {type} i
         * @param {type} n
         * @param {type} close
         * @returns {Array}
         */
        readSizeNumber: function (strProp, i, n, close) {
            if (!close) { close = ')'; }
            var ch, ofs = i, digits = this.DIGITS, spaces = this.SPACES;
            while (i < n) {
                ch = strProp[i];
                if (digits.indexOf(ch) >= 0) {
                    i++;
                } else if (ch === '.') {
                    unexpectedChar(ch, i); //throw exception
                } else if (spaces.indexOf(ch) >= 0) {
                    i = this.skipSpaces(strProp, i + 1, n);   
                    if (i >= n) {
                        break;
                    }
                    ch = strProp[i];
                    if (ch === ',' || ch === close || ch === '+') {
                        return [parseFloat(strProp.substring(ofs, i).trim()), i];
                    }
                    unexpectedChar(ch, i); //throw exception
                } else if (ch === ',' || ch === close || ch === '+') {
                    return [parseFloat(strProp.substring(ofs, i)), i];
                } else {
                    unexpectedChar(ch, i); //throw exception
                }
            }
            unexpectedEnd(); //throw exception
        },
            
        __readSize: function (close, minLabel, maxLabel,prop, strProp, i, n ) {
            var num, max, digits = this.DIGITS, spaces = this.SPACES, ch;
            if (digits.indexOf(strProp[i]) >= 0) {
                num = this.readSizeNumber(strProp, i, n, close), max;
                i = num[1];
                num = num[0];
                ch = strProp[i];
                if (ch === ',') {
                    i = this.skipSpaces(strProp, i + 1, n);
                    if (strProp[i] === close) {
                        prop[minLabel] = num;
                    } else {
                        max = this.readSizeNumber(strProp, i, n, close);
                        i = max[1];
                        max = max[0];
                        if (i >= n) { throw "Unepected end"; }
                        if (strProp[i] !== close) {
                            throw "Unepected character";
                        }
                        prop[minLabel] = num;
                        prop[maxLabel] = max;
                    }
                } else if (ch === '+') {
                    i = this.skipSpaces(strProp, i + 1, n);
                    if (i >= n) { throw "Unepected end"; }
                    if (strProp[i] !== close) {
                        throw "Unepected character";
                    }
                    prop[minLabel] = num;
                } else if (ch === close) {
                    prop[maxLabel] = num;
                    if (prop[minLabel] === undefined) {
                        prop[minLabel] = num;
                    }
                }
            } else if (ch === ',') {
                i = this.skipSpaces(strProp, i + 1, n);
                max = this.readSizeNumber(strProp, i, n, close);
                i = max[1];
                max = max[0];
                if (i >= n) { throw "Unepected end"; }
                if (strProp[i] !== close) {
                    throw "Unepected character";
                }
                prop[maxLabel] = max;
            }
            return this.skipSpaces(strProp, i + 1, n);
        },
        /**
         * 
         * @param {type} str
         * @param {Number} i
         * @param {Number} n
         * @returns {Number}
         */
        skipComments: function (str, i, n) {
            while (i < n) {
                if (str.startsWith("//", i)) {
                    var nl = /\n|\r(?:\n)?/g;
                    if (nl.exec(str, i)) { 
                        i = this.skipSpaces(str, nl.lastIndex, n);
                    } else {
                        return n;
                    }
                } else if (str.startsWith("/*", i)) {
                    var p = str.indexOf("*/", i + 2);
                    if (p < 0) {
                        throw new Error("Unexpected string '/*' at index " + i);
                    }
                    i = this.skipSpaces(str, p + 2, n);
                } else {
                    return i;
                }
            }
        },
        /**
         * 
         * @private
         * @param {String} str
         * @param {unsigned int} i
         * @param {unsigned int} n
         * @returns {Object}
         */
        parseObject: function(str, i, n) {
            var _this = this;
            var skipComments = this.skipComments;
            function end(obj) {
                if (!obj) {
                    obj = {};
                }
                // skip character '}' and spaces
                i = skipComments(str, _this.skipSpaces(str, i + 1, n), n);
                return {object: obj, i: i};
            }

            function processSimplifiedEntry() {
                if (str[i] === '(') {
                    throw new Exception("Simplified function syntax not yet supported");
                }
                obj[key] = SereniX_forname(key);
            }
            function readKey() {
                if (['"', "'"].indexOf(str[i]) >= 0) {
                    return readQuotedString();
                } else if (NAME_START_CHARS.indexOf(str[i]) >= 0) {
                    var ofs = i, n = str.length;
                    i++;
                    for (;i<n;i++) {
                        if (NAME_CHARS.indexOf(str[i]) < 0) {
                            key = str.substring(ofs, i);
                            //
                            i = skipComments(str, _this.skipSpaces(str, i, n), n);
                            return key;
                        }
                    }
                    unexpectedEnd();
                } else {
                    unexpectedChar();
                }
            }
            function readQuotedString() {
                var qt = str[i], ch, ofs = ++i, result = "";
                var escaped = { 'n' : '\n', 't': '\t', 'v': '\v', 'b' : '\b', '0': '\0' };
                for (; i < n; i++) {
                    ch = str[i];
                    if (ch === '\\') {
                        if (i + 1 < n) {
                            ch = str[i + 1];
                            if (ch === qt || ch === '\\') {
                                result += str.substring(ofs, i) + ch;
                                ofs = ++i;
                            } else if ('ntvb0'.indexOf(ch) >= 0  ) {
                                result += str.substring(ofs, i) + escaped[ch];
                                ofs = ++i;
                            }
                        }
                    } else if (ch === qt) {
                        if (i + 1 < n && str[i + 1] === qt) {
                            result += str.substring(ofs, i) + qt;
                            ofs = ++i;
                        } else {
                            result += str.substring(ofs, i);
                            //skip quote, spaces and comments
                            i = skipComments(str, _this.skipSpaces(str, i + 1, n), n);
                            return result;
                        }
                    }
                }
                throw new Error("Unexpected end");
            }
            function readValue() {
                var ofs = i, decimal = false, end;
                var ch = str[i], digits = "0123456789";
                if (digits.indexOf(ch) >=0) {            
                    for (i++; i < n; i++) {
                        ch = str[i];
                        if (ch === '.') {
                            if (decimal) {
                                throw new Error("Unexpected character '.' at index " + i);
                            }
                        } else if (",} \t\v\b\0\n\r".indexOf(ch) >= 0) {
                            end = i;
                            i = _this.skipSpaces(str, i, n);
                            i = skipComments(str, i, n);
                            return parseFloat(str.substring(ofs, end));
                        } else if (digits.indexOf(ch) < 0) {
                            throw new Error("Unexpected character '" + ch + "' at index " + i);
                        }
                    }
                } else if (['\'', '"'].indexOf(ch) >=0) {
                    return readQuotedString();
                } else if (NAME_START_CHARS.indexOf(ch) >= 0) {
                    var result = _this.processTypeName(str, i, n);
                    if (!result) {
                        throw new Error("Incorrect value");
                    }
                    i = _this.skipSpaces(str, result[1], n);
                    return SereniX_forname(result[0]);
                } else if (ch === '{') {
                    var o = _this.parseObject(str, i, n);
                    i = _this.skipSpaces(str, o.i, n);
                    return o.object;
                } else if (ch === '[') {
                    throw new Error("Parse array not yet supported");
                    //return _this.parseArray(str, i, n);
                }
            }
            
            function processKeyDelim() {
                //
                i = skipComments(str, _this.skipSpaces(str, i + 1, n), n);
                if (!(value = readValue())) {
                    throw new Error("Incorrect object expression");
                }
            }
            var NAME_START_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
            var NAME_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
            var key, obj = {};
            // skip character '{' and spaces
            i = _this.skipSpaces(str, i + 1, n); 
             
            i = skipComments(str, i, n);
            if (i < n && str[i] === '}') {
                return end();
            }
            var value;
            while (i < n) {
                if ((key = readKey())) {
                    if (i >= n) {
                        unexpectedEnd();
                    }
                    i = skipComments(str, i, n);
                    // entry key delimiter (keyDelim) in javacript is character ':'
                    if (str.startsWith(':', i)) { 
                        //skip the key delimiter and process the entry value : the  
                        //character ',' or '}' ended the expression of the value
                        processKeyDelim();                     
                    } else {
                        //1- when str[i] === '(' process function parameters, body and
                        //   return type : the function name is the value of key if 
                        //   qkey is not a quoted string or "" otherwise
                        //2- when str[i] is character ',' or '}' the value is a 
                        //variable with name equals to key if qkey is not a quoted 
                        //string or otherwise a 'Not supported yet' exception is 
                        //thrown
                        processSimplifiedEntry();
                    }
                    obj[key] = value;                
                    //by default the entry closer is ','
                    if (str.startsWith(',', i)) {
                        // skip entry stop ',' for example
                        i = _this.skipSpaces(str, i + 1, n);
                        i = skipComments(str, i, n);
                        if (str.startsWith('}', i)) {
                            return end(obj);    
                        }
                    } else if (str.startsWith('}', i)) {
                        return end(obj);    
                    } else {
                        //throw "Unepected character" exception
                        unexpectedChar(str[i], i, "Unexpected character: expecting ',' or '}'");
                    }
                } else {
                    throw new Error("Incorrect object expression. Expected object key/name, found character '" + str[i] + "'" );
                }
            }

            unexpectedEnd();
        },
        /**
         * 
         * @param {type} typeObj
         * @param {type} strProp
         * @param {type} i
         * @param {type} n
         * @returns {KlassUtils@call;skipSpaces}
         */
        readTypeCallArgs: function(typeObj, strProp, i, n) {
            // charcater '(' and spaces already skipped
            
            var obj = this.parseObject(strProp, i, n);
            typeObj.typeCallArgs = obj.object;
            i = this.skipComments(strProp, this.skipSpaces(strProp, obj.i||obj.index, n), n);
            if (strProp[i] !== ')') {
                throw expectedChar(')', i);
            }
            return i = this.skipComments(strProp, this.skipSpaces(strProp, i + 1, n), n);
        },
        /**
         * 
         * @param {type} prop
         * @param {type} strProp
         * @param {type} i
         * @param {type} n
         * @returns {KlassUtils@call;skipSpaces}
         */
        readSizes: function (prop, strProp, i, n) {
            // charcater '(' and spaces already skipped
            
            
            var digits = this.DIGITS, spaces = this.SPACES;
            if (i >= n) {
                unexpectedEnd();
            }
            var ch = strProp[i], add = 0;
            if (digits.indexOf(ch) >= 0) {
                return this.__readSize(')', 'minLength', 'maxLength', prop, strProp, i, n );
            }
            var num;
            if (ch === '<') { //
                if ((i + 1) < n && strProp[i + 1] === '=') {
                    i++;
                } else {
                    add = -1;
                }
                num = this.readSizeNumber(strProp, this.skipSpaces(strProp, i + 1, n), n);
                prop.maxLength = num[0] + add;
            } else if (ch === '>') {
                if ((i + 1) < n && strProp[i + 1] === '=') {
                    i++;
                } else {
                    add = 1;
                }
                num = this.readSizeNumber(strProp, this.skipSpaces(strProp, i + 1, n), n);
                prop.minLength = num[0] + add;
            } else if (ch === ',') {
                num = this.readSizeNumber(strProp, this.skipSpaces(strProp, i + 1, n), n);
                prop.maxLength = num[0] + add;
            } else {
                unexpectedChar(ch, i); //throw "Unexpected character";
            }
            i = num[1];
            if (i >= n) {
                unexpectedEnd();
            }
            if (strProp[i] !== ')') {
                unexpectedChar(ch, i); //throw "Unexpected character";
            }
            return  this.skipSpaces(strProp, i + 1, n);
        },
        /**
         * 
         * @param {Object} prop
         * @param {type} strProp
         * @param {type} i
         * @param {type} n
         * @returns {Number}
         */
        readOccurences: function(prop, strProp, i, n) {
            var p = this.__readSize('}', 'cardMin', 'cardMax',prop, strProp, i + 1, n );
            if (prop.cardMin > 1 || prop.cardMax === undefined || prop.cardMax === null || prop.cardMax > 1) {
                var t = new SereniX.types.Array({ cardMin : prop.cardMin||0, cardMax : prop.cardMax, itemType: KlassUtils.getType(prop) });
                try { delete type.cardMin; } catch(e) {};
                try { delete type.cardMax; } catch(e) {};
                prop = t;
                t.syntax = "cardinality";
            } else {
                prop.nullable = type.cardMin === 0;
            }
            return [prop, p];
        },

        processCardinality: function(strProp, i, n, ctx, sized, cardinality, symbol, typeName, refType) {
            if (cardinality || (sized === 2)) {
                unexpectedChar(symbol, i); //throw "Unexpected character: '" + ch + "' at index " + i;
            }
            ctx.type = this._getTypeObject(
                strProp, 
                ctx.ofs, //context with type name offset
                ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos, //type name end index
                sized, 
                ctx,
                symbol, //cardinality character symbol
                refType);    
            return ctx.ofs = this.skipSpaces(strProp, i + 1, n);
        },
        CLASS_PARAMETER_TYPE_SYMBOLS: Klass.CLASS_PARAMETER_TYPE_SYMBOLS
    }
);


/**
 * 
 * @param {char|String|Array&lt;char&gt;} qt
 * @param {type} esc
 * @param {type} modifiers
 * @param {type} full
 * @returns {RegExp}
 */
KlassUtils.getQuotedStringRe = getQuotedStringRe;

KlassUtils.getSQuotedStringRe = getSQuotedStringRe;

/**
 * 
 * When KlassUtils.expressionProcessor is a plain object, 
 * KlassUtils.expressionProcessor.process mustbe a function/method
 * @type {Function|Object|undefined|null}
 */
KlassUtils.expressionProcessor = null;
/**
 * 
 * @param {type} val
 * @param {type} type
 * @returns {type}
 */
KlassUtils.getValue = function(val, type) {
    if (!type) {
        return val;
    }
    if (typeof type === 'string') {
        switch(type) {
            case "date":
            case "datetime":
            case "Date":
            case "Datetime":
            case "DateTime":
                return val instanceof Date ? val : new Date(val);
            case "number":
            case "numeric":
            case "decimal":
                if (typeof val === 'number') {
                    return val;
                }
                if (val instanceof String) {
                    val = val.valueOf();
                }
                if (typeof val === 'string') {
                    return parseFloat(val, 10);
                }
                if (val instanceof Date) {
                    return val.getTime();
                }
                throw new Error("Incorrect value");
        }
    } else if (typeof type === 'function') {
        if (val instanceof type) {
            return val;
        }
        return new type(val);
    }
    
    //TODO
    
    return val;
};
/**
 * 
 * @param {string} str
 * @param {Number} i
 * @param {Number} n
 * @returns {Array}
 */
KlassUtils.processTypeName = function(str, i, n) {
    var re = new XRegExp("[a-zA-Z$_][a-zA-Z$_]*(?:[.][a-zA-Z$_][a-zA-Z$_]*)*", "g");
    re.lastIndex = i;
    var match;
    if ((match = re.exec(str, i, 'sticky'))) {
        return [match[0], re.lastIndex];
    }
    return null;
};

KlassUtils.processValues = function(str, i, n, type) {
    var ch;
    var letters = this.NAME_CHARS,
            digits= this.DIGITS,
            K = this;
    function readName() {
        var ofs = i, end;
        for (;i < n; i++) {
            ch = str[i];
            if (" \t\v\b\0\n\r".indexOf(ch) >= 0) {
                end = i;
                i = K.skipSpaces(str, i + 1, n);
                if (str[i] !== ':') {
                    throw new Error("Expected character ':' at index " + i);
                }
                i = K.skipSpaces(str, i + 1, n);
                return str.substring(ofs, end);
            } else if (ch === ':') {
                if (ofs < i) {
                    end = i;
                    i = K.skipSpaces(str, i + 1, n);
                    return str.substring(ofs, end);
                } else {
                    throw new Error("Expected character ':' at index " + i);
                }
            } else if ((digits.indexOf(ch) >=0 && ofs === i) || letters.indexOf(ch) < 0) {
                throw new Error("Expected character '{' at index " + i);
            }
        }
    };
    function readValue(typ) {
        if (arguments.length === 0) {
            typ = type;
        }
        var ofs = i, decimal = false, end;
        ch = str[i];
        if (digits.indexOf(ch) >=0) {            
            for (i++; i < n; i++) {
                ch = str[i];
                if (ch === '.') {
                    if (decimal) {
                        throw new Error("Expected character '.' at index " + i);
                    }
                } else if (" \t\v\b\0\n\r".indexOf(ch) >= 0) {
                    if (ofs >= i) {
                        throw new Error("Expected character ':' at index " + i);
                    }
                    end = i;
                    i = this.skipSpaces(str, i + 1, n);
                    if (str[i] !== ',' && str[i] !== '}') {
                        throw new Error("Expected character ',' or '}' at index " + i);
                    }
                    return K.getValue(parseFloat(str.substring(ofs, end)), typ);
                } else if (ch === ',' || ch === '}') {
                    if (ofs < i) {
                        return K.getValue(parseFloat(str.substring(ofs, i)), typ);
                    } else {
                        throw new Error("Expected character ':' at index " + i);
                    }
                } else if (digits.indexOf(ch) < 0) {
                    throw new Error("Expected character '" + ch + "' at index " + i);
                }
            }
        } else if (['\'', '"'].indexOf(ch) >=0) {
            var qt = ch, ofs = ++i, result = "";
            var escaped = { 'n' : '\n', 't': '\t', 'v': '\v', 'b' : '\b', '0': '\0' };
            for (; i < n; i++) {
                ch = str[i];
                if (ch === '\\') {
                    if (i + 1 < n) {
                        ch = str[i + 1];
                        if (ch === qt || ch === '\\') {
                            result += str.substring(ofs, i) + ch;
                            ofs = ++i;
                        } else if ('ntvb0'.indexOf(ch) >= 0  ) {
                            result += str.substring(ofs, i) + escaped[ch];
                            ofs = ++i;
                        }
                    }
                } else if (ch === qt) {
                    if (i + 1 < n && str[i + 1] === qt) {
                        result += str.substring(ofs, i) + qt;
                        ofs = ++i;
                    } else {
                        result += str.substring(ofs, i);
                        i = K.skipSpaces(str, i + 1, n);
                        return K.getValue(result, type);
                    }
                }
            }
            throw new Error("Unexpected end");
        } else if (letters.indexOf(ch) >= 0) {
            var result = K.processTypeName(str, i, n);
            if (!result) {
                throw new Error("Incorrect value");
            }
            i = K.skipSpaces(str, result[1], n);
            return K.getValue(SereniX_forname(result[0]), type);
        }
    } //end readValue
    
    function endInterval(open, min) {
        i = K.skipSpaces(str, i + 2, n);
        var max, close = true;
        if (str[i] !== ']' || str[i] !== '[') {
            max = readValue(""), close;
            if (str[i] === ']') {
                close  = true;
            } else if (str[i] === '[') {
                close = false;
            } else {
                throw new Error("Expected string '..' at index " + i);
            }
        }
        i = K.skipSpaces(str, i + 1, n);
        return [ { type: 'interval', min : min, minInclude : open, max: max, maxInclude: close }, i ];
    } //end endInterval
    
    ch = str[i];
    if (ch === ']') {
        i = this.skipSpaces(str, i + 1, n);
        var min = readValue("");
        if (!str.startsWith("..", i)) {
            throw new Error("Expected string '..' at index " + i);
        }
        return endInterval(true, min);
    }
    var value, closer;
    var list;
    if (ch === '[') {
        i = this.skipSpaces(str, i + 1, n);
        value = readValue("");
        if (str.startsWith("..", i)) {
            return endInterval(false, value);
        } else if (str[i] === ',') {
            list = [value];
            closer = ']';
        } else {
            throw new Error("Expected string '..' or ',' at index " + i);
        }
    } else if (ch !== '{') {
        throw new Error("Expected character '{' at index " + i);
    }
    
    i = this.skipSpaces(str, i + 1, n);
    var name, p = i, listType, field;
    
    if (ch === '[') {
        listType = 'enum';
        field = 'values';
    } else {
        try {
            name = readName();
        } catch (e) {
            i = p;
            closer = '}';
            list = [];
            listType = 'set';
            field = 'tokens';
        }
    }
    if (list) {
        while (i < n) {
            list[list.length] = readValue("");
            ch = str[i];
            if (ch === closer){
                i = this.skipSpaces(str, i + 1, n);
                values = { type: listType};
                values[field] = list;
                return [ values, i ];
            }
            if (ch !== ',') {
                throw new Error("Unexpected character '" + ch + "'");
            }
            i = this.skipSpaces(str, i + 1, n);
        }
        throw new Error("Unexpected end");
    }
    var values = {};
    while (i < n) {
        values[name] = readValue();
        ch = str[i];
        if (ch === '}'){
            i = this.skipSpaces(str, i + 1, n);
            return [ { type: 'enum', values : values }, i ];
        }
        if (ch !== ',') {
            throw new Error("Unexpected character '" + ch + "'");
        }
        i = this.skipSpaces(str, i + 1, n);
        name = readName();
    }
    throw new Error("Unexpected end");
};
/**
 * 
 * <ul>
 * <li>If the KlassUtils.expressionProcessor is defined and it's a function, it 
 * will be used to extract and evaluate the default value.</li>
 * <li>If the KlassUtils.expressionProcessor is defined and it's a plain object 
 * with KlassUtils.expressionProcessor.process that is a function/method, 
 * KlassUtils.expressionProcessor.process will be used to extract and evaluate 
 * the default value.</li>
 * </ul>
 * @param {String} str
 * @param {unsigned int} offset
 * @param {unsigned int} n
 * @param {Array&lt;String&gt;} closer
 * @returns {String|Date|String|int|null|Number|Boolean|Object|Function}
 */
KlassUtils.processExpression = function(str, offset, n, closer) {    
    var i, len = n, closer;
    if (arguments.length > 1) {
        if (Number.isInteger(arguments[1])) {
            i = parseInt(offset);
            if (arguments.length > 2) {
                if (Number.isInteger(n)) {
                    len = parseInt(n);
                    if (arguments.length > 3) {
                        if (typeof arguments[3] === 'string' && arguments[3]) {
                            closer = [ arguments[3] ];            
                        } else if (isArray(arguments[3])) {
                            closer = arguments[3];
                        }
                    }
                } else if (typeof arguments[2] === 'string' && arguments[2]) {
                    closer = [arguments[2]];
                }  else if (isArray(arguments[2])) {
                    closer = arguments[2];
                }               
            } 
        } else if (typeof arguments[1] === 'string' && arguments[1]) {
            closer = [ arguments[1] ];            
        }  else if (isArray(arguments[1])) {
            closer = arguments[1];
        }
    }
    if (typeof i === 'undefined' || i === null) {
        i = 0;
    }
    if (typeof len === 'undefined' || len === null) {
        len = str.length;
    }
    
    i = this.skipSpaces(str, i, len);
    if (typeof this.expressionProcessor === 'function') {
        return this.expressionProcessor(str, i, len, closer);
    }
    if (isPlainObject(this.expressionProcessor) && typeof this.expressionProcessor.process === 'function') {
        return this.expressionProcessor.process(str, i, len, closer);
    }
    
    if (closer.indexOf(str[i]) >= 0) {
        return [null, i];
    }
    var ctx = { stop: closer, offset : i, parameterTypeSymbol: '@'},
        expr = ExpressionParser.parse(str, ctx);
    if (!expr) {
        throw "No match";
    }
    return [expr, ctx.index];
};


/**
 * 
 * @param {String} strProp
 * @param {int} offset
 * @param {int} i
 * @param {type} closer
 * @returns {Object}
 */
KlassUtils.getPropFromString = function (strProp, offset, i, closer) {
    var ctx;
    if (arguments.length === 3) {
        if (typeof arguments[1] === "object") {
            ctx = arguments[1];
            if (typeof arguments[2] === "number") {
                offset = i = arguments[2];
                closer = [];
            } else if (isArray(arguments[2])) {
                offset = ctx.offset||ctx.index||ctx.i||0;
                i = ctx.index||ctx.i||ctx.offset||0;
                closer = arguments[2];
            } else {
                offset = ctx.offset||ctx.index||ctx.i||0;
                i = ctx.index||ctx.i||ctx.offset||0;
                closer = arguments[2];
            }
        } else if (isArray(arguments[1])) {
            offset = i = 0;
            closer = arguments[1];
        }
    }
    
    var letters = this.NAME_CHARS,
            digits= this.DIGITS,
            visibility, 
            delimiter, 
            terminators,
            modifiers = this.MODIFIERS,
            aliases;
    if (modifiers) {
        visibility = modifiers.visibility||"", 
        delimiter = modifiers.delimiter, 
        terminators = modifiers.terminators,
        aliases = modifiers.aliases||{},
        modifiers = modifiers.modifiers;        
    }
    
    function readName(prop, strProp, i, n, _this) {
        
        var ofs = i, ch = strProp[i++] ;
        if (letters.indexOf(ch) < 0) {
            throw "Unepected character";
        }
        for (; i < n; i++) {
            ch = strProp[i];
            if (letters.indexOf(ch) < 0 && digits.indexOf(ch) < 0) {
                break;
            }
        }
        prop.name = strProp.substring(ofs, i);
        if (prop.name === 'collaborators') {
            console.log("prop.name => collaborators");
        }
        if (prop.name === 'projects') {
            console.log("prop.name => projects");
        }
        return _this.skipSpaces(strProp, i, n);
    }
    /**
     * reads the modifiers and the name of the property from the given string 
     * representation of the property.
     * @private
     * @param {Object} prop    The property to set from it's given string 
     *     representation
     * @param {String} strProp  property string to parse
     * @param {Number} i  The offset index/position
     * @param {Number} n  The length of the string representation
     * @param {Object} _this
     * @returns {unresolved}
     */
    function readModifiedProp(prop, strProp, i, n, _this) {
        var ofs = i, ch = strProp[i++];
        if (letters.indexOf(ch) < 0) {
            throw "Unepected character";
        }
        var name, 
            _visibility= false, lastDelim;
    
        function checkDelim() {
            if (modifiers.indexOf(name) < 0) {
                if (ofs >= i)
                    throw "Unexpected character";
            }
            if (i + 1 >= n) {
                unexpectedEnd();
            }
            if (letters.indexOf(strProp[i + 1]) < 0) {
                unexpectedChar(ch, i + 1);
            }
        }
        function checkEnd() {
            if (modifiers.indexOf(name) < 0) {
                throw "Unepected character";
            }
            
        }
        function checkVisibility(tok) {
            if (visibility.indexOf(tok) >= 0) {
                if (_visibility) {
                    throw "Too many visibility modifiers: " + tok;
                } else {
                    _visibility = true;
                }                
            }
        }
        function processModif(check) {
            if (modifiers.indexOf(name) < 0) {
                var n = name.length, _ch;
                for (var i = 0; i < n; i++) {
                    _ch = name[i];
                    if (modifiers.indexOf(_ch) < 0) {
                        throw new Error("Unexpected character: '" + _ch + "'");
                    }
                    checkVisibility(_ch);
                    prop.modifiers[prop.modifiers.length] = aliases[_ch]||_ch;
                }
            }
            check();
            checkVisibility(name);
            prop.modifiers[prop.modifiers.length] = aliases[name]||name;
        }
        
        for (; i < n; i++) {
            ch = strProp[i];
            if (ch === delimiter) {
                name = strProp.substring(ofs, i);
                processModif(checkDelim);
                ofs = i + 1;  
                lastDelim = ch;
            } else if (terminators && terminators.indexOf(ch) >= 0) {                
                if (ofs < i) {
                    name = strProp.substring(ofs, i);
                    if (name === 'collaborators') {
                        console.log("name => collaborator");
                    }
                    processModif(checkEnd);
                }
                checkVisibility(ch);
                return readName(prop, strProp, i + 1, n, _this);;
            } else if (letters.indexOf(ch) < 0 && digits.indexOf(ch) < 0) {
                break;
            }
        }
        if (ofs < i) {
            if (lastDelim && terminators && terminators.indexOf(lastDelim) < 0) {
                throw new Error("Modifier expected. Delimiter '" 
                        + lastDelim 
                        + "' encountered but modifier did not followed");
            }
            prop.name = strProp.substring(ofs, i);
            return _this.skipSpaces(strProp, i, n);
        } else if (i >= n) {
            unexpectedEnd();
        }
        unexpectedChar(ch, i);
    }
    
    
    function readParamType(prop, strProp, i, n, _this) {
        if (i >= n) { return i; }
        var p = psymbols.indexOf(strProp[i]) >= 0 ;
        if (p) {
            prop.parameterType = true;
            return _this.skipSpaces(strProp, i + 1, n);
        }
        return i;
    }
    
    function getSystemDefaultValueCalc(sval) {
        var root, v;
        var re = /^DEFAULT_VALUE_KEYWORDS(?:\.([a-zA-Z-]+)|\[\s*("[a-zA-Z-]+"|'[a-zA-Z-]+')\s*\])$/;
        if (root = re.exec(sval)) {
            v = DEFAULT_VALUE_KEYWORDS[root[1]||root[2]];
            if (v) return v;
            throw new Error("Incorrect system default value key: '" + sval + "'");
        } else {
            v = DEFAULT_VALUE_KEYWORDS[sval];
        }
        if (v) return v;
    }
    
    
    var n = strProp.length, 
            psymbols = (globalNS.SereniX ? SereniX.Klass: Klass).CLASS_PARAMETER_TYPE_SYMBOLS;
    if (arguments.length === 1) {
        offset = i = 0;
        if (i >= n ) {
            throw "Invalid property name";
        }
    }
 
    if (i < 0) {
        var _name = offset <= 0 ? strProp : strProp.substring(offset);
        if (!this.isValidPropertyName(_name)) {
            throw "Invalid property name: '" + _name + '\'';
        }
        return { "name": _name};
    }
    
    var ch, prop = {}, ptype, calc;
    if (modifiers) {
        i = readModifiedProp(prop, strProp, i, n, this);
    } else {
        i = readName(prop, strProp, i, n, this);
    }
    
    if (i < n && ((ch = strProp[i]) !== '<')) {
        // read the character '?' that specify that the property is a class parmeter type.
        ptype = readParamType(prop, strProp, i, n, this); 
        if (ptype !== i) {
            i = ptype;
            if (i < n) {
                ch = strProp[i];
            }
        }
        if (ch === '=') {
            var sval = strProp.substring(this.skipSpaces(strProp, i + 1, n)).trim();
            if (typeof (calc = getSystemDefaultValueCalc(sval)) === 'function') {
                prop.defaultValueCalc = calc;
            } else {
                prop.defaultValue = this.stringToValue(sval);                
            }
            i = n;
            
        }
    } 
    if (i >=n) {
        return prop;
    }
    
    if ( ctx && ctx.closer && ctx.closer.indexOf(strProp[i]) >= 0) {
        ctx.index = ctx.i = this.skipSpaces(strProp, i + 1, n);
        ctx.ch = strProp[i];
        return prop;
    } else {
        var result;
        if (strProp[i] === '<') {           
            result = this.fromString(this.createContext(
                        strProp, 
                        prop,       // the property object
                        i,          //the start index
                        false,      //is property type ?
                        ['\'']      //The closer
                    ), 
                    {}, 
                    'name' //the proprty key name
            );
            i = result.index;
            prop = result.prop;
            if (i < n && strProp[i] === '[') {
                i = this.processComponents(strProp, i, n, prop);       
            }
            if (i < n && ctx && ctx.closer && ctx.closer.indexOf(strProp[i]) >= 0) {
                ctx.index = ctx.i = this.skipSpaces(strProp, i + 1, n);
                ctx.ch = strProp[i];
                return prop;
            }
        } else if ( ctx && ctx.closer && ctx.closer.indexOf(strProp[i]) >= 0) {
            ctx.index = ctx.i = this.skipSpaces(strProp, i + 1, n);
            ctx.ch = strProp[i];
            return prop;
        } else if (i < n && strProp[i] === '[') {
            i = this.processComponents(strProp, i, n, prop); 
            if (i <n && ctx && ctx.closer && ctx.closer.indexOf(strProp[i]) >= 0) {
                ctx.index = ctx.i = this.skipSpaces(strProp, i + 1, n);
                return prop;
            }
        } else {
            throw unexpectedChar(strProp[i], i);
        }
        
        
        if (i < n) {
            throw new Error("Incorrect property string representation: \"" 
                    + strProp + "\".\nUnepected character '" 
                    + strProp[i] + "' at index " 
                    + i + ".");
        }
        if (ctx) {
            ctx.index = ctx.i = i;
        }
        return prop;
    }    
};

KlassUtils.processComponents = function(strProp, i, n, prop) {
    i = this.skipSpaces(strProp, i + 1, n);
    var components = [], ctx = {index: i, i:i, offset:i };
    while (i < n) {
        components[components.length] = this.getPropFromString(strProp, ctx, [',', ']']);
        i = this.skipSpaces(strProp, ctx.index, n);
        if (ctx.ch === ']') {
            return i;
        }
    }
    prop.components = components;
    return i;
};

/**
 * 
 * @param {type} aprop
 * @returns {Object}
 */
KlassUtils.getPropFromArray = function(aprop) {
    var prop = this.getTypeFromArray(aprop, 'type', 1);
    prop.name = aprop[0];
    return prop;
};
/**
 * 
 * @param {Array} atype
 * @param {String} [key='type']
 * @param {int} [offset=0]
 * @returns {Object}
 */
KlassUtils.getTypeFromArray = function(atype, key, offset) {
    if (typeof arguments.length < 3) {
        offset = 0;
    }
    var type = {}, n = atype.length;
    if (!key) {
        key =  "type";
    }
    
    type[key] = atype[offset];
    
    if (n === offset + 5 ) {
        type.values = atype[offset + 1];
        type.defaultValue = atype[offset + 2];
        type.getter = atype[offset + 3];
        type.setter = atype[offset + 4];
        return type;
    }
    
    if (n >= offset + 6 ) {
        type.values = atype[offset + 1];
        type.defaultValue = atype[offset + 2];
        type.check = atype[offset + 3];
        type.getter = atype[offset + 4];
        type.setter = atype[offset + 5];
        return type;
    }
    
    if (n === offset + 2 ) {
        var a = atype[offset + 1];
        if (typeof a === 'function') {
            type.check = a;
        } else if (isArray(a) || (a.type === 'string' && ['enum', 'enumeration', 'interval', 'range', 'set'].indexOf(a.type.toLowerCase()))) {
            type.values = a;
        } else {
            type.defaultValue = a;
        }
        return type;
    }
    
    if (n === offset + 3 && typeof atype[offset + 1] === 'function' &&  typeof atype[offset + 2] === 'function') {
        type.getter = atype[offset + 1];
        type.setter = atype[offset + 2];
        return type;
    }
    
    if (n === offset + 4 && typeof atype[offset + 1] === 'function' &&  typeof atype[offset + 2] === 'function'  &&  typeof atype[offset + 3] === 'function') {
        type.check = atype[offset + 1];
        type.getter = atype[offset + 2];
        type.setter = atype[offset + 3];
        return type;
    }
    
    var a, i = 1;
    if (n > offset + 1) {
        a = atype[1];
        if (isArray(a)) {
            type.values = a;
            i = 2;
            if (n > offset + 2 && typeof atype[offset + 2] === 'function') {                
                type.check = atype[offset + 2];
                i++;
            }
        } else if (typeof a === 'function') {
            type.check = a;
            i = 2;
        } else {
            
        }
    }
    
    return type;
};

KlassUtils.closetTypes = function(ctx, nextStep) {
    if (ctx.step !== 1) {
        unexpectedChar(); //throw "Unexpected character";
    }
    if (ctx.union) {
        ctx.union[ctx.union.length] = ctx.type;
        ctx.prop["types"] = ctx.union;
    } else if (isArray(ctx.types)) {
        ctx.types[ctx.types.length] = ctx.type;
        ctx.prop["types"] = ctx.types;
    } else {
        ctx.prop.type = ctx.type;
    }  
    ctx.step = nextStep;
};
/**
 * 
 * @param {String} strProp  The string where extract the type within a sub string.
 *     <p>The syntax of the sub string:  <b>&lt;type_name&gt;[ '(' ( &lt;size&gt; [ ',' &lt;preciion&gt; ] ')' | ( [ &lt;min_length&gt;  ',' ] &lt;max_length&gt; ) ')' ] [ '{' ( &lt;occurences&gt; | ( &lt;min_occurences&gt; ',' &lt;max_occurences&gt; ) ) '}' ]</b>.</p></p>
 * @param {int} ofs         The offset (start) position of the sub string 
 *     containing the name, size, preciion (decimal/fractions), minimum length 
 *     and/or maximum length of the type
 * @param {int} end         The end position of the sub string containing
 * @param {int} sized       Size informations in the sub string?   
 *      <ul>
 *      <li><b>0</b>: no size information</li>
 *      <li><b>1</b>: size informations (size, precision, scale, minimum size, maximum size) are in the sub string</li>
 *      <li><b>2</b>: occurences informations (occurences, minmimum occurences, maximum occurences) are in the sub string. Size informations can alsobepreents.</li>
 *      </ul>
 * @param {Object} ctx      The context object 
 * @returns {Object}        The type with the informations extracted
 */
KlassUtils._getTypeObject = function (strProp, ofs, end, sized, ctx, cardinality, refType) {
    ctx.cardinality = cardinality;
    var t = strProp.substring(ofs, end).trim();
    if (refType) {
        t = KlassUtils.getRefType(t);
        return cardinality ? this.setCardinality(t, cardinality) : t;
    } else if (sized || cardinality) {
        return this._getSizedTypeProp(t, strProp, "type", ctx);
    } else {            
        if (['*', '+', '?', '#'].indexOf(t) >= 0) {
            t = SereniX.WildcardType.getInstance(t);
        } else if (!this.isValidTypeName(t)) {
            throw new Error("Incorrect type name: '" + t + "'.\nIndex: " + ofs);
        }
        return { "type": t };
    }
};
/**
 * 
 * @param {type} type
 * @param {String} card Cardinality symbol
 * @param {Object} property
 * @returns {SereniX.types.Array|SereniX.types.Type|Object}
 */
KlassUtils.setCardinality = function(type, card, property) {
    if (typeof card === 'string') {
        var typ;
        switch (card) {
            case '+':
                return new SereniX.types.Array({ itemType: type, cardMin: 0, cardMax:  Number.POSITIVE_INFINITY, symbol: '+', syntax: 'cardinality' }); 
            case '*':
                return new SereniX.types.Array({ itemType: type, cardMin: 0, cardMax:  Number.POSITIVE_INFINITY, symbol: '+', syntax: 'cardinality' }); 
            case '?':
            case '#':
                (property ? property : type={type: type}).nullable = card === '?';
                return type;
        }
        throw new Error("Incorrect card: '" + card + "'");
    }
    var min = 0, max;
    if (isArray(card) ) {
        if (!card || card.length === 0)
            return prop;
        
        if (card.length === 1) {
            min = max =  toInteger(card[0]);
        } else if (card.length === 2) {
            if (card[0] !== '' && card[0] !== null) min =  toInteger(card[0]);
            if (typeof card[1] !== 'undefined' && card[1] !== '' && card[1] !== null) {
                max =  toInteger(card[1]);
                if (Number.isInteger(min) && Number.isInteger(max)) {
                    if (max < min) {
                        throw new Error("The card min is greater than the card max");
                    }
                }
            }
            
        } else        
            throw new Error("Incorrect occurences number of elements");
        
    } else {
        min = this.getMin(card);
        max = this.getMax(card);
        if (max < 0) {
            max = Number.POSITIVE_INFINITY;
        }
        if (typeof min === 'undefined' && typeof max ==='undefined') {
            //set the first valid (not null and not undefined) value of the 
            //given propertie names or the value of the last property to min 
            //and max
            // see the function optionsValue and it' alia oval in 
            //the library serenix_object.js
            min = max = oval(card, ['occurrences','count']);
            if (typeof min === 'undefined' || min === null) {
                throw new Error("Incorrect cardinality/occurences");
            }
        }
    }
    if ( (max === Number.POSITIVE_INFINITY) || (typeof max === 'undefined') || (max === null) || min > 1 || max > 1 ) {
        type = { type: new SereniX.types.Array( {itemType: type, cardMin: min||0, cardMax : max }), defaultValue: [], nullable: false };
    } else {
        if (min === 0) {
            (property ? property : type={type: type}).nullable = card === true;
        }            
    }
    return type;
};
/**
 * 
 * @param {type} strProp
 * @param {type} ctx
 * @param {type} end
 * @param {type} sized
 * @param {type} cardinality
 * @param {type} name
 * @param {type} refType
 * @returns {undefined}
 */
KlassUtils.finalizeType = function(strProp, ctx, end, sized, cardinality, name, refType) {
    var _pr;
    if (ctx.ofs < end) {
        _pr = this._getTypeObject(strProp, ctx.ofs, end, sized, ctx, cardinality, refType);
    } else {
        if (ctx.type) {
            _pr = ctx.type;
            ctx.type = null;
        } else {
            _pr = SereniX.types.AnyType.getInstance(); //Any type
        }
        if (cardinality)
            _pr = this.setCardinality(_pr, cardinality);
    }

    if (isArray(ctx.types)) {
        if (_pr) {
            ctx.types[ctx.types.length] = _pr;
        }
        ctx.prop.type["types"] = ctx.types;
        ctx.types = null;
    } else if (isArray(ctx.union)) {
        if (_pr) {
            ctx.union[ctx.union.length] = _pr;
        }
        if (ctx.isPropType || ctx.typeFromString) {
            if ([ 'string', "function" ].indexOf(typeof ctx.prop.type) >= 0) {
                ctx.prop.type = { type: ctx.prop.type };
            }
            if (!ctx.prop.type.paramTypes) {
                ctx.prop.type.paramTypes = [];
            }
            var t = { type: "union", types: ctx.union };
            if (name) {
                t = { name: name, type: t };
            }
            ctx.prop.type.paramTypes[ctx.prop.type.paramTypes.length] = t;
        } else {
            ctx.prop.type = { type: "union", "types": ctx.union, setType: "union" };
        }
        ctx.union = null;
    } else {
        if (ctx.isPropType || ctx.typeFromString) {
            if (!ctx.prop.paramTypes) {
                ctx.prop.paramTypes = [];
            }
            ctx.prop.paramTypes[ctx.prop.paramTypes.length] = name ? { name: name, type: _pr } : _pr;
        } else {             
            var defVal = _pr.defaultValue;
            if (defVal !== undefined) {
                ctx.prop.defaultValue = defVal;
            }
            var v = _pr.nullable;
            if (v === undefined) {
                v = _pr.acceptNull;
                if (v === undefined) {
                    v = _pr.required;   
                    if (v !== undefined) {
                        ctx.prop.nullable = !toBool(v);
                    }
                } else {
                    ctx.prop.nullable = toBool(v);
                }
            } else {
                ctx.prop.nullable = toBool(v);
            }
            var typ = _pr.type, st;
            if (typ === undefined) {
                if (!_pr.typeCallArgs) {
                    _pr.type = _pr.name;
                }
                typ = _pr;
            }
            if (st = this.getSTypeDef(_pr, _pr)) {
                typ = new SereniX.types.SType(st);
            }            
            ctx.prop.type = typ;
        }
    }
};

KlassUtils.close = function(strProp, ctx, i, step, sized, cardinality, typeName, refType, end) {
    function getType(prop) {
        var t = prop.type;
        if (t)
            return t["type"]||t.name;
        return null; 
    }
    
    if (ctx.open !== 1) {
        throw "Unexpectd character '>'";
    }    
    
    if (step !== 5) {
        if (typeof end === 'undefined') {
            end = ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos;
        }
        if (step === 1) { //property or type
            this.finalizeType(strProp, ctx, end, sized, cardinality, typeName, refType);
        } else if (step === 2) { //the default value
            ctx.prop["defaultValue"] = this.stringToValue(
                    strProp.substring(ctx.ofs, end), getType(ctx.prop));
        } else if (step === 3) { //the values
            this.__closeValues(ctx, strProp, end);
            if (ctx.values) {
                ctx.prop.type.values = ctx.values;
            }
        } else if (step === 4) { // ? what element
            if (ctx.ofs < end) {
                ctx.prop.type.what = strProp.substring(ctx.ofs, end);
            }
        }
        if ((i + 1 < ctx.n)  && Klass.CLASS_PARAMETER_TYPE_SYMBOLS.indexOf(strProp[i + 1]) >= 0) {
            if (ctx.isPropType || ctx.typeFromString) {
                throw new Error("Unepected character '" + strProp[i + 1] + "' at index " + (i + 1));
            }
            ctx.prop.parameterType = true;            
            i++;
            ctx.ch = strProp[i];
        } else {
            ctx.ch = '>';
        }
        ctx.step =5;
    } else {
        ctx.ch = '>';
    }
    ctx.i = i = this.skipSpaces(strProp, i + 1, strProp.length);
    ctx.firstSpacePos = -1;    
    ctx.open--;
    
    return ctx.prop;
};


KlassUtils.__closeValues = function(ctx, strProp, end) {
    function getType(prop) {
        var t = prop.type;
        if (t)
            return t["type"]||t.name;
        return null; 
    }
    var tok = strProp.substring(ctx.ofs, end), p = tok.indexOf("..");
    var interval = false, minInclude, maxInclude;

    if (p === 0) {
        end = tok.length;
        if (tok.endsWith("]")) {
            if (tok[tok.length - 2] !== '\\') {
                maxInclude = true;
            }
        } else if (tok.endsWith("[")) {
            if (tok[tok.length - 2] !== '\\') {
                maxInclude = false;
                end--;
            }
        }
        interval = {
            type: 'interval', 
            min : null, 
            max : this.valueFromString(
                tok.substring(p + 2, end), 
                getType(ctx.prop) //ctx.prop.type["type"]
            )
        };
        ctx.values = interval;
    } else if (p > 0) {
        var ofs = 0; 
        end = tok.length;
        if (tok.startsWith("[")) {
            minInclude = true;
            ofs++;
        } else if (tok.startsWith("]")) {
            minInclude = false;
            ofs++;
        }
        end = tok.length;
        if (tok.endsWith("]")) {
            if (tok[tok.length - 2] !== '\\') {
                maxInclude = true;
            }
        } else if (tok.endsWith("[")) {
            if (tok[tok.length - 2] !== '\\') {
                maxInclude = false;
                end--;
            }
        }
        interval = {type: 'interval', 
            min : this.valueFromString(
                tok.substring(ofs, p), 
                getType(ctx.prop) //ctx.prop.type["type"]
            ), 
            max : this.valueFromString(
                tok.substring(p + 2, end), 
                getType(ctx.prop) //ctx.prop.type["type"]
            )
        };
        if (typeof minInclude === 'boolean') {
            interval.minInclude = minInclude;
        }
        if (typeof maxInclude === 'boolean') {
            interval.maxInclude = maxInclude;
        }
    } else {
        if (ctx.values === null) {
            ctx.values = [];
        }
        ctx.values[ctx.values.length] = this.valueFromString(
                tok, 
                getType(ctx.prop) //ctx.prop.type["type"]
        );            
    }
    if (interval !== false) {
        if (!ctx.values) {
            ctx.values = interval;
        } else if (isArray(ctx.values)) {
            ctx.values[ctx.values.length] = interval;
        }
    }
};

KlassUtils.processNewType = function(ctx, i, step, sized, cardinality, typeName) {
    if (step !== 1) {
        throw "Unexpected character '<'";
    }
    ctx.step = step;
    var _type = {}, n = ctx.n ;
    _type = this.fromString(
            this.createContext(ctx.strProp, ctx.ofs, i, true), //The context
            _type, //the reult argument
            'type', // the key : identitifier attribute
            arguments.length > 1 ? sized: false
    );
    ctx.ofs = i = _type.index;
    _type = _type.prop;
    ctx.type = _type;
    ctx.firstSpacePos = -1;
    while (i < n) {
        if (" \t\f\b\0\n\r".indexOf(ctx.strProp[i]) < 0) {
            break;
        }
        i++;
    }
    if (ctx.strProp === "monthNames<Array<String>>") {
        console.log(ctx.strProp + "...");
    }
    
    
    ctx.ofs = i;
    if (i < n) {
        ctx.ch = ctx.strProp[i];
        if (ctx.ch === '|') {
            if (step !== 1) {
                unexpectedChar(ctx.ch); //throw "Unexpected character '" + ctx.ch + "'";
            }
            if (ctx.union === null) {
                ctx.union = [];
            }
            ctx.union[ctx.union.length] = _type;
            ctx.type = null;
            ctx.step = 1;
        } else if (ctx.ch === ',') {
            if (!isArray(ctx.types)) {
                ctx.types = [];
            }
            ctx.types[ctx.types.length] = _type;
            ctx.type = null;
            ctx.step = 1;
        } else if (ctx.ch === '>') {
            ctx.i = i;
            ctx.prop = this.close(ctx.strProp, ctx, i, step, cardinality, typeName);
            return ctx.prop;
        } else if (ctx.ch === ':') {
            ctx.i = i;
            this.closetTypes(ctx, 2);      
        } else if (ctx.ch === '?') {
            ctx.i = i;
            this.closetTypes(ctx, 4);
        } else {
            unexpectedChar(ctx.ch); //throw "Unexpected character '" + ctx.ch + "'";
        }
    } else {
        throw "Unexpected end";
    }
    ctx.firstSpacePos = -1;
    return ctx.type;
};
/**
 * 
 * @param {type} strProp
 * @param {type} i
 * @param {type} n
 * @param {type} ctx
 * @returns {Array}
 */
KlassUtils.processStringPropComment = function(strProp, i, n, ctx) {
    var cmt = "", ch, ofs = i;
    while (i < n) {
        ch = strProp[i];
        if (ch === '>') {
            cmt = strProp.substring(ofs, i);
            ctx.i = ctx.ofs = i;
            return  [cmt.trim(), i];
        } else if (strProp.startsWith('&lt;', i)) {
            cmt = strProp.substring(ofs, i) + '<';
            i += 4;
            ofs = i;
        } else if (strProp.startsWith('&gt;', i)) {
            cmt = strProp.substring(ofs, i) + '>';
            i += 4;
            ofs = i;
        } else if (strProp.startsWith('\\>;', i)) {
            cmt = strProp.substring(ofs, i) + '>';
            i += 2;
            ofs = i;
        } else {
            i++;
        }
    }
    throw new Error("Unexpected end");
};


KlassUtils.skipSpaces = function (str, i, n, spaces) {
    if (arguments.length > 2 && typeof arguments[2] !== 'number') {
        if (typeof arguments[2] !== 'string' && !isArray(arguments[2])) {
            incorrectArgs(); //throw e<ception
        } else {
            spaces = arguments[2];
            n = str.length;
        }
    }
    if (!spaces) {
        spaces = " \t\n\r\b\0";
    }
    while (i < n && spaces.indexOf(str[i]) >= 0) {
        i++;
    }
    return i;
};
/**
 * 
 * @param {String} strProp  The string that represents the definition (metadata) of the property/type.
 * @param {int|Object} o  The offset of property name or type name to extract in the diven string
 * @param {int} i   The end index of the substring that represents the name of the property or the type.
 * @param {Boolean} isPropType Is the property/object to create is a type (definition/metadata)?
 * @param {Boolean} typeFromString
 * @returns {Object}
 */
KlassUtils.createContext = function(strProp, o, i, isPropType, typeFromString ) {
    var ctx = {
        strProp: strProp, 
        n : strProp.length, 
        firstSpacePos : -1, 
        step: 1, 
        types : null, 
        union : null, 
        values : null,
        
    };
    if (typeof o === 'object') {
        ctx.prop = o;
        ctx.nameOffset = -1;
        ctx.nameEnd = i;
    } else {
        ctx.nameOffset = o;
        ctx.nameEnd = i;
    }
    if (arguments.length > 3) {
        ctx.isPropType = toBool(isPropType);
    }
    if (arguments.length > 4) {
        if (isArray(arguments[4])) {
            ctx.closer = arguments[4];
        } else {
            ctx.typeFromString = toBool(typeFromString);
        }
    }
    if (!isPropType && !ctx.typeFromString) {
        if (!ctx.closer) {
            ctx.closer = [];
        }
    }
    return ctx;
};

KlassUtils.getListType = function(prop) {
    var type = prop.type||prop;
    var _type = type.type||type.name;
    if (_type === 'array' || _type === 'Array' || _type === Array) {
        return true;
    }
    var cmin = type.cardMin, cmax = type.cardMax;
    if (Number.isInteger(cmin) && Number.isInteger(cmax) ) {
        if (cmax < cmin) {
            throw "Incorrect cardinalities";
        }
        if (cmin > 1 || cmax > 1) {
            return true;
        }
    }
    if (Number.isInteger(cmin) && (typeof cmax === 'undefined' || cmax === null)) {
        return true;
    }
    if (cmax === Number.POSITIVE_INFINITY) {
        return true;
    }
    return false;
};
/**
 * 
 * @param {String} strProp  The string that represents the definition (metadata) of the property/type.
 * @param {int} offset  The offset of property name or type name to extract in the diven string
 * @param {int} i   The end index of the substring that represents the name of the property or the type.
 * @param {Object} result
 * @param {String} [key="name"]  The string of the identifier attribute of the property or the type.
 * For the property, the only correct value is "name" . For the type it can be 
 * "type" or "name". The prefrered one i "type" to avoid confuion between type 
 * and property.
 * @returns {Object}
 */    
KlassUtils.fromString = function () {
    var strProp, offset, i, result, key, sized, cardinality, args = arguments;
    var ctx,
        pname, 
        n, sizedArg,
        prop,
        isPropType;
    if (typeof args[0] === 'object') {
        ctx = args[0];
        ctx.step = 1;
        isPropType = ctx.isPropType;
        strProp = ctx.strProp, 
        offset = ctx.nameOffset;
        if (offset !== 0 &&  !offset) {
            offset = ctx.offset||0;
        } 
        i = ctx.nameEnd;//ctx.end||ctx.i
        if (i !== 0 &&  !i) {
            i = ctx.end;
            if (i !== 0 &&  !i) {
                i = ctx.i||0;
            } 
        } 
        n = ctx.n;
        
        if (args.length > 4) {
            cardinality = args[4];
        }
        
        if (args.length > 3) {
            sized = args[3];
        }
        if (args.length < 3 ) {
            key = ctx.typeFromString ? 'type' : 'name';
        } else {
            key = args[2];
            if (!key || typeof key !== 'string') {
                key = ctx.isPropType || ctx.typeFromString ? 'type' : 'name';
            }
        }
        
        if (args.length < 2) {
            result = {};
        } else {
            result = typeof args[1] !== 'object' ? {} : args[1];            
        }
        sizedArg = 4;
    } else {
        strProp = args[0], offset = args[1], i = args[2], 
        result = args.length < 4 || typeof args[3] !== 'object' ? {} : args[3], 
        key = args.length < 5 || !args[4] || typeof args[4] !== 'string' ? 'name' : args[4], 
        sized = args[5], 
        cardinality = args[6];

        ctx = { 
            step : 1, 
            types : null, 
            union : null, 
            values : null
        },         
        n = strProp.length;        
        ctx.strProp = strProp;
        sizedArg = 6;
    }
    var step = 1, typeProcessing = ctx.isPropType || ctx.typeFromString;
    if (offset < 0 && ctx.prop) {
        prop = ctx.prop;
        pname = prop.name;
        ctx.ofs = i = this.skipSpaces(strProp, ctx.nameEnd + 1, n);
    } else {    
        pname = strProp.substring(offset, i).trim();
        if (arguments.length < sizedArg) {
            var p = pname.indexOf("(");
            if (p === 0) {
                throw "Invalid property name: '" + pname + '\'.\nIndex: ' + offset;
            }
            sized = p > 0 ? 1 : 0;
            p = pname.indexOf("{", p);
            if (p === 0) {
                throw "Invalid property name: '" + pname + '\'.\nIndex: ' + offset;
            } 
            if (p > 0) {
                sized = 2;
            }
        }   
        if (sized) {
            prop = this._getSizedTypeProp(pname, strProp, key, ctx);
        } else {
            if (typeProcessing) {
                if (!this.isValidTypeName(pname)) {            
                    throw "Invalid type name: '" + pname + '\'.\nIndex: ' + ctx.ofs;
                }
            } else if (!this.isValidPropertyName(pname)) {            
                throw "Invalid property name: '" + pname + '\'.\nIndex: ' + ctx.ofs;
            }
            prop = {};
            prop[key] = pname;
        }
        ctx.ofs = i = this.skipSpaces(strProp, i + 1, n);
    }
    var readOnly, re = /\s*read[-]?only\s*:\s*/gi; re.lastIndex = i;
    if (readOnly= re.exec(strProp)) {
        var _p = re.lastIndex -  readOnly[0].length;
        if (i !== _p) {
            throw new Error("Unexpected string '" + readOnly[0] + ' at index ' + _p);
        }
        i += readOnly[0].length;
        ctx.ofs = i;
        prop.readOnly = true;
    }
    ctx.firstSpacePos = -1;
    var step = 1;
    ctx.types = null,
    ctx.union = null;
    ctx.open = 1;
    ctx.prop = prop;
    ctx.values = null,
    ctx.n = n;

    var end, ch;
    /* var ctx.step corresponding to name */;
    
    
    sized = 0;
    var _cardinality = false, typeName = "", refType = false;
    if (typeProcessing && typeof SERENIX_REF_TYPE_MARKER_SYMBOL === 'string' && SERENIX_REF_TYPE_MARKER_SYMBOL && strProp.startsWith(SERENIX_REF_TYPE_MARKER_SYMBOL, i)) {
        i += SERENIX_REF_TYPE_MARKER_SYMBOL.length;
        refType = true;
    }
    for (; i < n; i++) {
        ch = strProp[i];
        if (ch === ':' && typeProcessing) {
            if (typeName) {
                unexpectedChar(ch, i);
            }
            typeName = strProp.substring(ctx.ofs, ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos).trim();
            if (!typeName) {
                unexpectedChar(ch, i);
            }
            ctx.ofs = i = this.skipSpaces(strProp, i + 1, n);
            i--; //the loop will increment
            ctx.firstSpacePos = -1;
        } else if (ch === ':') { // property processing
            end = ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos;
            if (step === 1) {
                if (_cardinality === '?') {
                    _cardinality = false;
                } else {
                    this.finalizeType(strProp, ctx, end, sized, _cardinality, typeName, refType);
                    typeName = "";
                }
                ctx.ofs = i = this.skipSpaces(strProp, i + 1, n);
                var expr = this.processExpression(strProp, i, n, [':', '?', '>']);
                if (expr) {
                    i = expr[1];
                    expr = expr[0];
                    if (typeof expr === 'function') {
                        prop["defaultValueCalc"] = expr;
                    } else if (typeof expr === 'string') {
                        prop["defaultValue"] = this.valueFromString(expr, prop.type["type"]);
                    } else if (typeof expr !== 'undefined' && expr !==null) {
                        prop["defaultValue"] = expr;
                    }
                }
                step = (ch = strProp[i]) === ':' ? 3 : (ch === '?' ? 4: 5);
                
                if (step === 3) {//
                    ctx.ofs = i = this.skipSpaces(strProp, i + 1, n);
                    if (i >= n) {
                        throw new Error("Unexpected end");
                    }
                    ch = strProp[i];
                    if (ch === '=') { //if formula marker/starter
                        ctx.ofs = i;
                        var start;
                        var formula = this.processExpression(strProp, start = this.skipSpaces(strProp, i + 1, n), n, ['>']);
                        if (!formula) {
                            throw new Error("Incorrect string property");
                        }
                        ctx.ofs = this.skipSpaces(strProp, formula[1] + 1, n);
                        prop.formula = formula[0];                        
                        step = 5;
                        prop.stringFormula = strProp.substring(start, formula[1]);
                        i = ctx.ofs - 1; //will be increae by the for loop
                    } else if (strProp.startsWith(INNER_CLASS_VALUES_TYPE_OPENER, i)) {
                        i = this.skipSpaces(strProp, i + INNER_CLASS_VALUES_TYPE_OPENER.length, n);
                        var vt = this.processTypeName(strProp, i, n);
                        i = vt[1];
                        if (!strProp.startsWith(INNER_CLASS_VALUES_TYPE_CLOSER, i)) {
                            throw new Error("Incorrect values type");
                        }
                        prop.type.values = { type: 'reference', reference : vt[0], owner : 'class' };
                        ctx.ofs = i = this.skipSpaces(strProp, i + INNER_CLASS_VALUES_TYPE_CLOSER.length, n);
                        step = 4;
                        i--;//will be increae by the for loop
                    } else if (ch === '{' || ch === '[' || ch === ']') { //if enum values or set openers
                        var e = this.processValues(strProp, i, n);
                        prop.type.values = e[0];
                        i = e[1]; 
                        if (strProp.startsWith(OUTER_VALUES_TYPE_MARKER, i)) {
                            i = this.skipSpaces(strProp, i + OUTER_VALUES_TYPE_MARKER.length, n);
                            prop.type.outer = true;
                        }
                        ctx.ofs = i;
                        i--;//will be increae by the for loop 
                        step = 4;
                    } else if (strProp.startsWith(OUTER_VALUES_TYPE_OPENER, i)) {
                        i = this.skipSpaces(strProp, i + OUTER_VALUES_TYPE_OPENER.length, n);
                        var vt = this.processTypeName(strProp, i, n);
                        i = vt[1];
                        if (!strProp.startsWith(OUTER_VALUES_TYPE_CLOSER, i)) {
                            throw new Error("Incorrect values type");
                        }
                        prop.type.values = { type: 'reference', reference : vt[0], owner : 'global' };
                        ctx.ofs = i = this.skipSpaces(strProp, i + OUTER_VALUES_TYPE_CLOSER.length, n);
                        step = 4;
                        i--;//will be increae by the for loop
                    } else if (ch === '?') {
                        step = 4;
                        i--; //will be increae by the for loop
                    } else if (ch === '>') {
                        step = 5;
                        i--; //will be increae by the for loop
                    } else {
                        i--;
                    }
                }
            } else if (step === 2) {                
                //prop["defaultValue"] = this.valueFromString(strProp.substring(ctx.ofs, i), prop.type["type"]);
                //ctx.ofs = i + 1;
                //step++;
            } else {
                step++;
            }
            
            ctx.firstSpacePos = -1;
        } else if (ch === '>') {
            prop = this.close(strProp, ctx, i, step, sized, _cardinality, typeName, refType);
            step =5;
            i = ctx.i;
            ch = ctx.ch;
            break;
        } else if (ch === ',') {
            end = ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos;
            if (step === 3) {
                if (ctx.values === null) {
                    ctx.values = [];
                }
                ctx.values[ctx.values.length] = this.valueFromString(strProp.substring(ctx.ofs, end), prop.type["type"]);
                prop.type.values = ctx.values;
            } else if (step === 4) { // ? what element
                prop.type.what = strProp.substring(ctx.ofs, end);
            } else if (step === 1) { // type element
                ctx.ch = ch;
                this.finalizeType(strProp, ctx, end, sized, _cardinality, typeName, refType, end);
                typeName = "";
                sized = 0;
            } else {
                if (!isArray(ctx.types)) {
                    ctx.types = [];
                }
                ctx.types[ctx.types.length] = prop.type;
            }
            
            step = 1;
            ctx.values = null;
            ctx.firstSpacePos = -1;
            ctx.ofs = i + 1;
        } else if (ch === '|') {
            end = ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos;
            if (step === 3) {
                if (ctx.values === null) {
                    ctx.values = [];
                }
                ctx.values[ctx.values.length] = this.valueFromString(
                        strProp.substring(ctx.ofs, end), prop.type["type"]);
                prop.type.values = ctx.values;
            } else if (step === 1) {
                //ctx.union ou choix de plusieurs types
                if (ctx.union === null) {
                    ctx.union = [];
                }
                if (ctx.ofs < end) {
                    ctx.union[ctx.union.length] = { type: strProp.substring(ctx.ofs, end)};
                } else {

                }
            }
            ctx.firstSpacePos = -1;
            ctx.ofs = i + 1;
        }  else if (ch === ' ' || ch === '\t' || ch === '\b' || ch === '\0') {
            if (ctx.firstSpacePos < 0) {
                ctx.firstSpacePos = i;
            }
        } else if (ch === '?') { //go to what or comment step marker            
            if (step === 1) {
                if (_cardinality) {
                    _cardinality = false;
                    ctx.ofs = i + 1;
                } else {
                    end = ctx.firstSpacePos < 0 ? i : ctx.firstSpacePos;
                    var _i = this.skipSpaces(strProp, i + 1, n);
                    if ((_i <n) && 
                            (((ch = strProp[_i])=== ':') 
                                || (ch === '?'))) {//cardinality or occurrences case 
                        if (_cardinality || (sized === 2)) {
                            unexpectedChar(ch, _i); //throw "Unexpected character: '" + ch + "' at index " + _i;
                        }
                        _cardinality = '?';
                    } else {
                        throw new Error("Unexpected end");
                    }                    
                    this.finalizeType(strProp, ctx, end, sized, _cardinality, typeName, refType);
                    typeName = "";
                    ctx.ofs = _i;
                    i = _i - 1;
                }
            } else if (step === 2) {
                prop["defaultValue"] = 
                        this.valueFromString(strProp.substring(ctx.ofs, i), 
                        prop.type["type"]);
                ctx.ofs = i + 1;
            } else if (step === 3) { //enum or set values
                this.__closeValues(ctx, strProp, end);
                ctx.ofs = i + 1;
            }
            
            ctx.firstSpacePos = -1;
            if (!_cardinality) {
                i = this.skipSpaces(strProp, i + 1, n);
                step = 4; //go to what or comment step
                var cmt = this.processStringPropComment(strProp, i, n, ctx);
                ctx.ofs = i = cmt[1];
                prop.type.what = cmt[0];
            }
        } else if (ch === '<') {
            this.processNewType(ctx, i, step, sized, cardinality, typeName);
            i = ctx.i - 1; //the i++ of the for loop will reset
            ch = ctx.ch;
            typeName = "";
        } 
        //open parenthesis character to specify sizes elements or call 
        //(instantiation) arguments of the type
        else if (ch === '(' && step === 1) { 
            var p;
            if (_cardinality || (sized > 0) || (p = strProp.indexOf(')', i + 1)) <= 0) {
                unexpectedChar(ch, i); //throw "Unexpected character: '" + ch + "' at index " + i;
            }
            var type = { };
            type[key] = strProp.substring(ctx.ofs, i).trim();
            ctx.type = type;
            // skip '(' and spaces
            i = this.skipSpaces(strProp, i + 1, n); 
            ctx.ofs = i =  strProp[i] === '{'
                ? this.readTypeCallArgs(type, strProp, i, n) 
                : this.readSizes(type, strProp, i, n);
            if (i < n) {
                ch = strProp[i];
                if (ch === '{') {
                    var o_ = this.readOccurences(type, strProp, i, n);
                    ctx.ofs = i = o_[1];
                    ctx.type = type = o_[0];
                } else if (['*', '+', '?', '#'].indexOf(ch) >= 0) {
                    ctx.ofs = i = this.setCardinality(type, ch);
                }
            }
            sized = 2;
            i--;
        } 
        //open curly bracket character to specify occurences/cardinality
        else if (ch === '{' && step === 1) { 
            var p;
            if (_cardinality || (sized === 2)) {
                unexpectedChar(ch, i); //throw "Unexpected character: '" + ch + "' at index " + i;
            }
            var type = { };
            type[key] = strProp.substring(ctx.ofs, i).trim();
            var o_ = this.readOccurences(type, strProp, i, n);
            ctx.ofs = i = o_[1];
            ctx.type = type = o_[0];
            sized = 2;
            i--;
        } else if ((ch === '*' || ch === '+' || ch === '#') && step === 1) {
            i = this.processCardinality(strProp, i, n, ctx, sized, cardinality, ch, typeName, refType) - 1;
            typeName = "";
            sized = 2;
        } else {
            if (ctx.firstSpacePos >= 0) {
                ctx.firstSpacePos = -1;
            }
        }
    }
    i = this.skipSpaces(strProp, i, n);
    if (step === 5 && i < n && this.CLASS_PARAMETER_TYPE_SYMBOLS.indexOf(strProp[i]) >= 0) {
        if (ctx.isPropType || ctx.typeFromString) {
            throw new Error("Unepected character '" + strProp[i + 1] + "' at index " + (i + 1));
        }
        if (prop.parameterType) {
            unexpectedChar(strProp[i], i);
        }
        prop.parameterType = true;
        ch = strProp[i];
        i = this.skipSpaces(strProp, i, n);
               
    }
    
    if (i < n) {
        if (ctx.typeFromString || !ctx.isPropType) {
            throw new Error("Unexpected property definition end part: '" + strProp.substring(i) + "'\nProperty string: '" + strProp + "'");
        }
    } else if (ch !== '>' && this.CLASS_PARAMETER_TYPE_SYMBOLS.indexOf(ch) < 0 && step !== 5) {
        throw "Unexpected end";
    }
    result.prop = prop;
    result.index = ctx.i = i;
    ctx.ch = ch;
    ctx.n = n;
    ctx.step = step;
    return result;
};
/**
 * 
 * @param {type} sval
 * @param {type} nullStringVal
 * @returns {Boolean}
 */
KlassUtils.isNullStringValue = function(sval, nullStringVal) {

    if (nullStringVal === undefined || nullStringVal === null) {
        if (KlassUtils.NULL_STRING_VALUES) {
            return KlassUtils.NULL_STRING_VALUES.indexOf(sval) >= 0;
        }
        return sval === '\\null\\' || sval === '\'null\''|| sval === '\"null\"';
    }
    return nullStringVal ===  sval;
};

KlassUtils.NULL_STRING_VALUES = [ '\\null\\' ];
/**
 * 
 * @param {type} sval
 * @param {type} type
 * @param {type} nullStringVal
 * @returns {Number|Boolean|String|Date|Object}
 */
KlassUtils.valueFromString = function(sval, type, nullStringVal) {
    if (type === SereniX.ANY_TYPE) {
        return sval;
    }
    if (isPlainObject(type)) {
        type = type.type;
    }
    if (type === String || type === 'string') {
        return sval;
    }
    if (type === Number) {
        if (sval.indexOf(".") >= 0) {
            return parseFloat(sval);
        }
        return toInteger(sval);
    }
    if (typeof type === 'function') {
        return new type(sval);
    }
    
    if (typeof type === 'undefined' || type === null || type === '*') {
        return sval;
    }
    
    if (typeof type !== 'string') {
        console.log("Type test");
    }
        
    
    //The lower valueof the type
    var ltyp = type.toLowerCase();
    if (sval === '') {
        return ltyp === 'string' || type === 'char' ? sval : null;
    }  
    if (ltyp === 'string' || ltyp === 'char' ) {
        return sval === 'null' ? null : 
                (this.isNullStringValue(sval, nullStringVal) ? null:  sval);
    } else if (globalNS.SereniX && SereniX.types.Number && SereniX.types.Number.isValidType(ltyp)) {
        return SereniX.types.Number.valueFromString(sval, ltyp);
    } else if (ltyp === 'int' || ltyp === 'integer' || ltyp === 'long' || ltyp === 'short' || ltyp === 'byte') {
        var v = parseInt(sval);
        if (Number.isNaN(v)) {
            throw new Error("Incorrect value");
        }
        return v;
    } else if (ltyp === 'float' || ltyp === 'number' || ltyp === 'numeric' ) {
        var v = parseFloat(sval);
        if (Number.isNaN(v)) {
            throw new Error("Incorrect value");
        }
        return v;
    }  else if (ltyp === 'boolean' || ltyp === 'bool') {
        if (sval === 'true' || sval === '1') {
            return true;
        }
        if (sval === 'false' || sval === '0') {
            return false;
        }
        return toBool(sval);
    } else if (ltyp === 'date') {
        return this.getDate(sval);
    } else if (ltyp === 'datetime') {
        return this.getDatetime(sval);
    } else if (ltyp === 'time') {
        return this.getTime(sval);
    }
    try {
        return SereniX.Klass.forname(sval);
    } catch (e) {}
    try {
        return SereniX.types.Type.forname(sval);
    } catch (e) {}
    return sval;
};
/**
 * 
 * @param {String} sval
 * @returns {Date}
 */
KlassUtils.getDate = function(sval) {
    var d;
    try {
        d =  sval === 'now'? Date.now() : new Date(sval);
        if (!isNaN(d.getTime())) {
            if (globalNS.strToDatetime) d = strToDatetime(sval);
        }
    } catch (e) {
        if (globalNS.strToDatetime) d = strToDatetime(sval);
        else throw e;
    }
    
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
};
/**
 * 
 * @param {String} sval
 * @returns {Date}
 */
KlassUtils.getDatetime = function(sval) {
    var d;
    try {
        d =  sval === 'now'? Date.now() : new Date(sval);
        if (!isNaN(d.getTime())) {
            if (globalNS.strToDatetime) d = strToDatetime(sval);
        }
    } catch (e) {
        if (globalNS.strToDatetime) d = strToDatetime(sval);
        else throw e;
    }
    return d;
};
/**
 * 
 * @param {String} sval
 * @returns {Date}
 */
KlassUtils.getTime = function(sval) {
    var t = new Date(sval);
    t.setFullYear(1970);
    t.setMonth(0);
    t.setDate(1);
    return t;
};

Klass.Class( {
    name: 'SereniX.types.Dependency', 
    super: Klass,
    properties: {
        type: { type: 'string', readOnly: true}
    },
    methods : {
        /**
         * 
         * @param {type} val
         * @param {Object} [obj=this.object]
         * @returns {boolean}
         */
        is:function(val, obj) {
            throw new Error("Abstract method call");
        }
    }
});

Klass.Class( {
    name: 'SereniX.types.ODependency', 
    super: SereniX.types.Dependency,
    properties: {        
        object: { type: 'Object'}
    },
    methods : {
        getObject :function() {
            return this.__object_;
        },
        setObject: function(object) {
            this.__object_ = object;
        }
    }
});

var FieldType = Klass.Class({
    name: 'SereniX.types.FieldType', 
    super: SereniX.types.Type,
    /**
     * 
     * @param {type} ft
     * @constructor
     */
    construct : function(ft) {
        var args = Array.prototype.slice.call(arguments);
        if (ft instanceof String) {
            ft = ft.valueOf();
        }
        var t = typeof ft;
        if (t === 'object' && ft) {
            this.setField(ft.field||ft.Field||ft.fieldName||ft.FieldName||ft.name||ft.Name);
            this.setFieldClass(ft.fieldClass||ft.FieldClass||ft.class||ft.Class);
        } else if (t === 'string') {
            this.setField(ft);
            this.setFieldClass(args[1]);
        } else if (ft) {
            throw new Error("Incorrect arguments");
        }
    },
    properties: {        
        field: { type: 'string', required: true },
        fieldClass: { type: 'function', required: true }
    },
    methods: {
        /**
         * 
         * @param {type} val
         * @param {Boolean} [strict=SereniX.types.Type.IS_TYPE_DEFAULT_STRICT]
         * @returns {boolean}
         */
        is:function(val, strict) {
            if (arguments.length < 2) strict = SereniX.types.Type.IS_TYPE_DEFAULT_STRICT;
            var type = this.__fieldClass_.getPropertyType(this.__fieldName_);  
            if (type instanceof SereniX.types.Type) {
                return type.is(val, strict);
            }
            if (typeof type === 'function') return val instanceof type;
            return SereniX.types.TypeUtils.isTypeOf(val, type, strict);
        },
        /**
         * 
         * @param {Function|String} cls
         * @returns {SereniX.types.FieldType}
         * @throws {Error}
         */
        setFieldClass: function(cls) {         
            if (typeof cls === 'string') {
                cls = Klass.forname(cls);
            } else if (typeof cls !== 'function') {
                throw new Error("Incorrect argument");
            }
            if (typeof cls.getPropertyType !== 'function') {
                throw new Error("Incorrect field class");
            }
            this.__fieldClass_ = cls;
            return this;
        }
    }
});


/**
 * 
 * @class SereniX.types.LinkedEnum
 */
Klass.Class({
    name: 'SereniX.types.LinkedValues', 
    super: SereniX.types.ODependency,
    inherit: false,
    /**
     * 
     * @param {type} s
     * @returns {LinkedEnum}
     */
    construct: function (s) {
        this.$$___initialized___ = false;
        this.__type_ = "linked-values";
        if (s instanceof String) {
            s = s.valueOf();
        }
        if (isPlainObject(s)) {
            this.setField(s.field||s.Field||s.master||s.base);
            this.setValues(s.values);
        }
        this.$$___initialized___ = arguments.length === 0 ? false : true;
    },
    properties: {
        field: 'string',
        compare: { type: 'function'},
        values: { type: 'Object', nullable: false}
    },
    methods: {
        /**
         * 
         * @returns {String} 
         */
        getType:function() {
            return "linked-values";
        },
        /**
         * 
         * @returns {String}
         */
        getField :function() {
            return this.__field_;
        },
        setField: function(field) {
            this.__field_ = field;
        },
        
        
        getValues: function(key) {
            return arguments.length ? this.$$___values___[key] : this.$$___values___;
        },
        /**
         * 
         * @param {Object|Array} values
         * @param {String} [key]
         * @returns {serenix_typesAnonym$71}
         */
        setValues: function(values, key) {
            var self = this;
            this.$$___values___ = this.$$___values___||{};
            function setEntryValues(values, key) {
                var ___values___ = [], v;
                if (isArray(values)) {                    
                    values.forEach (function(v, i) {
                        if (___values___.indexOf(v) >= 0) {
                            throw new Error("The list of values is not distinct");
                        }
                        ___values___[i] = v;
                    });
                } else if (isPlainObject(values)) {
                    var fname, set = function(v) { throw new Error("Read only property: unauthoried modification"); };
                    for (var name in values) {
                        if(!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
                            throw new Error("Incorrect enumeration value name: '" + name + "'");
                        }
                        fname = "$$___" + name + "___";
                        this[fname] = v = values[name];
                        function __get__() {
                            return this[__get__.fname];
                        }
                        __get__.fname = fname;
                        Object.defineProperty(this, name, { configurable: false, get: __get__, set: set });
                        ___values___.push(v);
                    }
                } else {
                    incorrectArg(); //throw "Incorrect argument";
                }
                self.$$___values___[key] = ___values___;
            }
            if (this.$$___initialized___) {
                throw new Error("It's not allowed to change the values of an enumeration");
            }
            if (arguments.length === 1) {
                for (var key in values) {
                    setEntryValues(values[key], key);
                }
            } else {
                setEntryValues(values, key);
            }
            return this;
        },
        /**
         * 
         * @param {type} val
         * @param {Object} [obj=this.object]
         * @returns {boolean}
         */
        is:function(val, obj) {
            var c = this.__compare_||typeof val === 'string' ? function(a, b) {
                return a < b ?  - 1 : a === b ? 0 : 1;
            } : val instanceof Date ? function(a, b) {
                return a.getTime() - b.getTime();
            } : function(a, b) {
                return a - b;
            }, values = this.getValues((obj||this.__object_)[this.__field_]), v;
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
});


SereniX.types.LinkedValues.prototype.accept = SereniX.types.LinkedValues.prototype.is;

SereniX.types.LinkedValues.prototype.filter = SereniX.types.LinkedValues.prototype.is;







/**
 * Creates or extends a class from the given arguments.
 * <p>The main invocations/calls of the method are:</p>
 * <ul>
 * <li>createClass(Object md) :  The medata contains all the property to create the class</li>
 * <li>createClass(Object md, String superClass)</li>
 * <li>createClass(Object md, Function superClass)</li>
 * <li>createClass(Object md, boolean ext)</li>
 * <li>createClass(String name, Object md)</li>
 * <li>createClass(String name, Object md, String superClass)</li>
 * <li>createClass(String name, Object md, Function superClass)</li>
 * <li>createClass(String name, Object md, boolean ext)</li>
 * </ul>
 * <p><b color="green">$class</b><b> is an alias/launcher of SereniX.Klass.createClass</b>.</p>
 * @returns {Function}
 */
SereniX.createClass = function() {
    return SereniX.Klass.createClass.apply(SereniX.Klass, arguments);
};
/**
 * Creates or extends a class from the given arguments.
 * <p>The main invocations/calls of the method are:</p>
 * <ul>
 * <li>createClass(Object md) :  The medata contains all the property to create the class</li>
 * <li>createClass(Object md, String superClass)</li>
 * <li>createClass(Object md, Function superClass)</li>
 * <li>createClass(Object md, boolean ext)</li>
 * <li>createClass(String name, Object md)</li>
 * <li>createClass(String name, Object md, String superClass)</li>
 * <li>createClass(String name, Object md, Function superClass)</li>
 * <li>createClass(String name, Object md, boolean ext)</li>
 * </ul>
 * <p><b color="green">SereniX.Class</b><b> is an alias of SereniX.Klass.createClass</b>.</p>
 * @returns {Function}
 */
SereniX.Class = SereniX.createClass;

/**
 * 
 * @type Klass.Class
 */
var $createClass = SereniX.class = SereniX.cls = SereniX.klass = SereniX.kls
        = SereniX.createClass;
/**
 * Creates class (function) from the given arguments
 * @type Function
 */
var klass = (function () {
    var C = Klass, create = C.Class;
    var c = function() {
        return create.apply(C, arguments);
    };
    return c;
})();



/**
 * Creates or extends a class from the given arguments.
 * <p>The main invocations/calls of the method are:</p>
 * <ul>
 * <li>Class(Object md) :  The medata contains all the property to create the class</li>
 * <li>Class(Object md, String superClass)</li>
 * <li>Class(Object md, Function superClass)</li>
 * <li>Class(Object md, boolean ext)</li>
 * <li>Class(String name, Object md)</li>
 * <li>Class(String name, Object md, String superClass)</li>
 * <li>Class(String name, Object md, Function superClass)</li>
 * <li>Class(String name, Object md, boolean ext)</li>
 * </ul>
 * <p><b color="green">$class</b><b> is an alias/launcher of SereniX.createClass</b>.</p>
 * @returns {SereniX.Klass}
 */
var $class = SereniX.createClass;



/**
 * 
 * @returns {SereniX.Klass}
 */
Klass.extendClass = function() {
    var name;
    var md, ext, args = arguments;
    
    var parentClass;
    
    if (args.length === 1) {
        md = args[0];
        if (typeof md !== 'object') {
            throw "Incorrect arument";
        }
        parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"];
        if (!parentClass) { throw "The parent/super class is mandatory"; }
        if (typeof parentClass === 'string') {
            var pClass = this.forname(parentClass);
            if (pClass) {
                md.parentClass = parentClass = pClass;
            } else {
                throw "The parent/super class '" + parentClass + "' not found";
            }
        }
    } else if (args.length === 2) {
        md = args[0];
        var ext = args[1];
        if (typeof ext === 'boolean') {
            parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"];
            if (typeof parentClass === 'string') {
                if (parentClass === '') {
                    throw "Empty parent class name";
                }
                var pClass = this.forname(parentClass);
                if (pClass) {
                    md.parentClass = parentClass = pClass;
                } else {
                    throw "The parent/super class '" + parentClass + "' not found";
                }
            } else if (typeof parentClass !== 'function') {
                //TODO
                throw "Not yet implemented";
            }
            if (ext && !parentClass) { 
                throw "The parent/super class is mandatory"; 
            }
        } else if (typeof ext === 'function') {
            parentClass = md["parentClass"]||md["parent"]||md["super"]||md["superClass"];            
            if (typeof parentClass === 'string') {
                if (parentClass === '') {
                    throw "Empty parent class name";
                }
                var pClass = this.forname(parentClass);
                if (pClass) {
                    parentClass = pClass;
                } else {
                    throw "The parent/super class '" + parentClass + "' not found";
                }
            } else if (typeof parentClass !== 'function') {
                parentClass = ext;
            } else {
                //TODO
            }
            md["parentClass"] = parentClass;
        } else if (typeof ext === 'string') {
            if (ext === '') {
                throw "Empty parent class name";
            }
            var pClass = this.forname(ext);
            if (pClass) {
                md["parentClass"] = parentClass = pClass;
            } else {
                throw "The parent/super class '" + ext + "' not found";
            }
        } else if (typeof ext === 'object') {
            incorrectArgs(); //throw "Incorrect arguments" exception;
        }        
    } else if (args.length > 2) {
        parentClass = args[0];
        if (this.isClass(parentClass)) {
            if (typeof args[1] === 'string') {
                name  = args[1];
                var i = name.lastIndexOf("."), ns;
                if (i < 0) {
                    ns = "";
                } else {
                    ns = name.substring(0, i);
                    name.substring(i + 1);
                }
                md = { parentClass : parentClass, name: name, namespace: ns };
            } else if (typeof args[1] === 'object') {
                if (!parentClass) { throw "The parent/super class is mandatory"; }
                var _md = { parentClass : parentClass};
                md = args[1];
                for (var n in md) {
                    _md[n] = md[n];
                }
                md = _md;
            }
        } else if (typeof args[0] === 'string' && args[0] !== '') {
            name  = args[0];
            if (this.isClass(args[1])) {
                var i = name.lastIndexOf("."), ns;
                if (i < 0) {
                    ns = "";
                } else {
                    ns = name.substring(0, i);
                    name.substring(i + 1);
                }
                md = { parentClass : args[1], name: name, namespace: ns };
            } else if (typeof args[1] === 'string') {
                var pClass = this.forname(args[0]);
                if (pClass) {
                    name = args[1];
                    ns;
                    if (i < 0) {
                        ns = "";
                    } else {
                        ns = name.substring(0, i);
                        name.substring(i + 1);
                    }
                    md = { parentClass : pClass, name: name, namespace: ns };
                } else {
                    throw "The parent/super class '" + parentClass + "' not found";
                }
            }
        }
    }
    if (!md) {
        incorrectArgs(); //throw "Incorrect arguments" exception;
    }
    return this.createClass(md);
};

/**
 * 
 * @returns {SereniX.Klass}
 */
Klass.ext = Klass.extendClass;
/**
 * 
 * @returns {SereniX.Klass}
 */
SereniX.extClass = Klass.extendClass;

/**
 * 
 * @param {Object} obj  The object to extend
 * @param {Object} wObj The object to get properties to add to the object to extend
 * @param {Array|Function|Object} [filter]
 * @returns {Object}
 */
extObj = function(obj, wObj, filter) {
    if (arguments.length > 2) {
        if (isArray(filter) && filter.length > 0) {
            for (var n in wObj) {
                if (hasOwnProp(wObj, n) && filter.indexOf(n) < 0) {
                    obj[n] = wObj[n];
                }
            }
            return obj;
        }
        if (typeof filter === 'function') {
            for (var n in wObj) {
                if (hasOwnProp(wObj, n) && filter(n)) {
                    obj[n] = wObj[n];
                }
            }
            return obj;
        }
        if (filter && typeof filter === 'obj') {
            if (typeof filter.filter === 'function') {
                for (var n in wObj) {
                    if (hasOwnProp(wObj, n) && a.filter(n)) {
                        obj[n] = wObj[n];
                    }
                }
                return obj;
            }
            if (typeof filter.accept === 'function') {
                for (var n in wObj) {
                    if (hasOwnProp(wObj, n) && a.accept(n)) {
                        obj[n] = wObj[n];
                    }
                }
                return obj;
            }
        }
    }
    for (var n in wObj) {
        if (hasOwnProp(wObj, n)) {
            obj[n] = wObj[n];
        }
    }
    return obj;
};

SereniX.extObj = extObj;

/**
 * 
 * @param {Object} obj
 * @param {Object} wObj
 * @returns {Object}
 */
$extObj = SereniX.extObj;

/**
 * Returns the object corresponding to the given name
 * @param {String} name
 * @returns {Object}
 */
SereniX.forname = SereniX_forname;
/**
 * Returns the object corresponding to the given name
 * @param {String} name
 * @returns {Object}
 */
SereniX.forName = SereniX_forname;
/**
 * Returns the variable object corresponding to the given name.
 * @param {type} name The variable name to search corresponding object.
 * @returns {Object}
 */
SereniX.fromName = SereniX_forname;

/**
 * Returns the variable object corresponding to the given name.
 * @param {type} name The variable name to search corresponding object.
 * @returns {Object}
 */
SereniX.fromname = SereniX_forname;

/**
 * <p><b>SereniX.use</b> is an alias of <b>SereniX_use</b> function.</p>
 * <p>The purpose of SereniX_use function is to create a variable as alias 
 * with the given class as value. When an alias is specified, the variable 
 * name is the alias value, otherwise the variable name is the short name 
 * of the class.</p>
 * <p>The possible invocations of <b>SereniX.use</b> are :</p>
 * <ul>
 * <li><b>SereniX.use</b>( <b><i>{Function|String}</i></b> <b color="red">cls<b> )</li>
 * <li><b>SereniX.use</b>( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{String}</i></b> alias, <b><i>{Object}</i></b> _this )</li>
 * <li><b>SereniX.use</b>( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{String}</i></b> alias )</li>
 * <li><b>SereniX.use</b>( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{Object}</i></b> _this, <b><i>{String}</i></b> alias )</li>
 * <li><b>SereniX.use</b>( <b><i>{Function|String}</i></b> <b color="red">cls<b>, <b><i>{Object}</i></b> _this )</li>
 * </ul>
 * Where 
 * <ul>
 * <li>the parameter <b color="red">cls<b> represents the class to set the use or the class 
 * name of the class to set the use;</li>
 * <li><b color="green">alias<b> the name of the variable to create with the given class as value;</li>
 * <li><b color="green">_this<b> reperesents the alias owner (where to 
 * create the alias). When is undefined or null, the global object 
 * <b color="red">window<b> is used as owner.</li>
 * </ul>
 * @returns {Function} The function representing the class.
 */
SereniX.use = SereniX_use;
/**
 * Creates a variable as alias 
 * with the given class as value. When an alias is specified, the variable 
 * name is the alias value, otherwise the variable name is the short name 
 * of the class.
 * <p><b>$use</b> is an alias of <b>SereniX_use</b> function.</p>
 * @see SereniX_use()
 * @returns {Function}
 */
$use = SereniX_use;

/**
 * <p><b>use</b> is an alias of <b>SereniX_use</b> function.</p>
 * @see SereniX_use()
 * @returns {Function}
 */
use = SereniX_use;

//Add the class Namespace to the namespace SereniX.
$ns('SereniX').addElement(Namespace);


//========================================================================
//------------------------        Class : PType       --------------------
//========================================================================


function PType(opts) {
    this._nullable = true;
    this._values = null;
    if (opts) {
        this._type = opts.type||opts.name;
    }
}

PType.prototype.isNullable = function() {
    return this._nullable;
};
/**
 * 
 * @param {type} nullable
 * @returns {PType}
 */
PType.prototype.setNullable = function(nullable) {
    if (typeof nullable === 'undefined' || nullable === null) {
        if (typeof nullable === 'undefined'  || nullable === null) {
            nullable = true;
        } else {
            nullable = toBool(nullable);
        }
    } else {
        nullable = toBool(nullable);
    }
    this._nullable = nullable;
    return this;
};

PType.prototype.getValues = function() {
    return this._values;
};
/**
 * 
 * @param {type} values
 * @returns {PType}
 */
PType.prototype.setValues = function(values) {
    this._values = values;
    return this;
};

Object.defineProperties(PType.prototype, {
    'type': {
        enumerable: true,
        configurable: true,
        get: PType.prototype.getType,
        set: PType.prototype.setType
    },
    'nullable': {
        enumerable: true,
        configurable: true,
        get: PType.prototype.isNullable,
        set: PType.prototype.setNullable
    },
    'values': {
        enumerable: true,
        configurable: true,
        get: PType.prototype.getValues,
        set: PType.prototype.setValues
    }
});



Klass.Class({
    "name": "HashData",
    "namespace" : "SereniX",
    construct: function() {
        this._map = {};
        this._data = [];
        this.__COMPONENT_TYPE__ = null;
        /**
         * 
         * @param {String|Date|Number|Object} item
         * @returns {String}
         */
        this._hasher = {
            func: function(item) {
                if (typeof item === 'undefined' || item === null || item === '') {
                    return "";
                }
                if (isArray(item)) {
                    var n = item.length, k = "", s;
                    for (var i = 0; i < n; i++) {
                        k += this.item.toString();
                        if (k.length > 5) {
                            return s.substring(0, 5);
                        } else if (k.length === 5) {
                            return k;
                        }
                    }
                    return k;
                }
                var s = this.item.toString();
                if (s.length > 5) {
                    return s.substring(0, 5);
                } else {
                    return s;
                }
                return s;
            },
            hash: function(item) {
                this.func(item);
            }
        };
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isArray(a)) {
                this.addAll(a);
            } else if (a && typeof a === 'object') {
                var ctype = a.componentType||a.itemType, cls = false;
                if (typeof ctype === 'string') {
                    try {
                        cls = SereniX.Klass.forname(ctype);
                    } catch(e) {}
                } else if (typeof ctype !== 'function') {
                    ctype = false;
                }
                this.__COMPONENT_TYPE__ = cls||ctype;
                var items = a.items||a.Items||a.data||a.Data||a.elements||a.Elements;
                if (isArray(items)) {
                    this.addAll(items);
                }
                try {
                    this._hasher = SereniX.HashData.getHasher(a);
                } catch (e) { }
            }
        } else if (arguments.length > 1) {
            SereniX.HashData.prototype.addAll.apply(this, arguments);
        }
    },
    properties : {
        "hasher" : { type: "Object" }
    },
    methods: {
        getHasher:function() {
            return this._hasher;
        },
        /**
         * 
         * @param {SereniX.Hasher|Function|Object} h
         * @returns {SereniX.HashData}
         */
        setHasher: function(h) {
            var msg = "Incorrect arguments";
            if (arguments.length === 0) {
                throw new Error("The hasher argument is expecetd");
            }
            if (arguments.length === 1) {
                this._hasher = SereniX.Hasher.getHasher(arguments[0]);
            } else if (typeof arguments[0] === 'function') {
                if (arguments[1] && (typeof arguments[1] === 'object')) {
                    this._hasher = { 
                        func : arguments[0], 
                        caller : arguments[1], 
                        hash : function(item){
                            return this.func.apply(this.caller,[item] );
                        }  
                    };
                } else {
                    throw new Error(msg);
                }
            } else if (arguments[0] && (typeof arguments[0] === 'object')) {
                if (typeof arguments[1] === 'function') {
                    this._hasher = { 
                        func : arguments[1], 
                        caller : arguments[0], 
                        hash : function(item){
                            return this.func.apply(this.caller,[item] );
                        }  
                    };
                } else {
                    throw new Error(msg);
                }
            } else {
                throw new Error(msg);
            }
            return this;
        },
        /**
         * 
         * @param {Object} item
         * @returns {String}
         * @throws {Error} 
         */
        hash: function(item) {
            if (!this._hasher) {
                if (typeof item.hashCode === 'function') {
                    return "" + item.hashCode();
                } else {
                    item.toString();
                }
            }
            return this._hasher.hash(item);
        },
        /**
         * 
         * @param {Object} item
         * @returns {Boolean}
         * @throws {type} description
         */
        checkInstance:function(item) {
            if (item === null) {
                return true;
            }
            function getClassName(c) {                
                if (c.getClassFullName === 'function') {
                    return c.getClassFullName();
                } else if (c.getFullClassName === 'function') {
                    return c.getFullClassName();
                } else if (typeof c.__FULL_NAME__ === 'string') {
                    return c.__FULL_NAME__;
                } else {
                    var n = c.__CLASS_NAME__||c.__NAME__;
                    if (c) {
                        var ns = c.__NAMESPACE_NAME__;
                        if (ns) {
                            return ns + '.' + n;
                        }
                        return n;
                    }
                }
                return "";
            }
            if (typeof this.__COMPONENT_TYPE__ === 'function') {
                if (!(item instanceof this.__COMPONENT_TYPE__)) {
                    var c = this.__COMPONENT_TYPE__,
                        n = getClassName(c);
                   
                    throw new Error(n ? ("Incorrect argument: expected " + n + " class object") : "Incorrect argument: ");
                }
            }
            return true;
        },
        /**
         * 
         * @param {Object} item
         * @returns {serenix_class_baseAnonym$48.methods}
         */
        add:function(item) {
            if (!this.checkInstance(item)) {
                throw new Error("Incorrect argument");
            }
            var key = this.hash(item),
                list = this._map[key];
            
            if (!isArray(list)) {
                list = [];
            }
            list[list.length] = item;
            this._map[key] = list;
            return this;
        },
        /**
         * 
         * @returns {serenix_class_baseAnonym$48.methods}
         */
        addAll:function() {
            if (arguments.length === 0) {
                return this;
            }
            if (arguments.length === 1) {
                var a = arguments[0];
                if (isArray(a)) {
                    for (var i in a) {
                        this.add(a[i]);
                    }
                } else {
                    throw "Incorrect argument: array expected";
                }
            } else {
                var n = arguments.length;
                for (var i = 0; i < n; i++) {
                    this.add(arguments[i]);
                }
            }            
            return this;
        },
        /**
         * 
         * @param {type} item
         * @returns {Boolean}
         */
        remove: function(item) {
            var key = this.hash(item);
            if (!this._map[key]) {
                return false;
            }
            this._data.splice(this._data.indexOf(item), 1);
            delete this._map[key];
            return this;
        },
        /**
         * 
         * @returns {undefined}
         */
        clear: function() {
            this._map = {};
            this._data.splice(0, this._data.length);
        },
         /**
         * 
         * @returns {unsigned int}
         */
        size: function() {
            return this._data.length;
        },
        /**
         * 
         * @returns {unsigned int}
         */
        getLength: function() {
            return this._data.length;
        }
    }
});

Klass.Class({
    name :  "Hasher",
    namespace: "SereniX",
    "abstract": true,
    methods : {
        /**
         * 
         * @param {Object} obj
         * @returns {String}
         * @throws {Error} 
         */
        hash : function(obj) {
            throw new Error("Abstract method call");
        }
    }
});

Klass.Class({
    name :  "SubstrstringHasher",
    namespace: "SereniX",
    superClass : SereniX.Hasher,
    construct: function(opts) {
        this._key = "";
        this._first = true;
        this._length = 1;
        this._offset = 0;
        if (arguments.length === 1) {
            this.set(arguments[0]);
        } else {
            this.set(arguments);
        }
    },
    methods : {
        /**
         * 
         * @returns {String|Array&lt;String&gt;}
         */
        getKey: function() {
            return this._key;
        },
        /**
         * 
         * @param {String|Array&lt;String&gt;} key
         * @returns {SereniX.StringHasher}
         */
        setKey:function(key) {
            if (typeof key === 'undefined' || key === null) {
                key = "";
            }
            if (!isArray(key) && (typeof key !== 'string')) {
                throw "Incorrect argument: expected String or Array<String>";
            }
            this._key = key;
            return this;
        },
        /**
         * 
         * @returns {int}
         */
        getOffset:function() {
            return this._offset;
        },
        /**
         * 
         * @param {int} ofs
         * @returns {SereniX.StringHasher}
         */
        setOffset: function(ofs) {
            this._offset = ofs;
            return this;
        },
        /**
         * 
         * @returns {int}
         */
        getLength:function() {
            return this._length;
        },
        /**
         * 
         * @param {int} length
         * @returns {SereniX.StringHasher}
         */
        setLength: function(length) {
            this._length = length;
            return this;
        },
        /**
         * 
         * @param {type} o
         * @returns {undefined}
         */
        set:function(o) {
            if (Number.isInteger(o)) {
                if (o === 0) {
                    throw "Incorrect substring length : " + o;
                } else if (o < 0) {
                    this._first = false;
                    this._length = -1 * o;
                } else {
                    this._first = true;
                    this._length = o;
                }
                this._offset = 0;
                this._key = "";
            } else if (o && typeof o === 'object') {
                this.setKey(o.key||o.Key||o.keys||o.Keys||o.field||"")
                        ||o.Field||o.fields||o.Fields||"";
                this._offset = o.offset||o.Offset||0;
                this._length = o.length||o.Length||0;
                var f = o.first||o.First;
                if (typeof f !== 'undefined') {
                    if (f !== null && 
                            (!f || 
                            ((typeof f === 'string') 
                                && [ 'n', 'no', 'off', '0', 'non'].indexOf(f.toLowerCase()) >= 0))) {
                        this._first = false;
                    } else {
                        this._first = true;
                    }
                } else {
                    f = o.sens||o.Sens||o.from||o.from||o.dir||o.Dir;
                    if (typeof f === 'undefined') {
                        f = o.fromEnd||o.Fromend||o.FromEnd;
                        if (typeof f === 'undefined') {
                            f = o.end||o.End||o.End;
                        }
                        if (!f || f === '0') {
                            this._first = true;
                        } else if (f === true) {
                            this._first = false;
                        }
                    } else if (typeof f === 'string'){
                        f = f.toLowerCase();
                        this._first = f === 'last' || f === 'end' ? false : true;
                    } else if (typeof f === 'number') {
                        this._first = f >= 0;
                    } else {
                        this._first = true;
                    }                       
                }
                if (this._offset < 0) {
                    this._first = !this._first;
                    this._offset *= -1;
                }
            } else if (typeof o === 'boolean') {
                this._key = "";
                this._offset = 0;
                this._length = 1;
                this._first = o;
            } else {
                try {
                    if (typeof o[0] === 'boolean') {
                        if (o.length === 2) {
                            this._first = o[0];
                            if (Number.isInteger(o[1])) {
                                this._offset = 0;
                                this._length = o[1];
                            } else {
                                incorrectArg(); //throw "Incorrect argument" exception;
                            }
                            this._key = "";
                        } else if (Number.isInteger(o[1])) {
                            this._offset = o[1];
                            if (Number.isInteger(o[2]) && o[2] >= 0) {
                                this._length = o[2];
                                this._key = "";
                                this._first = true;
                            } else if (typeof o[2] === 'string' || isArray(o(2))){
                                this._length = 1;
                                this._key = o[2];
                                this._first = true;
                            } else {
                                incorrectArg(); //throw "Incorrect argument" exception;
                            }
                            if (this._offset < 0) {
                                this._first = !this._first;
                                this._offset *= -1;
                            }
                        } else {
                            incorrectArg(); //throw "Incorrect argument" exception;
                        }
                    } else if (Number.isInteger(o[0])) {
                        if (o.length === 2) {
                            if (typeof o[1] === 'boolean') {
                                this._first = o[1];
                                if (o[0] < 0) {
                                    this._offset = o[0];
                                } else {
                                    this._length = o[0];
                                }
                                this._key = "";
                            } else if (Number.isInteger(o[1])) {
                                if (o[1] >= 0) {
                                    this._offset = o[0];
                                    this._length = o[1];
                                } else {
                                    throw "Incorrect length argument: " + o[1];
                                }
                            }
                        } else {
                            
                        }
                    } else {
                        incorrectArgs(); //throw "Incorrect arguments" exception;
                    }
                } catch (e) {
                    incorrectArgs(); //throw "Incorrect arguments" exception;
                }
            }
        },
        /**
         * 
         * @param {Object} obj
         * @returns {String}
         */
        hash : function(obj) {
            if (typeof obj === 'undefined' || obj === null) {
                return "";
            }
            var str = "";
            if (isArray(this._key)) {
                var keys = this._key, n = keys.length;
                for (var i =0; i < n; i++) {
                    str += (obj[this._key]||"");
                }
            } else if (typeof this._key === 'string' && this._key) {
                str = (obj[this._key]||"").toString();
            } else {
                str = obj.toString();
            }
            return str.substr(this._first ? 
                this._offset :  str.length - this._offset, this._length);
        }
    }
});

SereniX.Hasher.getHasher = function(h) {
    if (h instanceof SereniX.Hasher) {
        return h;
    }
    if (typeof h === 'function') {
        return { 
            func : h,
            hash : function(item) {
                return this.func(item);
            }
        };
    } else if (h && typeof h === 'object') {
        var keys, delim = "", delims, pref, suff;
        if (typeof h.hash === 'function') {
            return h;
        } else if (isArray((keys = h.keys||h.Keys||h.hashKeys
                ||h.hashFields||h.fields||h.Fields))) {
            delims = h.delimiters||h.delims||{};
            delim = h.delimiter||h.delim||"",
            pref = h.prefix||h.Prefix||"",
            suff = h.suffix||h.sufix||h.Suffix||h.Sufix||"";
            if (delims && delim) {
                if (isArray(delims)) {
                    return { 
                        fields: keys,
                        "delims": delims,
                        "delim": delim,
                        "pref" : pref,
                        "suff" : suff,
                        hash: function(item) {
                            var fields = this.fields, n = fields.length, h ="", f, v;
                            for (var i = 0; i < n; i++) {
                                f = fields[i];
                                v = item[f];
                                if (typeof v === 'undefined' || v === null) {
                                    v = "";
                                }
                                h += v.toString() + (i < this.delims.length ? this.delims[i]||this.delim : this.delim);
                            }
                            return this.pref + h + this.suff;
                        }
                    };
                } else if (typeof delims === 'object') {
                    return { 
                        fields: keys,
                        "delims": delims,
                        "pref" : pref,
                        "suff" : suff,
                        hash: function(item) {
                            var fields = this.fields, n = fields.length, h ="", f, v;
                            for (var i = 0; i < n; i++) {
                                f = fields[i];
                                v = item[f];
                                if (typeof v === 'undefined' || v === null) {
                                    v = "";
                                }
                                h += v.toString() + (this.delims[f]||(i < n - 1 ? this.delim : ""));
                            }
                            return this.pref + h + this.suff;
                        }
                    };
                }
            } else if (delim) {
                return { 
                    fields: keys,
                    "delim": delim,
                    "pref" : pref,
                    "suff" : suff,
                    hash: function(item) {
                        var fields = this.fields, n = fields.length, h ="", f, v;
                        for (var i = 0; i < n; i++) {
                            if (i > 0) {
                                h += this.delim;
                            }
                            f = fields[i];
                            v = item[f];
                            if (typeof v === 'undefined' || v === null) {
                                v = "";
                            }
                            h += v.toString();
                        }
                        return this.pref + h + this.suff;
                    }
                };
            } else if (isArray(delims)) {
                return { 
                    fields: keys,
                    "delims": delims,
                    "pref" : pref,
                    "suff" : suff,
                    hash: function(item) {
                        var fields = this.fields, n = fields.length, h ="", f, v;
                        for (var i = 0; i < n; i++) {
                            f = fields[i];
                            v = item[f];
                            if (typeof v === 'undefined' || v === null) {
                                v = "";
                            }
                            h += v.toString() + (i < this.delims.length ? this.delims[i]||"" : "");
                        }
                        return this.pref + h + this.suff;
                    }
                };
            } else if (delims && typeof delims === 'object') {
                return { 
                    fields: keys,
                    "delims": delims,
                    "pref" : pref,
                    "suff" : suff,
                    hash: function(item) {
                        var fields = this.fields, n = fields.length, h ="", f, v;
                        for (var i = 0; i < n; i++) {
                            f = fields[i];
                            v = item[f];
                            if (typeof v === 'undefined' || v === null) {
                                v = "";
                            }
                            h += v.toString() + (this.delims[f]||"");
                        }
                        return this.pref + h + this.suff;
                    }
                };
            } else {
                return { 
                    fields: keys,
                    "pref" : pref,
                    "suff" : suff,
                    hash: function(item) {
                        var n = keys.length, h ="", fields = this.fields, f, v;
                        for (var i = 0; i < n; i++) {
                            f = fields[i];
                            v = item[f];
                            if (typeof v === 'undefined' || v === null) {
                                v = "";
                            }
                            h += v.toString();
                        }
                        return this.pref + h + this.suff;
                    }
                };
            }
        } else {
            var func = h.func||h.Func||h["function"]||h.Function
                    ||h.process||h.Process
                    ||h.compute||h.Compute;
            
            if (typeof func === 'function') {
                var args = h.arguments||h.Arguments||h.args||h.options||h.Options;
                if (isArray(args) || (args && typeof args === 'object')) {
                    return  {
                        "compute": func,
                        "args": args,
                        caller: h,
                        hash: function(item) {
                            return this.compute.apply(this.caller, [item, this.args]);
                        } 
                    };
                } else {
                    return  {
                        "compute": func,
                        caller: h,
                        hash: function(item) {
                            return this.compute.apply(this.caller, [ item ]);
                        } 
                    };
                }
            } else if (typeof func === 'string') {
                //TODO
                throw "Not implemented yet!!!";
            }
        }
    } else {
        incorrectArg(); //throw "Incorrect argument" exception;
    }
};

Klass.Class({
    name: 'TreeNodeMetadata',
    namespace: 'SereniX',
    /**
     * 
     * @param {String|Object} o
     * @returns {undefined}
     */
    construct : function(o) {
        function bool(v) {
            var typ = typeof v;
            if (typ === 'string') {
                return ['n', 'no', 'false', 'off', '0', 'non', 'ko', 'nok',''].indexOf(v.toLowerCase()) < 0;
            } else if (typ === 'boolean') {
                return v;
            } else if (typ === 'number') {
                return v >= 0 ;
            }
            return v ? true : false;
        }
        this._base = false;
        this._loop = true;
        this._parentField = "";
        if (typeof o === 'string') {
            this._parentField = o;
        } else if (o && typeof o === 'object') {
            var v = o.base;
            if (typeof v === 'undefined') {
                v = o.Base;
            }
            this._base = bool(v);
            var v = o.loop;
            if (typeof v === 'undefined') {
                v = o.Loop;
            }
            this._loop = bool(v);
            v = o.parentField||o.parentFieldName||o.ownerField||o.ownerFieldName
              ||o.ParentField||o.ParentFieldName||o.OwnerField||o.OwnerFieldName
              ||o.parent||o.owner||"";
            if (typeof v === 'string') {
                this._parentField = v;
            } else {
                throw "Incorrect parent field name";
            }
        }
    },
    properties : {
        "parentField" : "String",
        "loop" : { type: "boolean", defaultValue: true, nullable : false },
        "base" : { type: "boolean", defaultValue: false, nullable : false }
    },
    methods : {
         /**
         * <ul>
         * <li>Returns true to specify to loop to get as many levels as possible.</li>
         * <li>Returns false to specify to get from this key, one level or 
         * two if the parent field is pecify.</li>
         * </il>
         * @returns {Boolean}
         */
        isLoop:function() {
            return this._loop;
        },
        /**
         * 
         * @param {Boolean} loop
         * @returns {SereniX.TreeNodeMetadata}
         */
        setLoop:function(loop) {
            if (typeof loop === 'undefined') {
                throw "Undefined argument";
            }
            if (loop === null) {
                throw "Null argument";
            }
            this._loop = loop;
            return this;
        },
        /**
         * <ul>
         * <li>Returns true to specify that despite the level of this key, use the 
         * base object not the previous level object.</li>
         * <li>Returns false to specify to use the previous level object.</li>
         * </il>
         * @returns {Boolean}
         */
        isBase:function() {
            return this._base;
        },
        /**
         * 
         * @param {Boolean} base
         * @returns {SereniX.TreeNodeMetadata}
         */
        setBase:function(base) {
            if (typeof base === 'undefined') {
                throw "Undefined argument";
            }
            if (base === null) {
                throw "Null argument";
            }
            this._base = base;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getParentField:function() {
            return this._parentField;
        },
        /**
         * 
         * @param {String} parentField
         * @returns {SereniX.TreeNodeMetadata}
         */
        setParentField:function(parentField) {
            if (typeof parentField === 'undefined' || parentField === null) {
                parentField = "";
            }
            if (typeof parentField !== 'string') {
                incorrectArg(); //throw "Incorrect argument" exception;
            }
            this._parentField = parentField;
            return this;
        }
    }
});

/**
 * 
 * @class SereniX.TreeHashKey
 */
Klass.Class({
    name: 'TreeHashKey',
    namespace: 'SereniX',
    construct : function() {
        this._base = true;
        function _set(o) {
            if (typeof o === 'string') {
                if (!o) {
                    throw "Empty key";
                }
                this._key = [o];
                this._base = SereniX.TreeHashKey.STRING_HASHKEY_DEFAULT_BASE;
                return;
            }
            var key = o.key||o.Key||o.keys||o.Keys||o.field||o.Field||o.fields||o.Fields;
            if (typeof key === 'string') {
                if (key === '') {
                    throw "Empty key";
                }
                this._key = [key];
                this._base = SereniX.TreeHashKey.STRING_HASHKEY_DEFAULT_BASE;
            } else if (isArray(key)) {
                var n = key.length;
                this._key = [];
                for (var i = 0; i < n; i++) {
                    if (typeof key[i] === 'string') {
                        this._key[i] = key[i];
                    } else {
                        throw "Incorrect array argument";
                    }
                }
            } else {
                this._key = [];
            }
            var mo = o.base||o.Base
                    ||o.metaObject||o.metaobject||o.metadata||o.metaData
                    ||o.MetaObject||o.Metaobject||o.Metadata||o.MetaData
                    ||o.meta||o.Meta;
            this.setBase(mo);
        }
        var parent;
        if (arguments.length > 1 && (arguments[1] instanceof SereniX.TreeHashKey)) {
            _set.apply(this, [arguments[0]]);
            this.setParent(arguments[1]);
        } else if (arguments.length > 1 && (typeof (parent = arguments[arguments.length -1]) === 'object') && parent) {
            if (parent instanceof SereniX.TreeHashKey) {
                this._key = [];
                var a= arguments, n = a.length -1;
                for (var i = 0; i < n; i++) {
                    if (typeof a[i] !== 'string') {
                        throw "Array of string expected";
                    }
                    if (a[i] === '') {
                        throw "Empty string element";
                    }
                    this._key[i] = a[i];
                }
                this.setParent(new SereniX.TreeHashKey(parent));
            } else {
                this.setParent(parent);
            }
        } else if (arguments.length > 0) {
            var o = arguments[0];
            if (o && (typeof o === 'object')) {
                _set.apply(this, [o]);
                if (o.parent instanceof SereniX.TreeHashKey) {
                    this.setParent(o.parent);
                } else if (o.parent && (typeof o.parent === 'object')) {
                    this.setParent(new SereniX.TreeHashKey(o.parent));
                }
            }
        }  else {
            this._parent = null;
            this._key = "";
        }
    },
    properties : {
        "key": { type: "String|Array<String>", nullable: false },
        "parent" : { type: "SereniX.TreeHashKey", nullable: true },
        "base" : { type: "SereniX.TreeNodeMetadata|Object|Function|String|Boolean", nullable : true }
    },
    methods: {
        /**
         * 
         * @returns {SereniX.TreeHashKey}
         */
        getParent: function() {
            return this._parent;
        },
        /**
         * 
         * @param {SereniX.TreeHashKey|Object} p
         * @returns {SereniX.TreeHashKey}
         */
        setParent:function(p) {
            if (p === null || typeof p === 'undefined') {
                this._parent = null;
            } else if (p instanceof SereniX.TreeHashKey) {
                this._parent = p;
            } else if (p && typeof p === 'object') {
                this._parent = new SereniX.TreeHashKey(p);
            }
            return this;
        },
        /**
         * 
         * @returns {Array&lt;String&gt;|String}
         */
        getKey:function() {
            return this._key;
        },
        /**
         * 
         * @param {type} key
         * @returns {SereniX.TreeHashKey}
         */
        setKey:function(key) {
            function _set(key) {
                var n = key.length -1;
                for (var i = 0; i < n; i++) {
                    if (typeof key[i] !== 'string') {
                        throw "Array of string expected";
                    }
                    if (key[i] === '') {
                        throw "Empty string element";
                    }
                    this._key[i] = key[i];
                }
            }
            if (arguments.length === 1) {
                if (typeof key === 'string') {
                    if (key === '') {
                        throw "Empty string key";
                    }
                    this._key = [key];
                } else if (isArray(key)) {
                    _set(key);
                }
            } else if (arguments.length > 0) {
                _set(arguments);
            } else {
                throw "Argument expected";
            }
            return this;
        },
        /**
         * 
         * @returns {Object|Function|String|Boolean}
         */
        getBase:function() {
            return this._base;
        },
        /**
         * 
         * @param {Object|Function|String|Boolean} mo The meta object to set
         * @returns {SereniX.TreeHashKey}
         */
        setBase:function(mo) {
            var type = typeof mo;
            if (type === 'undefined' || mo === null) {
                this._base = null;
            } else if (!isArray(mo) && ((type === 'function') || (type === 'object') || type === 'string')) {
                this._base = mo;
            } else {
                throw "Incorrect meta object";
            }
            return this;
        }
    }
});

SereniX.TreeHashKey.__SINCE__ = "2020-08-20"; 
SereniX.TreeHashKey.SINCE = "2020-08-20";

SereniX.TreeHashKey.__VERSION__ = "1.0.0"; 
SereniX.TreeHashKey.VERSION = "1.0.0";

SereniX.TreeHashKey.__AUTHOR__ = "Marc KAMGA Olivier <mkamga.olivier@gmail.com;kamga_marco@yahoo.com>"; 
SereniX.TreeHashKey.AUTHOR = SereniX.TreeHashKey.__AUTHOR__ ;
/**
 * 
 * @class SereniX.Text
 */
Klass.Class({
    name: 'Text',
    namespace: 'SereniX',
    methods : {
        /**
         * 
         * @param {Object} item
         * @param {Object} options
         * @returns {String}
         */
        getText:function(item, options) {
            throw "Abstract method call";
        }
    }
});
/**
 * 
 * @param {Object} txt
 * @returns {Function|SereniX.Text|Object}
 */
SereniX.Text.getText = function getText(txt) {
    if (typeof txt === 'undefined') {
        throw "Undefined text";
    } else if (txt === null) {
        throw "Null text";
    } else if ((typeof txt === 'function') 
            || (txt instanceof SereniX.Text)
            || (typeof txt === 'object')) {
        return txt;
    }
    throw "Incorrect argument: expected SereniX.Text, Function or Object";
};



/**
 * 
 * @class SereniX.Text
 */
Klass.Class({
    name: 'FText',
    namespace: 'SereniX',
    superClass: SereniX.Text,
    construct : function() {
        if (arguments.length > 0) {
            this.setProcess(arguments[0]);
        }
    },
    properties : {
        "process" : { "type": "function", nullable: true }
    },
    methods : {
        /**
         * 
         * @param {Object} item
         * @param {Object} [options=null]
         * @returns {String}
         */
        getText:function(item, options) {
            return this.__process_(item, options);
        }
    }
});

/**
 * Returns true if the array contain the given element.Otherwise, returns false.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Boolean}
 */
function arrayContains(arr, e, compare) {
    if (!compare) {
        return arr.indexOf(e) >= 0;
    }
    if (typeof compare === 'function') {
        var found = false;
        for (var j = 0; j < arr.length; j++) {
            if (compare(e,arr[j]) === 0) { // if equals
                found = true;
                break;
            }
        }
        return found;
    }
    if (typeof compare.compare === 'function') {
        var found = false;
        for (var j = 0; j < arr.length; j++) {
            if (compare.compare(e,arr[j]) === 0) { // if equals
                found = true;
                break;
            }
        }
        return found;
    }
    throw new Error("Incorrect comparator");
}
/**
 * Returns true if the array contain the given element.Otherwise, returns false.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Boolean}
 */
var arrContains = arrayContains;
/**
 * Returns true if the array contain the given element.Otherwise, returns false.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Boolean}
 */
var aContains = arrayContains;
/**
 * Returns zero or positive integer if the array contain the given element.Otherwise, returns negative integer.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Number}
 */
function arrayIndexOf(arr, e, compare) {
    if (!compare) {
        return arr.indexOf(e) >= 0;
    }
    if (typeof compare === 'function') {
        for (var j = 0; j < arr.length; j++) {
            if (compare(e,arr[j]) === 0) { // if equals
                return j;
            }
        }
        return -1;
    }
    if (typeof compare.compare === 'function') {
        for (var j = 0; j < arr.length; j++) {
            if (compare.compare(e,arr[j]) === 0) { // if equals
                return j;
            }
        }
        return -1;
    }
    throw new Error("Incorrect comparator");
}
/**
 * Returns zero or positive integer if the array contain the given element.Otherwise, returns negative integer.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Number}
 */
var arrIndexOf = arrayIndexOf;
/**
 * Returns zero or positive integer if the array contain the given element.Otherwise, returns negative integer.
 * @param {Array} arr
 * @param {type} e
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Number}
 */
var aIndexOf = arrayIndexOf;
/**
 * 
 * @param {type} s1
 * @param {type} s2
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Array}
 */
function intersect(s1, s2, compare) {
    var res = [], e;
    if (!compare) {
        for (var i = 0, n = s1.length; i < n; i++) {
            e = s1[i];
            if (s2.indexOf(e) >= 0) {
                if (res.indexOf(e) < 0) {
                    res[res.length] = e;
                }
            }
        }
    } else {
        for (var i = 0, n = s1.length; i < n; i++) {
            e = s1[i];
            if (arrayContains(s2, e, compare)) {
                if (!arrayContains(res,e)) {
                    res[res.length] = e;
                }
            }
        }
    }
    return res;
}
/**
 * Returns true if the two sets have the same length and the same elements
 * @param {Array} s1
 * @param {Array} s2
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Boolean}
 */
function setEquals(s1, s2, compare) {
    var n = s1.length;
    if (n !== s2.length) {
        return false;
    }
    if (!compare) {
        for (var i = 0; i < n; i++) {
            if (s2.indexOf(s1[i]) < 0) {
                return false;
            }
        }
    } else if (typeof compare === 'function') {
        for (var i = 0; i < n; i++) {
            for (var k = 0; k < s2.length; k++) {
                if (compare(s2[k], s1[i]) !== 0) {
                    return false;
                }
            }
        }
    }  else if (typeof compare.compare === 'function') {
        for (var i = 0; i < n; i++) {
            for (var k = 0; k < s2.length; k++) {
                if (compare.compare(s2[k], s1[i]) !== 0) {
                    return false;
                }
            }
        }
    } else {
        throw new Error("Incorrect comparator");
    }
    return true;
}
/**
 * Returns an array that contains distinct elements retrieved from the given 
 * array set.
 * @param {Array} s  The array set to retrieve distinct elements.
 * @param {Function|Object} [compare=null] The compare function or the comparator object. 
 *     <p>The valid cases are the followings:</p>
 *     <ul>
 *     <li>No compare argument or each value evaluated to false (null, undefined, false, 0, ''): '===' operator will be used to compare elements</li>
 *     <li>compare as function:  it should returns 0 when the two arguments are equals. </li>
 *     <li>compare as plain object with compare method: compare method should returns 0 when the two arguments are equals. </li>
 *     </ul>
 * @returns {Array|distinct.res}
 * @throws {Error} When compare argument is incorrect
 */
function distinct(s, compare) {
    var res = [], e;
    if (!compare) {
        for (var i = 0, n = s.length; i < n; i++) {
            e = s[i];
            if (res.indexOf(e) < 0) {
                res[res.length] = e;
            }
        }
    } else if (typeof compare === 'function') {
        var found;
        for (var i = 0, n = s.length; i < n; i++) {
            e = s[i];
            found = false;
            for (var j = 0; j < res.length; j++) {
                if (compare(e,res[j]) === 0) { // if equals
                    found = true;
                    break;
                }
            }
            if (!found) {
                res[res.length] = e;
            }
        }
    } else if (typeof compare.compare === 'function') {
        var found;
        for (var i = 0, n = s.length; i < n; i++) {
            e = s[i];
            found = false;
            for (var j = 0; j < res.length; j++) {
                if (compare.compare(e,res[j]) === 0) { // if equals
                    found = true;
                    break;
                }
            }
            if (!found) {
                res[res.length] = e;
            }
        }
    } else {
        throw new Error("Incorrect comparator");
    }
    return res;
}

/**
 * 
 * Source: http://rosskendall.com/blog/web/javascript-function-to-check-an-email-address-conforms-to-rfc822
 * @param {String} sEmail
 * @returns {Boolean}
 * 
 */
function isRFC822ValidEmail(sEmail) {

  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string
  
  var reValidEmail = new RegExp(sValidEmail);
  
  if (reValidEmail.test(sEmail)) {
    return true;
  }
  
  return false;
}

var TextPattern = (function() {
    /**
     * 
     * @class SereniX.Text
     */
    Klass.Class({
        name: 'TextPattern',
        namespace: 'SereniX',
        superClass: SereniX.Text,
        /**
         * 
         * @param {String|Object} [p] The pattern
         * @param {Array|Object} [fields=[]]
         * @param {Object} [variables=globalNS]
         * @constructor
         */
        construct : function(p, fields, variables) {
            if (typeof p === 'object' && p) {
                this.setPattern(p.pattern||p.text||p.template||"");
                this.setFields(fields||p.fields||p.fieldNames||p.Fields||p.FieldNames||[]);
                this.setVariables(variables||p.variables||p.options||p.Variables||p.Options||globalNS);
            } else if (arguments.length === 2) {
                this.setPattern(p);
                this.setFields(fields);
                this.setVariables(globalNS);
            } else if (arguments.length > 2) {
                this.setPattern(p);
                this.setFields(fields);
                this.setVariables(variables);
            }
        },
        properties : {
            pattern: { type: "String" , defaultValue: "", nullable: false},
            fields: { type: "Array<String>" , nullable: false},
            /**
             * 
             * @property {Object} variables
             */
            variables: { type: "object" , nullable: true, defaultValue: globalNS },
            quoteAsEscaper: { type: "boolean" , defaultValue: false, nullable: false},
            /**
             * 
             * @property {Object} variableMarkers
             */
            variableMarkers : {
                type : new SereniX.types.ObjectType({
                    name: 'VariableMarkers',
                    fields : {
                        open: { type: 'string', required: true },
                        close: { type: 'string', required: true },
                        expressionStarter : { type: 'string', required: true }
                    }
                }),
                default : { open: "${", close: "}", expressionStarter:':' }
            },
            /**
             * 
             * @property {Object} referenceMarkers
             */
            referenceMarkers : { 
                type : new SereniX.types.ObjectType({
                    name: 'ReferenceMarkers',
                    fields : {
                        open: { type: 'string', required: true },
                        close: { type: 'string', required: true }
                    }
                }),
                default : { open: "${{", close: "}}" }
            },
            itemVariableName : 'string'
        },
        methods : {
            /**
             * 
             * @param {char} ch The character to check if it's quote escaper
             * @param {type} qt The quote
             * @returns {Boolean}
             */
            isEcaper:function(ch, qt) {
                if (this.isQuoteAsEscaper()) {
                    return ch === qt;
                }
                return ch === '\\';
            },
            /**
             * 
             * @returns {SereniX.ExpressionEvaluator}
             */
            getEvaluator : function() {
                var ev = this.__evaluator_;
                if (!ev) {                   
                    ev = this.__evaluator_ = new SereniX.ExpressionEvaluator();
                }
                return ev;
            },
            /**
             * 
             * @param {type} evaluator
             * @returns {serenix_class_base_L13445.serenix_class_baseAnonym$133.methods}
             */
            setEvaluator : function(evaluator) {
                this.__evaluator_ = evaluator instanceof SereniX.ExpressionEvaluator ? evaluator : SereniX.ExpressionEvaluator.getInstance(evaluator);
                return this;
            },
            /**
             * 
             * @param {Expression|String} expr
             * @param {Object} [item]
             * @returns {Number|String|Boolean|Object|Array|Function}
             */
            evaluate:function(expr, item, variables) {
                var 
                    //references are variables locale to the pattern
                    references = this.__references__,
                    v, 
                    fields = this.getFields(), vars = {};
                variables = variables||this.getVariables();
                function merge(variables) {
                    for (var name in variables) {
                        vars[name] = variables[name];
                    }
                }
                if (!item && !references) {
                    vars = variables||(typeof globalNS === 'undefined' ? {} : globalNS);
                } else {
                    merge(variables||{});
                    merge(references||{}); 
                    var _item = typeof item === 'object' && item;
                    if (_item) {
                        if (!this.__itemVariableName_ && (!fields || !fields.length)) {
                            vars['this'] = item;
                        } else {
                            if (this.__itemVariableName_) {
                                vars[this.__itemVariableName_] = item;
                            }
                            if (isArray(fields)) {
                                var f;
                                for (var i = 0, n = fields.length; i < n; i++) {
                                    vars[f = fields[i]] = item[f];
                                }
                            }
                        }
                    }
                }
                return this.getEvaluator().evaluate(expr, vars);                
            },
            /**
             * 
             * @returns {Array}
             */
            tokenize: function() {
                var varMarkers = this.variableMarkers,
                    varOpener = varMarkers ? varMarkers.open : null,
                    varCloser = varMarkers ? varMarkers.close : null;
                var refMarkers = this.referenceMarkers, refOpener = refMarkers ? refMarkers.open : null, refCloser = refMarkers ? refMarkers.close : null;
                var pattern = this.getPattern();
                var chars = "abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWYZ_0123456789";
                var tokens = [],
                    name,
                    closers = [],
                    openers = [],
                    i = 0,
                    n = pattern.length, text = "",
                    ch, _var = 0, _ref = 0, tok, expr,
                    ofs = 0, exprStarter = varMarkers ? varMarkers.expressionStarter : '', exprStart;
                function _expressionStart() {
                    return exprStarter && pattern.startsWith(exprStarter, i) ? exprStarter : 0;
                }
                if (varCloser) {
                    if (refCloser) {
                        if (varCloser.length < refCloser.length) {
                            closers = [refCloser, varCloser];
                        } else {
                            closers = [varCloser, refCloser];
                        }
                    } else {
                        closers = [varCloser];
                    }
                } else if (refCloser) {
                    closers = [refCloser];
                }
                function isClose() {
                    for (var j = 0, n = closers.length; j < n; j++) {
                        if (pattern.startsWith(closers[j], i)) return closers[j];
                    }
                }
                if (varOpener) {
                    if (refOpener) {
                        if (varOpener.length < refOpener.length) {
                            openers = [refOpener, varOpener];
                        } else {
                            openers = [varOpener, refOpener];
                        }
                    } else {
                        openers = [varOpener];
                    }
                } else if (refOpener) {
                    openers = [refOpener];
                }
                function isOpen() {
                    for (var j = 0, n = openers.length; j < n; j++) {
                        if (pattern.startsWith(openers[j], i)) return openers[j];
                    }
                }
                var escapables = {
                    'n' : '\n', 't': '\t', 'r' : '\r', 'b': '\b', 'v': '\v', '0': '\0'
                };
                var closer, opener;
                while ( i < n) {
                    if (_var || _ref) {
                        ch = pattern[i];
                        if (closer = isClose()) {
                            name = pattern.substring(ofs, i).trim();
                            if (name.length === 0) {
                                throw new Error("Incorrect pattern text: '" + pattern + "'");
                            }
                            if (_ref) {
                                if (i + 1 < n && pattern[i + 1] === ch) {
                                    tokens[tokens.length] = { reference: name };
                                } else {
                                    throw new Error("Unexpected character '}'");
                                }
                                _ref = 0;
                            } else if (_var) {
                                tokens[tokens.length] = { name: name };
                                _var =  0;
                            }
                            i += closer.length;
                            ofs = i;
                        } else if (" \t\b\0".indexOf(ch)  < 0) {
                            if (_var === i) {
                                _var = i;
                            } else if (_ref === i) {
                                _ref = i;
                            }
                            ++i;
                        } else if (ch === '\n' || ch === '\r') {
                            throw new Error("Unexpected new line character: '" + (ch === '\n' ? "\\n" : "\\r") + "'");
                        } else if (chars.indexOf(ch) < 0 ) {
                            throw new Error("Incorrect pattern text: '" + pattern + "'");
                        } else if (exprStart = _expressionStart()) {
                            if (_var) {
                                name = pattern.substring(ofs, i).trim();
                                if (name.length === 0) {
                                    throw new Error("Incorrect pattern text: '" + pattern + "'");
                                }
                                expr = this.parseExpression(pattern, i + exprStart.length, n, varCloser);
                                tokens[tokens.length] = tok = { name: name, expression: expr.expression };
                                ofs = i = expr.index + varCloser.length;
                            } else if (_ref) {
                                throw new Error("Unexpected character ':'");
                            }                            
                        } else {
                            i++;
                        }
                    } else if (opener = isOpen()) {
                        if (_var || _ref) {
                            throw new Error("Unexpected '" + opener + "'");
                        }
                        i += opener.length;
                        if (opener === varOpener) {
                            _var = i;
                        } else {
                            _ref = i;
                        }
                    } else {
                        ch = pattern[i];
                        if (ch === '\\') {
                            if (_var || _ref) {
                                throw new Error("Unepected character '\\'");
                            }
                            if (['$', '\\', '}', '<', '>', '"', '\''].indexOf(ch = pattern[i + 1]) >= 0) {
                                text += pattern.substring(ofs, i)+ ch;
                                i += 2;
                                ofs = i;
                            } else if (['n', 't', 'r', 'b', 'v', '0'].indexOf(ch) >= 0) {                            
                                text += pattern.substring(ofs, i)+ escapables[ch];
                                i += 2;
                                ofs = i;
                            } else {
                                i++;
                            }
                        } else {
                            i++;
                        }
                    }
                }
                if (_var || _ref) {
                    throw new Error("Unepected end");
                }
                tokens[tokens.length] = { text: text + pattern.substring(ofs) };
                this._tokens = tokens;
                return tokens;
            },
            /**
             * 
             * @param {String|Number|Boolean|Object|Array} value
             * @param {type} field
             * @returns {String}
             * @todo
             */
            getStringValue:function(value, field) {
                //TODO
                return typeof value === 'undefined' || value === null ? 
                        "" : value.toString();
            },
            /**
             * 
             * @param {String} ref
             * @param {Object} item
             * @param {Object} [vars]
             * @returns {type}
             */
            getRefValue: function(ref, item, vars) {
                var refs = this.__references__, fields = this.getFields()||[];
                if (fields.indexOf(ref) >= 0 && item) {
                    for (var name in item) {
                        if(name === ref)
                            return "" + (item[ref]||"");
                    }
                    return "";
                }
                for (var name in refs) {
                    if(name === ref)
                        return refs[ref];
                }
                var variables = vars||this.getVariables()||globalNS, toks = ref.split(/\./g), v = variables[ref];
                if (v !== undefined) return v;
                v = variables;
                toks.forEach(function (name) {
                    v = v[name];
                });
                return this.getStringValue(v);
            },
            /**
             * Substitutes/replaces the variables in the pattern string and 
             * returns the substitution string.
             * @param {Object} [item]
             * @param {Object} [options] When specified and not null and not undefined, substitute the TexPattern object variables
             * @returns {String} The substitution string.
             */
            getText:function(item, options) {

                if (!this._tokens) {
                    this.tokenize();                
                }
                var text = "", 
                    _this = this,
                    fields = this.getFields()||[], 
                    variables = options||this.getVariables()||(typeof globalNS === undefined ? {} : globalNS),
                    references // initialize the references
                ;
                var vars = variables;
                this._tokens.forEach(function(tok) {
                    if (tok.name) { //variable case with possible declaration
                        var v;
                        if (tok.expression) {
                            v = _this.evaluate(tok.expression, item, vars);
                            if (tok.name) {
                                if (!references) {
                                    var _vars = {};
                                    for (var name in vars) {
                                        _vars[name] = vars[name];
                                    }
                                    references = true;
                                    _vars = vars;
                                }
                                vars[tok.name] = v;
                            }
                            text += _this.getStringValue(v, tok.name);
                        } else if (fields.indexOf(tok.name) >= 0) {
                            v = item[tok.name];
                            text += _this.getStringValue(v, tok.name);
                        } else {
                            v = vars[tok.name];
                            text += _this.getStringValue(v);
                        }                    
                    } else if (tok.reference) { //variable name or field name
                        text += _this.getRefValue(tok.reference, item, vars);
                    } else {
                        text += tok.text||"";
                    }
                });
                return text;
            },
            /**
             * 
             * @param {Object} [item]
             * @param {Object} [options]
             * @returns {String}
             */
            getHTMLString: function(item, options) {
                return escapeHTML(this.getText(item, options)||"");
            }
        }
    });
    SereniX.TextPattern.prototype.value = SereniX.TextPattern.prototype.getText;

    return SereniX.TextPattern;

})();

var HTMLTextPattern = (function() {
    
    Klass.Class({ 
        name: 'SereniX.HTMLTextPattern',
        super: TextPattern,
        methods : {
            /**
             * 
             * @param {Object} [item]
             * @param {Object} [options]
             * @returns {String}
             */
            getHTMLString: function(item, options) {
                return this.getText(item, options);
            },
            /**
             * 
             * @param {Object} [item]
             * @param {Object} [options]
             * @returns {String}
             */
            value : function(item, options) {
                var result = "",
                    _svg, _img,
                    cell, cells = [], i = 0;
                var s = this.getText(item, options);
                var $3, $4, $5, $6, match, 
                    re = /<(br)>|<(br)\/>|<([\w_-][\w_0-9-]*)(?:\s+[^>]+)?\s*(?:(\/)?>)|<\/([\w_-][\w_0-9-]*)\s*>|(&(?:#[0-9a-fA-F]+|[a-zA-Z]+))/g;
                while (match = re.exec(s)) {
                    if (_svg) {
                        if (match[5] === 'svg') {//ignore the content until the </svg> encountered
                            _svg = false;
                        }
                    } else if (_img) {
                        if (match[5] === 'img') {//ignore the content until the </img> encountered
                            _svg = false;
                        }
                    } else {
                        result += s.substring(i, re.lastIndex - match[0].length);
                        if (match[1] || match[2]) {
                            result += "\n";
                        } else if ( ($3 = match[3]) && ['div', 'table', 'tr', 'section'].indexOf($3) >= 0) {
                            cells.push(cell);
                            cell = false;
                            result += "\n";
                        } else if ($3 === 'p') {
                            result += "\n\n";
                        } else if (['td', 'th', 'tr'].indexOf($3) >= 0) {
                            if (cell) {
                                result += "\t";
                            } else {
                                cell = true;
                            }
                        } else if ($3 === 'svg') {
                            _svg = true;
                        } else if ($3 === 'img') {
                            _img = !match[4];
                        } else if ($3) {
                            //TODO
                        } else if ($5=match[5]) {
                            if ($5 === 'table') {
                                cell = cells[cells.length - 1];
                            } else if ($5 === 'svg') {
                                _svg = false;
                            }
                        } else if ($6 = match[6]) {//HTML escape entities
                            if ($6.startsWith("&#")) {

                            } else {

                            }
                        }
                        i = re.lastIndex;
                    }
                }
                return result + (_img || _svg ? "" : s.substring(i));
            },
            /**
             * 
             * @param {String|Number|Boolean|Object|Array} value
             * @param {type} field
             * @returns {String}
             * @todo
             */
            getStringValue:function(value, field) {
                //TODO
                return typeof value === 'undefined' || value === null ? 
                        "" : escapeHTML(value.toString());
            }
        }
    });
    
    return HTMLTextPattern;
    
})();
/**
 * 
 * @type RegExp
 */
var SERENIX_DOUBLE_QUOTED_SUBSTRING_BASE_RE  = /"[^"]*"/;
/**
 * 
 * @type RegExp
 */
var SERENIX_SINGLE_QUOTED_SUBSTRING_BASE_RE  = /'[^']*'/;


/**
 * 
 * @type RegExp
 */
TextPattern.DOUBLE_QUOTED_SUBSTRING_BASE_RE  = /"[^"]*"/;
/**
 * 
 * @type RegExp
 */
TextPattern.SINGLE_QUOTED_SUBSTRING_BASE_RE  = /'[^']*'/;







/**
 * 
 * @class SereniX.Text
 */
Klass.Class({
    name: 'PText',
    namespace: 'SereniX',
    superClass: SereniX.Text,
    /**
     * 
     * @param {Object} processor
     * @returns {undefined}
     */
    construct : function(processor) {
        if (arguments.length > 0) {
            this.setProcessor(processor);
        }
    },
    properties : {
        "processor" : { "type": "object", nullable: true }
    },
    methods : {
        /**
         * 
         * @param {Object} processor
         * @returns {SereniX.PText}
         */
        setProcessor:function(processor) {
            if (!isPlainObject(processor)) {
                incorrectArgs(); //throw "Incorrect arguments" exception;
            }
            var compute;
            if (typeof (compute = processor.compute) === 'function') {
                this.__processor_ = { owner: processor, method: processor.compute };
            } else if (typeof (compute = processor.process) === 'function') {
                this.__processor_ = { owner: processor, method: processor.process };
            } else if (typeof (compute = processor.calcText) === 'function') {
                this.__processor_ = { owner: processor, method: processor.calcText };
            } else if (typeof (compute = processor.getText) === 'function') {
                this.__processor_ = { owner: processor, method: processor.compute };
            }  else {
                incorrectArgs(); //throw "Incorrect arguments" exception;
            }
            return this;
        },
        /**
         * 
         * @param {Object} item
         * @param {Object} [options=null]
         * @returns {String}
         */
        getText:function(item, options) {
            return this.__processor_.method.apply(this.__processor_.owner, [item, options]);
        }
    }
});

/**
 * 
 * @class SereniX.MetaNode
 */
Klass.Class({
    name: 'MetaNode',
    namespace: 'SereniX',
    superClass : SereniX.TreeHashKey,
    construct : function() {
        SereniX.TreeHashKey.__CONSTRUCTOR__.apply(this, arguments);
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isArray(a)) {
                
            } else if (typeof a === 'object'  && a) {
                var txt = a.label||a.caption||a.Label||a.Caption;
                if (txt === null) {
                    this._label = null;
                } else {
                    this._label = SereniX.Text.getText(txt);
                }
                txt = a.tooltip||a.Tooltip||a.tip||null;
                if (txt === null) {
                    this._tooltip = null;
                } else {
                    this._tooltip = SereniX.Text.getText(txt);
                }
            }
            
        } else if (arguments.length > 1) {
            
        }
    },
    properties : {
        "label" : { "type": "Function|SereniX.Text|Object", nullable: true },
        "tooltip" : { "type": "Function|SereniX.Text|Object", nullable: true }
    },
    methods : {
        /**
         * 
         * @returns {type}
         */
        getLabel : function() {
            return this._label;
        },
        /**
         * 
         * @param {Function|SereniX.Text|Object} label
         * @returns {SereniX.MetaNode}
         */
        setLabel:function(label) {
            var typeOf;
            if (!(((typeOf = typeof label) === 'function') 
                    || (label instanceof SereniX.Text)
                    || (typeOf === 'object' && label))) {
                incorrectArg(); //throw "Incorrect argument" exception;
            }
            this._label = label;
            return this;
        },
        /**
         * 
         * @returns {type}
         */
        getTooltip : function() {
            return this._tooltip;
        },
        /**
         * 
         * @param {Function|SereniX.Text|Object} tooltip
         * @returns {SereniX.MetaNode}
         */
        setTooltip:function(tooltip) {
            if (tooltip === null) {
                this._tooltip = null;
            } else {
                this._tooltip = SereniX.Text.getText(tooltip);
            }
            return this;
        }
    }
});


/**
 * 
 * @type Boolean
 */
SereniX.TreeHashKey.STRING_HASHKEY_DEFAULT_BASE = true;

Klass.Class({
    name : "IHasher",
    namespace: "SereniX",
    "methods": {
        "class" : {
            /**
             * 
             * @param {String} str
             * @returns {unsigned int}
             */
            stringToHash: function (str) {                   
                var hash = 0;
                if (str.length === 0) return hash; 
                var ch;
                for (var i = 0; i < str.length; i++) { 
                    ch = str.charCodeAt(i); 
                    hash = ((hash << 5) - hash) + ch; 
                    hash = hash & hash; 
                } 
                return hash; 
            },
             /**
             * 
             * @param {String} str
             * @returns {unsigned int}
             */
            stringToHash2: function (str, maxLen) {                   
                var hash = 0;
                if (str.length === 0) return hash; 
                var ch, 
                    len = (maxLen > 0) && (str.length > maxLen) ? 
                            maxLen : str.length;
                for (var i = 0; i < len; i++) { 
                    ch = str.charCodeAt(i); 
                    hash = ((hash << 5) - hash) + ch; 
                    hash = hash & hash; 
                } 
                return hash; 
            },
            /**
             * 
             * @param {type} key
             * @param {unsigned int} size
             * @returns {unsigned int}
             */
            hashKey : function(key, size) {
                return key.toString().length % size;
            },
            /**
             * 
             * @param {type} str
             * @returns {Number}
             */
            charsHash:function(str) {
                var hash = 0, len = str.length;
                for (var i=0;i< len;i++){
                    hash += str.charCodeAt(i);
                }
                return hash;
            },
            /**
             * 
             * @param {type} str
             * @param {unisigned int} len  The length of the substring to hash
             * @returns {Number}
             */
            subCharsHash:function(str, len) {
                if (arguments.length < 2 || len > str.length) {
                    len = str.length;
                }
                var hash = 0;
                for (var i=0;i< len;i++){
                    hash += str.charCodeAt(i);
                }
                return hash;
            },
            /**
             * <p>Takes a string key and converts it to an unsigned integer 
             * which will be an index.</p>
             * <p>The hash value is obtained by summing the ASCII value of each 
             * character of the given string key (the argument passed-in) using 
             * the JavaScript function charCodeAt() to return a character’s ASCII
             * value after multiplying the ASCII value by a multiplier.</p>
             * @param {String} key
             * @returns {int}
             */
            hashCode:function(key) {
                var H   = 37, total = 0, len = key.length;

                for (var i = 0; i < len; i++) {
                    total += (H * total) + key.charCodeAt(i);
                }
                return total;
            },
            /**
             * <p>Takes a string key and converts it to an unsigned integer 
             * which will be an index.</p>
             * <p>The hash value is obtained by summing the ASCII value of each 
             * character of the given string key (the argument passed-in) using 
             * the JavaScript function charCodeAt() to return a character’s ASCII
             * value after multiplying the ASCII value by a multiplier. tothis 
             * values the modulo of the given size is apply to obtain the 
             * final result.</p>
             * @param {String} key
             * @param {unsigned int} size
             * @returns {int}
             */
            hash:function(key, size) {
                var H   = 37, total = 0, len = key.length;

                for (var i = 0; i < len; i++) {
                    total += H * total + key.charCodeAt(i);
                }
                total %= size;
                if (total < 1) {
                    total = size -1;
                }
                return parseInt(total);
            },
            /**
             * 
             * @param {String} str
             * @param {unsigned int} size
             * @param {unsigned int} maxLen
             * @returns {int}
             */
            hash2:function(str, size, maxLen) {
                var H   = 37, total = 0;
                if (maxLen > str.length) {
                    maxLen = str.length;
                }
                for (var i = 0; i < maxLen; i++) {
                    total += H * total + str.charCodeAt(i);
                }
                total %= size;
                if (total < 1) {
                    total = size -1;
                }
                return parseInt(total);
            }
        }
    }
});

Klass.Class({
    name : "StringHash",
    namespace: "SereniX",
    parentClass: SereniX.IHasher,
    methods : {
        /**
         * 
         * @param {String} key
         * @returns {unsigned int}
         */
        hash : function(key) {
            return SereniX.IHasher.stringToHash(key);
        }
    }
});

SereniX.StringHash.___inst_ = false;
/**
 * 
 * @returns {SereniX.StringHash}
 */
SereniX.StringHash.getInstance = function() {
    if (!SereniX.StringHash.___inst_) {
        SereniX.StringHash.___inst_ = new SereniX.StringHash();
    }
    return SereniX.StringHash._instance__;
};

Klass.Class({
    name : "CHashCode",
    namespace: "SereniX",
    parentClass: SereniX.IHasher,
    methods : {
        /**
         * 
         * @param {String} key
         * @returns {unsigned int}
         */
        hash : function(key) {
            return SereniX.IHasher.charsHash(key);
        }
    }
});

SereniX.CHashCode.___inst_ = false;
/**
 * 
 * @returns {SereniX.CHashCode}
 */
SereniX.CHashCode.getInstance = function() {
    if (!SereniX.CHashCode.___inst_) {
        SereniX.CHashCode.___inst_ = new SereniX.CHashCode();
    }
    return SereniX.CHashCode._instance__;
};

Klass.Class({
    name : "HashCode",
    namespace: "SereniX",
    parentClass: SereniX.IHasher,
    methods : {
        /**
         * 
         * @param {String} key
         * @returns {unsigned int}
         */
        hash : function(key) {
            return SereniX.IHasher.hashCode(key);
        }
    }
});

SereniX.HashCode.___inst_ = false;
/**
 * 
 * @returns {SereniX.HashCode}
 */
SereniX.HashCode.getInstance = function() {
    if (!SereniX.HashCode.___inst_) {
        SereniX.HashCode.___inst_ = new SereniX.HashCode();
    }
    return SereniX.HashCode._instance__;
};
Klass.Class({
    name : "BucketHashCode",
    namespace: "SereniX",
    parentClass: SereniX.IHasher,
    construct: function() {
        this._bucketSize = 1000;
        if (arguments.length > 0) {
            this.setSize(arguments[0]);
        }
    },
    properties : {
        "size" : { type: "unsigned int", nullable :  false }
    },
    methods : {
        /**
         * 
         * @returns {unsigned int}
         */
        getSize: function() {
            return this._bucketSize;
        },
        /**
         * 
         * @param {unsigned int} size
         * @returns {SereniX.BucketHashCode}
         */
        setSize : function(size) {
            if (!Number.isInteger(size)) {
                throw "Unsigned integer expected";
            }
            if (size <= 0) {
                throw "Incorrect size: " + size;
            }
            this._bucketSize = size;
            return this;
        },
        /**
         * 
         * @param {String} key
         * @returns {unsigned int}
         */
        hash : function(key) {
            return SereniX.IHasher.hashCode(key, this.size);
        }
    }
});

Klass.Class({
    name : "FHashCode",
    namespace: "SereniX",
    parentClass: SereniX.IHasher,
    /**
     * 
     * @returns {serenix_class_baseAnonym$79.construct}
     */
    construct: function() {
        if (arguments.length > 0) {
            var a = arguments[0];
            if (typeof a === 'function') {
                this.setHashFunc(a);
            } else if (typeof a === 'object' && a) {
                var maxLen = a.keyMaxLength||a.stringMaxLength||a.maxLength
                        ||a.keyMaxSize||a.stringMaxSize||a.maxSize
                        ||a.keyLength||a.stringLength||a.strlen;
                
                var h = a.hashFunc||a.hash||a.hashCode||a.hashcode
                            ||a.HashFunc||a.Hash||a.HashCode||a.Hashcode
                        ||a.process||a.compute||a.Process||a.Compute;
                if (Number.isInteger(maxLen) && maxLen > 0) {
                    this.setMaxLength = function(maxLen) {
                        if (!Number.isInteger(maxLen) || maxLen <= 0) {
                            throw "Incorrect key max length";
                        }
                        this._maxLen = maxLen;
                    };
                    this.getMaxLength = function() {
                        return this._maxLen;
                    };
                    Object.defineProperty(this, 'maxLength', 
                        {
                            configurable: true, 
                            enumerable: true, 
                            get: this.getMaxLenth, 
                            set: this.setMaxLength
                        }
                    );
                    Object.defineProperty(this, 'maxLen', 
                        {
                            configurable: true, 
                            enumerable: true, 
                            get: this.getMaxLenth, 
                            set: this.setMaxLength
                        }
                    );
                    this._maxLen = maxLen;
                    if (typeof h ==='function') {
                        if (h === SereniX.IHasher.stringToHash2) {
                            function _hash(str, size) {
                                return SereniX.IHasher.stringToHash2(str, _hash._maxLen);
                            }
                            _hash._maxLen = maxLen;
                            this.setHashFunc(_hash);
                        } else {
                            function _hash(str, size) {
                                var len = _hash._maxLen < str.length ?
                                    _hash._maxLen : str.length,
                                    sub = str.substring(0, len);
                                return _hash.compute(sub, size);
                            }
                            _hash.compute = h;
                            _hash._maxLen = maxLen;
                            this.setHashFunc(_hash);
                        }
                    } else {
                        function _hash(str, size) {
                            var t = _hash._this, 
                                max = typeof t.getMaxLength === 'function' ? 
                                    t.getMaxLength() : t._maxLen;
                            return SereniX.IHasher.hash2(str, size, max);
                        }
                        _hash._this = this;
                        this.setHashFunc(_hash);
                    }
                } else {
                    this.setHashFunc(h||SereniX.IHasher.hash);
                }
            }
        }
    },
    properties : {
        "hashFunc" : { type: "Function", nullable :  false }
    },
    methods : {
        /**
         * 
         * @returns {unsigned int}
         */
        getHashFunc: function() {
            return this._hashFunc;
        },
        /**
         * 
         * @param {Function} hashFunc
         * @returns {Function}
         */
        setHashFunc : function(hashFunc) {
            if (typeof hashFunc !== 'function') {
                throw "Expected function argument";
            }
            this._hashFunc = hashFunc;
            return this;
        },
        /**
         * 
         * @param {String} key
         * @returns {unsigned int}
         */
        hash : function(key) {
            return this._hashFunc(key, this.size);
        }
    }
});

Object.defineProperty(
    SereniX.BucketHashCode.prototype, 
    'bucketSize', 
    { 
        configurable: true,
        enumerable: true,
        get: SereniX.BucketHashCode.prototype.getSize,
        set: SereniX.BucketHashCode.prototype.setSize
    }
);
Object.defineProperty(
    SereniX.BucketHashCode.prototype, 
    'bucketsize', 
    { 
        configurable: true,
        enumerable: true,
        get: SereniX.BucketHashCode.prototype.getSize,
        set: SereniX.BucketHashCode.prototype.setSize
    }
);

Klass.Class({
    name: "HashTable",
    namespace: "SereniX",
    /**
     * 
     * @returns {undefined}
     */
    constructor : function() {
        this._bucketSize = 10000;
        this._keys = [];
        this._values = [];
        this._length = 0;
        
        if (arguments.length === 1) {
            var a = arguments[0];
            if (Number.isInteger(a)) {
                this.setSize(a);
                this._hasher = new SereniX.BucketHashCode(a);
            } else if (a && typeof a=== 'object') {
                this.setBucketSize(a.bucketSize||a.bucketsize||a.size||a.length||1000);
                var h = a.hasher||a.hash||a.Hasher||a.Hash
                        ||a.hashCode||a.Hashcode;
                if (typeof h === 'string' && h) {
                    
                } else if (h instanceof SereniX.IHasher) {
                    
                } else if (typeof h === 'function') {
                    
                } else if (typeof h === 'object' && h) {
                    
                }
            }
        }
    },
    properties : {
        "bucketSize": { type: "unsigned int" }
    },
    methods : {
        /**
         * 
         * @returns {unsigned int}
         */
        getBucketSize: function() {
            return this._bucketSize;
        },
        /**
         * 
         * @param {type} size
         * @returns {undefined}
         */
        setBucketSize: function(size) {
            if (!Number.isInteger(size)) {
                throw "Expected unsigned int bucket size";
            }
            if (size <= 0) {
                throw "Negative or nul bucket size";
            }
            if (size < SereniX.HashTable.BUCKETS_MIN) {
                throw "Bucket size less than the minium";
            }
            if (size > SereniX.HashTable.BUCKETS_MAX) {
                throw "Bucket size greater than the maxium";
            }
            this._bucketSize = size;
            this.rehash();
            return this;
        },
        /**
         * 
         * @param {type} key
         * @param {type} value
         * @returns {undefined}
         */
        set:function(key, value) {
            var i = this._hasher.hash(key);
            this._keys[i] = key;
            var list = this._values[i], n = this._length;
            this._values[i] = [value ];
            if (list) {                
                this._length = n - list.length + 1;
            } else {
                this._length = n + 1;
            }
            return this;
        },
        /**
         * 
         * @param {type} key
         * @returns {serenix_class_baseAnonym$84.methods._values}
         */
        get: function(key) {
            var i = this._hasher.hash(key, this.getSize()),
                v = this._values[i];
            if (!v) {
                return null;
            }
            return v.length === 1 ? v[0] : v;
        },
        /**
         * 
         * @returns {n|Number}
         */
        getLength:function() {
            return this._length;
        },
        /**
         * 
         * @returns {n|Number}
         */
        size: function() {
            return this._length;
        },
        /**
         * 
         * @returns {Array}
         */
        keys:function() {
            var keys = [];
            for (var i in this._keys) {
                keys[keys.length] = this._keys[i];
            }
            return keys;
        },
        /**
         * 
         * @param {type} key
         * @returns {Boolean}
         */
        hasKey:function(key) {
            return this._keys.indexOf(key) >= 0;
        },
        /**
         * 
         * @returns {Array}
         */
        values:function() {
            var values = [];
            for (var i in this._values) {
                values[values.length] = this._values[i];
            }
            return values;
        },
        /**
         * 
         * @param {type} key
         * @param {type} value
         * @returns {undefined}
         */
        put:function(key, value) {
            var i = this._hasher.hash(key, this.getSize());
            var values = this._values[i];
            if (values) {                
                values[values.length] = value;
            } else {
                this._keys[i] = key;
                this._values[i] = [value];
            }
            this._length++;
            return this;
        },
        /**
         * 
         * @returns {serenix_class_baseAnonym$84.methods}
         */
        putAll:function() {
            function putArray(arr, _this) {
                var n = arr.length, a;
                if (n === 0) {
                    return;
                }
                if (isArray(arr[0])) {
                    for (var i = 0; i < n; i++) {
                        a = arr[i];
                        _this.put(a[0], a[1]);
                    }
                } else {
                    n = (n - (n % 2))/2;
                    for (var i = 0; i < n; i++) {
                        _this.put(arr[2*i], arr[2*i + 1]);
                    }
                }
            }
            if (arguments.length === 1) {
                var a = arguments[0];
                if(isArray(a)) {
                    putArray(a, this);
                } else if (a instanceof SereniX.HashTable) {
                    var keys = a._keys, values = a._values, list, key;
                    for (var i in keys) {
                        list = values[i];
                        key = keys[i];
                        for (var j = 0; j < list.length; j++) {
                            this.put(key, list[j]);
                        }
                    }
                } else if (typeof a === 'object' && a) {
                    for (var k in a) {
                        this.put(k, a[k]);
                    }
                }
            } else {
                putArray(arguments, this);
            }
            return this;
        },
        /**
         * 
         * @returns {undefined}
         */
        rehash:function() {
            var keys = this._keys;
            var values = this._values, list;
            this._keys = [];
            this._values = [];
            
            for (var i in keys) {
                list = values[i];
                for (var j in list) {
                    this.put(keys[i], list[j]);
                }
            }
        },
        /**
         * 
         * @returns {undefined}
         */
        clear : function() {
            this._keys = [];
            this._values = [];
        }
    }
});
/**
 * 
 * @type Number
 */
SereniX.HashTable.BUCKETS_MIN = 2;
/**
 * 
 * @type Number
 */
SereniX.HashTable.BUCKETS_MAX = 65536;

/**
 * 
 * @class SereniX.TreeData 
 */
Klass.Class({
    name: 'TreeData',
    namespace: 'SereniX',
    properties : {
        /**
         * 
         * <p>The properties key and hierarchy are dual. When you set the key, 
         * the hierarchy is computed or when you  set the hierarchy, the key is 
         * computed.</p>
         */
        "key" : { type: SereniX.TreeHashKey },
        /**
         * 
         * <p>The properties key and hierarchy are dual. When you set the key, 
         * the hierarchy is computed or when you  set the hierarchy, the key is 
         * computed.</p>
         */
        "hierarchy" : { type: "Array<SereniX.TreeHashKey>" },
        /**
         * 
         */
        "data" : { type: "Array|Object" }
    },
    methods : {
        /**
         * 
         * @returns {SereniX.TreeHashKey}
         */
        getKey : function() {
            return this._key;
        },
        /**
         * 
         * @param {type} key
         * @returns {SereniX.TreeData}
         */
        setKey: function(key) {
            if (typeof key === 'undefined') {
                throw "Undefined key";
            } else if (key === null) {
                throw "Null key";
            } else if (key === '') {
                throw "Empty string key";
            } else if (typeof key === 'string') {
                this._key = new SereniX.TreeHashKey(key);
            } else if (isArray(key)) {
                this._key = new SereniX.TreeHashKey(key);
            } else if (typeof key !== 'object') {
                throw "Incorrect key";
            } else if (key instanceof SereniX.TreeHashKey) {
                this._key = key;
            } else {
                this._key = new SereniX.TreeHashKey(key);
            }
            this._hierarchy = [this._key];
            key = this._key;
            var parent;
            for (;;) {
                if (!(parent = key.getParent())) {
                    break;
                }
                this._hierarchy.splice(0, 0, parent);
                key = parent;
            }
            return this;
        },
        /**
         * @param {Boolean} force  Force hirearchy computerization?
         *         <p><b>This parameter is optional</b>.</p>
         * @returns {Array&lt;SereniX.TreeHashKey&gt;}
         */
        getHierarchy:function(force) {
            if (!this._hierarchy 
                    || (arguments.length > 0 && force) //force recalcul
                    ) {
                if (!this._key) {
                    this._hierarchy = [];
                    return this._hierarchy;
                }
                this._hierarchy = [this._key];
                var key = this._key;
                var parent;
                for (;;) {
                    if (!(parent = key.getParent())) {
                        break;
                    }
                    this._hierarchy.splice(0, 0, parent);
                    key = parent;
                }
            }
            return this._hierarchy;
        },
        /**
         * 
         * @param {type} hierarchy
         * @returns {undefined}
         */
        setHierarchy:function(hierarchy) {
            function _get(arr) {
                var n = arr.length, parent = null, k, ks = [];
                for (var i = 0; i < n; i++) {
                    k = new SereniX.TreeHashKey(arr[i]);
                    k.setParent(parent);
                    ks[i] = k;
                    parent = k;
                }
                return ks;
            }
            if (arguments.length === 1) {
                if (typeof hierarchy === 'string' && hierarchy) {
                    this._hierarchy = [ new SereniX.TreeHashKey(hierarchy) ];
                } else if (isArray(hierarchy)) {
                    this._hierarchy = _get(hierarchy);
                } else if (hierarchy && typeof hierarchy === 'object') {
                    this.setKey(hierarchy);
                } else {
                    throw "Array argument expected";
                }
            } else if (arguments.length > 1) {
                this._hierarchy = _get(arguments);
            } else {
                throw "Arguments expecetd";
            }
            this._key = this._hierarchy[this._hierarchy.length - 1];
        },
        
        /**
         * 
         * @param {type} item
         * @returns {Array&lt;String&gt;}
         */
        getPath:function(item) {
            
            function str(obj, key) {
                var s = "", v, k = key.getKey();
                if (isArray(k)) {
                    for (var i = 0; i < k.length; i++) {
                        v = obj[k[i]];
                        if (typeof v !==  'undefined' && v !== null) {
                            s += v.toString();
                        }
                    }
                } else {
                    v = obj[k];
                    if (typeof v !==  'undefined' && v !== null) {
                        s += v.toString();
                    }
                }
                return s;
            }
            
            var h = this.getHierarchy();
            if (!h || h.length === 0) {
                return [];
            }
            return this.topToDown(item, str);
        },
        /**
         * 
         * @param {type} obj
         * @param {Function|SereniX.KeyProcessor|Object} process
         * @returns {Object}
         */
        topToDown : function(obj, process) {
            /**
             * 
             * @param {type} h  The hierarchy
             * @param {type} i  The hierarchy level index
             * @param {type} n  The number of level in the hierarchy
             * @param {type} res The result/return object
             * @param {type} base The base object to get the hierarchy objects
             * @param {type} process The function to use to get the value 
             *     corresponding to the the key of the hierarchy level
             * @returns {serenix_class_baseAnonym$163.methods.topToDown._walk.res}
             */
            function _walk(h, i, n, res, base, process) {
                var res;
                if (i >= n) {
                    return res;
                }


                //initialize
                res.result[i] = ""; 
                //go down
                res = _walk(h, i + 1, n, res, base, process);
                var k = h[i], //The key of the level (index) of the hierarchy
                        mo = k.getBase(), 
                        s = "", 
                    _obj = SereniX.TreeData.getNodeElements(k, i, n, mo, res, base),
                    pfield = _obj.pfield;
                _obj = _obj.object;
                res.result[i] = process(_obj, k, i, h);
                if (pfield) {
                    var parent = _obj[pfield];                    
                    if (parent) {
                        res.result.splice(i, str(parent, k));
                        if (mo.isLoop()) {
                            for (;;) {
                                _obj = parent;
                                parent = _obj[pfield];
                                if (!parent) {
                                    break;
                                }
                                res.result.splice(i, str(parent, k));
                            }
                        }
                    }
                }
                res.object = _obj;
                return res;
            }
            
            var h = this.getHierarchy();
            var r = _walk(h, 
                    0, 
                    h.length, 
                    { result: [], object: obj }, 
                    obj, 
                    SereniX.TreeData.getLaunch(process) //process launch
                );
            return r.result;
        },
        downToTop : function(obj, process) {
            /**
             * 
             * @param {type} hierarchy  The hierarchy
             * @param {type} i  The hierarchy level index
             * @param {type} len  The number of level in the hierarchy
             * @param {type} res The result/return object
             * @param {type} base The base object to get the hierarchy objects
             * @param {type} process  The function to use to get the value 
             *     corresponding to the the key of the hierarchy level
             * @returns {serenix_class_baseAnonym$163.methods.topToDown._walk.res}
             */
            function _walk(hierarchy, i, len, res, base, process) {
                if (i < 0) {
                    return res;
                }
                var key = hierarchy[i], //key of the level i of the hierarchy
                    mo = key.getBase(), s = "", 
                    _obj = SereniX.TreeData.getNodeElements(key, i, len, mo, res, base),
                    pfield = _obj.pfield;
                _obj = _obj.object;
                
                res.result.splice(0,0, process(_obj, key, i, hierarchy));
                if (pfield) {
                    var parent = _obj[pfield];                    
                    if (parent) {
                        res.result.splice(0, str(parent, key));
                        if (mo.isLoop()) {
                            for (;;) {
                                _obj = parent;
                                parent = _obj[pfield];
                                if (!parent) {
                                    break;
                                }
                                res.result.splice(0, str(parent, key));
                            }
                        }
                    }
                }
                res.object = _obj;
                res = _walk(hierarchy, i - 1, len, res, base, process);
                return res;
            }
            var hierarchy = this.getHierarchy();
            var r = _walk(
                    hierarchy, // the hierarchy list/array
                    hierarchy.length - 1, //the last (bottom) hierarchy index
                    hierarchy.length, //the number of levels of the hierarchy
                    { result: [], object: obj }, // the current result
                    obj, // the base object to get the hierarchy
                    SereniX.TreeData.getLaunch(process) //process launch
                );
            return r.result;
        }
    }
});
/**
 * 
 * @param {type} k  The key
 * @param {type} i  The index of the key in the hierarchy 
 * @param {type} n
 * @param {type} mo
 * @param {type} res
 * @param {type} base
 * @returns {Object}
 */
SereniX.TreeData.getNodeElements = function(k, i, n, mo, res, base) {
    var _obj, //The node object
        pfield = false //The parent field
    ;
    if ((i === n - 1) 
            || (typeof mo === 'undefined') 
            || (mo === null) 
            || (mo === 'base') 
            || (mo === 'Base')) {
        _obj = base;
    } else if (mo instanceof SereniX.TreeNodeMetadata) {
        _obj = mo.isBase() ? base : res.object;
        pfield = mo.getParentField();
    } else if (!mo) {
        _obj = res.object;
    } else if (typeof mo === 'function') {
        _obj = mo(res.object, k /* the key */);  // get the value that 
                                                 //corresponds to the key
    } else if (typeof mo === 'object') {
        var po = mo.parentField||mo.ownerField||mo.parent
                ||mo.owner||mo.Parent||mo.Owner
                ||mo.getParent||mo.getOwner
                ||mo.getParentObject||mo.getOwnerObject
                ||mo.getObject,
            _base = mo.base||mo.Base,
            tpo = typeof po;
    
        if (tpo === 'function') {
            _obj = po.apply(mo, [_base ? base: res.object, k]);
        }else if (tpo === 'string') {
            _obj = (_base ? base: res.object)[po];
        } else {
            throw "Incorrect meta object";
        }
    } else if (typeof mo === 'string') {
        _obj = res.object[mo];
    } else {
        throw "Incorrect meta object";
    }
    return { object: _obj, pfield: pfield };
};
/**
 * 
 * @param {Function|SereniX.NoteItemProcessor|Object} process
 * @returns {Function}
 */
SereniX.TreeData.getLaunch = function(process) {
    if (process instanceof SereniX.NoteItemProcessor) {
        function _launch_(obj, key, keyLevel, hierarchy) {
            return _launch_.processor.process(obj, key, keyLevel, hierarchy);
        }
        _launch_.processor = process;
        return _launch_;
    } else if (typeof process === 'function') {
        return process;
    } else if (typeof process === 'object') {
        var func = process.process||process.compute||process.calc
                ||process.Process||process.Compute||process.Calc
                ||process.computeKey||process.calcKey||process.getKey
                ||process.key||process.Key;
        if (typeof func === 'function') {
            function _process_(item, key, keyLevel, hierarchy) {
                return _process_.func.apply(_process_.caller, 
                            [item, key, keyLevel, hierarchy]);
            }
            _process_.caller = process;
            _process_.func = func;

            return _process_;
        }
    }
    return null;
};
/**
 * 
 * @class SereniX.NoteItemProcessor
 * @abstract
 */
Klass.Class({
    name: 'NoteItemProcessor',
    namespace: 'SereniX',
    methods : {
        /**
         * 
         * @param {Object} obj  The node item or object
         * @param {type} key  The key representing the field to get the node id.
         * @param {unsigned int} keyLevel  <p><b>The top level corresponds to zero</b>.</p>
         * @param {Array&lt;SereniX.TreeHashKey&gt;} hirerachy  The hierarchic list of keys
         * @returns {Object}
         */
        process : function(obj, key, keyLevel, hirerachy) {
            throw "Abstract method call";
        }
    }
});

Klass.Class({
    name: 'KeyProcessor',
    namespace: 'SereniX',
    superClass: SereniX.NoteItemProcessor,
    methods : {
        /**
         * 
         * @param {type} obj
         * @param {type} key
         * @param {unsigned int} keyLevel  <p><b>The top level corresponds to zero</b>.</p>
         * @param {Array&lt;SereniX.TreeHashKey} hirerachy
         * @returns {String}
         */
        process : function(obj, key, keyLevel, hirerachy) {
            var s = "", v;
            if (isArray(key)) {
                for (var i = 0; i < key.length; i++) {
                    v = obj[key[i]];
                    if (typeof v !==  'undefined' && v !== null) {
                        s += v.toString();
                    }
                }
            } else {
                v = obj[key];
                if (typeof v !==  'undefined' && v !== null) {
                    s += v.toString();
                }
            }
            return s;
        }
    }
});

(function(p) {
    Object.defineProperty(p, 'key', {'configurable': true, 'enumerable': true, get: p.getKey, set: p.setKey});
    Object.defineProperty(p, 'parent', {'configurable': true, 'enumerable': true, get: p.getParent, set: p.setParent});
    Object.defineProperty(p, 'base', {'configurable': true, 'enumerable': true, get: p.getBase, set: p.setBase});
})(SereniX.TreeHashKey.prototype);

(function(p) {
    Object.defineProperty(p, 'key', {'configurable': true, 'enumerable': true, get: p.getKey, set: p.setKey});
    Object.defineProperty(p, 'hierarchy', {'configurable': true, 'enumerable': true, get: p.getKey, set: p.setHierarchy});    
    Object.defineProperty(p, 'data', {'configurable': true, 'enumerable': true, get: p.getData, set: p.setData});
})(SereniX.TreeData.prototype);


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
SereniX.is = SereniX.types.Type.is;

/**
 * 
 * <p>The variable <b color="blue">SrnX </b> is an alias of 
 * <b color="blue">SereniX</b> namespace.</p> 
 * <p><b>The variables </b><b color="blue">SereniX</b><b> and </b>
 * <b color="blue">SrnX </b><b>have not to be declared as variable anywhere else
 * to ensure that all funation, classes and object depending of 
 * <b color="blue">SereniX</b> namespace still working.</b></p>
 * @type SereniX.Namespace
 * @see SereniX
 */
var SrnX = SereniX;


SereniX.isRegExp = isRegExp;


/**
 * 
 *  - define(namespace: String, parent: Namespace|String, elements: Array|Object|Function)
 *  - define(namespace: String|Namespace, elements: Array|Object|Function)
 * @returns {undefined}
 */
function define() {
    var elements, parent = null, a, ns;
    a = arguments[1];
    if (a instanceof String) {
        a = a.valueOf();
    }    
    
    if (typeof a === 'string') {
        parent = Namespace.ns(a);
        a = arguments[2];
        if (isArray(a) || isPlainObject(a)) {
            elements = a;
        } else if (typeof a === 'function') {
            elements = [a];
        } else {
            throw new Error("Incorrect arguments");
        }
    } else if (a instanceof Namespace) {
        parent = a;
        a = arguments[2];
        if  (isArray(a) || isPlainObject(a)) {
            elements = a;
        } else if (typeof a === 'function') {
            elements = [a];
        } else {
            throw new Error("Incorrect arguments");
        }
    } else if  (isArray(a) || isPlainObject(a)) {
        elements = a;
    } else if (typeof a === 'function') {
        elements = [a];
    } else {
        throw new Error("Incorrect arguments");
    }
    
    a = arguments[0];
    if (a instanceof String) {
        a = a.valueOf();
    }
    if (typeof a === 'string') {
        ns = Namespace.ns(a, parent);
    } else if (a instanceof Namespace) {
        ns = a;
    } else {
        throw new Error("Incorrect namespace");
    }
    function bind(ns, name, e) {
        if (typeof e === 'function') {
            e.__NAME__ = name;
            ns.addElement(e);
            e.getFullName = function() {
                var ns = this.__NAMESPACE__||this.__namespace__||this.namespace;
                return ns.getFullName() + "." + this.__NAME__;
            };
        } else {
            ns[name] = e;
        }
    }
    if  (isArray(elements)) {
        var e;
        for (var i = 0, n = elements.length; i < n; i++) {
            e = elements[i];
            if (Namespace.isValidElement(e)) {
                ns.addElement(e);
                if (!e.getFullName && !e.getClassFullName && !e.getFullClassName) {
                    e.getFullName = function() {
                        var ns = this.__NAMESPACE__||this.__namespace__||this.namespace;
                        return ns.getFullName() + "." + (this.__CLASS_NAME__||this.__NAME__||this.name);
                    };
                    if (e.__CLASS_NAME__ ||e.__CLASS__) {
                        if (!e.__CLASS_NAME__) {
                            e.__CLASS_NAME__ = this.__NAME__||this.name;
                        }
                        e.getClassFullName  = e.getFullClassName =  e.getFullName;
                    }
                    if (!e.__CLASS_NAME__ && !e.__NAME__) {
                        e.__NAME__ = e.name;
                    }
                }
            } else if (isArray(e)) {
                if (typeof e[0] === 'string') {
                    bind(ns, e[0], e[1]);
                }
            }
        }
    } else if (isPlainObject(elements)) {
        for (var name in elements) {
            bind(ns, name, elements[name]);
        }
    }
    return ns;
}
//add the function 'define' to the namespace SereniX.
define('SereniX', define);

SrnX = SereniX;







/*
 * Add statement elements to the namepace SereniX.prog
 * The following statements require 'serenix_parser_statements.js' file to be loaded
 */


try {
        
(function() {   
    var classes = [   
        AliasDName,
        AParam,
        Accessor,
        Aggregation,
        All,
        AnonymousFunction,
        AQString,
        ArrayDimension,
        ArrayType,
        ArrowFunction,
        As,
        AsEntry,
        AsList,
        Assign,
        AutoIncrement,
        BaseIndex,
        Block,
        Call,
        Catch,
        ChainedExpressions,
        ChainedStatements,
        Class,
        ClassBody,
        Command,
        Comment,
        Comments,
        Conditional,
        Constructor,
        Continue,
        DataTypeToken,
        DOptions,
        Declaration,
        DefaultCase,
        DefaultEName,
        DefaultStatement,
        DOEntry,
        DoWhile,
        EList,
        EName,
        EmptyStatement,
        EQString,
        Expression,
        Field,
        FControl,
        ForStatement,
        ForControl,
        For,
        ForInControl,
        ForIn,
        ForOfControl,
        ForOf,
        FType,
        Func,
        Getter,
        Setter,
        Grouping,
        IComment,
        If,
        IfCase,
        Interface,
        InterfaceBody,
        Import,
        ImportElements,
        ImportSelection,
        ImportExportElt,
        Index,
        Instantiation,
        Invocation,
        LROperation,
        LStatement,
        Label,
        Litteral,
        Loop,
        MAssign,
        Method,
        EModule,
        NVariable,
        NamedFunction,
        NamedType,
        NTypeField,
        NoBodyStatement,
        NoCondition,
        Null,
        NullCoalescing,
        Numeric,
        OCIndex,
        OCRef,
        ODAssign,
        Param,
        Params,
        AQString,
        QString,        
        QSPattern,
        QuotedHintStatement,
        RefChain,
        Reference,
        RestEName,
        RestParam,
        Return,
        SBlock,
        SDeclaration,
        SIterator,
        Setter,
        Signature,
        SingleAssign,
        SkipableElt,
        SpreadEName,
        Statement,
        StatementElt,
        SType,
        Switch,
        TailEName,
        Throw,
        Try,
        UnaryOperation,
        Undefined,
        UnionType,
        VArray,
        VEName,
        VObject,
        VRegExp,
        Value,
        Variable,
        While,
        With,
        DataTypeToken,
        ParamTypes,
        FType,
        SType,
        Structure,
        NamedType,
        UnionType,
        Interface,
        InterfaceBody,
        Signature
    ];
    //add each class (represented by it's name) to the namespace
    Namespace.ns( "SereniX.prog", classes);

     var c;
    for (var i = 0, n = classes.length; i < n; i++) {
        try {
            c = classes[i];
            if (!c.__CLASS__) {
                c.__CLASS__ = c;
            }
            if (!c.prototype.__CLASS__) {
                c.prototype.__CLASS__ = c;
            }
            if (!c.prototype.__CLASS_NAME__ && c.__CLASS_NAME__) {
                c.prototype.__CLASS_NAME__ = c.__CLASS_NAME__;
            }
            c.getClassFullName = function() {
                var ns = this.__NAMESPACE__;
                if (ns) {
                    return ns.getFullName() + "." + this.__CLASS_NAME__;
                }
                return this.__CLASS_NAME__;
            };

            c.getFullClassName = c.getClassFullName;

            c.getFullName = c.getClassFullName;
        } catch (e) {}
    }

})();
} catch(ex) {}
