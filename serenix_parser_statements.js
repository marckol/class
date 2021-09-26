/* 
 * The MIT License
 *
 * Copyright 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
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

var globalNS = typeof window !== 'undefined'
        ? window
        :   typeof global === 'undefined'
            ? typeof self === 'undefined' ? this : self 
        : global;

if (typeof hasOwnProp === 'undefined') {
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
if (typeof isArray === 'undefined') {
    globalNS.isArray = Array.isArray;
}



if (!globalNS.stickyRegexMatch) {
    /**
     * 
     * @param {RegExp} re
     * @param {String} str
     * @param {Number} offset
     * @returns {Array}
     */
    globalNS.stickyRegexMatch = globalNS.stickyReMatch||function (re, str, offset) {
        if (!re || typeof str !== 'string') {
            throw new Error("Incorrect arguments");
        }
        try {
            var _xregexp;
            if (re instanceof XRegExp) {
                _xregexp = true;
                return re.exec(str, offset||0, true);
            }
        } catch (e) {
            if (_xregexp)
                throw e;
        }
        re.lastIndex = offset;
        var r = re.exec(str);
        return r && offset + str.length === re.lastIndex ? r : null;
    };

}

if (!globalNS.stickyReMatch) {
    /**
     * 
     * @param {RegExp} re
     * @param {String} str
     * @param {Number} offset
     * @returns {Array}
     */
    globalNS.stickyReMatch = stickyRegexMatch;

}


if (!globalNS.regexMatch) {
    /**
     * 
     * @param {RegExp} re
     * @param {String} str
     * @param {Number} offset
     * @param {Boolean|String} sticky
     * @returns {Array}
     */
    globalNS.regexMatch = globalNS.reMatch||function (re, str, offset, sticky) {
        if (!re || typeof str !== 'string') {
            throw new Error("Incorrect arguments");
        }
        sticky =  sticky === 'sticky' ? true : toBool(sticky);    
        try {
            var _xregexp;
            if (re instanceof XRegExp) {
                _xregexp = true;
                return re.exec(str, offset||0, sticky);
            }
        } catch (e) {
            if (_xregexp)
                throw e;
        }
        re.lastIndex = offset;
        var r = re.exec(str);
        return r && (!sticky || (offset + str.length === re.lastIndex)) ? r : null;
    }
}
if (!globalNS.reMatch) {
    /**
     * 
     * @param {type} re
     * @param {type} str
     * @param {type} offset
     * @param {type} sticky
     * @returns {Array}
     */
    globalNS.reMatch = regexMatch;

}


/**
 * 
 * @param {Object} obj
 * @param {Array&lt;String&gt;|String} names  
 * @param {Boolean} ignoreCase
 * @returns {String}
 */
function coalesceProperty(obj, names, ignoreCase) {
    if (typeof names === 'string') {
        names = names.split(/[ \t\v\b\0]+/g);
    }
    var props, n = names.length;
    var name;
    if (ignoreCase) {
        props = [].slice.call(props);
        for (var i = 0; i < n; i++) {
            name = names[i].toLowerCase();
            if (name) {
                if (props.indexOf(name) < 0)
                    props[props.length] = name;
                name = names[i].toUpperCase();
                if (props.indexOf(name) < 0)
                    props[props.length] = name;
                name = names[i];
                name = name[0].toUpperCase() + name.substring(1);
                if (props.indexOf(name) < 0)
                    props[props.length] = name;
            }
        }
        n = props.length;
    } else {
        props = names;
    }
    
    for (var i = 0; i < n; i++) {
        name = props[i];
        if (typeof name !== 'string') {
            throw new Error("Incorrect arguments");
        }
        if (typeof obj[name] !== 'undefined') {
            return name;
        }
    }
    return null;
}
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
   
   var qstringKey = "?<qstring>";
   
   /**
    * 
    * @param {type} o
    * @returns {Boolean}
    */
   function isString(o) {
       return typeof o === 'string' || o instanceof String;
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
       var e, re = "", _self, escaped;
       for (var i = 0, n = qt.length; i < n; i++) {
           q = qt[i];
           escaped = "";
           _self = false;
           for (var k = 0, l = esc.length; k <l; k++) {
               e = esc[k];
               if ((e === 'self' || e === 'quote')) {
                   if (!_self) {
                       e = q;
                       _self = true;                    
                   } else {
                       continue;
                   }
               } else if (e === '\\') {
                   e = "\\\\";
               }
               if (k > 0) {
                   escaped += "|";
               }
               escaped += e + q  ;
               if (e === "\\\\") {
                   escaped += "|" + e + e;
               }
           }
            if (re) {
                re += "|";
            }
           re += q + "((?:" + escaped + "|[^" + q+ "])*)" + q ;
       }
       if (full) {
           re = "^(?:" + re + ")$";
       }
       if (typeof groupKey === 'string') {
            if (!groupKey.startsWith('?')) {
                if (!groupKey.startsWith('<')) {
                    groupKey = "?<" + groupKey + ">";
                } else {
                    groupKey = "?" + groupKey;
                }
            }
            re = "("+ groupKey + re + ")";
        } else if (groupKey) {
            re = "(" + re + ")";
        }
       return re;
   }
    /**
     * 
     * @param {Object|String} o The operator object or the operator symbol
     * @param {String} [family=null] The family of the operator
     * @returns {String}
     */
    function getOperatorKey(o, family) {
        var symbol;
        if (isPlainObject(o)) {
            symbol = o.symbol;
            family = o.family;
        } else {
            symbol = o;
            family = arguments.length > 1 ? arguments[1]||"" : "";
        }
        if (['-', '+', '++', '--'].indexOf(symbol) >= 0 && ['prefix', 'postfix'].indexOf(family) >= 0) {
            return symbol + '[' + family + ']';
        } else {
            return symbol;
        }
    }


    var OPERATORS = [
        { precedence :0, priority: 21, family: "grouping", cardMin: 1, cardMax: 1, type: "Grouping", associativity: "n/a", symbol: "()", pattern: "( … )", opener: "(", closer: ")" },
        { precedence :1, priority: 20, family: "access", cardMin: 2, cardMax: 2, type: "Member Access", associativity: "left-to-right", symbol: ".", pattern: "… . …", opener: "", closer: "" },
        { precedence :1, priority: 20, family: "access", cardMin: 2, cardMax: 2, type: "Computed Member Access", associativity: "left-to-right", symbol: "[]", pattern: "… [ … ]", opener: "[", closer: "]" },
        { precedence :1, priority: 20, family: "call", cardMin: 2, cardMax: 2, type: "new (with argument list)", associativity: "n/a", symbol: "new", pattern: "new <name> ( … )", opener: "", closer: "" },
        { precedence :1, priority: 20, family: "call", cardMin: 2, cardMax: 2, type: "Function Call", associativity: "left-to-right", symbol: "()", pattern: "<func_name> ( … )", opener: "(", closer: ")" },
        { precedence :1, priority: 20, family: "optional chaining", cardMin: 2, cardMax: 2, type: "Optional chaining", associativity: "left-to-right", symbol: "?.", pattern: "?.", opener: "", closer: "" },
        { precedence :2, priority: 19, family: "call", cardMin: 2, cardMax: 2, type: "new (without argument list)", associativity: "right-to-left", symbol: "new", pattern: "new <name>", opener: "", closer: "" },
        { precedence :3, priority: 18, family: "postfix", cardMin: 1, cardMax: 1, type: "Postfix Increment", associativity: "left-to-right", symbol: "++", pattern: "… ++", opener: "", closer: "" },
        { precedence :3, priority: 18, family: "postfix", cardMin: 1, cardMax: 1, type: "Postfix Decrement", associativity: "left-to-right", symbol: "--", pattern: "… --", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "logic", cardMin: 1, cardMax: 1, type: "Logical NOT", associativity: "right-to-left", symbol: "!", pattern: "! …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "logic", cardMin: 1, cardMax: 1, type: "Bitwise NOT", associativity: "right-to-left", symbol: "~", pattern: "~ …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "Unary Plus", associativity: "right-to-left", symbol: "+", pattern: "+ …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "Unary Negation", associativity: "right-to-left", symbol: "-", pattern: "- …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "Prefix Increment", associativity: "right-to-left", symbol: "++", pattern: "++ …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "Prefix Decrement", associativity: "right-to-left", symbol: "--", pattern: "-- …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "typeof", associativity: "right-to-left", symbol: "typeof", pattern: "typeof …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "void", associativity: "right-to-left", symbol: "void", pattern: "void …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "delete", associativity: "right-to-left", symbol: "delete", pattern: "delete …", opener: "", closer: "" },
        { precedence :4, priority: 17, family: "prefix", cardMin: 1, cardMax: 1, type: "await", associativity: "right-to-left", symbol: "await", pattern: "await …", opener: "", closer: "" },
        { precedence :5, priority: 16, family: "multiplicative", cardMin: 2, cardMax: 2, type: "Exponentiation", associativity: "right-to-left", symbol: "**", pattern: "… ** …", opener: "", closer: "" },
        { precedence :6, priority: 15, family: "multiplicative", cardMin: 2, cardMax: 2, type: "Multiplication", associativity: "left-to-right", symbol: "*", pattern: "… * …", opener: "", closer: "" },
        { precedence :6, priority: 15, family: "multiplicative", cardMin: 2, cardMax: 2, type: "Division", associativity: "left-to-right", symbol: "/", pattern: "… / …", opener: "", closer: "" },
        { precedence :6, priority: 15, family: "multiplicative", cardMin: 2, cardMax: 2, type: "Remainder", associativity: "left-to-right", symbol: "%", pattern: "… % …", opener: "", closer: "" },
        { precedence :7, priority: 14, family: "additive", cardMin: 2, cardMax: 2, type: "Addition", associativity: "left-to-right", symbol: "+", pattern: "… + …", opener: "", closer: "" },
        { precedence :7, priority: 14, family: "additive", cardMin: 2, cardMax: 2, type: "Subtraction", associativity: "", symbol: "-", pattern: "… - …", opener: "", closer: "" },
        { precedence :8, priority: 13, family: "bitwise shift", cardMin: 2, cardMax: 2, type: "Bitwise Left Shift", associativity: "left-to-right", symbol: "<<", pattern: "… << …", opener: "", closer: "" },
        { precedence :8, priority: 13, family: "bitwise shift", cardMin: 2, cardMax: 2, type: "Bitwise Right Shift", associativity: "left-to-right", symbol: ">>", pattern: "… >> …", opener: "", closer: "" },
        { precedence :8, priority: 13, family: "bitwise shift", cardMin: 2, cardMax: 2, type: "Bitwise Unsigned Right Shift", associativity: "left-to-right", symbol: ">>>", pattern: "… >>> …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "Less Than", associativity: "left-to-right", symbol: "<", pattern: "… < …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "Less Than Or Equal", associativity: "left-to-right", symbol: "<=", pattern: "… <= …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "Greater Than", associativity: "left-to-right", symbol: ">", pattern: "… > …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "Greater Than Or Equal", associativity: "left-to-right", symbol: ">=", pattern: "… >= …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "in", associativity: "left-to-right", symbol: "in", pattern: "… in …", opener: "", closer: "" },
        { precedence :9, priority: 12, family: "relational", cardMin: 2, cardMax: 2, type: "instanceof", associativity: "left-to-right", symbol: "instanceof", pattern: "… instanceof …", opener: "", closer: "" },
        { precedence :10, priority: 11, family: "equality", cardMin: 2, cardMax: 2, type: "Equality", associativity: "left-to-right", symbol: "==", pattern: "… == …", opener: "", closer: "" },
        { precedence :10, priority: 11, family: "equality", cardMin: 2, cardMax: 2, type: "Inequality", associativity: "left-to-right", symbol: "!=", pattern: "… != …", opener: "", closer: "" },
        { precedence :10, priority: 11, family: "equality", cardMin: 2, cardMax: 2, type: "Strict Equality", associativity: "left-to-right", symbol: "===", pattern: "… === …", opener: "", closer: "" },
        { precedence :10, priority: 11, family: "equality", cardMin: 2, cardMax: 2, type: "Strict Inequality", associativity: "left-to-right", symbol: "!==", pattern: "… !== …", opener: "", closer: "" },
        { precedence :11, priority: 10, family: "bitwise logic", cardMin: 2, cardMax: 2, type: "Bitwise AND", associativity: "left-to-right", symbol: "&", pattern: "… & …", opener: "", closer: "" },
        { precedence :12, priority: 9, family: "bitwise logic", cardMin: 2, cardMax: 2, type: "Bitwise XOR", associativity: "left-to-right", symbol: "^", pattern: "… ^ …", opener: "", closer: "" },
        { precedence :13, priority: 8, family: "bitwise logical", cardMin: 2, cardMax: 2, type: "Bitwise OR", associativity: "left-to-right", symbol: "|", pattern: "… | …", opener: "", closer: "" },
        { precedence :14, priority: 7, family: "binary logical", cardMin: 2, cardMax: 2, type: "Logical AND", associativity: "left-to-right", symbol: "&&", pattern: "… && …", opener: "", closer: "" },
        { precedence :15, priority: 6, family: "binary logical", cardMin: 2, cardMax: 2, type: "Logical OR", associativity: "left-to-right", symbol: "||", pattern: "… || …", opener: "", closer: "" },
        { precedence :16, priority: 5, family: "coalescing", cardMin: 2, cardMax: 2, type: "Nullish coalescing operator", associativity: "left-to-right", symbol: "??", pattern: "… ?? …", opener: "", closer: "" },
        { precedence :17, priority: 4, family: "conditional", cardMin: 3, cardMax: 3, type: "Conditional", associativity: "left-to-right", symbol: "?:", pattern: "… ? … : …", opener: "?", closer: ":" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "=", pattern: "… = …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "+=", pattern: "… += …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "-=", pattern: "… -= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "**=", pattern: "… **= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "*=", pattern: "… *= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "/=", pattern: "… /= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "%=", pattern: "… %= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "<<=", pattern: "… <<= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: ">>=", pattern: "… >>= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: ">>>=", pattern: "… >>>= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "&=", pattern: "… &= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "^=", pattern: "… ^= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "|=", pattern: "… |= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "&&=", pattern: "… &&= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "||=", pattern: "… ||= …", opener: "", closer: "" },
        { precedence :18, priority: 3, family: "assignment", cardMin: 2, cardMax: 2, type: "Assignment", associativity: "right-to-left", symbol: "??=", pattern: "… ??= …", opener: "", closer: "" },
        { precedence :19, priority: 2, family: "yield", cardMin: 1, cardMax: 1, type: "yield", associativity: "right-to-left", symbol: "yield", pattern: "yield …", opener: "", closer: "" },
        { precedence :19, priority: 2, family: "yield", cardMin: 1, cardMax: 1, type: "yield*", associativity: "right-to-left", symbol: "yield*", pattern: "yield* …", opener: "", closer: "" },
        { precedence :20, priority: 1, family: "comma", cardMin: 2, cardMax: 2, type: "Comma / Sequence", associativity: "left-to-right", symbol: ",", pattern: "… , …", opener: "", closer: "" }
    ];

    var OPERATOR_PRECEDENCES = {}, key;
    
    var ASSIGN_OPERATORS = [];
    
    var ASSIGNMENT_OPERATORS = ASSIGN_OPERATORS;

    for (var i = 0, n = OPERATORS.length, o; i < n; i++) {
        o = OPERATORS[i];                
        OPERATOR_PRECEDENCES[ getOperatorKey(o.symbol, o.family)] = o.precedence;
        if (o.family === 'assignment') {
            ASSIGN_OPERATORS[ASSIGN_OPERATORS.length] = o.symbol;
        }
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
    * @type Array&lt;String&gt;
    */
   SERENIX_STRING_TRUE_VALUES = ['true', '1', 'on', 'yes', 'y', 't', 'oui', 'ok', 'o'];
   /**
    * 
    * @type Array&lt;String&gt;
    */
   SERENIX_STRING_FALSE_VALUES = ['false', '0', 'off', 'no', 'n', 'fo', 'non', 'ko', 'nok'];
   


    function toBool(b) {
        if (b === null || b === '') {
            if (arguments.length > 1) {
                var defVal = arguments[1];
                if (typeof defVal === 'boolean') {
                    return defVal;
                }
                if (typeof defVal === 'string') {
                    defVal = defVal.toLowerCase();
                    if (SERENIX_STRING_TRUE_VALUES.indexOf(defVal) >= 0) {
                        return true;
                    }
                    if (SERENIX_STRING_FALSE_VALUES.indexOf(defVal) >= 0) {
                        return false;
                    }
                }
            }
            return false;
        } 
        var typ = typeof b;
        if (typ === 'boolean') {
            return b;
        }
        if (typ === 'number' ) {
            return b === 0 ? false : true;
        }
        if (typ === 'undefined') {
            return false;
        }
        if (typ !== 'string' ) {
            throw "Incorrect argument";
        }
        var s = b.toLowerCase();
        if (SERENIX_STRING_TRUE_VALUES.indexOf(s) >= 0) {
            return true;
        }
        if (SERENIX_STRING_FALSE_VALUES.indexOf(s) >= 0) {
            return false;
        }
    };
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
     * Each call of incorrectArgs() function, throws a not supported exception.
     * @param {String} [msg="Incorrect arguments"]
     * @returns {undefined}
     * @throws {Error} 
     */
    function notSupported(msg) {
        throw new Error(msg||"Not supported");
    }

    /**
     * Each call of incorrectArg() function, throws a not yet supported exception.
     * @param {String} [msg="Incorrect argument"]
     * @returns {undefined}
     * @throws {Error} 
     */
    function notYetSupported(msg) {
        throw new Error(msg||"Not yet supported");
    }


    /**
     * Each call of unexpectedChar() function, throws an unexpected character exception.
     * @param {char} [ch]
     * @param {Number} [num]
     * @param {Number} [column]
     * @param {Number} [cIndex]  The character index : it's used when the line number and tha column are pecified
     * @param {String} [msg="Unexpected character"]
     * @returns {undefined}
     * @throws {Error} 
     */
    function unexpectedChar(ch, num, column, cIndex, msg) {
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
            m = msg;
        } else if (len === 4 ) {
            lineNum = num;
            if (typeof arguments[3] === 'string') {
                m = msg = arguments[3];
                cIndex = null;
            } else if (arguments[3] instanceof Number)  {
                index = cIndex.valueOf();
            } else if (Number.isInteger(cIndex)) {
                cIndex = parseInt(cIndex);
                if (cIndex >= 0) {
                    index = cIndex;
                }
            }
        } else {
            lineNum = num;
            m = (len > 1 && typeof a[1] === 'string' ? a[1]
                : (len > 3 && typeof a[3] === 'string' ? a[3] : ""))||"Unexpected character";
        }
        if (!m) m = m = "Unexpected character";
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


    function SIterator(list) {
        this.$__next_ = 0;
        if (isArray(list)) {
            this.$__list_ = list;
        } else {
            this.$__list_ = [];
        }
        this.$__length_ = this.$__list_.length;
    }
    /**
     * 
     * @returns {Boolean}
     */
    SIterator.prototype.hasNext = function() {
        return this.$__next_ < this.$__length_;
    };
    /**
     * 
     * @returns {type}
     */
    SIterator.prototype.next = function() {
        if (this.$__next_ < this.$__length_) {
            return this.$__list_[this.$__next_++];
        }
        throw new Error("No next element");
    };
    /**
     * 
     * @returns {SIterator}
     */
    SIterator.prototype.reset = function() {
        this.$__next_ = 0;
        return this;
    };
    /**
     * 
     * @interface IComment
     */
    function IComment() {}

    IComment.__CLASS__ = IComment;

    IComment.__CLASS_NAME__ = "IComment";

    IComment.prototype.__CLASS__ = IComment;

    IComment.prototype.__CLASS_NAME__ = "IComment";

    IComment.prototype.getText = function() {
        throw new Error("Abstract method");
    };

    IComment.getInstance = function(comment) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window,
            IComment = ns.IComment||IComment,
            Comment = ns.Comment||Comment,
            Comments = ns.Comments||Comments;
        if (comment instanceof IComment) {
            return comment;
        }
        function addComment(c) {
            if (!cmt)
                cmt = c;
            else if (cmt instanceof Comment) {
                cs = new Comments();
                cs.add(cmt);
                cs.add(c);
                cmt = cs;
            } else {
                cmt.add(c);
            }
        }
        var cmt, cs;
        if (isPlainObject(comment)) {
            var c = comment.text||comment.comment||comment.comments||comment.texts;
            if (c) {
                comment = c;
            } else {
                incorrectArg(); //throw new Error("Incorrect argument");
            }
        }
        if (typeof comment === 'string') {
            var i = 0, n = comment.length, p, nl = /\n|\r\n/g, match;
            var singleLineSymbol = Comment.SINGLE_LINE_SYMBOL,
                    openSymbol = Comment.MULTI_LINE_OPEN_SYMBOL,
                    closeSymbol = Comment.MULTI_LINE_CLOSE_SYMBOL;
            for(;i < n;) {
                for (;i < n; i++ ) {
                    if (" \t\n\r\v\b\0".indexOf(comment[i]) < 0 ) {
                        break;
                    }
                }
                if (i >= n) {
                    break;
                }
                if (comment.startsWith(singleLineSymbol, i)) {
                    nl.lastIndex = i;
                    if ((match = nl.exec(comment))) {
                        addComment(new Comment(comment.substring(i, nl.lastIndex)));
                        i = nl.lastIndex;
                    }  else {
                        addComment(new Comment(comment.substring(i)));
                        i = n;
                    }
                } else if (comment.startsWith(openSymbol, i)) {
                    p = comment.indexOf(closeSymbol, i + 2);
                    if (p < 0) {
                        throw new Error("Unclosed comment:\n\"" + comment + "\"");
                    }
                    i = p + 2;
                    addComment(new Comment(comment.substring(i, p)));                    
                } else {
                    throw new Error("Incorrect comment: unexpected character at position: " + i + "\nComment comment: \"" + comment);
                }
            }
            if (!cmt) {
                throw new Error(n === 0 ? "Empty comment": "Invalid comment");
            }
            return cmt;
        } else if (isArray(comment)) {
            return new Comments(comment);
        } else {
            incorrectArg();u8
        }
    };
    IComment.prototype.getStartEmptyLines = function(){
        return this._startEmptyLines||0;
    };
    /**
     * 
     * @param {unsigned int} emptyLines
     * @returns {IComment}
     */
    IComment.prototype.setStartEmptyLines = function(emptyLines){
        if (arguments.length === 0 || typeof arguments[0] !== 'number' || emptyLines < 0) {
            throw new Error("Expected unsigned int argument");
        }
        this._startEmptyLines = emptyLines;
        return this;
    };
    
    
    
    
    
    /**
     * 
     * @param {type} c
     * @returns {Comment}
     */
    function Comment(c) {
        if (typeof c === 'string') {
            this.setText(c);
        } else if (isPlainObject(c)) {
            this.setText(c.text||c.Text||c.comment||c.Comment||c.content||c.Content);
        } else if (typeof c !== 'undefined' && c !== null) {
            incorrectArg(); //throw "Incorrect argument";
        } else {
            this._text = "";
        }
    }

    Comment.prototype = new IComment();

    Comment.__CLASS__ = Comment;

    Comment.__CLASS_NAME__ = "Comment";

    Comment.prototype.__CLASS__ = Comment;

    Comment.prototype.__CLASS_NAME__ = "Comment";


    Comment.SINGLE_LINE_SYMBOL = "//";

    Comment.MULTI_LINE_OPEN_SYMBOL = "/*";

    Comment.MULTI_LINE_DOC_OPEN_SYMBOL = "/**";

    Comment.MULTI_LINE_CLOSE_SYMBOL = "*/";
    /**
     * 
     * @param {String} text
     * @returns {Comment}
     */
    Comment.prototype.setText = function(text) {
        if (typeof text !== 'string') {
            incorrectArg(); //throw "Incorrect argument";
        }
        if (text.startsWith(Comment.SINGLE_LINE_SYMBOL)) {
            this.__singleLine__ = true;
            this.__multiLines__ = false;
        } else if (text.startsWith(Comment.MULTI_LINE_OPEN_SYMBOL)) {
            this.__singleLine__ = false;
            this.__multiLines__ = true;
            var i = text.indexOf("*/");
            if (i < 0) {
                throw new Error("Unclosed comment text");
            }
            if (i + 2 < text.length) {
                throw new Error("Incorrect comment text: \"" + text + "\"");
            }
        } else {
            throw new Error("Incorrect comment text: \"" + text + "\"");
        }
        this._text = text.trim();
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    Comment.prototype.getText = function() {
        return this._text;
    };

    /**
     * 
     * @returns {String}
     */
    Comment.prototype.isSingleLine = function() {
        return this.__singleLine__;
    };

    /**
     * 
     * @returns {String}
     */
    Comment.prototype.isMultipleLines = function() {
        return this.__multiLines__;
    };


    Comment.prototype.isMultiLines = Comment.prototype.isMultipleLines;
    /**
     * Converts the comment text to single inline comment:
     * <ul>
     * <li>If the text does not contain multiline comment closer, '//' is replace by the multiline comment  opener '/*' and the multiline comment closer is added at the end of the text.</li>
     * <li>Otherwise, all the occurences of multiline comment closer are first of all replaced by '* /', the multiline comment  opener '/*' added at the begining and the multiline comment closer is added at the end of the text.</li>
     * </ul>
     * @returns {String}
     */
    Comment.prototype.getInlineString = function() {
        var text = this._text||"";
        if (this.__singleLine__) {
            var i = text.indexOf("*/");
            if (i < 0)
                return "/* " + text.substring(2) + "*/";
            return "/* " + text.substring(2).replace(/\*\//g, '* /') + "*/";
        }
        return text.replace(/\r\n|\n\|r/g, ' ');
    };
    /**
     * 
     * @returns {String}
     */
    Comment.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        if (this.__singleLine__) {
            if (inline || !indentFirstLine) {
                return (this._text||"").trim();
            }
            var s = "";
            for (var i = 0; i < ind; i++) {
                s += "    ";
            }
            return s + (this._text||"").trim();
        }
        var s = "", token;
        var text = (this._text||"").trim(), i = 0, 
                n = text.length, match, newLineRe = /(?:\r\n|\n|\r)+/g;
        if (inline) {                    
            return this.getInlineString();
        }
        var _ind = "";
        for (var k = 0; k < ind; k++) {
            _ind += "    ";
        }
        var startEmptyLines = this.getStartEmptyLines();
        if (startEmptyLines > 0) {
            for (var k = 0; k < startEmptyLines; k++) {
                 s += "\n" + _ind;
            }
        } else if (indentFirstLine) {
            s += _ind;
        }
        var count = 0, doc = text.startsWith(Comment.MULTI_LINE_DOC_OPEN_SYMBOL);
        while (i < n) {                        
            newLineRe.index = i;
            if (!(match = newLineRe.exec(text))) {   
                token = text.substring(i).trim();
                if (token) {
                    if (count > 0) {
                        s += "\n" + _ind;
                    }
                    if (token.startsWith("*/")) {
                        s += " ";
                    }
                    s += token;
                }
                break;
            }                        
            token = text.substring(i, newLineRe.lastIndex - match[0].length).trim();

            if (token) {
                if (count > 0) {
                    s += "\n" + _ind;
                }
                if (token.startsWith("* ")) {
                    s += " ";
                }
                s += token;
            }
            i = newLineRe.lastIndex;
            count++;
        }
        return s;
    };
    /**
     * 
     * @param {Number} spaces
     * @returns {String}
     */
    Comment.prototype.getIndentedString = function(spaces) {
        var _ind = "";
        for (var i = 0; i < spaces; i++) {
            _ind += " ";
        }
        var text = (this.getText()||"");
        if (this.__singleLine__) {
            return _ind + text;
        }
        var s = "", i = 0, 
                n = text.length, 
                token,
                match, 
                nl = /(?:\r\n|\n|\r)+/g;
        var count = 0;
        while (i < n) {                        
            nl.index = i;
            if (!(match = nl.exec(text))) {   
                token = text.substring(i).trim();
                if (token) {
                    if (count > 0) {
                        s += "\n" + _ind;
                    }
                    if (token.startsWith("*/")) {
                        s += " ";
                    }
                    s += token;
                }
                break;
            }                        
            token = text.substring(i, nl.lastIndex - match[0].length).trim();

            if (token) {
                if (count > 0) {
                    s += "\n" + _ind;
                } else {
                    s += " ";
                }
                if (token.startsWith("* ")) {
                    s += " ";
                }
                s += token;
            }
            i = nl.lastIndex;
            count++;
        }
        return s;
    };
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Comment.getInstance = function(c) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window,
                Comment = ns.Comment||Comment;
        return c instanceof Comment ? c : new Comment(c);
    };

    Object.defineProperties(Comment.prototype, {
        singleLine : { get: Comment.prototype.isSingleLine, set: function() { throw new Error("Read only property");} },
        multiLines: { get: Comment.prototype.isMultiLines, set: function() { throw new Error("Read only property");} },
        text: { get: Comment.prototype.getText, set: Comment.prototype.setText },
        startEmptyLines: { get: Comment.prototype.getStartEmptyLines, set: Comment.prototype.setStartEmptyLines }
    });

    /**
     * 
     * @param {type} c
     * @returns {Comments}
     * @class
     */
    function Comments(c) {        
        if (arguments.length > 1) {
            var _c;
            this._comments = [];
            this._inlines = [];
            for (var i = 0, n = arguments.length; i < n; i++) {
                _c = content[i];
                if (Object.hasOwnProperty(_c, 'inline')) {
                    this._comments[i] = IComment.getInstance(_c.comment);
                    this._inlines[i] = _c.inline||false;
                } else {
                    this._comments[i] = IComment.getInstance(_c);
                    this._inlines[i] = false;
                }
            }
        } else if (arguments.length === 0) {
            this._comments = [];
            this._inlines = [];
        } else if (typeof c === 'string') {
            this._comments = [new Comment(c)];
            this._inlines = [false];
        } else if (c instanceof IComment) {
            this._comments = [c];
            this._inlines = [false];
        } else if (isArray(c)) {
            this._comments = [];
            this._inlines = [];
            var _c;
            for (var i = 0, n = c.length; i < n; i++) {
                _c = c[i];
                if (Object.hasOwnProperty(_c, 'inline')) {
                    this._comments[i] = IComment.getInstance(_c.comment);
                    this._inlines[i] = _c.inline||false;
                } else {
                    this._comments[i] = IComment.getInstance(_c);
                    this._inlines[i] = false;
                }
            }
        }  else if (isPlainObject(c)) {
            var content = c.comments||c.comment||c.contents||c.content||c.texts||c.text;
            if (isArray(content)) {
                this._comments = [];
                for (var i = 0, n = content.length; i < n; i++) {
                    this._comments[i] = IComment.getInstance(content[i]);
                }
            } else if (content instanceof IComment) {
                this._comments = [content];
                this._inlines = [false];
            } else if (typeof content === 'string') {
                this._comments = [new Comment(content)];
                this._inlines = [false];
            } else {
                incorrectArg(); //throw "Incorrect argument";
            }
        } else {
            incorrectArg(); //throw "Incorrect argument";
        }
    }

    Comments.prototype = new IComment();

    Comments.__CLASS__ = Comments;

    Comments.__CLASS_NAME__ = "Comments";

    Comments.prototype.__CLASS__ = Comments;

    Comments.prototype.__CLASS_NAME__ = "Comments";
    /**
     * Adds comment
     * @param {IComment|String|Object} c
     * @param {Boolean} [inline=false]
     * @returns {Comments}
     */
    Comments.prototype.add = function(c, inline) {
        var i = this._comments.length;
        if (typeof c === 'string') {
            this._comments[i] = new Comment(c);
        } else if (c instanceof IComment) {
            this._comments[i] = c;
        } else if (isPlainObject(c)) {
            this._comments[i] = IComment.getInstance(c);
        } else {
            incorrectArg(); //throw "Incorrect argument";
        }
        this._inlines[i] = toBool(inline||false);
        return this;
    };
    /**
     * 
     * @param {Number|IComment} c
     * @returns {IComment|Boolean}
     * @throws {Error}
     */
    Comments.prototype.remove = function(c) {
        if (typeof c === 'number') {
            if (Math.floor(c) !== c) {
                throw new Error("Expected unsigned int, found float: " + c);
            }
            if (c >= 0 && c < this._comments.length) {
                var _c = this._comments[c];
                this._comments.splice(c, 1);
                this._inlines.splice(c, 1);
                if (isArray(this._columns) && c < this._columns.length) {
                    this._columns.splice(c, 1);
                }
                return _c;
            }
            throw new Error("Comment index out of bounds: " + c);
        } else if (c instanceof IComment) {
            var i = this._comments.indexOf(c);
            if (i < 0) {
                return false;
            }
            this._comments.splice(i, 1);
            this._inlines.splice(i, 1);
            if (isArray(this._columns) && i < this._columns.length) {
                this._columns.splice(i, 1);
            }
            return true;
        } else {
            incorrectArg(); //throw exception
        }
    };
    /**
     * 
     * @param {Array} comments
     * @returns {Comments}
     */
    Comments.prototype.addComments = function(comments) {
        for (var i = 0, n = comments.length; i < n; i++) {
            this.add(comments[i]);
        }
        return this;
    };

    /**
     * 
     * @param {Array} comments
     * @returns {Comments}
     */
    Comments.prototype.setComments = function(comments) {
        this._comments = [];
        for (var i = 0, n = comments.length; i < n; i++) {
            this.add(comments[i]);
        }
        return this;
    };
    /**
     * Return a copy of the comments array list.
     * <p>Each time theis method is invoked, it creates a copy of the comments.</p>
     * @returns {Array}
     */
    Comments.prototype.getComments = function() {
        return [].slice.call(this._comments);
    };
    /**
     * Returns the comment at the given index/position.
     * @param {unsigned int} i The index/position of the comment to get
     * @returns {IComment}
     */
    Comments.prototype.get = function(i) {
        return this._comments[i];
    };
    /**
     * 
     * @param {unsigned int} i The index/position of the comment to check inline
     * @returns {Boolean}
     */
    Comments.prototype.isInline = function(i) {
        return this._inlines[i];
    };
    /**
     * 
     * @param {Array&lt;unsigned int&gt;} inlines
     * @returns {Comments}
     */
    Comments.prototype.setInlines = function(inlines) {
        this._inlines = inlines;
        return this;
    };
    /**
     * 
     * @returns {Array&lt;unsigned int&gt;}
     */
    Comments.prototype.getInlines = function() {
        return this._inlines;
    };
    /**
     * Returns the comment at the given index/position.
     * <p>Comments.prototype.getComment is an alias of Comments.prototype.get.</p>
     * @param {unsigned int} i The index/position of the comment to get
     * @returns {IComment}
     */
    Comments.prototype.getComment = Comments.prototype.get;
    /**
     * Returns the number of comments
     * @returns {unsigned int}
     */
    Comments.prototype.size = function() {
        return this._comments.length;
    };
    /**
     * 
     * @param {Array&lt;unsigned int&gt;} columns
     * @returns {Comments}
     */
    Comments.prototype.setColumns = function(columns) {
        this._columns = columns;
        return this;
    };
    /**
     * 
     * @returns {Array&lt;unsigned int&gt;}
     */
    Comments.prototype.getColumns = function() {
        return this._columns;
    };
    /**
     * Converts the comment text to single inline comment:
     * <ul>
     * <li>If the text does not contain multiline comment closer, '//' is replace by the multiline comment  opener '/*' and the multiline comment closer is added at the end of the text.</li>
     * <li>Otherwise, all the occurences of multiline comment closer are first of all replaced by '* /', the multiline comment  opener '/*' added at the begining and the multiline comment closer is added at the end of the text.</li>
     * </ul>
     * @returns {String}
     */
    Comments.prototype.getInlineString = function() {
        var str = "", comments = this._comments, c;
        for (var i = 0, n = comments.length; i < n; i++) {
            str += (i > 0 ? " ": "") + comments[i].getInlineString();
        }
        return str;
    };

    /**
     * 
     * @returns {String}
     */
    Comments.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true, offset = 0;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = toInteger(arguments[0]);
            } else if (typeof arguments[0] === 'boolean') {
                inline = toBool(arguments[0]);
            }
        } else if (arguments.length > 1) {
            if (typeof arguments[0] === 'number') {
                ind = toInteger(arguments[0]);
                indentFirstLine = toBool(arguments[1]);
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                offset = toInteger(arguments[1]);
            }                  
        }
        var s = "", 
            comments = this._comments, 
            n = comments.length, c;
    
        var _ind = "";
        for (var k = 0; k < offset; k++) {
            _ind += " ";
        }
        if (inline) {            
            for (var i = 0; i < n; i++) {
                c = comments[i];
                if (c instanceof Comment) {
                    if (c.isSingleLine()) {
                        if (i > 0) {
                            s += "\n" + _ind;
                        }
                    }
                } else if (i > 0) {
                    s += "\n" + _ind;
                }
                s += c.toString(true, offset);
            }
        } else {
            
            var indent,
                startEmptyLines = this.getStartEmptyLines();
            for (var i = 0; i < startEmptyLines; i++) {
                 s += "\n" + _ind;
            }
            for (var i = 0; i < n; i++) {
                c = comments[i];
                if (this.isInline(i)) {
                    s += " ";
                    indent = false;
                } else {
                    startEmptyLines = c.getStartEmptyLines();
                    for (var k = 0; k < startEmptyLines; k++) {
                         s += "\n" + _ind;
                    }
                    if (i > 0) {
                        s += "\n";
                    }
                    indent = indentFirstLine  || i > 0 || startEmptyLines > 0;
                }
                if (c.getText() === '// Built-in syntax/flag tokens') {
                    console.log('// Built-in syntax/flag tokens');
                }
                s += c.toString(ind, indent);
            }
        }
        return s;
    };
    
    /**
     * 
     * @param {Number} spaces
     * @returns {String}
     */
    Comments.prototype.getIndentedString = function(spaces) {
        var s = "", 
            comments = this._comments, 
            n = comments.length, c,
            startEmptyLines = this.getStartEmptyLines();;
        for (var i = 0; i < startEmptyLines; i++) {
            s += "\n";
       }
       for (var i = 0; i < n; i++) {
           if (i > 0) {
               s += "\n";
           }
           s += c.getIndentedString(spaces);
       }
       return s;
    };

    /**
     * 
     */
    Object.defineProperties(Comments.prototype, {
        comments : { get: Comments.prototype.getComments, set: Comments.prototype.setComments },
        length: { get: Comments.prototype.size, set: function() { throw new Error("Read only property");} },
        startEmptyLines: { get: Comment.prototype.getStartEmptyLines, set: Comment.prototype.setStartEmptyLines },
        columns : { get: Comments.prototype.getColumns, set: Comments.prototype.setColumns },
        inlines : { get: Comments.prototype.getInlines, set: Comments.prototype.setInlines }
    });




    /**
     * 
     * @abstract
     */
    function StatementElt() {}

    StatementElt.__CLASS__ = StatementElt;

    StatementElt.__CLASS_NAME__ = "StatementElt";


    StatementElt.prototype.__CLASS__ = StatementElt;

    StatementElt.prototype.__CLASS_NAME__ = "StatementElt";
    
    /**
     * 
     * @returns {IComment}
     */
    StatementElt.prototype.getComment = function() {
        return this._comment;
    };
    /**
     * 
     * @param {IComment|Object} comment
     * @returns {StatementElt}
     */
    StatementElt.prototype.setComment = function(comment) {                
        this._comment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        return this;
    };
    /**
     * 
     * @param {type} comment
     * @returns {StatementElt}
     */
    StatementElt.prototype.addComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._comment) {
            this._comment = comment;
        } else if (this._comment instanceof Comment) {
            this._comment = new Comments([this._comment, comment]);
        } else {
            this._comment.add(comment);
        }
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    StatementElt.prototype.getInlineComment = function() {
        return this._inlineComment;
    };
    /**
     * 
     * @param {IComment|Object} comment
     * @returns {StatementElt}
     */
    StatementElt.prototype.setInlineComment = function(comment) {
        this._inlineComment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        return this;
    };
    /**
     * 
     * @param {type} comment
     * @returns {StatementElt}
     */
    StatementElt.prototype.addInlineComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._inlineComment) {
            this._inlineComment = comment;
        } else if (this._inlineComment instanceof Comment) {
            this._inlineComment = new Comments([this._inlineComment, comment]);
        } else {
            this._inlineComment.add(comment);
        }
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    StatementElt.prototype.getEndComment = function() {
        return this._endComment;
    };
    /**
     * 
     * @param {type} comment
     * @param {Boolean} [inline]
     * @returns {StatementElt}
     */
    StatementElt.prototype.setEndComment = function(comment, inline) {
        this._endComment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        if (arguments.length > 1) {
            this.setInlineComment(inline);
        }
        return this;
    };
    /**
     * Sets the comments defined in the comments object by the fields :
     * <ul>
     * <li>comment</li>
     * <li>inlineComment</li>
     * <li>innerComment</li>
     * <li>innerInlineComment</li>
     * <li>endComment</li>
     * <li>endInlineComment</li>
     * <li>outerComment</li>
     * <li>outerInlineComment</li>
     * </ul>
     * @param {Object} c  The comments plain object
     * @returns {StatementElt}
     */
    StatementElt.prototype.setComments = function(c) {
        if (c.comment) {
            this.setComment(c.comment);
        }
        if (c.inlineComment) {
            this.setInlineComment(c.inlineComment);
        }

        if (c.innerComment) {
            this.setInnerComment(c.innerComment);
        }
        if (c.innerInlineComment) {
            this.setInnerInlineComment(c.innerInlineComment);
        }
        if (c.endComment) {
            this.setEndComment(c.endComment);
        }
        if (c.inlineEndComment) {
            this.setInlineEndComment(c.inlineEndComment);
        }
        if (c.endInlineComment) {
            this.setEndInlineComment(c.endInlineComment);
        }
        if (c.outerComment) {
            this.setOuterComment(c.outerComment);
        }
        if (c.outerInlineComment) {
            this.setOuterInlineComment(c.outerInlineComment);
        }
        return this;
    };
    /**
     * 
     * @param {type} comment
     * @returns {StatementElt}
     */
    StatementElt.prototype.addEndComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._endComment) {
            this._endComment = comment;
        } else if (this._endComment instanceof Comment) {
            this._endComment = new Comments([this._endComment, comment]);
        } else {
            this._endComment.add(comment);
        }
        return this;
    };
    
    /**
     * 
     * @returns {type}
     */
    StatementElt.prototype.getInlineEndComment = function() {
        return this._inlineEndComment;
    };
    /**
     * 
     * @param {Boolean} inline
     * @returns {StatementElt}
     */
    StatementElt.prototype.setInlineEndComment = function(inline) {
        this._inlineEndComment = toBool(inline);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    StatementElt.prototype.isStatement = function() {
        return false;
    };

    /**
     * 
     * @returns {Boolean}
     */
    StatementElt.prototype.isValue = function() {
        return false;
    };

    /**
     * 
     * @returns {Boolean}
     */
    StatementElt.prototype.isExpression = function() {
        return false;
    };
    /**
     * 
     * @param {unsigned int} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     * @abstract
     */
    StatementElt.prototype.getStatementString = function(ind, indentFirstLine) {
        throw new Error("Abstract method");
    };
    
    /**
     * 
     * @returns {String} };
     * @abstract
     */
    StatementElt.prototype.getInlineStatementString = function() {
        throw new Error("Abstract method");
    };
    
    /**
     * 
     * @returns {String}
     */
    StatementElt.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true, inlineArgs;
        if (arguments.length === 1) {
            var a = arguments[0];
            if (typeof a === 'number') {
                ind = a;
            } else if (typeof a === 'boolean') {
                inline = a;
                if (inline) {
                    indentFirstLine = false;
                }
            } else if (isPlainObject(a)) {
                if (typeof a.indent === 'undefined') {
                    if (typeof a.inline === 'undefined') {
                        ind = 0; 
                        if (typeof a.indentFirstLine !== 'undefined' && a.indentFirstLine !== null) {
                            indentFirstLine = toBool(a.indentFirstLine);
                        }
                    } else {
                        inline = toBool(a.inline);
                    }
                }else {
                    ind = a.indent;
                    if (typeof a.indentFirstLine !== 'undefined' && a.indentFirstLine !== null) {
                        indentFirstLine = toBool(a.indentFirstLine);
                    }
                    if (typeof a.inlineArgs !== 'undefined' && a.inlineArgs !== null) {
                        inlineArgs = toBool(a.inlineArgs);
                    }
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
            if (typeof arguments[2] !== 'undefined' && arguments[2] !== null) {
                inlineArgs = toBool(arguments[2]);
            }
        }
        var s = "";

        var cmt;

        if (inline) {
            cmt = this.getComment();
            if (cmt) {
                s += cmt.getInlineString();
            }
            cmt = this.getInlineComment();
            if (cmt) {
                s += ( s ? " ": "" ) + cmt.getInlineString();
            }
            s += ( s ? " ": "" ) + this.getInlineStatementString();
         

            cmt = this.getInlineEndComment();
            if (cmt) {
                s += ( s ? " ": "" ) + cmt.getInlineString();
            }
            cmt = this.getEndComment();
            if (cmt) {
                s += ( s ? " ": "" ) + cmt.getInlineString();                       
            }
        } else {
            cmt = this.getComment();
            var nl = "";
            if (cmt) {
                s += cmt.toString(ind, indentFirstLine);
                indentFirstLine = true;
            } 
            cmt = this.getInlineComment();
            var _inline = false;
            if (cmt) {
                s += (s ? "\n" : "");
                if (indentFirstLine) {
                    for (var k = 0; k < ind; k++) {
                        s += "    ";
                    }
                }
                s += cmt.getInlineString();
                _inline = true;
                indentFirstLine = false;
            }
            s += (_inline ? " " : (s ? "\n" : "")) + this.getStatementString(ind, indentFirstLine, inlineArgs);
            cmt = this.getInlineEndComment();
            if (cmt) {
                var i = s.lastIndexOf("\n");
                s += cmt.getIndentedString((i < 0 ? s.length : s.length - i) + 1);
            }
            cmt = this.getEndComment();
            if (cmt) {
                s += (s ? "\n" : "") + cmt.toString(ind, true);                      
            }            
        }
        return s;
    };

    /**
     * 
     * @returns {Expression}
     */
    function Expression() {}


    Expression.__CLASS__ = Expression;
    Expression.__CLASS_NAME__ = "Expression";

    Expression.prototype = new StatementElt();

    Expression.prototype.__CLASS__ = Expression;
    Expression.prototype.__CLASS_NAME__ = "Expression";
    
    Expression.prototype.isNoValue = function() {
        return false;
    };
    /**
     * 
     * 
     * @returns {Boolean}
     */
    Expression.prototype.isYield = function () {
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Expression.prototype.isYieldDelegation= function () {
        return false;
    },
    
    /**
     * 
     * @returns {IComment}
     */
    Expression.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {type} c
     * @returns {Reference.prototype}
     */
    Expression.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = c instanceof IComment ? c : IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Expression.prototype.isStatement = function() {
        return false;
    };

    /**
     * 
     * @returns {Boolean}
     */
    Expression.prototype.isExpression = function() {
        return true;
    };
    /**
     * 
     * @param {Object} ai
     * @returns {AutoIncrement}
     */
    Expression.getAutoIncrement = function(ai) {
        if (typeof ai === 'string') {
            if (ai !== '++' && ai !== '--') {
                throw new Error("Incorrect operator: '" + ai + "'");
            }
            return new AutoIncrement(ai , arguments.length > 1 ? toBool(arguments[1]) : UnaryOperation.getPrefixed(ai));
        }
        var typ = ai.type||ai.Type;
        if (typ === "autoincrement" || typ === "auto-increment") {
            var o = ai.operator||ai.symbol||ai.Operator||ai.Symbol;
            return new AutoIncrement(o||"++" , UnaryOperation.getPrefixed(ai));
        }
    };
    /**
     * 
     * @param {type} e
     * @return StatementElt
     */
    Expression.getInstance = function(e) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var Expression = ns.Expression||Expression;
        if (e instanceof Expression) {
            return e;
        }
        if (e instanceof StatementElt) {
            if (e.isExpression()) {
                return e;
            }
            throw new Error("Not an expression object"); 
        }
        if (e === null) {
            return Null.NULL;
        }
        if (e === undefined) {
            var Undef = ns.Undefined||Undefined;
            return Undef.UNDEFINED;
        }
        if (e instanceof String || e instanceof Number || e instanceof Boolean) {
            e = e.valueOf();
        } else if (isPlainObject(e) && (e.type === 'litteral' || e.type === 'literal')) {
            e = e.value;
        }
        
        if (typeof e === 'number' ) {
            var N = ns.Numeric||Numeric;
            return new N(e);
        }
        if (typeof e === 'boolean') {
            var Bool = ns.Boolean||Boolean;
            return new Bool(e);
        }
        if (typeof e === 'string') {
            var QString = ns.QString||QString;
            var Value = ns.Value||Value;
            return QString.isQuotedString(e) ? new QString(e): new Value(e);
        }
        if (e instanceof Date || e instanceof RegExp) {
            var Value = ns.Value||Value;
            return new Value(e);
        }

        if (isArray(e)) {
            var A = ns.VArray||VArray;
            return new A(e);
        }
        if (!isPlainObject(e)) {
            incorrectArg();//throw "Incorrect argument";
        }
        if (!e.hasOwnProperty("type")) {
            var O = ns.VObject||VObject;
            return new O(e);
        }
        switch(e.type||"") {
            case "reference":
                var R = ns.Reference||Reference;
               return new R(e);
            case "ocreference":
            case "ocref":
            case "ocr":
                var R = ns.OCRef||OCRef;
               return new R(e);
            case "index" :
                var I = ns.Index||Index;
               return new I(e);
           case "ocindex" :
           case "oci" :
               var I = ns.OCIndex||OCIndex;
               return new I(e);
            case "conditional" :
                var C = ns.Conditional||Conditional;
               return new C(e);
            case "bool" :
            case "boolean":
               return new Bool(e);
            case "number" :
            case "numeric":
                var N = ns.Numeric||Numeric;
               return new N(e);
            case "autoincrement" :
            case "auto-increment":
               return Expression.getAutoIncrement(e);
            case "autodecrement" :
            case "auto-decrement":
               return Expression.getAutoIncrement("--", e.nature||e.operationType);
            case "unary":
               return new UnaryOperation(e);
            case "postfix":
            case "prefix":
            case "postfixed":
            case "prefixed":
                var I = ns.AutoIncrement||AutoIncrement,
                        UnaryOperation = ns.UnaryOperation||UnaryOperation;
               return I.AUTOINCREMENT_OPERATORS.indexOf(e.operator) >= 0 ? new I(e) :new UnaryOperation(e);
            case "invocation" :
                var I = ns.Invocation||Invocation;
               return new I(e);
            case "instantiation" :
                var I = ns.Instantiation||Instantiation;
               return new Instantiation(e);
            case "string" :
            case "qstring" :
                var QS = ns.QString||QString;
               return new QS(e);  
            case "assign" :
                var I = ns.Instantiation||Instantiation;
               return new Assign(e);
            case "operation" :
                var O = ns.LROperation||LROperation;
               return new LROperation(e);
            case "func" :
            case "function":
                var NamedFunction = ns.NamedFunction||NamedFunction;
                var AnonymousFunction = ns.AnonymousFunction||AnonymousFunction;
               return e.name ? new NamedFunction(e) : new AnonymousFunction(e);
            case "namedfunc" :
            case "namedfunction":
            case "named-func" :
            case "named-function":
                var F = ns.NamedFunction||NamedFunction;
               return new F(e);
            case "anonymousfunction":
            case "anonymousfunc":
            case "anonymous-function":
            case "anonymous-func":
                var F = ns.AnonymousFunction||AnonymousFunction;
                return new F(e);
            case "arrowfunction":
            case "arrowfunc":
            case "arrow-function":
            case "arrow-func":
                var F = ns.ArrowFunction||ArrowFunction;
                return new ArrowFunction(e);
            case "null" :
                var N = ns.Null||Null;
               return N.NULL;
            case "undefined" :
                var U = ns.Undefined||Undefined;
               return U.UNDEFINED;
            case "array" :
                var A = ns.VArray||VArray;
               return new A(e.elements||e.values||e.array||e.items||e.list);
            case "grouping" :
                var G = ns.Grouping||Grouping;
               return new G(e);
            case "object" :
                var O = ns.VObject||VObject;
               return new O(e.properties||e.entries||e.object);   
             
        }
   };
   
    
    

    /**
     * 
     * @param {type} o
     * @returns {Grouping}
     */
    function Grouping(o) {
        this._expr = null;
        if (o instanceof Expression) {
            this.setExpression(o);
        } else if (isPlainObject(o)) {
            if (o.type === 'grouping') {
                this.setExpression(o.expression||o.value);
            } else {
                this.setExpression(o);
            }
        }
    }

    Grouping.prototype = new Expression();

    Grouping.__CLASS__ = Grouping;
    Grouping.__CLASS_NAME__ = "Grouping";

    Grouping.prototype.__CLASS__ = Grouping;
    Grouping.prototype.__CLASS_NAME__ = "Grouping";
    /**
     * 
     * @returns {type}
     */
    Grouping.prototype.getExpression = function() {
        return this._expr;
    };
    /**
     * 
     * @param {type} expr
     * @returns {QString}
     */
    Grouping.prototype.setExpression = function(expr) {
        this._expr = Expression.getInstance(expr);
        return this;
    };
    
    /**
     * 
     * @returns {type}
     */
    Grouping.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @param {type} type
     * @returns {NVariable.prototype}
     */
    Grouping.prototype.setType = function(type) {
        this._type = FType.getInstance(type);
        return this;
    };

    Grouping.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        if (inline) {
            return "(" + (this._expr ? this._expr.toString(true) : "") + ")";
        }
        var s = "";

        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                s += "    ";
            }
        }
        s += "(";                
        s += (this._expr ? this._expr.toString(ind, false) : "");
        s += ")";
        return s;
    };


    function Litteral() {

    }

    Litteral.__CLASS__ = Litteral;

    Litteral.__CLASS_NAME__ = "Litteral";

    Litteral.prototype = new Expression();

    Litteral.prototype.__CLASS__ = Litteral;

    Litteral.prototype.__CLASS_NAME__ = "Litteral";
    
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    Litteral.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "";
        for (var k = 0; k < ind; k++) {
            _ind += "    ";
        }
        return (indentFirstLine ? _ind : "") + this._value;
    };
   
   /**
    * 
    * @returns {String}
    */
   Litteral.prototype.getInlineStatementString = function() {
       return "" + this._value;
   };

    /**
     * 
     * @returns {Boolean}
     */
    Litteral.prototype.isValue = function() {
        return true;
    };

    /**
     * 
     * @param {type} v
     * @returns {Value} 
     * @class
     */
    function Value(v) {
        if (arguments.length > 0)
            this._value = v;
    }


    Value.prototype = new Expression();

    Value.__CLASS__ = Value; 

    Value.__CLASS_NAME__ = "Value"; 

    Value.prototype.__CLASS__ = Value; 

    Value.prototype.__CLASS_NAME__ = "Value"; 
    /**
     * 
     * @returns {type}
     */
    Value.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {type} v
     * @returns {Value}
     */
    Value.prototype.setValue = function(v) {
        this._value = v;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    Value.prototype.valueOf = function() {
        return this._value;
    };
    /**
     * 
     * @returns {String}
     */
    Value.prototype.getInlineStatementString = function() {
        return this._value instanceof StatementElt ? this._value.toString(true) : "" + this._value;
    };
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine 
     * @returns {String}
     */
    Value.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "";
        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }
        }
        return _ind + (this._value instanceof StatementElt ? this._value.toString(ind, false) : this._value);
    };
    /**
     * 
     * @returns {Boolean}
     */
    Value.prototype.isNaV = function() {
        return false;
    };

    /**
     * 
     * @returns {Boolean}
     */
    Value.prototype.isValue = function() {
        return true;
    };
    
    Value.NO_VALUE = new Value();
    /**
     * 
     * @param {type} v
     * @returns {Value.NO_VALUE}
     */
    Value.NO_VALUE.setValue = function(v) {
        return this;
    };
    
    Value.NO_VALUE.isNaV = function() {
        return true;
    };
    
    Value.NO_VALUE.isNoValue = function() {
        return true;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    Value.NO_VALUE.isValue = function() {
        return false;
    };
    
    Value.NaV = Value.NO_VALUE;
    
    Value.NAV = Value.NO_VALUE;


    /**
     * 
     * @returns {Null}
     * @class Null
     */
    function Null() {
        if (Null.__NULL__) {
            throw new Error("Instantiation forbidden");
        }
    }

    Null.__CLASS__ = Null;



    Null.__CLASS_NAME__ = "Null";

    Null.prototype = new Litteral();

    Null.prototype.__CLASS__ = Null;

    Null.prototype.__CLASS_NAME__ = "Null";


    /**
     * 
     * @returns {null}
     */
    Null.prototype.valueOf = function() {
        return null;
    };
    /**
     * 
     * @returns {null}
     */
    Null.prototype.getValue = function() {
        return null;
    };
    /**
     * @returns {String}
     */
    Null.prototype.getInlineStatementString = function() {
        return "null";
    };
    /**
     * @param {Number} ind
     * @param {Boolean} indentFirstLine 
     * @returns {String}
     */
    Null.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "";
        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }
        }
        return _ind + "null";
    };

    Null.NULL = Null.__NULL__ = new Null();
    /**
     * 
     * @returns {Null}
     */
    Null.getInstance = function() {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var N = ns.Null||Null;
        return N.NULL;
    };
    
    /**
     * 
     * @param {RegExp|String} expr
     * @param {String} [modifs]
     * @returns {VRegExp}
     */
    function VRegExp(expr,modifs) {
        if (typeof expr === 'string' || expr instanceof String) {
            this._value = modifs ? new RegExp(expr, modifs) : new RegExp(expr);
        } else if (expr instanceof RegExp) {
            this._value = expr;
        } else if (isPlainObject(expr)) {
            var m = modifs||expr.modifs;
            var e = expr.expression||expr.regex||expr.regexp||expr.value;
            if (e instanceof String) {
                e = e.valueOf();
                
            }
            if (typeof XRegExp === 'function' && e instanceof XRegExp) {
                if (m) {
                    this._value = new XRegExp(e.source, m);
                } else {
                    this._value = e;
                }
            } else if (e instanceof RegExp) {
                if (m) {
                    this._value = new RegExp(e.source, m);
                } else {
                    this._value = e;
                }
            } else if (typeof e === 'string') {
                this._value = m ? new RegExp(e, m) : new RegExp(e);
            }
        }
    }
    
    VRegExp.prototype = new Value();
    
    /**
     * 
     * @param {type} v
     * @returns {VRegExp.prototype}
     */
    VRegExp.prototype.setValue = function(v) {
        if (v instanceof RegExp) {
            this._value = v;
        } else if (typeof v === 'string') {
            this._value = typeof arguments[1] === 'string' ? new RegExp(v, arguments[1]) : new RegExp(v);
        } else {
            incorrectArgs(); //throw exception
        }
        return this;
    };
    
    /**
     * @returns {String}
     */
    VRegExp.prototype.getInlineStatementString = function() {
        return this._value ? this._value.toString() : "";
    };
    /**
     * @param {Number} ind
     * @param {Boolean} indentFirstLine 
     * @returns {String}
     */
    VRegExp.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "";
        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }
        }
        return _ind + (this._value ? this._value.toString() : "");
    };


    /**
     * 
     * @param {Array} arr
     * @returns {VArray}
     * @class VArray
     */
    function VArray(arr) {
        this._yields = 0;
        this._yieldDeletations = 0;
        if (arguments.length  === 1) {
            this.setValue(arr);
            if (isPlainObject(arr)) {
                this.setComments(arr);
            }
        } else if (arguments.length > 0) {
            this._value = [];
            this.addElements.apply(this, [].slice.call(arguments));
        } else {
            this._value = [];
        }
    }

    /**
     * 
     * @type Value
     */
    VArray.prototype = new Value();
    
    (function(A) {
        function add(e, o) {
            if (e instanceof StatementElt) {
                if (!e.isExpression()) {
                    throw new Error("Incorrect argument");
                }
                o._value[o._value.length] = e;
            } else {
                o._value[o._value.length] = e = Expression.getInstance(e);
            }
            if (e.isYield()) {
                o._yields++;
            }
            
            if (e.isYieldDelegation()) {
                o._yieldDeletations++;
            }
        }
        A.isYield = function() {
            return this._yields > 0;
        };
        A.isYieldDeletations = function() {
            return this._yieldDeletations > 0;
        };
        /**
         * 
         * @param {type} e
         * @returns {undefined}
         */
        A.addElement = function(e) {
            add(e, this);            
        };
        A.addElements = function(elts) {
            for (var i = 0, n = elts.length; i < n; i++) {
                add(elts[i], this);
            }
            return this;
        };
        /**
         * 
         * @returns {VArray}
         */
        A.add = function() {
            if (arguments.length === 1) {
                var a = arguments[0];
                if (isArray(a)) {
                    return this.addElements(a);
                } else {
                    return this.addElement(a);
                }
            } else if (arguments.length > 1) {
                return this.addElements.apply(this, [].slice.call(arguments));
            }
            return this;
        };
    })(VArray.prototype);
    /**
     * 
     * @param {Array} v
     * @returns {VArray}
     */
    VArray.prototype.setValue = function(v) {
        var elts;
        if (arguments.length > 1) {
            elts = [].slice.call(arguments);
        } else if (isArray(v)) {
            elts = v;
        } else if (isPlainObject(v)) {
            elts = v.elements||v.items||v.elts||v.Elements||v.Items||v.Elts;
            if (!isArray(elts)) {
                throw new Error("Incorrect argument");
            }
        } else {
            throw new Error("Incorrect argument or no argument");
        }
        this._yields = 0;
        this._yieldDeletations = 0;
        this._value = [];
        this.addElements(elts);
        return this;
    };
    /**
     * 
     * @alias VArray.prototype.setValue
     */
    VArray.prototype.setElements = VArray.prototype.setValue;
    /**
     * 
     * @returns {VArray}
     */
    VArray.prototype.clear = function() {
        this._yields = 0;
        this._yieldDeletations = 0;
        this._value = [];
        return this;
    };
    /**
     * 
     * @param {type} e
     * @param {Function} [cmp]
     * @returns {VArray|type}
     */
    VArray.prototype.remove = function(e, cmp) {
        if (e instanceof Number) {
            e = e.valueOf();
        }
        if (typeof e === 'number')  {
            if (Math.floor(e) !== e) {
                throw new Error("Expected positive int value or 0. Found: " + e);
            }
            if (e >= 0 && e < this._value.length) {
                var _e = this._value[e];
                this._value.splice(_e, 1);
                return _e;
            }
            throw new Error("Index out of bounds");
        }
        if (typeof cmp === 'function') {
            var elts = this._value;
            for (var i = 0, n = elts.length; i < n; i++) {
                if (cmp(elts[i] === e)) {
                    elts.splice(i, 1);
                    if (e.isYield()) {
                        this._yields--;
                    }
                    if (e.isYieldDeletation()) {
                        this._yieldDeletations--;
                    }
                    break;
                }
            }
            return this;
        }
        var i = this._value.indexOf(e);
        if (i >= 0) {
            this._value.splice(e, 1);
            if (e.isYield()) {
                this._yields--;
            }
            if (e.isYieldDeletation()) {
                this._yieldDeletations--;
            }
        }
        return this;
    };
    /**
     * Creates a new array, populates it with the elmeents of this object and returns the created array.
     * @returns {Array}
     */
    VArray.prototype.toArray = function() {
        return [].slice.call(this._value);
    };
    /**
     * 
     * @param {unsigned int} i
     * @returns {type}
     */
    VArray.prototype.get = function(i) {
        return this._value[i];
    };
    /**
     * 
     * @returns {unsigned int}
     */
    VArray.prototype.size = function() {
        return this._value.length;
    };
    /**
     * @returns {String}
     */
    VArray.prototype.getInlineStatementString = function() {
        if (!this._value) {
            return "[]";
        }
        var s = "[";
        for (var i in this._value) {
            if (i > 0) {
                s += ",";
            }
            s += this._value[i].toString(true);
        }
        s += "]";
        return s;
    };
    /**
     * @param {Number} ind
     * @param {Boolean} indentFirstLine 
     * @returns {String}
     */
    VArray.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "", s = "", arr = this._value,n = arr.length;
        for (var k = 0; k < ind; k++) {
            _ind += "    ";
        }
        
        if (indentFirstLine) {
            s += _ind;
        }
        if (!arr || n === 0) {
            return s + "[]";
        }

        if (n === 1) {
            s += "[" + arr[0].toString(ind, false) + "]";
            return s;
        }
        var _ind2 = "";
        for (var k = 0; k <= ind; k++) {
            _ind2 += "    ";
        }
        s += "[";
        for (var i in arr) {
            if (i > 0) {
                s += ",";
            }
            s += "\n" + _ind2 + arr[i].toString(ind + 1, false);
        }
        s += "\n" + _ind + "]";
        return s;
    };
    /**
     * 
     * @property value
     * <ul>
     * <li>Get: each access creates a new array, populates it with the elmeents of this object and returns the created array.</li>
     * <li>Set: Sets the elements from the given array</li>
     * </ul>
     * @property length The number of elements
     */
    Object.defineProperties(VArray.prototype, {
        value: { get: VArray.prototype.toArray, set : VArray.prototype.setValue },
        length : { get: VArray.prototype.size, set : function() { throw new Error("Read only property"); } }
    });
    /**
     * 
     * @returns {AEntry}
     */
    function AEntry() {
        
    }
    
    
    AEntry.prototype = new StatementElt();
    
    
    /**
     * 
     * @returns {type}
     */
    AEntry.prototype.getKey = function() {
        return this._key;
    };
    /**
     * 
     * @param {type} c
     * @returns {AEntry}
     */
    AEntry.prototype.setKey = function(c) {
        this._key = c;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    AEntry.prototype.getOuterComment = function() {
        return this._outerComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {AEntry}
     */
    AEntry.prototype.setOuterComment = function(c) {
        this._outerComment = c;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    AEntry.prototype.getOuterInlineComment = function() {
       return this._outerInlineComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {AEntry}
     */
    AEntry.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = c;
        return this;
    };
    /**
     * 
     * @param {type} e
     * @returns {AEntry}
     */
    AEntry.getInstance = function(e) {
        if (e instanceof AEntry) {
            return e;
        }
        if (e instanceof String) {
            e = e.valueOf();
        } else if (e instanceof VString || e instanceof QString) {
            e = e.getValue();
        }
        if (typeof e === 'string') {            
            return new AutoRefEntry(e);
        }
        if (isPlainObject(e)) {
            if (hasOwnProp(e, 'value') || hasOwnProp(e, 'Value')) {
                return new Entry(e);
            } else {
                return new AutoRefEntry(e);
            }
        } else if (isArray(e)) {
            if (e.length === 1) {
                e = e [0];
                if (e instanceof String) {
                    e = e.valueOf();
                } else if (e instanceof VString || e instanceof QString) {
                    e = e.getValue();
                }
                if (typeof e === 'string') {            
                    return new AutoRefEntry(e);
                }
            } else if (e.length > 1) {
                return new Entry(e[0], e[1]);
            }
            throw new Error("Incorrect argument");
        }
    };
    
    
    function Entry() {
        if (arguments.length === 1) {
            var e = arguments[0];
            this._key = e.key||e.name||e.property||e.Key||e.Name||e.Property;
            this._value = e.value||e.Value;
            var c = e.outerInlineComment;
            if (c) {
                this.setOuterInlineComment(c);
            }
            c = e.outerComment;
            if (c) {
                this.setOuterComment(c);
            }
        } else if (arguments.length > 1) {
            var k = arguments[0],
                v = arguments[1];
            if (k instanceof VString || k instanceof QString) {
                this._key =  k;
            } else {
                if (k instanceof String) {
                    k = k.valueOf();
                }
                if (typeof k === 'string') {
                    var re = /["'\-.+*()[\]{}<>&#`!;?%¨]|\s|\/|\|/;
                    if (/^[0-9]/.exec(k) || re.exec(k)) {
                        var qs = new QString();
                        qs.setValue(k);
                        k = qs;
                    } else {
                        k = new VString(k);
                    }
                } else {
                    throw new Error("Incorrect key argument");
                }
                this._key = k;                
            }
            this._value = Expression.getInstance(v);
        }
    }
    
    Entry.prototype = new AEntry();
    
    Entry.__CLASS__ = Entry;
    
    Entry.__CLASS_NAME__ = "Entry";
    
    Entry.prototype.__CLASS__ = Entry;
    
    Entry.prototype.__CLASS_NAME__ = "Entry";
    /**
     * 
     * @returns {type}
     */
    Entry.prototype.getValue = function() {
       return this._value;
    };
    /**
     * 
     * @param {type} c
     * @returns {AEntry}
     */
    Entry.prototype.setValue = function(c) {
        this._value = c;
        return this;
    };
    /**
     * 
     * @param {Number} ind 
     * @param {Boolean} indentFirstLine 
     * @returns {String}
     */
    Entry.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "";
        
        if (indentFirstLine) {
            for (var i = 0; i < n; i++) {
                s += "    ";
            }
        }
        var v = this.getKey();
        s += (v ? v.toString(ind, false) : "" ) + ": ";
        v = this.getValue();
        s += (v ? v.toString(ind, false) : "" );
        return s;
    };
    /**
     * 
     * @returns {String}
     */
    Entry.prototype.getInlineStatementString = function() {
        var s = "";
        var v = this.getKey();
        s += (v ? v.toString(true) : "" ) + ": ";
        v = this.getValue();
        s += (v ? v.toString(true) : "" );
        return s;
    };
    /**
     * 
     * @alias StatementElt.prototype.toString
     */
    Entry.prototype.toObjectString = Entry.prototype.toString;
    /**
     * 
     * @alias StatementElt.prototype.toString
     */
    Entry.prototype.toKeyValueString = Entry.prototype.toString;
    
    
    Entry.getInstance = function(e) {
        var E = this.__CLASS__;
        return e instanceof E ? e : new E(e);
    };
    
    /**
     * 
     */
    Object.defineProperties(Entry.prototype, {
        key : { get : Entry.prototype.getKey, set: Entry.prototype.setKey },
        value : { get : Entry.prototype.getValue, set: Entry.prototype.setValue },
        comment : { get : Entry.prototype.getComment, set: Entry.prototype.setComment },
        inlineComment : { get : Entry.prototype.getInlineComment, set: Entry.prototype.setInlineComment },
        endComment : { get : Entry.prototype.getEndComment, set: Entry.prototype.setEndComment },
        inlineEndComment : { get : Entry.prototype.getInlineEndComment, set: Entry.prototype.setInlineEndComment },
        outerComment : { get : Entry.prototype.getOuterComment, set: Entry.prototype.setOuterComment },
        outerInlineComment : { get : Entry.prototype.getOuterInlineComment, set: Entry.prototype.setOuterInlineComment }
    });
    /**
     * 
     * @returns {AutoRefEntry}
     * @class AutoRefEntry
     */
    function AutoRefEntry() {
        if (arguments.length > 0) {
            var e = arguments[0];
            if (e instanceof String) {
                e = e.toString();
            }
            if (typeof e === 'string') {
                this._key =  new VString(e);
            } else if (e instanceof VString || e instanceof QString) {
                this._key =  e;
            } else if (isPlainObject (e)) {
                this._key = e.key||e.name||e.property||e.Key||e.Name||e.Property;
                var c = e.outerInlineComment;
                if (c) {
                    this.setOuterInlineComment(c);
                }
                c = e.outerComment;
                if (c) {
                    this.setOuterComment(c);
                }
            }
        }
    }
    
    AutoRefEntry.prototype = new AEntry();
    
    AutoRefEntry.__CLASS__ = AutoRefEntry;
    
    AutoRefEntry.__CLASS_NAME__ = "AutoRefEntry";
    
    AutoRefEntry.__SUPER_CLASS__ = AEntry;
    
    AutoRefEntry.prototype.__CLASS__ = AutoRefEntry;
    
    AutoRefEntry.prototype.__CLASS_NAME__ = "AutoRefEntry";
    
    AutoRefEntry.prototype.__SUPER_CLASS__ = AEntry;
    
    
    /**
     * 
     * @param {type} e
     * @returns {AutoRefEntry}
     */
    AutoRefEntry.getInstance = function(e) {
        var E = this.__CLASS__;
        return e instanceof E ? e : new E(e);
    };
    /**
     * 
     * @param {type} key
     * @returns {AutoRefEntry}
     */
    AutoRefEntry.prototype.setKey = function(key) {
        this.__SUPER_CLASS__.prototype.setKey.apply(arguments);
        this.__value_ = undefined;
        return this;
    };
    /**
     * 
     * @returns {Variable}
     */
    AutoRefEntry.prototype.getValue = function() {
        if (!this.__value_) {
            this.__value_ = new Variable(this._key.getValue());
        }
        return this.__value_;
    };
    /**
     *
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String|StatementElt.prototype.getStatementString.s} 
     */
    AutoRefEntry.prototype.getStatementString = function(ind, indentFirstLine) {
        var k = this.getKey();
        if (!k) {
            if (indentFirstLine) {
                var s = "";
                for (var i = 0; i < ind; i++) {
                    s += "    ";
                }
                return s;
            }
            return "";
        }
        return k.toString(ind, indentFirstLine);
    };
    /**
     * 
     * @returns {String}
     */
    AutoRefEntry.prototype.getInlineStatementString = function() {
        var k = this.getKey();
        return k ? "" : k.toString(true);
    };
    /**
     * 
     */
    Object.defineProperties(AutoRefEntry.prototype, {
        key : { get : AutoRefEntry.prototype.getKey, set: AutoRefEntry.prototype.setKey },
        value : { get : AutoRefEntry.prototype.getValue, set: function() {throw new Error("Read only property");} },
        comment : { get : AutoRefEntry.prototype.getComment, set: AutoRefEntry.prototype.setComment },
        inlineComment : { get : AutoRefEntry.prototype.getInlineComment, set: AutoRefEntry.prototype.setInlineComment },
        endComment : { get : AutoRefEntry.prototype.getEndComment, set: AutoRefEntry.prototype.setEndComment },
        inlineEndComment : { get : AutoRefEntry.prototype.getInlineEndComment, set: AutoRefEntry.prototype.setInlineEndComment },
        outerComment : { get : AutoRefEntry.prototype.getOuterComment, set: AutoRefEntry.prototype.setOuterComment },
        outerInlineComment : { get : AutoRefEntry.prototype.getOuterInlineComment, set: AutoRefEntry.prototype.setOuterInlineComment }
    });
    /**
     * 
     * @param {Object} obj
     * @returns {Undefined}
     * @class
     */
    function VObject(obj) {
        
        if (arguments.length === 1) {
            if (isPlainObject(obj)) {
                var e;
                if ((e = obj.entries ||obj.values||obj.properties || obj.value||obj.object) 
                        || obj.comment||obj.endComment|| obj.inlineComment||obj.inlineEndComment) {
                    if (isArray(e)) {
                        this.setEntries(e);
                    } else if (isPlainObject(e)) {
                        this.setValue(e);
                    }
                    this.setComments(obj);
                    var ks = obj.keysList||obj.keysMap;
                    if (isArray(ks)) {
                        
                    } else if (isPlainObject(ks)) {
                        
                    }
                } else if (obj)
                    this.setValue(obj);
            }
        } else if (arguments.length > 1) {
            this.setValue(obj);
        } else {
            this._value = {};
            this._entriesMap = { };
            this._entries = [];
        }
    }
    
        
    VObject.prototype = new Value();
    
    /**
     * 
     * @type {VObject}
     */
    VObject.__CLASS__ = VObject;
    /**
     * 
     * @type String
     */
    VObject.__CLASS_NAME__ = "VObject";
    /**
     * 
     * @type {VObject}
     */
    VObject.prototype.__CLASS__ = VObject;
    /**
     * 
     * @type String
     */
    VObject.prototype.__CLASS_NAME__ = "VObject";
    /**
     * 
     * @returns {IComment}
     */
    VObject.prototype.getInnerComment = function() {
        return this._innerComment;
    };
    /**
     * 
     * @param {IComment} innerComment
     * @returns {VObject}
     */
    VObject.prototype.setInnerComment = function(innerComment) {
        this._innerComment = innerComment;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    VObject.prototype.getInnerInlineComment = function() {
        return this._innerInlineComment;
    };
    /**
     * 
     * @param {IComment} innerInlineComment
     * @returns {VObject}
     */
    VObject.prototype.setInnerInlineComment = function(innerInlineComment) {
        this._innerInlineComment = innerInlineComment;
        return this;
    };
    /**
     * 
     * @param {Object} value
     * @returns {VObject}
     */
    VObject.prototype.setValue = function(value) {        
        if (!isPlainObject(value)) {
            throw new Error("Incorrect arguments");
        }
        this._entriesMap = {};
        this._value = {};
        this._entries = [];
        this._yields = 0;
        this._yieldDelegations = 0;
        var e, i = 0, v;
        for (var k in value) {
            this._value[k] = v = Expression.getInstance(value[k]);
            this._entries[i++] = this._entriesMap[k] = new Entry(new VString(k), v);  
            if (v.isYield()) {
                this._yields++;
            }
            if (v.isYieldDelegation()) {
                this._yieldDelegations++;
            }
        }
        return this;
    };
    /**
     * 
     * @param {Array} entries
     * @returns {VObject.prototype}
     */
    VObject.prototype.setEntries = function(entries) {        
        if (!isArray(entries)) {
            throw new Error("Incorrect argument");
        }
        
        this._entriesMap = {};
        this._value = {};
        this._entries = [];
        var n = entries.length;
        if (n === 0) {
            return this;
        }
        var e,key;
        if (isPlainObject(entries[0])) {
            var v;
            for (var i = 0; i < n; i++) {
                e = entries[i];
                if (e instanceof EGetter) {
                    console.log("e instanceof EGetter");
                }
                key = e.name||e.key;
                if (key instanceof String) {
                    key = key.valueOf();
                } else if (key instanceof VString || key instanceof QString) {
                    key = key.getValue();
                } else if (typeof key !== 'string') {
                    throw new Error("Incorrect key");
                }                
                this._value[key] = v = Expression.getInstance(e.value);
                this._entriesMap[key] = e;
                this._entries[i] = AEntry.getInstance(entries[i]);
                if (v.isYield()) {
                    this._yields++;
                }
                if (v.isYieldDelegation()) {
                    this._yieldDelegations++;
                }
            }
        } else if (isArray(entries[0])) {
            var k, v;
            for (var i = 0; i < n; i++) {
                e = entries[i];
                this._value[k = e[0]] = v = Expression.getInstance(e[1]);
                this._entriesMap[k] = this._entries[i] = new Entry(new VString(k), v);
                if (v.isYield()) {
                    this._yields++;
                }
                if (v.isYieldDelegation()) {
                    this._yieldDelegations++;
                }
            }
        } else if (typeof entries[0] === 'string') {
            n = (n - (n%2))/2;
            var k, v;
            for (var i = 0; i < n; i++) {                
                this._value[k = e[2*i]] = v = Expression.getInstance(e[2*i+1]);                
                this._entriesMap[k] = this._entries[i] = new Entry(new VString(k), v);
                if (v.isYield()) {
                    this._yields++;
                }
                if (v.isYieldDelegation()) {
                    this._yieldDelegations++;
                }
            }
        } else {
            throw new Error("Incorrect argument");
        }
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    VObject.prototype.isYield = function() {
        return this._yields > 0;
    };
    /**
     * 
     * @returns {Boolean}
     */
    VObject.prototype.isYieldDelegation = function() {
        return this._yieldDelegations > 0;
    };
    
    /**
     * 
     * @param {String} key
     * @param {Expression} value
     * @returns {VObject}
     */
    VObject.prototype.set = function(key, value) {
        this._value[key] = Expression.getInstance(value);
        return this;
    };
    
    /**
     * 
     * @param {String} key
     * @returns {Expression}
     */
    VObject.prototype.get = function(key) {
        return this._value[key];
    };
    /**
     * 
     * @param {String} key
     * @returns {Object}
     */
    VObject.prototype.getEntry = function(key) {
        return { key: key, value: this._value[key] };
    };
    /**
     * 
     * @returns {unsigned int}
     */
    VObject.prototype.keys = function() {
        return Object.keys(this._value);
    };
    /**
     * 
     * @returns {Number}
     */
    VObject.prototype.size = function() {
        return this._entries.length;
    };
    /**
     * 
     * @param {type} i
     * @returns {Entry}
     */
    VObject.prototype.getEntry = function(i) {
        return this._entries[i];
    };
    /**
     * 
     * @returns {Array}
     */
    VObject.prototype.getEntries = function() {
        return (function(entries) {
            function I(entries) {
                this.___$entries__ = entries;
            }
            I.prototype.size = function() {
                return this.___$entries__.length;
            };
            I.prototype.get = function(i) {
                return this.___$entries__[i];
            };
            Object.defineProperty(I.prototype, 'length',  {
                get: I.prototype.size,
                set: function() { throw new Error("Read only property"); }
            });
            return new I(entries);
        })(this._entries);
    };
    /**
     * 
     * @returns {String}
     */
    VObject.prototype.getInlineStatementString = function() {
        var s = "{", i = 0, entries = this._entries, n = entries.length, e;
        for (; i < n; i++) {
            e = entries[i];
            if (i > 0) {
                s += ",";
            }
            s += e.toString(true);
        }
        s += "}";
        return s;
    };
    VObject.prototype.getStatementString = function(ind, indentFirstLine) {
        var s  = "", i = 0, entries = this._entries, n = entries.length, e;
        var _ind = "";
        for (var k = 0; k < ind; k++) {
            _ind += "    ";
        }
        var _ind2 = "";
        for (var k = 0; k <= ind; k++) {
            _ind2 += "    ";
        }
        if (indentFirstLine) {
            s += _ind;
        }
        if (n === 0) {
            return s + "{}";
        }
        if (n === 1) {
            e = entries[0];
            s += "{" + e.toString(ind, false) + "}";
            return s;
        }
        s += "{";
        for (; i < n; i++) {
            e = entries[i];
            if (i > 0) {
                s += ",";
            }
            s += "\n" + _ind2 + e.toString(ind + 1, false);
        }
        s += "\n" + _ind + "}";
        return s;
    };
    /**
     * 
     */
    Object.defineProperties(VObject.prototype, {
        value: { get: VObject.prototype.getValue, set: VObject.prototype.setValue},
        map: { get: VObject.prototype.getValue, set: VObject.prototype.setValue},
        entries: { get: VObject.prototype.getEntries, set: VObject.prototype.setEntries},
        'length':  {
                get: VObject.prototype.size,
                set: function() { throw new Error("Read only property"); }
        }
    });


    /**
     * 
     * @returns {Undefined}
     * @class Undefined
     */
    function Undefined() {
        if (Undefined.__UNDEFINED__) {
            throw new Error("Instantiation forbidden");
        }
    }

    Undefined.__CLASS__ = Undefined;

    Undefined.__CLASS_NAME__ = "Undefined";

    Undefined.prototype = new Expression();

    Undefined.prototype.__CLASS__ = Undefined;

    Undefined.prototype.__CLASS_NAME__ = "Undefined";


    /**
     * 
     * @returns {undefined}
     */
    Undefined.prototype.valueOf = function() {
        return undefined;
    };
    /**
     * 
     * @returns {undefined}
     */
    Undefined.prototype.getValue = function() {
        return undefined;
    };
    /**
     * 
     * @returns {String}
     */
    Undefined.prototype.getInlineStatementString = function() {
        return "undefined";
    };
    
    /**
     * 
     * @returns {String}
     */
    Undefined.prototype.getInlineStatementString = function() {
        return "undefined";
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    Undefined.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "";
        if (indentFirstLine) {
            for (var i = 0; i < n; i++) {
                s += "    ";
            }
        }
        return s + "undefined";
    };

    

    /**
     * 
     * @type {Undefined}
     */
    Undefined.UNDEFINED = Null.__UNDEFINED__ = new Undefined();
    /**
     * 
     * @param {type} c
     * @returns {Undefined.UNDEFINED}
     */
    Undefined.UNDEFINED.setComment = function(c) {
        return this;
    }
    
    /**
     * 
     * @param {type} c
     * @returns {Undefined.UNDEFINED} };
     */
    Undefined.UNDEFINED.setInlineComment = function(c) {
        return this;
    };
    /**
     * 
     * @returns {Undefined}
     */
    Undefined.getInstance = function() {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var U = ns.Undefined||Undefined;
        return U.UNDEFINED;
    };

    /**
     * 
     * @param {type} b
     * @returns {Bool}
     */
    function Bool(b) {
        if (arguments.length > 0) {
            if (isPlainObject(b)) {
                this.setValue(b.value);
            } else {
                this.setValue(b);
            }
        } else {
            this._value = false;
        }
    }

    Bool.__CLASS__ = Bool;

    Bool.__CLASS_NAME__ = "Bool";

    Bool.prototype = new Litteral();

    Bool.prototype.__CLASS__ = Bool;

    Bool.prototype.__CLASS_NAME__ = "Bool";
    /**
     * 
     * @returns {Boolean}
     */
    Bool.prototype.getValue = function() {
        return this._value;
    };

    Bool.prototype.setValue = function(v) {
        if (typeof v === 'boolean') {
            this._value = v;
        } else if (v instanceof Boolean) {
            this._value = v.valueOf();
        } else if (v === 'true' || v === 'True' || v === 1) {
            this._value = true;
        }  else if (v === 'false' || v === 'False' || v === 0) {
            this._value = false;
        } else {
            incorrectArg();
        }
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Bool.prototype.valueOf = function() {
        return this._value;
    };
    /**
     * 
     * @param {Number|String|Date} n
     * @returns {Numeric}
     */
    function Numeric(n) {
        if (arguments.length > 0) {
            if (isPlainObject(n)) {
                this.setValue(n.value);
            } else {
                this.setValue(n);
            }
        } else {
            this._value = 0;
        }
    }

    Numeric.prototype = new Litteral();

    Numeric.__CLASS__ = Numeric;

    Numeric.__CLASS_NAME__ = "Numeric";

    Numeric.prototype.__CLASS__ = Numeric;

    Numeric.prototype.__CLASS_NAME__ = "Numeric";

    /**
     * 
     * @returns {Boolean}
     */
    Numeric.prototype.getValue = function() {
        return this._value;
    };

    Numeric.prototype.setValue = function(n) {
        if (n instanceof String) {
            n = n.valueOf();
        }

        if (n instanceof Number) {
            this._value = n.valueOf();
        } else if (typeof n === 'number') {
            this._value = n;
        } else if (typeof n === 'string') {
            this._value = n.indexOf(".") >= 0 ? parseFloat(n) : toInteger(n);
        } else if (n instanceof Date) {
            this._value = n.getTime();
        }
        return this;
    };
    /**
     * 
     * @returns {Number}
     */
    Numeric.prototype.valueOf = function() {
        return this._value;
    };
    /**
     * 
     * @param {Number|String|Date} n
     * @returns {VString}
     */
    function VString(n) {
        if (arguments.length > 0) {
            if (isPlainObject(n)) {
                this.setValue(n.value);
            } else {
                this.setValue(n);
            }
        } else {
            this._value = 0;
        }
    }

    VString.prototype = new Value();

    VString.__CLASS__ = VString;

    VString.__CLASS_NAME__ = "VString";

    VString.prototype.__CLASS__ = VString;

    VString.prototype.__CLASS_NAME__ = "VString";

    /**
     * 
     * @returns {Boolean}
     */
    VString.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {String} s
     * @returns {VString}
     */
    VString.prototype.setValue = function(s) {
        function lpad(s, length) {
            var s = "" + s;
            for (var i = length = s.length; i >= 0; i--) {
                s = '0' + s;
            }
            return s;
        }
        if (s instanceof String) {
            s = s.valueOf();
        }

        if (typeof s === 'string') {
            this._value = s;
        } else if (typeof s === 'number' || s instanceof Number 
                || typeof s === 'boolean' || s instanceof Boolean
                || typeof s === 'function' || s instanceof Function) {
            this._value = String(s);
        } else if (s instanceof Date) {
            if (globalNS.dateProcessor) { //if dateProcessor global variable defined
                this._value = dateProcessor.format(globalNS.DEFAULT_DATETIME_FORMAT||'yyyy-MM-dd HH:mm:ssZ');
            } else {
                this._value = "" 
                        + lpad(s.getFullYear(), 4) 
                        + "-" + lpad(s.getMonth(), 2) 
                        + "-" + lpad(s.getDate(), 2) 
                        + ' ' + lpad(s.getUTCHours(), 2) 
                        + ':' + lpad(s.getUTCMinutes(), 2) 
                        + ':' + lpad(s.getUTCSeconds(),2) 
                        + '.' + lpad(s.getMilliseconds(), 3)
                        + 'Z';
            }
        } else {
            throw new Error("Incorrect argument");
        }
        return this;
    };
    /**
     * 
     * @returns {Number}
     */
    VString.prototype.valueOf = function() {
        return this._value;
    };
    VString.prototype.getInlineStatementString = function() {
        return this._value||"";
    };
    
    VString.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                str += "    ";
            }
        }
        str += this._value||"";
        return str;
    };
    var VNumber = Numeric;
    /**
     * <h3>Computed Object Property Name class</h3>
     * @param {String|Expression|Object} [cn] Computed name string expression, expression or expression definition.
     * @returns {CName}
     * @class CName
     */
    function CName(cn) {
        this._openBracket = '[';
        this._closeBracket = ']';
        if (arguments.length > 0) {
            if (cn instanceof String) {
                cn = cn.valueOf();
            }
            if (typeof cn === 'string') {
                this.setString(cn);            
            } else if (cn instanceof Expression) {
                this.setExpression(cn);
            } else if (isPlainObject(cn)) {
                if (hasOwnProp(cn, 'expression') || hasOwnProp(cn, 'Expression')) {
                    this._openBracket = cn.openBracket||'[';
                    this._closeBracket = cn.closeBracket||']';  
                    this.setExpression(cn.expression);
                } else if (hasOwnProp(cn, 'string') || hasOwnProp(cn, 'String')) {
                    this._openBracket = cn.openBracket||'[';
                    this._closeBracket = cn.closeBracket||']';
                    this.setString(cn.string||cn.String);
                } else if (hasOwnProp(cn, 'name') || hasOwnProp(cn, 'Name') 
                        || hasOwnProp(cn, 'value') || hasOwnProp(cn, 'Value')
                        || hasOwnProp(cn, 'stringValue') || hasOwnProp(cn, 'StringValue')) {
                    var open = cn.openBracket,
                        close = cn.closeBracket;
                    var name = cn.name||cn.Name||cn.value||cn.Value||cn.stringValue||cn.StringValue||"";
                    if (!close) {
                        var brackets = { '[': ']', '{' : '}', '<' : '>' }, ch = open||name[0];

                        for (var key in brackets) {
                            if (key === ch) {
                                close = brackets[ch];
                                if (!open) {
                                    open = ch;
                                }
                                break;
                            }
                        }
                    }

                    if (close) {
                        this._openBracket = open;
                        this._closeBracket = close;
                    } else {
                        this._openBracket = cn.openBracket||'[';
                        this._closeBracket = cn.closeBracket||']';
                    }
                    this.setString(name);
                } else {
                    this.setExpression(cn);
                }
            }
        }
    }
    
    CName.SQUARE_REGEXP_GLOBAL = /^\[(\\\[|\\\]|[^\[\]])*\]$/;
    CName.SQUARE_REGEXP = /\[(\\\[|\\\]|[^\[\]])*\]/g;
    
    CName.CURLY_REGEXP_GLOBAL = /^\{(\\\{|\\\}|[^\{\}])*\}$/;
    CName.CURLY_REGEXP = /\{(\\\{|\\\}|[^\{\}])*\}/g;
    
    CName.ARROW_REGEXP_GLOBAL = /^\<(\\<|\\>|[^<>])*\>$/;
    CName.ARROW_REGEXP = /\<(\\<|\\>|[^<>])*\>/g;
    
    
    CName.prototype = new StatementElt();
    
    CName.__CLASS__ = CName;
    
    CName.__CLASS_NAME__ = "CName";
    
    CName.prototype.__CLASS__ = CName;
    
    CName.prototype.__CLASS_NAME__ = "CName";
    
    /**
     * 
     * @param {String} string
     * @param {char} openBracket
     * @param {char} closeBracket
     * @returns {String}
     */
    CName.unescape = function(string, openBracket, closeBracket) {
        if (!openBracket) {
            openBracket = '[';
        }
        
        if (!closeBracket) {
            closeBracket = openBracket === '[' ? ']' : openBracket === '<' ? '>' : openBracket === '{' ? '}' : (function() {throw new Error('No quote closer');})();
        }
        return string.replace(new RegExp("\\" + openBracket , "g"), openBracket).replace(new RegExp("\\" + closeBracket, "g"), closeBracket);
    };

    /**
     * 
     * @param {String} string
     * @param {char} openBracket
     * @param {char} closeBracket
     * @returns {String}
     */
    CName.escape = function(string, openBracket, closeBracket) {
        if (!openBracket) {
            openBracket = '[';
        }
        
        if (!closeBracket) {
            closeBracket = openBracket === '[' ? ']' : openBracket === '<' ? '>' : openBracket === '{' ? '}' : (function() {throw new Error('No quote closer');})();
        }
        return string.replace(new RegExp(openBracket, "g"), '\\'  + openBracket).replace(new RegExp(openBracket, "g"), '\\'  + closeBracket);
    };
    /**
     * 
     * @returns {String}
     */
    CName.prototype.getString = function() {
        return this._string||"";
    };
    /**
     * 
     * @param {type} sexpr
     * @returns {CName}
     */
    CName.prototype.setString = function(sexpr) {
        var C = this.__CLASS__;
        if (sexpr[0] === this._openBracket ) {
            if (!C.SQUARE_REGEXP_GLOBAL.exec(sexpr)) {
                throw new Error("Incorrect computed object property name: '" + sexpr + "'");
            }
            this._expression = C.expression(C.unescape(sexpr.substring(1,sexpr.length - 1)).trim());
            this._string = sexpr;
        } else {
            this._expression = C.expression(sexpr);
            this._string = this._openBracket + C.escape(sexpr.trim()) + this._closeBracket;
        }
        return this;
    };
    /**
     * 
     * @param {Expression|Object} e
     * @returns {CName}
     */
    CName.setExpression = function (e) {
        if (!e instanceof Expression) {
            e = Expression.getInstance(e);
        }
        this._string = this._openBracket + e.toString(true) + this._closeBracket;
        this._expression = e;
        return this;
    };
    /**
     * 
     * @param {String} sexpr The string representation of the expression
     * @param {Function|Object} [parser=null]
     * @returns {unresolved}
     */
    CName.expression = function(sexpr, parser) {
        var _parser = parser;
        if (!_parser) {
            if (CName.expressionParser) {
                _parser = CName.expressionParser;
            } else if (globalNS.expressionParser) {
                _parser = globalNS.expressionParser;
            } else if (ExpressionParser) {
                _parser = ExpressionParser;
            }
        }
        if (typeof _parser === 'function') {
            this._expression = _parser(sexpr);
        } else if (_parser) {
            this._expression = _parser.parse(sexpr);
        } else {
            return sexpr;
        }
    };
    var CKey = CName;
    
    
    
    /**
     * <h3>Quoted String class</h3>
     * 
     * @abstract
     * @param {String} s
     * @returns {AQString}
     * @class
     */
    function AQString(s) {
        if (this.__CLASS__ === AQString && AQString.__QString_initialized__) {
            throw new Error("[AQString]: Abstract class instantiation");
        }
        if (arguments.length === 0) {
            this._quote = '"';
            this._value = "";
        } else if (arguments.length === 1) {
            if (isPlainObject(s)) {
                if (s.string||s.qstring||s.quotedString || typeof s.quote === 'undefined') {
                    this.setString(s.string||s.qstring||s.quotedString||s.value);
                } else if (typeof s.quote === 'string') {
                    this._quote = s.quote;
                    this._value = s.value;
                }
            } else if (typeof s === 'string') {
                this.setString(s);
            }
        }
    }
    
    /**
     * 
     * @param {String} string
     * @param {char} quote
     * @param {String|Array&lt;String&gt;} esc
     * @returns {String}
     */
    AQString.unescape = function(string, quote, esc) {
        if (typeof esc === 'string' ) { 
            esc = new RegExp(esc, "g");
        } else if (isArray(esc)) {
            var re = "";
            for (var i = 0; i < esc.length; i++) {
                if (i > 0) {
                    re += "|";
                }
                re += esc[i];
            }
            esc = new RegExp(re, "g");
        }
        return string.replace(esc||new RegExp("\\" + quote + "|" + quote + quote, "g"), quote);
    };

    /**
     * 
     * @param {String} string
     * @param {char} quote
     * @param {char} esc  The escaper
     * @returns {String}
     */
    AQString.escape = function(string, quote, esc) {
        return string.replace(new RegExp(quote, "g"), (esc||quote)  + quote);
    };

    AQString.__CLASS__ = AQString;

    AQString.__CLASS_NAME__ = "AQString";

    AQString.prototype = new Litteral();

    AQString.prototype.__CLASS__ = AQString;

    AQString.prototype.__CLASS_NAME__ = "AQString";
    /**
     * 
     * @returns {String}
     */
    AQString.prototype.getQuote = function() {
        return this._quote||"\"";
    };
    /**
     * 
     * @param {type} q
     * @returns {AQString}
     */
    AQString.prototype.setQuote = function(q) {
        if (this.__CLASS__.QUOTES.indexOf(q) < 0) {
            throw new Error("Incorrect quote: '" + q + "'");
        }
        this._quote = q;
        this.__string_ = null;
        return this;
    };

    /**
     * 
     * @returns {String}
     */
    AQString.prototype.getValue = function() {
        return this._value||"";
    };
    /**
     * 
     * @param {type} v
     * @returns {AQString}
     */
    AQString.prototype.setValue = function(v) {
        this._value = v;
        this.__string_ = null;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    AQString.prototype.getString = function() {
        if (!this.__string_) {
            if (typeof this._value === 'undefined' || this._value === null) {
                return null;
            }
            if (!this._quote) {
                this._quote = '"';
            }
            this.__string_ = this._quote + this.__CLASS__.escape(this._value, this.__quote) + this._quote;
        }
        return this.__string_;
    };
    /**
     * 
     * @param {String} s
     * @returns {AQString}
     */
    AQString.prototype.setString = function(s) {
        if (s.length < 2 || this.__CLASS__.QUOTES.indexOf(s[0]) < 0 || (s[s.length - 1] !== s[0])) {
            throw new Error("Incorrect quoted string:\n" + s);
        }
        this._quote = s[0];
        this.__string_ = s;
        if (s === '""' || s === "''" || s === "``") {
            this._value = "";
        } else {
            this._value = AQString.unescape(s.substring(1, s.length - 1), this._quote);
        }
        return this;
    };
    /**
     * 
     * @type Array&lt;String&gt;
     */
    AQString.QUOTES = ['"', "'", "`"];
    /**
     * 
     * @returns {String}
     */
    AQString.prototype.valueOf = function() {
        return this.getValue();
    };
    /**
     * 
     * @returns {String}
     */
    AQString.prototype.toString = function() {
       if (this.__string_) {
           return this.__string_;
       } else  {
           var q = this.getQuote();
           this.__string_ = q + AQString.escape(this._value||"", q) + q;
           return this.__string_;
       }
    }; 
    /**
     * Returns a quoted string object that coresponds to the open/start quote 
     * character of the given javascript string.
     * @param {String} qs  The javascript string from which create a quoted string object.
     * @returns {QString|EQString}
     * @type function
     */
    AQString.getInstance = function(qs) {
        if (qs[0] === '"' || qs[0] === "'") return new QString(qs);
        if (qs[0] === '`') return new EQString(qs);
        throw new Error("[AQString]: Not starting with a valid quote character:\n--------------------------------\n" + qs);
    };
    
    
    
    
    
    /**
     * 
     * @returns {QString}
     */
    function QString() {
        AQString.apply(this, arguments);
    }
    
    QString.prototype = new AQString();
    
    QString.__CLASS__ = QString;

    QString.__CLASS_NAME__ = "QString";

    QString.prototype.__CLASS__ = QString;

    QString.prototype.__CLASS_NAME__ = "QString";
    
    QString.GLOBAL_RE = new XRegExp(getSQuotedStringRe(["'", '"'],
                SERENIX_QUOTES_ESCAPES||SERENIX_DEFAULT_QUOTES_ESCAPES||[ '\\', 'quote' ], true, qstringKey), 'g');
                
                
   /**
     * 
     * @type Array&lt;String&gt;
     */
    QString.QUOTES = ['"', "'", "`"];
    
    
    /**
     * 
     * @param {type} s
     * @returns {Boolean}
     */
    QString.is = function(s) {
        if (!(typeof s === 'string'))
            return false;
        if (isArray(QString.GLOBAL_RE)) {
            for (var i = 0; i < QString.GLOBAL_RE.length; i++) {
                if (QString.GLOBAL_RE[i].exec(s)) {
                    return true;
                }
            }
            return false;
        }
        return QString.GLOBAL_RE.exec(s) ? true: false;
    };
    QString.isQuotedString = QString.is;
    QString.escape = AQString.escape;
    QString.unescape = AQString.unescape;
    /**
     * @property value : the unquoted and unescaped string value
     * @property string : the quoted and escaped string value
     * @property quote : the quote used
     */
    Object.defineProperties(QString.prototype, {
        value: { get : QString.prototype.getValue, set: QString.prototype.setValue },
        string: { get : QString.prototype.getString, set: QString.prototype.setString },
        quote: { get : QString.prototype.getQuote, set: QString.prototype.setQuote }
    });
    
    /**
     * <h3>Executable Quoted String class</h3>
     * 
     * @returns {EQString}
     */
    function EQString() {
        AQString.apply(this, arguments);
    }
    
    EQString.prototype = new AQString();
    
    EQString.__CLASS__ = EQString;

    EQString.__CLASS_NAME__ = "EQString";

    EQString.prototype.__CLASS__ = EQString;

    EQString.prototype.__CLASS_NAME__ = "EQString";
    
    EQString.GLOBAL_RE = new XRegExp(getSQuotedStringRe(["`"],
                SERENIX_QUOTES_ESCAPES||SERENIX_DEFAULT_QUOTES_ESCAPES||[ '\\', 'quote' ], true, qstringKey), 'g');
                
                
   /**
     * 
     * @type Array&lt;String&gt;
     */
    EQString.QUOTES = ['"', "'", "`"];
    
    
    /**
     * 
     * @param {type} s
     * @returns {Boolean}
     */
    EQString.is = function(s) {
        if (!(typeof s === 'string'))
            return false;
        if (isArray(EQString.GLOBAL_RE)) {
            for (var i = 0; i < EQString.GLOBAL_RE.length; i++) {
                if (EQString.GLOBAL_RE[i].exec(s)) {
                    return true;
                }
            }
            return false;
        }
        return EQString.GLOBAL_RE.exec(s) ? true: false;
    };
    
    AQString.QString = QString;
    
    AQString.EQString = EQString;
    
    QString.EQString = EQString;
    
    EQString.QString = QString;
    
    EQString.isQuotedString = EQString.is;
    EQString.escape = AQString.escape;
    EQString.unescape = AQString.unescape;
    
    /**
     * @property value : the unquoted and unescaped string value
     * @property string : the quoted and escaped string value
     * @property quote : the quote used
     */
    Object.defineProperties(EQString.prototype, {
        value: { get : EQString.prototype.getValue, set: EQString.prototype.setValue },
        string: { get : EQString.prototype.getString, set: EQString.prototype.setString },
        quote: { get : EQString.prototype.getQuote, set: EQString.prototype.setQuote }
    });
    /**
     * Returns a quoted string object that coresponds to the open/start quote 
     * character of the given javascript string.
     * @param {String} qs  The javascript string from which create a quoted string object.
     * @returns {QString|EQString}
     * @alias AQString.getInstance
     * @type function
     */
    EQString.getInstance = AQString.getInstance;
    /**
     * Returns a quoted string object that coresponds to the open/start quote 
     * character of the given javascript string.
     * @param {String} qs  The javascript string from which create a quoted string object.
     * @returns {QString|EQString}
     * @alias AQString.getInstance
     * @type function
     */
    QString.getInstance = AQString.getInstance;
    
    //
    //__QString_initialized__ is an inner static property of the class AQString
    Object.defineProperty(AQString, '__QString_initialized__', {
        get: function() { return (AQString.QString && AQString.EQString) || EQString.QString || QString.EQString; }, 
        set : function() { throw new Error("Read only property"); }
    });
    /**
     * 
     * @param {type} o
     * @returns {RefChain}
     */
    function RefChain(o) {
        this._optionalChaining = false;
        if (arguments.length === 1) {
            if (isPlainObject(o)) {
                this.setOwner(o.owner||o.Owner||o.parent||o.Parent||null);
                this.setName(o.name||o.Name);                        
            } else if (typeof o === 'string') {
                var owner = null, ofs = 0, i;
                for (;;) {
                    i = o.indexOf(".", ofs);
                    if (i < 0) {
                        this._name = o.substring(ofs);
                        this._owner = owner;
                        this._optionalChaining = toBool(o.optionalChaining);
                        return;
                    } else {
                        owner = new (this.__CLASS__||RefChain)(o.substring(ofs, i), owner);
                        ofs = i + 1;
                    }
                }
            }
        } else if (arguments.length > 1) {
            if (typeof arguments[0] === 'string') {
                if (arguments[1] !== null && typeof arguments[1] !== 'undefined'  && !isPlainObject(arguments[1])) {
                    incorrectArgs(); //throw "Incorrect arguments";
                }
                this.setOwner(arguments[1]);
                this.setName(arguments[0]);                        
            } else if (isPlainObject(arguments[0])) {
                if (typeof arguments[0] !== 'string') {
                    incorrectArgs(); //throw "Incorrect arguments";
                }
                this.setOwner(arguments[0]);
                this.setName(arguments[1]);                        
            } else {
                incorrectArgs(); //throw "Incorrect arguments";
            }
            if (arguments.length > 2) {
                this._optionalChaining = toBool(arguments[2]);
            }
        }
    }

    RefChain.__CLASS__ = RefChain;

    RefChain.__CLASS_NAME__ = "RefChain";

    RefChain.getInstance = function(c) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var RefChain = ns.RefChain||RefChain;
        var owner = null, o = 0, i;
        if (typeof c === 'string') {
            for (;;) {
                i = c.indexOf(".", o);
                if (i < 0) {
                    return new RefChain(c.substring(o), owner);
                } else {
                    owner = new RefChain(c.substring(o, i), owner);
                    o = i + 1;
                }
            }
        }
        //TODO
    };

    RefChain.prototype = new Expression();
   /**
    * 
    * @returns {String}
    */
   RefChain.prototype.getName = function() {
       return this._name||"";
   };
    /**
     * 
     * @param {String} name
     * @returns {RefChain}
     */
    RefChain.prototype.setName = function(name) {
        var owner = this._owner||null, ofs = 0, i;
        for (;;) {
            i = name.indexOf(".", ofs);
            if (i < 0) {
                this._name = name.substring(ofs);
                this._owner = owner;
                return this;
            } else {
                owner = new (this.__CLASS__||RefChain)(name.substring(ofs, i), owner);
                ofs = i + 1;
            }
        }
    };
   /**
    * 
    * @returns {String}
    */
   RefChain.prototype.getOwner = function() {
       return this._owner;
   };
   /**
    * 
    * @param {String} owner
    * @returns {RefChain}
    */
   RefChain.prototype.setOwner = function(owner) {
       this._owner = owner;
       return this;
   };
   /**
    * 
    * @returns {Boolean}
    */
   RefChain.prototype.isOptionalChaining = function() {
       return this._optionalChaining;
   };
   /**
    * 
    * @param {Boolean} optionalChaining
    * @returns {RefChain}
    */
   RefChain.prototype.setOptionalChaining = function(optionalChaining) {
       this._optionalChaining = toBool(optionalChaining);
       return this;
   };
   /**
    * 
    * @returns {Boolean}
    */
   RefChain.prototype.isYield = function() {
       return this._owner? this._owner.isYield() : false;
   };
   /**
    * 
    * @returns {Boolean}
    */
   RefChain.prototype.isYieldDelegation = function() {
       return this._owner? this._owner.isYieldDelegation() : false;
   };
   /**
    * 
    * @returns {IComment}
    */
   RefChain.prototype.getOuterInlineComment = function() {
       return this._outerInlineComment;
   };
   /**
    * 
    * @param {type} c
    * @returns {RefChain.prototype}
    */
   RefChain.prototype.setOuterInlineComment = function(c) {
       this._outerInlineComment = c instanceof IComment ? c : IComment.getInstance(c);
       return this;
   };




   /**
    * 
    * @returns {Reference}
    */
   function Reference() {
       RefChain.apply(this, [].slice.call(arguments));
       this._optionalChaining = false;
   }

   Reference.__CLASS__ = Reference;

   Reference.__CLASS_NAME__ = "Reference";

   Reference.prototype = new RefChain();

   Reference.prototype.__CLASS__ = Reference;

   Reference.prototype.__CLASS_NAME__ = "Reference";
   /**
    * 
    * @returns {Boolean}
    */
   Reference.prototype.isOptionalChaining = function() {
       return false;
   };
   /**
    * 
    * @param {Boolean} optionalChaining
    */
   Reference.prototype.setOptionalChaining = function(optionalChaining) {
       return this;
   };
   
   /**
    * 
    * @returns {Boolean}
    */
   Reference.prototype.isVariable = function() {
       return this._owner === null;
   };
   
   /**
    * 
    * @param {Number} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   Reference.prototype.getStatementString = function(ind, indentFirstLine) {
       if (this._owner) {
           return this._owner.toString(ind, indentFirstLine) + "." + this.getName();
       }
       var _ind = "";
       if (indentFirstLine) {
           for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }
       }
       return _ind + this.getName();
   };
   
   /**
    * 
    * @returns {String}
    */
   Reference.prototype.getInlineStatementString = function() {
       if (this._owner) {
           return this._owner.toString() + "." + this.getName();
       }
       return this.getName();
   };

   Object.defineProperties(Reference.prototype, {
       "owner" : { get: Reference.prototype.getOwner, set: Reference.prototype.setOwner },
       "name" : { get: Reference.prototype.getName, set: Reference.prototype.setName },
       "optionalChaining": { get: Reference.prototype.isOptionalChaining, set: Reference.prototype.setOptionalChaining }
   });

    /**
     * 
     * @class
     */
    function Variable() {
        var a = arguments[0];
        if (typeof a === 'string') {
            this._name = a;
            if (arguments.length > 1) {
                this._value = arguments[1];
            }
        } else if (isPlainObject(a)) {
            var v = a.name||a.Name;
            if (typeof v !== 'string') {
                incorrectArg(); //throw exception
            }
            if (v === '') {
                throw new Error("Empty variable name");
            }
            this._name = v;
            v = a.value||a.Value;
            if (typeof v !== 'undefined') {
                this._value = Expression.getInstance(v);
            }
        }
    }

    Variable.prototype = new Expression();

    /**
     * 
     * @returns {String}
     */
    Variable.prototype.getName = function() {
        return this._name||"";
    };
    /**
     * 
     * @param {String} name
     * @returns {Variable}
     */
    Variable.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    
    /**
     * 
     * @returns {type}
     */
    Variable.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @param {type} type
     * @returns {NVariable.prototype}
     */
    Variable.prototype.setType = function(type) {
        this._type = FType.getInstance(type);
        return this;
    };

    /**
     * 
     * @returns {String}
     */
    Variable.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {String} value
     * @returns {Variable}
     */
    Variable.prototype.setValue = function(value) {
        this._value = value;
        return this;
    };
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {unresolved}
     */
    Variable.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "";
        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                s += "    ";
            }
        }
        s += this._name||"";
        if (this._value) {                    
            s += "=";
            s += this._value.toString(ind, false);
        }
        return s;
    };
    /**
     * 
     * @returns {String}
     */
    Variable.prototype.getInlineStatementString = function() {
        var s = this._name||"";
        if (this._value) {
            s += "=";
            s += this._value.toString(true);
        }
        return s;
    };

    Variable.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        var s = "";


        if (inline) {
            s += this._name||"";
            if (this._value) {
                s += "=";
                s += this._value.toString(true);
            }
            return s;
        }
        if (indentFirstLine) {
            for (var k = 0; k < ind; k++) {
                s += "    ";
            }
        }
        s += this._name||"";
        if (this._value) {                    
            s += "=";
            s += this._value.toString(ind, false);
        }
        return s;
    };
    /**
     * 
     * @returns {IComment}
     */
    Variable.prototype.getAfterNameComment = function() {
        return this._afterNameComment;
    };
    /**
     * 
     * @param {IComment} afterNameComment
     * @param {Boolean} [inlineAfterNameComment]
     * @returns {Variable}
     */
    Variable.prototype.setAfterNameComment = function(afterNameComment, inlineAfterNameComment) {
        this._afterNameComment = afterNameComment;
        if (arguments.length > 1) {
            this._inlineAfterNameComment = toBool(inlineAfterNameComment);
        }
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Variable.prototype.getInlineAfterNameComment = function() {
        return this._inlineAfterNameComment;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Variable.prototype.isInlineAfterNameComment = function() {
        return toBool(this._inlineAfterNameComment);
    };
    /**
     * 
     * @param {Boolean} inlineAfterNameComment
     * @returns {Variable}
     */
    Variable.prototype.setInlineAfterNameComment = function(inlineAfterNameComment) {
        this._inlineAfterNameComment = toBool(inlineAfterNameComment);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    Variable.prototype.getBeforeNameComment = function() {
        return this._beforeNameComment;
    };
    /**
     * 
     * @param {IComment} beforeNameComment
     * @returns {Variable}
     */
    Variable.prototype.setBeforeNameComment = function(beforeNameComment) {
        this._beforeNameComment = beforeNameComment;
        return this;
    };
    
    /**
     * 
     * @returns {IComment}
     */
    Variable.prototype.getBeforeValueComment = function() {
        return this._beforeValueComment;
    };
    /**
     * 
     * @param {IComment} beforeValueComment
     * @returns {Variable}
     */
    Variable.prototype.setBeforeValueComment = function(beforeValueComment) {
        this._beforeValueComment = beforeValueComment;
        return this;
    };
    
    /**
     * 
     * @returns {IComment}
     */
    Variable.prototype.getAfterValueComment = Variable.prototype.getEndComment;
    /**
     * 
     * @param {IComment} beforeValueComment
     * @returns {Variable}
     */
    Variable.prototype.setAfterValueComment = Variable.prototype.setEndComment;
    
    /**
     * 
     * @returns {IComment}
     */
    Variable.prototype.getAfterValueInlineComment = Variable.prototype.getInlineEndComment;
    /**
     * 
     * @param {IComment} beforeValueComment
     * @returns {Variable}
     */
    Variable.prototype.setAfterValueInlineComment = Variable.prototype.setEndInlineComment;

    /**
     * 
     * @property {String} name The name of the variable
     * @property {type} value The value of the variable
     * @property {IComment} comment The (top) comment of the variable
     * @property {IComment} afterNameComment The comment that came immediately after the name of the variable
     * @property {IComment} beforeValueComment The comment that came immediately after the assign operator of the variable
     * @property {IComment} endComment The (top) The comment that came immediately after the value of the variable
     * @property {IComment} inlineComment The comment after closing the declaration and in the ame line with the last line of the value
     */
    Object.defineProperties(Variable.prototype, {       
       "name" : { get: Variable.prototype.getName, set: Variable.prototype.setName },
       "value" : { get: Variable.prototype.getValue, set: Variable.prototype.setValue },
       "comment" : { get: Variable.prototype.getComment, set: Variable.prototype.setComment },
       "afterNameComment" : { get: Variable.prototype.getAfterNameComment, set: Variable.prototype.setAfterNameComment },
       "beforeValueComment" : { get: Variable.prototype.getBeforeValueComment, set: Variable.prototype.setBeforeValueComment },
       "endComment" : { get: Variable.prototype.getEndComment, set: Variable.prototype.setEndComment },
       "inlineComment" : { get: Variable.prototype.getInlineComment, set: Variable.prototype.setInlineComment }
   });

    

    /**
     * <h3>Optional Chaining Reference class</h3>
     * 
     * @returns {OCRef}
     * @class OCRef
     */
    function OCRef() {
        RefChain.apply(this, [].slice.call(arguments));
        this._optionalChaining = true;
    }


    OCRef.__CLASS__ = OCRef;
    OCRef.__CLASS_NAME__ = "OCRef";

    OCRef.prototype = new RefChain();

    OCRef.prototype.__CLASS__ = OCRef;

    OCRef.prototype.__CLASS_NAME__ = "OCRef";

    /**
     * 
     * @returns {Boolean}
     */
    OCRef.prototype.isOptionalChaining = function() {
        return true;
    };
    /**
     * 
     * @param {Boolean} optionalChaining
     */
    OCRef.prototype.setOptionalChaining = function(optionalChaining) {
        return this;
    };
    
    /**
     * 
     * @returns {String}
     */
    OCRef.prototype.toString = function() {
        return ( this._owner ? this._owner.toString() : "") + "?." + this.getName();
    };

    Object.defineProperties(OCRef.prototype, {
        "owner" : { get: OCRef.prototype.getOwner, set: OCRef.prototype.setOwner },
        "name" : { get: OCRef.prototype.getName, set: OCRef.prototype.setName },
        "optionalChaining": { get: OCRef.prototype.isOptionalChaining, set: OCRef.prototype.setOptionalChaining }
    });
    /**
     * 
     * @param {type} o
     * @returns {BaseIndex}
     */
    function BaseIndex(o) {
        if (arguments.length === 1) {
             if (isPlainObject(o)) {
                 this.setIndex(o.index||o.BaseIndex||o.reference||o.Reference||o.name||o.Name);
                 this.setOwner(o.owner||o.Owner||o.object||o.Object||o.parent||o.Parent||null);
             }
         } else if (arguments.length > 1) {
             if (typeof o === 'number') {
                 this.setOwner(arguments[1]);
                 this.setIndex(new Numeric(o));
             } else if (typeof o === 'string') {
                 this.setOwner(arguments[1]);
                 this.setIndex(new QString(o));
             } else {
                 this.setOwner(o);
                 this.setIndex(arguments[1]);
             }
         }
    }
    //inheriting Expression class
    BaseIndex.prototype = new Expression();  
    /**
     * 
     * @type String
     */
    BaseIndex.__CLASS__ = BaseIndex;
    /**
     * 
     * @type String
     */
    BaseIndex.__CLASS_NAME__ = "BaseIndex";
    /**
     * 
     * @type Expression
     */
    BaseIndex.__SUPER_CLASS__ = Expression;

    BaseIndex.prototype.__CLASS__ = BaseIndex;
    /**
     * 
     * @type String
     */
    BaseIndex.prototype.__CLASS_NAME__ = "BaseIndex";

    /**
     * 
     * @returns {String}
     */
    BaseIndex.prototype.getIndex = function() {
        return this._index;
    };
    /**
     * 
     * @param {String} index
     * @returns {BaseIndex}
     */
    BaseIndex.prototype.setIndex = function(index) {
        this._index = Expression.getInstance(index);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    BaseIndex.prototype.getOwner = function() {
        return this._owner;
    };
    /**
     * 
     * @param {String} owner
     * @returns {BaseIndex}
     */
    BaseIndex.prototype.setOwner = function(owner) {
        if (typeof owner === "undefined") {
            throw new Error("Undefined owner");
        }
        if (owner === null) {
            throw new Error("Null owner");
        }
        this._owner = owner;
        return this;
    };

    /**
     * 
     * @param {Boolean} optionalChaining
     */
    BaseIndex.prototype.setOptionalChaining = function(optionalChaining) {
        return this;
    };
    /**
    * 
    * @returns {Boolean}
    */
   BaseIndex.prototype.isYield = function() {
       if (this._owner && this._owner.isYield()) {
           return true;
       }
       return this._index ? this._index.isYield() : false;
   };
   /**
    * 
    * @returns {Boolean}
    */
   BaseIndex.prototype.isYieldDelegation = function() {
       if (this._owner && this._owner.isYieldDelegation()) {
           return true;
       }
       return this._index ? this._index.isYieldDelegation() : false;
   };
    /**
    * 
    * @returns {IComment}
    */
   BaseIndex.prototype.getOuterInlineComment = function() {
       return this._outerInlineComment;
   };
   /**
    * 
    * @param {type} c
    * @returns {Reference.prototype}
    */
   BaseIndex.prototype.setOuterInlineComment = function(c) {
       this._outerInlineComment = c instanceof IComment ? c : IComment.getInstance(c);
       return this;
   };
    
    

    /**
     * <h3>Index class</h3>
     * @returns {Index}
     * @class Index
     */
    function Index() {
        BaseIndex.apply(this, [].slice.call(arguments));
        this._optionalChaining = false;
    }
    //inherithing BaseIndex properties 
    Index.prototype = new BaseIndex();
    /**
     * 
     * @type Index
     */
    Index.__CLASS__ = Index;
    /**
     * 
     * @type String
     */
    Index.__CLASS_NAME__ = "Index";
    
    /**
     * 
     * @type Index
     */
    Index.__SUPER_CLASS__ = BaseIndex;
    /**
     * 
     * @type Index
     */
    Index.prototype.__CLASS__ = Index;
    /**
     * 
     * @type String
     */
    Index.prototype.__CLASS_NAME__ = "Index";
    /**
     * 
     * @returns {Boolean}
     */
    Index.prototype.isOptionalChaining = function() {
        return false;
    };

    
    Index.prototype.getInlineStatementString = function() {
        var i = this.getIndex();
        return (this._owner ? this._owner.toString() : "") + "[" + (i ? i.toString() :"\"\"" ) + "]";
    };
    
    Index.prototype.getStatementString = function(ind, indentFirstLine) {
        var i = this.getIndex();
        return (this._owner ? this._owner.toString(ind, indentFirstLine) : "") + "[" + (i ? i.toString() :"\"\"" ) + "]";
    };

    Object.defineProperties(Index.prototype, {
        "owner" : { get: Index.prototype.getOwner, set: Index.prototype.setOwner },
        "index" : { get: Index.prototype.getIndex, set: Index.prototype.setIndex },
        "optionalChaining" : { get: Index.prototype.isOptionalChaining, set: Index.prototype.setOptionalChaining }
    });




    /**
     * <h3>Optional Chaining Index class</h3>
     * 
     * @returns {undefined}
     */
    function OCIndex() {
        BaseIndex.apply(this, [].slice.call(arguments));
        this._optionalChaining = true;
    }

    OCIndex.prototype = new BaseIndex();

    OCIndex.__CLASS__ = OCIndex;

    OCIndex.__CLASS_NAME__ = "OCIndex";

    OCIndex.prototype.__CLASS__ = OCIndex;

    OCIndex.prototype.__CLASS_NAME__ = "OCIndex";
    /**
     * 
     * @returns {Boolean}
     */
    OCIndex.prototype.isOptionalChaining = function() {
        return false;
    };

    
    OCIndex.prototype.getInlineStatementString = function() {
        var i = this.getIndex();
        return (this._owner ? this._owner.toString() : "") + "?[" + (i ? i.toString() :"\"\"" ) + "]";
    };
    
    OCIndex.prototype.getStatementString = function(ind, indentFirstLine) {
        var i = this.getIndex();
        return (this._owner ? this._owner.toString(ind, indentFirstLine) : "") + "?[" + (i ? i.toString() :"\"\"" ) + "]";
    };

    Object.defineProperties(OCIndex.prototype, {
        "owner" : { get: OCIndex.prototype.getOwner, set: OCIndex.prototype.setOwner },
        "index" : { get: OCIndex.prototype.getIndex, set: OCIndex.prototype.setIndex },
        "optionalChaining" : { get: OCIndex.prototype.isOptionalChaining, set: OCIndex.prototype.setOptionalChaining }
    });


   /**
    * 
    * @class Statement
    */
   function Statement() {}

   Statement.prototype = new StatementElt();

   Statement.__CLASS__ = Statement;

   Statement.__CLASS_NAME__ = "Statement";

   Statement.prototype.__CLASS__ = Statement;

    Statement.prototype.__CLASS_NAME__ = "Statement";
    
    /**
     * 
     * @returns {IComment}
     */
    Statement.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {type} c
     * @returns {Reference.prototype}
     */
    Statement.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = c instanceof IComment ? c : IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Statement.prototype.isYield = function() {
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Statement.prototype.isYieldDelegation = function() {
        return false;
    };
    /**
     * 
     * @param {type} str
     * @param {type} i
     * @returns {Number}
     */
    Statement.getIndentSpaces=function(str, i) {
        var len = str.length, n = Statement.TAB_SPACES;
        var tabSpaces = "", spaces = 0;
        for (var i = 0; i < n; i++) {
            tabSpaces += " ";
        }
        for (var i = 0; i < len; i++) {
            spaces += str[i] === '\t' ? spaces : ' ';
        }
        return spaces;
    };
    Statement.TAB_SPACES = 4;
    /**
     * 
     * @param {type} stmt
     * @param {Number} [spaces=0]  spaces need to align outer inline comment when it is not a single line comment
     * @returns {String}
     */
    Statement.close = function close(stmt, spaces) {
        function getType(stmt) {
            if ((stmt instanceof For) || (stmt instanceof ForIn) || (stmt instanceof ForOf)) {
                return "for";
            }
            if (stmt instanceof NamedFunction) {
                return "namedfunction";
            }
            if (stmt instanceof AnonymousFunction) {
                return "anonymousfunction";
            }
            if (stmt instanceof ArrowFunction) {
                return "arrowfunction";
            }
            if (stmt instanceof Func) {
                return "function";
            }
            if (stmt instanceof If) {
                return "if";
            }
            if (stmt instanceof While) {
                return "while";
            }
            if (stmt instanceof DoWhile) {
                return "do-while";
            }
            if (stmt instanceof Try) {
                return "try";
            }
            if (stmt instanceof Switch) {
                return "switch";
            }
            if (typeof stmt.getType === 'function') {
                return stmt.getType();
            }
            if (typeof stmt.getSymbol === 'function') {
                return stmt.getSymbol();
            }
            return "";
        }
        if (stmt instanceof Block || stmt instanceof If) {
            return "";
        }
        var typ = getType(stmt), _close;
        if (typ === "labeled") {
            return Statement.close(stmt.getStatement());
        } else if (["for", "forin", "forof","while","do-while","dowhile"].indexOf(typ) >= 0) {
            _close = !(stmt.getBody() instanceof Block);
        } else {
            _close = [ 
                "switch", "try", "function", "namedfunction", 
                "anonymousfunction", "arrowfunction", "class"
            ].indexOf(typ) < 0;
        }
        var t = _close ? ";" : "";
        if (typeof stmt.getOuterInlineComment === 'function') {
            var c = stmt.getOuterInlineComment();
            if (c) {
                if (c.isSingleLine()) {
                    t += " " + c.toString(true);
                } else {
                    t += c.getIndentedString((spaces||0)  + 1);
                }
            }
        }
        return t;
    };

   /**
    * 
    * @returns {Boolean}
    */
   Statement.prototype.isStatement = function() {
       return true;
   };

   /**
    * 
    * @returns {Boolean}
    */
   Statement.prototype.isBlock = function() {
       return false;
   };


    Statement.prototype.getInlineStatementString = function() {
        return "";
    };


    Statement.prototype.getStatementString = function(ind, indentFirstLine) {
        return "";
    };


    Statement.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        var s = "";

        var cmt;

        if (inline) {
            cmt = this.getComment();
            if (cmt) {
                s += cmt.toString(true);
            }
            s += ( s ? " ": "" ) + this.getInlineStatementString();
            var singleLine = false;
            cmt = this.getEndComment();
            if (cmt) {
                s += cmt.toString(true);
                if (cmt instanceof Comment) {
                    singleLine = cmt.isSingleLine();
                } else {
                    singleLine = cmt.get(cmt.size() - 1).isSingleLine();
                }                        
            }

            cmt = this.getInlineComment();
            if (cmt) {
                if (singleLine) {
                    s += "\n";
                }
                s += "    ; " + cmt.toString(true);
            }
        } else {
            cmt = this.getComment();
            var nl = "";
            if (cmt) {
                s += cmt.toString(ind, indentFirstLine);
                indentFirstLine = true;
            } 
            s += (s ? "\n" : "") + this.getStatementString(ind, indentFirstLine);
            var singleLine = false;
            cmt = this.getEndComment();
            if (cmt) {
                s += (s ? "\n" : "") + cmt.toString(ind, true);
                if (cmt instanceof Comment) {
                    singleLine = cmt.isSingleLine();
                } else {
                    singleLine = cmt.get(cmt.size() - 1).isSingleLine();
                }                        
            }

            cmt = this.getInlineComment();
            if (cmt) {
                if (singleLine) {
                    s += "\n";
                }
                s += "    ; " + cmt.toString(true);
            }
        }
        return s;
    };
    /**
     * 
     * @type Array
     */
    var JS_STATEMENT_KEYWORDS = [
        "await", "break", "continue", "delete","debugger", "do", 
        "export", "if", "import", "for", "return", 
        "switch", "try", "void", "while",
        "function"
    ];
   /**
    * <p>Returns the given statement object (o) when the given object is an 
    * instance of StatementElt and  o.isStatement() result is true; or the given
    * object is an epression and the value of expressionAsStatement argument is 
    * true or undefined.</p>
    * <p>Otherwise, when the given statement object is a plain object and it's 
    * convertible to an effective statement, this method converts it to a 
    * statement and returns the result of the conversion.</p>
    * @param {StatementElt|Object} o statement object
    * @param {Boolean} [expressionAsStatement=true]
    * @returns {StatementElt}
    */
    Statement.getInstance = function(o, expressionAsStatement) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var Statement = ns.Statement||Statement;
        var Expression = ns.Expression||Expression;
        var Func = ns.Func||Func;
        var Invocation = ns.Invocation||Invocation;
        var Instantiation = ns.Instantiation||Instantiation;
        expressionAsStatement = typeof expressionAsStatement === 'undefined' 
                                        ? true : toBool(expressionAsStatement);
        
        if ((o instanceof Statement)
                || (expressionAsStatement && (o instanceof Expression))
                || (o instanceof Func) 
                || (o instanceof Invocation) 
                || (o instanceof Instantiation))
            return o;
        var Block = ns.Block||Block;
        if (isArray(o)) {
            return new Block(o, expressionAsStatement);
        }
        var Operation = ns.Operation||Operation;
        if (o instanceof Operation && JS_STATEMENT_KEYWORDS.indexOf(o.getOperator()) >= 0 ) {
            return o;
        }
        var StatementElt = ns.StatementElt||StatementElt;
        if (o instanceof StatementElt) {
            if (!o.isStatement()) {
                throw new Error("Incorrect statement");
            }
            return o;
        }
        if (o.type === 'var' || o.type === 'let' || o.type === 'const') {
            var D = ns.Declaration||Declaration;
            return new D(o);
        } else if (o.type === 'function') {
            return Func.getFunction(o);
        } else if (o.type === 'named-function' || o.type === 'namedfunction') {
            var F = ns.NamedFunction||NamedFunction;
            return new F(o);
        } else if (o.type === 'anonymous-function' || o.type === 'anonymousfunction') {
            var F = ns.AnonymousFunction||AnonymousFunction;
            return new F(o);
        } else if (o.type === 'arrow-function' || o.type === 'arrowfunction') {
            var F = ns.ArrowFunction||ArrowFunction;
            return new F(o);
        } else if (o.type === 'if') {
            var I = ns.If||If;
            return new I(o);
        } else if (o.type === 'for') {
            var F = ns.For||For;
            return new F(o);
        } else if (o.type === 'forin') {
            var F = ns.ForIn||ForIn;
            return new F(o);
        } else if (o.type === 'forof') {
            var F = ns.ForOf||ForOf;
            return new F(o);
        } else if (o.type === 'while') {
            var W = ns.While||While;
            return new W(o);
        } else if (o.type === 'do-while' || o.type === 'do') {
            var D = ns.DoWhile||DoWhile;
            return new D(o);
        } else if (o.type === 'switch') {
            var S = ns.Switch||Switch;
            return new S(o);
        } else if (o.type === 'try') {
            var T = ns.Try||Try;
            return new T(o);
        } else if (o.type === 'return') {
            var R = ns.Return||Return;
            return new R(o);
        } else if (o.type === 'break') {
            var B = ns.Break||Break;
            return new B(o);
        } else if (o.type === 'continue') {
            var C = ns.Continue||Continue;
            return new C(o);
        } else if (o.type === 'throw') {
            var T = ns.Throw||Throw;
            return new T(o);
        } else if (o.type === 'labeled' || o.type === 'label') {
            var L = ns.LStatement||LStatement;
            return new L(o);
        } else if (o.type === 'block') {
            return new (ns.Block||Block)(o);
        } else if (o.type === 'class') {
            var C = ns.Class||Class;
            return new C(o);
        } else if (o.type === 'invocation') {
            return new (ns.Invocation||Invocation)(o);
        } else if (o.type === 'instantiation') {
            var S = ns.Switch||Switch;
            return new Instantiation(o);
        } else if (o.type === 'import') {
            return new (ns.Import||Import)(o);
        } else if (o.type === 'export') {
            return new (ns.Export||Export)(o);
        } else if (o.type === 'assign') {
            return new (ns.Assign||Assign)(o);
        } else if (o.type === 'with') {
            return new (ns.With||With)(o);
        } else if (o.type === 'operation' && o.left && o.right) {
            return new (ns.LROperation||LROperation)(o);
        } else if (o.type === 'unary-operation' || o.type === 'unaryoperation') {
            return new (ns.UnaryOperation||UnaryOperation)(o);
        } else if (o.operator) {
            //TODO: create Assign
        }
        var Block = ns.Block||Block;
        if (isPlainObject(o) && (!(o instanceof StatementElt)) && o.body instanceof Block) {
            if (o.comment) {
                o.body.setComment(o.comment);
            }
            if (o.inlineComment) {
                o.body.setInlineComment(o.inlineComment);
            }
            if (o.endComment) {
                o.body.setEndComment(o.endComment);
            }
            if (o.inlineEndComment) {
                o.body.setInlineEndComment(o.inlineEndComment);
            }
            return o.body;
        }
    };
    /**
     * 
     * @param {type} cs
     * @returns {ChainedStatements}
     * @class
     */
    function ChainedStatements(cs) {
        this._statements = [];
        if (arguments.length > 1) {
            this.add([].slice.call(arguments));
        } else if (isArray(cs)) {
            this.add(cs);
        } else if (isPlainObject(cs)) {
            if (isArray(cs.statements)) {
                this.add(cs.statements);
            }
        }
    }
    
    ChainedStatements.prototype = new Statement();
    
    
    /**
     * 
     * @type ChainedStatements
     * @meta
     * @static
     */
    ChainedStatements.__CLASS__ = ChainedStatements;
    /**
     * The name of the class 
     * @type String
     * @static
     */
    ChainedStatements.__CLASS_NAME__ = "ChainedStatements";
    
    /**
     * 
     * @type Statement
     * @meta
     * @static
     */
    ChainedStatements.__SUPER_CLASS__ = Statement;
    /**
     * The class
     * @type ChainedStatements
     * @meta
     */
    ChainedStatements.prototype.__CLASS__ = ChainedStatements;
    /**
     * The name of the class
     * @type String
     * @meta
     */
    ChainedStatements.prototype.__CLASS_NAME__ = "ChainedStatements";
    /**
     * 
     * @param {Statement|Expression|Array&lt;Statement|Expression&gt;} s
     * @returns {ChainedStatements}
     */
    ChainedStatements.prototype.add = function(s) {
        if (isArray(s)) {
            for (var i = 0, n = s.length; i < n; i++) {
                this._statements[this._statements.length] = Statement.getInstance(s);
            }
        } else {
            this._statements[this._statements.length] = Statement.getInstance(s);
        }
        return this;
    };
    /**
     * 
     * @returns {unsigned int}
     */
    ChainedStatements.prototype.size = function() {
        return this._statements.length;
    };
    
    /**
     * 
     * @param {unsigned int} i
     * @returns {Statement|Expression}
     */
    ChainedStatements.prototype.get = function(i) {
        return this._statements[i];
    };
    
    /**
     * Returns the rightmost expression when no argument. Otherwise, returns the
     * expression at the given position/index.
     * @param {Number} [i]  Position/index of the ecpression to get
     * @returns {Statement}
     */
    ChainedStatements.prototype.getStatement = function(i) {
        return arguments.length > 0 ? this._statements[i] : this._statements.length > 1 ? this._statements[this._statements.length - 1] : undefined;
    };
    
    /**
     * 
     * @returns {String}
     */
    ChainedStatements.prototype.getInlineStatementString = function() {
        var str = "", n  = this._statements.length;
        
        for (var i = 0; i < n; i++) {
            if (i > 0) {
                str += ", ";
            }
            str += this._statements[i].toString(true);
        }
        return str;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    ChainedStatements.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "", n  = this._statements.length, _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        _ind = "\n" + _ind;
        for (var i = 0; i < n; i++) {
            if (i > 0) {
                str += "," + _ind;
            }
            str += this._statements[i].toString(i, false);
        }
        return str;
    };
    /**
     * 
     * @returns {Array}
     */
    ChainedStatements.prototype.getStatements = function() {
        return this._statements.slice();
    };
    
    /**
     * 
     * @returns {Object}
     */
    ChainedStatements.prototype.iterator = function() {
        var it = {
            ___ : { _arr: this._statements, _index : -1, _len : _arr.length }, 
            hasNext: function() {
                var i = this.___;
                return i._len > 0 && i._index < i._len - 1;
            },
            next: function() {
                var i = this.___;
                return i._arr[++i._index]; 
            },
            reset: function() {
                this.___._index = -1;
                return this;
            }
        };
        return it;
    };/**
     * 
     * @returns {Array}
     */
    ChainedStatements.prototype.getStatements = function() {
        return this._statements.slice();
    };
    
    /**
     * 
     * @class Declaration
     */
    function Declaration() {
        this._variables = [];
        this._variablesMap = {};
        this._yields = 0;
        this._yieldDelegations = 0;
        if (arguments.length === 1) {
            var a = arguments[0];
            if (a === 'var' || a === 'let' || a === 'const') {
                this._type = a;
            } else if (typeof a === 'string') {
                this._type = "var";
                this.addVariable(new Variable(a));
            } else if (isPlainObject(a)) {
                this._type = a.symbol||a.Symbol||a.keyword||a.Keyword||a.type||a.Type||'var';
                if (a.variable) {
                    this.addVariable(new Variable(a.variable));
                } else if (isArray(a.variables) || isPlainObject(a.variables)) {
                    this.addVariables(a.variables);
                }
            } else if (isArray(a)) {
                this._type = "var";
                this.addVariables(a);
            }
        } else {
            this._type = "var";
            this.addVariables(arguments);
        }
    }

    Declaration.prototype = new Statement();
    
    Declaration.prototype.__CLASS__ = Declaration;
    
    Declaration.prototype.__CLASS_NAME__ = "Declaration";
    
    Declaration.__CLASS__ = Declaration;
    
    Declaration.__CLASS_NAME__ = "Declaration";

    /**
     * 
     * @returns {String}
     */
    Declaration.prototype.getType = function() {
        return this._type||"";
    };
    /**
     * 
     * @param {type} type
     * @returns {Declaration}
     */
    Declaration.prototype.setType = function(type) {
        this._type = type; 
        return this;
    };
    /**
     * 
     * @param {type} k
     * @returns {ODAssign|ADAssign|Variable}
     */
    Declaration.prototype.get = function(k) {
        if (k instanceof Number || k instanceof String ) {
            k = k.valueOf();
        }
        if (typeof k === 'number') {
            return this._variables[k];
        }
        if (typeof k === 'string') {
            return this._variablesMap[k];
        }
    };
    /**
     * 
     * @returns {unsigned int}
     */
    Declaration.prototype.getVariablesCount = function() {
        return this._variables.length;
    };

    /**
     * 
     * @param {type} v
     * @returns {Declaration}
     */
    Declaration.prototype.addVariable = function(v) {
        function addODAssign(v, self) {
            self._variables[self._variables.length] = v;
        }
        if (v instanceof ODAssign) {
            addODAssign(v, this);
        } else if (v instanceof ADAssign) {
            this._variables[this._variables.length] = v;
        } else {
            if (!(v instanceof Variable)) {
                if (typeof v === 'string') {
                    if (arguments.length > 1) {
                        v = new Variable(v, arguments[1]);
                    } else {
                        v = new Variable(v);
                    }
                } else if (isPlainObject(v)) {
                    v = new Variable(v);
                } else {
                    incorrectArg(); //throw "Incorrect argument";
                }                    
            }
            var key = Declaration.getKey(v.getName());
            this.checkVariable(v.getName(), key);
            this._variables[this._variables.length] = v;
            this._variablesMap[key] = v;
            if (v.isYield()) {
                this._yields++;
            }
            if (v.isYieldDelegation()) {
                this._yieldDelegations++;
            }
        }
        return this;
    };
    /**
     * 
     * @param {String} varName
     * @param {String} key
     * @returns {undefined}
     */
    Declaration.prototype.checkVariable = function(varName, key) {
        var typ = this.getType()||"";
        if (typ === 'const') {
            if (this._variablesMap[key]) {
                throw new Error("Variable " + varName + " already declared");
            }
        }
    };

    /**
     * 
     * @param {type} variables
     * @returns {Declaration}
     */
    Declaration.prototype.addVariables = function(variables) {
        if (isArray(variables)) {
            for (var i = 0, n = variables.length; i < n; i++) {
                this.addVariable(variables[i]);
            }
        } else if (isPlainObject(variables)) {
            for (var name in variables) {
                this.addVariable(new Variable(name, variables[name]));
            }
        }else {
            incorrectArg(); //throw "Incorrect argument";
        }
        return this;
    };

   /**
     * 
     * @param {type} variables
     * @returns {Declaration}
     */
    Declaration.prototype.setVariables = function(variables) {
        this._variables = [];
        this._variablesMap = {};
        return this.addVariables(variables);
    };
    /**
     * Return an array list of variables.
     * @returns {Array&lt;Variable&gt;}
     */
    Declaration.prototype.getVariables = function() {
        return [].slice.call(this._variables);
    };
    /**
     * 
     * @returns {Boolean}
     */
    Declaration.prototype.isYield = function() {
        return this._yields > 0;
    };
    /**
     * 
     * @param {String|unsigned int} i
     * @returns {Variable}
     */
    Declaration.prototype.getVariable = function(i) {
        return typeof i === 'string' ? this._variablesMap[Declaration.getKey(i)] : this._variables[i];
    };
    
    Declaration.getKey = function(name) {
        return "${" + name + "}";
    };
    /**
     * 
     * @returns {unsigned int}
     */
    Declaration.prototype.getVariablesCount = function() {
        return this._variables.length;
    };
    /**
     * 
     * @returns {Array&lt;Variable&gt;}.
     */
    Declaration.prototype.toArray = function() {
        return  [].slice.call(this._variables);
    };
    /**
     * 
     * @returns {Object}
     */
    Declaration.prototype.getExports = function() {
        var decl = this, count = decl.getVariablesCount(), v, exports = {};
        for (var i = 0; i < count; i++) {
            v = decl.get(i);
            if (v instanceof ODAssign) {
                var options = v.getLeft(),
                    obj = v.getRight(), 
                    names = options._names, 
                    props = options._properties, name, alias, v;
                for (var i=0, n = names.length; i < n; i++) {
                    name = names[i];
                    alias = v.getAlias(name);
                    exports[alias||name] = new EVariable(decl.getType()||"const", name, new KeyValue(name, obj, props[name]));
                }
            } else if (v instanceof ADAssign) {
                throw new Error("Not yet supported/implemented");
            } else {
                exports[v.getName()] = new EVariable(decl.getType()||"const", v.getName(), v.getDefaultValue());
            }
        }
        return exports;
    };
    /**
     * 
     */
    Declaration.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }

        var s = "", type = this.getType()||"", vars = this._variables, len = vars ? vars.length: 0;                

        if (inline) {   
            s += (type ? type + " ": "");
            for (var k = 0; k < len; k++) {
                if (k > 0) {
                    s += ", ";
                }
                s += vars[k].toString(true);
            }
        } else {
            var _ind = "";
            for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }
            if (indentFirstLine) {
                s += _ind;
            }
            s += (type ? type + " ": "");
            for (var k = 0; k < len; k++) {
                if (k > 0) {
                    s += ",\n";                    
                    s += vars[k].toString(ind + 1, true);
                } else {
                    s += vars[k].toString(ind + 1, false);
                }
            }
        }

        return s;
    };

    Object.defineProperties(Declaration.prototype, {
        "type" : { get: Declaration.prototype.getType, set: Declaration.prototype.setType },
        "variables" : { get: Declaration.prototype.toArray, set: Declaration.prototype.setVariables }
    });
    
    /**
     * 
     * @returns {KeyValue}
     * @class KeyValue
     */
    function KeyValue() {
        var key, a = arguments[0];
        if (isPlainObject(a)) {
            key = a.key||a.Key||a.variableName||a.VariableName||a.variable||a.Variable||a.name||a.Name;
            if (key instanceof String) {
                key = key.valueOf();
            }
            if (typeof key !== 'string') {
                throw new Error("Incorrect arguments");
            }
            this._key = key;
            this._object = a.object||a.Object||a.expression||a.Expression;
            var v = a.defaultValue||a.DefaultValue||a.default||a.Default;
            if (v instanceof Expression) {
                this._defaultValue = v;
            }
        } else {
            key = a;
            if (a instanceof String) {
                key = a.valueOf();
            }
            if (typeof key !== 'string') {
                throw new Error("Incorrect arguments");
            }
            this._key = key;
            this._object = arguments[1];
            if (arguments.length > 2) {
                this._defaultValue = arguments[2];
            }
        }
    }
    
    
    /**
     * 
     * @param {Object} o
     * @returns {EVariable}
     */
    function EVariable(o) {
        if (isPlainObject(o)) {
            this.setName(o.name||o.Name);
            this.setType(o.type||o.Type||"const");
            this.setValue(o.value||o.Value);
        } else if (arguments.length >= 3) {
            this.setType(arguments[0]);
            this.setName(arguments[1]);
            this.setValue(arguments[2]);
        }
    }
    
    EVariable.__CLASS__ = EVariable;
    
    EVariable.__CLASS_NAME__ = "EVariable";
    
    EVariable.prototype.__CLASS__ = EVariable;
    
    EVariable.prototype.__CLASS_NAME__ = "EVariable";
    
    /**
     * 
     * @returns {String}
     */
    EVariable.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {String} name
     * @returns {EVariable}
     */
    EVariable.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    EVariable.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @param {String} type
     * @returns {EVariable}
     */
    EVariable.prototype.setType = function(type) {
        this._type = type;
        return this;
    };
    
    /**
     * 
     * @returns {KeyValue|Expression}
     */
    EVariable.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {Expression|KeyValue} v
     * @returns {undefined}
     */
    EVariable.prototype.setValue = function(v) {
        if (v instanceof Expression || v instanceof KeyValue) {
            this._value = v;
        } else if (isPlainObject(v)) {
            var key = v.key||v.Key||v.name||v.Name, 
                obj = v.object||v.Object||v.expression||v.Expression;
            if (key instanceof String) {
                key = key.valueOf();
            }
            
            if (typeof key === 'string' && obj instanceof Expression) {
                this._value = new KeyValue(key, obj);
            } else {
                throw new Error("Incorrect argument");
            }
        }
        return this;
    };

    /**
     * 
     */
    function NoBodyStatement() {
        this._body = null;
    }




    NoBodyStatement.prototype = new Statement();

    NoBodyStatement.__CLASS__ = NoBodyStatement;

    NoBodyStatement.__CLASS_NAME__ = "NoBodyStatement";

    NoBodyStatement.prototype.__CLASS__ = NoBodyStatement;

    NoBodyStatement.prototype.__CLASS_NAME__ = "NoBodyStatement";

    /**
    * 
    * @returns {Boolean}
    */
   NoBodyStatement.prototype.isStatement = function() {
       return true;
   };
   /**
    * 
    * @returns {Block|Statement|Expression}
    */
   NoBodyStatement.prototype.getBody = function() {
       return null;
   };
   /**
    * 
    * @param {Block|Statement|Expression} b
    * @returns {NoBodyStatement}
    */
   NoBodyStatement.prototype.setBody = function(b) {
       return this;
   };






   /**
     * 
     */
    function EmptyStatement() {
        this._body = null;
    }




    EmptyStatement.prototype = new NoBodyStatement();

    EmptyStatement.__CLASS__ = EmptyStatement;

    EmptyStatement.__CLASS_NAME__ = "EmptyStatement";

    EmptyStatement.prototype.__CLASS__ = EmptyStatement;

    EmptyStatement.prototype.__CLASS_NAME__ = "EmptyStatement";
    /**
     * 
     * @returns {String}
     */
    EmptyStatement.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        if (indentFirstLine) {
            var s = "";
            for (var i = 0; i < ind; i++) {
                s += "    ";
            }
            return s;
        }
        return "";
    };

    /**
     * 
     * @type {EmptyStatement}
     */
    EmptyStatement.EMPTY = new EmptyStatement();

    /**
     * 
     * @param {QString|String|Object} q
     * @param {IComment|String|Object} [cmt=null] Comment(s) of the statement
     * @param {IComment|String|Object} [iCmt=null] Inline omment(s) of the 
     *     statement: immediately after the tament is closed and in the 
     *     same line 
     * @class QuotedHintStatement
     */
    function QuotedHintStatement(q, cmt, iCmt) {
        if (q instanceof QString || (typeof q === 'string' && q)) {
            this.setQuotedString(q);
        } else if (isPlainObject(q)) {
            var qs = q.quotedString||q.qString||q.qstring;
            if (qs) {
                this.setQuotedString(qs);
            }
            if (q.comment||q.comments) {
                this.setComment(q.comment||q.comments);
            }
            if (q.inlineComment) {
                this.setInlineComment(q.inlineComment);
            }
        } else if (arguments.length > 1) {
            this.setQuotedString(q);
            if (cmt) {
                this.setComment(cmt);
            }
            if (arguments.length > 2 && iCmt) {
                this.setInlineComment(iCmt);
            }
        }
    }


    QuotedHintStatement.prototype = new NoBodyStatement();

    QuotedHintStatement.__CLASS__ = QuotedHintStatement;

    QuotedHintStatement.__CLASS_NAME__ = "QuotedHintStatement";

    QuotedHintStatement.prototype.__CLASS__ = QuotedHintStatement;

    QuotedHintStatement.prototype.__CLASS_NAME__ = "QuotedHintStatement";
    /**
     * 
     * @returns {QString}
     */
    QuotedHintStatement.prototype.getQuotedString = function () {
        return this._qstring;
    };
    /**
     * 
     * @param {QString|String|Object} qs The quoted string or object to intantiate a quoted string
     * @returns {QuotedHintStatement}
     */
    QuotedHintStatement.prototype.setQuotedString = function (qs) {
        if (arguments.length === 0) {
            throw new Error("Argument expected");
        }
        if (typeof qs === 'undefined') {
            throw new Error("The value of the argument is undefined");
        }
        if (qs === null) {
            throw new Error("Null Argument");
        }
        this._qstring = qs instanceof QString ? qs 
            : new QString(typeof qs === 'string' ? 
                ([ '\'', '"' ].indexOf(qs[0]) > 0 && qs[qs.length - 1] ===  qs[0] ? qs : "'" + qs + "'" ) : qs); 
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    QuotedHintStatement.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {IComment|String} c
     * @returns {QuotedHintStatement}
     */
    QuotedHintStatement.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @returns {unresolved}
     */
    QuotedHintStatement.prototype.getInlineStatementString = function() {
        return this._qstring.toString();
    };

    /**
     * 
     * @param {unsigned int} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    QuotedHintStatement.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                s += "    ";
            }
        }
        s += this._qstring.toString();                

        return s;
    };

    /**
     * <h3>Labeled statement</h3>
     * 
     * @returns {undefined}
     * @class
     */
    function LStatement() {
        if (arguments.length === 1) {
            var o = arguments[0];
            if (isPlainObject(o)) {
                this.setLabel(o.label||o.Label);
                this.setStatement(o.statement||o.Statement||o.statements||o.Statements);
                if (o.comment) {
                    this.setComment(o.comment);
                }
            }
        } else if (arguments.length > 1) {
            this.setLabel(arguments[0]);
            this.setStatement(arguments[1]);
            if (arguments.length > 2 && arguments[2]) {
                this.setComment(arguments[2]);
            }
        }
    }

    LStatement.prototype = new Statement();

    LStatement.__CLASS__ = LStatement;

    LStatement.__CLASS_NAME__ = "LStatement";

    LStatement.prototype.__CLASS__ = LStatement;

    LStatement.prototype.__CLASS_NAME__ = "LStatement";
    /**
     * 
     * @returns {String}
     */
    LStatement.prototype.getLabel = function() {
        return this._label||"";
    };
    /**
     * 
     * @param {String} label
     * @returns {LStatement}
     */
    LStatement.prototype.setLabel = function(label) {
        if (typeof label !== 'string') {
            incorrectArg(); //throw "Incorrect argument";
        }
        if (!label) {
            throw new Error("Empty label");
        }
        this._label = label;
        return this;
    };

    /**
     * 
     * @returns {Statement|StatementElt}
     */
    LStatement.prototype.geStatement = function() {
        return this._statement;
    };
    /**
     * 
     * @param {Statement|StatementElt|Object} s  The statement
     * @returns {LStatement}
     */
    LStatement.prototype.setStatement = function(s) {
        this._statement = Statement.getInstance(s);
        return this;
    };

    Object.defineProperties(LStatement.prototype, {
        label: { get: LStatement.prototype.getLabel, set: LStatement.prototype.setLabel },
        statement: { get: LStatement.prototype.getStatement, set: LStatement.prototype.setStatement }
    });


    function ClassBodyObj(b) {
    }
    
    ClassBodyObj.prototype = new StatementElt();

    ClassBodyObj.__CLASS__ = ClassBodyObj;

    ClassBodyObj.__CLASS_NAME__ = "ClassBodyObj";

    ClassBodyObj.prototype.__CLASS__ = ClassBodyObj;

    ClassBodyObj.prototype.__CLASS_NAME__ = "ClassBodyObj";

    /**
     * 
     * @param {Object} o
     * @param {String} [type=""]
     * @param {String} [name=null]
     * @returns {Constructor|Field|Method|Getter|Setter|ClassBody}
     */
    ClassBodyObj.getInstance = function(o, type, name) {
        if (o instanceof ClassBodyObj) {
            return o;
        }
        switch((type||o.type||"").toLowerCase()) {
            case 'method':
                return new Method(o);
            case 'get':
            case 'getter':
            case 'accessor':
                return name ? new Getter(name, o) : new Getter(o);
            case 'set':
            case 'setter':
            case 'mutator':
                return name ? new Setter(name, o) : new Setter(o);
            case 'field':
                return new Field(o);
            case 'property':
                return new Property(o);
            case 'constructor':
            case 'construct':
                return new Constructor(o);
            case 'body':
            case 'classbody':
                return new ClassBody(o);
        }
        throw new Error("Incorrect argument");
    };
    
    function ClassBodyElt() {
        
    }
    
    ClassBodyElt.prototype = new ClassBodyObj();
    
    ClassBodyElt.__CLASS__ = ClassBodyElt;

    ClassBodyElt.__CLASS_NAME__ = "ClassBodyElt";

    ClassBodyElt.prototype.__CLASS__ = ClassBodyElt;

    ClassBodyElt.prototype.__CLASS_NAME__ = "ClassBodyElt";
    
    /**
     * 
     * @param {Object} o
     * @param {String} [type=""]
     * @param {String} [name=null]
     * @returns {Constructor|Field|Method|Getter|Setter|ClassBody}
     */
    ClassBodyElt.getInstance = ClassBodyObj.getInstance;
    
    function ComputedNameToken(string) {
        if (string instanceof String) {
            string = string.valueOf();
        }
        if (arguments.length > 0 && (typeof string !== 'string')) {
            throw new Error("Expected string argument");
        }
        if (string === "") {
            throw new Error("Empty string argument");
        }
        this._string = string||"";
    }
    
    ComputedNameToken.prototype.getString = function() {
        return this._string||"";
    };
    
    ComputedNameToken.prototype.setString = function(string) {
        if (string instanceof String) {
            string = string.valueOf();
        }
        if (arguments.length === 0 || (typeof string !== 'string')) {
            throw new Error("Expected string argument");
        }
        if (string === "") {
            throw new Error("Empty string argument");
        }
        this._string = string;
        return this;
    };
    /**
     * 
     * @param {type} cn
     * @returns {ComputedName}
     */
    function ComputedName(cn) {
        if (cn) {
            if (cn instanceof Expression) {
                this._elements = [cn];
            } else if(isArray(cn)) {
                this.setElements(cn);
            } else if(isArray(cn.elements)) {            
                this.setElements(cn.elements);
            } else if (cn.expression) {
                this._elements = [Expression.getInstance(cn)];
            } else {
                this._elements = [];;
            }
        }
    }
    
    ComputedName.prototype = new StatementElt();
    
    ComputedName.__CLASS__ = ComputedName;
    
    ComputedName.__CLASS_NAME__ = ComputedName;
    
    ComputedName.prototype.__CLASS__ = ComputedName;
    
    ComputedName.prototype.__CLASS_NAME__ = ComputedName;
    /**
     * 
     * @param {type} elts
     * @returns {ComputedName}
     */
    ComputedName.prototype.setElements = function(elts) {
        this.___elements_ = [];
        var n = elts.length, e;
        for (var i = 0; i <n; i++) {
            e = elts[i];
            if (e instanceof Expression || e instanceof ComputedNameToken) {
                this.___elements_[i] = e;
            } else if (isPlainObject(e)) {
                if (e.type === 'expression') {
                    this.___elements_[i] = Expression.getInstance(e);
                } else if (typeof e === 'string') {
                    this.___elements_[i] = new ComputedNameToken(e);
                }  else if (typeof e.string === 'string' || typeof e.token === 'string') {
                    this.___elements_[i] = new ComputedNameToken(e.string||e.token);
                } else {
                    throw new Error("Incorrect argument");
                }
            } else {
                throw new Error("Incorrect argument");
            }
        }
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ComputedName.prototype.getInlineStatementString = function() {       
        var s = "";
        var elts = this.___elements_,n = elts.length, e;
        for (var i = 0; i <n; i++) {
            e = elts[i];
            if (e instanceof ComputedNameToken) {
                s += e.getString();
            } else {
                s += "[" + e.toString(true) + "]";
            }
        }
        return s; 
    };
    /**
     * 
     * @returns {String}
     */
    ComputedName.prototype.getStatementString = function() {       
        var s = "";
        var elts = this.___elements_,n = elts.length, e;
        for (var i = 0; i <n; i++) {
            e = elts[i];
            if (e instanceof ComputedNameToken) {
                s += e.getString();
            } else {
                s += "[" + e.toString(true) + "]";
            }
        }
        return s; 
    };
    
    /**
     * 
     * @param {type} expression
     * @returns {EComputedName}
     * @class EComputedName
     */
    function EComputedName(expression) {
        if (isPlainObject(expression)){
            this.___elements_ = [];
            this.___elements_[0] = this.___expression_ = Expression.getInstance(expression);
        }
    }
    
    /**
     * 
     * @type ComputedName
     */
    EComputedName.prototype = new ComputedName();
    /**
     * 
     * @returns {Expression}
     */
    EComputedName.prototype.getExpression = function() {
        return this.___expression_;
    };
    /**
     * 
     * @param {Object} e
     * @returns {EComputedName}
     */
    EComputedName.prototype.setExpression = function(e) {
        this.___elements_ = [];
        this.___elements_[0] = this.___expression_ = Expression.getInstance(e);;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    EComputedName.prototype.toString = function() {
        return this.___expression_ ? "[]" : "[" + this.___expression_.toString(true) + "]";
    };
    
    
    function MethodBase(m) {        
    }
    
    MethodBase.prototype = new ClassBodyElt();
    
    /**
     * 
     * @returns {String|Expression}
     */
    MethodBase.prototype.getName = function() {
        return this.___name_;
    };
    
    /**
     * 
     * @param {type} types
     * @returns {NamedFunction}
     */
    MethodBase.prototype.setTypes = function(types) {
        this._types = types instanceof NParamTypes ? types : NParamTypes(types);
        return this;
    };
    /**
     * 
     * @returns {NParamTypes}
     */
    MethodBase.prototype.getTypes = function() {
        return this._types;
    };
    
    
    /**
     * 
     * @returns {Array}
     */
    MethodBase.prototype.getParams = function() {
        return this._params;
    };
    /**
     * 
     * @param {type} param
     * @returns {Method}
     */
    MethodBase.prototype.addParam = function(param) {
        this._params.add(param instanceof Param ? param : new Param(param));
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Method}
     * 
     */
    MethodBase.prototype.addParams = function(params) {
        if (arguments.length > 1) {
            var args = [].slice.call(arguments);
            for (var i = 0, n = args.length; i < n; i++) {
                this.addParam(args[i]);
            }
        } else if (isArray(params)) {
            for (var i = 0, n = params.length; i < n; i++) {
                this.addParam(params[i]);
            }
        } else if (isPlainObject(params)) {
            for (var n in params) {
                this.addParam(new Param(params[n]));
            }
        }
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Method}
     * 
     */
    MethodBase.prototype.setParams = function(params) {
        this._params = params instanceof Params ? params : new Params(params);
        return this;
    };
    /**
     * 
     * @returns {Array}
     */
    MethodBase.prototype.getParameters = MethodBase.prototype.getParams;

    /**
     * 
     * @returns {Array}
     */
    MethodBase.prototype.setParameters = MethodBase.prototype.setParams;
    
    /**
     * 
     * @returns {Block}
     */
    MethodBase.prototype.getBody = function() {
        return this._body;
    };
    /**
     * 
     * @param {type} b
     * @returns {Accessor}
     * 
     */
    MethodBase.prototype.setBody = function(b) {
        this._body = b instanceof Block ? b : new Block(b);
        return this;
    };
    /**
     * 
     * @param {SType|String} returnType
     * @returns {Func}
     */
    MethodBase.prototype.setReturnType = function(returnType) {
        this._returnType = returnType;
        return this;
    };
    /**
     * 
     * @returns {SType}
     */
    MethodBase.prototype.getReturnType = function() {
        return this._returnType;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {ClassBodyObj.toString.s|String}
     */
    MethodBase.prototype.getStatementString = function(ind, indentFirstLine) {
        var name = this.getName()||"";
        if (name instanceof ComputedName || name instanceof Expression) {
            name = name.toString(ind, false);
        }
        
        var s = "";
        s += (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "");
        s += (this.isStatic() ? 'static ' : '') + (this.isPrivate() ? '#' : '') + name;
        s += this._params.toString(ind, false);                
        if (this._body) {
            s += this._body.toString(ind, false);
        } else {
            s += "{}";
        }
        return s;
    };
    MethodBase.prototype.getInlineStatementString = function() {
        var name = this.getName()||"";
        if (name instanceof ComputedName || name instanceof Expression) {
            name = name.toString(true);
        }
        
        var s = "";
        
        s += this.getModifiersString() + name;
        s += this._params.toString(true);                
        if (this._body) {
            s += this._body.toString(true);
        } else {
            s += "{}";
        }
        return s;
    };
    
    MethodBase.prototype.getModifiersString = function() {
        return "";
    };
    
    function AMethod() {
        this._async = false;
    }
    
    AMethod.prototype = new MethodBase();
    
    AMethod.prototype._async = false;
    
    /**
     * 
     * @returns {Boolean}
     */
    AMethod.prototype.isPrivate = function() {
        return this._private;
    };
    /**
     * 
     * @param {Boolean} private
     * @returns {Method}
     */
    AMethod.prototype.setPrivate = function(private) {
        this._private = private;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    AMethod.prototype.isStatic = function() {
        return this._static;
    };
    /**
     * 
     * @param {Boolean} static
     * @returns {Method}
     */
    AMethod.prototype.setStatic = function(static) {
        this._static = static;
        return this;
    };
    
    AMethod.prototype.getModifiersString = function() {
        return (this.isStatic() ? 'static ' : '') + (this.isPrivate() ? '#' : '');
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    AMethod.prototype.isAsync = function() {
        return this._async;
    };
    /**
     * 
     * @param {Boolean} _async
     * @returns {EMethod.prototype}
     */
    AMethod.prototype.setAsync = function(_async) {
        this._async = toBool(_async);
        return this;
    };
    /**
     * 
     * @param {Object|String} m
     * @class EMethod
     */
    function EMethod(m) {
        this._async = false;
        if (isPlainObject(m)) {
            var name = m.name||m.Name;
            if (name[0] === '#') {
                throw new Error("Incorrect method name");
            } else {
                this.setName(name);
            }
            
            if (hasOwnProp(m, 'async')) {
                this._async = toBool(m.async);
            } else if (hasOwnProp(m, 'Async')) {
                this._async = toBool(m.Async);
            } else if (hasOwnProp(m, '_async')) {
                this._async = toBool(m._async);
            }

            this._params = new Params(m.parameters||m.params||m.parms||[]);
            this.setBody(m.body||m.statements||m.statement);
        } else if (typeof m === 'string') {
            if (m[0] === '#') {
                throw new Error("Incorrect method name");
            } else {
                this.setName(m);
            }
            if (arguments.length > 1) {
                var p = arguments[1];
                this._params = p instanceof Params? p: new Params(p||[]);
            }
            if (arguments.length > 2) {
                this.setBody(arguments[2]);
            }
        }
    }


    EMethod.prototype = new AEntry();
    /**
     * 
     * @type {EMethod}
     */
    EMethod.__CLASS__ = EMethod;
    /**
     * 
     * @type String
     */
    EMethod.__CLASS_NAME__ = "EMethod";
    /**
     * 
     * @type {AEntry}
     */
    EMethod.__SUPER_CLASS__ = AEntry;

    EMethod.prototype.__CLASS__ = EMethod;
    /**
     * 
     * @type String
     */
    EMethod.prototype.__CLASS_NAME__ = "EMethod";
    
    /**
     * 
     * @type {AEntry}
     */
    EMethod.prototype.__SUPER_CLASS__ = AEntry;
    /**
     * 
     */
    copyClass(AMethod, EMethod);
    /**
     * 
     * @returns {Boolean}
     */
    EMethod.prototype.isAsync = function() {
        return this._async;
    };
    /**
     * 
     * @param {Boolean} _async
     * @returns {EMethod.prototype}
     */
    EMethod.prototype.setAsync = function(_async) {
        this._async = toBool(_async);
        return this;
    }
    
    
    /**
     * 
     */
    Object.defineProperties(EMethod.prototype, {
        key : { get : EMethod.prototype.getKey, set: function() { throw new Error("Read only method");} },
        value : { get : EMethod.prototype.getValue, set: function() { throw new Error("Read only method");} },
        comment : { get : EMethod.prototype.getComment, set: EMethod.prototype.setComment },
        inlineComment : { get : EMethod.prototype.getInlineComment, set: EMethod.prototype.setInlineComment },
        endComment : { get : EMethod.prototype.getEndComment, set: EMethod.prototype.setEndComment },
        inlineEndComment : { get : EMethod.prototype.getInlineEndComment, set: EMethod.prototype.setInlineEndComment },
        outerComment : { get : EMethod.prototype.getOuterComment, set: EMethod.prototype.setOuterComment },
        outerInlineComment : { get : EMethod.prototype.getOuterInlineComment, set: EMethod.prototype.setOuterInlineComment }
    });
    /**
     * 
     * @param {String|Expression} name
     * @returns {EMethod}
     */
    EMethod.prototype.setName = function(name) {
        if (arguments.length === 0) {
            throw new Error("At least one argument is expected");
        }
        if (typeof name !== 'string' && !(name instanceof Expression)) {
            throw new Error("Incorrect argument: expected string or an instance of  Expression");
        }
        if (!name) {
            throw new Error("Empty method name");
        }
        this.___name_ = name;
        return this;
    };
    
    /**
     * 
     * @returns {EAccessor}
     */
    EMethod.prototype.getValue = function() {
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    EMethod.prototype.getKey = function() {
        return this.getName();
    };
    
    EMethod.prototype.isExpression = function() {
        return true;
    };
    
    EMethod.isExpression = function() {
        return true;
    };
    
    /**
     * 
     * @param {Object|String} m
     * @class Method
     */
    function Method(m) {
        this._async = false;
        if (isPlainObject(m)) {
            this._static = toBool(m.static||m.Static||m.isStatic);
            var name = m.name||m.Name;
            if (name[0] === '#') {
                this.setPrivate(true);
                this.setName(name.substring(1));
            } else {
                this.setName(name);                        
                this.setPrivate(m.private||m.Private||m.isPrivate);
            }
            if (hasOwnProp(m, 'async')) {
                this.setAsync(toBool(m['async']));
            } else if (hasOwnProp(m, 'Async')) {
                this.setAsync(toBool(m['Async']));
            } else if (hasOwnProp(m, '_async')) {
                this.setAsync(toBool(m['_async']));
            } else if (hasOwnProp(m, 'asynchornous')) {
                this.setAsync(toBool(m.asynchornous));
            }

            this._params = new Params(m.parameters||m.params||m.parms||[]);
            this.setBody(m.body||m.statements||m.statement);
        } else if (typeof m === 'string') {
            if (m[0] === '#') {
                this.setPrivate(true);
                this.setName(m.substring(1));
            } else {
                this.setName(m);
            }
            if (arguments.length > 1) {
                var p = arguments[1];
                this._params = p instanceof Params? p: new Params(p||[]);
            }
            if (arguments.length > 2) {
                this.setBody(arguments[2]);
            }
        }
    }


    Method.prototype = new AMethod();
    /**
     * 
     * @type {Method}
     */
    Method.__CLASS__ = Method;
    /**
     * 
     * @type String
     */
    Method.__CLASS_NAME__ = "Method";

    Method.prototype.__CLASS__ = Method;
    /**
     * 
     * @type String
     */
    Method.prototype.__CLASS_NAME__ = "Method";
    
    
    /**
     * 
     * @param {String|Expression} name
     * @returns {Method}
     */
    Method.prototype.setName = function(name) {
        if (arguments.length === 0) {
            throw new Error("At least one argument is expected");
        }
        if (typeof name !== 'string' && !(name instanceof Expression)) {
            throw new Error("Incorrect argument: expected string or an instance of  Expression");
        }
        if (!name) {
            throw new Error("Empty method name");
        }
        this.___name_ = name;
        return this;
    };
    /**
     * 
     * @param {type} m
     * @returns {CNMethod}
     */
    function CNMethod(m) {
        if (arguments.length === 1) {
            if (m instanceof Expression) {
                this.setName(new EComputedName(m));
            } else if (m instanceof ComputedName) {
                this.setName(m);
            } else if (isPlainObject(m)) {
                this._static = toBool(m.static||m.Static||m.isStatic);
                if (m.name||m.Name) this.setName(m.name||m.Name);  
                var v = m.private||m.Private||m.isPrivate;
                this.setPrivate(typeof v === 'undefined' || v ===null ? false : v);
                if (hasOwnProp(m, 'async')) {
                    this.setAsync(toBool(m['async']));
                } else if (hasOwnProp(m, 'Async')) {
                    this.setAsync(toBool(m['Async']));
                } else if (hasOwnProp(m, '_async')) {
                    this.setAsync(toBool(m['_async']));
                } else if (hasOwnProp(m, 'asynchornous')) {
                    this.setAsync(toBool(m.asynchornous));
                }
                this._params = new Params(m.parameters||m.params||m.parms||[]);
                this.setBody(m.body||m.statements||m.statement);
            }
        } else if (arguments.length > 2) {
            this.setName(arguments[0]);             
            this.setParams(arguments[1]||[]);
            this.setBody(arguments[2]);            
            this._static = arguments.length > 3 ? toBool(arguments[3]) : false;
            this.setPrivate(arguments.length > 4 ? arguments[4] : false);
        }
    }
    
    CNMethod.prototype = new AMethod();
    /**
     * 
     * @type {CNMethod}
     */
    CNMethod.__CLASS__ = CNMethod;
    /**
     * 
     * @type String
     */
    CNMethod.__CLASS_NAME__ = "CNMethod";

    CNMethod.prototype.__CLASS__ = CNMethod;
    /**
     * 
     * @type String
     */
    CNMethod.prototype.__CLASS_NAME__ = "CNMethod";
    
    
    /**
     * 
     * @param {String|Expression} name
     * @returns {Method}
     */
    CNMethod.prototype.setName = function(name) {
        if (arguments.length === 0) {
            throw new Error("At least one argument is expected");
        }
        if (!(name instanceof Expression || name instanceof ComputedName)) {
            if (isPlainObject(name)) {
                if (name.type === 'expression' || name.type === 'invocation' || name.operator) {
                    name = Expression.getInstance(name);
                } else if (name.type === 'call') {
                    name = new Invocation(name);
                } else if (isArray(name.elements)) {
                    name = new ComputedName(name);
                } else {
                    throw new Error("Incorrect argument: expected string or an instance of  Expression");
                }
            }else if (isArray(name)) {
                name = new ComputedName(name);
            } else {
                throw new Error("Incorrect argument: expected string or an instance of  Expression");
            }
        }
        this.___name_ = name instanceof Expression ? new EComputedName(name) : name;
        return this;
    };


    /**
     * 
     * @param {type} c
     * @returns {Constructor}
     * @class
     */
    function Constructor(c) {
        if (arguments.length > 1) {
            this.set(arguments[0], arguments[1]);
        } else if (isPlainObject(c)) {
            this.setParams(c.parameters||c.params||c.parms||[]);
            this.setBody(c.body||c.statements||c.statement);
        } else {
            this._params = new Params();
        }
    }

    Constructor.prototype = new ClassBodyElt();

    Constructor.__CLASS__ = Constructor;

    Constructor.__CLASS_NAME__ = "Constructor";

    Constructor.prototype.__CLASS__ = Constructor;

    Constructor.prototype.__CLASS_NAME__ = "Constructor";
    /**
     * 
     * @returns {String}
     */
    Constructor.prototype.getName = function() {
        return "constructor";
    };
    
    /**
     * 
     * @param {type} types
     * @returns {NamedFunction}
     */
    Constructor.prototype.setTypes = function(types) {
        this._types = types instanceof NParamTypes ? types : NParamTypes(types);
        return this;
    };
    /**
     * 
     * @returns {NParamTypes}
     */
    Constructor.prototype.getTypes = function() {
        return this._types;
    };
    /**
     * 
     * @returns {Array}
     */
    Constructor.prototype.getParams = function() {
        return this._params;
    };
    /**
     * 
     * @param {type} param
     * @returns {Constructor}
     */
    Constructor.prototype.addParam = function(param) {
        this._params.add(param instanceof Param ? param : new Param(param));
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Constructor}
     * 
     */
    Constructor.prototype.addParams = function(params) {
        if (isArray(params)) {
            for (var i = 0, n = params.length; i < n; i++) {
                this.addParam(params[i]);
            }
        } else if (isPlainObject(params)) {
            for (var n in params) {
                this.addParam(new Param(params[n]));
            }
        }
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Constructor}
     * 
     */
    Constructor.prototype.setParams = function(params) {
        if (params instanceof Params) {
            this._params = params;
        } else {
            this._params = new Params();
            this.addParams(params);
        }
        return this;
    };
    /**
     * 
     * @returns {Array}
     */
    Constructor.prototype.getParameters = Constructor.prototype.getParams;

    /**
     * 
     * @returns {Array}
     */
    Constructor.prototype.setParameters = Constructor.prototype.setParams;
    /**
     * 
     * @returns {Block}
     */
    Constructor.prototype.getBody = function() {
        return this._body;
    };
    /**
     * 
     * @param {type} b
     * @returns {Constructor}
     * 
     */
    Constructor.prototype.setBody = function(b) {
        this._body = b instanceof Block ? b : new Block(b);
        return this;
    };
    /**
     * 
     * @param {type} params
     * @param {type} body
     * @returns {Constructor.prototype}
     */
    Constructor.prototype.set = function(params, body) {
        this.setParams(params);
        this.setBody(body);
        return this;
    };
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    Constructor.prototype.getStatementString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var str = (toBool(indentFirstLine) ? _ind : "") + "constructor";
        var params = this.getParams();
        str += params.toString(ind, false);
        indentFirstLine = false;
        var c = params.getOuterInlineComment();
        if (c) {
            if (c.isSingleLine()) {
                str += "\n";
                indentFirstLine = true;
            } else {
                str += " ";
            }
        }
        var b = this.getBody();
        if (b) {
            str += b.toString(ind, indentFirstLine);
        } else {
            str += "{}";
        }

        return str;
    };
    
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    Constructor.prototype.getInlineStatementString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var str = "constructor";
        var params = this.getParams();
        str += params ? params.toString(true): "";
        var b = this.getBody();
        if (b) {
            str += b.toString(true);
        } else {
            str += "{}";
        }
        return str;
    };

    /**
     * 
     * @param {Object|String} [a=null]   <p>The metadata/definition when the argument 
     *      is aplain object or the name of the property of the accessor when 
     *      the argument is a string</p>
     * @param {Object} [o=null]  The other metadata informations
     * @returns {Accessor}
     * @class
     * @abstract
     */
    function Accessor(a, o) {
        if (isPlainObject(a)) {
            this.setProperty(a.property||a.field||a.propertyName||a.fieldName||a.name||a.Name);
            this.setBody(a.body||a.block||a.blockStatement||a.statements||a.statement);
        } else if (a && typeof a === 'string') {
            this.setProperty(a);
            this.setBody(o.body||o.block||o.blockStatement||o.statements||o.statement);
        }
    }


    Accessor.prototype = new ClassBodyElt();

    Accessor.__CLASS__ = Accessor;

    Accessor.__CLASS_NAME__ = "Accessor";

    Accessor.prototype.__CLASS__ = Accessor;

    Accessor.prototype.__CLASS_NAME__ = "Accessor";


    /**
     * 
     * @returns {String}
     */
    Accessor.prototype.getProperty = function() {
        return this._property;
    };


    /**
     * 
     * @param {String} property
     * @returns {Accessor}
     */
    Accessor.prototype.setProperty = function(property) {
        if (typeof property !== 'string') {
            incorrectArg();//throw "Incorrect argument";
        }
        this._property = property;
        return this;
    };
    
    /**
     * 
     * @param {type} types
     * @returns {NamedFunction}
     */
    Accessor.prototype.setTypes = function(types) {
        this._types = types instanceof NParamTypes ? types : NParamTypes(types);
        return this;
    };
    /**
     * 
     * @returns {NParamTypes}
     */
    Accessor.prototype.getTypes = function() {
        return this._types;
    };

    /**
     * 
     * @returns {Block}
     */
    Accessor.prototype.getBody = function() {
        return this._body;
    };
    /**
     * 
     * @param {type} b
     * @returns {Accessor}
     * 
     */
    Accessor.prototype.setBody = function(b) {
        this._body = b instanceof Block ? b : new Block(b);
        return this;
    };

    /**
     * 
     * @returns {String}
     */
    Accessor.prototype.getType = function() {
        throw new Error("Abtract method");
    };

    /**
     * 
     * @returns {String}
     */
    Accessor.prototype.getParam = function() {
        throw new Error("Abtract method");
    };
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    Accessor.prototype.getStatementString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var str = (typeof indentFirstLine === 'undefined' 
                || indentFirstLine === null 
                || toBool(indentFirstLine) ? _ind : "");

        str += this.getType() + " " + this.getProperty() ;
        var p = this.getParams();

        if (p) {
            str += p.toString(ind, false) + " ";
        } else {
            str += "() ";
        }
        var b = this.getBody();
        if (b) {
            str += b.toString(ind, false);
        } else {
            str += "{}";
        }
        return str;
    };
    /**
     * 
     * @returns {String}
     */
    Accessor.prototype.getName = function() {
        return this.getType() + " " + (this.getProperty()||'');
    };
    /**
     * 
     * @param {Object} g
     * @returns {AGetter}
     * @class
     */
    function AGetter(g, o) {
        if (arguments.length > 2) {
            this.setProperty(arguments[0]);
            this.setBody(arguments[2]);
            this.setParams(arguments[1]);
        } else {
            Accessor.apply(this, [].slice.call(arguments));
        }
        if (!this._params) {
            this._params = new Params();
        }
    }

    AGetter.prototype = new Accessor();

    AGetter.__CLASS__ = AGetter;

    AGetter.__CLASS_NAME__ = "AGetter";

    AGetter.prototype.__CLASS__ = AGetter;

    AGetter.prototype.__CLASS_NAME__ = "AGetter";
    /**
     * 
     * @returns {String}
     */
    AGetter.prototype.getType = function() {
        return "get";
    };
    
    

    /**
     * 
     * @returns {String}
     */
    AGetter.prototype.getParam = function() {
        return null;
    };
    
    /**
     * 
     * @param {type} p
     * @returns {AGetter.prototype}
     */
    AGetter.prototype.setParam = function(p) {
        return this;
    };
    /**
     * 
     * @returns {Params}
     */
    AGetter.prototype.getParams = function() {
        return this._params;
    };
    /**
     * 
     * @param {type} params
     * @returns {undefined}
     */
    AGetter.prototype.setParams = function(params) {
        if (isArray(params)) {
            if (params.length !== 0) {
                throw new Error("Incorrect argument");
            }
            this._params = new Params([]);
        } else if (params instanceof Params) {
            if (params.size() !== 0) {
                throw new Error("Incorrect argument");
            }
            this._params = params;
        } else  {
            throw new Error("Incorrect argument");
        }
        return this;
    };
    



    /**
     * 
     * @param {Object|String} s
     * @param {Object} o
     * @returns {ASetter}
     * @class
     */
    function ASetter(s, o) {
        if (arguments.length > 2) {
            this.setProperty(arguments[0]);
            this.setParams(arguments[1]);
            this.setBody(arguments[2]);            
        } else {
            var om = o, n = arguments.length;
            Accessor.apply(this, [].slice.call(arguments));

            if (typeof s !== 'string') {
                om = s;
            }
            if (n > 0) { //if the function is called with arguments
                var p = om.param||om.parameter||om.Param||om.Parameter;
                if (!p) {
                    this.setParam();
                } else {
                    this.setParam(p);
                }
            }
        }
    }
    /**
     * 
     */
    ASetter.prototype = new Accessor();

    ASetter.__CLASS__ = ASetter;

    ASetter.__CLASS_NAME__ = "ASetter";

    ASetter.prototype.__CLASS__ = ASetter;

    ASetter.prototype.__CLASS_NAME__ = "ASetter";


    /**
     * 
     * @returns {String}
     */
    ASetter.prototype.getType = function() {
        return "set";
    };

    /**
     * 
     * @returns {String}
     */
    ASetter.prototype.getParam = function() {
        if (!this._param) {
            this._param = new Param(this.getProperty());
        }
        return this._param;
    };
    /**
     * 
     * @param {type} p
     * @returns {ASetter}
     */
    ASetter.prototype.setParam = function(p) {        
        if (arguments.length === 0) {
            if (this._param) {
                this._param.setName(this.getProperty());
            } else {
                this._param = new Param(this.getProperty());
            }
        } else if (p) {
            this._param = p instanceof Param? p : new Param(p);
        } else {
            throw new Error("Incorrect parameter argument");
        }
        if (this._params) {
            this._params.remove(0);
            this._params.add(this._param);
        } else {
            this._params = new Params([this._param]);
        }
        return this;
    };
    /**
     * 
     * @param {type} params
     * @returns {undefined}
     */
    ASetter.prototype.setParams = function(params) {
        if (isArray(params)) {
            if (params.length !== 1) {
                throw new Error("Incorrect argument");
            }
            var p = params[0];
            this._param = p instanceof Param? p : new Param(p);
            this._params = new Params([this._param]);
        } else if (params instanceof Params) {
            if (params.size() !== 1) {
                throw new Error("Incorrect argument");
            }
            this._params = params;
            this._param = params.get(0);
        } else if (typeof params === 'string' ||isPlainObject(params)) {
            this._param = params instanceof Param? params : new Param(params);
            this._params = new Params([this._param]);
        } else {
            throw new Error("Incorrect argument");
        }
        return this;
    };
    
    /**
     * 
     * @returns {Params}
     */
    ASetter.prototype.getParams = function() {
        return this._params;
    };
    
    
    
    function Getter() {
        this.__SUPER_CLASS__.apply(this, arguments);
    }
    
    /**
     * 
     */
    Getter.prototype = new AGetter();

    Getter.__CLASS__ = Getter;

    Getter.__CLASS_NAME__ = "Getter";
    
    Getter.__SUPER_CLASS__ = AGetter;

    Getter.prototype.__CLASS__ = Getter;

    Getter.prototype.__CLASS_NAME__ = "Getter";
    
    Getter.prototype.__SUPER_CLASS__ = AGetter;
    
    
    function Setter() {
        this.__SUPER_CLASS__.apply(this, arguments);
    }
    
    /**
     * 
     */
    Setter.prototype = new ASetter();

    Setter.__CLASS__ = Setter;

    Setter.__CLASS_NAME__ = "Setter";
    
    Setter.__SUPER_CLASS__ = ASetter;

    Setter.prototype.__CLASS__ = Setter;

    Setter.prototype.__CLASS_NAME__ = "Setter";
    
    Setter.prototype.__SUPER_CLASS__ = ASetter;
    
    
    
    /**
     * <h3>Property class</h3>
     * <p>A property object is an element/field of a class that has at least a 
     * name and accessors (getter and/or setter) method to read (get) or 
     * write(set or modify) it's value. It alse ha modifiers like 
     * <b color="blue">static</b>.</p>
     * @param {type} p
     * @returns {Property}
     * @class Property
     */
    function Property(p) {
        if (isPlainObject(p)) {
            this.setName(p.name||p.Name||p.propertyName||p.PropertyName||p.property||p.Property);
            this.setGetter(p.getter||p.Getter||p.propertyGetter||p.PropertyGetter||p.get||p.Get||p.propertyGet||p.PropertyGet);
            this.setSetter(p.setter||p.Setter||p.propertySetter||p.PropertySetter||p.set||p.Set||p.propertySet||p.PropertySet);
            this.setStatic(coalesceProp(p,["static", "Static", "isStatic", "is_static"])||false);
        } else if (typeof p === 'name' || p instanceof String) {
            this.setName(p);
            this._static = false;
        } else {
            this._name = "";
            this._static = false;
        }
    }    
    
    
    Property.prototype = new ClassBodyElt();
    
    Property.__CLASS__ = Property;
    
    Property.__CLASS_NAME__ = "Property";
    
    Property.prototype.__CLASS__ = Property;
    
    Property.prototype.__CLASS_NAME__ = "Property";
    
    (function() {
        var p = Property.prototype;
        
        p.getName = function() {
            return this._name||"";
        };
        
        p.setName = function(name) {
            if (name instanceof String) {
                name = name.toString();
            }
            if (typeof name !== 'string') {
                throw new Error("String expected");
            }
            if (name === '') {
                throw new Error("Empty string");
            }
            this._name = name;
            return this;
        };
        /**
         * 
         * @returns {tFunction}
         */
        p.getGetter = function() {
            return this._g;
        };
        /**
        
         * @param {Function} g
         * @returns {Property} * 
         */
        p.setGetter = function(g) {
            if (g === null || !isPlainObject(g)) {
                throw new Error("Getter object expected");
            }
            this._g = g instanceof Getter ? g : new Getter(g);
            return this;
        };
        /**
         * 
         * @returns {Function}
         */
        p.getSetter = function() {
            return this._s;
        };
        /**
         * 
         * @param {Function} s
         * @returns {Property}
         */
        p.setSetter = function(s) {
            if (s === null || !isPlainObject(s)) {
                throw new Error("Setter object expected");
            }
            this._s = s instanceof Setter ? s : new Setter(s);
            return this;
        };
        /**
         * 
         * @returns {Boolean}
         */
        p.isStatic = function() {
            return this._static;
        };
        /**
         *
         * @param {Boolean} [s=true]
         * @returns {Property} 
         */
        p.setStatic = function(s) {
            if (arguments.length === 0) {
                this._static = true;
            }
            this._static = toBool(s);
            return this;
        };
        /**
         * 
         * @returns {Boolean}
         */
        p.isPublic = function() {
            return true;
        };
        /**
         * 
         * @returns {undefined}
         */
        p.setPublic = function() {
            throw new Error("Read only property");
        };
        
        Property.prototype = p;
        
    })();
    
    
    
    if (!globalNS.copyClass) {
    
        globalNS.copyClass = function(Cls, newCls) {

            var exclusions = ['__CLASS__', '__CLASS_NAME__', '__NAME__', 
                '__NAMESPACE__', '__NAMESPACE_NAME__', '__NAMESPACE___',
                '__SUPER_CLASS__', '__SUPER__', '__AUTHOR__', '__VERSION__', '__SINCE__'];
            function  copy(o, dest) {
                for (var name in o) {
                    if (hasOwnProp(o, name) && exclusions.indexOf(name) < 0) {
                        dest[name] = o[name];
                    }
                }
            }
            copy(Cls.prototype, newCls.prototype);
            copy(Cls, newCls); 
            return newCls;
        }
        
    }
    /**
     * 
     * @param {Object|String} [a=null]   <p>The metadata/definition when the argument 
     *      is aplain object or the name of the property of the accessor when 
     *      the argument is a string</p>
     * @param {Object} [o=null]  The other metadata informations
     * @returns {Accessor}
     * @class
     * @abstract
     */
    function EAccessor(a, o) {
        if (isPlainObject(a)) {
            this.setProperty(a.property||a.field||a.propertyName||a.fieldName||a.name||a.Name);
            this.setBody(a.body||a.block||a.blockStatement||a.statements||a.statement);
        } else if (a && typeof a === 'string') {
            this.setProperty(a);
            this.setBody(o.body||o.block||o.blockStatement||o.statements||o.statement);
        }
    }
    
    
    EAccessor.prototype = new AEntry();
    
    EAccessor.__CLASS__ = EAccessor;
    
    EAccessor.__CLASS_NAME__ = "EAccessor";
    
    EAccessor.__SUPER_CLASS__ = AEntry;
    
    EAccessor.prototype.__CLASS__ = EAccessor;
    
    EAccessor.prototype.__CLASS_NAME__ = "EAccessor";
    EAccessor.prototype.__SUPER_CLASS__ = AEntry;
    
    copyClass(Accessor, EAccessor);
    
    /**
     * 
     * @returns {EAccessor}
     */
    EAccessor.prototype.getValue = function() {
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    EAccessor.prototype.getKey = function() {
        return this.getType() + ' ' + this.getProperty().toString();
    };
    
    
    /**
     * <h3>Getter as Expression class</h3>
     * @returns {ESetter}
     * @class ESetter
     */
    function EGetter() {
        if (arguments.length > 2) {
            this.setProperty(arguments[0]);
            this.setBody(arguments[2]);
            this.setParams(arguments[1]);
        } else {
            EAccessor.apply(this, [].slice.call(arguments));
        }
        if (!this._params) {
            this._params = new Params();
        }
    }
    
    /**
     * 
     */
    EGetter.prototype = new EAccessor();

    EGetter.__CLASS__ = EGetter;

    EGetter.__CLASS_NAME__ = "EGetter";
    
    EGetter.__SUPER_CLASS__ = AGetter;

    EGetter.prototype.__CLASS__ = EGetter;

    EGetter.prototype.__CLASS_NAME__ = "EGetter";
    
    EGetter.prototype.__SUPER_CLASS__ = AGetter;
    
    copyClass(AGetter, EGetter);
    
    /**
     * 
     * @returns {Boolean}
     */
    EGetter.prototype.isExpression = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    EGetter.isExpression = function() {
        return true;
    };
    
    /**
     * 
     */
    Object.defineProperties(EGetter.prototype, {
        key : { get : EGetter.prototype.getKey, set: function() {throw new Error("Read only property");} },
        value : { get : EGetter.prototype.getValue, set: function() {throw new Error("Read only property");} },
        comment : { get : EGetter.prototype.getComment, set: EGetter.prototype.setComment },
        inlineComment : { get : EGetter.prototype.getInlineComment, set: EGetter.prototype.setInlineComment },
        endComment : { get : EGetter.prototype.getEndComment, set: EGetter.prototype.setEndComment },
        inlineEndComment : { get : EGetter.prototype.getInlineEndComment, set: EGetter.prototype.setInlineEndComment },
        outerComment : { get : EGetter.prototype.getOuterComment, set: EGetter.prototype.setOuterComment },
        outerInlineComment : { get : EGetter.prototype.getOuterInlineComment, set: EGetter.prototype.setOuterInlineComment }
    });
    
    /**
     * <h3>Setter as Expression class</h3>
     * @returns {ESetter}
     * @class ESetter
     */
    function ESetter() {
        if (arguments.length > 2) {
            this.setProperty(arguments[0]);
            this.setParams(arguments[1]);
            this.setBody(arguments[2]);            
        } else {
            var om = o, n = arguments.length;
            Accessor.apply(this, [].slice.call(arguments));

            if (typeof s !== 'string') {
                om = s;
            }
            if (n > 0) { //if the function is called with arguments
                var p = om.param||om.parameter||om.Param||om.Parameter;
                if (!p) {
                    this.setParam();
                } else {
                    this.setParam(p);
                }
            }
        }
    }
    
    /**
     * 
     */
    ESetter.prototype = new EAccessor();

    ESetter.__CLASS__ = ESetter;

    ESetter.__CLASS_NAME__ = "ESetter";
    
    ESetter.__SUPER_CLASS__ = ASetter;

    ESetter.prototype.__CLASS__ = ESetter;

    ESetter.prototype.__CLASS_NAME__ = "ESetter";
    
    ESetter.prototype.__SUPER_CLASS__ = ASetter;
    
    copyClass(ASetter, ESetter);
    
    
    /**
     * 
     * @returns {Boolean}
     */
    ESetter.prototype.isExpression = function() {
        return true;
    };
    
    ESetter.isExpression = function() {
        return true;
    };
    
    /**
     * 
     */
    Object.defineProperties(ESetter.prototype, {
        key : { get : ESetter.prototype.getKey, set: function() {throw new Error("Read only property");} },
        value : { get : ESetter.prototype.getValue, set: function() {throw new Error("Read only property");} },
        comment : { get : ESetter.prototype.getComment, set: ESetter.prototype.setComment },
        inlineComment : { get : ESetter.prototype.getInlineComment, set: ESetter.prototype.setInlineComment },
        endComment : { get : ESetter.prototype.getEndComment, set: ESetter.prototype.setEndComment },
        inlineEndComment : { get : ESetter.prototype.getInlineEndComment, set: ESetter.prototype.setInlineEndComment },
        outerComment : { get : ESetter.prototype.getOuterComment, set: ESetter.prototype.setOuterComment },
        outerInlineComment : { get : ESetter.prototype.getOuterInlineComment, set: ESetter.prototype.setOuterInlineComment }
    });
    
    
    

    /**
     * 
     * @param {Object} fo
     * @class Field
     */
    function Field(fo) {
        if (isPlainObject(fo)) {
            var name = fo.name||fo.Name;
            if (!typeof name) {
                throw new Error("String argument expected");
            }
            if (!name) {
                throw new Error("Empty string argument");
            }
            if (name.startsWith("#")) {
                this.setName(name.substring(1));
                this.setPrivate(true);
            } else {
                this.setName(name);
                this.setPrivate(toBool(fo.private||fo.Private));
                var v = fo.final||fo.Final;
                if (typeof v !== 'undefined') {
                    this.setFinal(toBool(v));
                }
            }
            this.setStatic(toBool(fo.static||fo.Static||fo.staticField||fo.StaticField||fo.isStatic));
            var v = fo.initialValue||fo.initVal||fo.initValue||fo.value||fo.Value||fo.defaultValue||fo.defaultValue;
            if (typeof v !==  'undefined') {
                this.setInitialValue(v);
            }
        }
    }

    Field.prototype = new ClassBodyElt();

    Field.__CLASS__ = Field;

    Field.__CLASS_NAME__ = "Field";

    Field.prototype.__CLASS__ = Field;

    Field.prototype.__CLASS_NAME__ = "Field";
    /**
     * 
     * @returns {String}
     */
    Field.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {type} name
     * @returns {Field.prototype|Field}
     * @param {String} name
     * @returns {Field}
     */
    Field.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    
    /**
     * 
     * @returns {String}
     */
    Field.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @param {type} type
     * @returns {Field.prototype|Field}
     * @param {String} type
     * @returns {Field}
     */
    Field.prototype.setType = function(type) {
        this._type = type;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    Field.prototype.getFinal = function() {
        return this._final;
    };
    /**
     * 
     * @param {type} final
     * @returns {Field.prototype|Field}
     * @param {String} final
     * @returns {Field}
     */
    Field.prototype.setFinal = function(final) {
        this._final = final;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    Field.prototype.getInitialValue = function() {
        return this._initialValue;
    };
    /**
     * 
     * @param {type} initialValue
     * @returns {Field.prototype|Field}
     * @param {String} initialValue
     * @returns {Field}
     */
    Field.prototype.setInitialValue = function(initialValue) {
        this._initialValue = Expression.getInstance(initialValue);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Field.prototype.isPrivate = function() {
        return this._private;
    };
    /**
     * 
     * @param {Boolean} private
     * @returns {Field}
     */
    Field.prototype.setPrivate = function(private) {
        this._private = toBool(private);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Field.prototype.isStatic = function() {
        return this._static;
    };
    /**
     * 
     * @param {Boolean} static
     * @returns {Field}
     */
    Field.prototype.setStatic = function(static) {
        this._static = toBool(static);
        return this;
    };
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    Field.prototype.toString = function(ind, indentFirstLine) {
        var s = "";
        s += (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "");
        s += (this.isStatic() ? 'static ' : '') + (this.isPrivate() ? '#' : '') + this.getName();
        if (typeof this._initialValue !== 'undefined') {
            s += " = " + (this._initialValue === null ? 'null' : this._initialValue.toString());
        }
        return s;
    };
    /**
     * 
     * @returns {Signature}
     */
    function Signature() {
        if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setParams(arguments[1]);
            if (arguments.length > 2) {
                this.setReturnType(arguments[2]);
            }
        } else {
            var a = arguments[0];
            if (isPlainObject(a)) {
                this.setName(a.name||a.Name);
                this.setParams(a.params||a.parameters||a.Params||a.Parameters);
                var type = a.returnType||a.ReturnType;
                if (type) {
                    this.setReturnType(type);
                }
            }
        }
    }
    
    /**
     * 
     * @returns {String|Expression}
     */
    Signature.prototype.getName = function() {
        return this.___name_||"";
    };
    
    /**
     * 
     * @param {Boolean} private
     * @returns {Method}
     */
    Signature.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    
    
    /**
     * 
     * @returns {Array}
     */
    Signature.prototype.getParams = function() {
        return this._params;
    };
    /**
     * 
     * @param {type} param
     * @returns {Method}
     */
    Signature.prototype.addParam = function(param) {
        this._params.add(param instanceof Param ? param : new Param(param));
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Method}
     * 
     */
    Signature.prototype.addParams = function(params) {
        if (arguments.length > 1) {
            var args = [].slice.call(arguments);
            for (var i = 0, n = args.length; i < n; i++) {
                this.addParam(args[i]);
            }
        } else if (isArray(params)) {
            for (var i = 0, n = params.length; i < n; i++) {
                this.addParam(params[i]);
            }
        } else if (isPlainObject(params)) {
            for (var n in params) {
                this.addParam(new Param(params[n]));
            }
        }
        return this;
    };
    /**
     * 
     * @param {Array} params
     * @returns {Method}
     * 
     */
    Signature.prototype.setParams = function(params) {
        this._params = params instanceof Params ? params : new Params(params);
        return this;
    };
    /**
     * 
     * @returns {Array}
     */
    Signature.prototype.getParameters = Signature.prototype.getParams;

    /**
     * 
     * @returns {Array}
     */
    Signature.prototype.setParameters = Signature.prototype.setParams;
    
    /**
     * 
     * @returns {Boolean}
     */
    Signature.prototype.isPrivate = function() {
        return this._private;
    };
    /**
     * 
     * @param {Boolean} private
     * @returns {Method}
     */
    Signature.prototype.setPrivate = function(private) {
        this._private = private;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Signature.prototype.isStatic = function() {
        return this._static;
    };
    /**
     * 
     * @param {Boolean} static
     * @returns {Method}
     */
    Signature.prototype.setStatic = function(static) {
        this._static = static;
        return this;
    };
    /**
     * 
     * @param {SType|String} returnType
     * @returns {Func}
     */
    Signature.prototype.setReturnType = function(returnType) {
        this._returnType = returnType;
        return this;
    };
    /**
     * 
     * @returns {SType}
     */
    Signature.prototype.getReturnType = function() {
        return this._returnType;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {ClassBodyObj.toString.s|String}
     */
    Signature.prototype.getStatementString = function(ind, indentFirstLine) {
        var name = this.getName()||"";
        if (name instanceof ComputedName || name instanceof Expression) {
            name = name.toString(ind, false);
        }
        
        var s = "";
        s += (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "");
        s += (this.isStatic() ? 'static ' : '') + (this.isPrivate() ? '#' : '') + name;
        s += this._params.toString(ind, false);     
        if (this._returnType) {
            s += ": " + this._returnType.toString(true);
        }
        return s;
    };
    /**
     * 
     * @returns {String}
     */
    Signature.prototype.getInlineStatementString = function() {
        var name = this.getName()||"";
        if (name instanceof ComputedName || name instanceof Expression) {
            name = name.toString(true);
        }
        
        var s = "";
        
        s += (this.isStatic() ? 'static ' : '') + (this.isPrivate() ? '#' : '') + name;
        s += this._params.toString(true);   
        if (this._returnType) {
            s += ": " + this._returnType.toString(true);
        }
        return s;
    };
    
    
    
    
    
    /**
     * 
     * @param {type} b
     * @returns {ClassBody}
     * @class ClassBody
     */
    function ClassBody(b) {        
                
        
        //The list of elements of the class
        this.___elts__ = [];
        
        
        /* ---------------------------------------------------- /
         * ---------------   Cache block   -------------------- /
         * ---------------------------------------------------- */
        
        
        // this.___elts__, this.___eltsMap__, this.___methodsMap__, 
        // this.___methodsMap__ and this.___fieldsMap__ are private fields : do
        // do not access that fields of the instance (object) add elements in 
        // the this.___elts__ or set/put elements in the other. Let that fields 
        // only manipulated by calling the methods of the instance. 
        
        
        
        
        //The mapping of the list of elements of the class : cache
        this.___eltsMap__ = {};
        //The list of properties of the class : cache
        this.___props__ = [];
        //The mapping of the list of properties of the class : cache
        this.___propsMap__ = {};
        //The list of methods of the class : cache
        this.___methods__ = [];
        //The mapping of the list of methods of the class : cache
        this.___methodsMap__ = {};  
        //The list of fields of the class : cache
        this.___fields__ = [];
        //The mapping of the list of fields of the class : cache
        this.___fieldsMap__ = {};
        
        /* ---------------------------------------------------- /
         * ----------------   Cache block end  ---------------- /
         * ---------------------------------------------------- */
        
        
        
        if (isArray(b)) {
            for (var i = 0, n = b.length; i < n; i++) {
                this.addElement(b[i]);
            }
        } else if (isPlainObject(b)) {
            var elts = b.elements||b.Elements||b.statements||b.Statements||b.statement||b.Statement;
            if (isArray(elts)) {
                for (var i = 0, n = elts.length; i < n; i++) {
                    this.addElement(elts[i]);
                }
            } else if (isPlainObject(elts)) {
                this.___elts__[0] = ClassBodyObj.getInstance(elts);
            }
            if (b.comment) {
                this.setComment(b.comment);
            }
            
            if (b.inlineComment) {
                this.setInlineComment(b.inlineComment);
            }
            
            if (b.endComment) {
                this.setEndComment(b.endComment);
            }
        }
    };
    /**
     * 
     * @type ClassBody
     */
    ClassBody.__CLASS__ = ClassBody;
    /**
     * 
     * @type String
     */
    ClassBody.__CLASS_NAME__ = "ClassBody";
    /**
     * 
     * @type ClassBody
     */
    ClassBody.prototype.__CLASS__ = ClassBody;
    /**
     * 
     * @type String
     */
    ClassBody.prototype.__CLASS_NAME__ = "ClassBody";
    /**
     * Returns the element of the body that corresponds to the given name and the given type
     * @param {String} name The name of the element to get
     * @param {String} [typ="any"]
     * @returns {ClassBodyElt}
     */
    ClassBody.prototype.get = function(name, typ) {
        if (typ instanceof String) {
            typ = typ.valueOf();
        }
        if (typeof typ === 'string') {
            typ = typ.toLowerCase();
        }
        var key;
        if (name === 'constructor') key = 'construct';
        else if (typ === 'get' || typ === 'getter') key = name + "[[get]]";
        else if (typ === 'set' || typ === 'setter') key = name + "[[set]]";
        else key = name;
        var e = this.___eltsMap__[key];
        if (e) {
            if (typ) {                
                if (typ === 'any' || typ === '*') {
                    return e;
                }
                switch (typ) {
                    case 'construct':
                    case 'constructor':
                        if (e instanceof Constructor) {
                            return e;
                        }
                        break;
                    case 'method':
                        if (e instanceof Method) {
                            return e;
                        }
                        break;
                    case 'field':
                        if (e instanceof Field) {
                            return e;
                        }
                        break;
                    case 'property':
                        if (e instanceof Property) {
                            return e;
                        }
                        break;
                    case 'get':
                    case 'getter':
                        if (e instanceof Getter) {
                            return e;
                        }
                        break;
                    case 'set':
                    case 'setter':
                        if (e instanceof Setter) {
                            return e;
                        }
                        break;
                }
                throw new Error("The object corresponding to the given name  does not match the type");
            }
        }
        return e;
    };
    /**
     * 
     * @param {ClassBodyElt|Object} o
     * @returns {ClassBody}
     */
    ClassBody.prototype.addElement = function (o) { 
        var e = ClassBodyObj.getInstance(o), key;
        if (e instanceof Constructor) {
            key = "construct";
            if (this.___construct__) {
                throw new Error("A constructor already exists");
            }
            this.setConstructor(e);
        } else {            
            if (!(e instanceof ClassBodyElt)) {
                throw new Error("The given object is not a class body element");
            }
            this.___elts__[this.___elts__.length] = e;
            if (e instanceof Property) {
                this.___props__[this.___props__.length] = e;
                this.___propsMap__[key = e.getName()] = e;
            } else if (e instanceof Method) {
                this.___methods__[this.___methods__.length] = e;
                this.___methodsMap__[key = e.getName()] = e;
            }  else if (e instanceof Field) {
                this.___fields__[this.___fields__.length] = e;
                this.___fieldsMap__[key = e.getName()] = e;
            } else if (e instanceof Accessor) {
                var name = e.getProperty();
                var prop = this.___propsMap__[name];                
                if (!prop) {
                    prop = new Property(name); 
                    this.___propsMap__[name] = prop; 
                    this.___props__[this.___props__.length] = prop;
                    if (e instanceof Getter) {
                        key = name + "[[get]]";
                        prop.setGetter(e);
                    } else {
                        key = name + "[[set]]";
                        prop.setSetter(e);
                    }
                } else {
                    if (e instanceof Getter) {
                        key = name + "[[get]]";                    
                        if (this.___eltsMap__[key])
                            throw new Error("A getter already exists for the property " + name);
                        prop.setGetter(e);
                    } else {
                        key = name + "[[set]]";
                        if (this.___eltsMap__[key])
                            throw new Error("A setter already exists for the property " + name);
                        prop.setSetter(e);
                    }
                    
                }
            }
        }
        this.___eltsMap__[key] = e;
        return this;
    };
    /**
     * 
     * @param {String|Number|ClassBodyElt} elt
     * @param {type} typ
     * @returns {Boolean|ClassBody}
     */
    ClassBody.prototype.removeElement = function(elt, typ) {
        function _remove(e, key, index) {
            delete this.___eltsMap__[key];
            if (e instanceof Property) {
                delete this.___propsMap__[key];
                this.___props__.splice(this.___props__.indexOf(e), 1);
                delete this.___eltsMap__[key + "[[get]]"];
                delete this.___eltsMap__[key + "[[set]]"];
                var i = this.___elts__.indexOf(e.getGetter());
                if (i >= 0) {
                    this.___props__.splice(i, 1);
                }
                i = this.___elts__.indexOf(e.getSetter());
                if (i >= 0) {
                    this.___elts__.splice(i, 1);
                }
            } else if (e instanceof Accessor) {
                var prop = e.getProperty();
                var p = this.___propsMap__[prop], // get the implicit property 
                    dualMethod = e instanceof Getter ? 'getSetter' : 'getGetter';
                if (!p[dualMethod]()) {
                    delete this.___propsMap__[key];
                    this.___props__.splice(this.___props__.indexOf(prop), 1);
                }
            } else if (e instanceof Method) {
                this.___methods__.splice(this.___methods__.indexOf(e), 1);
            } else if (e instanceof Field) {
                this.___fields__.splice(this.___fields__.indexOf(e), 1);
            } else if (e instanceof Constructor) {
                this.___construct__ = void 0;
            }
            this.___elts__.splice(index, 1);
        }
        if (typeof elt === 'string') { 
            var name = elt;
            if (typ instanceof String) {
                typ = typ.valueOf();
            }
            if (typeof typ === 'string') {
                typ = typ.toLowerCase();
            }
            var key;
            if (name === 'constructor') key = 'construct';
            else if (typ === 'get' || typ === 'getter') key = name + "[[get]]";
            else if (typ === 'set' || typ === 'setter') key = name + "[[set]]";
            else key = name;
            var e = this.___eltsMap__[key];
            if (!e) {
                return false;
            }
            _remove(e, key, this.___elts__.indexOf(e));
            return e;
        }
        var i, index = false;
        if (typeof elt === 'number' || elt instanceof Number) {
            i = elt instanceof Number ? elt.valueOf() : elt;
            if (i > this.___elts__.length) {
                throw new Error("Index out of bounds: " + i);
            }
            elt = this.___elts__[i];
            index = true;
        } else {
            i = this.___elts__.indexOf(elt);
            if (i < 0) {
                return false;
            }
        }
        _remove(elt,
                elt instanceof Getter 
                    ? elt.getProperty() + "[[get]]" 
                    : elt instanceof Setter 
                    ? elt.getProperty() + "[[Set]]" 
                    : elt.getName(), // computes the key
                i);
        return index ? elt : this;
    };
    /**
     * 
     * @param {Number|String} k
     * @returns {Property}
     */
    ClassBody.prototype.getProperty= function(k) {
        return typeof k === 'string' ? this.___propsMap__[k] : this.___props__[k];
    };
    
    ClassBody.prototype.property= function(i) {
        return this.___props__[i];
    };
    
    ClassBody.prototype.propertiesCount = function() {
        return this.___props__.length;
    };
    
    ClassBody.prototype.field= function(i) {
        return this.___fields__[i];
    };
    
    ClassBody.prototype.method= function(i) {
        return this.___methods__[i];
    };
    
    ClassBody.prototype.fieldsCount = function() {
        return this.___fields__.length;
    };
    
    ClassBody.prototype.methodsCount = function() {
        return this.___methods__.length;
    };
    /**
     * 
     * @param {Number|String} k
     * @returns {Method}
     */
    ClassBody.prototype.getMethod = function(k) {
        return typeof k === 'string' ? this.___methodsMap__[k] : this.___methods__[k];
    };
    /**
     * 
     * @param {Number|String} k
     * @returns {Field}
     */
    ClassBody.prototype.getField = function(k) {
        return typeof k === 'string' ? this.___fieldsMap__[k] : this.___fields__[k];
    };
    /**
     * 
     * @param {Number|String} k
     * @returns {Field}
     */
    ClassBody.prototype.getElement = function(k) {
        return typeof k === 'string' ? this.___eltsMap__[k] : this.___elts__[k];
    };
    /**
     * 
     * @param {Number} i
     * @returns {type}
     */
    ClassBody.prototype.element = function(i) {
        return this.___elts__[i];
    };
    /**
     * 
     * @param {type} name
     * @returns {type}
     */
    ClassBody.prototype.fromName = function(name) {
        return this.___eltsMap__[name];
    };
    ClassBody.prototype.elementFromName = ClassBody.prototype.fromName;
    
    ClassBody.prototype.eltFromName = ClassBody.prototype.fromName;
    /**
     * 
     * @returns {Number}
     */
    ClassBody.prototype.size = function() {
        return this.___elts__.length;
    };
    /**
     * 
     * @param {Constructor|Object} c
     * @returns {ClassBody}
     */
    ClassBody.prototype.setConstructor = function(c) {
        var _c = this.___construct__;
        this.___construct__ = c = c instanceof Constructor ? c : new Constructor(c);
        if (this.___elts__.length === 0) {
            this.___elts__[0] = c;
        } else {
            var i = this.___elts__.indexOf(_c);
            if (i >= 0){
                this.___elts__.splice(i, 1);
            }
            this.___elts__.splice(0, 0, c);
        }
        return this;
    };
    /**
     * 
     * @returns {Constructor}
     */
    ClassBody.prototype.getConstructor = function() {
        return this.___construct__||null;
    };
    /**
     * 
     * @param {Function} func
     * @param {Object} obj
     * @param {Function} [callback]
     * @returns {undefined}
     */
    ClassBody.prototype.forEachProperty = function(func, obj, callback) {
        var props = this.___properties__, n = props.length;
        for (var i = 0; i < n; i++) {
            func(props[i], i, n, obj);
        }
        if (callback) {
            callback(obj, this);
        }
    };
    /**
     * 
     * @param {Function} func
     * @param {Object} obj
     * @param {Function} [callback]
     * @returns {undefined}
     */
    ClassBody.prototype.forEachMethod = function(func, obj, callback) {
        var elts = this.___methods__, n = elts.length;
        for (var i = 0; i < n; i++) {
            func(elts[i], i, n, obj);
        }
        if (callback) {
            callback(obj, this);
        }
    };
    /**
     * 
     * @param {Function} func
     * @param {Object} obj
     * @param {Function} [callback]
     * @returns {undefined}
     */
    ClassBody.prototype.forEachField = function(func, obj, callback) {
        var elts = this.___fields__, n = elts.length;
        for (var i = 0; i < n; i++) {
            func(elts[i], i, n, obj);
        }
        if (callback) {
            callback(obj, this);
        }
    };
    /**
     * 
     * @param {Function} func
     * @param {Object} obj
     * @param {Function} [callback]
     * @returns {undefined}
     */
    ClassBody.prototype.forEachElement = function(func, obj, callback) {
        var elts = this.___elts__, n = elts.length;        
        for (var i = 0; i < n; i++) {
            func(elts[i], i, n, obj);
        }
        if (callback) {
            callback(this);
        }
    };
    
    
    /**
     * 
     */
    ClassBody.prototype.forEachElt = ClassBody.prototype.forEachElement;
    /**
     * 
     * @returns {unresolved}
     */
    ClassBody.prototype.propertiesIterator = function() {
        return  new CIterator(this);
    };
    
    /**
     * 
     * @returns {unresolved}
     */
    ClassBody.prototype.elementsIterator = function() {
        return  new CIterator(this, 'elt');
    };
    /**
     * 
     * @param {type} s
     * @returns {ClassBody}
     */
    ClassBody.prototype.addElements = function (s) {
        if (isArray(s)) {
            for (var i = 0, n = s.length; i < n; i++) {
                this.addElement(ClassBodyObj.getInstance(s[i]));
            }
        } else if (isPlainobject(s)){
            var e;
            for (var name in s) {
                e = s[name];
                if (isArray(e)) {
                    if (e[0]) {
                        this.addElement(new Getter(name, e[0]));
                    }
                    if (e[1]) {
                        this.addElement(new Setter(name, e[1]));
                    }
                } else if (isPlainObject(e)) {
                    var g = e.get||e.getter||e.Get||e.Getter;
                    var s = e.set||e.setter||e.Set||e.Setter;
                    if (g || s) {
                        if (g) {
                            g = new Getter(name, e);
                            this.addElement(g);
                        }
                        if (s) {
                            s = new Setter(name, e);
                            this.addElement(s);
                        }
                    }  else {
                        this.addElement(ClassBodyObj.getInstance(e, null, name));
                    }
                }
            }
        }
        return this;
    };

    /**
     * 
     * @param {type} s
     * @returns {ClassBody}
     */
    ClassBody.prototype.setElements = function (s) {
        this.___elts__ = [];
        return this.addElements(s);
    };
    /**
     * 
     * @alias
     * @see ClassBody.prototype.addElement
     */
    ClassBody.prototype.addStatement = ClassBody.prototype.addElement;
    /**
     * 
     * @alias
     * @see ClassBody.prototype.addElements
     */
    ClassBody.prototype.addStatements = ClassBody.prototype.addElements;
    /**
     * 
     * @see ClassBody.prototype.setElements
     * @alias
     */
    ClassBody.prototype.setStatements = ClassBody.prototype.setElements;
    /**
     * 
     * @returns {IComment}
     */
    ClassBody.prototype.getComment = function() {
        return this._comment;
    };
    /**
     * 
     * @param {IComment|Object} comment
     * @returns {ClassBody}
     */
    ClassBody.prototype.setComment = function(comment) {                
        this._comment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        return this;
    };
    /**
     * 
     * @param {type} comment
     * @returns {ClassBody}
     */
    ClassBody.prototype.addComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._comment) {
            this._comment = comment;
        } else if (this._comment instanceof Comment) {
            this._comment = new Comments([this._comment, comment]);
        } else {
            this._comment.add(comment);
        }
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    ClassBody.prototype.getInlineComment = function() {
        return this._inlineComment;
    };
    /**
     * 
     * @param {IComment|Object} comment
     * @returns {ClassBody}
     */
    ClassBody.prototype.setInlineComment = function(comment) {
        this._inlineComment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        return this;
    };
    /**
     * 
     * @param {type} comment
     * @returns {ClassBody}
     */
    ClassBody.prototype.addInlineComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._inlineComment) {
            this._inlineComment = comment;
        } else if (this._inlineComment instanceof Comment) {
            this._inlineComment = new Comments([this._inlineComment, comment]);
        } else {
            this._inlineComment.add(comment);
        }
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    ClassBody.prototype.getEndComment = function() {
        return this._endComment;
    };
    /**
     * 
     * @param {type} comment
     * @param {Boolean} [inline]
     * @returns {ClassBody}
     */
    ClassBody.prototype.setEndComment = function(comment, inline) {
        this._endComment = typeof comment === 'undefined' || comment === null ? 
                null: IComment.getInstance(comment);
        if (arguments.length > 1) {
            this.setInlineComment(inline);
        }
        return this;
    };
    
    /**
     * 
     * @param {type} comment
     * @returns {ClassBody}
     */
    ClassBody.prototype.addEndComment = function(comment) {
        if (!comment || !isPlainObject(comment)) {
            throw new Error("Incorrect argument");
        }
        comment = IComment.getInstance(comment);
        if (!this._endComment) {
            this._endComment = comment;
        } else if (this._endComment instanceof Comment) {
            this._endComment = new Comments([this._endComment, comment]);
        } else {
            this._endComment.add(comment);
        }
        return this;
    };
    
    /**
     * 
     * @returns {type}
     */
    ClassBody.prototype.getInlineEndComment = function() {
        return this._inlineEndComment;
    };
    /**
     * 
     * @param {Boolean} inline
     * @returns {ClassBody}
     */
    ClassBody.prototype.setInlineEndComment = function(inline) {
        this._inlineEndComment = toBool(inline);
        return this;
    };
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    ClassBody.prototype.toString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var str = (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "") + "{";
        for (var i = 0, n = this.___elts__.length; i < n; i++) {
            str += "\n" + this.___elts__[i].toString(ind + 1, true);
        }
        str += "\n" + _ind + "}";

        return str;
    };
    /**
     * 
     * @param {Class|ClassBody} b
     * @param {String} [typ="properties"]
     * @returns {CIterator}
     */
    function CIterator(b, typ) {
        if (b instanceof Class) {
            b = b.getBody();
        }
        if (!typ) {
            typ = 'properties';
        }
        if (typeof typ !== 'string') {
            throw new Error("The argument 'typ' is incorrect");
        }
        var field;
        if ((typ = typ.toLowerCase()) === 'properties' || typ === 'props' 
                || typ === 'property' || typ === 'prop') {
            field = '___props__';
        } else if (typ === 'methods' || typ === 'method') {
            field = '___methods__';
        } else if (typ === 'fields' || typ === 'field') {
            field = '___methods__';
        } else if ((typ = typ.toLowerCase()) === 'elements' || typ === 'elts' 
                || typ === 'element' || typ === 'elt') {
            field = '___elts__';
        }
        this._cache = { ___elts__: b[field], ___ndx__ : 0 };
        this.next = function() {
            var c = this._cache;
            return c.___elts__[c.___ndx__++];
        };
        this.hasNext = function() {
            var c = this._cache;
            return c.___ndx__ < c.___elts__.length;
        };
        this.reset = function() {
            this._cache.___ndx__ = 0;
            return this; 
        };
    }

    
    
    
    
    
    /**
     * 
     * @param {type} opts
     * @returns {Class}
     * @class Class
     */
    function Class(opts) {
        if (arguments.length >= 3) {
            this.setName(arguments[0]);
            this.setSuper(arguments[1]);
            this.setBody(arguments[2]);
        } else if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setBody(arguments[1]);
        } else if (isPlainObject(opts)) {
            this.setName(opts.name||opts.Name);
            this.setSuper(opts.super||opts.superClass||opts.parent||opts.parentClass);
            this.setBody(opts.body||opts.block||opts.statements||opts.statement);
        }
    }

    Class.prototype = new Statement();

    Class.__CLASS__ = Class;

    Class.__CLASS_NAME__ = "Class";
    
    Class.__SUPER_CLASS__ = Statement;

    Class.prototype.__CLASS__ = Class;

    Class.prototype.__CLASS_NAME__ = "Class";

    /**
     * 
     * @returns {Boolean}
     */
    Class.prototype.isStatement = function() {
        return true;
    };
    /**
     *
     * @returns {Boolean} 
     */
    Class.prototype.isExpression = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Class.prototype.isNoValue = function() {
        return false;
    };
    /**
     * 
     * @returns {String}
     */
    Class.prototype.getName = function() {
        return this._name||"";
    };
    /**
     * 
     * @param {String} name
     * @returns {Class}
     */
    Class.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    Class.prototype.getExtends = function() {
        return this._extends||"";
    };
    /**
     * 
     * @param {String} ext
     * @returns {Class}
     */
    Class.prototype.setExtends = function(ext) {
        this._extends = ext;
        return this;
    };
    
    /**
     * 
     * @returns {String}
     */
    Class.prototype.getImplements = function() {
        return this._implements||"";
    };
    /**
     * 
     * @param {String} impl
     * @returns {Class}
     */
    Class.prototype.setImplements = function(impl) {
        this._implements = impl;
        return this;
    };
    /**
     * 
     * @param {type} types
     * @returns {NamedFunction}
     */
    Class.prototype.setTypes = function(types) {
        this._types = types instanceof NParamTypes ? types : NParamTypes(types);
        return this;
    };
    /**
     * 
     * @returns {NParamTypes}
     */
    Class.prototype.getTypes = function() {
        return this._types;
    };
    /**
     * 
     * @returns {String}
     */
    Class.prototype.getSuper = function() {
        return this._super||"";
    };
    /**
     * 
     * @param {String} s
     * @returns {Class}
     */
    Class.prototype.setSuper = function(s) {
        this._super = s;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    Class.prototype.getBody = function() {
        return this._body;
    };
    /**
     * 
     * @param {String} body
     * @returns {Class}
     */
    Class.prototype.setBody = function(body) {
        this._body = body instanceof ClassBody ? body : new ClassBody(body);
        return this;
    };
    /**
     * 
     * @returns {Constructor}
     */
    ClassBody.prototype.getConstructor = function() {
        return this.getBody().getConstructor();
    };
    /**
     * Process all the properties of the class body.
     * @param {Function} func  The function that will process each property
     *     The parameters of this function argument are:
     *     <ul>
     *     <li>The property</li>
     *     <li>The index of the property in the properties list</li>
     *     <li>The number of properties in the properties list</li>
     *     <li>An object or function that will be used by the function 'func'</li>
     *     </ul>
     * @param {Object|Function} obj Any object or function that will be used by the function 'func'
     * <p>For an exemple, if the function 'func' is a writer, this object can be an output object.</p>
     * @param {Function} [callback]
     * @returns {Class}
     */
    Class.prototype.forEachProperty = function(func, obj, callback) {
        this.getBody().forEachProperty(func, obj, callback);
	return this;
    };
    /**
     * Process all the methods of the class body.
     * @param {Function} func The function that will process each method
     *     The parameters of this function argument are:
     *     <ul>
     *     <li>The method</li>
     *     <li>The index of the method in the properties list</li>
     *     <li>The number of methods in the methods list</li>
     *     <li>An object or function that will be used by the function 'func'</li>
     *     </ul>
     * @param {Object|Function} obj Any object or function that will be used by the function 'func'
     * <p>For an exemple, if the function 'func' is a writer, this object can be an output object.</p>
     * @param {Function} [callback]
     * @returns {Class}
     */
    Class.prototype.forEachMethod = function(func, obj, callback) {
        this.getBody().forEachMethod(func, obj, callback);
	return this;
    };
    /**
     * Process all the fields of the class body.
     * @param {Function} func The function that will process each field
     *     The parameters of this function argument are:
     *     <ul>
     *     <li>The property</li>
     *     <li>The index of the field in the fields list</li>
     *     <li>The number of fields in the fields list</li>
     *     <li>An object or function that will be used by the function 'func'</li>
     *     </ul>
     * @param {Object|Function} obj Any object or function that will be used by the function 'func'
     * <p>For an exemple, if the function 'func' is a writer, this object can be an output object.</p>
     * @param {Function} [callback]
     * @returns {Class}
     */
    Class.prototype.forEachField = function(func, obj, callback) {
        this.getBody().forEachField(func, obj, callback);
	return this;
    };
    /**
     * Process all the elements of the class body.
     * @param {Function} func The function that will process each element
     *     The parameters of this function argument are:
     *     <ul>
     *     <li>The property</li>
     *     <li>The index of the element in the elements list</li>
     *     <li>The number of elements in the elements list</li>
     *     <li>An object or function that will be used by the function 'func'</li>
     *     </ul>
     * @param {Object|Function} obj Any object or function that will be used by the function 'func'
     * <p>For an exemple, if the function 'func' is a writer, this object can be an output object.</p>
     * @param {Function} [callback]
     * @returns {Class}
     */
    Class.prototype.forEachElement = function(func, obj, callback) { 
        this.getBody().forEachElement(func, obj, callback); 
        return this;
    };
    /**
     * Process all the statements/elements of the class body.
     * @param {Function} func The function that will process each statement
     *     The parameters of this function argument are:
     *     <ul>
     *     <li>The property</li>
     *     <li>The index of the statement in the statements list</li>
     *     <li>The number of statements in the statements list</li>
     *     <li>An object or function that will be used by the function 'func'</li>
     *     </ul>
     * @param {Object|Function} obj Any object or function that will be used by the function 'func'
     * <p>For an exemple, if the function 'func' is a writer, this object can be an output object.</p>
     * @param {Function} [callback]
     * @returns {Class}
     * @alias 
     * @see Class.prototype.forEachElement
     */
    Class.prototype.forEachStatement = Class.prototype.forEachElement;
    /**
     * 
     * @returns {Class.prototype@call;getBody@call;propertiesIterator}
     */
    Class.prototype.propertiesIterator = function() { return this.getBody().propertiesIterator(); } ;
    /**
     * 
     * @returns {Class.prototype@call;getBody@call;elementsIterator}
     */
    Class.prototype.elementsIterator = function() { return this.getBody().elementsIterator(); };
    
    /**
     * 
     * @returns {IComment}
     */
    Class.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {IComment|String} c
     * @returns {QuotedHintStatement}
     */
    Class.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    Class.prototype.toString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var s = (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "") ;
        s += "class " + this.getName() + ' ';
        if (this._super) {
            s += 'extends ' + this._super + ' ';
        }
        s += this._body ? this._body.toString(ind, false) : "{}";
        return s;
    };

    /**
     * 
     * @param {type} s
     * @returns {Class}
     */
    Class.prototype.addStatement = function (s) {
        if (!this._body) {
            this._body = new ClassBody();
        }
        this._body.addStatement(s);
        return this;
    };

    /**
     * 
     * @param {type} s
     * @returns {Class}
     */
    Class.prototype.addStatements = function (s) {
        if (!this._body) {
            this._body = new ClassBody();
        }
        this._body.addStatements(s);
        return this;
    };
    /**
     * 
     * @param {type} s
     * @returns {Class}
     */
    Class.prototype.setStatements = function (s) {
        if (!this._body) {
            this._body = new ClassBody();
        }
        this._body.setStatements(s);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Class.prototype.isExpression = function() {
        return true;
    };






    /**
     * 
     * @returns {With}
     *  @class
     *  @abstract
     */
    function With() {
        if (arguments.length === 1) {
            var w = arguments[0];
            this.setExpression(w.expression||w.variable||w.object);
            this.setBody(w.body||w.block||w.statement||w.statements);
        } else if (arguments.length > 1) {
            this.setExpression(arguments[0]);
            this.setBody(arguments[1]);
        }
    }

    With.prototype = new Statement();
    /**
     * 
     * @returns {Expression}
     */
    With.prototype.getExpression = function() {
        return this._expression;
    };
    /**
     * 
     * @param {type} e
     * @returns {With}
     */
    With.prototype.setExpression = function(e) {
        this._expression = Expression.getInstance(e);
        return this;
    };
    /**
     * 
     * @returns {Invocation|Instantiation|ArrowFunction|NamedFunction|AnonymousFunction|If|For|ForIn|ForOf|While|DoWhile|Switch|Try|AutoIncrement|Block|Return|Break|Continue|LStatement|With}
     */
    With.prototype.getBody = function() {
        return this._body;
    };
    /**
     * 
     * @param {Block|Statement|StatementElt} body
     * @return {With}
     */
    With.prototype.setBody = function(body) {
         if (body instanceof Block || body instanceof Statement || (body instanceof StatementElt && body.isStatement())) {
             this._body = body;
         } else if (isArray(body)) {
             this._body = new Block(body);
         } else if (isPlainObject(body)) {
             this._body = Statement.getInstance(body);
         }
         return this;
    };
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirsLine
     * @returns {String}
     */
    With.prototype.getStatementString=function(ind, indentFirsLine) {
        var str = "";
        if (indentFirsLine) {
            for (var i = 0; i < ind; i++) {
                str += "    ";
            }
        }
        str += "with (";
        var e = this.getExpression();
        if (e) {
            str += e.toString(ind, false);
        }
        str += ")";
        var b = this.getBody();
        if (b instanceof Block) {
            str += b.toString(ind, false);
        } else if (b instanceof StatementElt) {
            str += "\n" + b.toString(ind + 1, true);
        }
        return str;
    };
    
    /**
     * 
     * @returns {String}
     */
    With.prototype.getInlineStatementString=function() {
        var str = "with (";
        var e = this.getExpression();
        if (e) {
            str += e.toString(true);
        }
        str += ")";
        var b = this.getBody();
        if (b instanceof Block) {
            str += " " + b.toString(true);
        } else if (b) {
            str += " " + b.toString(true);
        }
        return str;
    };
    
    /**
     * 
     * @param {type} o
     * @returns {Label}
     * @class
     */
    function Label(o) {
        if (typeof o === 'string' || o instanceof String) {
            this._label = o.toString();
        } else if (isPlainObject(o)) {
            this._label = (o.label||o.Label||"").toString();
            var c = o.comment||o.Comment||o.beforeLabelComment||o.BeforeLabelComment;
            if (c) {
                this.setComment(c);
            }
            c = o.inlineComment||o.InlineComment||o.beforeLabelInlineComment||o.BeforeLabelInlineComment;
            if (c) {
                this.setInlineComment(c);
            }
            
            c = o.endComment||o.EndComment||o.AfterLabelComment||o.AfterLabelComment;
            if (c) {
                this.setEndComment(c);
            }
            c = o.inlineEndComment||o.InlineEndComment||o.afterLabelInlineComment||o.AfterLabelInlineComment;
            if (c) {
                this.setInlineEndComment(c);
            }
        }
    }
    
    
    Label.prototype = new StatementElt();
    
    Label.prototype.__CLASS__ = Label;
    
    Label.prototype.__CLASS_NAME__ = "Label";
    
    Label.__CLASS__ = Label;
    
    Label.__CLASS_NAME__ = "Label";
    /**
     * 
     * @returns {Label}
     */
    Label.prototype.getLabel = function() {
        return this._label;
    };
    
    /**
     * 
     * @param {String|Label} label
     * @returns {Label}
     */
    Label.prototype.setLabel = function(label) {
        if (label instanceof String) {
            label = label.toString();
        }
        if (!label || typeof label !== 'string') {
            throw new Error("Incorrect argument");
        }
        if (!SERENIX_LABEL_REGEXP) {
            SERENIX_LABEL_REGEXP = new XRegExp("[a-zA-Z_$][a-zA-Z_$0-9]*", "g");
        }
        
        this._label = label;
        return this;
    };
    
    Label.prototype.getInlineStatementString = function() {
        
    };
    
    Label.prototype.getStatementString = function(ind, indentFirstLine) {
        
    };

    
    
    function LoopControl(o) {
        function setComments(a, _this) {
            if (a.comment) {
                _this.setComment(a.comment);
            }
            if (a.afterKeywordComment) {
                _this.setAfterKeywordComment(a.afterKeywordComment);
            }
            if (a.afterKeywordInlineComment) {
                _this.setAfterKeywordInlineComment(a.afterKeywordInlineComment);
            }
            if (a.afterLabelComment) {
                _this.setAfterLabelComment(a.afterLabelComment);
            }
            
            if (a.afterLabelInlineComment) {
                _this.setAfterLabelInlineComment(a.afterLabelInlineComment);
            }
            if (a.outerInlineComment) {
                _this.setOuterInlineComment(a.outerInlineComment);
            }
        }
        if (typeof o === 'string') {
            this.setLabel(o);
            if (arguments.length > 1) {
                var a = arguments[1];
                if (!(a instanceof IComment) && isPlainObject(a)) {
                    setComments(a, this);
                } else {
                    this.setComment(a);
                }
            }
        } else if (o instanceof IComment) {
            this.setComment(o);
        } else if (isPlainObject(o)) {
            if (o.label||o.Label) {
                this.setLabel(o);
                if (arguments.length > 1)
                    this.setComment(arguments[1]);
            } else if (hasOwnProp(o, 'comment')) {
                setComments(o, this);
            }
        }
    }

    LoopControl.prototype = new Statement();
    
    LoopControl.__CLASS__ = LoopControl;
    
    LoopControl.__CLASS_NAME__ = "LoopControl";
    
    LoopControl.prototype.__CLASS__ = LoopControl;
    
    LoopControl.prototype.__CLASS_NAME__ = "LoopControl";
    
    LoopControl.__SUPER__ = Statement;
    /**
     * 
     * @param {IComment|String} c
     * @returns {LoopControl}
     */
    LoopControl.prototype.setAfterKeywordInlineComment = function(c) {
        this._afterKeywordInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    LoopControl.prototype.getAfterKeywordInlineComment = function(c) {
        return this._afterKeywordInlineComment;
    };    
    /**
     * 
     * @param {IComment|String} c
     * @returns {LoopControl}
     */
    LoopControl.prototype.setAfterLabelInlineComment = function(c) {
        this._afterLabelInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    LoopControl.prototype.getAfterLabelInlineComment = function(c) {
        return this._afterLabelInlineComment;
    };
    /**
     * 
     * @param {IComment|String} c
     * @returns {LoopControl}
     */
    LoopControl.prototype.setAfterKeywordComment = function(c) {
        this._afterKeywordComment = IComment.getInstance(c);
        return this;
    };
    
    /**
     * 
     * @param {IComment|String} c
     * @returns {LoopControl}
     */
    LoopControl.prototype.setAfterKeywordComment = function(c) {
        this._afterKeywordComment = IComment.getInstance(c);
        return this;
    };
    
    /**
     * 
     * @param {IComment|String} c
     * @returns {LoopControl}
     */
    LoopControl.prototype.setAfterLabelComment = function(c) {
        this._afterLabelComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    LoopControl.prototype.getAfterLabelComment = function(c) {
        return this._afterLabelComment;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    LoopControl.prototype.getStatementString = function(ind, indentFirstLine) {
        var pref = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                pref += "    ";
            }
        }
        var lbl = this.getLabel(), space;
        if (lbl) {
            if (lbl.getInlineComment() || !lbl.getComment()) {
                space = " " ;
                indentFirstLine = false;
            } else {
                space = "\n" ;
                indentFirstLine = true;
            }
            lbl = space + lbl.toString(ind, indentFirstLine);
        }
        return pref + this.getStatement() + (lbl ? lbl : "");
    };
    /**
     * 
     * @returns {String}
     */
    LoopControl.prototype.getInlineStatementString = function() {
        var lbl = this.getLabel();
        return this.getStatement() + (lbl ? " " + lbl.toString(true) : "");
    };
    /**
     * 
     * @returns {Label}
     */
    LoopControl.prototype.getLabel = function() {
        return this._label;
    };
    /**
     * 
     * @param {Label|String} label
     * @returns {Break}
     */
    LoopControl.prototype.setLabel = function(label) {
        if (label instanceof Label) {
            this._label = label;
        } else if (typeof label === 'string') {
            if (!label) {
                throw new Error("Empty label string");
            }
            this._label = new Label(label);
        } else if (isPlainObject(label)) {
            this._label = new Label(label);
        } else {
            throw new Error("Incorrect arguments");
        }        
        return this;
    };
    /**
     * 
     * @abstract
     * @returns {String}
     */
    LoopControl.prototype.getStatement = function() {
        throw new Error('Abstract method');
    };
    
    
    
    /**
     * 
     * @param {type} o
     * @returns {Break}
     * @class
     */
    function Break(o) {
        LoopControl.apply(this, arguments);
    }
    
    
    Break.prototype = new LoopControl();
    
    Break.__CLASS__ = Break;
    
    Break.__CLASS_NAME__ = "Break";
    
    Break.prototype.__CLASS__ = Break;
    
    Break.prototype.__CLASS_NAME__ = "Break";
    
    Break.__SUPER__ = LoopControl;
    
    Break.prototype.__SUPER__ = LoopControl;
    /**
     * 
     * @returns {String}
     */
    Break.prototype.getStatement = function() {
        return 'break';
    };
    
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Break.prototype.setAfterBreakInlineComment = LoopControl.prototype.setAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Break.prototype.getAfterBreakInlineComment = LoopControl.prototype.getAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Break.prototype.setAfterBreakComment = LoopControl.prototype.setAfterKeywordComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Break.prototype.getAfterBreakComment = LoopControl.prototype.getAfterKeywordComment;
    
    
    /**
     * 
     * @param {type} o
     * @returns {Break}
     * @class
     */
    function Continue(o) {
        LoopControl.apply(this, arguments);
    }
    
    
    Continue.prototype = new LoopControl();
    
    Continue.__CLASS__ = Continue;
    
    Continue.__CLASS_NAME__ = "Continue";
    
    Continue.prototype.__CLASS__ = Continue;
    
    Continue.prototype.__CLASS_NAME__ = "Continue";
    
    Continue.__SUPER__ = LoopControl;
    
    Continue.prototype.__SUPER__ = LoopControl;
    
    /**
     * 
     * @returns {String}
     */
    Continue.prototype.getStatement = function() {
        return 'continue';
    };
    
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Continue.prototype.setAfterBreakInlineComment = LoopControl.prototype.setAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Continue.prototype.getAfterBreakInlineComment = LoopControl.prototype.getAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Continue.prototype.setAfterBreakComment = LoopControl.prototype.setAfterKeywordComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Continue.prototype.getAfterBreakComment = LoopControl.prototype.getAfterKeywordComment;
    
    
    
    /**
     * 
     * @param {Object|Func|Class|Expression|Number|Boolean|Date|String} o
     * @class
     */
    function Return(o) {
        if (o instanceof Expression || (o instanceof StatementElt && o.isExpression())) {
            this.setValue(o);
            if (arguments.length > 1)
                this.setComment(arguments[1]);
        } else if (o instanceof IComment) {
            this.setComment(o);
        } else {
            this.setValue(o);
            if (arguments.length > 1)
                this.setComment(arguments[1]);
        }
    }

    Return.prototype = new Statement();
    /**
     * 
     * @returns {String}
     */
    Return.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        var _ind = ""; 
        if (inline)
            return _ind + "return " + (typeof this._value  === 'undefined' || this._value === null ? "" : this._value.toString());
        var s = "";
        if (indentFirstLine) {                    
            for (var k = 0; k < ind; k++) {
                _ind += "    ";
            }

        }
        s += _ind + "return";

        if (this._value) {
            s += " " + this._value.toString(ind, false);
        }

        return s;
    };
    /**
     * 
     * @returns {Conditional|QString|Value|Undefined.UNDEFINED|Null.__UNDEFINED__@new;Undefined|Bool|Ar
     * @returns {Conditional|Value|AnonymousFunction|Boolean|Null.__NULL__@new;Null|Undefined.UNDEFINED|Null.NULL|Assign|AutoIncrement|QString|Instantiation|ArrowFunction|Bool|VArray|e.value|VObject|Numeric|Invocation|Reference|UnaryOperation|Undefined.Undefined|Null.__UNDEFINED__@new;Undefined|type|Index|Null.__NULL__.Null|Null.Null|NamedFunction|Grouping|LROperation|OCRef}rowFunction|Assign|AutoIncrement|Numeric|OCRef|Boolean|Grouping|Invocation|Index|LROperation|UnaryOperation|VObject|e.value|type|Null.NULL|Null.__NULL__@new;Null|NamedFunction|Reference|AnonymousFunction|Instantiation|VArray}
     */
    Return.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {type} o
     * @returns {Return}
     */
    Return.prototype.setValue = function(o) {
        if (o instanceof Class || o instanceof Func || o instanceof Expression) {
            this._value = o;
        } else if (isPlainObject(o)) {
            this._value = Expression.getInstance(o);
        } else if (isArray(o)) {
            this._value = new VArray(o);
        } else {
            this._value = Expression.getInstance(o);
        }
        return this;
    };
    /**
     * 
     * @param {type} c
     * @returns {ConditionBlock}
     * @class
     */
    function ConditionBlock(c) {
        var e = c.expression||c.condition;
        if (e) {
            if (!(e instanceof Expression)) {
                e = Expression.getInstance(e);
            }
            this._expression = e;
            if (c.comment) {
                this.setComment(c.comment);
            }
            if (c.inlineComment) {
                this.setInlineComment(c.inlineComment);
            }
            if (c.innerComment) {
                this.setInnerComment(c.innerComment);
            }
            if (c.endComment) {
                this.setEndComment(c.endComment);
            }
            if (c.inlineEndComment) {
                this.setInlineEndComment(c.inlineEndComment);
            }
            if (c.outerInlineComment) {
                this.setOuterInlineComment(c.outerInlineComment);
            }
            if (c.outerComment) {
                this.setOuterComment(c.outerComment);
            }
        } else {
            this._expression = Expression.getInstance(c);
        }
    }
    ConditionBlock.prototype = new StatementElt();
    /**
     * 
     * @returns {Expression}
     */
    ConditionBlock.prototype.getExpression = function() {
        return this._expression;
    };
    /**
     * 
     * @param {type} e
     * @returns {ConditionBlock}
     */
    ConditionBlock.prototype.setExpression = function(e) {
        this._expression = Expression.getInstance(e);
        return this;
    };
    
    /**
     * 
     * @returns {Expression}
     */
    ConditionBlock.prototype.getOuterComment = function() {
        return this._outerComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {ConditionBlock}
     */
    ConditionBlock.prototype.setOuterComment = function(c) {
        this._outerComment = c;
        return this;
    };
    
    
    /**
     * 
     * @param {IComment} c
     * @returns {ConditionBlock}
     */
    ConditionBlock.prototype.setOuterComment = function(c) {
        this._outerComment = c;
        return this;
    };
    
    /**
     * 
     * @returns {Expression}
     */
    ConditionBlock.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {ConditionBlock}
     */
    ConditionBlock.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = c;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ConditionBlock.prototype.getInlineString = function() {
        var str = "";
        if (this._comment) {
            str += this._comment.getInlineString();
        }
        if (this._inlineComment) {
            str += " " + this._inlineComment.getInlineString();
        }
        str += " " + this._expression ? this._expression.toString(true) : "";
        if (this._inlineEndComment) {
            str += " " + this._inlineEndComment.getInlineString();
        }
        
        if (this._endComment) {
            str += " " + this._endComment.getInlineString();
        }
        return str;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    ConditionBlock.prototype.getString = function(ind, indentFirstLine) {
        var str = "", _inline = false;
        if (this._comment) {
            str += this._comment.toString(ind, indentFirstLine);
            indentFirstLine = true;
        }
        if (this._inlineComment) {
            str += (str ? "\n" : "" ) + this._inlineComment.getInlineString();
            indentFirstLine = false;
            _inline = true;
        }
        str += this._expression ? (_inline ? " " : (str ? "\n": "")) + this._expression.toString(ind, indentFirstLine) : "";
        if (this._inlineEndComment) {
            str += " " + this._inlineEndComment.getInlineString();
        }
        
        if (this._endComment) {
            str += "\n" + this._endComment.toString(ind, true);
        }
        return str;
    };
    /**
     * 
     * @returns {String}
     */
    ConditionBlock.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }
       if (inline) {
           return this.getInlineString();
       }
       return this.getString(ind, indentFirstLine);
    };
    /**
     * 
     * @param {type} c
     * @returns {ConditionBlock}
     */
    ConditionBlock.getInstance = function(c) {
        return c instanceof ConditionBlock ? c: new ConditionBlock(c);
    };
    /**
    * 
    * @param {type} o
    * @returns {IfCase}
    */
   function IfCase(o) {
       if (arguments.length > 1) {
           this._condition = Expression.getInstance(arguments[0]);
           this._statement = Statement.getInstance(arguments[1]);
       } else if (isPlainObject(o)) {
           var c = o.condition||o.Condition;
            if (c.condition||c.expression) {
                this._condition = ConditionBlock.getInstance(c);
            } else {
                this._condition = Expression.getInstance(c);
            }
           this._statement = Statement.getInstance(o.body||o.Body||o.statement||o.Statement||o.statements||o.Statements);
       } else if (arguments.length === 0) {
           this._condition = null;
           this._statement = null;
       } else {
           incorrectArgs(); //throw "Incorrect arguments";
       }
   }
   
   
   /**
    * 
    * @type IfCase
    * @meta
    */
   IfCase.__CLASS__ = IfCase;
   /**
    * 
    * @type String
    * @meta
    */
   IfCase.__CLASS_NAME__ = "IfCase";
   /**
    * 
    * @type IfCase
    * @meta
    */
   IfCase.prototype.__CLASS__ = IfCase;
   /**
    * 
    * @type String
    * @meta
    */
   IfCase.prototype.__CLASS_NAME__ = "IfCase";

   /**
    * 
    * @returns {StatementElt}
    */
   IfCase.prototype.getCondition = function() {
       return this._condition;
   };
   /**
    * 
    * @param {type} s
    * @returns {IfCase}
    */
   IfCase.prototype.setCondition = function(s) {
       this._condition = Expression.getInstance(s);
       return this;
   };
   
   /**
    * 
    * @returns {Expression}
    */
   IfCase.prototype.getBooleanExpression = function() {
       return this._condition instanceof Expression ? this._condition : this._condition ?  this._condition.getExpression() : null;
   };
   /**
    * 
    * @param {type} e
    * @returns {IfCase}
    */
   IfCase.prototype.setBooleanExpression = function(e) {
       if (this._condition instanceof ConditionBlock) {
           this._condition.setExpression(Expression.getInstance(e));
       } else {
           this._condition = Expression.getInstance(e);
       }
       return this;
   };
   /**
    * 
    * @type IfCase.prototype.getBooleanExpression
    */
   IfCase.prototype.getConditionExpression = IfCase.prototype.getBooleanExpression;

   /**
    * 
    * @returns {StatementElt}
    */
   IfCase.prototype.getStatement = function() {
       return this._statement;
   };
   /**
    * 
    * @param {type} s
    * @returns {IfCase}
    */
   IfCase.prototype.setStatement = function(s) {
       this._statement = Statement.getInstance(s);
       return this;
   };

   IfCase.prototype.getBody = IfCase.prototype.getStatement;

   IfCase.prototype.setBody = IfCase.prototype.setStatement;

   /**
    * 
    * @returns {String}
    */
   IfCase.prototype.toString = function() {
       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }

       var s = "";
       if (inline) {
           s += "if (" + ( this._condition ? this._condition.toString(true) : "") + ")";

           s += this._statement ? " " + this._statement.toString(true) : "";

       } else {
           var _ind = "";
           for (var k = 0; k < ind; k++) {
               _ind += "    ";
           }
           if (this._comment) {
               s += (indentFirstLine ? _ind : "") + this._comment.toString(ind, false) + "\n";
               indentFirstLine = true;
           }
           if (this._inlineComment) {
               s += (indentFirstLine ? _ind : "") + this._inlineComment.toString(ind, false);
               if (this._inlineComment instanceof Comment && this._inlineComment.isSingleLine()) {
                   indentFirstLine = true;
               } else {
                   indentFirstLine = false;
               }               
           }
           s += (indentFirstLine ? _ind : "") + "if (" + ( this._condition ? this._condition.toString(true) : "") + ")";

           s += this._statement instanceof Block ? ( " " + this._statement.toString(ind, false)) 
               : (this._statement ? "\n" + this._statement.toString(ind + 1, true) : "");
       }
       return s;
   };
   /**
    * 
    */
   Object.defineProperties(IfCase.prototype, {
       condition : { get: IfCase.prototype.getCondition, set: IfCase.prototype.setCondition },
       booleanExpression: { get: IfCase.prototype.getBooleanExpression, set: IfCase.prototype.setBooleanExpression },
       boolExpression: { get: IfCase.prototype.getBooleanExpression, set: IfCase.prototype.setBooleanExpression },
       "statement" : { get: IfCase.prototype.getStatement, set: IfCase.prototype.setStatement },
       "body" : { get: IfCase.prototype.getBody, set: IfCase.prototype.setBody }
   });



   function If(o) {
       var n = arguments.length,s, c, cases;
       if (n === 2) {
           var a = arguments[0];
           this._cases = [];
           if (a instanceof IfCase) {
               this._cases[this._cases.length] = a;
           } else if (a.hasOwnProperty("condition") && (a.hasOwnProperty("statement") || a.hasOwnProperty("statements"))) {
               this._cases[this._cases.length] = new IfCase(a);
           } else if (!isArray(a) || a.length === 0) {
               incorrectArgs(); //throw "Incorrect arguments"; 
               n = a.length;

           }                    
           this._else = Statement.getInstance(arguments[1]);
       } else if (n > 2) {
           this._cases = [];
           var i = 0;
           while ( i < n) {
               c = arguments[i];
               if (c instanceof IfCase) {
                   this._cases[this._cases.length] = c;
                   i++;
               } else if (c instanceof Expression || (c instanceof StatementElt && c.isExpression && c.isExpression())) {
                   if (i + 1 < n) {
                       s = arguments[i + 1];
                       if (s instanceof Statement || (s instanceof StatementElt && s.isStatement && s.isStatement())) {
                           this._cases[this._cases.length] = new IfCase(c, s);
                       } else {
                           incorrectArgs();
                       }
                       i += 2;
                   } else if (c instanceof Statement || (c instanceof StatementElt && c.isStatement && c.isStatement())) {
                       this._else = c;
                       i++;
                   }
               } else if (isArray(c)) {
                   this._cases[this._cases.length] = new IfCase(c[0], c[1]);
                   i++;
               } else if (isPlainObject(c)) {
                   if (c.hasOwnProperty("condition") && (c.hasOwnProperty("statement") || c.hasOwnProperty("statements"))) {
                       this._cases[this._cases.length] = new IfCase(c.condition, c.statement||c.statements);
                       i++;
                   } else if (c.hasOwnProperty("statement") || c.hasOwnProperty("statements")) {
                       if (i + 1 < n) {
                           incorrectArgs();
                       }
                       this._else = Statement.getInstance(c);
                       i++;
                   } else {
                       incorrectArgs();
                   }
               }
           }
       } else if (o instanceof IfCase) {
           this._cases = [o];
           this._else = null;
       } else if (isArray(o)) {

       } else if (isPlainObject(o)) {
           this._cases = [];
           cases = o.cases||o.Cases;
           n = cases.length;
           for (var i = 0; i < n; i++) {
               c =  cases[i];
               this._cases[i] = c instanceof IfCase ? c : new IfCase(c);
           }
           s = o.else||o.Else||o.others||o.Others||o.other||o.Other||o.default||o.Default;
           this._else = s ? Statement.getInstance(s) : null;
       }  else if (n === 0) {
           this._cases = null;
           this._else = null;
       } else {
           incorrectArgs(); //throw "Incorrect arguments";
       }
   }

   If.prototype = new Statement();

   If.__CLASS__ = If;

   If.__CLASS_NAME__ = "If";

   If.prototype.__CLASS__ = If;

   If.prototype.__CLASS_NAME__ = "If";
   /**
    * 
    * @returns {Array}
    */
   If.prototype.getCases = function() {
       return this._cases? [] : [].slice.call(this._cases);
   };
   /**
    * 
    * @param {Array} cases
    * @returns {If}
    */
   If.prototype.setCases = function(cases) {
       this._cases = [];
       if (!isArray(cases)) {
           incorrectArgs();
       }
       for (var i = 0, n = cases.length, c; i < n; i++) {
           c =  cases[i];
           this._cases[i] = c instanceof IfCase ? c: new IfCase(c);
       }
       return this;
   };
   /**
    * 
    * @returns {Switch|Import|Try|Continue|NamedFunction|AnonymousFunction|LStatement|Throw|Invocation|While|ForIn|For|Instantiation|With|Block|ArrowFunction|Break|Declaration|Export|DoWhile|ForOf|Class|Return|If}
    */
   If.prototype.getElse = function() {
       return this._else;
   };
   /**
    * 
    * @param {Statement|Expression|Object} e
    * @returns {If}
    */
   If.prototype.setElse = function(e) {
       this._else = Statement.getInstance(e);
       return this;
   };
   /**
    * 
    * @returns {Number}
    */
   If.prototype.getCasesCount = function() {
       return this._cases ? this._cases.length : 0;
   };
   /**
    * 
    * @param {type} i
    * @returns {Array}
    */
   If.prototype.getCase = function(i) {
       return this._cases[i];
   };
    /**
     * 
     * @returns {String}
     */
    If.prototype.getInlineStatementString = function() {
        var _case = this._cases[0], s = "";
        s += _case.toString(true);
        for (var k = 1, len = this._cases.length; k < len; k++) {
            _case = this._cases[k];
            s += " else " + _case.toString(true);
        }
        if (this._else) {
            s += " else " + this._else.toString(true);
        }
        return s;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    If.prototype.getStatementString = function(ind, indentFirstLine) {
        var _case = this._cases[0], s = "";                 
        var _ind = "";
        for (var k = 0; k < ind; k++) {
            _ind += "    ";
        }
        s += _case.toString(ind, indentFirstLine);
        for (var k = 1, len = this._cases.length; k < len; k++) {
            _case = this._cases[k];
            s += "\n" + _ind  + "else " + _case.toString(ind, false);
        }
        if (this._else) {
            s += "\n" + _ind  + "else " + this._else.toString(ind, false);
        }
        return s;
    };   

    Object.defineProperties(If.prototype, {
        cases : { get: If.prototype.getCases, set: If.prototype.setCases },
        ifs : { get: If.prototype.getCases, set: If.prototype.setCases },
        "else" : { get: If.prototype.getElse, set: If.prototype.setElse },
        "others" : { get: If.prototype.getElse, set: If.prototype.setElse },
        "other" : { get: If.prototype.getElse, set: If.prototype.setElse }
    });



   /**
    * 
    * @returns {ACase}
    * @asbtract
    * @class
    */
   function ACase() {

   }

   /**
    * 
    * @returns {ACase}
    */
   ACase.__CLASS__ = ACase;

   ACase.__CLASS_NAME__ = "ACase";

   ACase.prototype.__CLASS__ = ACase;

   ACase.prototype.__CLASS_NAME__ = "ACase";

   /**
    * 
    * @returns {Array&lt;StatementElt&gt;|Block}
    */
   ACase.prototype.getStatements = function() {
       return this._statements;
   };
   /**
    * 
    * @param {Block} b
    * @returns {Block}
    * @throws Error  When the break statement is not the last statement or the argument is not a block.
    */
   ACase.checkBlock = function(b) {
       if (!(b instanceof Block)) {
           throw new Error("The argument must be a block statement");
       }
       var s = isArray(b) ? b : b.getStatements(), _s;
       for (var i = 0, n = s.length; i < n; i++) {
           _s = Statement.getInstance(s[i]);
           if ((_s instanceof Break || _s instanceof Return) && (i < n - 1)) {
               throw new Error("The break statement must be the last statement");
           }
       }
       return b;
   };
   ACase.prototype.addStatement = function(s) {
       var _s = Statement.getInstance(s);
       if (!this._statements) {
           this._statements = _s instanceof Block ? _s : [_s];
       } else if (this._statements instanceof Block) {
           throw new Error("Not allowed to add case statement");
       } else {
           this._statements[this._statements.length] = _s;
       }
       return this;
   };
   /**
    * 
    * @param {Array|Block|Statement|StatementElt} s
    * @returns {ACase}
    */
   ACase.prototype.setStatements = function(s) {
       if (typeof s === 'undefined' || s === null) {
           this._statements = [];
       } else if (isArray(s)) {                    
           var _s;
           if (s.length === 1) {
               _s = Statement.getInstance(s);
               if (_s instanceof Block) {
                   this._statements = ACase.checkBlock(_s);
               } else {
                   this._statements = [_s];
               }
           } else {
               this._statements = [];
               for (var i = 0, n = s.length; i < n; i++) {
                   _s = Statement.getInstance(s[i]);
                   if (_s instanceof Block) {
                       incorrectArgs();
                   } else if ((s instanceof Break || s instanceof Return) && (i < n - 1)) {
                       throw new Error("The break statement must be the last statement");
                   }
                   this._statements[i] = _s;
               }
           }
       } else if (s instanceof Block) {
           this._statements = s;
       } else if (isPlainObject(s)) {
           var _s = Statement.getInstance(s);
           this._statements = _s instanceof Block? ACase.checkBlock(_s) : [_s ];
       }
       return this;
   };

   ACase.prototype.getBody = ACase.prototype.getStatements;

   ACase.prototype.setBody = ACase.prototype.setStatements;






   /**
    * 
    * @param {type} s
    * @returns {DefaultCase}
    * @class
    */
   function DefaultCase(s) {
       if (s instanceof Block || isPlainObject(s) || isArray(s)) {
           this.setBody(s);
       }
   }



   /**
    * 
    * @type ACase
    */
   DefaultCase.prototype = new ACase();
   /**
    * 
    * @returns {DefaultCase}
    */
   DefaultCase.__CLASS__ = DefaultCase;

   DefaultCase.__CLASS_NAME__ = "DefaultCase";

   DefaultCase.prototype.__CLASS__ = DefaultCase;

   DefaultCase.prototype.__CLASS_NAME__ = "DefaultCase";

   DefaultCase.checkBlock = ACase.checkBlock;
   /**
    * 
    * @param {type} o
    * @returns {Case}
    */
   function Case(o) {
       if (arguments.length > 1) {
           this.setValue(arguments[0]);
           this.setStatements(arguments[1]);
       } else if (isPlainObject(o)) {
           this.setValue(o.value||o.Value);
           this.setStatements(o.body||o.Body||o.statement||o.Statement||o.statements||o.Statements);
       } else if (arguments.length === 0) {
           this._value = null;
           this._statements = null;
       } else {
           incorrectArgs(); //throw "Incorrect arguments";
       }
   }
   
   Case.prototype = new ACase();
   Case.__CLASS__ = Case;

   Case.__CLASS_NAME__ = "Case";

   Case.prototype.__CLASS__ = Case;

   Case.prototype.__CLASS_NAME__ = "Case";

   Case.checkBlock = ACase.checkBlock;

   /**
    * 
    * @returns {StatementElt}
    */
   Case.prototype.getValue = function() {
       return this._value;
   };
   /**
    * 
    * @param {Value|Number|String|Object} value
    * @returns {Case}
    */
   Case.prototype.setValue = function(value) {
       var v =  Expression.getInstance(value);
       if (v instanceof StatementElt) {
           if (!value.isValue()) {
               incorrectArg(); //throw "Incorrect argument";
           }
       } else if (typeof v === 'number' || v instanceof Number) {
           v = new Numeric(v);
       } else if (typeof v === 'boolean' || v instanceof Boolean) {
           v = new Bool(v);
       } else if ((typeof v === 'string' ||  v instanceof String) || ( v instanceof Date)) {
           v = new Value(v);
       } else {
           //TODO
           notSupported(); //throw "Incorrect argument";
       }
       this._value = v;
       return this;
   };
   /**
    * 
    * @param {Switch} s
    * @returns {Case}
    */
   Case.prototype.setSwitch = function(s) {
       this._switch = s;
       return this;
   };
   /**
    * 
    * @returns {Switch}
    */
   Case.prototype.getSwitch = function() {
       return this._switch;
   };



   /**
    * 
    * @returns {s}
    */
   Case.prototype.toString = function() {
       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }


       if (inline) {
           s += "if (" + ( this._value ? this._value.toString(true) : "") + ")";

           s += this._statement ? " " + this._statement.toString(true) : "";

       } else {
           var _ind = "", s = "";
           for (var k = 0; k < ind; k++) {
               _ind += "    ";
           }
           s += (indentFirstLine ? _ind : "") + "case " + ( this._value ? this._value.toString(true) : "") + ":";
           if (this._statements instanceof Block) {
               s +=   " " + this._statement.toString(ind, false);
           } else if (isArray(this._statements)) {
               for (var k = 0, len = this._statements.length; k < len; k++ ) {
                   s += "\n" + this._statements[k].toString(ind + 1, true);
               }
           }
       }
       return s;
   };
   /**
    * 
    * @param {Object} c
    * @returns {Boolean}
    */
   Case.isCaseObject = function(c){
       return isPlainObject(c) && c.hasOwnProperty("value") 
               && (c.hasOwnProperty("statement") 
               || c.hasOwnProperty("statements") 
               || c.hasOwnProperty("body") 
               || c.hasOwnProperty("block"));
   };

   Object.defineProperties(Case.prototype, {
       value : { get: Case.prototype.getValue, set: Case.prototype.setValue },
       "statements" : { get: Case.prototype.getStatements, set: Case.prototype.setStatements },
       "body" : { get: Case.prototype.getBody, set: Case.prototype.setBody }
   });



   function Switch(o) {
       var n = arguments.length,s, c, cases;
       if (n === 3) {
           this.setExpression(arguments[0]);
           var a = arguments[1];                    
           if (a instanceof Case) {
               this._cases = [c = a];
               c.setSwitch(this);
           } else if (a.hasOwnProperty("value") && (a.hasOwnProperty("statement") || a.hasOwnProperty("statements") || a.hasOwnProperty("body"))) {
               this._cases = [c = new Case(a)];
               c.setSwitch(this);
           } else if (!isArray(a) || a.length === 0) {
               incorrectArgs(); //throw "Incorrect arguments"; 
               n = a.length;
               this._cases = [];
               for (var i = 0; i < n; i++) {
                   this._cases[i] = c = Case.getInstance(a[i]);
                   c.setSwitch(this);
               }
           }                    
           this.setDefault(arguments[1]);
       } else if (n > 3) {
           this.setExpression(arguments[0]);
           this._cases = [];
           var i = 1, end = n - 1;
           while ( i < end) {
               c = arguments[i];
               if (c instanceof Case) {
                   c.setSwitch(this);
                   this._cases[this._cases.length] = c;
                   i++;
               } else if (c instanceof Expression || (c instanceof StatementElt && c.isExpression && c.isExpression())) {
                   if (i + 1 < n) {
                       s = arguments[i + 1];
                       if (s instanceof Statement || (s instanceof StatementElt && s.isStatement && s.isStatement())) {
                           this._cases[this._cases.length] = c = new Case(c, s);
                           c.setSwitch(this);
                       } else {
                           incorrectArgs();
                       }
                       i += 2;
                   } else if (c instanceof Statement || (c instanceof StatementElt && c.isStatement && c.isStatement())) {
                       this._default = c;
                       i++;
                   }
               } else if (isArray(c)) {
                   this._cases[this._cases.length] = c = new Case(c[0], c[1]);
                   c.setSwitch(this);
                   i++;
               } else if (Case.isCaseObject(c)) {
                   this._cases[this._cases.length] = c = new Case(c.value, c.statement||c.statements||c.body||c.block);
                   c.setSwitch(this);
                   i++;
               } else {
                   incorrectArgs();
               }
           }
           c = arguments[n - 1];
           if (c instanceof Statement || c instanceof Expression) {
               this.setDefault(c);
           } else if (c instanceof Case) {
               this._cases[this._cases.length] = c;
           } else if (Case.isCaseObject(c)) {
               this._cases[this._cases.length] = c = new Case(c.value, c.statement||c.statements||c.body||c.block);
               c.setSwitch(this);
               i++;
           } else if (isArray(c)) {
               if (c.length === 2 && ['number', 'qstring', 'string', 'int', 'integer', 'float', 'value'].indexOf(c[0].type) >= 0) {
                   this._cases[this._cases.length] = c = new Case(c[0], c[1]);
                   c.setSwitch(this);
               } else {
                   this.setDefault(c);
               }
           } else if (isPlainObject(c)) {
               this.setDefault(c);
           } else {
               incorrectArgs();
           }
       } else if (o instanceof Case) {
           o.setSwitch(this);
           this._cases = [o];
           this._default = null;
       } else if (isArray(o)) {

       } else if (isPlainObject(o)) {
           this.setExpression(o.expression);
           this._cases = [];
           cases = o.cases||o.Cases;
           n = cases.length;
           for (var i = 0; i < n; i++) {
               c =  cases[i];
               if (!(c instanceof Case)) {
                    c = new Case(c);
                }
                c.setSwitch(this);
                this._cases[i] = c;
           }
           s = o.else||o.Else||o.others||o.Others||o.other||o.Other||o.default||o.Default;
           this._default = s ? Statement.getInstance(s) : null;
       }  else if (n === 0) {
           this._cases = [];
           this._default = null;
       } else {
           incorrectArgs(); //throw "Incorrect arguments";
       }
   }

   Switch.prototype = new Statement();

   Switch.__CLASS__ = Switch;

   Switch.__CLASS_NAME__ = "Switch";

   Switch.prototype.__CLASS__ = Switch;

   Switch.prototype.__CLASS_NAME__ = "Switch";

    /**
     * 
     * @returns {Expression}
     */
    Switch.prototype.getExpression = function() {
        return this._expression;
    };
    
    /**
     * 
     * @param {Expression|Object} e
     * @returns {Switch.prototype}
     */
    Switch.prototype.setExpression = function(e) {
        this._expression = Expression.getInstance(e);
        return this;
    };
   /**
    * 
    * @returns {Array}
    */
   Switch.prototype.getCases = function() {
       return this._cases? [] : [].slice.call(this._cases);
   };
   /**
    * 
    * @param {Array} cases
    * @returns {Switch}
    */
   Switch.prototype.addCases = function(cases) {
       if (!isArray(cases)) {
           incorrectArgs();
       }
       for (var i = 0, n = cases.length, c; i < n; i++) {
           c =  cases[i];
           if (!(c instanceof Case)) {
               c = new Case(c);
           }
           c.setSwitch(this);
           this._cases[i] = c;           
       }
       return this;
   };
    /**
     * 
     * @param {type} c
     * @returns {Switch}
     */
    Switch.prototype.addCase = function(c) {
        if (!(c instanceof Case)) {
            c = new Case(c);
        }
        c.setSwitch(this);
        this._cases[this._cases.length] = c;
        return this;
    };
    /**
     * 
     * @param {Case|Object} c
     * @returns {Switch}
     */
    Switch.prototype.add = function(c) {
        if (arguments.length === 0) {
            return this;
        }
        if (arguments.length > 1) {
            c = Array.prototype.slice.call(arguments);
        }
        return isArray(c) ? this.addCases(c) : this.addCase(c);
    };
    /**
    * 
    * @param {Array} cases
    * @returns {Switch}
    */
   Switch.prototype.setCases = function(cases) {
       this._cases = [];
       return this.addCases(cases);
   };
   /**
    * 
    * @returns {Switch|Import|Try|Continue|NamedFunction|AnonymousFunction|LStatement|Throw|Invocation|While|ForIn|For|Instantiation|With|Block|ArrowFunction|Break|Declaration|Export|DoWhile|ForOf|Class|Return|Switch}
    */
   Switch.prototype.getDefault = function() {
       return this._default;
   };
   /**
    * Sets the default case statements.
    * @param {Statement|Expression|Array|Object} d The default case statements
    * @returns {Switch}
    */
   Switch.prototype.setDefault = function(d) {
       if (d instanceof DefaultCase) {
           this._default = d;
       } else if (isArray(d)) {
           var s, last = d.length - 1, def = [];
           for (var i = 0, n = d.length; i < n; i++) {
               s = Statement.getInstance(d[i]);
               if ((s instanceof Break || s instanceof Return) && (i < last)) {
                   throw new Error("Incorrect argument");
               }
               def[i] = s;
           }
           this._default = new DefaultCase(def);
       } else {
           this._default = new DefaultCase(d instanceof Block ? Case.checkBlock(d) : d ? Statement.getInstance(d) : null);
       }
       return this;
   };
   /**
    * 
    * @returns {Number}
    */
   Switch.prototype.getCasesCount = function() {
       return this._cases ? this._cases.length : 0;
   };
   /**
    * 
    * @param {type} i
    * @returns {Array}
    */
   Switch.prototype.getCase = function(i) {
       return this._cases[i];
   };
   /**
    * 
    * @returns {s}
    */
   Switch.prototype.toString = function() {
       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }


       var _case, s = "";

       if (inline) {
           s += "switch(";
           s += this._expression ? this._expression.toString(true) : "";
           s += ") {";
           for (var k = 0, len = this._cases.length; k <= len; k++) {
               _case = this._cases[k];
               s += " " + _case.toString(true);
           }
           if (this._default instanceof Block) {
               s += " default: " + this._default.toString(true);
           } else if (this._default && this._default.length > 0) {
               s += "default:" ;
               for (var k = 0, len = this._default.length; i < len; k++) {
                   s += this._default[k].toString(true);
               }
           }
           s += "\n" + _ind + "}"; 
       } else {
           var _ind = "", s = "";

           for (var k = 0; k < ind; k++) {
               _ind += "    ";
           }
           if (indentFirstLine) {
               s += _ind;
           }
           s += "switch(";
           s += this._expression ? this._expression.toString(true) : "";
           s += ") {";
           for (var k = 0, len = this._cases.length; k < len; k++) {
               _case = this._cases[k];
               s += "\n" + _ind  + _case.toString(ind + 1, true);
           }
           if (this._default instanceof Block) {
               s += "\n" + _ind  + "default: " + this._default.toString(ind, false);
           } else if (this._default && this._default.length > 0) {
               s += "\n" + _ind  + "default:" ;
               for (var k = 0, len = this._default.length; i < len; k++) {
                   s += "\n" + this._default[k].toString(ind + 1, true);
               }
           }
           s += "\n" + _ind + "}"; 
       }
       return s;
   };

   Object.defineProperties(Switch.prototype, {
       cases : { get: Switch.prototype.getCases, set: Switch.prototype.setCases },
       "default" : { get: Switch.prototype.getDefault, set: Switch.prototype.setDefault },
       "others" : { get: Switch.prototype.getDefault, set: Switch.prototype.setDefault },
       "other" : { get: Switch.prototype.getDefault, set: Switch.prototype.setDefault }
   });
  /**
   * 
   * @returns {Loop}
   *  @class
   *  @abstract
   */
  function Loop() {               
  }

  Loop.prototype = new Statement();

  /**
   * 
   * @returns {Loop}
   */
  Loop.__CLASS__ = Loop;
  /**
   * 
   * @type String
   */
  Loop.__CLASS_NAME__ = "Loop";
  /**
   * 
   * @returns {Loop}
   */
  Loop.prototype.__CLASS__ = Loop;
  /**
   * 
   * @type String
   */
  Loop.prototype.__CLASS_NAME__ = "Loop";
  /**
   * 
   * @returns {Invocation|Instantiation|ArrowFunction|NamedFunction|AnonymousFunction|If|For|ForIn|ForOf|While|DoWhile|Switch|Try|AutoIncrement|Block|Return|Break|Continue|LStatement|With}
   */
  Loop.prototype.getBody = function() {
      return this._body;
  };
  /**
   * 
   * @param {Block|Statement|StatementElt} body
   * @return {Loop}
   */
  Loop.prototype.setBody = function(body) {
       if (body instanceof Block || body instanceof Statement || (body instanceof StatementElt && body.isStatement())) {
           this._body = body;
       } else if (isArray(body)) {
           this._body = new Block(body);
       } else if (isPlainObject(body)) {
           this._body = Statement.getInstance(body);
       }
       return this;
  };


    /**
    * 
    * @class
    */
   function While() {
       if (arguments.length === 1) {
           var fo = arguments[0];
           this.setCondition(fo.condition||fo.criteria||fo.predicate||null);
           this.setBody(fo.body||fo.block||fo.statements||fo.statement);                    
       } else if (arguments.length > 1) {
           this.setCondition(arguments[0]);
           this.setBody(arguments[1]);
       }
   }

   While.prototype = new Loop();

   /**
   * 
   * @returns {While}
   */
  While.__CLASS__ = While;
  /**
   * 
   * @type String
   */
  While.__CLASS_NAME__ = "While";
  /**
   * 
   * @returns {While}
   */
  While.prototype.__CLASS__ = While;
  /**
   * 
   * @type String
   */
  While.prototype.__CLASS_NAME__ = "While";

   /**
    * 
    * @returns {String}
    */
   While.prototype.getSymbol = function() {
       return "while";
   };
   /**
    * 
    */
   While.prototype.getType = function() {
       return "while";
   };
   /**
    * 
    * @param {type} condition
    * @returns {While}
    */
   While.prototype.setCondition = function(c) {
        if (c.condition||c.expression) {
            this._condition = ConditionBlock.getInstance(c);
        } else {
            this._condition = Expression.getInstance(c);
        }
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   While.prototype.getCondition = function() {
       return this._condition;
   };


   While.prototype.toString = function() {

       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }

       var s = "", body = this.getBody();
       if (indentFirstLine) {
           for (var k = 0; k < ind; k++) {
               s += "    ";
           }
       }

       s += "while ("; 
       

       if (inline) {
           s += (this._condition ? this._condition.toString(true) : "") + ")";
           s += body ? " " + body.toString(true) : " {}";
           return s;
       }
       s += (this._condition ? this._condition.toString(ind, false) : "") + ")";
       if (body instanceof Block) {
           s += " " + body.toString(ind, false);
       } else {
           s += body ? "\n" + body.toString(ind + 1, true) : " {}";
       }

       return s;
   };
   /**
    * 
    * @class
    */
   function DoWhile() {
       if (arguments.length === 1) {
           var fo = arguments[0];
           this.setCondition(fo.condition||fo.criteria||fo.predicate||null);
           this.setBody(fo.body||fo.block||fo.statements||fo.statement);                    
       } else if (arguments.length > 1) {           
           this.setBody(arguments[0]);
           this.setCondition(arguments[1]);
       }
   }

   DoWhile.prototype = new Loop();

   /**
   * 
   * @returns {DoWhile}
   */
  DoWhile.__CLASS__ = DoWhile;
  /**
   * 
   * @type String
   */
  DoWhile.__CLASS_NAME__ = "DoWhile";
  /**
   * 
   * @returns {DoWhile}
   */
  DoWhile.prototype.__CLASS__ = DoWhile;
  /**
   * 
   * @type String
   */
  DoWhile.prototype.__CLASS_NAME__ = "DoWhile";

   /**
    * 
    * @returns {String}
    */
   DoWhile.prototype.getSymbol = function() {
       return "do-while";
   };
   /**
    * 
    */
   DoWhile.prototype.getType = function() {
       return "do-while";
   };
   /**
    * 
    * @param {type} c
    * @returns {DoWhile}
    */
   DoWhile.prototype.setCondition = function(c) {
        if (c.condition||c.expression) {
            this._condition = ConditionBlock.getInstance(c);
        } else {
            this._condition = Expression.getInstance(c);
        }
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   DoWhile.prototype.getCondition = function() {
       return this._condition;
   };


    DoWhile.prototype.toString = function() {

        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                if (inline) {
                    indentFirstLine = false;
                }
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }

        var s = "", body = this.getBody();      

        if (inline) {
            s += "do ";
            s += body instanceof Block ? body.toString(true) : (body ? "{" + body.toString(true) + "}" : "{}");
        } else {       
            var _ind = "";
            for (var k = 0; k < ind; k++) {
                 _ind += "    ";
             }
            if (indentFirstLine) {
                s += _ind;
            }
            s += "do ";
            if (body instanceof Block) {
                s += body.toString(ind, false);
            } else {
                s += body ? "{\n" + body.toString(ind + 1, true) + ("\n" + _ind + "}") : "{}";
            }
        }
        s += " while (" 
            + (this._condition ? this._condition.toString() : "") 
            + ")";

        return s;
    };
    
    function FControl() {
        
    }
    
    
    FControl.prototype = new StatementElt();
    
    FControl.__CLASS__ = FControl;
    
    FControl.__CLASS_NAME__ = "FControl";
    
    FControl.__SUPER_CLASS__ = StatementElt;
    
    FControl.prototype.__CLASS__ = FControl;
    
    FControl.prototype.__CLASS_NAME__ = "FControl";
    
    /**
     * 
     * @returns {IComment}
     */
    FControl.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
   /**
    * 
    * @param {IComment} comment
    * @returns {Block}
    */
   FControl.prototype.setOuterInlineComment = function(comment) {
       this._outerInlineComment = comment;
       return this;
   };
   
    
    function ForStatement() {
        
    }
    
    ForStatement.prototype = new Loop();
    
    ForStatement.__CLASS__ = ForStatement;
    
    ForStatement.__CLASS_NAME__ = "ForStatement";
    
    ForStatement.prototype.__CLASS__ = ForStatement;
    
    ForStatement.prototype.__CLASS_NAME__ = "ForStatement";
    /**
     * 
     * @returns {FControl}
     */
    ForStatement.prototype.getControl = function() {
        return this._control;
    };
    
    /**
     * 
     * @param {FControl} c
     * @returns {ForStatement}
     */
    ForStatement.prototype.setControl = function(c) {
        if (!(c instanceof FControl)) {
            throw new Error("Incorrect argument");
        }
        this._control = c;
        return this;
    };
    /**
     * 
     * @param {type} opts
     * @returns {NoCondition}
     * @class
     */
    function NoCondition(opts) {
        if (isPlainObject(opts)) {
            if (opts.comment) {
                this.setComment(opts.comment);
            }
            if (opts.inlineComment) {
                this.setInlineComment(opts.inlineComment);
            }

            if (opts.endComment) {
                this.setEndComment(opts.endComment);
            }
            if (opts.inlineEndComment) {
                this.setInlineEndComment(opts.inlineEndComment);
            }

            if (opts.outerInlineComment) {
                this.setOuterInlineComment(opts.outerInlineComment);
            }
        }
    }
    
    NoCondition.prototype = new StatementElt();
    
    NoCondition.__CLASS__ = NoCondition;
    
    NoCondition.__CLASS_NAME__ = "NoCondition";
    
    NoCondition.__SUPER_CLASS__ = StatementElt;
    
    NoCondition.prototype.__CLASS__ = NoCondition;
    
    NoCondition.prototype.__CLASS_NAME__ = "NoCondition";
    
    NoCondition.prototype.isTrue = function() {
        return true;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    NoCondition.prototype.getStatementString = function(ind, indentFirstLine) {
        return "";
    };
    /**
     * 
     * @returns {String}
     */
    NoCondition.prototype.getInlineStatementString = function() {
        return "";
    };
    
    
    
    /**
     * 
     * @returns {ForControl}
     * @class
     */
    function ForControl() {
        if (arguments.length === 1) {
           var fo = arguments[0];
           this.setInit(fo.init||fo.initialize||fo.initial||fo.initialStatement||fo.initialExpression||null);
           this.setCondition(fo.condition||fo.criteria||fo.predicate||null);
           this.setIncrement(fo.increment||fo.increase||fo.incrementStatement||fo.incrementExpression||null);
           if (isPlainObject(fo.comments)) {
               var comments = fo.comments;
                if (isPlainObject(comments.comment)) {
                    this.setComment(comments.comment);
                }
                if (isPlainObject(comments.inlineComment)) {
                    this.setInlineComment(comments.inlineComment);
                }
                if (isPlainObject(comments.endComment)) {
                    this.setEndComment(comments.endComment);
                }
                if (isPlainObject(comments.inlineEndComment)) {
                    this.setInlineEndComment(comments.inlineEndComment);
                }
                
                if (isPlainObject(comments.outerInlineComment)) {
                    this.setOuterInlineComment(comments.outerInlineComment);
                }
           } else if (isPlainObject(fo.comment)) {
               this.setComment(fo.comment);
           }
       } else if (arguments.length > 3) {
           this.setInit(arguments[0]);
           this.setCondition(arguments[1]);
           this.setIncrement(arguments[2]);
       }
    }
    
    ForControl.prototype = new FControl();
    
    ForControl.__CLASS__ = ForControl;
    
    ForControl.__CLASS_NAME__ = "ForControl";
    
    ForControl.__SUPER_CLASS__ = StatementElt;
    
    ForControl.prototype.__CLASS__ = ForControl;
    
    ForControl.prototype.__CLASS_NAME__ = "ForControl";
    
    /**
    * 
    * @param {type} init
    * @returns {ForControl}
    */
   ForControl.prototype.setInit = function(init) {
       this._init = init;
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   ForControl.prototype.getInit = function() {
       return this._init;
   };
   /**
    * 
    * @param {type} condition
    * @returns {ForControl}
    */
   ForControl.prototype.setCondition = function(condition) {
       if (!condition) {
           this._condition = new NoCondition();
       } else if (condition instanceof Expression) {
            this._condition = condition;
        } else if (!condition.type) {
            var c= condition.expression ? Expression.getInstance(condition.expression) :  new NoCondition();
            if (condition.comment) {
                c.setComment(condition.comment);
            }
            if (condition.inlineComment) {
                c.setInlineComment(condition.inlineComment);
            }
            if (condition.endComment) {
                c.setEndComment(condition.endComment);
            }
            if (condition.inlineEndComment) {
                c.setInlineEndComment(condition.inlineEndComment);
            }
            
            if (condition.outerInlineComment) {
                c.setOuterInlineComment(condition.outerInlineComment);
            }
            this._condition = c;
        } else {
            this._condition = Expression.getInstance(condition);
        }
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   ForControl.prototype.getCondition = function() {
       return this._condition;
   };
   /**
    * 
    * @param {type} i
    * @returns {ForControl}
    */
   ForControl.prototype.setIncrement = function(i) {
       this._increment = i;
       return this;
   };
   /**
    * 
    * @returns {type}
    */
   ForControl.prototype.getIncrement = function() {
       return this._increment;
   };
    
    
   
    
   /**
    * 
    * @class
    */
   function For() {
        if (arguments.length === 1) {
            var fo = arguments[0];
            if (fo.control) {
               this._control = new ForControl(fo.control);
            } else {
                this._control = new ForControl();
                this.setInit(fo.init||fo.initialize||fo.initial||fo.initialStatement||fo.initialExpression||null);
                this.setCondition(fo.condition||fo.criteria||fo.predicate||null);
                this.setIncrement(fo.increment||fo.increase||fo.incrementStatement||fo.incrementExpression||null);
            }
            this.setBody(fo.body||fo.block||fo.statements||fo.statement);  
            if (isPlainObject(fo.comments)) {
                var comments = fo.comments;
                 if (isPlainObject(comments.comment)) {
                     this.setComment(comments.comment);
                 }
                 if (isPlainObject(comments.inlineComment)) {
                     this.setInlineComment(comments.inlineComment);
                 }
                 if (isPlainObject(comments.endComment)) {
                     this.setEndComment(comments.endComment);
                 }
                 if (isPlainObject(comments.inlineEndComment)) {
                     this.setInlineEndComment(comments.inlineEndComment);
                 }

                 if (isPlainObject(comments.outerInlineComment)) {
                     this.setOuterInlineComment(comments.outerInlineComment);
                 }

                 if (isPlainObject(comments.afterKeywordComment)) {
                     this.setAterKeywordComment(comments.afterKeywordComment);
                 }
                 if (isPlainObject(comments.aterKeywordInlineComment)) {
                     this.setAterKeywordInlineComment(comments.aterKeywordInlineComment);
                 }
            } else if (isPlainObject(fo.comment)) {
                this.setComment(fo.comment);
            }
       } else if (arguments.length > 3) {
           this._control = new ForControl();
           this.setInit(arguments[0]);
           this.setCondition(arguments[1]);
           this.setIncrement(arguments[2]);
           this.setBody(arguments[3]);
       } else {
           this._control = new ForControl();
       }
   }

   For.prototype = new ForStatement();

   /**
   * 
   * @returns {For}
   */
  For.__CLASS__ = For;
  /**
   * 
   * @type String
   */
  For.__CLASS_NAME__ = "For";
  /**
   * 
   * @returns {For}
   */
  For.prototype.__CLASS__ = For;
  /**
   * 
   * @type String
   */
  For.prototype.__CLASS_NAME__ = "For";

   /**
    * 
    * @returns {String}
    */
   For.prototype.getSymbol = function() {
       return "for";
   };
   /**
    * 
    */
   For.prototype.getType = function() {
       return "for";
   };
   
    /**
     * 
     * @param {ForControl|Object} c
     * @returns {For}
     */
    For.prototype.setControl = function(c) {
        if (!(isPlainControl(c))) {
            throw new Error("Incorrect argument");
        }
        this._control = c instanceof ForControl ? c : new ForControl(c);
        return this;
    };
   /**
    * 
    * @param {type} init
    * @returns {For}
    */
   For.prototype.setInit = function(init) {
       this._control.setInit(init);
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   For.prototype.getInit = function() {
       return this._control.getInit();
   };
   /**
    * 
    * @param {type} condition
    * @returns {For}
    */
   For.prototype.setCondition = function(condition) {
       this._control.setCondition(condition);
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   For.prototype.getCondition = function() {
       return this._control.getCondition();
   };
   /**
    * 
    * @param {type} i
    * @returns {For}
    */
   For.prototype.setIncrement = function(i) {
       this._control.setIncrement(i);
       return this;
   };
   /**
    * 
    * @returns {type}
    */
   For.prototype.getIncrement = function() {
       return this._control.getIncrement();
   };
   /**
    * 
    * @returns {IComment}
    */
   For.prototype.getAterKeywordComment = function() {
       return this._control.getComment();
   };
   /**
    * 
    * @param {type} cmt
    * @returns {For}
    */
   For.prototype.setAterKeywordComment = function(cmt) {
       this._control.setComment(cmt);
       return this;
   };
   
   /**
    * 
    * @param {type} cmt
    * @returns {For}
    */
   For.prototype.setAterKeywordInlineComment = function(cmt) {
       this._control.setInlineComment(cmt);
       return this;
   };
   /**
    * 
    * @returns {IComment}
    */
   For.prototype.getAterKeywordInlineComment = function() {
       return this._control.getInlineComment();
   };
   /**
    * 
    * @returns {String}
    */
   For.prototype.toString = function() {

       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
               if (inline) {
                   indentFirstLine = false;
               }
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }

       var s = "", body = this.getBody();
       if (indentFirstLine) {
           for (var k = 0; k < ind; k++) {
               s += "    ";
           }
       }

       s += "for ("; 
       if (this._init) {
           s += this._init.toString();
       } 
       s += ";";
       s += (this._condition ? this._condition.toString() : "") 
               + ";" 
               + (this._increment ? this._increment.toString() : "") 
               + ")";

       if (inline) {
           s += body ? " " + body.toString(true) : " {}";
           return s;
       }

       if (body instanceof Block) {
           s += " " + body.toString(ind, false);
       } else {
           s += body ? "\n" + body.toString(ind + 1, true) : " {}";
       }

       return s;
   };

    /**
     * 
     * @param {String|Object} [v=""]
     * @returns {NVariable}
     */
    function NVariable(v) {
        if (typeof v === 'string') {
            this.setName(v);
        } else if (isPlainObject(v)) {
            this.setName(v.name||v.Name);
            var o = v.type||v.Type||v.dataType||v.DataType;
            if (o) {
                this.setType(o);
            }
            o = v.defaultValue||v.DefaultValue||v.value||v.Value||v.default||v.Default;
            if (o) {
                this.setDefaultValue(o);
            }
        } else if (arguments.length === 0) {
            this._name = "";
        } else {
            incorrectArg(); //throw new Error("Incorrect argument");
        }
        if (arguments.length > 1) {
            this.setDefaultValue(arguments[1]);
        }
    }
    
    NVariable.prototype = new StatementElt();
   
   
    NVariable.isValidName = function(name) {
        return typeof name === 'string' && !!/^[a-zA-Z$_][a-zA-Z$_]*$/.exec(name);
    };

    NVariable.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {type} name
     * @returns {NVariable.prototype}
     */
    NVariable.prototype.setName = function(name) {
        if (!NVariable.isValidName(name)) {
            throw new Error("Invalid name" + (typeof name === 'string' ? ": '" + name + "'" : ""));
        }
        this._name = name;
        return this;
    };

    NVariable.getInstance = function(v) {
        return  v instanceof NVariable ? fo.variable : new NVariable(v);
    };
    
    /**
     * 
     * @returns {type}
     */
    NVariable.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    /**
     * 
     * @param {type} defaultValue
     * @returns {NVariable}
     */
    NVariable.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    };

    /**
     * 
     * @returns {type}
     */
    NVariable.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @param {type} type
     * @returns {NVariable.prototype}
     */
    NVariable.prototype.setType = function(type) {
        this._type = SType.getInstance(type);
        return this;
    };

    Object.defineProperties(NVariable.prototype, { 
        'name' : { get :  NVariable.prototype.getName, set: NVariable.prototype.setName },
        'type' : { get :  NVariable.prototype.getType, set: NVariable.prototype.setType },
        'defaultValue' : { get :  NVariable.prototype.getDefaultValue, set: NVariable.prototype.setDefaultValue }
    });
    
    
    
    
    
    
    /**
     * 
     * @param {type} d
     * @returns {SDeclaration}
     * @class
     */
    function SDeclaration(d) {
        
        if (arguments.length > 1) {
            this.setDeclarator(arguments[0]);
            this._variable = arguments[1] instanceof NVariable ? arguments[1] : new NVariable(arguments[1]);
        } else if (typeof d === 'string') {
            this._variable = new NVariable(d);
        } else if (isPlainObject(d)) {
            this.setDeclarator(d.declarator||d.Declarator||d.declarationSymbol||d.DeclarationSymbol||d.statement||d.Statement||"");
            this._variable = new NVariable(d.variable||d.Variable||d.variableName||d.VariableName||d.name||d.Name);
        } else {
            this._declarator= "";
            this._variable = null;
        }
    } 
    
    SDeclaration.prototype = new StatementElt();
    /**
     * 
     * @returns {NVariable}
     */
    SDeclaration.prototype.getVariable = function() {
        return this._variable;
    };
    /**
     * 
     * @param {NVariable|String|Object} v
     * @returns {SDeclaration}
     */
    SDeclaration.prototype.setVariable = function(v) {
        this._variable = NVariable.getInstance(v);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    SDeclaration.prototype.getDeclarator = function() {
        return this._variable;
    };
    /**
    * 
    * @param {String} s
    * @returns ForOf
    */
   SDeclaration.prototype.setDeclarator = function(s) {
       if (typeof s !== 'string') {
           incorrectArg(); //throw "Incorrect argument";
       }
       if (['var', 'let', 'const', ''].indexOf(s) < 0) {
           throw new Error("Incorrect statement: '" + s + "'");
       }
       this._declarator =  s;
       return this;
   };
   
   SDeclaration.prototype.getStatementString = function(ind, indentFirstLine) {
       var s = "", decl = this._declarator||"";       
       if (indentFirstLine) {
           for (var i = 0; i < ind; i++) {
               s +=  "    ";
           }
       }
       s += decl ? decl + " " : "";
       s +=  this._variable ? this._variable.getName()||"" : "";
       
       return s;
   };
   /**
    * 
    * @param {Number} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   SDeclaration.prototype.getInlineStatementString = function(ind, indentFirstLine) {
       var s = "", decl = this._declarator||"";       
       s += decl ? decl + " " : "";
       s +=  this._variable ? this._variable.getName()||"" : "";       
       return s;
   };

    
    
    
    
    /**
     * 
     * @returns {ForInControl}
     */
    function ForInControl() {
        
    }
    
    ForInControl.prototype = new FControl();
    
    ForInControl.__CLASS__ = ForInControl;
    
    ForInControl.__CLASS_NAME__ = "ForInControl";
    
    ForInControl.__SUPER_CLASS__ = StatementElt;
    
    ForInControl.prototype.__CLASS__ = ForInControl;
    
    ForInControl.prototype.__CLASS_NAME__ = "ForInControl";
    
    

     /**
     * 
     * @returns {String}
     */
    ForInControl.prototype.getDeclaration = function() {
        return this._declaration;
    };
    /**
     * 
     * @param {SDeclaration|Object} d
     * @returns {ForInControl}
     */
    ForInControl.prototype.setDeclaration = function(d) {
        this._declaration = arguments.length > 1 
            ? new SDeclaration(d, arguments[1]) 
            : d instanceof SDeclaration ? d : new SDeclaration(d);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ForInControl.prototype.getDeclarator = function() {
        return this._declaration ? this._declaration.getDeclarator() : undefined;
    };
    /**
     * 
     * @param {String} s
     * @returns {ForInControl}
     */
    ForInControl.prototype.setDeclarator = function(s) {
        if (!this._declaration) {
            this._declaration = new SDeclaration();
        }
        this._declaration.setDeclarator(s);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ForInControl.prototype.getDeclarator = function() {
        return this._declaration.getDeclarator();
    };
    /**
     * 
     * @param {NVariable|String|Object} v
     * @returns {ForInControl}
     */
    ForInControl.prototype.setVariable = function(v) {
        if (!this._declaration) {
            this._declaration = new SDeclaration();
        }
        this._declaration.setVariable(v);
        return this;
    };
    /**
     * 
     * @returns {NVariable}
     */
    ForInControl.prototype.getVariable = function() {
        return this._declaration.getVariable();
    };
    
    /**
     * 
     * @param {type} i
     * @returns {ForIn}
     */
    ForInControl.prototype.setObject = function(i) {
        this._object = i;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    ForInControl.prototype.getObject = function() {
        return this._object;
    };
    
    
    
    /**
     * 
     * @param {type} fo
     * @class ForIn
     */
    function ForIn(fo) {
        if (fo instanceof ForInControl) {
            this._control = fo;
            if (arguments.length > 1) {
                this.setBody(arguments[1]);
            }
        } else {
            this._control = new ForInControl();
            if (arguments.length > 4) {
                this.setDeclaration(new SDeclaration(arguments[0], arguments[1]));
                this.setObject(arguments[2]);
                this.setBody(arguments[3]);
                this.setAwait(arguments[4]);
            } else if (isPlainObject(fo)) {
                if (typeof fo.await !== 'undefined') {
                    this._await = toBool(fo.await);               
                }
                if (isPlainObject(fo.declaration)) {
                    this.setDeclaration(fo.declaration);
                } else {
                    var d = fo.declarator||fo.declarationType||fo.declarationSymbol||fo.statement||fo.Statement||"", v;
                    if (!d && ['var', 'let', 'const'].indexOf(fo.declaration) >= 0) {
                        d = fo.declaration;
                    }
                    if ((v = fo.variable||fo.Variable||fo.variableName||fo.VariableName||fo.variables||fo.Variables)) {
                        this.setDeclaration(new SDeclaration(d, v));
                    }
                }
                this._object = Expression.getInstance(fo.object);
                var body = fo.body||fo.Body||fo.block||fo.Block||fo.statements||fo.Statements||fo.Statement||fo.Statement;
                if (body) {
                    this.setBody(body);
                }
            }
        }
   }



   ForIn.prototype = new ForStatement();
   /**
   * 
   * @returns {ForIn}
   */
    ForIn.__CLASS__ = ForIn;
    /**
     * 
     * @type String
     */
    ForIn.__CLASS_NAME__ = "ForIn";
    /**
     * 
     * @returns {ForIn}
     */
    ForIn.prototype.__CLASS__ = ForIn;
    /**
     * 
     * @type String
     */
    ForIn.prototype.__CLASS_NAME__ = "ForIn";
    /**
     * 
     */
    ForIn.prototype.getType = function() {
        return "forin";
    };
    /**
     * 
     * @returns {ForIn}
     */
    ForIn.prototype.getSymbol = function() {
        return "for";
    };
    
    /**
     * 
     * @param {ForControl|Object} c
     * @returns {For}
     */
    ForIn.prototype.setControl = function(c) {
        if (!(isPlainControl(c))) {
            throw new Error("Incorrect argument");
        }
        this._control = c instanceof ForInControl ? c : new ForInControl(c);
        return this;
    };

    /**
     * 
     * @param {type} o
     * @returns {ForIn}
     */
    ForIn.prototype.setObject = function(o) {
        this._control.setObject(o);
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    ForIn.prototype.getObject = function() {
        return this._control.getObject();
    };

     /**
     * 
     * @returns {String}
     */
    ForIn.prototype.getDeclaration = function() {
        return this._control.getDeclaration();
    };
    /**
     * 
     * @param {SDeclaration|Object} d
     * @returns ForIn
     */
    ForIn.prototype.setDeclaration = function(d) {
        this._control.setDeclaration(d);
        return this;
    };
    /**
     * 
     * @param {String} s
     * @returns ForIn
     */
    ForIn.prototype.setDeclarator = function(s) {
        this._control.setDeclarator(s);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ForIn.prototype.getDeclarator = function() {
        return this._control.getDeclarator();
    };
    /**
     * 
     * @param {NVariable|String|Object} v
     * @returns {ForIn}
     */
    ForIn.prototype.setVariable = function(v) {
        this._control.setVariable(v);
        return this;
    };
    /**
     * 
     * @returns {NVariable}
     */
    ForIn.prototype.getVariable = function() {
        return this._control.getVariable();
    };
    /**
     * 
     * @returns {String}
     */
    ForIn.prototype.getInlineStatementString = function() {
        var str = "";
        if (this._await) {
            str += "await ";
        }
        
        str += "for (";
        
        var d = this.getDeclaration();
        if (d) {
            str += d.toString(true);
        }
        
        str+= " in ";
        var o = this.getObject();
        if (o) {
            str += o.toString(true);
        }
        str += ") "; 
        
        o = this.getBody();
        if (o) {
            str += o.toString(true);
        }
        
        return str;
    
    };

    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    ForIn.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "", _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        
        if (indentFirstLine) {
            str += _ind;
        }
        if (this._await) {
            str += "await ";
        }
        
        str += "for (";
        
        var d = this.getDeclaration();
        if (d) {
            str += d.toString(ind, false);
        }
        
        str+= " in ";
        var o = this.getObject();
        if (o) {
            str += o.toString(ind, false);
        }
        str += ") "; 
        
        o = this.getBody();
        if (o) {
            str += o.toString(ind, false);
        }
        
        return str;
    };
    /**
     * 
     */
    Object.defineProperties(ForIn.prototype, {
        "declaration" : { get: ForIn.prototype.getDeclaration, set: ForIn.prototype.setDeclaration },
        "declarator" : { get: ForIn.prototype.getDeclarator, set: ForIn.prototype.setDeclarator },
        "declarationType" : { get: ForIn.prototype.getDeclarator, set: ForIn.prototype.setDeclarator },
        "declarationSymbol" : { get: ForIn.prototype.getDeclarator, set: ForIn.prototype.setDeclarator },
        "variable" : { get: ForIn.prototype.getVariable, set: ForIn.prototype.setVariable },
        "object" : { get: ForIn.prototype.getObject, set: ForIn.prototype.setObject },
        "body" : { get: ForIn.prototype.getBody, set: ForIn.prototype.setbody }
    }) ;
    
    /**
     * 
     * @param {type} d
     * @returns {FODeclaration}
     * @class
     */
    function FODeclaration(d) {
        
        if (arguments.length > 1) {
            this.setDeclarator(arguments[0]);
            this.setStatement(FODeclaration.getStatement(arguments[1]));
        } else if (typeof d === 'string') {
            this._statement = new NVariable(d);
        } else if (isPlainObject(d)) {
            this.setDeclarator(d.declarator||d.Declarator||d.declarationSymbol||d.DeclarationSymbol||d.symbol||d.Symbol||d.declarationType||d.DeclarationType||d.type||d.Type||"");
            this.setStatement(FODeclaration.getStatement(d));
        } else {
            this._declarator= "";
            this._statement = null;
        }
    } 
    
    
    /**
     * 
     * @param {type} s
     * @returns {ODVariables|ADVariables|NVariable}
     */
    FODeclaration.getStatement = function (s) {
        if (s instanceof NVariable || s instanceof ODVariables || s instanceof ADVariables)
            return s;
        if (s instanceof String) {
            s = s.valueOf();
        }
        if (typeof s === 'string') {
            return new NVariable(s);
        }
        
        var v = s.variable||s.Variable||s.variableName||s.VariableName||s.name||s.Name;
        if (v) {
            return new NVariable(v);
        } else {
            var _d = s.destructuring||s.Destructuting;
            if (_d) {
                return FODeclaration.getDestructuringObj(_d);
            } else {
                return FODeclaration.getDestructuringObj(s);
            }
        }
    };
    
    FODeclaration.prototype = new StatementElt();
    /**
     * 
     * @returns {ODVariables|ADVariables|NVariable}
     */
    FODeclaration.prototype.getStatement = function() {
        return this._statement;
    };
    /**
     * 
     * @param {type} s
     * @returns {FODeclaration}
     */
    FODeclaration.prototype.setStatement = function(s) {
        if (!s) {
            throw new Error("Incorrect argument");
        }
        this._statement = FODeclaration.getStatement(s);
        return this;
    };
    /**
     * 
     * @param {NVariable|String|Object} v
     * @returns {FODeclaration}
     */
    FODeclaration.prototype.setVariable = function(v) {
        this._statement = v instanceof NVariable || v instanceof ODVariables || v instanceof ADVariables  ? v : FODeclaration.getStatement(v);
        return this;
    };
    
    /**
     * 
     * @param {ODVariables|Object} d
     * @returns {FODeclaration}
     */
    FODeclaration.prototype.setDestructuring = function(d) {
        var _d = FODeclaration.getDestructuringObj(d);
        if (!_d) {
            throw new Error("Incorrect argument");
        }
        this._statement = _d;
        return this;
    };
    /**
     * 
     * @param {Object|Array} d
     * @returns {ODVariables|ADVariables}
     */
    FODeclaration.getDestructuringObj = function(d) {
        if (d instanceof ODVariables || d instanceof ADVariables) {
            return d;
        }
        if (isPlainObject(d)) {
            if (hasOwnProp(d, 'variables') || hasOwnProp(d, 'names') || hasOwnProp(d, 'entries') || hasOwnProp(d, 'properties')) {
                return new ODVariables(d);
            } else {
                var elts = d.elements||d.elts||d.Elements||d.Elts||d.list||d.List;
                if (isArray(elts)) {
                    return new ADVariables(elts);
                }
            }
        } else if (isArray(d)) {
            return new ADVariables(d);
        }
    };
    /**
     * 
     * @returns {String}
     */
    FODeclaration.prototype.getDeclarator = function() {
        return this._declarator;
    };
    /**
     * 
     * @param {String} s
     * @returns ForOf
     */
    FODeclaration.prototype.setDeclarator = function(s) {
        if (typeof s !== 'string') {
            incorrectArg(); //throw "Incorrect argument";
        }
        if (['var', 'let', 'const', ''].indexOf(s) < 0) {
            throw new Error("Incorrect statement: '" + s + "'");
        }
        this._declarator =  s;
        return this;
    };
   
   
    FODeclaration.prototype.setSymbol = FODeclaration.prototype.setDeclarator;
    
    FODeclaration.prototype.getSymbol = FODeclaration.prototype.getDeclarator;
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    FODeclaration.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "", decl = this._declarator||"";       
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                s +=  "    ";
            }
        }
        s += decl ? decl + " " : "";
        s +=  this._variable ? this._variable.getName()||"" : "";

        return s;
    };
   /**
    * 
    * @param {Number} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   FODeclaration.prototype.getInlineStatementString = function(ind, indentFirstLine) {
       var s = "", decl = this._declarator||"";       
       s += decl ? decl + " " : "";
       s +=  this._variable ? this._variable.getName()||"" : "";       
       return s;
   };
    /**
     * 
     * @returns {ForOfControl}
     * @class ForOfControl
     */
    function ForOfControl() {
        if (arguments.length === 1) {
            var c = arguments[0];
            this.setDeclaration(c.declaration||c.Declaration);
            this.setIterable(c.iterable||c.Iterable||c.object||c.Object);
        } else if (arguments.length === 2) {
            this.setDeclaration(arguments[0]);
            this.setIterable(arguments[1]);
        } else if (arguments.length > 2) {
            this.setDeclaration(new FODeclaration(arguments[0], arguments[1]));
            this.setIterable(arguments[2]);
        }
    }
    
    ForOfControl.prototype = new FControl();
    
    ForOfControl.__CLASS__ = ForOfControl;
    
    ForOfControl.__CLASS_NAME__ = "ForOfControl";
    
    ForOfControl.__SUPER_CLASS__ = StatementElt;
    
    ForOfControl.prototype.__CLASS__ = ForOfControl;
    
    ForOfControl.prototype.__CLASS_NAME__ = "ForOfControl";
    
    
    /**
    * 
    * @param {String} s
    * @returns ForOf
    */
   ForOfControl.prototype.setDeclarationStatement = function(s) {
       if (!this._declaration) {
           this._declaration = new FODeclaration();
       }
       this._declaration.setStatement(s);
       return this;
   };
   /**
    * 
    * @returns {FODeclaration}
    */
   ForOfControl.prototype.getDeclaration = function() {
       return this._declaration;
   }
   
   ForOfControl.prototype.setDeclaration = function (d) {
       if (d instanceof FODeclaration) {
           this._declaration = d;
       } else if (isPlainObject(d)) {
           this._declaration = new FODeclaration(d);
       } else {
           if (d instanceof String) {
               d = d.valueOf();
           }
           if (typeof d === 'string' || d instanceof NVariable || d instanceof ODVariables || d instanceof ADVariables) {
               this.setDeclarationStatement(d);
           } else {
               throw new Error("Incorrect argument");
           }
       }
       return this;
   }
   /**
    * 
    * @returns {String}
    */
   ForOfControl.prototype.getDeclarationStatement = function() {
       return this._declaration ? this._declaration.getStatement() : null;
   };

   
   /**
    * 
    * @param {String} s
    * @returns ForOf
    */
   ForOfControl.prototype.setDeclarator = function(d) {
       if (!this._declaration) {
           this._declaration = new FODeclaration();
       }
       this._declaration.setDeclarator(d);
       return this;
   };
    
    ForOfControl.prototype.setIterable = function(i) {
        var _i = Expression.getInstance(i);
        if (_i instanceof Litteral) {
            throw new Error("Incorrect argument");
        }
        this._iterable = _i;
    };
    
    ForOfControl.prototype.getIterable = function() {
        return this._iterable;
    };
   /**
    * <h3>Statement for ... of class</h3>
    * @param {Object} fo The metadata
    * @class
    */
   function ForOf(fo) {
       this._await = false;
       function bool(a) {
           if (a instanceof Boolean || a instanceof String || a instanceof Number) {
               a = a.valueOf();
           }
           if (typeof a === 'string') {
               a = a.toLowerCase();
               if (['true', '1', 'y', 'yes', 'ok', 'on', 'await', 'oui'].indexOf(a) >= 0) {
                   a = true;
               } else {
                   a = false;
               }
           } else if (typeof a === 'number') {
               a = a !== 0;
           }
           return a;
       }
       if (fo instanceof ForOfControl) {
           this._control = fo;
           var a = bool(arguments[1]);          
           if (typeof a === 'boolean') {
               this._await = a;
               if (arguments.length > 2) {
                    this.setBody(arguments[2]);
               }
           } else if (arguments.length > 1) {
                this.setBody(arguments[1]);
                var a = bool(arguments[2]);
                if (typeof a === 'boolean') {
                    this._await = a;
                }
           }
       } else {
            this._control = new ForOfControl();            
            if (arguments.length > 4) {
                this.setDeclaration(new SDeclaration(arguments[0], arguments[1]));
                this.setIterable(arguments[2]);
                this.setBody(arguments[3]);
                this.setAwait(arguments[4]);
            } else if (isPlainObject(fo)) {
                if (typeof fo.await !== 'undefined') {
                    this._await = toBool(fo.await);
                }
                
                if (fo.control||fo.Control) {
                    this.setControl(fo.control||fo.Control);
                } else {
                    var d = fo.declarator||fo.Declarator||fo.declaration||fo.Declaration;
                    if (['const', 'let', 'var'].indexOf(d) >= 0) {
                        this.setDeclarator(d);
                        d = fo.statement||fo.Statement||fo.variable||fo.Variable||fo.variableName||fo.VariableName ||fo.variables||fo.Variables||fo.destructuring||fo.Destructuring;
                        if (d) {
                            this.setDeclarationStatement(d);
                        }
                    } else {
                        if (!d) {
                            d = fo.statement||fo.Statement||fo.variable||fo.Variable||fo.variableName||fo.VariableName ||fo.variables||fo.Variables||fo.destructuring||fo.Destructuring;
                        }
                        if (d) {
                            this.setDeclarationStatement(d);
                        }
                    }
                    this.setIterable(Expression.getInstance(fo.iterable||fo.Iterable||fo.object||fo.Object));
                }
                var body = fo.body||fo.Body||fo.block||fo.Block||fo.statements||fo.Statements||fo.Statement||fo.Statement;
                if (body) {
                    this.setBody(body);
                }
            }
        }
   }
   ForOf.prototype = new ForStatement();

    /**
     * 
     * @returns {ForOf}
     */
    ForOf.__CLASS__ = ForOf;
    /**
     * 
     * @type String
     */
    ForOf.__CLASS_NAME__ = "ForOf";
    
    ForOf.__SUPER_CLASS = ForStatement;
    /**
     * 
     * @returns {ForOf}
     */
    ForOf.prototype.__CLASS__ = ForOf;
    /**
     * 
     * @type String
     */
    ForOf.prototype.__CLASS_NAME__ = "ForOf";

     /**
      * 
      */
    ForOf.prototype.getSymbol = function() {
        return "for";
    };
    /**
     * 
     * @param {ForControl|Object} c
     * @returns {For}
     */
    ForOf.prototype.setControl = function(c) {
        if (!(isPlainControl(c))) {
            throw new Error("Incorrect argument");
        }
        this._control = c instanceof ForOfControl ? c : new ForOfControl(c);
        return this;
    };
   
   /**
    * 
    * @returns {Boolean}
    */
   ForOf.prototype.isAwait = function() {
       return this._await;
   };
   
    /**
     * 
     * @param {Boolean} awt
     * @returns {ForOf}
     */
    ForOf.prototype.setAwait = function(awt) {
        if (awt instanceof Boolean || awt instanceof String || awt instanceof Number) {
            awt = awt.valueOf();
        }
        this._await = typeof awt === 'string' && awt.toLowerCase() === 'await' ? true : toBool(awt);
        return this;
    };
    
    /**
     * 
     */
    ForOf.prototype.getType = function() {
        return "forof";
    };
   
   
   
   /**
     * 
     * @param {type} o
     * @returns {ForIn}
     */
    ForOf.prototype.setIterable = function(o) {
        this._control.setIterable(o);
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    ForOf.prototype.getIterable = function() {
        return this._control.getIterable();
    };

     /**
     * 
     * @returns {String}
     */
    ForOf.prototype.getDeclaration = function() {
        return this._control.getDeclaration();
    };
    /**
     * 
     * @param {SDeclaration|Object} d
     * @returns ForIn
     */
    ForOf.prototype.setDeclaration = function(d) {
        if (!this._control) {
            this._control = new ForOfControl();
        }
        this._control.setDeclaration(d);
        return this;
    };
    /**
     * 
     * @param {String} s
     * @returns ForIn
     */
    ForOf.prototype.setDeclarator = function(s) {
        this._control.setDeclarator(s);
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ForOf.prototype.getDeclarator = function() {
        return this._control.getDeclarator();
    };
    /**
     * 
     * @param {NVariable|String|Object} v
     * @returns {ForIn}
     */
    ForOf.prototype.setVariable = function(v) {
        this._control.setVariable(v);
        return this;
    };
    /**
     * 
     * @returns {NVariable}
     */
    ForOf.prototype.getVariable = function() {
        return this._control.getVariable();
    };
   
   

   /**
    * 
    * @param {String} s
    * @returns ForOf
    */
   ForOf.prototype.setDeclarationStatement = function(s) {
       this._control.setDeclarationStatement(s);
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   ForOf.prototype.getDeclarationStatement = function() {
       return this._control.getDeclarationStatement();
   };



   /**
    * 
    * @param {Object|Numeric|String|Number|Boolean|Expression} e
    * @class
    */
   function Throw(e) {
       if (arguments.length > 0) {
           this.setError(e);
       }
   }

   Throw.prototype = new Statement();

   Throw.__CLASS__ = Throw;

   Throw.__CLASS_NAME__ = "Throw";
   
   Throw.__SUPER_CLASS__ = Statement;

   Throw.prototype.__CLASS__ = Throw;

   Throw.prototype.__CLASS_NAME__ = "Throw";
   /**
    * 
    * @returns {Expression}
    */
   Throw.prototype.getError=function() {
       return this._error;
   };
   /**
    * 
    * @param {type} e
    * @returns {Throw}
    */
   Throw.prototype.setError=function(e) {
       if (e instanceof Expression) {
           this._error = e;
       } else if (typeof e === 'string') {
           this._error = new QString(e, '"');
       } else if (typeof e === 'number') {
           this._error = new Numeric(e);
       } else if (typeof e === 'boolean') {
           this._error = new Bool(e);
       } else if (typeof e instanceof Date) {
           this._error = new Value(e);
       } else if (isPlainObject(e)) {
           this._error = Expression.getInstance(e);
       }
       return this;
   };
   /**
    * 
    * @returns {Expression}
    */
   Throw.prototype.getException = Throw.prototype.getError;
   /**
    * 
    * @param {type} e
    * @returns {Throw}
    */
   Throw.prototype.setException = Throw.prototype.setError;
   
    /**
     * 
     * @param {IComment|String} c
     * @returns {Throw}
     */
    Throw.prototype.setAfterKeywordComment = function(c) {
        this._afterKeywordComment = IComment.getInstance(c);
        return this;
    };
    
    /**
     * 
     * @param {IComment|String} c
     * @returns {Throw}
     */
    Throw.prototype.setAfterKeywordComment = function(c) {
        this._afterKeywordComment = IComment.getInstance(c);
        return this;
    };
   /**
     * 
     * @param {IComment|String} c
     * @returns {Throw}
     */
    Throw.prototype.setAfterKeywordInlineComment = function(c) {
        this._afterKeywordInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Throw.prototype.getAfterKeywordInlineComment = function(c) {
        return this._afterKeywordInlineComment;
    };  
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Throw.prototype.setAfterThrowInlineComment = Throw.prototype.setAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Throw.prototype.getAfterThrowInlineComment = Throw.prototype.getAfterKeywordInlineComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Throw.prototype.setAfterThrowComment = Throw.prototype.setAfterKeywordComment;
    /**
     * 
     * @param {type} c
     * @returns {IComment}
     */
    Throw.prototype.getAfterThrowComment = Throw.prototype.getAfterKeywordComment;
   /**
    * 
    * @param {unsigned int} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   Throw.prototype.getStatementString = function(ind, indentFirstLine) {
       var _ind = "";
       if (indentFirstLine) {
           for (var i = 0; i < n; i++) {
               _ind +=  "    ";
           }
       }
       var e = this.getError();
       return _ind + "throw" + (e ? " " + e.toString(ind, false) : "");
   };
   /**
    * 
    * @returns {String}
    */
   Throw.prototype.getInlineStatementString = function() {
       var e = this.getError();
       return "throw" + (e ? " " + e.toString(true) : "");
   };

   Object.defineProperties(Throw.prototype, {
       error: { get: Throw.prototype.getError, set: Throw.prototype.setError },
       exception: { get: Throw.prototype.getError, set: Throw.prototype.setError }
   });
   /**
    * 
    * @class
    */
   function Try() {
       if (arguments.length === 1) {
           var o = arguments[0];
           this.setBody(o.body||o.block||o.Body||o.Block);
           this.setCatch(o.catch);
           var fo = o.finally||o.Finally;
           if (fo) this.setFinally(fo);
       } else if (arguments.length === 2) {
           this.setBody(arguments[0]);
           this.setCatch(arguments[1]);
       } else if (arguments.length > 2) {
           this.setBody(arguments[0]);
           if (typeof arguments[1] === 'string') {
               this.setCatch(new Catch(arguments[1], arguments[2]));
               if (arguments.length > 3) {
                   this.setFinally(arguments[3]);
               }
           } else {
               this.setCatch(arguments[1]);
               this.setFinally(arguments[3]);
           }
       }
   }

   Try.prototype = new Statement();

   Try.__CLASS__ = Try;

   Try.__CLASS_NAME__ = "Try";

   Try.prototype.__CLASS__ = Try;

   Try.prototype.__CLASS_NAME__ = "Try";
   /**
    * 
    * @returns {Catch}
    */
   Try.prototype.getCatch = function() {
       return this._catch;
   };
   /**
    * 
    * @param {Catch|Object|Array} c
    * @returns {Try}
    */
   Try.prototype.setCatch = function(c) {
       this._catch = c instanceof Catch ? c : c ? new Catch(c) : null;
       return this;
   };
   /**
    * 
    * @returns {Block}
    */
   Try.prototype.getBody = function() {
       return this._body;
   };
   /**
    * 
    * @param {type} body
    * @returns {Try}
    */
   Try.prototype.setBody = function(body) {
       this._body= body instanceof Block ? body : new Block(body);
       this._body.setOwner(this);
       return this;
   };

   /**
    * 
    * @returns {Block}
    */
   Try.prototype.getFinally = function() {
       return this._finally;
   };
   /**
    * 
    * @param {type} _finally
    * @returns {Try}
    */
   Try.prototype.setFinally = function(_finally) {
       this._finally = _finally instanceof Block ? _finally : new Block(_finally);
       this._finally.setOwner(this);
       return this;
   };

   Try.prototype.getInlineStatementString = function() {
       return "try " + (this._body ? this._body.toString(true) : "{}") 
               + "\n" + (this._catch ? 
                   this._catch.toString(true) : "catch (ex) {}");
   };
   
   /**
    * 
    * @param {unsigned int} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   Try.prototype.getStatementString = function(ind, indentFirstLine) {
       var _ind = "";
       if (indentFirstLine) {
           for (var i = 0; i < n; i++) {
               _ind +=  "    ";
           }
       }
       return _ind + "try " + (this._body ? this._body.toString(ind, false) : "{}") 
               + "\n" + (this._catch ? 
                   this._catch.toString(ind, true) : "\n" + _ind + "catch (ex) {}");
   };
   


   Object.defineProperties(Try.prototype, {
       "body" : { get: Try.prototype.getBody, set: Try.prototype.setBody },
       "catch" : { get: Try.prototype.getCatch, set: Try.prototype.setCatch }
   });



   /**
    * 
    * @returns {Catch}
    * @class
    */
   function Catch() {
       if (isPlainObject(arguments[0])) {
           var o = arguments[0];
           this.setVariableName(o.variableName||o.varName||o.variable
                   ||o.name||o.exceptionName||o.exception);
           this.setBody(o.body||o.block||o.Body||o.Block);
       } else if (arguments.length > 1) {
           this.setVariableName(arguments[0]);
           this.setBody(arguments[1]);
       }
   }



   Catch.prototype = new StatementElt();

   Catch.__CLASS__ = Catch;

   Catch.__CLASS_NAME__ = "Catch";

   Catch.prototype.__CLASS__ = Catch;

   Catch.prototype.__CLASS_NAME__ = "Catch";
   /**
    * 
    * @returns {String}
    */
   Catch.prototype.getVariableName = function() {
       return this._variableName;
   };
   /**
    * 
    * @param {String} name
    * @returns {Catch}
    */
   Catch.prototype.setVariableName = function(name) {
       if (typeof name!== 'string') {
           incorrectArg(); //throw new Error("Incorrect argument");
       }
       if (!name) {
           throw new Error("Empty variable name");
       }
       this._variableName = name;
       return this;
   };
   /**
    * 
    * @returns {Block}
    */
   Catch.prototype.getBody = function() {
       return this._body;
   };
   /**
    * 
    * @param {Block} body
    * @returns {Catch}
    */
   Catch.prototype.setBody = function(body) {
       this._body= body instanceof Block ? body : new Block(body);
       this._body.setOwner(this);
       return this;
   };
    /**
     * 
     * @return {String}
     */
    Catch.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        if (inline) {
            return "catch (" + this.getVariableName() + ") "
                + (this._body ? this._body.toString(true) : "{}");
        }
        var s = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                s += "    ";
            }
        }
        s += "catch (" + this.getVariableName() + ") "
                + (this._body ? this._body.toString(ind, false) : "{}");
        
        return s;
    };

   Object.defineProperties(Catch.prototype, {
       "body" : { get: Catch.prototype.getBody, set: Catch.prototype.setBody },
       "variableName" : { get: Catch.prototype.getVariableName, set: Catch.prototype.setVariableName }
   });

   

   /**
    * <h3>Statements Block</h3>
    * 
    * @param {type} b
    * @returns {Block}
    * @class Block
    */
   function Block(b) {
        this._statements = [];
        this._owner = null;
        this._yields = 0;
        if (arguments.length > 1) {
            if (typeof arguments[1] === 'boolean') {
                var s = arguments[0];
                this.setStatements(isPlainObject(s) ? s.statements||s.Statements : s, arguments[1]);
            } else {
                this.setStatements(arguments[0]);
                this.setOwner(arguments[1]);
            }
        } else if (isArray(b)) {
            for (var i = 0; i < b.length; i++) {
                this._statements[i] = Statement.getInstance(b[i]);
            }
        } else if (isPlainObject(b)) {
            if (isPlainObject(b.owner)) {
                this.setOwner(b.owner);
            }
            var s = b.statements||b.elements;
            if (isArray(s)) {
                for (var i = 0; i < s.length; i++) {
                    this._statements[i] = Statement.getInstance(s[i]);
                }
            }
            if (b.comment) {
                this.setComment(b.comment);
            }
            if (b.innerInlineComment) {
                this.setInnerInlineComment(b.innerInlineComment);
            }
            if (b.innerComment) {
                this.setInnerComment(b.innerComment);
            }
            if (b.endComment) {
                this.setEndComment(b.endComment);
            }
            
            if (b.endInlineComment) {
                this.setEndInlineComment(b.endInlineComment);
            }
            
            if (b.outerInlineComment) {
                this.setOuterInlineComment(b.outerInlineComment);
            }
       }
   }

   Block.prototype = new Statement();

   Block.__CLASS__ = Block;

   Block.__CLASS_NAME__ = "Block";

   Block.prototype.__CLASS__ = Block;

   Block.prototype.__CLASS_NAME__ = "Block";
   /**
   * 
   * @returns {Boolean}
   */
  Block.prototype.isBlock = function() {
      return true;
  };
   /**
    * 
    * @returns {type}
    */
   Block.prototype.getOwner = function() {
      return this._owner;
   };
  /**
   * 
   * @param {type} o
   * @returns {Block}
   */
   Block.prototype.setOwner = function(o) {
      this._owner = o;
      return this;
   };
   /**
    * 
    * @param {type} index
    * @returns {Array}
    */
   Block.prototype.getStatement = function(index) {
       return this._statements[index];
   };
   /**
    * Returns the number of statements of the block;
    * @returns {unsigned int}
    */
   Block.prototype.size = function() {
       return this._statements.length;
   };
   /**
    * 
    * @param {Array} s
    * @param {Boolean|Object} [expressionAsStatement=true]
    * @returns {Block}
    */
   Block.prototype.setStatements = function(s, expressionAsStatement) {
       this._yields = 0;
       if (typeof expressionAsStatement === 'undefined') {
           expressionAsStatement = true;
       }
       if (isArray(s)) {
           this._statements = [];
           var stmt;
           for (var i = 0; i < s.length; i++) {
               this._statements[i] = (stmt = Statement.getInstance(s[i], expressionAsStatement));
               if (stmt.isYield()) {
                   this._yields++;
               }
           }
       } else {
           incorrectArgs(); //throw Exception
       }
       return this;
   };
   /**
    * 
    * @returns {Array}
    */
   Block.prototype.getStatements = function() {
       return this._statements ? [] : Array.prototype.slice.call(this._statements);
   };
   Block.prototype.isYield = function() {
       return this._yields > 0;
   };
   Block.prototype.iterator = function() {
       if (!this._statements) {
           this._statements = [];
       }
       return {
           __ : { _elts : this._statements, _index : -1},
           hasNext : function() {
               return this.__._index + 1 < this.__._elts.length;
           },
           next : function() {
               var i = this.__;
               return i._elts[++i._index];
           },
           reset : function() {
               this.__._index = -1;
           }
       };
   };
   /**
    * 
    * @param {type} s
    * @param @param {Boolean|Object} [expressionAsStatement=true]
    * @returns {Block.prototype}
    */
   Block.prototype.addStatement = function(s, expressionAsStatement) {
       if (typeof expressionAsStatement === 'undefined') {
           expressionAsStatement = true;
       }
       var stmt;
       this._statements[this._statements.length] = stmt = Statement.getInstance(s, expressionAsStatement);
       if (stmt.isYield()) {
           this._yields++;
       }
       return this;
   };

   Block.getInstance = function (b) {
       if (b instanceof Block) {
           return b;
       }
       if (isArray(b)) {
           return new Block(b);
       }
       if (b instanceof Statement || (b instanceof StatementElt && b.isStatement())) {
           return new Block([b]);
       }
       if (isPlainObject(b)) {
           if (isArray(b.statements)) {
               return new Block(b.statements); 
           }
       }
   };
    /**
     * 
     * @param {IComment} cmt
     * @returns {Block}
     */
    Block.prototype.setInnerInlineComment = function(cmt) {
        this._innerInlineComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    Block.prototype.getInnerInlineComment = function() {
        return this._innerInlineComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {Block}
     */
    Block.prototype.setInnerComment = function(cmt) {
        this._innerComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    Block.prototype.getInnerComment = function() {
        return this._innerComment;
    };
    /**
     * 
     * @returns {IComment}
     */
    Block.prototype.getEndInlineComment = function() {
        return this._endInlineComment;
    };
   /**
    * 
    * @param {IComment} comment
    * @returns {Block}
    */
   Block.prototype.setEndInlineComment = function(comment) {
       this._endInlineComment = comment;
       return this;
   };
    /**
     * 
     * @returns {IComment}
     */
    Block.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
   /**
    * 
    * @param {IComment} comment
    * @returns {Block}
    */
   Block.prototype.setOuterInlineComment = function(comment) {
       this._outerInlineComment = comment;
       return this;
   };
   /**
    * 
    * @returns {String}
    */
   Block.prototype.toString = function() {                

       var statements = this._statements, n = statements.length;
       var inline = false, ind = 0, indentFirstLine = true;
       if (arguments.length === 1) {
           if (typeof arguments[0] === 'number') {
               ind = arguments[0];
           } else if (typeof arguments[0] === 'boolean') {
               inline = arguments[0];
           }
       } else if (arguments.length > 1) {
           ind = toInteger(arguments[0]);
           indentFirstLine = toBool(arguments[1]);
       }
       var s  = "", i = 0, stmt;
       if (inline) {
           s += "{";
           for (var k = 0; k < n; k++) {
               stmt = statements[k];
               s += stmt.toString(true) + Statement.close(stmt, true);
           }
           s += "}";
           return s;
       }
       var _ind = "";
       for (var k = 0; k < ind; k++) {
           _ind += "    ";
       }
       var _ind2 = "";
       for (var k = 0; k <= ind; k++) {
           _ind2 += "    ";
       }
       if (indentFirstLine) {
           s += _ind;
       }
       s += "{";
       var _s, p;
       for (var k = 0; k < n; k++) {
           stmt = statements[k];
           _s = stmt.toString(ind + 1, false);
           p = _s.lastIndexOf("\n");
           p = p < 0 ? 0 : Statement.getIndentSpaces(_s, p + 1);
           s += "\n" + _ind2 + _s + Statement.close(stmt, false, p);
       }
       s += "\n" + _ind + "}";
       return s;
   };


    /**
    * <h3>Strict Statements Block</h3>
    * 
    * <p><b color="red">This block does not accept basic expression (string, number, 
    * boolean, array, date, regexp, null and 
    * undefined), Variable, Index, Reference, VArray, VObject and VRegExp as 
    * statement.</b></p>
    * @param {type} b
    * @returns {Block}
    * @class Block
    */
   function SBlock(b) {
       Block.apply(this, [].slice.call(arguments));
   }
   
   
   
   
   SBlock.prototype = new Block();
   
   SBlock.__CLASS__ = SBlock;
   
   SBlock.__CLASS_NAME__ = "SBlock";
   
   SBlock.__NAME__ = "SBlock";
   
   SBlock.__SUPER_CLASS__ = Block;
   
   SBlock.prototype.__CLASS__ = SBlock;
   
   SBlock.prototype.__CLASS_NAME__ = "SBlock";
   
   SBlock.prototype.__SUPER_CLASS__ = Block;
   
   
   /**
    * 
    * @param {Array} s
    * @returns {Block}
    */
   SBlock.prototype.setStatements = function(s) {
       return Block.prototype.setStatements.apply(this, [s, false]);;
   };
   /**
    * 
    * @param {type} s
    * @returns {Block.prototype}
    */
   SBlock.prototype.addStatement = function(s) {
       return Block.prototype.addStatement.apply(this, [s, false]);
   };
    
    
    
    
    
    /**
    * 
    * @class
    */
   function AParam() {
       
   }

   AParam.prototype = new StatementElt();

   AParam.__CLASS__ = AParam;

   AParam.__CLASS_NAME__ = "AParam";

   AParam.prototype.__CLASS__ = AParam;

   AParam.prototype.__CLASS_NAME__ = "AParam";


   /**
    * 
    * @returns {Boolean}
    */
   AParam.prototype.isExpression = function() {
       return false;
   };
   /**
    * 
    * @returns {Boolean}
    */
   AParam.prototype.isStatement = function() {
       return false;
   };
   /**
    * 
    * @param {type} name
    * @returns {AParam}
    */
   AParam.prototype.setName = function(name) {
       this._name = name;
       return this;
   };
   /**
    * 
    * @returns {String} 
    */
   AParam.prototype.getName = function() {
       return this._name||"";
   };
   
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    AParam.prototype.getStatementString = function(ind, indentFirstLine) {
        var inline = false;
        if (!ind) {            
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var str;
        var c = this.getComment();
        indentFirstLine = typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine);
        if (c) {
            str = c.toString(ind, indentFirstLine) + "\n" + _ind;
        } else {
            str = (indentFirstLine ? _ind : "") ;
        }
        if (this.isRestParam()) {
            str += "...";
        }
        str += this.getName()||"";
        var v = this.getDefaultValue();
        if (typeof v !== 'undefined' && v !== null) {
            str += " = " + v.toString(ind, false);
        }
        return str;
    };
    
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    AParam.prototype.getInlineStatementString = function(ind, indentFirstLine) {
        if (!ind) {
            ind = 0;
        }
        var _ind = "";
        if (typeof ind === 'number') {                    
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        var str;
        var c = this.getComment();
        indentFirstLine = typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine);
        if (c) {
            str = c.toString(ind, indentFirstLine) + "\n" + _ind;
        } else {
            str = (indentFirstLine ? _ind : "") ;
        }
        if (this.isRestParam()) {
            str += "...";
        }
        str += this.getName()||"";
        var v = this.getDefaultValue();
        if (typeof v !== 'undefined' && v !== null) {
            str += " = " + v.toString(ind, false);
        }
        return str;
    };
    /**
     * 
     * @returns {FType}
     * @class
     * @abstract
     */
    function FType() {}
    
    FType.prototype = new StatementElt();
    
    FType.__CLASS__ = FType;
    
    FType.__CLASS_NAME__ = "FType";
    
    FType.__SUPER_CLASS__ = StatementElt;
    
    FType.prototype.__CLASS__ = FType;
    
    FType.prototype.__CLASS_NAME__ = "FType";
    /**
     * 
     * @param {type} obj
     * @returns {Boolean}
     */
    FType.prototype.isTypeOf = function(obj) {
        throw new Error("Abstract method call"); 
    };
    
    FType.prototype.getOptional = function() {
        return this._optional;
    };
    
    FType.prototype.setOptional = function(optional) {
        this._optional = optional;
        return this;
    };
    
    FType.prototype.getFlags = function() {
        return this._flags;
    };
    
    FType.prototype.setFlags = function(flags) {
        this._flags = flags;
        return this;
    };
    FType.isType = function(type) {
        return type instanceof FType 
                || type instanceof NamedType 
                || type instanceof AnonymousFunction
                || type instanceof NamedFunction
                || type instanceof ArrowFunction
                || type instanceof Class;
    };
    FType.getInstance = function(type) {
        if (type instanceof FType 
                || type instanceof NamedType 
                || type instanceof AnonymousFunction
                || type instanceof NamedFunction
                || type instanceof ArrowFunction
                || type instanceof Class) {
            return type;
        }
        if (isPlainObject(type)) {
            if (isArray(type.tokens)) {
                return new SType(type);
            }
            switch ((type.type||"").toLowerCase()) {
                case "union":
                    return new UnionType(type);
                case "function":
                    return Func.getFunction(type);
                case "class":
                    return new Class(type);
                case "namedfunction":
                case "named-function":
                    return new NamedFunction(type);
                case "arrowfunction":
                case "arrow-function":
                    return new NamedFunction(type);
            }
        }
    }
    
    /**
     * 
     * @param {type} [t]
     * @returns {DataTypeToken}
     * @class DataTypeToken
     */
    function DataTypeToken(t) {
        if (arguments.length !== 0) {
            if (t instanceof String) {
                t = t.valueOf();
            }
            if (typeof t === 'string') {
                this._symbol = t;
            } else if (isPlainObject(t)) {
                this._symbol = t.token||t.symbol||t.name||t.Token||t.Symbol||t.Name||"";
                if (t.comment) {
                    this.setComment(t.comment);
                }
                if (t.inlineComment) {
                    this.setInlineComment(t.inlineComment);
                }
                if (t.endComment) {
                    this.setEndComment(t.endComment);
                }
                if (t.inlineEndComment) {
                    this.setInlineEndComment(t.inlineEndComment);
                }
            }
        } else {
            this._symbol = "";
        }
    }
    
    DataTypeToken.prototype = new StatementElt();
    
    DataTypeToken.prototype.__CLASS__ = DataTypeToken;
    
    DataTypeToken.__CLASS__ = DataTypeToken;
    
    DataTypeToken.__CLASS_NAME__ = "DataTypeToken";
    
    DataTypeToken.__SUPER_CLASS__ = StatementElt;
    
    /**
     * 
     * @returns {String}
     */
    DataTypeToken.prototype.getSymbol = function() {
        return this._symbol;
    };
    /**
     * 
     * @param {String} s
     * @returns {DataTypeToken}
     */
    DataTypeToken.prototype.setSymbol = function(s) {
        this._symbol = s;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    DataTypeToken.prototype.getInlineStatementString = function() {
        return this._symbol||"";
    };
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    DataTypeToken.prototype.getStatementString = function(ind, indentFirstLine) {
        if (typeof ind === 'undefined' || ind === null) {
            ind = 0;
        }
        if (typeof indentFirstLine === 'undefined' || indentFirstLine === null) {
            indentFirstLine = true;
        }
        var _ind = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        return _ind + (this._symbol||"");
    };
    /**
     * 
     * @param {type} o
     * @returns {ParamTypes}
     * @class ParamTypes
     */
    function ParamTypes(o) {        
        if (arguments.length > 0) {
            var ptypes;
            if (isArray(o)) {
                ptypes = o;
            } else if (isPlainObject(o)) {
                ptypes = o.paramTypes||o.ParamTypes||o.ptypes||o.pTypes||o.types||o.Types;
                if (o.comment) {
                    this.setComment(o.comment);
                }
                if (o.inlineComment) {
                    this.setInlineComment(o.inlineComment);
                }
                if (o.endComment) {
                    this.setEndComment(o.endComment);
                }
                if (o.inlineEndComment) {
                    this.setInlineEndComment(o.inlineEndComment);
                }
            } else {
                throw new Error("Incorrect argument");
            }
            this.setTypes(ptypes);
        } else {
            this._paramTypes = [];
        }
    } 
    
    ParamTypes.prototype = new StatementElt();
    /**
     * 
     * @returns {Array}
     */
    ParamTypes.prototype.getTypes = function() {
        return this._paramTypes;
    };
    /**
     * 
     * @param {Array} types
     * @returns {ParamTypes}
     */
    ParamTypes.prototype.setTypes = function(types) {
        if (!isArray(types)) {
            throw new Error("Incoorect argument");
        } 
        this._paramTypes = [];
        var t;
        for (var i = 0, n = types.length; i < n; i++) {
            t = types[i];
            this._paramTypes[i] = t instanceof SType ? t :  new SType(t);
        }
        return this;
    };
    
    /**
     * 
     * @param {type} [_]  Zero or many arguments representing tokens.
     * @returns {SType}
     * @class
     */
    function SType(_) {
        this._tokens = [];
        this._name = null;
        
        
        if (arguments.length === 1) {
            if (_ instanceof String) {
                _ = _.valueOf();
            }
            if (typeof _ === 'string') {
                this.setTokens(_.split('.'));
            } else if (isArray(_)) {
                this.setTokens(_);
                this.getName();
            } else if (isPlainObject(_)) {
                var v = _.tokens||_.Tokens||_.elements||_.Elements;
                if (isArray(v)) {
                    this.setTokens(v);
                } else {
                    v = v.symbol||v.Symbol||v.name||v.Name;
                    if (v instanceof String) {
                        v = v.valueOf();
                    }
                    if (typeof v !== 'string') {
                        throw new Error("Incorrect argument");
                    }
                    this.setTokens(v.split('.'));
                }
            }            
        } else if (isArray(_)) {
            this.setTokens(_);
            if (isArray(arguments[1])) {
                this.setParamTypes(arguments[1]);
            }
        } else {
            this.setTokens([].slice.call(arguments));
        }
    }
    
    SType.prototype = new FType();
    
    SType.__CLASS__ = SType;
    
    SType.__CLASS_NAME__ = "SType";
    
    SType.__SUPER_CLASS__ = StatementElt;
    
    SType.__SUPER__ = StatementElt;
    
    /**
     * 
     * @param {DataTypeToken|String|Object} t
     * @returns {SType}
     */
    SType.prototype.addToken = function(t) {
        this._tokens[this._tokens.length] = t instanceof DataTypeToken ? t : new DataTypeToken(t);
        this._name = null;
        return this;
    };
    /**
     * Returns the token at the given index/position.
     * @param {Number} i  The index/position
     * @returns {DataTypeToken}
     */
    SType.prototype.getToken = function(i) {
        return this._tokens[i];
    };
    /**
     * Returns the number of tokens     * 
     * @returns {Number}
     */
    SType.prototype.size = function() {
        return this._tokens.length;
    };
    /**
     * Returns an array of tokens. 
     * <p><b>Each call creates a new array.</b>To avoid creation, loop using 
     * this.size() and this.getToken() methods.</p>
     * @returns {Array&lt;DataTypeToken&gt;}
     * @see SType.prototype.size
     * @see SType.prototype.getToken
     */
    SType.prototype.getTokens = function () {
        return [].slice.call(this._tokens);
    };
    /**
     * 
     * @param {Array|String} tokens
     * @returns {SType}
     */
    SType.prototype.setTokens = function (tokens) {
        if (tokens instanceof String) {
            tokens = tokens.valueOf();
        }
        if (typeof tokens === 'string') {
            tokens = tokens.split('.');
        }
        if (!isArray(tokens)) {
            throw new Error("Array or string argument expected");
        }
        var tok, n = tokens.length;
        for (var i = 0; i < n; i++) {
            tok = tokens[i];
            this._tokens[i] = tok instanceof DataTypeToken ? tok : new DataTypeToken(tok);
        }
        this.getName();
        return this;
    };    
    /**
     * 
     * @returns {String}
     */
    SType.prototype.getName = function() {
        if (this._name === null || typeof this._name === 'undefined') {
            var toks = this._tokens, n = toks.length, name = n > 0 ? toks[0].getSymbol() : "", tok;
            if (['"', "'"].indexOf(name[0]) >= 0) {
                throw new Error("Incorrect token");
            }
            for (var i = 1; i < n; i++) {
                tok = toks[i].getSymbol();
                name += ['"', "'"].indexOf(tok[0]) >= 0 ? "[" + tok + "]" : "." + tok;
            }
            this._name = name;
        }       
        return this._name;
    };
    
    SType.prototype.getSymbol = SType.prototype.getName;
    /**
     * 
     * @returns {String}
     */
    SType.prototype.getSimpleName = function() {
        var name = this.getName(), i = name.lastIndexOf(".");
        return i < 0 ? name : name.substring(i + 1); 
    };
    
    SType.prototype.getShortName = SType.prototype.getSimpleName;
    
    /**
     * 
     * @param {Array} ptypes
     * @returns {SType}
     */
    SType.prototype.setParamTypes = function(ptypes) {
        this._paramTypes = ptypes instanceof ParamTypes ? ptypes : new ParamTypes(ptypes);
        return this;
    };
    
    /**
     * 
     * @returns {Array&lt;SType&gt;}
     */
    SType.prototype.getParamTypes = function() {
        return this._paramTypes;
    };
    /**
     * 
     * @param {type} t
     * @returns {SType}
     */
    SType.getInstance = function(t) {
        return t instanceof SType ? t : new SType(t);
    };
    
    
    
    Object.defineProperties(SType.prototype,{
        name: { get: SType.prototype.getName,set : function() { throw new Error("Read only property"); } },
        symbol: { get: SType.prototype.getName,set : function() { throw new Error("Read only property"); } }
    });
    /**
     * 
     * @returns {UnionType}
     * @class UnionType
     */
    function UnionType() {
        if (arguments.length > 1) {
            this.setTypes([].slice.call(arguments));
        } else if (arguments.length === 1) {
            var o = arguments[0];
            if (o instanceof String) {
                o = o.valueOf();
            }
            if (isArray(o)) {
                this.setTypes(o);
            } else if (isPlainObject(o)) {
                var types = o.types||o.typesList||o.elements;
                if (isArray(types)) {
                    this.setTypes(types);
                }
            } else if (typeof o === 'string') {
                this.setTypes(o.split(/\s*|\s*/g));
            } else {
                
            }
        }
    }
     
    UnionType.prototype = new FType();
    /**
     * 
     * @returns {type}
     */
    UnionType.prototype.getTypes = function() {
        return this._types;
    };
    /**
     * 
     * @param {type} types
     * @returns {UnionType}
     */
    UnionType.prototype.setTypes = function(types) {
        this._types = types;
        return this;
    };
    
    function ArrayDimension(o) {
        if (arguments.length > 0) {
            StatementElt.apply(this, arguments);
        }
    }
    
    
    ArrayDimension.prototype = new StatementElt();
    
    
    /**
     * 
     * @param {type} o
     * @returns {ArrayType}
     */
    function ArrayType(o) {
        this._dimensions = [];
        if (arguments.length === 2) {
            var typ = arguments[0];
            if (typ instanceof FType) {
                this._type = typ;
            } else if (typ.tokens) {
                this._type = new SType(typ);
            }  else if (typ.types) {
                this._type = new UnionType(typ);
            }
            var dims = arguments[1];
            if (dims instanceof Number) {               
               for (var i = 0, n = dims; i < n; i++) {
                   this._dimensions[i] = new ArrayDimension();
               }
            } else if (isArray(dims)) {
                for (var i = 0, n = dims.length; i < n; i++) {
                    this._dimensions[i] = new ArrayDimension(dims[i]);
                }
            }
        } else if (arguments.length > 1) {
            var args = [].slice.call(arguments);            
            for (var i = 0, n = args.length; i < n; i++) {
                this._dimensions[i] = new ArrayDimension(args[i]);
            }
        } else if (isArray(o)) {            
            for (var i = 0, n = o.length; i < n; i++) {
                this._dimensions[i] = new ArrayDimension(o[i]);
            }
        } else if (isPlainObject(o)) {
            if (o.type instanceof FType) {
                this._type = o.type;
            }
            if (o.dimensions instanceof Number) {               
               for (var i = 0, n = o.dimensions; i < n; i++) {
                   this._dimensions[i] = new ArrayDimension();
               }
            } else if (isArray(o.dimensions)) {
                var dims = o.dimensions;
                for (var i = 0, n = dims.length; i < n; i++) {
                    this._dimensions[i] = new ArrayDimension(dims[i]);
                }
            }
        }
        if (!this._type) {
            this._type = new SType("any");
        }
    }
    
    ArrayType.prototype = new FType();
    
    ArrayType.__CLASS__ = ArrayType;
    
    ArrayType.__CLASS_NAME__ = "ArrayType";
    
    ArrayType.prototype.__CLASS__ = ArrayType;
    
    ArrayType.prototype.__CLASS_NAME__ = "ArrayType";
    /**
     * 
     * @param {type} d
     * @returns {ArrayType.prototype}
     */
    ArrayType.prototype.addDimension = function(d) {
        this._dimensions[this._dimensions.length] = arguments.length === 0 ? new ArrayDimension() :  d instanceof ArrayDimension ? d: new ArrayDimension(d);
        return this;
    };
    /**
     * 
     * @param {type} fo
     * @returns {NTypeField}
     * @class NTypeField
     */
    function NTypeField(fo) {
        if (fo instanceof String) {
            fo = fo.valueOf();
        }
        if (typeof fo === 'string') {
            this.setName(fo);
            if (arguments.length > 1 && isPlainObject(arguments[1]) || typeof arguments[1] === 'string') {
                this.setType(arguments[1]);
            } else {
                this._name = "";
            }
        } else if (isPlainObject(fo)) {
            this.setName(fo.name||fo.Name||fo.typeName||fo.TypeName);
            this.setType(fo.type||fo.Type);
        } else {
            this._name = "";
        }
    }
    
    NTypeField.prototype = new StatementElt();
    
    NTypeField.__CLASS__ = NTypeField;
    
    NTypeField.__CLASS_NAME__ = "NTypeField";
    
    NTypeField.__SUPER_CLASS__ = StatementElt;
    
    NTypeField.prototype.__CLASS__ = NTypeField;
    
    /**
     * 
     * @param {type} name
     * @returns {Param}
     */
    NTypeField.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    NTypeField.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {type} type
     * @returns {NTypeField}
     */
    NTypeField.prototype.setType = function(type) {
        this._type = FType.getInstance(type);
        return this;
    };
    /**
     * 
     * @returns {FType}
     */
    NTypeField.prototype.getType = function() {
        return this._type;
    };
    /**
     * 
     * @returns {Boolean}
     */
    NTypeField.prototype.isOptional = function() {
        return this.__optional;
    };
    /**
     * 
     * @type NTypeField.prototype.isOptional|StatementElt.isOptional
     */
    NTypeField.prototype.isNullable =  NTypeField.prototype.isOptional;
    
    /**
     * 
     * @type NTypeField.prototype.isOptional|StatementElt.isOptional
     */
    NTypeField.prototype.setNullable =  NTypeField.prototype.setOptional;
    /**
     * 
     * @returns {Boolean}
     */
    NTypeField.prototype.isRequired =  function() {
        return !this.isOptional();
    };
    
    /**
     * 
     * @type NTypeField.prototype.isRequired|StatementElt.isRequired
     */
    NTypeField.prototype.isMandatory = NTypeField.prototype.isRequired;
    
    /**
     * 
     * @param {Boolean} o
     * @returns {NTypeField}
     */
    NTypeField.prototype.setOptional = function(o) {
        this.__optional = !!o;
        return this;
    };
    
    /**
     * 
     * @param {Boolean} required
     * @return {NTypeField}
     */
    NTypeField.prototype.setRequired =  function(required) {
        return this.setOptional(!toBool(required));
    };
    /**
     * 
     * @type NTypeField.prototype.setRequired|StatementElt.setRequired
     */
    NTypeField.prototype.setMandatory = NTypeField.prototype.setRequired;
    
    
    function Structure(s) {
        if (isArray(s)) {
            this.setFields(s);
        } else if (isPlainObject(s)) {
            var fields = s.fields||s.Fields;
            if (isArray(fields) || (isPlainObject(fields) && !FType.isType(fields))) {
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
    }
    
    /**
     * 
     * @param {type} fields
     * @returns {Structure}
     */
    Structure.prototype.setFields = function(fields) {
        this.__fields = [];
        this.__fieldTypes = {};
        this.__fieldMap = {};
        this.__fieldNames = [];
        if (isArray(fields)) {
            var n = fields.length, fo, i = 0, name;
            for (; i < n; i++) {
                fo = fields[i];
                if (!(fo instanceof NTypeField)) {
                    fo= new NTypeField(fo);
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
                    fo = new NTypeField(name, v = fields[name]);
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
    };
    
    /**
     * 
     * @param {String} fname The field name
     * @returns {Boolean}
     */
    Structure.prototype.hasField = function(fname) {
        return !!this.__fieldTypes[fname];
    };
    /**
     * 
     * @param {type} fname The field name
     * @returns {FType}
     */
    Structure.prototype.getType = function(fname) {
        return this.__fieldTypes[fname];
    };
    /**
     * 
     * @param {String|Number} fo The field name or the fieldindex
     * @returns {NTypeField}
     */
    Structure.prototype.getField = function(fo) {
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
    };
    /**
     * 
     * @param {NTypeField|Object} fo
     * @returns {Structure}
     */
    Structure.prototype.addField = function(fo) {
        if (!(fo instanceof NTypeField)) {
            fo = new NTypeField(fo);
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
    };
    
    
    
    /**
     * 
     * @param {type} [nt]
     * @returns {NamedType}
     * @class NamedType
     */
    function NamedType(nt) {
        
        if (nt instanceof String) {
            nt = nt.valueOf();
        }
        if (typeof nt === 'string') {
            this.setName(nt);
            if (arguments.length > 1 && isPlainObject(arguments[1])) {
                this.setStructure(arguments[1]);
            }
        } else if (isPlainObject(nt)) {
            this.setName(nt.name||nt.Name||nt.typeName||nt.TypeName);
            this.setStructure(nt.structure||nt.Structure||nt.fields||nt.Fields);
        }
    };
    
    NamedType.prototype = new FType();
    
    NamedType.__CLASS__ = NamedType;
    
    NamedType.__CLASS_NAME__ = "NamedType";
    
    NamedType.__SUPER_CLASS__ = FType;
    
    NamedType.prototype.__CLASS__ = NamedType;
    
    NamedType.prototype.__CLASS_NAME__ = "NamedType";
    
    NamedType.IS_TYPE_DEFAULT_STRICT = 'none';
    
    /**
     * 
     * @param {type} name
     * @returns {Param}
     */
    NamedType.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    NamedType.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {Object|Array} s  The structure metadata/definition or the structure' fields.
     * @returns {NamedType}
     */
    NamedType.prototype.setStructure = function(s) {
        this._structure = s instanceof Structure ? s : new Structure(s);
        return this;
    };
    /**
     * Returns true if the object is of this type
     * @param {type} obj
     * @param {Boolean} [strict=NamedType.IS_TYPE_DEFAULT_STRICT]
     * @returns {Boolean}
     */
    NamedType.prototype.isTypeOf = function(obj, strict) {
        if (arguments.length === 0) {
            throw new Error("The value/object argument not specified");
        }
        if (typeof strict === 'undefined' || strict === null) {
            var s = NamedType.IS_TYPE_DEFAULT_STRICT;
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
    };
    
    
    
    
    /**
     * 
     * @class
     */
    function Param() {
        var v;
        if (arguments.length === 1) {
            var o = arguments[0];
            if (isPlainObject(o)) {
                this.setName(o.name||o.Name||"");
                v = coalesceProp(o, 'defaultValue', "default", 'DefaultValue', 'Default');
                if (typeof v !== 'undefined') {
                    this.setDefaultValue(v);
                }
                if (o.comment||o.Comment) {
                    this.setComment(o.comment||o.Comment);
                }
                
                if (o.inlineComment||o.InlineComment) {
                    this.setInlineComment(o.inlineComment||o.InlineComment);
                }

                if (o.endComment||o.EndComment) {
                    this.setEndComment(o.endComment||o.EndComment);
                }
                if (typeof o.inlineEndComment !== 'undefined') {
                    this.setInlineEndComment(o.inlineEndComment);
                } else if (typeof o.InlineEndComment !== 'undefined') {
                    this.setInlineEndComment(o.InlineEndComment);
                } 
                if (typeof o.outerInlineEndComment !== 'undefined') {
                    this.setOuterInlineEndComment(o.outerInlineEndComment);
                } else if (typeof o.OuterInlineEndComment !== 'undefined') {
                    this.setOuterInlineEndComment(o.OuterInlineEndComment);
                } 
            } else if (typeof o === 'string') {
                this.setName(o);
            }
        } else if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setDefaultValue(arguments[1]);
            if (arguments.length > 2) {
                this.setComment(arguments[2]);
            }
        }
    }

    Param.prototype = new AParam();

    Param.__CLASS__ = Param;

    Param.__CLASS_NAME__ = "Param";

    Param.prototype.__CLASS__ = Param;

    Param.prototype.__CLASS_NAME__ = "Param";


    /**
     * 
     * @returns {Boolean}
     */
    Param.prototype.isExpression = function() {
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    Param.prototype.isStatement = function() {
        return false;
    };
    /**
     * 
     * @param {type} name
     * @returns {Param}
     */
    Param.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    Param.prototype.getName = function() {
        return this._name;
    };
    
    /**
     * 
     * @param {type} type
     * @returns {Param}
     */
    Param.prototype.setType = function(type) {
        this._type = type;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    Param.prototype.getType = function() {
        return this._type;
    };

    /**
     * 
     * @param {type} defaultValue
     * @returns {Param}
     */
    Param.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    Param.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    Param.prototype.isOptional = function() {
        return this.__optional === true;
    };

    /**
     * 
     * @returns {Boolean}
     */
    Param.prototype.isRequired =  function() {
        return this.__optional === false;
    };
    
    /**
     * 
     * @type Param.prototype.isRequired|StatementElt.isRequired
     */
    Param.prototype.isMandatory = Param.prototype.isRequired;
    /**
     * 
     * @returns {Boolean}
     */
    Param.prototype.getOptional = function() {
        return this.__optional;
    };
    
    /**
     * 
     * @param {Boolean} o
     * @returns {Param}
     */
    Param.prototype.setOptional = function(o) {
        this.__optional = !!o;
        return this;
    };
    
    /**
     * 
     * @param {Boolean} required
     * @return {Param}
     */
    Param.prototype.setRequired =  function(required) {
        return this.setOptional(!toBool(required));
    };
    /**
     * 
     * @type Param.prototype.setRequired|StatementElt.setRequired
     */
    Param.prototype.setMandatory = Param.prototype.setRequired;

    /**
     * 
     * @param {type} comment
     * @returns {Param}
     */
    Param.prototype.setComment = function(comment) {
        this._comment = comment;
        return this;
    };

    Param.prototype.getComment = function() {
        return this._comment;
    };
    
    /**
     * 
     * @param {type} comment
     * @returns {Param}
     */
    Param.prototype.setOuterInlineComment = function(comment) {
        this._outerInlineComment = comment;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    Param.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @returns {Boolean}
     */    
    Param.prototype.isRestParam = function() {
        return false;
    };
    
    /**
     * 
     * @returns {RestParam}
     * @class
     */
    function RestParam() {
        Param.apply(this, [].slice.call(arguments));
    }
    
    
    
    RestParam.prototype = new Param();
    
    RestParam.__CLASS__ = RestParam;

    RestParam.__CLASS_NAME__ = "RestParam";

    RestParam.prototype.__CLASS__ = RestParam;

    RestParam.prototype.__CLASS_NAME__ = "RestParam";
    
    /**
     * 
     * @returns {Boolean}
     */
    RestParam.prototype.isRestParam = function() {
        return true;
    };
    /**
     * <h3>Object Destructuring Element class</h3>
     * @returns {ODElt}
     * @class ODElt
     * @abstract
     * @see ODVariables
     * @see DOEntry
     * @see DNamedVariables
     * @see ODRest
     */
    function ODElt() {
        
    }
    
    ODElt.prototype = new StatementElt();
    
    /**
     * Returns the name.
     * </ul>
     * <li>For the sub-classes DOEntry and DNamedVariables, represents the property name : the name used to get value from object.</li>
     * <li>For the sub-class ODRest, represents the object destructuring variable name.</li>
     * </ul>
     * @returns {String}
     */
    ODElt.prototype.getName = function() {
        return this._name;
    };
     
    /**
     * Sets the name.
     * @param {String} name
     * @returns {ODElt}
     */
    ODElt.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    
    /**
     * <h3>Object Destructuring Variable/Entry class<h3>
     * @param {type} e
     * @returns {DOEntry}
     * @class DOEntry
     * @super ODElt
     */
    function DOEntry(e) {
        if (arguments.length === 1) {
            if (e instanceof String) {
                e = e.toString();
            }
            if (typeof e === 'string') {
                this._name = e;
                this._alias = "";
            } else if (isPlainObject(e)) {
                this._name = e.name||e.Name||e.property||e.Property;
                this._alias = e.alias||e.Alias||"";
                if (hasOwnProp(e, 'defaultValue')) {
                    this._defaultValue = e.defaultValue;
                } else if (hasOwnProp(e, 'DefaultValue')) {
                    this._defaultValue = e.DefaultValue;
                } else if (hasOwnProp(e, 'value')) {
                    this._defaultValue = e.value;
                } else if (hasOwnProp(e, 'Value')) {
                    this._defaultValue = e.Value;
                } else if (hasOwnProp(e, 'default')) {
                    this._defaultValue = e.default;
                } else if (hasOwnProp(e, 'Default')) {
                    this._defaultValue = e.Default;
                }
            }
        } else if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setAlias(arguments[1]);
            if (arguments.length > 2) {
                this.setDefaultValue(arguments[2]);
            }
        }
    }
    
    DOEntry.prototype = new ODElt();
    
    DOEntry.__CLASS__ = DOEntry;
    
    DOEntry.__CLASS_NAME__ = "DOEntry";
    
    DOEntry.__SUPER_CLASS__ = ODElt;
    
    DOEntry.prototype.__CLASS__ = DOEntry;
    
    DOEntry.prototype.__CLASS_NAME__ = "DOEntry";
    
    /**
     * 
     * @returns {String}
     */
    DOEntry.prototype.getAlias = function() {
        return this._alias;
    };
     
    /**
     * 
     * @param {type} alias
     * @returns {DOEntry.prototype} };
     */
    DOEntry.prototype.setAlias = function(alias) {
        this._alias = alias;
        return this;
    };
    /**
     * 
     * @type DOEntry.prototype.setAlias
     * @alias
     */
    DOEntry.prototype.setIdentifier = DOEntry.prototype.setAlias;
    /**
     * 
     * @type DOEntry.prototype.getAlias
     * @alias
     */
    DOEntry.prototype.getIdentifier = DOEntry.prototype.getAlias;
    /**
     * 
     * @returns {String}
     */
    DOEntry.prototype.getVariableName = function() {
        if (this._alias) {
            return this._alias;
        }
        return this._name;
    };
    /**
     * 
     * @returns {Expression}
     */
    DOEntry.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
     
    /**
     * 
     * @param {Expression} defaultValue
     * @returns {DOEntry};
     */
    DOEntry.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    };
    /**
     * Returns the property name : the name used to get the value from the object.
     * <p>DOEntry.prototype.getProperty is an alias of DOEntry.prototype.getName</p>
     * @alias DOEntry.prototype.getProperty DOEntry.prototype.getName
     * @returns {String}
     */
    DOEntry.prototype.getProperty = DOEntry.prototype.getName;
    /**
     * Sets the property name : the name used to get the value from the object.
     * <p>DOEntry.prototype.getProperty is an alias of DOEntry.prototype.getName</p>
     * @alias DOEntry.prototype.setProperty DOEntry.prototype.setName
     * @param {String} property
     * @returns {DOEntry}
     */
    DOEntry.prototype.setProperty = DOEntry.prototype.setName;
    /**
     * 
     * @param {type} [ind]
     * @param {type} [indentFirstLine]
     * @returns {String}
     */
    DOEntry.prototype.getInlineStatementString = function(ind, indentFirstLine) {
        var str= "", c = this.getComment();

        if (c) {
            str += c.toString(true) + "\n";
        }
        
        c = this.getInlineComment();
        if (c) {
            str += c.getInlineString() + " ";
        }
        
        str += this.getName();
        
        //TODO: add comments
        
        var v = this.getAlias();
        if (v) {
            //TODO: add comments
            str += ":";
            //TODO: add comments
            str += v;
        }
        v = this.getDefaultValue();
        if (v && !(v instanceof Value && v.isNaV())) {
            str += "="; 
            //TODO: add comments
            str += v.toString(true);
        }
        
        c = this.getInlineEndComment();
        if (c) {
            str += " " + c.getInlineString();
        }
        c = this.getEndComment();
        if (c) {
            str += c.toString(true);
        }
        return str;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    DOEntry.prototype.getStatementString = function(ind, indentFirstLine) {
        var str= "", c = this.getComment(), _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        if (c) {
            str += c.toString(ind, false) + "\n" + _ind;
        }
        
        c = this.getInlineComment();
        if (c) {
            str += c.getInlineString() + " ";
        }
        
        str += this.getName();
        
        //TODO: add comments
        
        var v = this.getAlias();
        if (v) {
            //TODO: add comments
            str += ":";
            //TODO: add comments
            str += v;
        }
        v = this.getDefaultValue();
        if (v && !(v instanceof Value && v.isNaV())) {
            str += "="; 
            //TODO: add comments
            str += v.toString(ind, false);
        }
        
        c = this.getInlineEndComment();
        if (c) {
            str += " " + c.getInlineString();
        }
        c = this.getEndComment();
        if (c) {
            str += c.toString(ind, true);
        }
        return str;
    };
    /**
     * @property {String} name  The property name : to get the value from the object
     * @property {String} property  The property name : to get the value from the object. An alias of name
     * @property {String} identifier  The identifier or alias : represents the variable name
     * @property {String} alias  The identifier or alias : to get the value from the object. An alias of identifier
     * @property {Expression} defaultValue The default value
     * @property {String} variableName The variable name corresponding to this DOEntry object.
     */
    Object.defineProperties(DOEntry.prototype, {
        name: { get: DOEntry.prototype.getName, set: DOEntry.prototype.setName },
        property: { get: DOEntry.prototype.getProperty, set: DOEntry.prototype.setProperty },
        alias: { get: DOEntry.prototype.getAlias, set: DOEntry.prototype.setAlias },
        identifier: { get: DOEntry.prototype.getIdentifier, set: DOEntry.prototype.setIdentifier },
        defaultValue: { get: DOEntry.prototype.getDefaultValue, set: DOEntry.prototype.setDefaultValue },
        variableName: { get: DOEntry.prototype.getVariableName, set: function() { throw new Error("Read only property"); } }
    });
    
    
    
    /**
     * <h3>Destructuring Named Variables class</h3>
     * Object Destructuring entry with following properties:
     * <ul>
     * <li>name: the property/entry name with getName getter accessor (read) 
     * method and setName setter accessor (set or mutator) method</li>
     * <li>variables: array or object destructuring variables  with getVariables
     * getter accessor (read) 
     * method and setVariables setter accessor (set or mutator) method</li>
     * <li>defaultValue: the default value with getDefaultValue getter accessor 
     * (read) method and setDefaultValue setter accessor (set or mutator) 
     * method.</li>
     * </ul>
     * <p>This object is used for composite (multi-level) access to 
     * properties/fields values.</p>
     * @param {Object|String} n The de Destructuring Named Variables 
     *      metadata/definition object or the property/entry name 
     * @param {ODVariables|ADVariables} [v] Object or array  destructuring 
     *      variables
     * @param {VObject|VArray} [defVal]  The default value: when object 
     *      destructuring variables, the default value must be an instance of 
     *      VObject and when it's array  destructuring variables,  the default 
     *      value must be an instance of VArray.
     * @returns {DNamedVariables}
     * @class DNamedVariables
     * @super ODElt
     */
    function DNamedVariables(n, v, defVal) {
        if (arguments.length === 1) {
            if (n instanceof String) {
                n = n.toString();
            }
            if (typeof n === 'string') {
                this._name = n;
            } else if (isPlainObject(n)) {
                this._name = n.name||n.Name||n.property||n.Property;
                this.setVariables(n.variables||n.Variables);
                if (hasOwnProp(n, 'defaultValue')) {
                    this._defaultValue = n.defaultValue;
                } else if (hasOwnProp(n, 'DefaultValue')) {
                    this._defaultValue = n.DefaultValue;
                } else if (hasOwnProp(n, 'value')) {
                    this._defaultValue = n.value;
                } else if (hasOwnProp(n, 'Value')) {
                    this._defaultValue = n.Value;
                } else if (hasOwnProp(n, 'default')) {
                    this._defaultValue = n.default;
                } else if (hasOwnProp(n, 'Default')) {
                    this._defaultValue = n.Default;
                }
            }
        } else if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setVariables(arguments[1]);
            if (arguments.length > 2) {
                this.setDefaultValue(arguments[2]);
            }
        }
    }
    
    DNamedVariables.prototype = new ODElt();
    
    DNamedVariables.__CLASS__ = DNamedVariables;
    
    DNamedVariables.__CLASS_NAME__ = "DNamedVariables";
    
    DNamedVariables.__SUPER_CLASS__ = ODElt;
    
    DNamedVariables.prototype.__CLASS__ = DNamedVariables;
    
    DNamedVariables.prototype.__CLASS_NAME__ = "DNamedVariables";
    
    
    /**
     * Returns the property name used to get value (array or object) from plain 
     * object. 
     * <p>The destructuring named variables values  are obtained from the value 
     * (array or object) corresponding to the property name.</p>
     * @returns {String}
     */
    DNamedVariables.prototype.getName = function() {
        return this._name;
    };
     
    /**
     * Sets destructuring the property name used to get value (array or object) 
     * from plain object and returns this destructuring Named Variables object.
     * @param {String} name
     * @returns {DNamedVariables} 
     */
    DNamedVariables.prototype.setName = function(name) {
        this._name = ODVariables.getName(name);
        return this;
    };
    /**
     * Returns the object destructuring variables or the array destructuring 
     * variables  to get variables values from the object (array or plain 
     * object) obtained using the property name (name property or 
     * getName() method call).
     * @returns {ODVariables|ADVariables}
     */
    DNamedVariables.prototype.getVariables = function() {
        return this._variables;
    };
     
    /**
     * Sets destructuring variables and returns this Destructuring Named 
     * Variables object.
     * @param {ODVariables|ADVariables} variables Object destructuring variables
     *      or the array destructuring variables.
     * @returns {DNamedVariables} 
     */
    DNamedVariables.prototype.setVariables = function(variables) {
        if (!(variables instanceof ODVariables || variables instanceof  ADVariables)) {
            throw new Error("Destructuring options or array expecetd");
        }
        this._variables = variables;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    DNamedVariables.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
     
    /**
     * 
     * @param {type} defaultValue
     * @returns {DNamedVariables};
     */
    DNamedVariables.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    DNamedVariables.prototype.getInlineStatementString = function() {
        var str= "", c = this.getComment();

        if (c) {
            str += c.toString(true) + "\n";
        }
        
        c = this.getInlineComment();
        if (c) {
            str += c.getInlineString() + " ";
        }
        
        str += this.getName();
        
        //TODO: add comments
        
        var v = this.getVariables();
        if (v) {
            //TODO: add comments
            str += ":";
            //TODO: add comments
            str += v.toString(true);
        }
        v = this.getDefaultValue();
        if (v && !(v instanceof Value && v.isNaV())) {
            str += "="; 
            //TODO: add comments
            str += v.toString(true);
        }
        
        c = this.getInlineEndComment();
        if (c) {
            str += " " + c.getInlineString();
        }
        c = this.getEndComment();
        if (c) {
            str += c.toString(true);
        }
        return str;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    DNamedVariables.prototype.getStatementString = function(ind, indentFirstLine) {
        var str= "", c = this.getComment(), _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        if (c) {
            str += c.toString(ind, false) + "\n" + _ind;
        }
        
        c = this.getInlineComment();
        if (c) {
            str += c.getInlineString() + " ";
        }
        
        str += this.getName();
        
        //TODO: add comments
        
        var v = this.getVariables();
        if (v) {
            //TODO: add comments
            str += ":";
            //TODO: add comments
            
            str += v.toString(ind, false);
        }
        v = this.getDefaultValue();
        if (v && !(v instanceof Value && v.isNaV())) {
            str += "="; 
            //TODO: add comments
            str += v.toString(ind, false);
        }
        
        c = this.getInlineEndComment();
        if (c) {
            str += " " + c.getInlineString();
        }
        c = this.getEndComment();
        if (c) {
            str += c.toString(ind, true);
        }
        return str;
    };
    /**
     * 
     */
    Object.defineProperties(DNamedVariables.prototype, {
        name: { get: DNamedVariables.prototype.getName, set: DNamedVariables.prototype.setName },
        variables: { get: DNamedVariables.prototype.getVariables, set: DNamedVariables.prototype.setVariables },
        defaultValue: { get: DNamedVariables.prototype.getDefaultValue, set: DNamedVariables.prototype.setDefaultValue }
    });
    
    
    
    
    /**
     * <h3>Object Destructuring Rest of elements class</h3>
     * @param {String|Object} r  The rest of elements variables name or the rest of elements metadata/definition
     * @param {VObject|Object} [defVal]  The default value: 
     * @returns {ODRest}
     * @class ODRest
     * @super ODElt
     */
    function ODRest(r, defVal) {
        function isDefaultValue(v) {
            return typeof v !== 'undefined' && v !== null && !(v instanceof Value && v.isNaV());
        }
        if (r instanceof String) {
            r = r.valueOf();
        }
        if (typeof r === 'string') {
            this.setName(r);
            var v = arguments[1];
            if (isDefaultValue(v)) {
                this.setDefaultValue(v);
            }
        } else if (isPlainObject(r)) {
            this.setName(r.name||r.Name);
            var v = arguments.length > 1 ? defVal : coalesceProp(r, 'defaultValue', 'DefaultValue', 'default', 'Default');
            if (isDefaultValue(v)) {
                this.setDefaultValue(v);
            }
        }
    }
    ODRest.prototype = new ODElt();
    
    ODRest.__CLASS__ = ODRest;
    
    ODRest.__CLASS_NAME__ = "ODRest";
    
    ODRest.__SUPER_CLASS__ = ODElt;
    
    ODRest.prototype.__CLASS__ = ODRest;
    
    ODRest.prototype.__CLASS_NAME__ = "ODRest";
    
    /**
     * 
     * @returns {VObject}
     */
    ODRest.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
     
    /**
     * 
     * @param {VObject|Object} defaultValue
     * @returns {ODRest};
     */
    ODRest.prototype.setDefaultValue = function(defaultValue) {
        if (defaultValue === null) {
            defaultValue = undefined;
        } else if (typeof defaultValue !== 'undefined') {
            if (!isPlainObject(defaultValue)) {
                throw new Error("Incorrect default value");
            }
            if (!(defaultValue instanceof VObject || (defaultValue instanceof Value && defaultValue.isNaV()))) {
                if (defaultValue instanceof Expression) {
                    throw new Error("Incorrect default value");
                }
                defaultValue = new VObject(defaultValue);
            }
        }
        this._defaultValue = defaultValue;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    ODRest.prototype.isYield = function() {
        return false;
    };
    /**
     * 
     * @param {Number} ind
     * @param {type} indentFirstLine
     * @returns {Boolean}
     */
    ODRest.prototype.getStatementString = function(ind,indentFirstLine) {
        var str = "";
        var _ind = "";
        
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        str += "..." + (this._name||"");
        if (this._defaultValue) {
            str += "=" + this._defaultValue.toString(ind, false); 
        }
        return str;
    };
    
    ODRest.prototype.getInlineStatementString = function() {
        var str = "..." + (this._name||"");
        if (this._defaultValue) {
            str += "=" + this._defaultValue.toString(true); 
        }
        return str;
    };
    
    
    
    
    
    /**
     * 
     * <h3>Object Destructuring variables</h3>
     * @returns {ODVariables}
     * @class ODVariables
     */
    function ODVariables() {
        /**
         * Each key represents a name used to get value of a variable from the object.
         * Each value represents the default value of the corresponding variable
         */
        this._properties = {};
        /**
         * The list of names used to get values of the variables from the object
         */
        this._names = [];
        /**
         * 
         * Each key represents a name used to get value of a variable from the object
         * Each value represents an alias/identifier. An alias is a name of a variable.
         */
        this._aliases = {};
        /**
         * Each key represents an alias/identifier. An alias is a name of a variable.
         * Each value represents a name used to get value of a variable from the object
         */
        this._aliasNames = {};
        
        this._entries = [];
        /**
         * 
         */
        this._comments = {};
        
        this.yields = 0;
        
        this._optionalChaining = false;
        var a = arguments[0];
        if (arguments.length === 1) {            
            if (isPlainObject(a)) {
                if (hasOwnProp(a, 'variables') || hasOwnProp(a, 'names') || hasOwnProp(a, 'entries') || hasOwnProp(a, 'properties') || hasOwnProp(a, 'comments')) {
                    this.put(a.variables||a.entries||a.properties||a.names);
                    this.setComments(a.comments);
                } else {
                    this.put(a);
                }
                if (hasOwnProp(a, 'optionalChaining')) {
                    this._optionalChaining = toBool(a.optionalChaining);
                }
            } else if (isArray(a)) {
                this.setEntries(a);
            }
        } else if (isArray(a) && typeof arguments[1] === 'boolean') {
            this.put(a);
            this._optionalChaining = arguments[1];
        } else if (arguments.length > 0) {
            this.put.apply(this, [].slice.call(arguments));
        }
    }
    /**
     * 
     * @type AParam
     */
    ODVariables.prototype = new AParam();
    
    /**
     * 
     * @type String
     */
    ODVariables.__CLASS_NAME__ = 'ODVariables';
    /**
     * 
     * @type Function
     */
    ODVariables.__CLASS__ = ODVariables;
    
    /**
     * 
     * @type Function
     */
    ODVariables.__SUPER_CLASS__ = AParam;
    /**
     * 
     * @type String
     */
    ODVariables.prototype.__CLASS_NAME__ = 'ODVariables';
    /**
     * 
     * @type Function
     */
    ODVariables.prototype.__CLASS__ = ODVariables;
    
    /**
     * 
     * @type RegExp
     */
    ODVariables.NAME_REGEX = /^[a-zA-Z$_][a-zA-Z$_0-9]*$/;
    /**
     * Returns the given name if it's a valid name. Otherwise, throw an exception.
     * @param {String} n
     * @param {Boolean] [property=false] The value true specify to accept quoted string and computed object property name (name starts with'[' and ends with ']'
     * @returns {String}
     * @throws {Error}
     */
    ODVariables.getName = function(n, property) {
        if (n instanceof String) {
            n = n.toString();
        } else if (typeof n !== 'string') {
            throw new Error("String expected");
        }
        if (!ODVariables.NAME_REGEX.exec(n)) {
            if (property) {
                var ch = n[0];
                if (ch === '[') {
                    var open = 1;
                    if (n[n.length - 1] !== ch) {
                        throw new Error("Invalid name: '" + n + "'");
                    }
                    for (var i = 1,len = n.length;i < len; i++) {
                        ch = n[i];
                        if (ch === '\\') {
                            if (n[i + 1] === ']') {
                                i++;
                            }
                        } else if(ch === ']') {
                            if (open === 1) { 
                                if (i !== len - 1) {
                                    throw new Error("Invalid name: '" + n + "'");
                                }
                            }
                            open--;
                        } else if(ch === '[') {
                            open++;
                        }
                    }
                    return n;
                } else if (ch === '\'' || ch === '"') {
                    if (!QString.isQuotedString(n)) {
                        throw new Error("Invalid name: '" + n + "'");
                    }
                    return n;
                }
            }
            throw new Error("Invalid name: '" + n + "'");
        }
        return n; 
    };
    /**
     * Returns the default value of the gien name or index
     * @param {String|Number} n   The name or the index
     * @returns {Expression}
     */
    ODVariables.prototype.getDefaultValue = function(n) {
        if (n instanceof Number) {
            n = n.valueOf();
        } else if (n instanceof String) {
            n = n.valueOf();
        }
        var name;
        if (typeof n === 'number') {
            name = this._names[n];
            if (!name) {
                throw new Error("Incorrect index: " + n);
            }
        } else if (typeof n === 'string') {
            name = n;
        } else {
            throw new Error("Incorrect argument");
        }
        return this._properties[name];
    };    
    /**
     * Returns the default value of the gien name or index
     * @param {String|Number} n   The name or the index
     * @returns {Expression}
     * @alias ODVariables.prototype.getDefaultValue
     */
    ODVariables.prototype.getDefault = ODVariables.prototype.getDefaultValue;
    
    /**
     * 
     * @alias ODVariables.prototype.getDefaultValue
     * @deprecated
     */
    ODVariables.prototype.get = ODVariables.prototype.getDefaultValue;
    /**
     * 
     * @param {Boolean} [refresh=false]
     * @returns {Array}
     */
    ODVariables.prototype.getEntries = function(refresh) {
        if (!this._entries || refresh) {
            var v =  [], n = v.length, name, names = this._names,
                    ps = this._properties,
                    entries = [], e;
            for (var i = 0, n = names.length; i< n; i++) {
                name = names[i];
                if (hasOwnProp(ps, name)) {
                    entries[i] = new DOEntry(name, this._aliasNames[name], ps[name]);
                }
            }
            this._entries = entries;
        }
        return this._entries;
        
    };
    /**
     * Clears the entries, property names, aliases and default values and returns this objectpppppp.
     * @returns {ODVariables}
     */
    ODVariables.prototype.clear = function() {
        /**
         * Each key represents a name used to get value of a variable from the object.
         * Each value represents the default value of the corresponding variable
         */
        this._properties = {};
        /**
         * The list of names used to get values of the variables from the object
         */
        this._names = [];
        /**
         * 
         * Each key represents a name used to get value of a variable from the object
         * Each value represents an alias/identifier. An alias is a name of a variable.
         */
        this._aliases = {};
        /**
         * Each key represents an alias/identifier. An alias is a name of a variable.
         * Each value represents a name used to get value of a variable from the object
         */
        this._aliasNames = {};
        
        this._entries = [];
        return this;
    };
    /**
     * Returns the names used to get values of the variables from the object
     * @returns {Array&lt;String&gt;}
     */
    ODVariables.prototype.getNames = function() {
        return [].slice.call(this._names);
    };
    /**
     * Returns the names of the variables
     * @returns {Array&lt;String&gt;}
     */
    ODVariables.prototype.getVariableNames = function() {
        var v =  [], n = v.length, name, ps = this._properties;
        for (var name in ps) {
            if (ps.hasOwnProperty(name)) {
                v[v.length] = this._aliases[name]||name;
            }
        }
        return v;
    };
    /**
     * 
     * @param {type} varName
     * @returns {Boolean}
     */
    ODVariables.prototype.hasVariable = function (varName) {
        return this._aliasNames[varName] ? true : this._names.indesOf(varName) >= 0;
    };
    /**
     * <h3>Syntax</h3>
     * <ul>
     * <li>put({String} name, {type} value)</li>
     * <li>put({Array&lt;Stringgt;> names, {Array} values)</li>
     * <li>put({Array&lt;Stringgt;> pairs)</li>
     * <li>put({Object} props)</li>
     * <li>put({Object} entry1, {Object} entry1, , , ...{Object} entryN)</li>
     * <li>put({String} str1, {String} str2, , , {String} str(2n -1), {String} str(2n)): an array repreenting pairs of anmes and aliases</li>
     * </ul>
     * @param {String} prop
     * @param {type} value
     * @returns {ODVariables}
     */
    ODVariables.prototype.put = function(prop, value) {
        if (arguments.length === 0) {
            throw new Error("At leat one argument expected");
        }
        var self = this, v, e;
        /**
         * 
         * @private
         * @param {type} prop  The property name : to get the value from the object
         * @param {String} id  The identifier or alias : represents the variable name
         * @param {type} defVal The default value
         * @returns {DOEntry}  The entry instance
         * 
         */
        function newEntry(prop, id, defVal) {
            self._aliases[prop] = ODVariables.getName(id);
            self._aliasNames[id] = prop;
            return new DOEntry(prop, id, defVal);
        }
        function setArray(arr) {
            if (arr.length === 2) {
                if (isString(arr[0])) {
                    var name = arr[0].toString();
                    var v = arr[1];
                    if (name.startsWith("...")) {
                        if (self._restName) {
                            throw new Error("Too many rest name");
                        }
                        name = ODVariables.getName(name.substring(3));
                        self._names[self._names.length] = self._restName = name;
                        if (v) {
                            self._properties[name] = Expression.getInstance(v);
                        }
                    } else if (hasOwnProp(v, 'alias') ||hasOwnProp(v, 'identifier') || hasOwnProp(v, 'variableName') || hasOwnProp(v, 'variable')) {
                        name = ODVariables.getName(name);
                        var alias = v.alias||v.identifier||v.variableName||v.variable;
                        v = v.defaultValue||v.DefaultValue||v.value||v.Value;
                        self._properties[name] = v ? Expression.getInstance(v) : undefined;
                        if (self._names.indexOf(name) <  0) {
                            self._names[self._names.length] = name;
                        }
                        if (alias) {
                            self._aliases[name] = alias = ODVariables.getName(alias);
                            self._aliasNames[alias] = name;
                        }
                    } else {
                        name = ODVariables.getName(name);
                        self._properties[name] = Expression.getInstance(v);
                        if (self._names.indexOf(name) <  0) {
                            self._names[self._names.length] = name;
                        }
                    }
                } else if (isArray(arr[0]) && isArray(arr[1])) {
                    var names = arr[0], name,
                            values = arr[1],
                            n = names.length;
                    for (var i = 0; i <n; i++ ) {
                        name = names[i];
                        if (self._restName) {
                            if (name.startsWith("...")) {
                                throw new Error("Too many rest name");
                            }
                            self.splice(self._names.length - 1, 0, ODVariables.getName(name));
                        } else if (name.startsWith("...")) {
                            name = name.substring(3);
                            self._names[i] = ODVariables.getName(name);
                            self._restName = name;
                        } else {
                            self._names[i] = ODVariables.getName(name);
                        }
                        self._properties[name] = Expression.getInstance(values[i]);
                    }
                }
            } else if (arr.length > 2) {
                if (isArray(arr[0])) {
                    var n = arr.length, name, entry, alias;
                    for (var i = 0; i <n; i++ ) {
                        entry =  arr[i];
                        if (self._restName) {
                            if (name.startsWith("...")) {
                                throw new Error("Too many rest name");
                            }
                            throw new Error("Rest name must be the last element/entry");
                        }
                        name = entry[0];
                        if (name.startsWith("...")) {
                            name = ODVariables.getName(name.subst8+ring(3));
                            self._restName = name;
                        } else {
                            name = ODVariables.getName(name);                                
                        }
                        self._names[i] = name;
                        if (entry.length === 2) {
                            self._properties[name] = Expression.getInstance(entry[1]);
                        } else  if (entry.length > 2) {
                            this._aliases[name] = alias = ODVariables.getName(entry[1]);
                            this._aliasNames[alias] = name;
                            self._properties[name] = Expression.getInstance(entry[2]);
                        }                        
                    }
                } else if (isPlainObject(arr[0])) {
                    var n = arr.length,
                        name, prop,
                        entry = arr[0],
                        name = coalesceProperty(entry, ['name', 'variable', 'variableName', 'key', 'option', 'property', 'Name', 'Variable', 'VariableName', 'Key', 'Option', 'Property']),
                        alias, 
                        aliasKey;
                    
                    for (var i = 0; i <n; i++ ) {
                        entry =  arr[i];
                        prop = entry[name];
                        if (prop.startsWith("...")) {
                            if (self._restName) {
                                throw new Error("Too many rest name");
                            }
                            prop = ODVariables.getName(prop.substring(3));
                        } else {
                            if (self._restName) {
                                throw new Error("Rest name must be the last element/entry");
                            }
                            prop = ODVariables.getName(prop);
                            if (!aliasKey) {
                                aliasKey = coalesceProperty(entry, ['alias', 'Alias', 'identifier', 'Identifier']);
                                if (aliasKey)
                                    alias = entry[aliasKey];
                            } else
                                alias = entry[aliasKey];
                            if (alias) {
                                self._aliases[prop] = ODVariables.getName(alias);
                                self._aliasNames[alias] = prop;
                            }
                        }
                        
                        self._properties[prop] = Expression.getInstance(entry.value||entry.Value);
                        self._names[i] = prop;
                        
                    }
                } else {
                    var n = arr.length, name;
                    n = (n - (n % 2))/2;
                    for (var i = 0; i <n; i++ ) {  
                        name= arr[2*i];
                        self._properties[ODVariables.getName(name)] = Expression.getInstance(arr[2*i+1]);
                        self._names[i] = name;
                    }
                }
            }
        } // end setArray function
        
        function _putEntries(o) {
            var i = 0, e, aliasKey, valueKey, alias, val;
            for (var name in o) {
                if (hasOwnProperty(o, name)) {
                    v = o[name];
                    if (name.startsWith("...")) {
                        if (this._restName) {
                            throw new Error("Toomany rest name");
                        }
                        name = name.substring(3);
                        this._restName = name;
                        this._names[i++] = ODVariables.getName(name);
                        if (v) {
                            this._properties[name] = Expression.getInstance(v);
                        }
                    } else if (aliasKey) {
                        alias = v[aliasKey];
                    } else {
                        if (hasOwnProperty(v, 'alias')) {
                            alias = v[aliasKey = 'alias'];
                        } else if (hasOwnProperty(v, 'identifier')) {
                            alias = v[aliasKey = 'identifier'];
                        } else {
                            alias = undefined;
                        }
                    }
                    if (valueKey) {
                        val = v[valueKey];
                    } else {
                        if (hasOwnProperty(v, 'default')) {
                            val = v[valueKey = 'default'];
                        } else if (hasOwnProperty(v, 'Default')) {
                            val = v[valueKey = 'Default'];
                        } else if (hasOwnProperty(v, 'defaultValue')) {
                            val = v[valueKey = 'defaultValue'];
                        } else if (hasOwnProperty(v, 'value')) {
                            val = v[valueKey = 'value'];
                        } else if (hasOwnProperty(v, 'Value')) {
                            val = v[valueKey = 'Value'];
                        } else {
                            val = undefined;
                        }
                    }
                    if (this._restName) {
                        this._names.splice(this._names.length - 1, 0, ODVariables.getName(name));
                    } else {
                        this._names[i++] = ODVariables.getName(name);
                    }
                    if (val === undefined && alias === undefined) {
                        this._properties[name] = Expression.getInstance(v);
                    } else {
                        if (alias !== 'undefined') {
                            this._aliases[name] = ODVariables.getName(alias);
                        }
                        if (val !== 'undefined') {
                            this._properties[name] = Expression.getInstance(val);
                        }
                    }
                    
                }
            }
        } 
        
        function _getEntry(o) {
            var ltyp = (o.type||'').toLowerCase();
            return ['', 'variable', 'dvariable', 'entry', 'dentry', 'name', 'dname'].indexOf(ltyp) >= 0 
                ? new DOEntry(o) : ['array', 'darray'].indexOf(ltyp) >= 0 
                ? new DNamedVariables(o.name||o.Name, (vars = o.variables || o.entries || o.Variables || o.Entries) instanceof ADVariables ? vars : new ADVariables(vars), o.defaultValue||o.DefaultValue) :  ['options', 'doptions', 'object', 'dobject'].indexOf(ltyp) >= 0 
                ? new DNamedVariables(o.name||o.Name, (vars = o.variables || o.entries || o.Variables || o.Entries) instanceof ODVariables ? vars : new ODVariables(vars), o.defaultValue||o.DefaultValue): ['rest', 'remain'].indexOf(ltyp) >= 0 
                ? new ODRest(o) : ['dnvariables', 'dnvars', 'nvariables', 'nvars'].indexOf(ltyp) >= 0 
                ? new DNamedVariables(o) : null;
        }
        
        function _entry(name, alias, v) {
            if (self._names.indexOf(name) <  0) {
                self._names[self._names.length] = name;
            }
            if (alias instanceof String) {
                alias = alias.valueOf();
            }
            self._properties[name] = v ? v = Expression.getInstance(v) : undefined;
            if (alias) {
                self._aliases[name] = alias = ODVariables.getName(alias);
                self._aliasNames[alias] = name;
                return new DOEntry(name, alias, v);
            } else {
                return  new DOEntry(name, "", v);
            }
        }
        
        function _putEntry(e) {
            
            if (e instanceof ODRest) {
                if (self._restName) {
                    throw new Error("Too many rest name");
                }
                self._names[self._names.length] = e.getName();
                if ((v = e.getDefaultValue())) {
                    self._properties[e.getName()] = v;
                }
                self._entries[self._entries.length] = e;
                self._restName = e.getName();
            } else {
                self._names[self._names.length] = e.getName();
                self._entries[self._entries.length] = e;
                if (e.getDefaultValue && (v = e.getDefaultValue())) {
                    self._properties[e.getName()] = v;
                    if (typeof v.isYield === 'function' && v.isYield()) {
                        this.yields++;
                    }
                }
                if (e.getAlias && (v = e.getAlias())) {
                    v = ODVariables.getName(v);
                    self._aliases[e.getName()] = v;
                    self._aliasNames[v] = e.getName();
                }
            }
        }
        
        function _getDNamedVars(prop, a, defVal) {
            if (!(a instanceof ODVariables || a instanceof ADVariables)) {
                var type = (a.type||a.Type||"").toLowerCase(),
                    vars = a.variables||a.Variables||a.entries||a.Entries,
                    optionalChaining = toBool(coalesceProp(a, ['optionalChaining', 'OptionalChaining'])||false);
                if (isArray(vars)) {
                    if (type === 'darray' || type === 'array') {
                        a = new ADVariables(vars, optionalChaining);
                    } else if (type === 'dobject' || type === 'object' || type === 'dobj' || type === 'obj') {
                        a = new ODVariables(vars, optionalChaining);
                    }
                } else {
                    throw new Error("Incorrect argument");
                }
            }
            if (this._names.indexOf(prop) <  0) {
                this._names[this._names.length] = prop;
            }
            return new DNamedVariables(prop, a, defVal);
        }
        
        if (arguments.length === 1) {
            var name;
            var o = arguments[0];
            if (isArray(o)) {
                setArray(o);
                return this;
            }
            if (o instanceof ODRest) {
                if (this._restName) {
                    throw new Error("Too many rest name");
                }
                this._names[this._names.length] = name = o.getName();
                if ((v = o.getDefaultValue())) {
                    this._properties[name] = v;
                }
                this._entries[this._entries.length] = o;
                this._restName = name;
                return this;
            }
            if (o instanceof ODElt) {
                this._names[this._names.length] = name = o.getName();
                this._entries[this._entries.length] = o;
                if (o.getDefaultValue && (v = o.getDefaultValue())) {
                    this._properties[name] = v;
                }
                if (o.getAlias && (v = o.getAlias())) {
                    v = ODVariables.getName(v);
                    this._aliases[name] = v;
                    this._aliasNames[v] = name;
                }
                return this;
            }
            if (!isPlainObject(o)) {
                throw new Error("Incorrect argument");
            }
            var e;
            if ((e = _getEntry(o))) {
                _putEntry(e);
            } else {
                _putEntries(o);
            }
            return this;
        } else if (arguments.length === 2) {
            var arr = arguments, 
                name = ODVariables.getName(arr[0].toString());
            var v = arr[1];
            if (typeof v === 'undefined' || v === null) {
                e = _entry(name);
            } else if (v instanceof ODVariables || v instanceof ADVariables) {
                e = new _getDNamedVars(name, v);
            } else if (hasOwnProp(v, 'alias') ||hasOwnProp(v, 'identifier') || hasOwnProp(v, 'variableName') || hasOwnProp(v, 'variable')) {
                e = _entry(name, v.alias||v.identifier||v.variableName||v.variable||"", v.defaultValue||v.DefaultValue||v.value||v.Value);
            } else if (hasOwnProp(v, 'variables') || hasOwnProp(v, 'Variables') ||hasOwnProp(v, 'entries') || hasOwnProp(v, 'Entries')) {
                e = _getDNamedVars(name, hasOwnProp(v, 'type') || hasOwnProp(v, 'Type') ? v : v.variables||v.Variables||v.entries||v.Entries, v.defaultValue||v.DefaultValue||e.default||e.Default);
            } else {                        
                e = _entry(name, "", Expression.getInstance(v));
            }
        } else if (arguments.length === 3) {
            this._properties[prop = ODVariables.getName(prop)] = v = Expression.getInstance(value);
            this._names[this._names.length] = prop;
            var a = arguments[2];
            if (a instanceof String) {
                a = a.valueOf();
            }
            if (a instanceof ODVariables || a instanceof ADVariables) {
                e = new DNamedVariables(prop, a, v);
            } else if (typeof a === 'string' && a) {                
                e = newEntry(prop, a, v);
            } else if (isPlainObject(a)) {
                e = _getDNamedVars(prop, a, v);
            }  else {
                e = new DOEntry(prop, "", v);
            }
        } else {
            setArray([].slice.call(arguments));
            return this;
        }
        this._entries[this._entries.length] = e;
        this.__variablesAndPaths = null;
        return this;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    ODVariables.prototype.isYield = function() {
        return this.yields > 0;
    }
    
    /**
     * 
     * <h3>Syntax</h3>
     * <ul>
     * <li>set({Array&lt;Stringgt;> names, {Array} values)</li>
     * <li>set({Object} props)</li>
     * <li>set({String} name, {type} value)</li>
     * </ul>
     * @param {String|Object|Array} prop
     * @param {type|Array} value
     * @returns {ODVariables}
     */
    ODVariables.prototype.set = function(prop, value) {
        if (arguments.length === 1 || arguments.length > 3) {
            this.clear();
        }
        this.put.apply(this, [].slice.call(arguments));
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ODVariables.prototype.getRestName = function() {
        return this._restName;
    };
    /**
     * 
     * @param {String} name
     * @param {String} alias
     * @returns {ODVariables}
     */
    ODVariables.prototype.setAlias = function(name, alias) {
        this._aliases[ODVariables.getName(name)] = ODVariables.getName(alias);
        this._aliasNames[alias] = name;
        this.__variablesAndPaths = null;
        return this;
    };
    /**
     * 
     * @param {Number} i
     * @returns {String}
     */
    ODVariables.prototype.getName = function(i) {
        return this._names[i];
    };
    
    
    /**
     * 
     * @param {String|Number} n
     * @returns {String}
     */
    ODVariables.prototype.getAlias = function(n) {
        if (n instanceof Number) {
            n = n.valueOf();
        } else if (n instanceof String) {
            n = n.valueOf();
        }
        var name;
        if (typeof n === 'number') {
            name = this._names[n];
            if (!name) {
                throw new Error("Incorrect index: " + n);
            }
        } else if (typeof n === 'string') {
            name = n;
        } else {
            throw new Error("Incorrect argument");
        }        
        return this._aliases[name]||"";
    };
   
    /**
     * 
     * @param {String} alias
     * @returns {String}
     */
    ODVariables.prototype.getNameFromAlias = function(alias) {
        return this._aliasNames[alias];
    };
    /**
     * 
     * @param {String} alias
     * @returns {String}
     */
    ODVariables.prototype.nameFromAlias = ODVariables.prototype.getNameFromAlias;
    /**
     * 
     * @param {String} key
     * @returns {Expression}  The return value Value.NO_VALUE or undefined specified that there is no default value.
     */
    ODVariables.prototype.getDefaultValue = function(key) {
        return this._properties[this._aliasNames[key]||key];
    };
    /**
     * 
     * @param {String} key
     * @returns {ODVariables}
     */
    ODVariables.prototype.removeDefaultValue = function(key) {
        var name= this._aliasNames[key]||key;
        if (this._properties.hasOwnProperty(name))
            delete this._properties[name];
        return this;
    };
    /**
     * 
     * @param {Object} comments
     * @returns {ODVariables}
     */
    ODVariables.prototype.setComments = function(comments) {
        for (var name in comments) {
            this._comments[name] = comments[name];
        }
        return this;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    ODVariables.prototype.isRestParam = function() {
        return false;
    };
    /**
     * 
     * @returns {Array&lt;NVariable&gt;}
     */
    ODVariables.prototype.getVariables = function() {
        var names = this._names, v, name, vars = [];
        for (var i = 0, n = names.length; i < n; i++) {
            name = names[i];
            v = this.getDefaultValue(name);
            vars[i] = v ? new NVariable(name, v) : new NVariable(name);
        }
        return vars;
    };
    
    /**
     * 
     * @returns {Object}
     */
    ODVariables.prototype.getVariablesMap = function() {
        var names = this._names, v, name, vars = {};
        for (var i = 0, n = names.length; i < n; i++) {
            name = names[i];
            vars[name] = this.getDefaultValue(name);
        }
        return vars;
    };
    /**
     * 
     * @returns {IComment}
     */
    ODVariables.prototype.getInnerInlineComment = function() {
        return this._innerInlineComment;
    };
    /**
  
     * @param {type} c
     * @returns {ODVariables.prototype}   * 
     */
    ODVariables.prototype.setInnerInlineComment = function(c) {
        this._innerInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    ODVariables.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
  
     * @param {type} c
     * @returns {ODVariables.prototype}   * 
     */
    ODVariables.prototype.setOuterInlineComment = function(c) {
        this._outerInlineComment = IComment.getInstance(c);
        return this;
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {undefined}
     */
    ODVariables.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "", _ind2, str = "", c;
        
        for (var i = 0; i < ind; i++) {
            _ind +=  "    ";
        }
        _ind2 = _ind + "    ";
        if (indentFirstLine) {
            str += _ind; 
        }
        
        c = this.getComment();
        if (c) {
            str += c.toString(ind, false) + "\n" + _ind;
        }
        
        c = this.getInlineComment();
        if (c) {
            str += c.getInlineString() + " ";
        }
        
        
        str += "{\n";
        
        //TODO: add comments to the string
        
        var entries = this._entries, len = entries.length;
        
        for (var i = 0; i < len; i++) {
            if (i > 0) {
                str += ",\n";
            }
            str +=  _ind2 + entries[i].toString(ind + 1, false);            
        }
        //TODO: add comments to the string
        str += "\n" + _ind;
        //TODO: add inline comment to the string
        str += "}";
        
        c = this.getOuterInlineComment();
        
        if (c) {
            str += " " + c.getInlineString();
        }
        return str;        
    };
    /**
     * 
     * @returns {String}
     */
    ODVariables.prototype.getInlineStatementString = function() {
        var str = "", c; 
        if (this.isOptionalChaining()) {
            str += "?";
        }
        str += "{";
        
        //TODO: add comments to the string
        
        var entries = this._entries, len = entries.length;
        
        for (var i = 0; i < len; i++) {
            if (i > 0) {
                str += ",";
            }
            str +=  entries[i].toString(true);            
        }
        //TODO: add comments to the string
        
        //TODO: add inline comment to the string
        str += "}";
        
        c = this.getOuterInlineComment();
        
        if (c) {
            str += c.getInlineString();
        }
        return str;        
    };
    /**
     * 
     * @returns {Number}
     */
    ODVariables.prototype.size = function() {
        return this._names.length;
    };
    /**
     * 
     * @returns {Object}
     */
    ODVariables.prototype.variablesAndPaths = function() {
        function _path(path, name) {
            if (name instanceof String) {
                name = name.valueOf();
            }
            if (name instanceof QString) {
                return path + "[" + name.getString() + "]";
            }
            if (/[^a-zA-Z$_0-9]/.test(name)) {
                return path + "[" 
                    + (name.indexOf('"') < 0 
                    ? '"' + name + '"' : name.indexOf('\'') < 0 
                    ? '\'' + name + '\'' : '"' + name.replace(/"/g, '\\"') + '"')
                    + "]";
            }
            return path + "." + name;
        }
        function add(names, _names) {
            var _name;
            for (var j = 0, count = _names.length; j < count; j++) {
                _name = _names[j];
                if (names.indexOf(_name) >= 0) {
                    throw new Error("Too many variable name: '" + _name + "'");
                }
                names[names.length] = _name;
            }
        }
        function process (dVars, path, valuesList, defaultValues, names) { 
            var elts = dVars.getEntries(), n = elts.length, e, name, p,defVals, _valuesList,defVal;
            if (dVars.isOptionalChaining()) {
                _valuesList = [];
                var _defaultValues = {};
                var entry = { 
                    'path': path||"",
                    //default value to used when the value corresponding to the pathin the array is undefined or null
                    'undefDefaultValues': _defaultValues,
                    'paths': _valuesList
                };
                defVals = defaultValues.slice();
                defVals[defVals.length] = _defaultValues;
                valuesList[valuesList.length] = entry;
            } else { 
                _valuesList = valuesList;
                defVals = defaultValues;
            }
            var usedNames = [], _e, key;
            for (var i = 0; i < n; i++) {
                e = elts[i];                
                if (e instanceof DOEntry) {
                    name = e.getName();
                    names[names.length] = key = e.getAlias()||name;
                    usedNames[usedNames.length] = name;
                    _valuesList[_valuesList.length] = _e = { name : key,path: _path(path ,name) };
                   
                } else if (e instanceof ODRest) {
                    name = e.getName(); 
                    names[names.length] = name;
                    _valuesList[_valuesList.length] = _e = { name : name,path: path, usedNames: usedNames, rest : true};
                } else if (e instanceof DNamedVariables) {
                    var name = e.getName(),
                        v = e.getVariables(),
                        dpath = _path(path, name);
                    if (v instanceof ODVariables) {
                        var _names = [];
                        _valuesList[_valuesList.length] = _e = process (v, dpath, [], defVals, _names);
                        add(names, _names);
                    } else if (v instanceof ADVariables) {
                        var _names = [];
                        _valuesList[_valuesList.length] =  _e = v.variablesAndPaths(dpath, [], defVals, _names);
                        add(names, _names);
                    } else {
                        throw new Error("Incorrect entry");
                    }
                    usedNames[usedNames.length] = name;
                    _e.name = name;
                } else {
                    throw new Error("Incorrect entry");
                }
                defVal = e.getDefaultValue();
                if (typeof defVal !== 'undefined' && defVal !== null && !(defVal instanceof Value && defVal.isNaV())) {
                    _e.defaultValue = defVal;
                }
                for (var k = 0,len = defVals.length;k< len; k++) {
                    defVals[k][name] = typeof defVal === 'undefined' ? Undefined.UNDEFINED : defVal;
                }
            }
            var result = { paths: valuesList, variables : names, path : path };
            return result;
        }
        if (!this.__variablesAndPaths || arguments[0] === true ) {
            var valuesList, 
                    names, 
                    path, 
                    defaultValues,
                    defaultValue;
            if (arguments.length === 1) {
                valuesList = []; 
                names = []; 
                path = ""; 
                defaultValues = [];
                if (typeof arguments[0] === 'string') {
                    path = arguments[0];
                } else if (arguments[0] instanceof String) {
                    path = arguments[0].valueOf();
                } else if (['object', 'function'].indexOf(typeof arguments[0]) >= 0) {
                    defaultValue = arguments[0];
                }
            } else {
                valuesList = arguments[1]||[]; 
                names = arguments[3]||[]; 
                path = arguments[0]||""; 
                defaultValues = arguments[2]||[];
                defaultValue = arguments[4];
            }
            this.__variablesAndPaths = process (this, path, valuesList, defaultValues, names);
            if (defaultValue) {
                this.__variablesAndPaths.defaultValue = defaultValue;
            }
        }
        return this.__variablesAndPaths;
    };
    /**
     * 
     * @returns {Boolean}
     */
    ODVariables.prototype.isOptionalChaining=function() {
        return this._optionalChaining;
    };
    /**
     * 
     * @param {Boolean|String|Number} oc
     * @returns {ODVariables}
     */
    ODVariables.prototype.setOptionalChaining=function(oc) {
        this._optionalChaining = toBool(oc);
        return this;
    };
    
    (function() {
        var ro = function() { throw new Error("Read only property"); };
        /**
         * 
         */
        Object.defineProperties(ODVariables.prototype, {
            names: { get: ODVariables.prototype.getNames, set : ro},
            restName: { get: ODVariables.prototype.getRestName, set : ro},
            variables: { get: ODVariables.prototype.getVariables, set : ro},
            entries: { get: ODVariables.prototype.getEntries, set : ro},
            length: { get: ODVariables.prototype.size, set : ro},
            optionalChaining : { get: ODVariables.prototype.isOptionalChaining, set: ODVariables.prototype.setOptionalChaining },
            outerInlineComment: { get: ODVariables.prototype.getOuterInlineComment, set: ODVariables.prototype.setOuterInlineComment },
            innerInlineComment: { get: ODVariables.prototype.getInnerInlineComment, set: ODVariables.prototype.setInnerInlineComment },
            innerComment: { get: ODVariables.prototype.getInnerComment, set: ODVariables.prototype.setInnerComment }
        });
    })();
    
    var DOptions = ODVariables;
    
    var ODVars = ODVariables;
    
    
   /**
    * 
    * @returns {Params}
    */
   function Params() {
       this._params = [];
       if (arguments.length > 1 && isArray(arguments[0])) {
           var cmt = arguments[1], icmt = arguments.length > 2 ? arguments[2] : null;
           if (cmt) {
               this.setComment(cmt);
           }
           if (icmt) {
               this.setIlineComment(icmt);
           }
           this.add(arguments[0]);
       } else if (arguments.length > 1) {                    
           var end = arguments.length, a = arguments[end - 1], cmt, icmt;
           if (a instanceof IComment) {
               cmt = a;
               end--;
           }
           if (end  > 0) {
               a = arguments[end - 1];
               if (a instanceof IComment) {
                   icmt = cmt;
                   cmt = a;
                   end--;
               }
           }
           if (cmt) {
               this.setComment(cmt);
           }
           if (icmt) {
               this.setIlineComment(icmt);
           }
           for (var i = 0; i < end; i++) {
               this.add(arguments[i]);
           }
       } else if (arguments.length === 1) {
           var a = arguments[0];
           if (a instanceof IComment) {
               this.setComment(a);
           } else if (isArray(a)) {
               this.add(a);
           }
       }
   }


   Params.prototype = new StatementElt();
   /**
    * 
    * @param {Param|Array&lt;Param&gt;} p  The parameter or parameters to add
    * @returns {Params}
    */
   Params.prototype.add = function(p) {
       if (arguments.length === 0) {
           throw new Error("At least one argument is expected");
       }
       if (isArray(p)) {
           for (var i = 0; i < p.length; i++) {
               this._params[this._params.length] = p[i];
           }
       } else {
           this._params[this._params.length] = p;
       }                
       return this;
   };
   /**
    * 
    * @returns {unigned int}
    */
   Params.prototype.size = function() {
       return this._params.length;
   };
   /**
    * 
    * @returns {Params.prototype}
    */
   Params.prototype.clear = function() {
       this._params.splice(0, this._params.length);
       return this;
   };
   /**
    * 
    * @param {unsigned int} i
    * @returns {Array}
    */
   Params.prototype.get = function(i) {
       return this._params[i];
   };
   /**
    * 
    */
   Params.prototype.iterator = function() {
       return new SIterator(this._params);
   };
   /**
    * 
    * @param {type} params
    * @returns {Params}
    */
   Params.prototype.setParameters = function(params) {
       this.clear();
       this.add(params);
       return this;
   };
   /**
    * 
    * @param {IComment|String} c
    * @returns {Params}
    */
   Params.prototype.setOuterInlineComment = function(c) {
       this._outerInlineComment = IComment.getInstance(c);
       return this;
   }
   /**
    * 
    * @returns {IComment}
    */
   Params.prototype.getOuterInlineComment = function() {
       return this._outerInlineComment;
   }
   /**
    * 
    * @param {Number} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   Params.prototype.getStatementString = function(ind, indentFirstLine) {       
       var s = "", _ind = "";
       for (var i = 0; i < ind; i++) {
           _ind += "    ";
       }

       if (indentFirstLine) {
           s += _ind;
       }
       s += "(";
       if (!this._params || this._params.length === 0) {
           s += ")"; 
       } else {
            for (var i = 0, n = this._params.length; i < n; i++) {
                if (i > 0) {
                    s += ",";
                }
                s += "\n" + this._params[i].toString(ind + 1, true);
            }
            s += "\n" + _ind + ")";
        }
        var c = this.getOuterInlineComment();
        if (c) {
            s += " " + c.toString(ind, false);
        }
       return s;
   };
   
   /**
    * 
    * @returns {String}
    */
   Params.prototype.getInlineStatementString = function() {
       var s = "(";
        for (var i = 0, n = this._params.length; i < n; i++) {
            if (i > 0) {
                s += ",";
            }
            s += this._params[i].toString(true);
        }
        s += ")";
        return s;       
   };
   /**
    * 
    */
   Object.defineProperties(Params.prototype, {
       /**
        * 
        * @property {IComment} comment The comment of the parameters
        */
       'comment': { 
           get: Params.prototype.getComment,
           set: Params.prototype.setComment
       },
       /**
        * 
        * @property {IComment} inlineComment The (end) inline comment of the parameters
        */
       'inlineComment': { 
           get: Params.prototype.getInlineComment,
           set: Params.prototype.setInlineComment
       },
       /**
        * 
        * @property {unsigned int} length The number of parameters
        */
       'length': { 
           get: Params.prototype.size,
           set: function() { throw new Error("Read only property");}
       },
       /**
        * 
        */
       'parameters': { 
           get: Params.prototype.iterator,
           set: Params.prototype.setParameters
       },
       /**
        * 
        */
       'params': { 
           get: Params.prototype.iterator,
           set: Params.prototype.setParameters
       }
   });
   
   /**
     * 
     */
    Getter.__NO_PARAMS__ = new Params([]);
    /**
     * 
     * @returns {Params}
     */
    Getter.__NO_PARAMS__.add = function() {
        return this;
    };
    /**
     * 
     * @returns {Params}
     */
    Getter.__NO_PARAMS__.remove = function() {
        return this;
    };

    /**
     * 
     * @returns {Func}
     * @class
     * @abstract
     */
    function Func() {
        if (arguments.length > 0 && isPlainObject(arguments[0])) {
            var o = arguments[0];
            this.setName(o.name||o.Name||"");
            this.setParameters(o.parameters||o.params||o.parms||[]);
            if (o.comment) {
                this.setComment(o.comment);
            }
        } else if (arguments.length > 0 && typeof arguments[0] === 'string') {
            this.setName(arguments[0]);
            if (arguments.length > 1 && isArray(arguments[1])) {
                this.setParameters(arguments[1]);
                if (arguments.length > 2 && isPlainObject(arguments[2])) {
                    this.setComment(arguments[2]);
                }
            } else {
                this._params = new Params();
            }
        } else if (arguments.length > 0 && isArray(arguments[0])) {
            this.setName("");
            this.setParameters(arguments[0]);
            if (arguments.length > 1 && isPlainObject(arguments[1])) {
                this.setComment(arguments[1]);
            }
        } else {
            this._params = new Params();
        }
    }
    defineClass(
        Func, 
        Expression,
        {
            /**
             * 
             * @param {String} name
             * @returns {Func}
             */
            setName : function(name) {
                this._name = name||"";
                return this;
            },
            /**
             * 
             * @returns {String}
             */
            getName : function() {
                return this._name||"";
            },

            /**
             * 
             * @param {SType|String} returnType
             * @returns {Func}
             */
            setReturnType : function(returnType) {
                this._returnType = returnType;
                return this;
            },
            /**
             * 
             * @returns {SType}
             */
            getReturnType : function() {
                return this._returnType;
            },
            /**
             * 
             * @returns {Array}
             */
            getParams : function() {
                return this._params;
            },
            /**
             * 
             * @param {type} param
             * @returns {Func}
             */
            addParam : function(param) {
                this._params.add(param instanceof Param ? param : new Param(param));
                return this;
            },
            /**
             * 
             * @param {Array} params
             * @returns {Func}
             * 
             */
            addParams : function(params) {                
                if (isArray(params)) {
                    var p;
                    for (var i = 0, n = params.length; i < n; i++) {
                        p = params[i];
                        this.addParam(p instanceof Param ? p : new Param(p));
                    }
                } else if (isPlainObject(params)) {
                    for (var n in params) {                        
                        this.addParam(new Param(n, params[n]));
                    }
                }
                return this;
            },
            /**
             * 
             * @param {Array} params
             * @returns {Func}
             * 
             */
            setParams : function(params) {
                if (params instanceof Params) {
                    this._params = params;
                } else {
                    this._params = new Params();
                    this.addParams(params);
                }
                return this;
            },
            /**
             * 
             * @param {Statement|Expression|Array|Block} body
             */
            setBody : function(body) {
                if (isArray(body)) {
                    body = new Block(body);
                } else if (!(body instanceof Block )) {
                     if (isPlainObject(body)) {
                        if (isArray(body.statements)) {
                            body = new Block(body.statements);
                        } else {
                            body = new Block([Statement.getInstance(body)]);
                        }
                    } else
                        incorectArg(); //throw exception
                }
                this._body = body;
                return this;
            },
            
            /**
             * Returns the body of the function.
             * <p>When arrow function, the body can be an instance of Block 
             * (block of statements) or an expression. 
             * For function of other type, the body can only be an instance of 
             * Block.</p>
             * @returns {StatementElt}
             */
            getBody : function() {
                return this._body;
            },
            /**
             * Returns the block of statements of the function
             * @returns {Block}
             */
            getBlock: function() {
                return this.getBody();
            },
            /**
             * 
             * @return  {Boolean}
             */ 
            isStatement : function() {
                return false;
            },
            /**
             * 
             * @returns {Boolean}
             */
            isYield : function() {
                var b = this.getBody();
                return b ? b.isYield() : true;
            },
            /**
             * 
             * @returns {Boolean}
             */
            isYieldDelegation : function() {
                return false;
            },
            /**
             * 
             * @param {Boolean} _async
             * @returns {Func}
             */
            setAsync : function(_async) {
                this._async = toBool(_async);
                return this;
            },
            /**
             * 
             * @returns {Boolean}
             */
            isAsync : function() {
                return this._async;
            }
        },
        {   
            'setParameters': 'setParams',
            'getParameters': 'getParams',
            'getStatements': 'getBody',
            'setStatements': 'setBody'
        }
    );
    
    /**
     * 
     * @returns {AnonymousFunction|NamedFunction}
     */
    Func.getFunction = function() {
        if (arguments.length  > 2) {
            if (typeof arguments[0] === 'string') {
                var a = arguments[0], generator, n = 3, p = 0, NamedFunc;
                if (typeof a === 'boolean') {
                    generator = a;
                    a = arguments[1];
                    n++;
                    p = 1;
                    NamedFunc = generator ? FunctionGenerator : NamedFunction;
                } else {
                    NamedFunc = NamedFunction;
                }
                if (a || generator) {
                    if (arguments.length  > n) {
                        return new NamedFunc(arguments[p++], arguments[p++], arguments[p++], arguments[p]);
                    }
                    return new NamedFunc(arguments[p++], arguments[p++], arguments[P]);
                } else {
                    if (arguments.length  > 3) {
                        return new AnonymousFunction(arguments[++p], arguments[++p], arguments[++p]);
                    }
                    return new AnonymousFunction(arguments[++p], arguments[++p]);
                }
            }
         } else if (isPlainObject(arguments[0])) {
             var opts = arguments[0];
             return opts.generator ? new FunctionGenerator(opts) : opts.name ? new NamedFunction(opts) : new AnonymousFunction(opts);
         }
    };
    
    
    /**
     * 
     * @class AnonymousFunction
     */
    function AnonymousFunction() {
        this._name = "";
        if (arguments.length  > 1) {
            this.setParameters(arguments[0]);
            this.setBody(arguments[1]);
            if (arguments.length  > 2) {
                if (typeof arguments[2] === 'string' || isPlainObject(arguments[2])) {
                    this.setComment(arguments[2]);
                }
            }
        } else if (isPlainObject(arguments[0])) {
            var o = arguments[0];
            this.setParameters(o.parameters||o.params||o.Parameters||o.Params);
            this.setBody(o.body||o.statements||o.statement||o.Body||o.Statements||o.Statement);
            var cmt = o.comment||o.Comment;
            if (cmt) {
                this.setComment(cmt);
            }
            cmt = o.beforeParamsComment||o.beforeArgsComment||o.beforeNameComment;
            if (cmt) {
                 this.setBeforeParamsComment(cmt);
            }
            cmt = o.beforeParamsInlineComment||o.beforeArgsInlineComment||o.beforeNameInlineComment;
            if (cmt) {
                 this.setBeforeParamsInlineComment(cmt);
            }
        }
    }

    defineClass(
        AnonymousFunction, 
        Func, 
        {
	    /**
             * 
             * @returns {String}
             */
            getName: function() {
                return "";
            },
            /**
             * 
             * @param {type} name
             * @returns {AnonymousFunction}
             */
            setName: function(name) {
                return this;
            },
  
            /**
             * 
             * @param {IComment|String} c
             * @returns {NamedFunction}
             */
            setBeforeParamsComment: function(c) {
                this._beforeParamsComment = IComment.getInstance(c);
                return this;
            },
            /**
             * 
             * @returns {NamedFunction._beforeParamsComment}
             */
            getBeforeParamsComment: function() {
                return this._beforeParamsComment;
            },
    
            getInlineStatementString: function() {             
                var str ="";

                str += "function";
                var params = this.getParams();
                 if (!params) {
                     str += "()";
                 } else {
                     str += params.toString(true);
                 }

                str += this.getBody().toString(true);
                return str;
            },

            getStatementString: function(ind, indentFirstLine, inlineArgs) {             
                var str ="";

                if (indentFirstLine) {
                    for (var i = 0; i < ind; i++) {
                        str += "    ";
                    }
                }

                str += "function";
                var params = this.getParams();
                 if (!params) {
                     str += "()";
                 } else if (inlineArgs) {
                     str += params.toString(true);
                 } else {
                     str += params.toString(ind, false);
                 }        
                 indentFirstLine = false;
                 var c = params.getOuterInlineComment();
                 if (c) {
                     if (c.isSingleLine()) {
                         str += "\n";
                         indentFirstLine = true;
                     } else {
                         str += " ";
                     }
                 }
                str += this.getBody().toString(ind, indentFirstLine);
                return str;
            },

           /**
             * 
             * @param {type} types
             * @returns {NamedFunction}
             */
            setTypes: function(types) {
                this._types = types instanceof NParamTypes ? types : NParamTypes(types);
                return this;
            },
            /**
             * 
             * @returns {NParamTypes}
             */
            getTypes: function() {
                return this._types;
            }
        }
    );


    /**
     * <h3>Properties of the Anonymous Function (AnonymousFunction)</h3>
     * @property {String} name The name of the anonymous function: the value is empty string
     * @property {Array&lt;Param&gt;} parameters The parameters of the anonymous function
     * @property {Array&lt;Param&gt;} params The parameters of the anonymous function: an alias of 'parameters'
     * @property {Block|Expression} body The body of the anonymous function
     * @property {Block|Expression} statements The body of the anonymous function: alias of 'body' property
     * @property {Boolean} anonymous Anonymous function
     */
   Object.defineProperties(AnonymousFunction.prototype, {
       name: { get: AnonymousFunction.prototype.getName, set: AnonymousFunction.prototype.setName },
       params: { get: AnonymousFunction.prototype.getParameters, set: AnonymousFunction.prototype.setParameters },
       parameters: { get: AnonymousFunction.prototype.getParameters, set: AnonymousFunction.prototype.setParameters },
       body: { get: AnonymousFunction.prototype.getBody, set: AnonymousFunction.prototype.setBody },
       statements: { get: AnonymousFunction.prototype.getBody, set: AnonymousFunction.prototype.setBody },
       anonymous: { get: AnonymousFunction.prototype.isAnonymous, set: AnonymousFunction.prototype.setAnonymous = function(anonymous) { throw "Read only property"; } }
   });




    /**
     * 
     * @class NamedFunction
     */
    function ANamedFunction() {
        this._async = false;
        if (arguments.length  > 2) {
            this.setName(arguments[0]);
            this.setParameters(arguments[1]);
            this.setBody(arguments[2]);
            if (arguments.length  > 3) {
                if (typeof arguments[3] === 'boolean') {
                    this.setAsync(arguments[3]);
                    if (arguments.length  > 4 && (typeof arguments[4] === 'string' || isPlainObject(arguments[4]))) {
                        this.setComment(arguments[4]);
                    }
                } else if (typeof arguments[3] === 'string' || isPlainObject(arguments[3])) {
                    this.setComment(arguments[3]);
                    if (arguments.length  > 4 && (typeof arguments[4] === 'boolean')) {
                        this.setAsync(arguments[4]);
                    }
                }
            }
        } else if (isPlainObject(arguments[0])) {
             var o = arguments[0];
             this.setName(o.name||o.Name);
             this.setParameters(o.parameters||o.params||o.Parameters||o.Params);
             this.setBody(o.body||o.statements||o.statement||o.Body||o.Statements||o.Statement);
             if (o.hasOwnProperty("async")) {
                 this.setAsync(o.async);
             } else if (o.hasOwnProperty("asynchronous")) {
                 this.setAsync(o.asynchronous);
             }
             var cmt = o.comment||o.Comment;
             if (cmt) {
                 this.setComment(cmt);
             }
             cmt = o.beforeParamsComment||o.beforeArgsComment;
            if (cmt) {
                 this.setBeforeParamsComment(cmt);
            }
            cmt = o.beforeParamsInlineComment||o.beforeArgsInlineComment;
            if (cmt) {
                 this.setBeforeParamsInlineComment(cmt);
            }
            cmt = o.beforeNameComment;
            if (cmt) {
                 this.setBeforeNameComment(cmt);
            }
            cmt = o.beforeNameInlineComment;
            if (cmt) {
                 this.setBeforeNameInlineComment(cmt);
            }
         }
    }

    /**
     * 
     * @returns {Function}
     * @class ANamedFunction
     * @abstract
     */
    defineClass(
        ANamedFunction,
        Func,
        {
            /**
             * 
             * @returns {String}
             */
            getName: function() {
                return this._name||"";
            },
            /**
             * 
             * @param {type} name
             * @returns {NamedFunction}
             */
            setName: function(name) {
                if (!name) {
                    throw new Error("Incorrect name");
                }
                this._name = name;
                return this;
            },
            /**
             * 
             * @returns {Boolean}
             */
            isAync: function() {
                return this._async;
            },

            /**
             * 
             * @return  {Boolean}
             */ 
            isStatement: function() {
                return true;
            },
            /**
             * 
             * @param {type} types
             * @returns {NamedFunction}
             */
            setTypes: function(types) {
                this._types = types instanceof NParamTypes ? types : NParamTypes(types);
                return this;
            },
            /**
             * 
             * @returns {NParamTypes}
             */
            getTypes: function() {
                return this._types;
            },

            /**
             * 
             * @returns {Boolean}
             */
            isAnonymous: function() {
                return false;
            },
            /**
             * 
             * @param {IComment|String} c
             * @returns {NamedFunction}
             */
            setBeforeParamsComment: function(c) {
                this._beforeParamsComment = IComment.getInstance(c);
                return this;
            },
            /**
             * 
             * @returns {NamedFunction._beforeParamsComment}
             */
            getBeforeParamsComment: function() {
                return this._beforeParamsComment;
            },
            /**
             * 
             * @param {IComment|String} c
             * @returns {NamedFunction}
             */
            setBeforeNameComment: function(c) {
                this._beforeNameComment = IComment.getInstance(c);
                return this;
            },
            /**
             * 
             * @returns {NamedFunction._beforeNameComment}
             */
            getBeforeNameComment: function() {
                return this._beforeNameComment;
            },
            getType:function() {
                throw new Error("Abtract method");
            },
            /**
             * 
             * @returns {String}
             */
            getInlineStatementString: function() {        

                var str ="";

                str += this.getType() + " "; 
                str += (this.getName()||"");

                var params = this.getParams();
                if (!params) {
                    str += "()";
                } else {
                    str += params.toString(true);
                }

                var b = this.getBody();
                str += b.toString(true);
                return str;
            },

            /**
             * 
             * @returns {String}
             */
            getStatementString: function(ind, indentFirstLine, inlineArgs) {
                var str ="";

                if (indentFirstLine) {
                    for (var i = 0; i < ind; i++) {
                        str += "    ";
                    }
                }

                str += this.getType() + " "; 

                str += (this.getName()||"");

                var params = this.getParams();
                if (!params) {
                    str += "()";
                } else if (inlineArgs) {
                    str += params.toString(true);
                } else {
                    str += params.toString(ind, false);
                }
                indentFirstLine = false;
                var c = params.getOuterInlineComment();
                if (c) {
                    if (c.isSingleLine()) {
                        str += "\n";
                        indentFirstLine = true;
                    } else {
                        str += " ";
                    }
                }
                var b = this.getBody();
                if (b) {
                    str += b.toString(ind, false);
                } else {
                    str += "{}";
                }
                return str;
            }
        }
    );
    
    
    function NamedFunction() {
        ANamedFunction.apply(this, arguments);
    }
    /**
     * 
     * @returns {Function}
     * @class NamedFunction
     */
    defineClass(
        NamedFunction,
        ANamedFunction,
        {
            getType:function() {
                return 'function';
            }
        }
    );
    /**
     * <h3>Properties of the Named Function</h3>
     * @property {Boolean} async Aynchronous named function?
     * @property {String} name The name of the named function
     * @property {Array&lt;Param&gt;} parameters The parameters of the named function
     * @property {Array&lt;Param&gt;} params The parameters of the named function: an alias of 'parameters'
     * @property {Block|Expression} body The body of the named function
     * @property {Block|Expression} statements The body of the named function : alias of 'body' property
     * @property {Boolean} anonymous Anonymous function
     */
    Object.defineProperties(NamedFunction.prototype, {
        async: { get: NamedFunction.prototype.isAsync, set: NamedFunction.prototype.setAsync },
        name: { get: NamedFunction.prototype.getName, set: NamedFunction.prototype.setName },
        params: { get: NamedFunction.prototype.getParameters, set: NamedFunction.prototype.setParameters },
        parameters: { get: NamedFunction.prototype.getParameters, set: NamedFunction.prototype.setParameters },
        body: { get: NamedFunction.prototype.getBody, set: NamedFunction.prototype.setBody },
        statements: { get: NamedFunction.prototype.getBody, set: NamedFunction.prototype.setBody },
        anonymous: { get: NamedFunction.prototype.isAnonymous, set: NamedFunction.prototype.setAnonymous = function(anonymous) { throw "Read only property"; } }
    });
    
    function FunctionGenerator() {
        ANamedFunction.apply(this, arguments);
    }
    /**
     * 
     * @returns {Function}
     * @class FunctionGenerator
     */
    defineClass(
        FunctionGenerator,
        ANamedFunction,
        {
            getType:function() {
                return 'function*';
            }
        }
    );
    /**
     * <h3>Properties of the Named Function</h3>
     * @property {Boolean} async Aynchronous named function?
     * @property {String} name The name of the named function
     * @property {Array&lt;Param&gt;} parameters The parameters of the named function
     * @property {Array&lt;Param&gt;} params The parameters of the named function: an alias of 'parameters'
     * @property {Block|Expression} body The body of the named function
     * @property {Block|Expression} statements The body of the named function : alias of 'body' property
     * @property {Boolean} anonymous Anonymous function
     */
    Object.defineProperties(FunctionGenerator.prototype, {
        async: { get: FunctionGenerator.prototype.isAsync, set: FunctionGenerator.prototype.setAsync },
        name: { get: FunctionGenerator.prototype.getName, set: FunctionGenerator.prototype.setName },
        params: { get: FunctionGenerator.prototype.getParameters, set: FunctionGenerator.prototype.setParameters },
        parameters: { get: FunctionGenerator.prototype.getParameters, set: FunctionGenerator.prototype.setParameters },
        body: { get: FunctionGenerator.prototype.getBody, set: FunctionGenerator.prototype.setBody },
        statements: { get: FunctionGenerator.prototype.getBody, set: FunctionGenerator.prototype.setBody },
        anonymous: { get: FunctionGenerator.prototype.isAnonymous, set: FunctionGenerator.prototype.setAnonymous = function(anonymous) { throw "Read only property"; } }
    });
    
    
    

    /**
     * 
     * @returns {ArrowFunction}
     * @class ArrowFunction
     */
    function ArrowFunction() {
        this._name = "";
        var o;
        if (arguments.length > 1) {
            this.setParameters(arguments[0]);
            this.setBody(arguments[1]);
        } else if (isPlainObject((o = arguments[0]))) {
            this.setParameters(o.params||o.parameters||o.Params||o.Parameters);
            this.setBody(o.body||o.statements||o.statement||o.expression);
        }
    }
    /**
     * 
     * @type Func
     */
    ArrowFunction.prototype = new Func();

    ArrowFunction.__CLASS__ = ArrowFunction;

    ArrowFunction.__CLASS_NAME__ = "ArrowFunction";
    
    ArrowFunction.__SUPER_CLASS__ = Func;

    ArrowFunction.prototype.__CLASS__ = ArrowFunction;

    ArrowFunction.prototype.__CLASS_NAME__ = "ArrowFunction";
    /**
     * Returns empty string
     * @returns {String}
     */
    ArrowFunction.prototype.getName = function() {
        return "";
    };
    /**
     * 
     * @param {type} name
     * @returns {ArrowFunction}
     */
    ArrowFunction.prototype.setName = function(name) {
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    ArrowFunction.prototype.isAnonymous = function() {
        return true;
    };
    /**
     * 
     * @param {Block|Expression|Statement|Array|Object} b The body of the arraow function
     * @returns {ArrowFunction}
     */
    ArrowFunction.prototype.setBody = function(b) {
        if ((b instanceof Expression) || (b instanceof Block) || 
                ((b instanceof StatementElt) && (typeof b.isStatement === 'function') && b.isStatement())) {
            this._body = b;
            this._block = null;
        } else {
            return Func.prototype.setBody.apply(this, [b]);
        }
        return this;
    };
    /**
     * When the body of the arrow function is not an instance of Block, creates 
     * a return statement with the body as returned value returns the instance 
     * of return statement.
     * Otherwise, returns the body of the arrow function. 
     * @override
     * @returns {Block}
     */
    ArrowFunction.prototype.getBlock = function() {
        if (!this._block) {
            this._block = this._body instanceof Expression || (this._body.isExpression && this._body.isExpression()) ? new Return(this._body) : this._body;
        }
        return this._block; 
    };
    /**
     * 
     * @param {Block|Expression|Statement|Array|Object} b The body of the arraow function
     * @returns {ArrowFunction}
     */
    ArrowFunction.prototype.setStatements = ArrowFunction.prototype.setBody;
    /**
     * 
     * @returns {String}
     */
    ArrowFunction.prototype.toString = function() {
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
                indentFirstLine = false;
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        var str = "";                

        if (indentFirstLine) {
            for (var i = 0; i < n; i++) {
               str += "    "; 
            }
        }

        var params = this._parameters;
        if (!params) {
            str = "()";
        } else if (params instanceof Params) {
            if (params.size() === 1) {
                if (inline) {
                    str += params.get(0).toString(inline);
                } else {
                    str += params.get(0).toString(ind, false);
                }
            } else {
                if (inline) {
                    str += params.toString(inline);
                } else {
                    str += params.toString(ind, false);
                }
            }
        } else if (params.length === 1) {
            if (inline) {
                str += params[i].toString(true);
            } else {
                str += params[i].toString(ind, false);
            }
        } else {
            str += "(";
            if (inline) {
                for (var i = 0; i < params.length; i++) {
                    if (i > 0) {
                        str += ", ";
                    }
                    str += params[i].toString();
                }
            } else {
                for (var i = 0; i < params.length; i++) {
                    if (i > 0) {
                        str += ",\n";
                    }
                    str += params[i].toString(ind + 1, true);
                }
            }

            str += ")";
        }
        
        str += " => ";

        var b = this.getBody();
        if (b) {
            if (inline) {
                str += b.toString(inline);
            } else {
                str += b.toString(ind, false);
            }
        }
        return str;
    };
    /**
     * <h3>Properties of the Arrow function</h3>
     * @property {String} name The name of the arrow function: the value is empty string
     * @property {Array&lt;Param&gt;} parameters The parameters of the arrow function
     * @property {Array&lt;Param&gt;} params The parameters of the arrow function: an alias of 'parameters'
     * @property {Block|Expression} body The body of the arrow function
     * @property {Block|Expression} statements The body of the arrow function : alias of 'body' property
     * @property {Boolean} anonymous Anonymous function
     */
    Object.defineProperties(ArrowFunction.prototype, {
        name: { get: ArrowFunction.prototype.getName, set: ArrowFunction.prototype.setName },
        params: { get: ArrowFunction.prototype.getParameters, set: ArrowFunction.prototype.setParameters },
        parameters: { get: ArrowFunction.prototype.getParameters, set: ArrowFunction.prototype.setParameters },
        body: { get: ArrowFunction.prototype.getBody, set: ArrowFunction.prototype.setBody },
        statements: { get: ArrowFunction.prototype.getBody, set: ArrowFunction.prototype.setBody },
        anonymous: { get: ArrowFunction.prototype.isAnonymous, set: ArrowFunction.prototype.setAnonymous = function(anonymous) { throw "Read only property"; } }
    });
    
    
    
    
    /**
     * 
     * @param {type} a
     * @returns {undefined}
     */
    function Args(a) {
        this._arguments = [];
        this._yield = false;
        if (arguments.length > 1) {
            for (var i = 0, n = arguments.length; i < n; i++) {
                this.add(arguments[i]);
            }
        } else if (isArray(a)) {
            this.add(a);
        } else if (isPlainObject(a)) {
            if (isArray(a.arguments||a.elements)) {
                this.add(a.arguments||a.elements);
            }
            if (a.comment) {
                this.setComment(a.comment);
            }
            if (a.inlineComment) {
                this.setInlineComment(a.inlineComment);
            }
            if (a.endComment) {
                this.setEndComment(a.endComment);
            }
            if (a.inlineEndComment) {
                this.setInlineEndComment(a.inlineEndComment);
            }
            
            if (a.leftInnerInlineComment) {
                this.setLeftInnerInlineComment(a.leftInnerInlineComment);
            }
            if (a.leftInnerComment) {
                this.setLeftInnerComment(a.leftInnerComment);
            }
            if (a.rightInnerInlineComment) {
                this.setRightInnerInlineComment(a.rightInnerInlineComment);
            }
            
            if (a.rightInnerComment) {
                this.setRightInnerComment(a.rightInnerComment);
            }
        }
    }
    
    defineClass(Args, StatementElt, {
        /**
         * 
         * @param {type} a
         * @returns {Args}
         */
        add: function(a) {  
            var e;
            if (isArray(a)) {
                for (var i = 0, n = a.length; i < n; i++) {
                    this._arguments[this._arguments.length] = e = Expression.getInstance(a[i]);
                    if (e.isYield()) {
                        this._yield = true;
                    }
                    if (e.isYieldDelegation()) {
                        this._yieldDelegation = true;
                    }
                }
            } else {
                this._arguments[this._arguments.length] = e = Expression.getInstance(a);
                if (e.isYield()) {
                    this._yield = true;
                }
                if (e.isYieldDelegation()) {
                    this._yieldDelegation = true;
                }
            }
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isYield: function() {
            this._yield;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isYieldDelegation: function() {
            this._yieldDelegation;
        },
        /**
         * 
         * @returns {unresolved}
         */
        getArguments: function() {
            return this._arguments.slice();
        },
        setArguments: function(args) {
            this._yield = false;
            this._arguments = [];
            this.add(args);
            return this;
        },
        /**
         * 
         * @param {type} i
         * @returns {Array}
         */
        get: function(i) {
            return this._arguments[i];
        },
        /**
         * 
         * @returns {unsigned int}
         */
        size: function() {
            return this._arguments.length;
        },
        isYield : function (e) {
            if (this._yield === undefined) {
                var args = this._arguments, n = args.length;
                for (var i = 0; i < n; i++) {
                    if (args[i].isYield()) {
                        this._yield = true;
                    }
                }
            }
            return this._yield;
        },
        /**
         * 
         * @returns {String}
         */
        getInlineStatementString: function() {
            var args = this._arguments, n = args.length;
            if (n === 0) {
                return "()";
            }
            var s = "(";
            for (var i = 0, n; i < n; i++) {
                if (i > 0) {
                    s += ", ";
                }
                s += args[i].toString(true);
            }
            return s + ")";
        },
        /**
         * 
         * @param {unsigned int} ind
         * @param {Boolean} indentFirstLine
         * @returns {String}
         */
        getStatementString: function(ind, indentFirstLine, inlineArgs) {
            var args = this._arguments, s = "", _ind = "", n = args.length;
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
            if (indentFirstLine) {
                s += _ind;
            }
            if (n === 0) {
                return s + "()";
            }

            s += "(";
            if (inlineArgs || (n === 1 && !args[0].getComment())) {
                for (var i = 0; i < n; i++) {
                    if (i > 0) {
                        s += ", ";
                    }
                    s += args[i].toString(ind, false);
                }
                return s + ")";
            } else {
                var nl = " ", nli = "";
                    nl = "\n" + _ind + "    ";
                    nli = "\n" + _ind;
                for (var i = 0; i < n; i++) {
                    if (i > 0) {
                        s += "," + nl;
                    } else if (i === 0) {
                        s += nl;
                    }
                    s += args[i].toString(ind + 1, false);
                }
                return s + nli + ")";
            }
        },
        /**
         * 
         * @returns {IComment}
         */
        getOuterInlineComment: function() {
            return this._outerInlineComment;
        },
        /**
         * 
         * @param {type} c
         * @returns {Reference.prototype}
         */
        setOuterInlineComment: function(c) {
            this._outerInlineComment = c instanceof IComment ? c : IComment.getInstance(c);
            return this;
        },
        /**
         * 
         * @param {Function|Object} process
         * @param {String} [methodName=null]
         * @returns {undefined}
         */
        forEach: function(process, methodName) {
            var args = this._arguments;
            if (!args) {
                return this;
            }
            var n = args.length;
            if (typeof process === 'function') {
                for (var i = 0; i < n; i++) {
                    process(args[i], i, this);
                }
            } else if (isPlainobject(process)) {
                if (typeof methodName === 'string' && methodName) {
                    for (var i = 0; i < n; i++) {
                        process[methodName](args[i], i, this);
                    }
                } else if (typeof process.exec === 'function') {
                    for (var i = 0; i < n; i++) {
                        process.exec(args[i], i, this);
                    }
                } else if (typeof process.process === 'function') {
                    for (var i = 0; i < n; i++) {
                        process.process(args[i], i, this);
                    }
                }
            }
            return this;
        }
    });
    
    
    Object.defineProperties(Args.prototype, {
        arguments : { get : Args.prototype.getArguments, set :Args.prototype.setArguments },
        length : { get : Args.prototype.size, set :function(s) { throw new Error("Read only property"); } }
    });
    

    /**
     * 
     * @param {Object} opts
     * @returns {Call}
     * @class Call
     */
    function Call(opts) {               
        if (Call.___initialized___) {
            throw new Error("Abtract class");
        }
        this._optionalChaining = false;
        if (opts) {
            this.setCallee(opts.callable||opts.call||opts.callee);
            this.setOptionalChaining(opts.optionalChaining);
            this.setArguments(opts.arguments||opts.args);
        } else if (arguments.length === 0) {
            this._args = [];
        } else if (arguments.length > 1) {
            this.setCallee(arguments[0]);
            this.setArguments(arguments[1]);
            this.setOptionalChaining(arguments.length > 2 ? arguments[2] : false);
        }
    }

    defineClass(Call, Expression, {
        /**
         * 
         * @returns {Boolean}
         */
        isStatement: function() {
            return true;
        },

        /**
         * 
         * @returns {Boolean}
         */
        isOptionalChaining: function() {
            return this._optionalChaining;
        },
        /**
         * 
         * @param {Boolean} optionalChaining
         * @returns {Call}
         */
        setOptionalChaining: function(optionalChaining) {
            this._optionalChaining = toBool(optionalChaining);
            return this;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isYield : function() {
            return this._args ? this._args.isYield() : false;
        },
        /**
         * 
         * @returns {Boolean}
         */
        isYieldDelegation : function() {
            return this._args ? this._args.isYieldDelegation() : false;
        },
        setArguments: function(args) {
            if (args instanceof Args) {
                this._args = args;
            } else if (isArray(args) || isPlainObject(args) ) {            
                this._args = new Args(args);
            } else if (!args) {
                this._args = new Args([]);
            } else {
                throw new Error("Incoorect arguments");
            }
            return this;
        },
        
        addArgument: function(arg) {
            if (!this._args) {
                this._args = new Args();
            }
            this._args.add(arg);
            return this;
        },
        /**
         * 
         * @returns {RefChain|Conditional|Undefined.UNDEFINED|Null.__UNDEFINED__@new;Undefined|VArray|SereniX.prog.VArray|Expression.getInstance.A|ns.Undefined.UNDEFINED|Bool|SereniX.prog.Grouping|Expression.getInstance.G|Grouping|Index|Expression.getInstance.I|SereniX.prog.Index|SereniX.prog.Conditional|Expression.getInstance.C|Expression.getInstance.F|ns.Expression.getInstance.NamedFunction|Expression.getInstance.Expression.getInstance.NamedFunction|SereniX.prog.NamedFunction|Invocation|Expression.getInstance.O|VObject|SereniX.prog.VObject|SereniX.prog.Reference|Reference|Expression.getInstance.R|ns.Expression.getInstance.e|Expression.getInstance.Expression.getInstance.e|SereniX.prog.QString|Expression.getInstance.QS|Expression.getInstance.Expression.getInstance.QString|ns.Expression.getInstance.QString|Expression.getInstance.N|Numeric|SereniX.prog.Numeric|Null.NULL|Null.__NULL__@new;Null|AnonymousFunction|Instantiation|QString|Value|ArrowFunction|Assign|OCRef|Boolean|LROperation|UnaryOperation|NamedFunction|ns.Null.NULL|ns.Numeric.NULL|AutoIncrement}
         */
        getCallee: function() {
            return this._callee;
        },
        /**
         * 
         * @param {type} c
         * @returns {Call}
         */
        setCallee: function(c) {
            this._callee = typeof c === 'string' ? Reference.getInstance(c) : Expression.getInstance(c);
            return this;
        },
        /**
         * 
         * @returns {Args|Array}
         */
        getArgs: function() {
            return this._args;
        },
        /**
         * 
         * @param {type} args
         * @returns {Call}
         */
        setArgs: function(args) {
            this._args = args;
            return this;
        },
        /**
         * 
         * @returns {String}
         */
        getInlineStatementString: function() {
            var args = this._args, s = (this.isInstantiation() ? "new " : "") + this._callee.toString();
            if (isArray(args)) {
                var n = args.length;
                if (n === 0) {
                    s += "()";
                } else {
                    s += "(";
                    for (var i = 0 ; i < n; i++) {
                        if (i > 0) {
                            s += ", ";
                        }
                        s += this._args[i].toString(true);
                    }
                    s += ")";
                }
            } else if (args instanceof Args) {
                s += args.toString(true);
            } else if (!args) {
                s += "()";
            } else {
                throw new Error("Incorect arguments type");
            }
            return s;
        },
        /**
         * 
         * @param {Number} ind
         * @param {Boolean} indentFirstLine
         * @param {Boolean} inlineArgs
         * @returns {String}
         */
        getStatementString: function(ind, indentFirstLine, inlineArgs) {
            var args = this._args, s = "", _ind = "";
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
            if (indentFirstLine) {
                s += _ind;
            }
            s += (this.isInstantiation() ? "new " : "") + this._callee.toString(ind, false);
            if (isArray(args)) {
                var n = args.length;
                if (n === 0) {
                    s += "()";
                } else if (inlineArgs || n === 1) {
                    s += "(";
                    for (var i = 0 ; i < n; i++) {
                        if (i > 0) {
                            s += ", ";
                        }
                        s += args[i].toString(ind + 1, false);
                    }
                    s += ")";
                } else {
                    s += "(";
                    for (var i = 0, n = args.length; i < n; i++) {
                        if (i > 0) {
                            s += ",";
                        }
                        s += "\n" + args[i].toString(ind + 1, true);
                    }
                    s += "\n" + _ind + ")";
                }
            } else if (args instanceof Args) {
                s += args.toString(ind, false);
            } else if (!args) {
                s += "()";
            } else {
                throw new Error("Incorect arguments type");
            }
            
            return s;
        },
        
        /**
         * 
         * @returns {Boolean}
         */
        isInstantiation: function() {
            return this instanceof Instantiation;
        },
        /**
         * 
         * @returns {IComment}
         */
        getOuterInlineComment: function() {
            return this._outerInlineComment;
        },
        /**
         * 
         * @param {IComment|String} c
         * @returns {Call}
         */
        setOuterInlineComment: function(c) {
            this._outerInlineComment = IComment.getInstance(c);
            return this;
        }
    });

    
    /**
     * 
     * @returns {Instantiation}
     * @class Instantiation
     */
    function Instantiation() {
        var _super = Instantiation.__SUPER_CLASS__;
        _super.___initialized___ = false;

        _super.apply(this, [].slice.call(arguments));

        _super.___initialized___ = true;
    }

    defineClass(Instantiation, Call, {
        isInstantiation : function() {
            return true;
        }
    });
    
    
    
    
    /**
     * 
     * @returns {Invocation}
     * @class
     */
    function Invocation() {
        Invocation.__SUPER_CLASS__.___initialized___ = false;

        Invocation.__SUPER_CLASS__.apply(this, [].slice.call(arguments));

        Invocation.__SUPER_CLASS__.___initialized___ = true;
    }

    defineClass(Invocation, Call, {
        isInstantiation : function() {
            return false;
        }
    });
    
    Invocation.__SUPER_CLASS__ = Call;

    //should setted after Instantiation and Invocation class definitions
    Call.___initialized___ = true;
    
    

    /**
     * 
     * @returns {Operation}
     * @class
     */
    function Operation() {
    }

     Operation.ASSIGN_OPERATORS = ['++', '--', '=', '+=', '-=', '*=', '**=', '^=', '/=','%=', '&&=', '||=', '>>=', '>>>=', '<<=', '&=', '|=', '??=' ];

     Operation.prototype = new Expression();
     /**
      * 
      * @returns {type}
      */
     Operation.prototype.getOperator = function() {
         return this._operator;
     };
     /**
      * 
      * @param {type} operator
      * @returns {Operation}
      */
     Operation.prototype.setOperator = function(operator) {
        this._operator = operator;
        return this;
     };
     
     
     /**
     * 
     * <p>The expressions are evaluated from the left to the right and the  
     * result of the evaluation of chained expressions is the result of the last 
     * evaluation (expression).</p>
     * @param {Array|Object|...} _
     * @returns {ChainedExpressions}
     * @class ChainedExpressions
     */
    function ChainedExpressions(_) {
        this._operator = ',';
        this._chain = [];
        if (arguments.length === 1) {
            if (isArray(_)) {
                this.addExpressions(_);
            } else if (isPlainObject(_)) {
                var e;
                if (isArray(e = _.expressions||_.expressionsList||_.chain||_.Expressions||_.ExpressionsList||_.Chain)) {
                    this.addExpressions(e);
                }
            }
        } else if (arguments.length > 1) {
            this.addExpressions.apply([].splice.call(arguments));
        }
        this._yields = 0;
        this._yieldDelegations = 0;
    }

    ChainedExpressions.prototype = new Operation();

    ChainedExpressions.__CLASS__ = ChainedExpressions;
    ChainedExpressions.__CLASS_NAME__ = "ChainedExpressions";

    ChainedExpressions.prototype.__CLASS__ = ChainedExpressions;
    ChainedExpressions.prototype.__CLASS_NAME__ = "ChainedExpressions";
    /**
     * 
     * @param {type} e
     * @returns {ChainedExpressions}
     */
    ChainedExpressions.prototype.addExpression = function(e) {
        if (!e || isArray(e)) {
            throw new Error("Incorrect argument");
        }
        
        this._chain[this._chain.length] = e = Expression.getInstance(e);
        if (e.isYield()) {
            this._yields++;
        }
        if (e.isYieldDelegation()) {
            this._yieldDelegations++;
        }
        return this;
    };
    /**
     * 
     * @param {Array|...} _  The expressions to chain
     * @returns {ChainedExpressions}
     */
    ChainedExpressions.prototype.addExpressions = function(_) {
        if (!_) {
            throw new Error("Incorrect arguments");
        }
        if (arguments.length === 1) {
            if (!isArray(_)) {
                throw new Error("Incorrect argument");
            }
        } else {
            _ = [].splice.call(arguments);
        }
        for (var i = 0, n = _.length; i < n; i++) {
            this.addExpression(_[i]);
        }
        return this;
    };
    /**
     * 
     * @param {Array|Object|...} _ The expression or expressions to add
     * @returns {ChainedExpressions}
     */
    ChainedExpressions.prototype.add = function(_) {
        if (!_) {
            throw new Error("Incorrect arguments");
        }
        if (arguments.length > 1) {
            _ = [].splice.call(arguments);
        }
        if (isArray(_)) {
            return this.addExpressions(_);
        }
        return this.addExpression(_);
    };
    /**
     * 
     * @param {Array|...} _  The expressions to chain
     * @returns {ChainedExpressions}
     */
    ChainedExpressions.prototype.setExpressions = function(_) {
        if (!_) {
            throw new Error("Incorrect arguments");
        }
        this._yields = 0;
        this._yieldDelegations = 0;
        if (arguments.length === 1) {
            if (!isArray(_)) {
                throw new Error("Incorrect argument");
            }
        } else {
            _ = [].splice.call(arguments);
        }
        this._chain = [];
        for (var i = 0, n = _.length; i < n; i++) {
            this.addExpression(_[i]);
        }
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    ChainedExpressions.prototype.getOperator = function() {
        return ","; 
    };
    /**
     * 
     * @param {String} o
     * @returns {ChainedExpressions}
     */
    ChainedExpressions.prototype.setOperator = function(o) {
        return this; 
    };
    /**
     * Returns the lefttmost expression
     * @returns {Expression}
     */
    ChainedExpressions.prototype.getLeft = function() {
        return this._chain.length > 0 ? this._chain[0] : undefined;
    };
    /**
     * Set the lefttmost expression
     * @param {Expression} left
     * @returns {Expression}
     */
    ChainedExpressions.prototype.setLeft = function(left) {
        this._chain[0]  = left;
        return this;
    };
    /**
     * Removes the lefttmost expression
     * @returns {undefined}
     */
    ChainedExpressions.prototype.removeLeft = function() {
        return this._chain.length > 0 ? this._chain.splice(0, 1) : undefined;
    };
    
    /**
     * Returns the rightmost expression
     * @returns {Expression}
     */
    ChainedExpressions.prototype.getRight = function() {
        return this._chain.length > 1 ? this._chain[this._chain.length - 1] : undefined;
    };
    
    /**
     * Returns the rightmost expression when no argument. Otherwise, returns the
     * expression at the given position/index.
     * @param {Number} [i]  Position/index of the ecpression to get
     * @returns {Expression}
     */
    ChainedExpressions.prototype.getExpression = function(i) {
        return arguments.length > 0 ? this._chain[i] : this._chain.length > 1 ? this._chain[this._chain.length - 1] : undefined;
    };
    
    /**
     * 
     * @returns {String}
     */
    ChainedExpressions.prototype.getInlineStatementString = function() {
        var str = "", n  = this._chain.length;
        
        for (var i = 0; i < n; i++) {
            if (i > 0) {
                str += ", ";
            }
            str += this._chain[i].toString(true);
        }
        return str;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    ChainedExpressions.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "", n  = this._chain.length, _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        _ind = "\n" + _ind;
        for (var i = 0; i < n; i++) {
            if (i > 0) {
                str += "," + _ind;
            }
            str += this._chain[i].toString(i, false);
        }
        return str;
    };
    /**
     * 
     * @returns {Array}
     */
    ChainedExpressions.prototype.getExpressions = function() {
        return this._chain.slice();
    };
    
    /**
     * 
     * @returns {Object}
     */
    ChainedExpressions.prototype.iterator = function() {
        var it = {
            ___ : { _arr: this._chain, _index : -1, _len : _arr.length }, 
            hasNext: function() {
                var i = this.___;
                return i._len > 0 && i._index < i._len - 1;
            },
            next: function() {
                var i = this.___;
                return i._arr[++i._index]; 
            },
            reset: function() {
                this.___._index = -1;
                return this;
            }
        };
        return it;
    };/**
     * 
     * @returns {Array}
     */
    ChainedExpressions.prototype.getExpressions = function() {
        return this._chain.slice();
    };
    
    /**
     * 
     * @returns {unsigned int}
     */
    ChainedExpressions.prototype.size = function() {
        return this._chain.length;
    };

     /**
      * 
      * @returns {Conditional}
      */
     function Conditional() {
         this._operator = "?:";
        if (arguments.length === 1) {
            var o = arguments[0];
            this._condition = Expression.getInstance(coalesceProp(o, 'condition', 'criteria'));
            this._trueValue = Expression.getInstance(coalesceProp(o, 'trueValue', 'TrueValue'));
            this._falseValue = Expression.getInstance(coalesceProp(o, 'falseValue', 'FalseValue'));
        } else if (arguments.length > 2) {
            this._condition = Expression.getInstance(arguments[0]);
            this._trueValue = Expression.getInstance(arguments[1]);
            this._falseValue = Expression.getInstance(arguments[2]);
        } else {
            this._condition = null;
            this._trueValue = null;
            this._falseValue = null;
        }
     }

     Conditional.prototype = new Operation();
     /**
      * 
      * @param {type} left
      * @returns {Conditional}
      */
     Conditional.prototype.setLeft = function(left) {
         this._condition = left;
         return this;
     };

     Conditional.prototype.getLeft = function() {
         return this._condition;
     };
     /**
      * 
      * @param {type} right
      * @returns {Conditional}
      */
     Conditional.prototype.setRight = function(right) {
         this._falseValue = right;
         return this;
     };

     Conditional.prototype.getRight = function() {
         return this._falseValue;
     };

     Conditional.prototype.getInlineStatementString = function() {
         var s = "";


         if (this._condition instanceof Conditional) {
             s += "(" + this._condition.toString(true) + ")";
         } else {
             s += this._condition === null || typeof this._condition === 'undefined' ? "" : this._condition.toString(true);
         }
         s += " ? ";
         if (this._trueValue instanceof Conditional) {
             s += "(" + this._trueValue.toString(true) + ")";
         } else {
             s += this._trueValue === null || typeof this._trueValue === 'undefined' ? "" : this._trueValue.toString(true);
         }
         s += " : ";
         if (this._falseValue instanceof Conditional) {
             s += "(" + this._falseValue.toString(true) + ")";
         } else {
             s += this._falseValue === null || typeof this._falseValue === 'undefined' ? "" : this._falseValue.toString(true);
         }
         return s;
     };
     Conditional.prototype.getStatementString = function(ind, indentFirstLine) {
         var s = "";
         if (indentFirstLine) {
             for (var i = 0; i < ind; i++) {
                 s += "    ";
             }
         }

         if (this._condition instanceof Conditional) {
             s += "(" + this._condition.toString(ind, false) + ")";
         } else {
             s += this._condition === null || typeof this._condition === 'undefined' ? "" : this._condition.toString(ind, false);
         }
         s += " ? ";
         if (this._trueValue instanceof Conditional) {
             s += "(" + this._trueValue.toString(ind, false) + ")";
         } else {
             s += this._trueValue === null || typeof this._trueValue === 'undefined' ? "" : this._trueValue.toString(ind, false);
         }
         s += " : ";
         if (this._falseValue instanceof Conditional) {
             s += "(" + this._falseValue.toString(ind, false) + ")";
         } else {
             s += this._falseValue === null || typeof this._falseValue === 'undefined' ? "" : this._falseValue.toString(ind, false);
         }
         return s;
     };
     /**
      * 
      * @returns {type}
      */
     Conditional.prototype.getCondition = function() {
         return this._condition;
     };
     /**
      * 
      * @param {type} c
      * @returns {Conditional}
      */
     Conditional.prototype.setCondition = function(c) {
         this._condition = c;
         return this;
     };

     /**
      * 
      * @returns {Expression}
      */
     Conditional.prototype.getTrueValue = function() {
         return this._trueValue;
     };
     /**
      * 
      * @param {Expression} v
      * @returns {Conditional}
      */
     Conditional.prototype.setTrueValue = function(v) {
         this._trueValue = v;
         return this;
     };
     /**
      * 
      * @returns {Expression}
      */
     Conditional.prototype.getFalseValue = function() {
         return this._falseValue;
     };
     /**
      * 
      * @param {Expression} v
      * @returns {Conditional}
      */
    Conditional.prototype.setFalseValue = function(v) {
        this._falseValue = v;
        return this;
    };


    Object.defineProperties(Conditional.prototype, {
        condition : {
            get: Conditional.prototype.getCondition,
            set : Conditional.prototype.setCondition
        },
        trueValue : {
            get: Conditional.prototype.getTrueValue,
            set : Conditional.prototype.setTrueValue
        },
        falseValue : {
            get: Conditional.prototype.getFalseValue,
            set : Conditional.prototype.setFalseValue
        }
    });
    
    /**
    * 
    * @param {Object} opts
    */ 
   function UnaryOperation(opts) {
       this._yield = false;
       this._yieldDelegation = false;
       if (typeof opts === 'string') {
           if (opts === '++' || opts === '--') {
               this.__prefixed___ = arguments.length === 1 ?  true : toBool(arguments[1]);
           } else {
               this.__prefixed___ = true;
           }
       } else if (isPlainObject(opts)) {
           this.setOperator(opts.operator);
           this.setMember(opts.member||opts.operand);
           this.__prefixed___ = UnaryOperation.getPrefixed(opts);
       }
   }

   UnaryOperation.__CLASS__ = UnaryOperation;

   UnaryOperation.__CLASS_NAME__ = "UnaryOperation";
   
   UnaryOperation.__SUPER_CLASS__ = Operation;
   /**
    * The list of unary operators symbols.
    * <p>The instance's method setOperator uses the static non final 
    * UnaryOperation.UNARY_OPERATORS to validate the operator.</p>
    * @type Array&lt;String&gt;
    * @static
    */
   UnaryOperation.UNARY_OPERATORS = [ '++', '+', '--', '-', '!', '~', 'typeof', 'void', 'delete', 'await', 'yield', 'yield*' ];
    /**
     * 
     * @param {Object} opts
     * @returns {Boolean}
     */
    UnaryOperation.getPrefixed = function(opts) {
        var t = opts.sens||opts.nature||opts.operationType||opts.type, p;
        if (t === 'prefix' || t === 'prefixed' || t === 'pre') {
            p = true;
        } else if (t === 'postfix' || t === 'postfixed' || t === 'pos') {
            p = false;
        } else {
            var v = opts.prefixed;
            if (typeof v === 'undefined') {
                v = opts.prefix;
                if (typeof v === 'undefined') {
                    v = opts.postfixed;
                    if (typeof v === 'undefined') {
                        v = opts.postfix;
                        if (typeof v !== 'undefined') {
                            p = !toBool(v);
                        } else {
                            p = true;
                        }
                    } else {
                        p = !toBool(v);
                    }
                } else {
                   p = toBool(v); 
                }
            } else {
                p = toBool(v); 
            }
        }
        return p;
    };
   UnaryOperation.prototype = new Operation();

   UnaryOperation.prototype.__CLASS__ = UnaryOperation;

   UnaryOperation.prototype.__CLASS_NAME__ = "UnaryOperation";
   /**
    * 
    * @returns {UnaryOperation._member}
    */
   UnaryOperation.prototype.getMember = function() {
       return this._member;
   };
   /**
    * 
    * @param {type} m
    * @returns {UnaryOperation}
    */
   UnaryOperation.prototype.setMember = function(m) {
       this._member = Expression.getInstance(m);
       return this;
   };
   /**
    * 
    * <p> Alias of  this.getMember() method</p>
    * @param {type} m
    * @returns {UnaryOperation}
    */
   UnaryOperation.prototype.getOperand = UnaryOperation.prototype.getMember;
   /**
    * <p> Alias of  this.setMember() method</p>
    * @param {type} m
    * @returns {UnaryOperation}
    */
   UnaryOperation.prototype.setOperand = UnaryOperation.prototype.setMember;

   /**
    * 
    * @returns {Boolean}
    */
   UnaryOperation.prototype.isStatement = function() {
       return false;
   };
   UnaryOperation.prototype.isYield = function () {
        return this._yield;
    },
    UnaryOperation.prototype.isYieldDelegation= function () {
        return this._yieldDelegation;
    },
    UnaryOperation.prototype.setOperator = function(op) {
        if ( this.__CLASS__.UNARY_OPERATORS.indexOf(op) < 0 )  {
           throw new Error("Incorect unary operator: '" + operator + "'");
       }
        this._yield = ['yield', 'await'].indexOf(op) >= 0;
        this._yieldDelegation = op === 'yield*';
        return this.__CLASS__.__SUPER_CLASS__.prototype.setOperator.apply(this, [op]);
    },
   /**
    * 
    * @returns {UnaryOperation}
    */
   UnaryOperation.prototype.setPrefixed = function() {        
        if (typeof this.__prefixed___ === 'undefined') {
            var pref = arguments.length === 0 ? true : toBool(arguments[0]);
            if (this._operator !== '++' && this._operator !== '--') {
                if (!pref) {
                    throw new Error("Incorrect value for the operator '" + this._operator + "': " + pref);
                }
            }
            this.__prefixed___ = pref; 
        }
       return this;
   };
   /**
    * 
    * @returns {Boolean}
    */
   UnaryOperation.prototype.isPrefixed = function() {
       return typeof this.__prefixed___ === 'undefined' ? false : this.__prefixed___;
   };

   /**
    * 
    * @returns {Boolean}
    */
   UnaryOperation.prototype.isPostfixed = function() {
        return !this.isPrefixed();
    };
    /**
     * 
     * @returns {UnaryOperation}
     */
    UnaryOperation.prototype.setPostfixed = function() {       
        if (typeof this.__prefixed___ === 'undefined') {
            var prefixed = arguments.length === 0 ? false : !toBool(arguments[0]);
            if (this._operator !== '++' && this._operator !== '--') {
                if (!prefixed) {
                    throw new Error("Incorrect value for the operator '" + this._operator + "': " + (!prefixed));
                }
            }
            this.__prefixed___ = prefixed; 
        }
        return this;
    };
    /**
    * 
    * @returns {String}
    */
   UnaryOperation.prototype.getInlineStatementString = function() {
       var o = this.getOperator(),
               letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
       if (typeof this.__prefixed___ === 'undefined' || this.__prefixed___) {
           return o + (letters.indexOf(o[o.length - 1]) >= 0 ? ' ': '' ) + this.getMember().toString(true);
       }
       return this.getMember().toString(true) + (letters.indexOf(o[0]) >= 0 ? ' ': '' ) + o;
   };
   /**
    * 
    * @param {Number} ind
    * @param {Boolean} indentFirstLine
    * @returns {String}
    */
   UnaryOperation.prototype.getStatementString = function(ind, indentFirstLine) {
       var o = this.getOperator(),
               letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
       if (typeof this.__prefixed___ === 'undefined' || this.__prefixed___) {
           var _ind = "";
           if (indentFirstLine) {
               for (var i = 0; i < ind; i++) {
                   _ind += "    ";
               }
           }
           return _ind + o + (letters.indexOf(o[o.length - 1]) >= 0 ? ' ': '' ) + this.getMember().toString(ind, false);
       }
       return this.getMember().toString(ind, indentFirstLine) + (letters.indexOf(o[0]) >= 0 ? ' ': '' ) + o;
   };
   

   Object.defineProperties(UnaryOperation.prototype, {
       operator : {
           get : UnaryOperation.prototype.getOperator,
           set : UnaryOperation.prototype.setOperator
       },
       member : {
           get : UnaryOperation.prototype.getMember,
           set : UnaryOperation.prototype.setMember
       },
       operand : {
           get : UnaryOperation.prototype.getOperand,
           set : UnaryOperation.prototype.setOperand
       },
       prefixed : {
           get : UnaryOperation.prototype.isPrefixed,
           set : UnaryOperation.prototype.setPrefixed
       },
       postfixed : {
           get : UnaryOperation.prototype.isPostfixed,
           set : UnaryOperation.prototype.setPostfixed
       }
   });



   /**
    * 
    * @class {AutoIncrement}
    */
   function AutoIncrement() {
       AutoIncrement.__SUPER_CLASS__.apply(this, [].slice.call(arguments));
   }

   AutoIncrement.__CLASS__ = AutoIncrement;
   AutoIncrement.__SUPER_CLASS__ = UnaryOperation;

   AutoIncrement.AUTOINCREMENT_OPERATORS = [ '++', '--' ];

   AutoIncrement.prototype = new UnaryOperation();

   AutoIncrement.prototype.__CLASS__ = AutoIncrement;
   AutoIncrement.prototype.__SUPER_CLASS__ = UnaryOperation;

   AutoIncrement.prototype.setPrefixed = function() {
       this.__prefixed = arguments.length === 0 ? true : toBool(arguments[0]); 
   };
   /**
    * 
    * @returns {Boolean}
    */
   AutoIncrement.prototype.isStatement = function() {
       return true;
   };

   AutoIncrement.getPostfix = function(o) {
       if (arguments.length > 1) {
           return new AutoIncrement( { member: o, operator: arguments[1], postfixed : true });
       } else if (isPlainObject(o)) {
           o.postfixed = true;
           return new AutoIncrement(o);
       }
   };

   AutoIncrement.getPrefix = function(o) {
       if (arguments.length > 1) {
           return new AutoIncrement( { member: o, operator: arguments[1], prefixed : true });
       } else if (isPlainObject(o)) {
           o.prefixed = true;
           return new AutoIncrement(o);
       }
   };

   /**
    * 
    * @param {type} operator
    * @returns {Operation}
    */
   AutoIncrement.prototype.setOperator = function(operator) {
       if (this.__CLASS__.AUTOINCREMENT_OPERATORS.indexOf(operator) < 0)  {
           throw new Error("Incorect auto increment operator: '" + operator);
       }
       this._operator = operator;
       return this;
   };

   Object.defineProperties(AutoIncrement.prototype, {
       operator : {
           get : AutoIncrement.prototype.getOperator,
           set : AutoIncrement.prototype.setOperator
       },
       member : {
           get : AutoIncrement.prototype.getMember,
           set : AutoIncrement.prototype.setMember
       },
       operand : {
           get : AutoIncrement.prototype.getOperand,
           set : AutoIncrement.prototype.setOperand
       },
       prefixed : {
           get : AutoIncrement.prototype.isPrefixed,
           set : AutoIncrement.prototype.setPrefixed
       },
       postfixed : {
           get : AutoIncrement.prototype.isPostfixed,
           set : AutoIncrement.prototype.setPostfixed
       }
   });




    /**
     * 
     * @param {Object] o
     * @class {LROperation}
     */
    function LROperation(o) {
        if (isPlainObject(o)) {
            this.setLeft(o.left||o.Left);
            this.setRight(o.right||o.Right);
            this.setOperator(o.operator);
        }
    }

    LROperation.prototype = new Operation();
    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    LROperation.prototype.setLeft = function(left) {
        this._left = Expression.getInstance(left);
        this._yields = undefined;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    LROperation.prototype.isStatement = function() {
        return Operation.ASSIGN_OPERATORS.indexOf(this.getOperator()) >= 0;
    };
    /**
     * 
     * @returns {type}
     */  
    LROperation.prototype.getLeft = function() {
        return this._left;
    };

    /**
     * 
     * @param {type} r
     * @return {LROperation}
     */
    LROperation.prototype.setRight = function(r) {
        this._right = Expression.getInstance(r);
        this._yields = undefined;
        return this;
    };
    /**
     * 
     * @returns {type}
     */  
    LROperation.prototype.getRight = function() {
        return this._right;
    };
    /**
     * 
     * @returns {Boolean}
     */
    LROperation.prototype.isYield = function() {
        if (this._yields === undefined) {
            this._yields = 0;
            if (this._left.isYield()) {
                this._yields++;
            }
            if (this._right.isYield()) {
                this._yields++;
            }
        }
        return this._yields > 0;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    LROperation.prototype.isYieldDelegation = function() {
        return this._right ? this._right.isYieldDelegation() : false;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    LROperation.prototype.isYieldDelegation = function() {
        return this._right ? this._right.isYieldDelegation() : false;
    };
    
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getBeforeOperatorInlineComment = function() {
        return this._left.getInlineComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setBeforeOperatorInlineComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._left.setInlineComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getBeforeOperatorInlineComment = function() {
        return this._left.getInlineComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setBeforeOperatorInlineComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._left.setInlineComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getAfterOperatorInlineComment = function() {
        return this._right.getInlineComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setAfterOperatorInlineComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._right.setInlineComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getBeforeOperatorComment = function() {
        return this._left.getComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setBeforeOperatorComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._left.setComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getBeforeOperatorComment = function() {
        return this._left.getComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setBeforeOperatorComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._left.setComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getAfterOperatorComment = function() {
        return this._right.getComment();
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setAfterOperatorComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._right.setComment(c);
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getOuterComment = function() {
        return this._outerComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setOuterComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._outerComment = c;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    LROperation.prototype.getOuterInlineComment = function() {
        return this._outerInlineComment;
    };
    /**
     * 
     * @param {IComment} c
     * @returns {LROperation}
     */
    LROperation.prototype.setOuterInlineComment = function(c) {
        if (!(c instanceof IComment)) {
            throw new Error("Incorrect argument");
        }
        this._outerInlineComment = c;
        return this;
    };
    
    /**
     * 
     * @param {unsigned int} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    LROperation.prototype.getStatementString = function(ind, indentFirstLine) {
        var s = "", o = this.getOperator(), letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        if (isArray(this._left)) {
            for(var i = 0, len = this._left.length; i < len; i++) {
                s += this._left[i] ?  this._left[i].toString(ind, i === 0 ? indentFirstLine : false) : "";
                s += o;
            }
        } else {
            s += this._left ?  this._left.toString(ind, indentFirstLine) : "";
            s += o;
        }
        s += this._right ?  this._right.toString(ind, false) : "";
        return s; 
    };
    /**
     * 
     * @returns {Boolean}
     */
    LROperation.prototype.isAssign = function() {
        return ASSIGNMENT_OPERATORS.indexOf(this.getOperator()) >= 0;
    };
    /**
     * 
     * @returns {String} };
     */
    LROperation.prototype.getInlineStatementString = function() {
        var s = "", o = this.getOperator(), letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        if (isArray(this._left)) {
            for(var i = 0, len = this._left.length; i < len; i++) {
                s += this._left[i] ?  this._left[i].toString(true) : "";
                s += o;
            }
        } else {
            s += this._left ?  this._left.toString(true) : "";
            s += o;
        }
        s += this._right ?  this._right.toString(true) : "";
        return s;
    };   
    /**
     * 
     */
    Object.defineProperties(LROperation.prototype, {
        "left" : { get: LROperation.prototype.getLeft, set: LROperation.prototype.setLeft },
        "right" : { get: LROperation.prototype.getRight, set: LROperation.prototype.setRight },
        "operator": { get: LROperation.prototype.getOperator, set: LROperation.prototype.setOperator },
        "comment": { get: LROperation.prototype.getComment, set: LROperation.prototype.setComment },
        "inlineComment": { get: LROperation.prototype.getInlineComment, set: LROperation.prototype.setInlineComment },
        "endComment": { get: LROperation.prototype.getEndComment, set: LROperation.prototype.setEndComment },
        "outerComment": { get: LROperation.prototype.getOuterComment, set: LROperation.prototype.setOuterComment },
        "outerInlineComment": { get: LROperation.prototype.getOuterInlineComment, set: LROperation.prototype.setOuterInlineComment }
    });
    /**
     * 
     * @class {Assign}
     */
    function Assign() {
       if (arguments.length === 1) {
           var o  = arguments[0];
           this.setLeft(o.left);
           this.setRight(o.right);
           this.setOperator(o.operator||o.Operator||'=');
       } else if (arguments.length > 1) {
           this.setLeft(arguments[0]);
           this.setRight(arguments[1]);
           this.setOperator(arguments.length > 2 ? arguments[2] : '=');
       } else {
           this._left = null;
           this._operator = '=';
           this._right = null;
       }
    }

    Assign.prototype = new LROperation();
    /**
     * 
     * @returns {Array}
     */
    Assign.prototype.getLeft = function() {
        return isArray(this._left) && this._left.length === 1 ? this._left[0] : this._left;
    };
    /**
     * 
     * @param {type} left
     * @return {Assign}
     */
    Assign.prototype.setLeft = function(left) {
        if (isArray(left)) {
            this._left = [];
            var l;
            for (var i = 0, n = left.length; i < n; i++) {
                l = left[i];
                if (!((l instanceof Index) || (l instanceof Reference))) {
                    incorrectArg();//throw exception
                }
                this._left[i] = l;
            }
        } else {
            if (!((left instanceof Index) || (left instanceof Reference))) {
                incorrectArg();//throw exception
            }
            this._left = [ left ];
        }
        return this;
    };

    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    Assign.prototype.addLeft = function(left) {
        if (isArray(left)) {
            var l;
            for (var i = 0, n = left.length; i < n; i++) {
                l = left[i];
                if (!((l instanceof Index) || (l instanceof Reference))) {
                    incorrectArg();//throw exception
                }
                this._left[this._left.length] = l;
            }
        } else {
            if (!((left instanceof Index) || (left instanceof Reference))) {
                incorrectArg();//throw exception
            }
            this._left[this._left.length] = left;
        }
        return this;
    };

    /**
     * 
     * @param {type} left
     * @param {type} right
     * @returns {Assign} 
     */
    Assign.prototype.set = function(left, right) {
        if (!((left instanceof Index) || (left instanceof Reference))) {
            incorrectArg();//throw exception
        }
        this.setLeft(left);
        this.setRight(right);
    };
    /**
     * 
     * @returns {Boolean}
     */
    Assign.prototype.isStatement = function() {
        return true;
    };
    


    Object.defineProperties(Assign.prototype, {
        "left" : { get: Assign.prototype.getLeft, set: Assign.prototype.setLeft },
        "right" : { get: Assign.prototype.getRight, set: Assign.prototype.setRight },
        "operator": { get: Assign.prototype.getOperator, set: Assign.prototype.setOperator }
    });
    /**
     * <h3>Object Detructuring Assign</h3>
     * 
     * @returns {ODAssign}
     * @class ODAssign
     */
    function ODAssign() {
        Assign.apply(this, [].slice.call(arguments));
    }
    
    (function(O) {
        var p;
    /*
     * 
     */
    p = O.prototype = new Assign();
    
    O.__CLASS__ = O;
    
    O.__CLASS_NAME__ = "ODAssign";
    
    O.__SUPER_CLASS__ = Assign;
    
    p.__CLASS__ = O;
    
    p.__CLASS_NAME__ = "ODAssign";
    
    /**
     * Returns true if the given object is valid (ok) value .
     * @param {type} o
     * @returns {Boolean}
     */
    O.isValid = function(o) {        
        return !O.nokValue(o);
    };
    
    /**
     * Returns true if the given object is not ok value (not valid value).
     * @param {type} o
     * @returns {Boolean}
     * @todo: identify all cases and integrate them
     */
    O.nokValue = function(o) {
        if (o instanceof Litteral || o instanceof VArray || o instanceof Func) {
            return true;
        }        
        if (o instanceof Value) {
            var v = o.valueOf();
            return o === null 
                    || ['number', 'bool', 'string', 'undefined'].indexOf(typeof v) >= 0;
        }
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isExpression = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isStatement = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isYield = function() {
        return (this._left && this._left.isYield()) || (this._right && this._right.isYield());
    };
    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    p.setLeft = function(left) {
        if (isArray(left)) {
            if (left.length !== 1) {
                incorrectArg();//throw exception
            }
            left = left[0];
        }
        if (!(left instanceof ODVariables)) {
            if (!isPlainObject(left)) {
                incorrectArg();//throw exception
            }
            left = new ODVariables(left);
        }
        this._left = left;
        return this;
    };
    /**
     * 
     * @type p.setLeft
     * @alias
     */
    p.setVariables = p.setLeft;
    /**
     * 
     * @type LROperation.prototype.getLeft
     * @alias
     */
    p.getVariables = p.getLeft;

    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    p.addLeft = function(left) {
        if (this._left) {
            throw new Error("Too many left members");
        }
        if (isArray(left)) {
            if (left.length !== 1) {
                incorrectArg();//throw exception
            }
            left = left[0];
        }
        this._left = left;
        return this;
    };
    
    /**
     * 
     * @param {type} r
     * @return {LROperation}
     */
    p.setRight = function(r) {
        var e = Expression.getInstance(r);
        if (O.nokValue(e)) {
            throw new Error("Incorrect argument");
        }
        this._right = e;
        return this;
    };
    
    /**
     * 
     * @type p.setRight
     * @alias
     */
    p.setObject = p.setRight;
    /**
     * 
     * @type LROperation.prototype.getRight
     * @alias
     */
    p.getObject = p.getRight;
    
    /**
     * 
     * @returns {String}
     */
    p.getStatementString = function(ind, indentFistLine) {
        var s = "", o = this.getOperator(), 
            letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        s += this._left ?  this._left.toString(ind, indentFistLine) : "";
        s += o;
        s += this._right ?  this._right.toString(ind, false) : "";
        return s;
    };
    /**
     * 
     * @returns {String}
     */
    p.getInlineStatementString = function() {
        var s = "", o = this.getOperator(), 
            letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        s += this._left ?  this._left.toString(true) : "";
        s += o;
        s += this._right ?  this._right.toString(true) : "";
        return s;
    };
    /**
     * 
     * @param {type} o
     * @returns {p}
     */
    p.setOperator = function(o) {
        this._operator = '=';
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    p.getOperator = function() {
        return '=';
    };
    var d;
    /**
     * 
     */
    Object.defineProperties(p, {
        "left" : d = { get: p.getLeft, set: p.setLeft },
        "variables" : d,
        "right" : d = { get: p.getRight, set: Assign.prototype.setRight },
        "object" : d,
        "operator": { get: p.getOperator, set: p.setOperator }
    });
    })(ODAssign);
    /**
     * <h3>Array Detructuring Assign</h3>
     * 
     * @returns {ADAssign}
     * @class ADAssign
     */
    function ADAssign() {
        Assign.apply(this, [].slice.call(arguments));
        this._operator = "=";
    }
    
    (function(A) {
        var p;
    /*
     * 
     */
    p = A.prototype = new Assign();
    
    A.__CLASS__ = A;
    
    A.__CLASS_NAME__ = "ADAssign";
    
    A.__SUPER_CLASS__ = Assign;
    
    p.__CLASS__ = A;
    
    p.__CLASS_NAME__ = "ADAssign";
    
    
    
    p.getOperator = function() {
        return "=";
    };
    /**
     * Returns true if the given object is valid (ok) value .
     * @param {type} o
     * @returns {Boolean}
     */
    A.isValid = function(o) {        
        return !A.nokValue(o);
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isExpression = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isStatement = function() {
        return true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    p.isYield = function() {
        return (this._left && this._left.isYield()) || (this._right && this._right.isYield());
    };
    /**
     * Returns true if the given object is not ok value (not valid value).
     * @param {type} o
     * @returns {Boolean}
     * @todo: identify all cases and integrate them
     */
    A.nokValue = function(o) {
        if (o instanceof Litteral || o instanceof VObject || o instanceof Func) {
            return true;
        }        
        if (o instanceof Value) {
            var v = o.valueOf();
            return v === null 
                    || ['number', 'boolean', 'string', 'undefined'].indexOf(typeof v) >= 0
                    || v instanceof Number || v instanceof Boolean || v instanceof String
            ;
        }
        return false;
    };
    
    
    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    p.setLeft = function(left) {
        if (isArray(left)) {
            if (left.length !== 1) {
                incorrectArg();//throw exception
            }
            left = left[0];
        }
        this._left = left;
        return this;
    };

    /**
     * 
     * @param {type} left
     * @return {LROperation}
     */
    p.addLeft = function(left) {
        if (this._left) {
            throw new Error("Too many left members");
        }
        if (isArray(left)) {
            if (left.length !== 1) {
                incorrectArg();//throw exception
            }
            left = left[0];
        }
        this._left = left;
        return this;
    };
    
    /**
     * 
     * @param {type} r
     * @return {LROperation}
     */
    p.setRight = function(r) {
        var e = Expression.getInstance(r);
        if (A.nokValue(e)) {
            throw new Error("Incorrect argument");
        }
        this._right = e;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    p.getStatementString = function(ind, indentFistLine) {
        var s = "", o = this.getOperator(), 
            letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        s += this._left ?  this._left.toString(ind, indentFistLine) : "";
        s += o;
        s += this._right ?  this._right.toString(ind, false) : "";
        return s;
    };
    /**
     * 
     * @returns {String}
     */
    p.getInlineStatementString = function() {
        var s = "", o = this.getOperator(), 
            letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if ( this._left && letters.indexOf(o[0]) >= 0) {
            o = ' ' + o;
        }

        if ( this._right && letters.indexOf(o[o.length - 1]) >= 0) {
            o += ' ';
        }
        s += this._left ?  this._left.toString(true) : "";
        s += o;
        s += this._right ?  this._right.toString(true) : "";
        return s;
    };
    
    p.getVariables = p.getLeft;
    
    p.getIterable = p.getRight;
    
    p.setVariables = p.setLeft;
    
    p.setIterable = p.setRight;
    
    p.getArray = p.getRight;
    
    p.setArray = p.setRight;
    
    var d;
    /**
     * 
     */
    Object.defineProperties(p, {
        "left" : d = { get: p.getLeft, set: p.setLeft },
        "variables" : d,
        "right" : d = { get: p.getRight, set: Assign.prototype.setRight },
        "iterable" : d,
        "operator": { get: p.getOperator, set: p.setOperator }
    });
    })(ADAssign);
   
   
   /**
    * 
    * @returns {SingleAssign}
    */
   function SingleAssign() {
      SingleAssign.__SUPER_CLASS__.apply(this, [].slice.call(arguments));
   }

   SingleAssign.__SUPER_CLASS__ = Assign;

   SingleAssign.prototype = new Assign();

   SingleAssign.prototype.__SUPER_CLASS__ = Assign;

   /**
    * 
    * @param {type} left
    * @return {LROperation}
    */
   SingleAssign.prototype.setLeft = function(left) {
       if (isArray(left)) {
           incorrectArg(); //throw exception
       }
       var l = Expression.getInstance(left);
       if (!((l instanceof Index) || (l instanceof Reference))) {
           incorrectArg();//throw exception
       }
       this._left = l;
       return this;
   };

   /**
    * 
    * @param {type} left
    * @return {LROperation}
    */
   SingleAssign.prototype.addLeft = function(left) {                
       return this;
   };

   /**
    * 
    * @param {type} left
    * @param {type} right
    * @returns {SingleAssign} 
    */
   SingleAssign.prototype.set = function(left, right) {
       if (isArray(left)) {
           incorrectArg(); //throw exception
       }
       if (!((left instanceof Index) || (left instanceof Reference))) {
           incorrectArg();//throw exception
       }
       this.setLeft(left);
       this.setRight(right);
   };

   Object.defineProperties(SingleAssign.prototype, {
       "left" : { get: SingleAssign.prototype.getLeft, set: SingleAssign.prototype.setLeft },
       "right" : { get: SingleAssign.prototype.getRight, set: SingleAssign.prototype.setRight },
       "operator": { get: SingleAssign.prototype.getOperator, set: SingleAssign.prototype.setOperator }
   });


   /**
    * 
    * @class MAssign
    */
   function MAssign() {
      MAssign.__SUPER_CLASS__.apply(this, [].slice.call(arguments));
   }

   MAssign.__SUPER_CLASS__ = Assign;

   MAssign.prototype = new Assign();

   MAssign.prototype.__SUPER_CLASS__ = Assign;

   /**
    * 
    * @param {type} left
    * @param {type} right
    * @returns {MAssign} 
    */
   MAssign.prototype.set = function(left, right) {
       if (isArray(left)) {
           if (!isArray(right) || right.length !== left.length) {
               incorrectArg();//throw exception
           }  
           var l;
           for (var i = 0, n = left.length; i < n; i++) {
               l = left[i];
               if (!((l instanceof Index) || (l instanceof Reference))) {
                   incorrectArg();//throw exception
               }
           }
       } else {
           if (!((left instanceof Index) || (left instanceof Reference))) {
               incorrectArg();//throw exception
           }
       }
       this._left = left;
       this._right = right;
       return this;
   };

   Object.defineProperties(MAssign.prototype, {
       "left" : { get: MAssign.prototype.getLeft, set: MAssign.prototype.setLeft },
       "right" : { get: MAssign.prototype.getRight, set: MAssign.prototype.setRight },
       "operator": { get: MAssign.prototype.getOperator, set: MAssign.prototype.setOperator }
   });
   

    /**
     * 
     * @param {type} o
     * @param {type} nvl
     * @returns {NullCoalescing}
     */
    function NullCoalescing(o, nvl) {

        if (arguments.length > 1) {
            this.setLeft(o);
            this.setRight(nvl);
        } else if (arguments.length === 1) {
            this.setLeft(coalesceProp(o, 'left', 'variable', 'expression', 'value'));
            this.setRight(coalesceProp(o, 'defaultValue', 'nullValue', 'nvl', 'right'));
        }
    }


    NullCoalescing.__CLASS__ = NullCoalescing;

    NullCoalescing.__CLASS_NAME__ = "NullCoalescing";

    NullCoalescing.prototype = new LROperation();

    NullCoalescing.prototype.__CLASS__ = NullCoalescing;

    NullCoalescing.prototype.__CLASS_NAME__ = "NullCoalescing";
    /**
     * 
     * @returns {String}
     */
    NullCoalescing.prototype.getOperator = function() {
        return "??";
    };
    /**
     * 
     * @param {type} o
     * @returns {NullCoalescing}
     */
    NullCoalescing.prototype.setOperator = function(o) {
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    NullCoalescing.prototype.getVariable = function() {
        return this.getLeft();
    };
    /**
     * 
     * @param {type} v
     * @returns {NullCoalescing}
     */
    NullCoalescing.prototype.setVariable = function(v) {
        this.setLeft(v);
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    NullCoalescing.prototype.getExpression = function() {
        return this.getLeft();
    };
    /**
     * 
     * @param {type} e
     * @returns {NullCoalescing}
     */
    NullCoalescing.prototype.setExpression = function(e) {
        this.setLeft(e);
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    NullCoalescing.prototype.getDefaultValue = function() {
        return this.getRight();
    };
    /**
     * 
     * @param {type} defVal
     * @returns {NullCoalescing}
     */
    NullCoalescing.prototype.setDefaultValue = function(defVal) {
        this.setRight(defVal);
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    NullCoalescing.prototype.getNullValue = function() {
        return this.getRight();
    };
    /**
     * 
     * @param {type} defVal
     * @returns {NullCoalescing}
     */
    NullCoalescing.prototype.setNullValue = function(defVal) {
        this.setRight(defVal);
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    NullCoalescing.prototype.isYield = function() {
        var e = this.getLeft();
        if (e && e.isYield()) {
            return true;
        }
        e = this.getRight();
        return e  && e.isYield();
    };
    
    Object.defineProperties(NullCoalescing.prototype, {
        left: {get: NullCoalescing.prototype.getLeft, set: NullCoalescing.prototype.setLeft },
        expression: {get: NullCoalescing.prototype.getExpression, set: NullCoalescing.prototype.setExpression },
        variable: {get: NullCoalescing.prototype.getVariable, set: NullCoalescing.prototype.setVariable },
        right: {get: NullCoalescing.prototype.getRight, set: NullCoalescing.prototype.setRight },
        defaultValue: {get: NullCoalescing.prototype.getDefaultValue, set: NullCoalescing.prototype.setDefaultValue },
        nullValue: {get: NullCoalescing.prototype.getNullValue, set: NullCoalescing.prototype.setNullValue },
        nvl: {get: NullCoalescing.prototype.getNullValue, set: NullCoalescing.prototype.setNullValue },
        operator: {get: NullCoalescing.prototype.getOperator, set: NullCoalescing.prototype.setOperator }
    });
    /**
     * 
     * <p>NullishCoalescing is an alia of NullCoalescing.</p>
     * @param {type} o
     * @param {type} nvl
     * @returns {NullCoalescing}
     * @see NullCoalescing
     */
    var NullishCoalescing = NullCoalescing;
    
    
    function ImportExportElt() {
        
    }
    
    
    ImportExportElt.prototype = new StatementElt();
    
    /**
     * 
     * @param {StatementElt|Object} s
     * @returns {ImportExportElt|ExportStatement|As|Aggregation|Decalaration|NamedFunction|AnonymousFunction|Class}
     */
    ImportExportElt.getInstance = function(s) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var ExportStatement = ns.ExportStatement||ExportStatement;
        var ImportExportElt = ns.ImportExportElt||ImportExportElt;
        var As = ns.As||As;
        var Aggregation = ns.Aggregation||Aggregation;
        var NamedFunction = ns.NamedFunction||NamedFunction;
        var AnonymousFunction = ns.AnonymousFunction||AnonymousFunction;
        var Declaration = ns.Declaration||Declaration;
        var Class = ns.Class||Class;

        if (s instanceof ExportStatement || s instanceof ImportExportElt
                || s instanceof As 
                || s instanceof Aggregation
                || s instanceof Declaration 
                || s instanceof NamedFunction
                || s instanceof AnonymousFunction
                || s instanceof Class) {
            return s;
        }
        if (isPlainObject(s)) {
            switch ((s.type||s.Type||"").toLowerCase()) {
                case 'list':
                    var EList = ns.EList||EList;
                    return new EList(s);
                case 'var':
                case 'let':
                case 'const':
                    return new Declaration(s);
                case 'default':
                    var EDefault = ns.EDefault||EDefault;
                    return new EDefault(s);
                case 'function':
                    var Func = ns.Func||Func;
                    return Func.getInstance(s);
                case 'class':
                    return new Class(s);
                case 'aggregation':
                case 'aggregate':
                case 'aggregating':
                case 'agg':
                    return new Aggregation(s);
                case '*':
                case 'all':
                    var All = ns.All||All;
                    return new All(s);
                case 'ename':
                case 'name':
                    var EName = ns.EName||EName;
                    return new EName(s);
                case 'as':
                    var As = ns.As||As;
                    return new As(s);
                case 'asentry':
                case 'as-entry':
                    var AsEntry = ns.AsEntry||AsEntry;
                    return new AsEntry(s);
                case 'module':
                    var EModule = ns.EModule||EModule;
                    return new EModule(s);
                case 'selection':
                case 'importselection':
                case 'import-selection':
                    var ImportSelection = ns.ImportSelection||ImportSelection;
                    return new ImportSelection(s);
                case 'importements':
                case 'import-ements':
                case 'elements':
                    var ImportElements = ns.ImportElements||ImportElements;
                    return new ImportElements(s);
                case 'dname':
                    var DName = ns.DName||DName;
                    return new DName(s);
                case 'adname':
                    var AliasDName = ns.AliasDName||AliasDName;
                    return new AliasDName(s);
            }
        }
        throw new Error("Invalid export statement");
    };

      
   /**
     * <h3>Destructuring Single Named Element</h3>
     * @param {String} name
     * @returns {EName}
     */
    function EName(name) {
        var o;
        if (isPlainObject( o = arguments[0])) {
            this._name = o.name||o.Name;
        } else {
            this._name = name;
        }
    }
    /**
     * 
     * @type DArrayElt
     */
    EName.prototype = new ImportExportElt();
    
    
    EName.__CLASS__ = EName;
    
    EName.__CLASS_NAME__ = "EName";
    
    EName.prototype.__CLASS__ = EName;
    
    EName.prototype.__CLASS_NAME__ = "EName";
    /**
     * 
     * @returns {String}
     */
    EName.prototype.toString = function() {
        return (this._name||"").toString();
    };
    /**
     * 
     * @returns {IComment}
     */
    EName.prototype.getEndComment = function() {
        return this._endComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EName}
     */
    EName.prototype.setEndComment = function(cmt) {
        this._endComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    EName.prototype.getInlineEndComment = function() {
        return this._inlineEndComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EName}
     */
    EName.prototype.setInlineEndComment = function(cmt) {
        this._inlineEndComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    EName.prototype.getComment = function() {
        return this._comment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EName}
     */
    EName.prototype.setComment = function(cmt) {
        this._comment = cmt;
        return this;
    };
   /**
    * 
    * @returns {AggStatement}
    */
   function AggStatement() {       
   }
   
   AggStatement.prototype = new ImportExportElt();
   
   
   function EDefault() {       
   }
   
   
   EDefault.prototype = new AggStatement();
   
   
   /**
    * 
    * @returns {String}
    */
   EDefault.prototype.getSymbol = function() {
       return "{default}";
   };
   
    
    EDefault.prototype.toStatementString = function() {
        return "{default}";
    };
    
    /**
     * 
     * @returns {String}
     */
    EDefault.prototype.getInlineStatementString = function() {
        return "{default}";
    };
    /**
     * 
     * @param {type} ind
     * @param {type} indentFirstLine
     * @returns {String}
     */
    EDefault.prototype.getStatementString = function(ind, indentFirstLine) {
        var _ind = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        return _ind + "{default}";
    };
   
    var DefaultStatement = EDefault;
   
   
    /**
     * 
     * @param {String} [alias=""]
     * @returns {undefined}
     */
    function All(alias) {  
        if (alias instanceof String) {
            alias = alias.toString();
        } else if (arguments.length > 0 && typeof alias !== 'string' && typeof alias !== 'undefined' && alias !== null) {
            incorrectArg();
        }
        this.__alias_ = alias||"";
    }

    All.prototype = new AggStatement();
    /**
     * 
     * @returns {String}
     */
    All.prototype.getSymbol = function() {
        return "*";
    };
    /**
     * 
     * @returns {String}
     */
    All.prototype.getAlias = function() {
        return this.__alias_||"";
    };
    /**
     * 
     * @param {type} alias
     * @returns {All.prototype}
     */
    All.prototype.setAlias = function(alias) {
        if (alias instanceof String) {
            alias = alias.toString();
        } else if (typeof alias !== 'string' && typeof alias !== 'undefined' && alias !== null) {
            incorrectArg();
        }
        this.__alias_ = alias||"";
        return this;
    };

    /**
     * 
     * @returns {String}
     */
    All.prototype.getInlineStatementString = function() {        
        return this.__alias_ ? "* as " + this.__alias_ : "*" ;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    All.prototype.getInlineStatementString = function(ind, indentFirstLine) { 
        var _ind = "";
        if (indentFirstLine) {
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
        }
        return _ind + (this.__alias_ ? "* as " + this.__alias_ : "*") ;
    };
    /**
     * 
     * @returns {String}
     */
    All.prototype.toString = function() {
        return "*";
    };
    /**
     * 
     */
    All.prototype = new AggStatement();



    var StarStatement = All;
   
   
    function ExportStatement() {

    }

    ExportStatement.prototype = new AggStatement();
    
    ExportStatement.getInstance = ImportExportElt.getInstance;
    

    /**
     * 
     * @returns {AsEntry}
     */
    function AsEntry() {
        this._variable = "";
        this._variableComment = null;
        this._variableEndComment = null;
        this._alias = "";
        this._aliasComment = null;
        this._aliasEndComment = null;

        if (arguments.length === 2) {
            this._variable = As.getString(arguments[0]);
            var n = arguments[1];
            if (typeof n === 'string') {
                this._alias = n;
            } else if (isPlainObject(n)) {
                this.set(n, false);
            } else {
                throw new Error("Incorrect arguments");
            }

        } else if (isPlainObject(arguments[0])) {
            this.set(arguments[0]);            
        }
    }
    /**
     * 
     * @returns {String}
     */
    AsEntry.prototype.getVariable = function() {
        return this._variable;
    };
    /**
     * 
     * @param {String} v
     * @returns {AsEntry.prototype}
     */
    AsEntry.prototype.setVariable = function(v) {
        this._variable = As.getString(v);
        return this;
    };

    /**
     * 
     * @returns {String}
     */
    AsEntry.prototype.getAlias = function() {
        return this._alias||"";
    };
    /**
     * 
     * @param {type} a
     * @returns {AsEntry}
     */
    AsEntry.prototype.setAlias = function(a) {
        this._alias = a ? As.getString(a) : "";
        return this;
    };
    /**
     * 
     * @param {Object} n
     * @param {Boolean} [setVarName=true]
     * @returns {AsEntry}
     */
    AsEntry.prototype.set = function(n, setVarName) {
        if (typeof setVarName === 'undefined' || setVarName === null || setVarName ) {
            this._variable = As.getString(n.variable||n.Variable||n.variableName||n.VariableName||n.name||n.Name);
        }
        var al = n.alias||n.Alias||n.name||n.Name;
        this._alias = al ? As.getString(al) : "";
        var c= n.comment||n.Comment||n.variableComment||n.VariableComment;
        if (c) {
            this._variableComment = Comment.getInstance(c);
        }

        c= n.variableEndComment||n.VariableEndComment;
        if (c) {
            this._variableComment = Comment.getInstance(c);
        }


        c= n.aliasEndComment||n.AliasEndComment;
        if (c) {
            this._aliasComment = Comment.getInstance(c);
        }

        c= n.endComment||n.EndComment||n.aliasEndComment||n.AliasEndComment;
        if (c) {
            this._aliasEndComment = Comment.getInstance(c);
        }
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    AsEntry.prototype.toStatementString = function() {
        var alias = this.getAlias()||"", v = this.getVariable()||"";
        return alias ? v + " as " + alias : v;
    };
    
    /**
     * 
     * @returns {As}
     */
    function As() {
        function fromArray(a, _this) {
            var n = a.length, name, e;
            if (n > 0) {
                if (typeof a[0] === 'string') {
                    n = (n - (n % 2))/2;            
                    for (var i = 0; i < n; i++) {
                        name = As.getString(a[2*i]);
                        _this._map[name] = e = new AsEntry(name, a[2*i+1]);
                        _this._entries[_this._entries.length] = e;
                    }
                } else if (isPlainObject(a[0])) {
                    var e;
                    for (var i = 0; i < n; i++) {
                        e = a[i];
                        _this._map[e.variable||e.Variable||e.name||e.Name] = e = new AsEntry(e);
                        _this._entries[_this._entries.length] = e;
                    }
                }  else if (isArray(a[0])) {
                    var e;
                    for (var i = 0; i < n; i++) {
                        e = a[i];
                        _this._map[e[0]] = e = new AsEntry(e);
                        _this._entries[_this._entries.length] = e;
                    }
                }
            }
        }
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0])) {
            args = args[0];
        }
        this._map = {};
        this._entries = [];
        if (arguments.length === 1) {
            var a = arguments[0], e;
            if (isPlainObject(a)) {
                for (var n in a) {
                    if (a.hasOwnProperty(n)) {
                        this._map[n] = e = new AsEntry(n, a[n]);
                        this._entries[this._entries.length] = e;
                    }
                }
            } else if (isArray(a)) {                
                fromArray(a, this);
            } else {
                incorectArg();
            }
        } else if (args.length > 1) {
            fromArray(args, this);
        }
       
    }
    
    As.prototype = new ExportStatement();
    /**
     * 
     * @param {Number} i The index
     * @returns {AsEntry}
     */
    As.prototype.fromIndex = function(i) {
        return this._entries[i];
    };
    /**
     * 
     * @param {String} k The key
     * @returns {AsEntry}
     */
    As.prototype.fromKey = function(k) {
        return this._map[k];
    };
    
    As.prototype.size = function() {
        return this._entries.length;
    };
    
    /**
     * 
     * @returns {String}
     */
    As.prototype.toStatementString = function() {
        var str = "{", entries = this._entries, n = entries.length;
        for (var i = 0; i < n; i++) {
            if (i > 0) {
                str += ", ";
            }
            str += entries[i].toStatementString();
        }
        return str + "}";
    };
    /**
     * 
     * @param {type} o
     * @returns {String}
     */
    As.getString = function(o) {
        if (typeof o !== 'string') {
            throw new Error("String expected");
        }
        return o; 
    };
    
    var Aliases = As;
    
    var AsList =  As;
    
    
   
    
    
    /**
     * 
     * @param {type} s
     * @param {type} from
     * @returns {Aggregation}
     * @class
     */
    function Aggregation(s, from) {
        if (arguments.length === 1) {
            this._statement = Export.getAggStatement(s.statement||s.Statement);
            var fo = s.from||s.From||s.path||s.Path||s.url||s.Url;
            this._from = fo instanceof QString ? fo : new QString(As.getString(fo));
        } else if (arguments.length > 1) {
            this._statement = Export.getAggStatement(s);
            this._from = from instanceof QString ? from : new QString(As.getString(from));
        }
    };
    
   
    Aggregation.prototype = new ExportStatement();
    /**
     * 
     * @returns {unresolved}
     */
    Aggregation.prototype.getStatement = function() {
        return this._statement;
    };
    /**
     * 
     * @param {type} s
     * @returns {Aggregation.prototype}
     */
    Aggregation.prototype.setStatement = function(s) {
        this._statement = Export.getAggStatement(s);        
        return this;
    };
    /**
     * 
     * @returns {unresolved}
     */
    Aggregation.prototype.getFrom = function() {
        return this._from;
    };
    /**
     * 
     * @param {QString|String} from
     * @returns {Aggregation.prototype}
     */
    Aggregation.prototype.setFrom = function(from) {
        this._from = from instanceof QString ? from : new QString(As.getString(from));        
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    Aggregation.prototype.toStatementString = function() {
        return (this._statement ? this._statement.toStatementtring(): "") 
                + " from " 
                + (this._from ? this._from.toString() : "");
    };
    
    /**
     * <h3>Destructuring Element</h3>
     * @returns {undefined}
     */
    function DElt() {}
    
    
    DElt.prototype = new StatementElt();
    
    /**
     * 
     * @returns {Boolean}
     */
    DElt.prototype.isExpression = function() {
        return false;
    };
    /**
     * 
     * @returns {Boolean}
     */
    DElt.prototype.isStatement = function() {
        return false;
    };
    
    
    
    /**
     * <h3>Destructuring Named Element</h3>
     * @returns {DArrayElt}
     * @class
     */
    function DArrayElt() {}
    
    
    DArrayElt.prototype = new DElt();
    
    DArrayElt.__CLASS__ = DArrayElt;
    
    DArrayElt.__CLASS_NAME__ = "DArrayElt";
    
    DArrayElt.prototype.__CLASS__ = DArrayElt;
    
    DArrayElt.prototype.__CLASS_NAME__ = "DArrayElt";
    
    
    DArrayElt.getInstance = function(e) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window;
        var DArrayElt = ns.DArrayElt||DArrayElt;
        var DName = ns.DName||DName;
        var ADVariables = ns.ADVariables||ADVariables;
        
        if (e instanceof DArrayElt || e instanceof ADVariables || e instanceof ODVariables) {
            return e;
        }
        
        if (e instanceof String) {
            e = e.valueOf();
        }
        
        if (typeof e === 'string') {
            return e ? new DName(e) : new SkipableElt();
        }
        if (e.type === 'name' || e.type === 'dname' || e.type === 'variable'  || e.type === 'var') {
            return new DName(e);
        }
        if (e.type === 'skip' || e.type === 'skipable') {
            return new SkipableElt(e);
        }
        if (e.type === 'rest' || e.type === 'remain' || e.rest) {
            return new DARest(e);
        }
        if (e.type === 'advars' || e.type === 'darray' || e.type === 'array') {
            return new ADVariables(e);
        }
        if (e.type === 'odvars' || e.type === 'dobject' || e.type === 'doptions' || e.type === 'object' || e.type === 'options') {
            return new ODVariables(e);
        }
        
        if (e.type === 'advarselt' || e.type === 'darrayelt' || e.type === 'arrayelt') {
            var _e = new VarsElt();
            if (e.variables instanceof ADVariables) {
                _e.setVariables(e.variables);
            } else {
                _e.setVariables(new ADVariables(e.variables||e));
            }
            _e.setDefaultValue(e.defaultValue);
            return _e;
        }
        if (e.type === 'odvarselt' || e.type === 'dobjectelt' || e.type === 'doptionselt') {
            var _e = new VarsElt();
            if (e.variables instanceof ODVariables) {
                _e.setVariables(e.variables);
            } else {
                _e.setVariables(new ODVariables(e.variables||e));
            }
            _e.setDefaultValue(e.defaultValue);
            return _e;
        }
        
        if (e.type === "varselt" || e.type === 'velt') {
            return new VarsElt(e);
        }
        
        if (!(e.name||e.Name)) {
            return new SkipableElt(e);
        }
        
        
        
        if (hasOwnProp(e, "alias") || hasOwnProp(e, "Alias")) {
            return new AliasDName(e);
        }
        if (hasOwnProp(e, "name") || hasOwnProp(e, "Name") || hasOwnProp(e, "defaultValue") || hasOwnProp(e, "DefaultValue") || hasOwnProp(e, "default") || hasOwnProp(e, "Default")) {
            return new DName(e);
        }
        if (e.type === 'default' || e.type === 'default named' 
                || e.type === 'default name' || e.type === 'default-named'
                || e.type === 'default-name') {
            var DefaultEName = ns.DefaultEName||DefaultEName;
            return new DefaultEName(e); 
        }
        if (e.type === 'composite' || e.type === 'array' || e.type === 'list') {
            var ADVariables = ns.ADVariables||ADVariables;
            e = new ADVariables(e); 
            if (e.type === 'array' || e.type === 'list')
                e.setArray(true);
            else if (e.type === 'object') {
                e.setArray(false);
            }
            return e;
        }
        
        if (e.type === 'dynamic') {
            var DynamicEName = ns.DynamicEName||DynamicEName;
            return new DynamicEName(e); 
        }
        if (e.type === '...' || e.type === 'tail' || e.type === 'spread' || e.type === 'rest') {
            var RestEName = ns.RestEName||RestEName;
            return new RestEName(e); 
        }
    };
    /**
     * 
     * @returns {DAItem}
     */
    function DAItem() {
        
    }
    DAItem.prototype =  new DArrayElt();
    /**
     * <h3>Destructuring Single Named Element</h3>
     * @param {String} name
     * @param {type} [defaultValue]
     * @returns {DName}
     */
    function DName(name, defaultValue) {
        var o;
        if (isPlainObject( o = arguments[0])) {
            this._name = o.name||o.Name;
            if (o.hasOwnProperty("defaultValue"))
                this.setDefaultValue(o.defaultValue);
            else if (o.hasOwnProperty("DefaultValue"))
                this.setDefaultValue(o.defaultValue);
            else if (o.hasOwnProperty("default"))
                this.setDefaultValue(o.default);
            else if (o.hasOwnProperty("Default"))
                this.setDefaultValue(o.Default);
        } else {
            this._name = name;
            if (arguments.length > 1 && defaultValue)
                this.setDefaultValue(defaultValue);
        }
    }
    /**
     * 
     * @type DArrayElt
     */
    DName.prototype = new DAItem();
    
    
    DName.__CLASS__ = DName;
    
    DName.__CLASS_NAME__ = "DName";
    
    DName.prototype.__CLASS__ = DName;
    
    DName.prototype.__CLASS_NAME__ = "DName";
    
    
    /**
     * 
     * @returns {String}
     */
    DName.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {String} name
     * @returns {DName}
     */
    DName.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {type}
     */
    DName.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    /**
     * 
     * @param {type} defaultValue
     * @returns {NVariable}
     */
    DName.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        this._yield = this._defaultValue 
                && typeof this._defaultValue.isYield === 'function' 
                && this._defaultValue.isYield();
        return this;
    };
    DName.prototype.isYield = function() {
        return this._yield;
    }
    /**
     * 
     * @param {Number} [ind=0]
     * @param {Boolean} [indentFirstLine=false]
     * @returns {String}
     */
    DName.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "",_ind = "";
        if (!ind) {
            ind = 0;
        }
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        str += (this._name||"").toString();
        if (this._afterNameInlineComment) {
            str += " " + this._afterNameInlineComment.getInlineString();
        }
        if (this._afterNameComment) {
            str += "\n" + _ind + this._afterNameComment.toString(ind, false);
        }
        if (this._defaultValue) {
            str += " = " + this._defaultValue.toString(ind, false);
        }
        return str;
    };
    /**
     * 
     * @returns {String}
     */
    DName.prototype.getInlineStatementString = function() {
        var str = "";
        str += (this._name||"").toString();
        if (this._afterNameInlineComment) {
            str += " " + this._afterNameInlineComment.getInlineString();
        }
        if (this._afterNameComment) {
            str += " " +this._afterNameComment.getInlineString();
        }
        if (this._defaultValue) {
            str += " = " + this._defaultValue.toString(true);
        }
        return str;
    };
    /**
     * 
     * @returns {IComment}
     */
    DName.prototype.getAfterNameInlineComment = function() {
        return this._afterNameInlineComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {DName}
     */
    DName.prototype.setAfterNameInlineComment = function(cmt) {
        this._afterNameInlineComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    DName.prototype.getAfterNameComment = function() {
        return this._afterNameComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {DName}
     */
    DName.prototype.setAfterNameComment = function(cmt) {
        this._afterNameComment = cmt;
        return this;
    };
    
    /**
     * 
     */
    Object.defineProperties(DName.prototype, {
        name: { get: DName.prototype.getName, set: DName.prototype.setName},
        defaultValue: { get: DName.prototype.getDefaultValue, set: DName.prototype.setDefaultValue}
    });
    
    /**
     * 
     * @param {type} n
     * @returns {DynamicEName|RestName|DOEntry|DName|DefaultEName}
     */
    DName.getInstance = function(n) {
        var ns = typeof SereniX !== 'undefined' && SereniX ? SereniX.prog||window: window, DName = this.__CLASS__;
        if (n instanceof DName) {
            return n;
        }
        switch ((n.type||n.Type||"").toLowerCase()) {
            case 'alias':
            case 'as':
                var DOE = ns.DOEntry||DOEntry;
                return new DOE(n);
            case '...':
            case 'rest':
            case 'spread':
                var RN = ns.RestName||RestName;
                return new RN(n);
            case 'default':
                var DEN = ns.DefaultEName||DefaultEName;
                return new DEN(n);
            case 'dynamic':
                var DEN = ns.DynamicEName||DynamicEName;
                return new DEN(n);
            case 'name':
            case '':
                return new DName(n.name||n.Name|n.variableName||n.VariableName);
        }
    };
    /**
     * 
     * @param {type} r
     * @returns {DARest}
     */
    function DARest(r) {
        if (r instanceof String) {
            r = r.valueOf();
        }
        if (typeof f === 'string') {
            this.setName(r);
        } else if (isPlainObject(r)) {
            this.setName(r.name||r.Name||r.variableName||r.VariableName||r.variable||r.Variable);
            this.setComments(r);
            var defVal = r.defaultValue||r.DefaultValue||r.default||r.Default;
            if (defVal) {
                this.setDefaultValue(defVal);
            }
        }
    }
    /**
     * 
     * @type DArrayElt
     */
    DARest.prototype = new DArrayElt();
    
    
    DARest.__CLASS__ = DARest;
    
    DARest.__CLASS_NAME__ = "DARest";
    
    DARest.prototype.__CLASS__ = DARest;
    
    DARest.prototype.__CLASS_NAME__ = "DARest";
    
    
    /**
     * 
     * @returns {String}
     */
    DARest.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {String} name
     * @returns {DARest}
     */
    DARest.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {VArray}
     */
    DARest.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    /**
     * 
     * @param {type} defaultValue
     * @returns {VArray}
     */
    DARest.prototype.setDefaultValue = function(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    DARest.prototype.isYield = function() {
        return false;
    };
    /**
     * 
     * @param {Number} ind
     * @param {type} indentFirstLine
     * @returns {Boolean}
     */
    DARest.prototype.getStatementString = function(ind,indentFirstLine) {
        var str = "";
        var _ind = "";
        
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        str += "..." + (this._name||"");
        if (this._defaultValue) {
            str += " = " + this._defaultValue.toString(ind, false); 
        }
        return str;
    };
    
    DARest.prototype.getInlineStatementString = function() {
        var str = "..." + (this._name||"");
        if (this._defaultValue) {
            str += "=" + this._defaultValue.toString(true); 
        }
        return str;
    };
    
    
    
    
    /**
     * 
     * @param {type} name
     * @returns {DefaultEName}
     */
    function DefaultEName(name) {
        this._name = name;
    }
    /**
     * 
     * @type EName
     */
    DefaultEName.prototype = new EName();
    
    DefaultEName.__CLASS__ = DefaultEName;
    
    DefaultEName.__CLASS_NAME__ = "DefaultEName";
    
    DefaultEName.prototype.__CLASS__ = DefaultEName;
    
    DefaultEName.prototype.__CLASS_NAME__ = "DefaultEName";
    
    /**
     * 
     * @returns {IComment}
     */
    DefaultEName.prototype.getAsComment = function() {
        return this._asComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EName}
     */
    DefaultEName.prototype.setAsComment = function(cmt) {
        this._asComment = cmt;
        return this;
    };
    
    
    
    /**
     * 
     * @param {type} name
     * @param {type} identifier
     * @returns {DynamicEName}
     */
    function DynamicEName(name, identifier) {
        this._name = name;
        this._identifier = identifier;
    }
    
    DynamicEName.prototype = new EName;
    
    DynamicEName.__CLASS__ = DynamicEName;
    
    DynamicEName.__CLASS_NAME__ = "DynamicEName";
    
    DynamicEName.prototype.__CLASS__ = DynamicEName;
    
    DynamicEName.prototype.__CLASS_NAME__ = "DynamicEName";
    /**
     * 
     * @returns {String}
     */
    DynamicEName.prototype.toString = function() {
        return '[' + (this._name||"").toString() + ']:' + (this._identifier||"").toString();
    };
    
    /**
     * 
     * @param {type} name
     * @returns {DefaultEName}
     */
    function RestEName(name) {
        this._name = name;
    }
    /**
     * 
     * @type EName
     */
    RestEName.prototype = new EName();
    
    RestEName.__CLASS__ = RestEName;
    
    RestEName.__CLASS_NAME__ = "RestEName";
    
    RestEName.prototype.__CLASS__ = RestEName;
    
    RestEName.prototype.__CLASS_NAME__ = "RestEName";
    
    /**
     * 
     * @returns {String}
     */
    RestEName.prototype.toString = function() {
        return "..." + (this._name||"").toString();
    };
    
    
    /**
     * 
     * @returns {String}
     */
    RestEName.prototype.toStatementString = function() {
        return "..." + (this._name||"").toString();
    };
    
    var SpreadEName = RestEName;
    
    var TailEName = RestEName;
    
    
    
    
    /**
     * <h3>Destructuring Skipable Array Element or No Name Element</h3>
     * @returns {DefaultEName}
     */
    function SkipableElt() {
        this._name = "";
    }
    /**
     * 
     * @type EName
     */
    SkipableElt.prototype = new DAItem();
    
    SkipableElt.__CLASS__ = SkipableElt;
    
    SkipableElt.__CLASS_NAME__ = "SkipableElt";
    
    SkipableElt.prototype.__CLASS__ = SkipableElt;
    
    SkipableElt.prototype.__CLASS_NAME__ = "SkipableElt";
    
    /**
     * 
     * @returns {String}
     */
    SkipableElt.prototype.toString = function() {
        return "";
    };
    /**
     * 
     * @returns {String}
     */
    SkipableElt.prototype.getName = function() {
        return "";
    };
    /**
     * 
     * @returns {Boolean}
     */
    SkipableElt.prototype.isYield = function() {
        return false;
    };
    /**
     * 
     * @param {type} name
     * @returns {SkipableElt}
     */
    SkipableElt.prototype.setName = function(name) {
        return this;
    };
    
    /**
     * 
     * @returns {String}
     */
    SkipableElt.prototype.getDefaultValue = function() {
        return undefined;
    };
    /**
     * 
     * @param {type} defVal
     * @returns {SkipableElt}
     */
    SkipableElt.prototype.setDefaultValue = function(defVal) {
        return this;
    };
    
    /**
     * 
     */
    Object.defineProperties(SkipableElt.prototype, {
        name: { value: "", writable : false},
        defaultValue: { value: undefined, writable : false}
    });
    
    
    
    var DNoName = SkipableElt;
    
    
    SkipableElt.SKIPABLE = new SkipableElt();
    
    /**
     * 
     * @type SkipableElt
     */
    DName.SKIPABLE = SkipableElt.SKIPABLE;
    
    
    
    
    
    /**
     * <h3>Array Destructuring Variables : composite Named Element</h3>
     * @returns {ADVariables}
     * @class
     */
    function ADVariables() {
        this._elts = [];
        this._eltsMap = {};
        this._optionalChaining = false;
        this.yields = 0;
        var a = arguments[0];
        if (arguments.length === 1) {
            var elts = a.elements||a.variables||a.items||a.array
                ||a.Elements||a.Variables||a.Items||a.Array;
            if (isArray(elts)) {
                this.add(elts);
                this.setComments(a);
                if (hasOwnProp(a,'optionalChaining')) {
                    this._optionalChaining = toBool(a.optionalChaining);
                } else if (hasOwnProp(a,'OptionalChaining')) {
                    this._optionalChaining = toBool(a.OptionalChaining);
                }
            } else if (isArray(a)) {
                this.add(a);
            } else  {
                
            }
        } else if (isArray(a) && typeof arguments[1] === 'boolean') {
            this.add(a);
            this._optionalChaining = arguments[1];
        } else if (arguments.length > 1) {
            this.add([].slice.call(arguments));
        }
    }
    
     /**
     * 
     * @type DArrayElt
     */
    ADVariables.prototype = new DArrayElt();
    
    ADVariables.__CLASS__ = ADVariables;
    
    ADVariables.__CLASS_NAME__ = "ADVariables";
    
    ADVariables.__SUPER_CLASS__ = DArrayElt;
    
    ADVariables.prototype.__CLASS__ = ADVariables;
    
    ADVariables.prototype.__CLASS_NAME__ = "ADVariables";
    
    ADVariables.prototype.__SUPER_CLASS__ = DArrayElt;
    
    
    
    /**
     * 
     * @returns {Boolean}
     */
    ADVariables.prototype.isOptionalChaining = function() {
        return this._optionalChaining;
    };
    
    /**
     * 
     * @param {Boolean} optionalChaining
     * @returns {ADVariables}
     */
    ADVariables.prototype.setOptionalChaining = function(optionalChaining) {
        if (arguments.length === 0) {
            this._optionalChaining = true;
        } else {
            this._optionalChaining = toBool(optionalChaining);
        }
        this.__variablesAndPaths = null;
        return this;
    };
    /**
     * 
     * @returns {Boolean}
     */
    ADVariables.prototype.isYield = function() {
        return this.yields > 0;
    }
    /**
     * <p>Adds a variable or a list of variables that destructures array. A 
     * variable can be a name (string) or an object.</p>
     * <h3>Syntax:</h3>
     * <ul>
     * <li><b>add</b>(v: {String|DName|ADVariables|SkipableElt|Object|Array&lt;String|DName|ADVariables|SkipableElt|Object&gt;})</li>
     * <li>add</b>(v1: {String|DName|ADVariables|SkipableElt|Object|Array&lt;String|DName|ADVariables|SkipableElt|Object&gt;}, v2: {String|DName|ADVariables|SkipableElt|Object|Array&lt;String|DName|ADVariables|SkipableElt|Object&gt;}, ...)</li>
     * <ul>
     * @returns {ADVariables.prototype}
     */
    ADVariables.prototype.add = function() {  
        function _add(e, name, self) {
            name = e.getName();
            if (self._eltsMap[name]) {
                throw new Error("Too many elements with name: '" + name + "'");
            }
            self._eltsMap[name] = e;
        }
        function checkRest(i, n) {
            if (self._restName) {
                throw new Error("Too many rest elements");
            }
            if (i < n - 1) {
                throw new Error("The rest element must be the last element");
            }
        } 
        function setArray(arr, self) {
            var n = arr.length, e, name;
            for (var i = 0; i < n; i++) {
                e = arr[i];
                if (typeof e === 'string') {
                    if (e.startsWith("...")) {
                        checkRest(i, n);
                        self._restName = name = e.substring(3);
                        e = new DARest(name);
                    } else {
                        e = new DName(name = e);
                    }
                } else if (e instanceof DARest) {
                    checkRest(i, n);
                    self._restName = name = e.getName();
                } else {
                    e = e instanceof ODVariables? e : DArrayElt.getInstance(e);
                    if (e instanceof DARest) {
                        checkRest(i, n);
                        self._restName = name = e.getName();
                    } else if (!(e instanceof DArrayElt || e instanceof ODVariables)) {
                        throw new Error("Incorrect element");
                    }
                }
                if (!(e instanceof SkipableElt  || e instanceof ADVariables || e instanceof ODVariables || e instanceof VarsElt)) {
                    _add(e, name, self);
                }
                self._elts[self._elts.length] = e;
                try {
                    if (e.isYield()) {
                        this.yields++;
                    }
                } catch (err) {
                    throw err;
                }
            }
        }
        
        var self = this;
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isPlainObject(a)) {
                var elts = a.elements||a.elts||a.Elements||a.Elts||a.list||a.List;
                if (isArray(elts)) {
                    setArray(elts, this);
                } else {
                    setArray([a], this);
                }
            } else if (isArray(a)) {
                setArray(a, this);
            }
        } else if (arguments.length > 1) {
            setArray([].slice.call(arguments), this);
        }
        this.__variablesAndPaths = null;
        return this;
    };
    /**
     * 
     * @param {Boolean} array
     * @returns {ADVariables}
     */
    ADVariables.prototype.setArray = function(array) {
        this._array = array;
        return this;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    ADVariables.prototype.getArray = function() {
        return this._array;
    };
    
    /**
     * 
     * @returns {Boolean}
     */
    ADVariables.prototype.isArray = function() {
        return this._array === true;
    };
    /**
     * 
     * @returns {Boolean}
     */
    ADVariables.prototype.isObject = function() {
        return this._array === false;
    };
    
    /**
     * 
     * @returns {ADVariables}
     */
    ADVariables.prototype.set = function() { 
        this._elts = [];
        this._eltsMap = {};
        this.__variablesAndPaths = null;
        return this.add([].slice.call(arguments));        
    };
    /**
     * 
     * @param {type} k
     * @returns {DArrayElt|ADVariables._eltsMap|DArrayElt.get.o|Array|ADVariables|DArrayElt.get.e}
     */
    ADVariables.prototype.get = function(k) { 
        if (k instanceof Number || k instanceof  String) {
            k = k.valueOf();
        }
        if (typeof k === 'number') {
            return this._elts[k];
        }
        if (typeof k === 'string') {
            return this._eltsMap[k];
        }
        throw new Error("Incorrect argument");
    };
    /**
     * 
     * @returns {Number}
     */
    ADVariables.prototype.size = function() { 
        return this._elts.length;
    };
    /**
     * 
     * Returns how to get the values of the array destructuring variables from 
     * the array (iterable) assigned to be destructured (gat values into).
     * <ul>
     * <li><p>Variable of the destructuring array correspond to variable object 
     * with the following fields:</p>
     * <ul>
     * <li><b color="orange">name</b>:</li>
     * <li><b color="orange">path</b>:</li>
     * <li><b color="orange">defaultValue</b>:the default value to use when the 
     * the corresponding value of the variable in the iterable (array) object is
     * <b color="blue">undefined</b> or <b color="blue">null</b>.</li>
     * </ul>
     * </li>
     * <li><p>Optional chaining destructuring array correspond to an entry with the 
     * following fields:</p>
     * <ul>
     * <li><b color="orange">path</b>:</li>
     * <li><b color="orange">undefDefaultValues</b>: The default values to
     * use when the value of the array to destructure  is 
     * <b color="blue">undefined</b> or <b color="blue">null</b>.</li>
     * <li><b color="orange">variables</b>:the variables and paths to use to 
     * get values and also entries for elements that are optional destructuring 
     * arrays.</li>
     * </ul>
     * </li>
     * </ul>
     * @returns {Array}
     */
    ADVariables.prototype.variablesAndPaths = function() {
        function add(names, _names) {
            var _name;
            for (var j = 0, count = _names.length; j < count; j++) {
                _name = _names[j];
                if (names.indexOf(_name) >= 0) {
                    throw new Error("Too many variable name: '" + _name + "'");
                }
                names[names.length] = _name;
            }
        }
        function process (arr, path, paths, defaultValues, names) { 
            var elts = arr._elts, n = elts.length, e, name, p,defVals, _paths,defVal;
            if (arr.isOptionalChaining()) {
                _paths = [];
                var _defaultValues = {};
                var entry = { 
                    'path': path,
                    //default value to used when the value corresponding to the pathin the array is undefined or null
                    'undefDefaultValues': _defaultValues,
                    'variables': _paths
                };
                defVals = defaultValues.slice();
                defVals[defVals.length] = _defaultValues;
                paths[paths.length] = entry;
            } else { 
                _paths = paths;
                defVals = defaultValues;
            }
            for (var i = 0; i < n; i++) {
                e = elts[i];
                if (e instanceof DName) {
                    name = e.getName(); 
                    names[names.length] = name;
                    defVal = e.getDefaultValue();
                    _paths[_paths.length] = e = { name : name,path: path + "[" + i + "]" };
                    if (typeof defVal !== 'undefined') {
                        e.defaultValue = defVal;
                    }
                    for (var k = 0,len = defVals.length;k< len; k++) {
                        defVals[k][name] = typeof defVal === 'undefined' ? Undefined.UNDEFINED : defVal;
                    }
                } else if (e instanceof DARest) {
                    name = e.getName(); 
                    names[names.length] = name;
                    defVal = e.getDefaultValue();
                    _paths[_paths.length] = e = { name : name,path: path, index: i, rest : true};
                    if (typeof defVal !== 'undefined') {
                        e.defaultValue = defVal;
                    }
                    for (var k = 0,len = defVals.length;k< len; k++) {
                        defVals[k][name] = typeof defVal === 'undefined' ? Undefined.UNDEFINED : defVal;
                    }
                } else if (e instanceof ADVariables) {
                    process (e, path + "[" + i + "]", _paths, defVals,names);
                } else if (e instanceof ODVariables) {
                    var p, _names = [];
                    _paths[_paths.length] = p = e.variablesAndPaths(path + "[" + i + "]", [], defVals, _names);
                    p.path = path + "[" + i + "]";
                    add(names, _names);
                } else if (e instanceof VarsElt) {
                    var v = e.getVariables(), p, _names = [];
                    _paths[_paths.length] = p = v.variablesAndPaths(path + "[" + i + "]", [], defVals, _names);
                    add(names, _names);
                    p.path = path + "[" + i + "]";
                    v = e.getDefaultValue();
                    if (typeof v !== 'undefined' && v !== null &&  v !== Value.NO_VALUE && !(v instanceof Value && v.isNaV())) {
                        p.defaultValue = v;
                    }
                } else if (!(e instanceof SkipableElt)) {
                    throw new Error("Incorrect array destructuring entry/element");
                }
            }            
        }
        if (!this.__variablesAndPaths) {
            var paths = arguments[1]||[], names = arguments[3]||[], path = arguments[0]||"";
            process (this, path, paths, /* default values */ arguments[2]||[], names);
            this.__variablesAndPaths = { paths: paths, variables : names, path: path };
        }
        return this.__variablesAndPaths;
    };

    /**
     * 
     * @param {String} p
     * @returns {Array}
     */
    ADVariables.tokenize=function(p) {
        var letters = "abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
        if (letters.indexOf(p[0]) >= 0 ) {
            return p;
        }
        var token = "", ofs = 0, n = p.length, ch, tokens = [];
        var i = 0, _var = false; 
        while (i < n) {
            ch = p[i];
            if (_var) {
                if (" \t\n\r\v\b\0".indexOf(ch) >= 0) {
                    i++;
                } else if (ch === '.') {
                    tokens[tokens.length] = token;
                    token = "";
                    ofs = ++i;
                    if (letters.indexOf(p[i]) >= 0 ) {
                        tokens[tokens.length] = p.substring(i).trim();
                        return tokens;
                    }
                    _var = false;
                } else {
                    unexpectedChar(ch, i);
                }
            } else if (ch === '.') {
                token += p.substring(ofs, i);
                token = token.trim();
                if (!token) {
                    unexpectedChar(ch, i);
                }
                tokens[tokens.length] = token;
                token = "";
                ofs = ++i;
            } else if (ch === '\'' || ch === '"') {
                if (ofs < i) {
                    unexpectedChar(ch, i);
                }
                token = getVarName(p, i + 2, ch, ch);
                i = ofs = token[1];
                token = token[0];
                _var = true;
            } else if (p.startsWith("${")) {
                if (ofs < i) {
                    unexpectedChar(ch, i);
                }
                token = getVarName(p, i + 2, "${", "}");
                token = getVarName(p, i + 2, ch, ch);
                i = ofs = token[1];
                token = token[0];
                _var = true;
            } else if (ch === '\\') {
                if (i + 1 < n && "\\$.{\'\"".indexOf(p[i + 1]) >= 0) {
                    token += p.substring(ofs, i) + p[i + 1];
                    i += 2;
                    ofs = i;
                } else {
                    i++;
                }
            } else if (ch === '{') {
                if (ofs < i) {
                    unexpectedChar(ch, i);
                }
                token = getVarName(p, i + 2, "{", "}");
                i = ofs = token[1];
                token = token[0];
                _var = true;
            } else {
                i++;
            }
        }
        if (_var) {
            tokens[tokens.length] = token;
        } else if (ofs < i) {
            token += p.substring(ofs);
            token = token.trim();
            if (token) {
                tokens[tokens.length] = token;
            } else if (tokens.length > 0) {
                throw "Incorrect path: '" + p + "'";
            }
        }
        return tokens;
    };
    /**
     * 
     * @param {Number|String} p
     * @returns {DArrayElt}
     */
    ADVariables.prototype.get = function(p) { 
        var path;
        if (typeof p === 'string') {
            path = p;
            var o = this._eltsMap[p];
            if (o || "0123456789".indexOf(p[0]) < 0) {
                return o;
            }
            p = ADVariables.tokenize(p);
        } else if (Number.isInteger(p)) {
            return this._elts[p];
        } else if (!isArray(p)) {
            throw new Error("Incorrect argument");
        }
        var n = p.length - 1, e = this, k = 0, i;
        
        do {
            if (! (e instanceof ADVariables)) {
                throw new Error("Incorrect path at depth = " + (k + 1)+ ": '" + path);
            }
            i = toInteger(p[k]);
            if (Number.isNaN(i) || i === 0) {
                throw new Error("Token " + (k + 1) + " incorrect");
            }
            e = e._elts[i - 1];            
            k++;
        } while (k < n);
        if (n > 0) {
            if (! (e instanceof ADVariables)) {
                throw new Error("Incorrect path at depth = " + (k + 1)+ ": '" + path);
            }
            var key =  p[k];
            if ("0123456789".indexOf(key[0]) >= 0) {
                i = toInteger(p[k]);
                if (Number.isNaN(i) || i === 0) {
                    throw new Error("Token " + (k + 1) + " incorrect");
                }
                e = e._elts[i - 1];
            } else { 
                e._eltsMap[key]; 
            }
        }
        return e;
    };
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    ADVariables.prototype.getStatementString = function(ind, indentFirstLine) {
        var str = "", _ind = "";
        for (var i = 0; i < ind; i++) {
            _ind += "    ";
        }
        if (indentFirstLine) {
            str += _ind;
        }
        var nli = "\n" + _ind+ "    ";
        
        if (this._optionalChaining) {
            str += "?";
        }
        
        str+= "[";
        var elts = this._elts, n = elts.length, e, name, p;
        
        for (var i = 0; i < n; i++) {
            e = elts[i];
            if (i > 0) {
                str += ",";
            }
            str += nli+ e.toString(ind + 1, false);
        }
        
        str += "\n" + _ind + "]";
        return str;
    };
    
    /**
     * 
     * @returns {String}
     */
    ADVariables.prototype.getInlineStatementString = function() {
        var str = "";

        
        if (this._optionalChaining) {
            str += "?";
        }
        
        str+= "[ ";
        var elts = this._elts, n = elts.length, e, name, p;
        
        for (var i = 0; i < n; i++) {
            e = elts[i];
            if (i > 0) {
                str += ", ";
            }
            str += e.toString(true);
        }
        
        str += " ]";
        return str;
    };
    
    var DArray = ADVariables;
    
    /**
     * 
     * @param {type} e
     * @returns {VarsElt}
     */
    function VarsElt(e) {
        if (isPlainObject(e)) {
            if (arguments.length > 1) {
                if (e instanceof ODVariables || e instanceof ADVariables) {
                    this._variables = e;
                } else {
                    if (e.type === 'advars' || e.type === 'darray' || e.type === 'array') {
                        this._variables = new ADVariables(e);
                    } else if (e.type === 'odvars' || 'dobject' || e.type === 'doptions' || e.type === 'object' || e.type === 'options') {
                        this._variables = new ODVariables(e);
                    } else {
                        throw new Error("Incoorect argument");
                    }
                }
                this.setDefaultValue(arguments[1]);
            } else {
                if (e.variables instanceof ODVariables || e.variables instanceof ADVariables) {
                    this.setVariables(e.variables);
                } else {
                    var v = e.variables;
                    if (v.type === 'advars' || v.type === 'darray' || v.type === 'array') {
                        this._variables = new ADVariables(v);
                    } else if (v.type === 'odvars' || 'dobject' || v.type === 'doptions' || v.type === 'object' || v.type === 'options') {
                        this._variables = new ODVariables(v);
                    } else {
                        throw new Error("Incoorect argument");
                    }
                }
                this.setDefaultValue(e.defaultValue);
            }
        }
    }
    
    /**
     * 
     * @type DArrayElt
     */
    VarsElt.prototype = new DArrayElt();
    
    VarsElt.__CLASS__ = VarsElt;
    
    VarsElt.__CLASS_NAME__ = "VarsElt";
    
    VarsElt.__SUPER_CLASS__ = DArrayElt;
    
    VarsElt.prototype.__CLASS__ = VarsElt;
    
    VarsElt.prototype.__CLASS_NAME__ = "VarsElt";
    
    VarsElt.prototype.__SUPER_CLASS__ = DArrayElt;
    
    /**
     * 
     * @param {ODVariables|ADVariables} v
     * @returns {VarsElt}
     */
    VarsElt.prototype.setVariables = function(v) {
        if (!(v instanceof ODVariables || v instanceof ADVariables)) {
            throw new Error("Incorrect argument");
        }
        this._variables = v;
        return this;
    };
    /**
     * 
     * @returns {ODVariables|ADVariables}
     */
    VarsElt.prototype.getVariables = function() {
        return this._variables;
    };
    
    VarsElt.prototype.isYield = function() {
        return (this._variables && this._variables.isYield()) || (this._defaultValue && typeof this._defaultValue.isYield === 'function' && this._defaultValue.isYield());
    };
    
    /**
     * 
     * @param {Object|Array} v The default value
     * @returns {VarsElt}
     */
    VarsElt.prototype.setDefaultValue = function(v) {
        if (this._variables instanceof ADVariables) {
            if (!isArray(v))
                throw new Error("Incorrect argument");
        } else {
            if (!(typeof v === 'object' || typeof v === 'function'))
                throw new Error("Incorrect argument");
        }
        this._defaultValue = v;
        return this;
    };
    /**
     * 
     * @returns {Array|Object}
     */
    VarsElt.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    VarsElt.prototype.getStatementString = function(ind, indentFirstLine) {
        if (this._defaultValue) {
            return this._variables.toString(ind, indentFirstLine) + ' = ' + this._defaultValue.toString(ind, false);
        }
        return this._variables.toString(ind, indentFirstLine);
    };
    
    
    /**
     * 
     * @returns {String}
     */
    VarsElt.prototype.getInlineStatementString = function() {
        if (this._defaultValue) {
            return this._variables.toString(true) + ' = ' + this._defaultValue.toString(true);
        }
        return this._variables.toString(true);
    }; 
    /**
     * 
     * @param {type} p
     * @returns {DParam}
     */
    function DParam(p) {
        if (isPlainObject(p)) {
            if (arguments.length > 1) {
                if (p instanceof ODVariables || p instanceof ADVariables) {
                    this._variables = p;
                } else {
                    if (p.type === 'advars' || p.type === 'darray' || p.type === 'array') {
                        this._variables = new ADVariables(p);
                    } else if (p.type === 'odvars' || 'dobject' || p.type === 'doptions' || p.type === 'object' || p.type === 'options') {
                        this._variables = new ODVariables(p);
                    } else {
                        throw new Error("Incoorect argument");
                    }
                }
                this.setDefaultValue(arguments[1]);
            } else {
                if (p.variables instanceof ODVariables || p.variables instanceof ADVariables) {
                    this.setVariables(p.variables);
                } else {
                    var v = p.variables;
                    if (v.type === 'advars' || v.type === 'darray' || v.type === 'array') {
                        this._variables = new ADVariables(v);
                    } else if (v.type === 'odvars' || 'dobject' || v.type === 'doptions' || v.type === 'object' || v.type === 'options') {
                        this._variables = new ODVariables(v);
                    } else {
                        throw new Error("Incoorect argument");
                    }
                }
                this.setDefaultValue(p.defaultValue);
            }
        }
    }
    DParam.prototype = new AParam();
    DParam.__CLASS__ = DParam;
    
    DParam.__CLASS_NAME__ = "DParam";
    
    DParam.__SUPER_CLASS__ = AParam;
    
    DParam.prototype.__CLASS__ = DParam;
    
    DParam.prototype.__CLASS_NAME__ = "DParam";
    
    DParam.prototype.__SUPER_CLASS__ = AParam;
    /**
     * 
     * @param {ODVariables|ADVariables} v
     * @returns {DParam}
     */
    DParam.prototype.setVariables = function(v) {
        if (!(v instanceof ODVariables || v instanceof ADVariables)) {
            throw new Error("Incorrect argument");
        }
        this._variables = v;
        return this;
    };
    /**
     * 
     * @returns {ODVariables|ADVariables}
     */
    DParam.prototype.getVariables = function() {
        return this._variables;
    };
    
    /**
     * 
     * @param {Object|Array} v The default value
     * @returns {DParam}
     */
    DParam.prototype.setDefaultValue = function(v) {
        if (this._variables instanceof ADVariables) {
            if (!isArray(v))
                throw new Error("Incorrect argument");
        } else {
            if (!(typeof v === 'object' || typeof v === 'function'))
                throw new Error("Incorrect argument");
        }
        this._defaultValue = v;
        return this;
    };
    /**
     * 
     * @returns {Array|Object}
     */
    DParam.prototype.getDefaultValue = function() {
        return this._defaultValue;
    };
    
    /**
     * 
     * @param {Number} ind
     * @param {Boolean} indentFirstLine
     * @returns {String}
     */
    DParam.prototype.getStatementString = function(ind, indentFirstLine) {
        if (this._defaultValue) {
            return this._variables.toString(ind, indentFirstLine) + ' = ' + this._defaultValue.toString(ind, false);
        }
        return this._variables.toString(ind, indentFirstLine);
    };
    
    
    /**
     * 
     * @returns {String}
     */
    DParam.prototype.getInlineStatementString = function() {
        if (this._defaultValue) {
            return this._variables.toString(true) + ' = ' + this._defaultValue.toString(true);
        }
        return this._variables.toString(true);
    };
    
    
    
    
    /**
     * 
     * @param {type} name
     * @param {type} alias
     * @param {type} [defaultValue]
     * @returns {AliaEName}
     */
    function AliasDName(name, alias, defaultValue) {
        var o;
        if (isPlainObject( o = arguments[0])) {
            this._name = o.name||o.Name||o.variable||o.variableName||o.Variable||o.VariableName;
            this._alias = o.alias||o.Alias||o.identifier||o.Identifier;
            if (hasOwnProp(o, "defaultValue"))
                this._defaultValue = o.defaultValue;
            else if (hasOwnProp(o, "DefaultValue"))
                this._defaultValue = o.defaultValue;
            else if (hasOwnProp(o, "default"))
                this._defaultValue = o.default;
            else if (hasOwnProp(o, "Default"))
                this._defaultValue = o.Default;
        } else {
            this._name = name;
            this._alias = alias;
            if (arguments.length > 2)
                this._defaultValue = defaultValue;
        }
    }
    /**
     * 
     * @type DName
     */
    AliasDName.prototype = new DName;
    
    /**
     * 
     * @returns {String}
     */
    AliasDName.prototype.toString = function() {
        return (this._name||"").toString() + " as " + (this._alias||"").toString();
    };
    
    /**
     * 
     * @returns {IComment}
     */
    AliasDName.prototype.getAsComment = function() {
        return this._asComment;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EName}
     */
    AliasDName.prototype.setAsComment = function(cmt) {
        this._asComment = cmt;
        return this;
    };
    
    var ADName =  AliasDName;
    
    
    
    /**
     * 
     * @param {type} name
     * @param {type} alias
     * @returns {AliaEName}
     */
    function VEName(name, alias) {
        if (arguments.length === 1) {
            var o = arguments[0];
            if (o instanceof String) {
                o = o.valueOf();
            }
            if (typeof o === 'string') {
                this._name = o;
            } else if (isPlainObject(o)) {
                this._name = o.name||o.Name||"";
                this._alias = o.alias||o.Alias||"";
                var v = o.value||o.Value;
                if (v instanceof Expression) {
                    this._value = v;
                } else if (isArray(v)) {
                    this._value = new VArray(v);
                } else if (isPlainObject(v)) {
                    this._value = new VObject(v);
                } else {
                    this._value = Expression.getInstance();
                }
            }
        } else {
            this._name = name||"";
            this._alias = alias||"";
            if (arguments.length > 2) {
                var v = arguments[2];
                if (v instanceof Expression) {
                    this._value = v;
                } else if (isArray(v)) {
                    this._value = new VArray(v);
                } else if (isPlainObject(v)) {
                    this._value = new VObject(v);
                } else {
                    this._value = Expression.getInstance();
                }
            }
        }
    }
    
    VEName.prototype = new EName;
    
    /**
     * 
     * @returns {VEName.o|Arguments|type|o@call;valueOf.name|o@call;valueOf.Name|String}
     */
    VEName.prototype.getName = function() {
        return this._name;
    };
    /**
     * 
     * @param {type} name
     * @returns {VEName}
     */
    VEName.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    VEName.prototype.getAlias = function() {
        return this._alias;
    };
    /**
     * 
     * @param {String} alias
     * @returns {VEName}
     */
    VEName.prototype.setAlias = function(alias) {
        this._alias = alias;
        return this;
    };
    /**
     * 
     * @returns {String}
     */
    VEName.prototype.getValue = function() {
        return this._value;
    };
    /**
     * 
     * @param {String} value
     * @returns {VEName}
     */
    VEName.prototype.setValue = function(value) {
        this._value = value;
        return this;
    };
    
    var ValuedEName =  VEName;
    
    /**
     * <h3>Export List</h3>
     * @param {Array} elts
     * @returns {EList}
     */
    function EList(elts) {
        if (arguments.length === 0)
            this._elements = [];
        else if (isArray(elts)) {
            this.setElements(elts);
        } else {
            if (!isPlainObject(elts)) {
                throw new Error("Incorrect argument");
            } else {
                var items = elts.elements||elts.exports||elts.names||elts.imports||elts.items;
                if (!isArray(items)) {
                    throw new Error("Incorrect argument");
                }
                this.setElements(items);
            }
            
        }
    }
    
    EList.prototype = new ExportStatement();
    /**
     * 
     * @returns {undefined}
     */
    EList.prototype.setElements = function() {
        this._elements = [];
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0]) ) {
            args = args[0];
        }
        var n = args.length;
        for (var i = 0; i < n; i++) {
            this._elements[i] = EName.getInstance(args[i]);
        }
        return this;
    };
    
    /**
     * 
     * @param {Object|Array} e
     * @returns {EList}
     */
    EList.prototype.add = function(e) {
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0]) ) {
            args = args[0];
        }
        var n = args.length, next = this._elements.length;
        for (var i = 0; i < n; i++) {
            this._elements[next++] = ImportExportElt.getInstance(args[i]);
        }
        return this;
    };
    
    /**
     * 
     * @returns {EList}
     */
    EList.prototype.addElements = function() {
        var args = [].slice.call(arguments);
        while (args.length === 1 && isArray(args[0]) ) {
            args = args[0];
        }
        var n = args.length;
        for (var i = 0; i < n; i++) {
            this._elements[i] = EName.getInstance(args[i]);
        }
        return this;
    };
    /**
     * 
     * @param {IComment} cmt
     * @returns {EList}
     */
    EList.prototype.setInnerInlineComment = function(cmt) {
        this._innerInlineComment = cmt;
        return this;
    };
    /**
     * 
     * @returns {IComment}
     */
    EList.prototype.getInnerInlineComment = function() {
        return this._innerInlineComment;
    };
    
    
    /**
     * 
     * @param {String|Object} [name]
     * @returns {DefaultExport}
     * @class DefaultExport
     */
    function DefaultExport(name) {
         if (name instanceof String) {
             name = name.toString("");
         }
         if (typeof name === 'string') {
             this.setName(name);
         } else if (isPlainObject(name)) {
              var n = name.name||name.Name||name.export||name.Export||name.value||name.Value;
              if (n) {
                  this.setName(n);
              }
         }
    }
   
    DefaultExport.__CLASS__ = DefaultExport; 
   
    DefaultExport.__CLASS_NAME__ = "DefaultExport"; 
   
   
   
   
    DefaultExport.prototype.setName = function() {
        return this._name||"";
    };
   
    DefaultExport.prototype.setName = function(n) {
        if (n instanceof String) {
            n = n.toString("");
        }
        if (typeof n !== 'string') {            
            throw new Error("String expected");
        }  
        this._name = n;
        return this;
    };
    
    /**
     * 
     * @param {Object|String} defaultExport
     * @param {Object|String} namedExports
     * @returns {ImportElements}
     */
    function ImportElements(defaultExport, namedExports) {
        if (arguments.length === 1) {
            var opts = arguments[0];
            this.setDefaultExport(opts.defaultExport);
            this.setNamedExports(opts.namedExports||opts.exports||opts.list||opts.elements||opts.exports);
        } else if (arguments.length > 1) {
            this.setDefaultExport(defaultExport);
            this.setNamedExports(namedExports);
        }
    }
    
    
    
    ImportElements.__CLASS__ = ImportElements;
    
    ImportElements.__CLASS_NAME__ = "ImportElements";
    
    ImportElements.prototype.__CLASS__ = ImportElements;
    
    ImportElements.prototype.__CLASS_NAME__ = "ImportElements";
    
    /**
     * 
     * @returns {DefaultExport}
     */
    ImportElements.prototype.getDefaultExport = function() {
        return this._defaultExport;
    };
    /**
     * 
     * @param {DefaultExport|Object|String} defaultExport
     * @returns {ImportElements}
     */
    ImportElements.prototype.setDefaultExport = function(defaultExport) {
        if (defaultExport instanceof DefaultExport) {
            this._defaultExport = defaultExport;
        } else if (typeof defaultExport === 'string' 
                || defaultExport instanceof String 
                || isPlainObject(defaultExport)) {
            this._defaultExport = new DefaultExport(defaultExport);
        } else {
            throw new Error("Incorrect argument");
        }
        return this;
    };
    /**
     * 
     * @returns {EList|All}
     */
    ImportElements.prototype.getNamedExports = function() {
        return this._namedExports;
    };
    /**
     * 
     * @param {All|EList|Object|String|Array} namedExports
     * @returns {ImportElements.prototype}
     */
    ImportElements.prototype.setNamedExports = function(namedExports) {
        if (namedExports === '*') {
            this._namedExports = new All();
        } else if (namedExports instanceof All || namedExports instanceof EList) {
            this._namedExports = namedExports;
        } else if (isPlainObject(namedExports)) {
            if (namedExports.type === 'all' || namedExports.type ==='*') {
                this._namedExports = new All(namedExports);
            } else {
                var elts = namedExports.namedExports||namedExports.exports
                        ||namedExports.exportsList||namedExports.list
                        ||namedExports.elements||namedExports.exports; 
                if (isArray(elts)) {
                    this._namedExports = new EList(elts);
                } else {
                    throw new Error("Incorrect argument");
                }
            }
        } else if (isArray(namedExports)) {
            this._namedExports = new EList(namedExports);
        }
        return this;
    };
    
    function ImportStatement(m) {
        if (m instanceof String) {
            this._module = m.valueOf();
        } else if (m instanceof QString) {
            this._module = m.getValue();
        } else if (isPlainObject(m)) {
            var module = m.module||m.Module||m.from||m.From;
            if (module) {
                this.setModule(module);
            }
        }
    }
    /**
     * 
     * @returns {String}
     */
    ImportStatement.prototype.getModule = function() {
        return this._module;
    };
    /**
     * 
     * @param {String|QString} module
     * @returns {ImportStatement.prototype}
     */
    ImportStatement.prototype.setModule = function(module) {
        if (module instanceof String) {
            module = new QString(module.valueOf());
        } else if (typeof module === 'string') {
            module = new QString(module);
        } else if (!(module instanceof QString)) {
            throw new Error("Expected string");
        }        
        this._module = module;
        return this;
    };
    /**
     * 
     * @returns {EModule}
     */
    function EModule() {
        ImportStatement.apply(this, [].slice.call(arguments));
    }
    /**
     * 
     * @type ImportStatement
     */
    EModule.prototype = new ImportStatement();
    /**
     * 
     * @returns {String}
     */
    EModule.prototype.toString = function() {
        var module = this.getModule()||"";
        if (module instanceof QString) {
            return module.getString();
        }
        if (module.indexOf("'") < 0) {
            return "'" + module + "'";
        } else if (module.indexOf('"') < 0) {
            return '"' + module + '"';
        } else {
            var qstring = new QString(module);
            return qstring.getString();
        }
    };
    
    
    /**
     * 
     * @param {type} opts
     * @returns {ImportSelection}
     */
    function ImportSelection(opts) {
        ImportStatement.apply(this, [].slice.call(arguments));
        if (isPlainObject(opts)) {
            var v = opts.selection||opts.Selection||opts.selectionList
                    ||opts.selected||opts.elements                    
                    ||opts.imports||opts.importsList
                    ||opts.exports||opts.exportsList||opts.exported
                    ||opts.items||opts.itemsList;
            if (v) {
                this.setSelection(isArray(v) ? v : [v]);
            }
            v = opts.module||opts.Module||opts.from||opts.From;
            if (v) {
                this.setModule(v);
            }
        }
    }
    
    /**
     * 
     * @type ImportStatement
     */
    ImportSelection.prototype = new ImportStatement();
    /**
     * 
     * @param {type} select
     * @returns {undefined}
     */
    ImportSelection.prototype.setSelection = function(select) {
        if (select instanceof EList || select instanceof All 
                || select instanceof ImportElements 
                || select instanceof DefaultExport) {
            this._selection = select;
        } else if (isArray(select)) {
            this._selection = new EList(select);
        } else if (isPlainObject(select)) {
            if (hasOwnProperty('type')) {
                switch(select.type.toLowerCase()) {
                    case  "defaultexport":
                    case "default":
                        this._selection = new DefaultExport(select);
                        break;
                    case  "all":
                    case "*":
                        this._selection = new All(select);
                        break;
                    case "list":
                    case "items":
                        this._selection = new EList(select);
                        break;
                    case  "mixte":
                    case  "mix":
                    case  "mixin":
                    case  "mixing":
                    case  "importelements":
                    case  "import-elements":
                    case  "importelts":
                    case  "import-elts":
                        this._selection = new ImportElements(select);
                        break;
                    default:
                        throw new Error("Incorrect argument");                        
                }
            } else {
                throw new Error("Incorrect argument");
            }
        }
        return this;
    };
    
    ImportSelection.prototype.toString = function() {
        var str = "", select = this.getSelection();        
        
        if (select) {
            str += this._selection.toString();
        }
        
        str += " from ";
        
        var module = this.getModule()||"";
        
        if (module.indexOf("'") < 0) {
            str += "'" + module + "'";
        } else if (module.indexOf('"') < 0) {
            str += '"' + module + '"';
        } else {
            var qstring = new QString(module);
            str += qstring.getString();
        }
        return str;
    };
    
    
    /**
     * 
     * @returns {Command}
     */
    function Command() {
    }
   
   
   
    Command.prototype = new Statement();
   
   
    
    /**
     * 
     * @returns {Export}
     * @class Export
     */
    function Export() {
        if (arguments.length > 1) {
            this.setStatement(arguments[0]);
            this.setDefault(arguments[1]);
        } else if (arguments.length === 1) {
            var e = arguments[0];
            if (Export.isExportStatement(e)) {
                this._statement = e;
                this._default = false;
            } else if (isPlainObject(e)) {
                if (hasOwnProp(e, 'statement') || hasOwnProp(e, 'Statement')) {
                    this.setStatement(e.statement||e.Statement);
                    this.setDefault(e.default||e.Default||e.isDefault||e.defaultExport);
                } else if (hasOwnProp(e, 'default') 
                        || hasOwnProp(e, 'Default') 
                        || hasOwnProp(e, 'defaultExpression')) {
                    this.setStatement(e);
                    this.setDefault(e.default);
                }
            } else if (typeof e === 'boolean') {
                this._default = e;
            }
        } else {
            this._statement = null;
            this._default = false;
        }
    }
   
    Export.isExportStatement = function(e) {
        return e instanceof ExportStatement 
                || e instanceof Declaration 
                || e instanceof NamedFunction 
                || e instanceof Class;
    };
   
   
    Export.prototype = new Command();
    
    
    
   
   
   /**
    * 
    * @returns {Boolean}
    */
   Export.prototype.isDefault = function() {
       return this._default;
   };
   
   /**
    * 
    * @param {type} def
    * @returns {Export}
    */
   Export.prototype.setDefault = function(def) {
       this._default = toBool(def);
       return this;
   };
   
   Export.prototype.isDefaultExport = Export.prototype.isDefault;
   
   Export.prototype.setDefaultExport = Export.prototype.setDefault;
   
   /**
    * 
    * @returns {Boolean}
    */
   Export.prototype.getStatement = function() {
       return this._statement;
   };
   
   /**
    * 
    * @param {type} statement
    * @returns {Export}
    */
   Export.prototype.setStatement = function(statement) {
       this._statement = statement;
       return this;
   };
   
    /**
     * 
     * @returns {String}
     */
    Export.prototype.toStatementString = function() {
        var str = "export ";
        if (this._default) {
            str += "default ";
        }
        if (this._statement) {
            str += this._statement.toStatementString();
        }
        return str;
    };
    
    
    /**
     * 
     * @returns {String}
     */
    Export.prototype.toString = function() {
        
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        var str = "", cmt; 
        if (inline) {
            cmt = this.getComment();
            if (cmt) {
                str += cmt.toString(true /*inline */);
            }
            str += (str? " " : "") + "export ";
            
            if (this._default) {
                str += "default ";
            }
            
            cmt = this.getEndComment();
            if (cmt) {
                str += " " + cmt.toString(true /*inline */);
            }
            
            cmt = this.getInlineComment();
            if (cmt) {
                str += "; " + cmt.toString(true /*inline */);
            }
        }
    };
    
    
    /**
     * 
     * @param {type} s
     * @returns {unresolved}
     */
    Export.getAggStatement = function(s) {
        var ns = typeof SereniX !== 'undefined' && isPlainObject(SereniX) === 'object' ? SereniX.prog||window: window,
            As = ns.As||As,
            Aggregation = ns.Aggregation||Aggregation,
            StatementElt = ns.StatementElt||StatementElt,
            AggStatement = ns.AggStatement||AggStatement;
        if (s instanceof As || s instanceof Aggregation|| (s instanceof StatementElt && s.isStatement()) || (s instanceof AggStatement)) {
            return s;
        }
    };
   
      
   
   function Import(i) {
       var ns = typeof SereniX !== 'undefined' && isPlainObject(SereniX) === 'object' ? SereniX.prog||window: window,
               ImportStatement =  ns.ImportStatement||globalNS.ImportStatement,
               EModule = ns.EModule||globalNS.EModule,
               QString = ns.QString||globalNS.QString;
       if (i instanceof ImportStatement) {
           this._statement = i;
       } else if (i instanceof QString || i instanceof String) {
           this._statement = new EModule(i);
       } else if (i.statement) {
           var s = i.statement;
           if (s instanceof ImportStatement) {
               this._statement = s;
           } else if (s.selection && s.module) {
                this._statement = new ImportSelection(s);
            } else if (s.module) {
                this._statement = new EModule(s.module);
            }
       } else if (i.selection && i.module) {
           this._statement = new ImportSelection(i);
       } else if (i.module) {
           this._statement = new EModule(i.module);
       }
   }
   
   Import.prototype = new Command();
   
   /**
    * 
    * @returns {Boolean}
    */
   Import.prototype.getStatement = function() {
       return this._statement;
   };
   
   /**
    * 
    * @param {type} statement
    * @returns {Export}
    */
   Import.prototype.setStatement = function(statement) {
       this._statement = statement;
       return this;
   };
   
   Import.prototype.toString = function() {
   
        var inline = false, ind = 0, indentFirstLine = true;
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'number') {
                ind = arguments[0];
            } else if (typeof arguments[0] === 'boolean') {
                inline = arguments[0];
            }
        } else if (arguments.length > 1) {
            ind = toInteger(arguments[0]);
            indentFirstLine = toBool(arguments[1]);
        }
        
        var str = "", cmt, stmt = this.getStatement(); 
        if (inline) {
            cmt = this.getComment();
            if (cmt) {
                str += cmt.toString(true /*inline */);
            }
            str += (str? " " : "") + "import " + stmt.toString(true);            
            
            
            cmt = this.getEndComment();
            if (cmt) {
                str += " " + cmt.toString(true /*inline */);
            }
            
            cmt = this.getInlineComment();
            if (cmt) {
                str += "; " + cmt.toString(true /*inline */);
            }
        } else {
            var _ind = "";
            for (var i = 0; i < ind; i++) {
                _ind += "    ";
            }
            cmt = this.getComment();
            if (cmt) {
                str += cmt.toString(ind, indentFirstLine);
                str += "\n" + _ind + "import " + stmt.toString(ind, false);
            } else {
                str += (indentFirstLine ? _ind : "") + "import " + stmt.toString(ind, false);
            }                        
            
            
            cmt = this.getEndComment();
            if (cmt) {
                str += "\n" + _ind + cmt.toString(ind, false);
            }
            str += ";";
            cmt = this.getInlineComment();
            if (cmt) {
                str +=  " " + cmt.toString(true /*inline */);
            }
        }
        return str;
    };
    
    /**
     * <h3>Quoted String Pattern class</h3>
     * @returns {undefined}
     * @class QSPattern
     */
    function QSPattern() {
        EQString.apply(this, arguments);
    }
    
    QSPattern.prototype = new EQString();
    
    
    QSPattern.__CLASS__ = QSPattern;
    
    QSPattern.__CLASS_NAME__ = "QSPattern";
    
    QSPattern.__SUPER_CLASS__ = EQString;
    
    QSPattern.prototype.__CLASS__ = QSPattern;
    
    QSPattern.prototype.__SUPER_CLASS__ = EQString;
    
    QSPattern.QUOTES = ["`"];
    /**
     * 
     * @type String
     */
    QSPattern.prototype.__CLASS_NAME__ = "QSPattern";
    /**
     * 
     * @param {type} val
     * @returns {undefined}
     */
    QSPattern.prototype.setString = function(val) {
        this.__SUPER_CLASS__.prototype.setString.call(this, val);
        this.__$tokens_ = null;
        return this;
    };
    /**
     * 
     * @param {type} val
     * @returns {undefined}
     */
    QSPattern.prototype.setValue = function(val) {
        this.__SUPER_CLASS__.prototype.setValue.call(this, val);
        this.__$tokens_ = null;
        return this;
    };
    /**
     * 
     * @returns {Array}
     */
    QSPattern.prototype.getTokens = function() {
        if (!this.__$tokens_) {
            this.__$tokens_ = this.split();
        }
        return this.__$tokens_;
    };
    /**
     * 
     * @returns {Array}
     */
    QSPattern.prototype.split = function() {
        
        var str = this.getString()||"", n = str.length - 1;
      
        if (n === 1) {
            return  [];
        }
        var open = /\\\\|\\\$\{|\$\{|\\`/g, i = 1, 
                match, tokens = [], token = "", text, expr;
        function expression() {
            i = open.lastIndex;
            var ch, ofs = i, end = false;
            for (;i < n; i++) {   
                ch = str[i];
                if (ch === '}') {
                    i++;
                    if (end === false) {                        
                        break;
                    }
                    return str.substring(ofs, end);
                } else if ('\n\r'.indexOf(ch) >= 0) {
                    break;
                }
            }
            return null;
        }
        var ofs = i;
        while (i < n) {
            open.lastIndex = i;
            if ((match = open.exec(str))) {
                if (match[0] === "${") {
                    expr = expression();
                    if (expr) {
                        token += str.substring(ofs, open.lastIndex - match.length);
                        if (token) {
                            tokens[tokens.length] = { type: 'text', value : token };
                        }
                        tokens[tokens.length] = { type: 'expression', value : expr };
                        token = "";
                        ofs = i = open.lastIndex;
                    } else {
                        i = open.lastIndex
                    }                    
                } else {
                    token += str.substring(ofs, open.lastIndex - match.length) + match.substring(1);   
                    ofs = i = open.lastIndex;
                }                
            } else {
                break;
            }
        }
        token += str.substring(ofs);
        if (text) {
            tokens[tokens.length] = { type: 'text', value : token };
        }
        return tokens;
    };
    
    /**
     * @property value : the unquoted and unescaped string value
     * @property string : the quoted and escaped string value
     * @property quote : the quote used
     */
    Object.defineProperties(QSPattern.prototype, {
        value: { get : QSPattern.prototype.getValue, set: QSPattern.prototype.setValue },
        string: { get : QSPattern.prototype.getString, set: QSPattern.prototype.setString },
        tokens: { get : QSPattern.prototype.getTokens },
        quote: { get : QSPattern.prototype.getQuote, set: QSPattern.prototype.setQuote }
    });
    
    function NParamType() {
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isPlainObject(a)) {
                this.setName(a.name||a.Name);
                this.setType(a.type||a.Type);
                if (a.comment) {
                    this.setComment(a.comment);
                }
                if (a.inlineComment) {
                    this.setInlineComment(a.inlineComment);
                }
                if (a.endComment) {
                    this.setEndComment(a.endComment);
                }
                if (a.inlineEndComment) {
                    this.setInlineEndComment(a.inlineEndComment);
                }
            }
        } else if (arguments.length > 1) {
            this.setName(arguments[0]);
            this.setType(arguments[1]);
            if (arguments[2] instanceof IComment ) {
                this.setComment(arguments[2]);
            }
        }
    }
    
    NParamType.prototype = new StatementElt();
    
    NParamType.__CLASS__ = NParamType;
    
    NParamType.__CLASS_NAME__ = "NParamType";
    
    NParamType.prototype.__CLASS__ = NParamType;
    
    NParamType.prototype.__CLASS_NAME__ = "NParamType";
    
    
    /**
     * 
     * @param {type} name
     * @returns {Param}
     */
    NParamType.prototype.setName = function(name) {
        this._name = name;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    NParamType.prototype.getName = function() {
        return this._name;
    };
    
    /**
     * 
     * @param {type} type
     * @returns {Param}
     */
    NParamType.prototype.setType = function(type) {
        this._type = type;
        return this;
    };
    /**
     * 
     * @returns {String} 
     */
    NParamType.prototype.getType = function() {
        return this._type;
    };
    
    
    /**
     * 
     * @returns {NParamTypes}
     * @class NParamTypes
     */
    function NParamTypes() {
        if (arguments.length === 1) {
            var a = arguments[0];
            if (isArray(a)) {
                this.setTypes(a);
            } else if (isPlainObject(a)) {
                var types = a.entries||a.types||a.namedTypes||a.Entries||a.Types||a.NamedTypes;
                if (isArray(types)) {
                    this.setTypes(types);
                }
            }
        } else if (arguments.length > 1) {
            this.setTypes([].slice.call(arguments));
        }
    }
    
    NParamTypes.prototype = new StatementElt();
    
    NParamTypes.__CLASS__ = NParamTypes;
    
    NParamTypes.__CLASS_NAME__ = "NParamTypes";
    
    NParamTypes.prototype.__CLASS__ = NParamTypes;
    
    NParamTypes.prototype.__CLASS_NAME__ = "NParamTypes";
    
    /**
     * 
     * @param {type} types
     * @returns {NParamTypes}
     */
    NParamTypes.prototype.setTypes = function(types) {
        this._types = [];
        this._typesMap = [];
        if (!isArray(types)) {
            incorrectArg();
        }
        var type;
        for (var i = 0, n = types.length; i < n; i++) {
            type = types[i];
            if (!(type instanceof NParamType)) {
                type = new NParamType(type);
            }
            this._types[i] = type;
            this._typesMap[type.getName()] = type.getType();
        }
        return this;
    };
    /**
     * 
     * @param {String|Number} i
     * @returns {FType|NParamType}
     */
    NParamTypes.prototype.get = function(i) {
        if (i instanceof Number || i instanceof String) {
            i = i.valueOf();
        }
        if (typeof i === 'string') {
            return this._typesMap[i];
        }
        if (typeof i === 'number') {
            return this._types[i];
        }
        incorrectArg();
    };
    
    
/**
* 
* @param {type} b
* @returns {InterfaceBody}
*/
function InterfaceBody(b) {        


   //The list of elements of the class
   this.___elts__ = [];


   /* ---------------------------------------------------- /
    * ---------------   Cache block   -------------------- /
    * ---------------------------------------------------- */


   // this.___elts__, this.___eltsMap__, this.___signaturesMap__, 
   // this.___signaturesMap__ and this.___fieldsMap__ are private fields : do
   // do not access that fields of the instance (object) add elements in 
   // the this.___elts__ or set/put elements in the other. Let that fields 
   // only manipulated by calling the methods of the instance. 




   //The mapping of the list of elements of the class : cache
   this.___eltsMap__ = {};
   //The list of methods of the class : cache
   this.___signatures__ = [];
   //The mapping of the list of methods of the class : cache
   this.___signaturesMap__ = {};  
   //The list of fields of the class : cache
   this.___fields__ = [];
   //The mapping of the list of fields of the class : cache
   this.___fieldsMap__ = {};

   /* ---------------------------------------------------- /
    * ----------------   Cache block end  ---------------- /
    * ---------------------------------------------------- */



   if (isArray(b)) {
       for (var i = 0, n = b.length; i < n; i++) {
           this.addElement(b[i]);
       }
   } else if (isPlainObject(b)) {
       var elts = b.elements||b.Elements||b.statements||b.Statements||b.statement||b.Statement;
       if (isArray(elts)) {
           for (var i = 0, n = elts.length; i < n; i++) {
               this.addElement(elts[i]);
           }
       } else if (isPlainObject(elts)) {
           this.addElement(InterfaceBody.getEltInstance(elts));
       }
       if (b.comment) {
           this.setComment(b.comment);
       }

       if (b.inlineComment) {
           this.setInlineComment(b.inlineComment);
       }

       if (b.endComment) {
           this.setEndComment(b.endComment);
       }
   }
};
/**
* 
* @type InterfaceBody
*/
InterfaceBody.__CLASS__ = InterfaceBody;
/**
* 
* @type String
*/
InterfaceBody.__CLASS_NAME__ = "InterfaceBody";

InterfaceBody.prototype = new StatementElt();
/**
* 
* @type InterfaceBody
*/
InterfaceBody.prototype.__CLASS__ = InterfaceBody;
/**
* 
* @type String
*/
InterfaceBody.prototype.__CLASS_NAME__ = "InterfaceBody";
/**
* Returns the element of the body that corresponds to the given name and the given type
* @param {String} name The name of the element to get
* @param {String} [typ="any"]
* @returns {InterfaceBodyElt}
*/
InterfaceBody.prototype.get = function(name, typ) {
   if (typ instanceof String) {
       typ = typ.valueOf();
   }
   if (typeof typ === 'string') {
       typ = typ.toLowerCase();
   }
   var key = name;
   var e = this.___eltsMap__[key];
   if (e) {
       if (typ) {                
           if (typ === 'any' || typ === '*') {
               return e;
           }
           switch (typ) {
               case 'signature':
                   if (e instanceof Signature) {
                       return e;
                   }
                   break;
               case 'field':
                   if (e instanceof Field) {
                       return e;
                   }
                   break;
           }
           throw new Error("The object corresponding to the given name  does not match the type");
       }
   }
   return e;
};
/**
* 
* @param {InterfaceBodyElt|Object} o
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.addElement = function (o) { 
   var e = InterfaceBody.getEltInstance(o), key;

   this.___elts__[this.___elts__.length] = e;
   if (e instanceof Signature) {
       this.___signatures__[this.___signatures__.length] = e;
       this.___signaturesMap__[key = e.getName()] = e;
   }  else if (e instanceof Field) {
       this.___fields__[this.___fields__.length] = e;
       this.___fieldsMap__[key = e.getName()] = e;
   }
   this.___eltsMap__[key] = e;
   return this;
};
/**
* 
* @param {Object} o
* @param {String} [type=""]
* @param {String} [name=null]
* @returns {Constructor|Field|Method|Getter|Setter|ClassBody}
*/
InterfaceBody.getEltInstance = function(o, type, name) {
   if (o instanceof Signature || o instanceof Field ) {
       return o;
   }
   switch((type||o.type||"").toLowerCase()) {
       case 'signature':
           return new Signature(o);
       case 'field':
           return new Field(o);
   }
   throw new Error("Incorrect argument");
};
/**
* 
* @param {String|Number|InterfaceBodyElt} elt
* @param {type} typ
* @returns {Boolean|InterfaceBody}
*/
InterfaceBody.prototype.removeElement = function(elt, typ) {
   function _remove(e, key, index) {
       delete this.___eltsMap__[key];
       if (e instanceof Signature) {
           this.___signatures__.splice(this.___signatures__.indexOf(e), 1);
       } else if (e instanceof Field) {
           this.___fields__.splice(this.___fields__.indexOf(e), 1);
       }
       this.___elts__.splice(index, 1);
   }
   if (typeof elt === 'string') { 
       var name = elt;
       if (typ instanceof String) {
           typ = typ.valueOf();
       }
       if (typeof typ === 'string') {
           typ = typ.toLowerCase();
       }
       var key = name;
       var e = this.___eltsMap__[key];
       if (!e) {
           return false;
       }
       _remove(e, key, this.___elts__.indexOf(e));
       return e;
   }
   var i, index = false;
   if (typeof elt === 'number' || elt instanceof Number) {
       i = elt instanceof Number ? elt.valueOf() : elt;
       if (i > this.___elts__.length) {
           throw new Error("Index out of bounds: " + i);
       }
       elt = this.___elts__[i];
       index = true;
   } else {
       i = this.___elts__.indexOf(elt);
       if (i < 0) {
           return false;
       }
   }
   _remove(elt,
           elt.getName(), // computes the key
           i);
   return index ? elt : this;
};

/**
* 
* @returns {IComment}
*/
InterfaceBody.prototype.getComment = function() {
   return this._comment;
};
/**
* 
* @param {IComment|Object} comment
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.setComment = function(comment) {                
   this._comment = typeof comment === 'undefined' || comment === null ? 
           null: IComment.getInstance(comment);
   return this;
};
/**
* 
* @param {type} comment
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.addComment = function(comment) {
   if (!comment || !isPlainObject(comment)) {
       throw new Error("Incorrect argument");
   }
   comment = IComment.getInstance(comment);
   if (!this._comment) {
       this._comment = comment;
   } else if (this._comment instanceof Comment) {
       this._comment = new Comments([this._comment, comment]);
   } else {
       this._comment.add(comment);
   }
   return this;
};
/**
* 
* @returns {IComment}
*/
InterfaceBody.prototype.getInlineComment = function() {
   return this._inlineComment;
};
/**
* 
* @param {IComment|Object} comment
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.setInlineComment = function(comment) {
   this._inlineComment = typeof comment === 'undefined' || comment === null ? 
           null: IComment.getInstance(comment);
   return this;
};
/**
* 
* @param {type} comment
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.addInlineComment = function(comment) {
   if (!comment || !isPlainObject(comment)) {
       throw new Error("Incorrect argument");
   }
   comment = IComment.getInstance(comment);
   if (!this._inlineComment) {
       this._inlineComment = comment;
   } else if (this._inlineComment instanceof Comment) {
       this._inlineComment = new Comments([this._inlineComment, comment]);
   } else {
       this._inlineComment.add(comment);
   }
   return this;
};
/**
* 
* @returns {type}
*/
InterfaceBody.prototype.getEndComment = function() {
   return this._endComment;
};
/**
* 
* @param {type} comment
* @param {Boolean} [inline]
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.setEndComment = function(comment, inline) {
   this._endComment = typeof comment === 'undefined' || comment === null ? 
           null: IComment.getInstance(comment);
   if (arguments.length > 1) {
       this.setInlineComment(inline);
   }
   return this;
};

/**
* 
* @param {type} comment
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.addEndComment = function(comment) {
   if (!comment || !isPlainObject(comment)) {
       throw new Error("Incorrect argument");
   }
   comment = IComment.getInstance(comment);
   if (!this._endComment) {
       this._endComment = comment;
   } else if (this._endComment instanceof Comment) {
       this._endComment = new Comments([this._endComment, comment]);
   } else {
       this._endComment.add(comment);
   }
   return this;
};

/**
* 
* @returns {type}
*/
InterfaceBody.prototype.getInlineEndComment = function() {
   return this._inlineEndComment;
};
/**
* 
* @param {Boolean} inline
* @returns {InterfaceBody}
*/
InterfaceBody.prototype.setInlineEndComment = function(inline) {
   this._inlineEndComment = toBool(inline);
   return this;
};
/**
* 
* @param {Number} [ind=0]
* @param {Boolean} [indentFirstLine=false]
* @returns {String}
*/
InterfaceBody.prototype.toString = function(ind, indentFirstLine) {
   if (!ind) {
       ind = 0;
   }
   var _ind = "";
   if (typeof ind === 'number') {                    
       for (var i = 0; i < ind; i++) {
           _ind += "    ";
       }
   }
   var str = (typeof indentFirstLine === 'undefined' || indentFirstLine === null || toBool(indentFirstLine) ? _ind : "") + "{";
   for (var i = 0, n = this.___elts__.length; i < n; i++) {
       str += "\n" + this.___elts__[i].toString(ind + 1, true);
   }
   str += "\n" + _ind + "}";

   return str;
};


/**
* 
* @param {type} opts
* @returns {Interface}
* @class Interface
*/
function Interface(opts) {
   if (arguments.length >= 3) {
       this.setName(arguments[0]);
       this.setExtends(arguments[1]);
       this.setBody(arguments[2]);
   } else if (arguments.length > 1) {
       this.setName(arguments[0]);
       this.setBody(arguments[1]);
   } else if (isPlainObject(opts)) {
       this.setName(opts.name||opts.Name);
       this.setExtends(opts.extends||opts.Extends||opts.exts||opts.Exts);
       this.setBody(opts.body||opts.block||opts.statements||opts.statement);
   }
}

Interface.prototype = new Statement();

Interface.__CLASS__ = Interface;

Interface.__CLASS_NAME__ = "Interface";

Interface.prototype.__CLASS__ = Interface;

Interface.prototype.__CLASS_NAME__ = "Interface";

Interface.prototype.isStatement = function() {
   return true;
};
/**
* 
* @returns {String}
*/
Interface.prototype.getName = function() {
   return this._name||"";
};
/**
* 
* @param {String} name
* @returns {Interface}
*/
Interface.prototype.setName = function(name) {
   this._name = name;
   return this;
};
/**
* 
* @returns {String}
*/
Interface.prototype.getExtends = function() {
   return this._ext;
};
/**
* 
* @param {Array} ext
* @returns {Interface}
*/
Interface.prototype.setExtends = function(ext) {
    if (ext === undefined || ext === null) {
        this._ext = [];
    } else {
        if (!isArray(ext)) {
            throw new Error("Incorrect argument: array expected");
        }
        this._ext = [];
        for (var i = 0, n = ext.length, e; i < n; i++) {
            e = ext[i];
            if (e instanceof String) {
                e = e.valueOf();
            }
            this._ext[i] = typeof e === 'string' ? new SType(e) : e instanceof SType ? e : new SType(e);
        }
    }
   return this;
};
/**
* 
* @returns {String}
*/
Interface.prototype.getTypes = function() {
   return this._type;
};
/**
* 
* @param {Array} type
* @returns {Interface}
*/
Interface.prototype.setTypes = function(type) {
   if (!isArray(type)) {
       throw new Error("Incorrect argument: array expected");
   }
   this._types = [];
   for (var i = 0, n = type.length, e; i < n; i++) {
       e = type[i];
       if (e instanceof String) {
           e = e.valueOf();
       }
       this._types[i] = typeof e === 'string' ? new SType(e) : e instanceof SType ? e : FType.getInstance(e);
   }
   return this;
};
/**
* 
* @returns {String}
*/
Interface.prototype.getBody = function() {
   return this._body;
};
/**
* 
* @param {String} body
* @returns {Interface}
*/
Interface.prototype.setBody = function(body) {
   this._body = body instanceof InterfaceBody ? body : new InterfaceBody(body);
   return this;
};