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

if (typeof inBrowser === 'undefined') {
    inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS === 'undefined') {
    globalNS = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
}

if (typeof __$$amd_define$$__ === 'undefined') {
    if (typeof define === "function" && typeof define.amd !== "undefined") {
        __$$amd_define$$__ = define;
    }
}

//  Universal Module Definition (UMD) 

(function(_global) {
    /**
     * 
     * @function
     * @name $global
     * @param {Object|String} $1 The root object or the variable name
     *      <p>When $1 is an object and the function is not called with only 
     *      one argument, $1 represents the root object (for example window in 
     *      browser case).</p>
     *      <p>When $1 is a string, it represents the name of the variable to defined.</p>
     * @param {String|Object} [$2] When $2 is a string, represents the name of the 
     *      variable to define and when it's an object, must be a named object.
     *      <p><b>A named object is an object with the property/field 'name' 
     *      that is of string type.</b></p>
     *      <p>This argument must be an object when the first argument is an object.</p>
     * @param {Number|String|Boolean|Function|Array|Object} [$3]  The value of the variable to defined
     */
    function _define($1, $2, $3) {
        var root, name, o;
        if (arguments.length === 1) {
            if (!$1.name || typeof $1.name !== 'string') throw new Error("Incorrect arguments");
            name = $1.name;
            o = $1;
            root = this;            
        } else if (arguments.length === 2) {
            if (typeof $1 === 'string') {
                o = $2;
                name = $1;
                root = this;
            }
        } else {
            root = $1;
            name = $2;
            o = $3;
        }
        /* global define: false */
        if (typeof __$$amd_define$$__ === "function")
            /*  AMD environment  */
            __$$amd_define$$__(name, function () { return o; });
        else if (typeof module === "object" && typeof module.exports === "object")
            /*  CommonJS environment  */
            module.exports = o;
        else
            /*  Browser environment  */
            root[name] = o;
    }    
    _define(_global, "$global", _define);
    /**
     * 
     * @function
     * @name defineGlobal
     * @alias $global
     * @param {Object|String} $1 The root object or the variable name
     *      <p>When $1 is an object and the function is not called with only 
     *      one argument, $1 represents the root object (for example window in 
     *      browser case).</p>
     *      <p>When $1 is a string, it represents the name of the variable to defined.</p>
     * @param {String|Object} [$2] When $2 is a string, represents the name of the 
     *      variable to define and when it's an object, must be a named object.
     *      <p><b>A named object is an object with the property/field 'name' 
     *      that is of string type.</b></p>
     *      <p>This argument must be an object when the first argument is an object.</p>
     * @param {Number|String|Boolean|Function|Array|Object} [$3]  The value of the variable to defined
     */
    _define(_global, "defineGlobal", _define);
})(this);


if (!String.prototype.lastIndexOf) {
    /**
     * 
     * @param {type} s
     * @returns {Number}
     */
    String.prototype.lastIndexOf=function(s) {
        var i, o = 0, p = -1;
        for (;;) {
            i = this.indexOf(s, o);
            if (i < 0)
                return p;
            p = i;
            o = i + s.length;
        }
    };
}

(function(ns) {
if (!ns.isArray) {
    ns.isArray = Array.isArray;
}

if (!ns.JS_KEYWORDS_EXT) {
    ns.JS_KEYWORDS_EXT = [
            'var', 'let', 'const', 
            'if', 'else',
            'function', 'new', 'this', 'async',
            'for', 'in', 'of', 'do', 'while',
            'return', 'new', 'break', 'continue', 
            'try', 'catch', 'finally',
            'switch', 'case', 'default',
            'throw', 'with', 'delete', 'await', 'yield',
            'import', 'export', 'from', 'as',
            'class', 'extends', 'static', 'interface', 'implements',
            'type'
        ];
}

if (!ns.regex_nativ) {
    ns.NativeRegExp = RegExp;
    ns.regex_nativ = {
        RegExp: RegExp,
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    };
}

if (!ns.hasOwnProp) {
    /**
     * 
     * @param {Object} o  The object
     * @param {String} n  Property name
     * @returns {Boolean}
     */
    ns.hasOwnProp = function (o, n) {
        return Object.prototype.hasOwnProperty.call(o, n);
    };
}

})(globalNS);

/**
 * Checks if a value is a plain object.
 * @param {*} val
 * @returns {Boolean}
 */
function isPlainObj(val) {
    return typeof val === 'object' 
            && Object.prototype.toString.call(val) === '[object Object]';
}

var isPlainObject = isPlainObj;

if (!Object.hasOwnProperty) {
    Object.hasOwnProperty = function(obj, name) {
        if (typeof Object.getPropertyNames === 'function') {
            return Object.getPropertyNames().indexOf(name) >= 0;
        }
        if (name === '__proto__') {
            return false;
        }
        for (var n in obj) {
            if (n === name) {
                return true;
            }
        }
        return false;
    };
}

/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} opts
 * @param {Array&lt;String&gt;|String} props  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 */
function optionsValue(opts, props, lower) {
    if (typeof props === 'string') {
        props = props.trim().split(/\s*\|\s*/g);
    }
    var p, v, x;
    for (var i = 0, n = props.length; i < n; i++) {
        p = props[i];
        v = opts[p];
        if (v === undefined || (v === null)) {
            v = opts[((x = p[0].toUpperCase()) === p[0] ? x.toLowerCase() : x) + p.substring(1)];
            if (v !== undefined && (v !== null)) {
                return v;
            }
            if (lower && (x = p.toLowerCase()) !== p) {                
                v = opts[x];
                if (v !== undefined && (v !== null)) {
                    return v;
                }
            }
        } else {
            return v;
        }
    }
}

/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var optsVal = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var oVal = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null)
 * @param {Object} options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {type}
 * @alias optionsValue
 */
var oval = optionsValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null). If the result value is an instance of String it's converted to 
 * string primitive type.
 * @param {Object} opts Options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {String}
 * @alias optionsValue
 */
function optionsStringValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof String ? v.valueOf() : v;
}

var oSVal = optionsStringValue;
/**
 * Coalesces the given options to get the first valid value (not undefined and 
 * not null). If the result value is an instance of String it's converted to 
 * string primitive type.
 * @param {Object} opts Options
 * @param {Array&lt;String&gt;|String} options  The properties/fields to use for
 *  coalesce
 * @param {Boolean} [lower=false]
 * @returns {String}
 * @alias optionsStringValue
 */
var osVal = optionsStringValue;

function optionsNumValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof Number ? v.valueOf() : v;
}

function optionsBoolValue(opts, props, lower) {
    var v = optionsValue(opts, props, lower);
    return v instanceof Boolean ? v.valueOf() : v;
}


/**
 * Sets the prototype of the given function class if the super class is 
 * specified and/or adds metadata elements to the given class.
 * @param {Function|Object} Cls  Class function or class definition object
 * @param {String|Object|Function} [nmf]  The class name or class metadata or super class function
 * @param {Function} [Super] The super/parent class
 * @param {Object} [opts]  The options
 * @returns {Function}
 */
function initClass(Cls, nmf, Super, opts) {
    var cname, _super, C, o;
    if (arguments.length === 1) {
        if (!isPlainObject(o = arguments[0])) {
            throw new Error("Incorrect argument(s)");
        }
        C = o.Class||o["class"]||o.klass||o.Klass;
        cname = o.name||o.className||o.Name||o.ClassName||C.name||"";
        _super = o.Super||o["super"];
    } else {
        C = Cls;
        o = opts;
        
        if (typeof nmf === 'function' || nmf instanceof Function) {
            _super = nmf;
            cname = C.name||"";
        } else if (isPlainObject(nmf)) {
            o = nmf;
            cname = o.name||o.className||o.Name||o.ClassName||C.name||"";
            _super = o.Super||o["super"];
        } else {
            _super = Super;
            cname = nmf;
        }
    }
    if (_super) {
        C.prototype = new _super();
        C.prototype.__SUPER_CLASS__ = _super;
        C.__SUPER_CLASS__ = _super;
    }    
    
    C.__CLASS__ = C;

    C.__CLASS_NAME__ = cname;

    C.prototype.__CLASS__ = C;

    C.prototype.__CLASS_NAME__ = cname;
    if (o) {
        var v = o.author||o.AUTHOR||o.Author;
        if (v) {
            C.__AUTHOR__ = v;
        }

        v = o.since||o.SINCE||o.Since;
        if (v) {
            C.__SINCE__ = v;
        }
        
        v = o.version||o.VERSION||o.Version;
        if (v || v === 0) {
            C.__VERSION__ = v;
        }
        
        v = o.majorVersion||o.MAJORVERSION||o.MAJOR_VERSION||o.MajorVersion;
        if (v || v === 0) {
            C.__MAJOR_VERSION__ = v;
        }
        
        v = o.minorVersion||o.MINORVERSION||o.MINOR_VERSION||o.MinorVersion;
        if (v || v === 0) {
            C.__MINOR_VERSION__ = v;
        }

        v = o.description||o.DESCRIPTION||o.Description;
        if (v) {
            C.__DESCRIPTION__ = v;
        }
        v = o.purpose||o.PURPOSE||o.Purpose;
        if (v) {
            C.__PURPOSE__ = v;
        }
    }
    return C;
}


/**
 * 
 * @param {Function} Cls
 * @param {Function} newCls
 * @returns {Function}
 */
function copyClass(Cls, newCls) {
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

function functionReverseString(func) {
    var level = 0,
        namespaces = [],
        defined = {},
        result = { text : "" };

    function _functionReverseString(func, level, defined, namespaces, oname, oresult, superClassName, superClassFieldName) {
        var className;
        if (typeof arguments[1] === 'string') {
            className = arguments[1];
            level = defined, defined = namespaces, namespaces = oname, oname = oresult, oresult = superClassName, superClassName = superClassFieldName, superClassFieldName = arguments[8];
        }
        var C = "C" + (level ? level : "");
        var P = "P" + (level ? level : "");
        var added, names;
        var addedProps = {};
        added = [];
        names = [];
        addedProps[C] = { added: added, names: names};
        added = [];
        names = [];
        addedProps[P] = { added: added, names: names};

        function toString(o) {
            if (o === undefined) {
                return 'undefined';
            }
            if (o === null) {
                return 'null';
            }
            if (o instanceof Number || o instanceof String || o instanceof Boolean || o instanceof Function) {
                o = o.valueOf();
            }
            if (typeof o === 'string') {
                o = o.replace(/\\/g, '\\\\');
                return '"' + (o.indexOf('"') >= 0 ? o.replace(/"/g, '\\"') : o) + '"';
            }
            if (['', 'number', 'boolean'].indexOf(typeof o)) {
                return "" + o;
            }

            if (Object.prototype.toString.call(o) === '[object Objevct]') {

            }
        }
        function path(name) {
            return /^[a-zA-Z$_][a-zA-Z$_0-9]*$/.exec(name) && [JS_KEYWORDS_EXT].indexOf(name) < 0 ? "." + name : "[" + toString(name) + "]";
        }
        function _namespace(namespace) {
            return "    tokens = namespace.split('.'), own = window;"
                + "\n    for (var k = 0, len = tokens.length; k < len; k++) {"
                + "\n    tok = tokens[k];"
                + "\n    if (!own[tok]) {"
                + "\n        own = own[tok] = {};"
                + "\n    }";
        }
        function add(name, keys, o, superClassName, superClassFieldName) {
            var key,pos, f;
            added = addedProps[name].added;
            names = addedProps[name].names, oname;
            for (var i = 0, n = keys.length; i < n; i++) {
                key = keys[i];
                v = o[key];
                if (v instanceof Function) {
                    f = v;
                    v = v.valueOf(v);
                } else {
                    f = undefined;
                }
                if (typeof v === 'function') {
                    if (v === func || f === func) {
                        _result.text += "\n" + name + path(key) + " = " + fname + ";";
                    } else if (key === superClassFieldName) {
                        if ((pos = added.indexOf(v)) < 0) {
                            added[pos = added.length] = v;
                            names[pos] = superClassName;
                            var _res = _functionReverseString(v, superClassName, level + 1, defined, namespaces, name + path(key), _result);
                            //TODO
                        }
                        _result.text += "\n" + name + path(key) + " = " + superClassName + ";";
                    }  else if ((pos = added.indexOf(v)) < 0) {
                        added[pos = added.length] = v;
                        names[pos] = key;
                        _functionReverseString(v, level + 1, defined, namespaces, oname = name + path(key), _result, superClassName, superClassFieldName);
                    } else {
                        _result.text += "\n" + name + path(key) + " = " + name + path(names[pos]) + ";";
                    }
                } else if (isArray(v)) {

                } else {
                    _result.text += "\n" + name + path(key) + " = " + toString(v) + ";";
                }
            }
        }
        if (typeof func !== 'function') {
            return undefined;
        }
        var _result, key, fname, v, fullName = getFullName(func), namespace = "", p;
        if (className) {
            _result = { text: ""};
            if (className === func.name) {
                _result.text += (_result.text ? "\n" : "") + func.toString();
            } else {
                _result.text += "\n" + className + " = " + func.toString();
            }
        } else if (fullName  && (fname = func.name)  !== fullName) {   
            if ((p = fullName.lastIndexOf(".")) >= 0) {
                namespace = fullName.substring(0, p);
                if (namespaces.indexOf(namespace) < 0) {
                    if (namespaces.length === 0) {
                        result.text += "\nvar tokens , tok, own;\n";
                    }
                    result.text += _namespace(namespace) + "\n";
                }
                result.text += fullName + " = " + func.toString();
                fname = fullName;
            } else {
                result.text += "var " + fullName + " = " + func.toString();
                fname = fullName;
            }  
            _result = result;
            if (oname) {
                oresult.text += "\n" + oname + " = " + fname + ";";
            }
        } else {
            _result = oresult||{ text: ""};
            if (oname) {
                _result.text += "\n" + (fname = oname) + " = " + func.toString() + ";";
            }  else if (fname) {
                _result.text += (_result.text ? "\n" : "") + func.toString();
            } else {
                _result.text += (_result.text ? "\n" : "") + "var " + (fname = "_$Anonymous$_" + new Date().getTime()) + " = " + func.toString() + ";";
            }
        }


        function getFullName(C) {
            if (typeof C.getClassFullName === 'function') {
                return C.getClassFullName();
            }
            if (typeof C.getFullClassName === 'function') {
                return C.getFullClassName();
            }
            var name = C.__FULL_CLASS_NAME__||C.__CLASS_FULL_NAME__;
            if (name) {
                return name;
            }
            name = C.__CLASS_NAME__||C.__NAME__;
            if (name && name.indexOf('.') >= 0) {
                return name;
            }
            if (!name) {
                name = C.name;
                if (!name) {
                    return "";
                }
            }
            var ns =  C.__NAMESPACE_NAME__||C.__NAMESPACE__;
            if (ns && typeof ns === 'string') {
                return ns + "." + name;
            }
            return name;
        }

        var keys = Object.keys(func);
        var pkeys = Object.keys(func.prototype), superClassName, superClassFieldName;
        if (keys.length || pkeys.length) {
            _result.text += "\n(function("+ C + ") {";        
            superClassName = typeof func.__SUPER_CLASS__ === 'function' ? getFullName(func.__SUPER_CLASS__) : "";
            if (superClassName) {
                superClassFieldName = '__SUPER_CLASS__';
            } else {
                superClassName = typeof func.__PARENT_CLASS__ === 'function' ? getFullName(func.__PARENT_CLASS__) : "";
                if (superClassName) {
                    superClassFieldName = '__PARENT_CLASS__';
                } else {
                    superClassName = typeof func.__SUPER__ === 'function' ? getFullName(func.__SUPER__) : "";
                    if (superClassName) {
                        superClassFieldName = '__SUPER__';
                    } else {
                        superClassName = typeof func.__PARENT__ === 'function' ? getFullName(func.__PARENT__) : "";
                        if (superClassName) {
                            superClassFieldName = '__PARENT__';
                        }
                    }
                }
            }
            add(C, Object.keys(func), func, superClassName, superClassFieldName);
            if (superClassName) {
                _result.text += "\n" + C + ".prototype = new " + superClassName + "();";
            }
            if (pkeys.length) {
                _result.text += "\nvar "+ P + " = "+ C + ".prototype;";
                add(P, pkeys, func.prototype, superClassName, superClassFieldName);
            }
            _result.text += "\n})(" + (className||fname) + ")();";    
        }
        if (result !== _result && oresult !== _result) {
            result.text += _result.text + "\n";
        }
        return _result;
    }
    _functionReverseString(func, level, defined, namespaces);
    return result.text;
}

function isString(v) {
    return typeof v === 'string' || v instanceof String;
}
/**
 * Returns true if v is of type string
 * @function
 * @param {type} v
 * @returns {Boolean}
 */
function ofString(v) {
    return typeof v === 'string';
}
/**
 * Returns true if v is of type string
 * @function
 * @alias ofString
 * @param {type} v
 * @returns {Boolean}
 */
var ofStr = ofString;

/**
 * Returns the first valid (not undefined and not null) value of the given 
 * property names or where there is not a valid value, returns the default 
 * value if it is specified or returns the invalid value of the last property.
 * @param {Object|Array|Function} obj  The object from which get the properties value
 * @param {Array|...} _  The second argument of the function or the ret of 
 *                       arguments.
 *     <p>The second argument of the function must be an array of string 
 *     property names or a string property name.</p>
 *     <ul>
 *     <li>When the second argument is an array, if there is a third argument, it will be used a the defaut value.</li>
 *     <li>When the second argument is a string, the list of property names are arguments from the econd poition to the end.</li>
 *     </ul>
 * @returns {type}
 */
function coalesceProperties(obj, _) {
    var a = Array.prototype.slice.call(arguments);
    if (a.length < 2) {
        throw new Error("At leat two arguments expected with the first argument an object (not a value)");
    }
    if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
        throw new Error("First argument must be an object (not a value)");
    }
    
    var i, defaultValue;
    if (typeof _ === 'string' && typeof a[2] !== 'string') {
            _ = _.split(/\s*\|\s*/g);
            defaultValue = a[2];
    } else if (a.length === 2) {
        if (typeof _ === 'string') {
            _ = _.split(/\s*\|\s*/g);
            defaultValue = a[2];
        }
        if (!isArray(_)) {
            throw new Error("Incorrect argument");
        }
        i = 0;
    } else if (typeof _ === 'string' && typeof a[2] !== 'string') {
        _ = _.split(/\s*\|\s*/g);
        defaultValue = a[2];
    } else if (isArray(_) && a.length > 2) {
        i = 0;
        defaultValue = a[2];
    } else {
        i = 1;
        _ = a;
    }
    
    var n = _.length, name, v;
    if (i === n) {
        throw new Error("No property");
    }
    for (; i < n; i++) {
        name = _[i];
        if (typeof name === 'string') {
            v = obj[name];
            if (typeof v !== 'undefined' && v !== null) {
                return v;
            }
        }
    }
    return defaultValue;
}

var coalesceProperty = coalesceProperties;

var coalesceValue = coalesceProperties;

var coalesce = coalesceProperties;
/**
 * 
 * @param {Function} Cls
 * @param {String} [name]
 * @param {Function} [parentClass]
 * @param {Object} [props]
 * @param {Object} [aliases]
 * @returns {Function}
 */
function defineClass(Cls, name, parentClass, props, aliases) {
    var i, _super, _props, _name, instanceExclusions, classExclusions;
    if (arguments.length === 1) {
        var a = arguments[0];
        if (typeof a === 'string') {
            return eval("(function() { return function "+ a + "() {};})()");
        }
        _super = a.parentClass||a.superClass||a.super||a.parent;
        _name = a.className||a.name;
        Cls = a.class||a.Class;
        _props = a.elements||a.members||a.proprties;
        aliases = a.aliases||null;
        instanceExclusions = a.instanceExclusions||a.exclusions;
        classExclusions = a.classExclusions;
    } else {
        _super = parentClass, _props = props;
        if (typeof Cls === 'string') {
            if (typeof name === 'function') {
                var f = name;
                name = Cls;
                Cls = f;
            } else {
                throw new Error("Incorrect arguments"); 
            }        
        }

        _name = name;
        if (_name instanceof String) {
            _name = _name.valueOf();
        }

        if (arguments.length >= 2) {
            if (typeof _name === 'string') {
                if (typeof arguments[2] === 'function') {
                    _super = arguments[2];
                    i = 3;
                    if (isPlainObject(arguments[i])) {
                        _props = arguments[i++];
                        if (isPlainObject(arguments[i]) || isArray(arguments[i])) {
                            aliases = arguments[i];
                        } else {
                            aliases = null;
                        }
                    } else {
                        _props = null;
                        aliases = null;
                    }
                } else if (isPlainObject(arguments[2])) {
                    _props = arguments[2];
                    if (isPlainObject(arguments[3])) {
                        _super = typeof arguments[4] === 'function' ? arguments[4] : null;
                        aliases = arguments[3];
                    } else if (typeof arguments[3] === 'function') {
                        _super = arguments[3];
                        aliases = null;
                    } else {
                        _super = null;
                        aliases = null;
                    }
                }
            } else if (typeof arguments[1] === 'function') {
                _super = arguments[1];
                i = 2;
                if (typeof arguments[i] === 'string') {
                    _name = arguments[i++]||"";
                } else {
                    _name = Cls.name;
                }
                if (isPlainObject(arguments[i])) {
                    _props = arguments[i++];
                    if (isPlainObject(arguments[i]) || isArray(arguments[i])) {
                        aliases = arguments[i];
                    } else {
                        aliases = null;
                    }
                }
            } else if (isPlainObject(arguments[1])) {
                _name = "";
                _props = arguments[1];
                if (isPlainObject(arguments[2])) {
                    if (typeof arguments[3] === 'function') {
                        _super = arguments[3];
                        aliases = arguments[2];
                    } else if (typeof arguments[3] === 'string') {

                    }
                }
            }
        }
        if (!_name) {
            _name = Cls.name;
        }
    }
    
    
    
    var i = _name.lastIndexOf('.'), cname = i < 0 ? _name : _name.substring(i + 1), ns = _name.substring(0, i);
    
    if (_super) {
        
        Cls.__SUPER_CLASS__ = _super;
        
        Cls.prototype = new _super();
        var exclusions = classExclusions ? classExclusions.slice() : [];
        exclusions[exclusions.length] = "__CLASS__";
        exclusions[exclusions.length] = "__CLASS_NAME__";
        exclusions[exclusions.length] = "__CLASS_FULL_NAME__";
        exclusions[exclusions.length] = "__NAMESPACE_NAME__";
        exclusions[exclusions.length] = "__SUPER_CLASS__";
        exclusions[exclusions.length] = "__AUTHOR__";
        exclusions[exclusions.length] = "__VERSION__";
        exclusions[exclusions.length] = "__SINCE__";
        exclusions[exclusions.length] = "__DESCRIPTION__";
        exclusions[exclusions.length] = "__COMPANY__";
        exclusions[exclusions.length] = "__LICENSE__";
        for (var n in _super) {
            if (hasOwnProp(_super, n) && exclusions.indexOf(n) < 0) {
                Cls[n] = _super[n];
            }
        }
    }
    
    Cls.__CLASS__ = Cls;
    
    /**
     * The class name
     */
    Cls.__CLASS_NAME__ = cname;
    
    /**
     * The class name
     */
    Cls.__CLASS_FULL_NAME__ = _name;
    
    /**
     * The class
     * @type {Cls} 
     */
    Cls.prototype.__CLASS__ = Cls;
    /**
     * 
     * The class name
     * @type {String} 
     */
    Cls.prototype.__CLASS_FULL_NAME__ = _name;
    
    /**
     * 
     * The class name
     * @type {String} 
     */
    Cls.prototype.__CLASS_NAME__ = cname;
    
    if (isPlainObject(_props)) {
        extObj(Cls.prototype, _props);
    }
    
    if (isPlainObject(aliases)) {
        for (var al in aliases) {
            if (hasOwnProp(aliases, al)) {
                Cls.prototype[al] = Cls.prototype[aliases[al]];
            }
        }
    }
    
    
    
    
    if (ns) {
        var NS = globalNS.SereniX;
        if (NS) {
            NS= NS.Namespace||window.Namespace;
        } else {
            NS= globalNS.Namespace;
        }
        if (NS) {
            NS.ns(ns).addElement(Cls);
        } else {
            var ofs = 0, own = window, tok, o ;
            for (;;) {
                i = ns.indexOf('.', ofs);
                if (i < 0) {
                    tok = ns.substring(ofs);                
                    o = own[tok];
                    if (!o) {
                        own[tok] = o = {};
                    }
                    own = o;
                    break;
                }
                tok = ns.substring(ofs, i);
                o = own[tok];
                if (!o) {
                    own[tok] = o = {};
                }
                own = o;
                ofs = i + 1;
            }
            own[cname] = Cls;
        }
    }
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
}


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

/**
 * 
 * @param {Object} o
 * @param {Object} props
 * @param {type} methods
 * @returns {Object}
 */
function defineProperties(o, props, methods) { 
    var accessors = {}, addMethodsToObject = true;
    if (isPlainObject(methods)) {
        accessors = methods;
    } else if (typeof methods !== 'undefined' && methods !== null && methods !== '') {
        addMethodsToObject = toBool(methods);
    }
    function getAccessor(p, method, o, boolType, nameType, fromProp) {
        var m = p[method], mt = m, isObj = isPlainObject(nameType);
        if (fromProp) {
            if (!mt) {
                mt = p[method + 'ter'];
                if (mt instanceof String) {
                    mt = mt.valueOf();
                }
                if (typeof mt === 'string') {
                    if (o) {
                        mt = o[mt];
                        if (isObj) {
                            nameType.src = "obj";
                        }
                    }
                } else if (typeof mt === 'function') {
                    p[method] = mt;
                    if (nameType) {
                        nameType.src = "prop";
                    }
                }
            } else if (nameType) {
                nameType.src = "prop";
            }
        } else if (o) {
            if (mt instanceof String) {
                mt = mt.valueOf();
            }
            if (typeof mt === 'string') {
                mt = o[mt];
                if (isObj) {
                    nameType.src = "obj";
                }
            }
        }
        return typeof mt === 'function' ? mt : null;
    }
    var p, key, g, s, name, gName, iName, sName, boolType, nameObj = {};
    for (var i = 0, n = props.length; i < n; i++) {
        p = props[i];
        if (p instanceof String) {
            p = p.valueOf();
        }
        if (typeof p === 'string') {
            name = p;
            key = p[0].toUpperCase() + p.substring(1);
            gName = 'get' + key;
            g = accessors[gName];
            if (g) {
                if (addMethodsToObject) {
                    o[gName] = g;
                }
            } else {
                iName = 'is' + key;
                g = accessors[iName];
                if (g) {
                    if (addMethodsToObject) {
                        o[iName] = g;
                    }
                } else {
                    g = o[gName];
                    if (!g) {
                        g = o[iName];
                    }
                }
            }
            if (g) {
                p = { get: g};
                sName = 'set' + key;
                s = accessors[sName];
                if (s) {
                    if (addMethodsToObject) {
                        o[sName] = s;
                    }
                } else {
                    s = o[sName];
                }
                if (s) {
                    p.set = s;
                }
            } else {
                p = null;
            }
        } else if (isPlainObject(p)) {
            name = p.name||p.Name;
            var readOnly = p.readOnly;
            if (typeof readOnly === 'undefined') {
                readOnly = p.readonly;
                if (typeof readOnly === 'undefined') {
                    readOnly = p.writable;
                    if (typeof p === 'undefined') {
                        readOnly = p.readWrite;
                        if (typeof p === 'undefined') {
                            readOnly = p.readwrite;
                            if (typeof readOnly === 'undefined' || readOnly === null) {
                                readOnly = false;
                            } else {
                                readOnly = !readOnly;
                            }
                        } else {
                            readOnly = readOnly === null ? false : !readOnly;
                        }
                    } else {
                        readOnly = readOnly === null ? true : !readOnly;
                    }
                } else {
                    readOnly = !!readOnly;
                }
            } else {
                readOnly = !!readOnly;
            }
            if (name) {
                boolType = p.type && p.type === 'boolean' || p.type === 'bool' 
                    ? true 
                    : (function() {
                        var v = hasOwnProp(p, 'boolean') ? p.boolean: hasOwnProp(p, 'booleanType') ? p.booleanType : hasOwnProp(p, 'bool') ? p.bool : p.boolType;
                        return typeof v === 'undefined' || v === null ? undefined : toBool(v);
                    })();
                    
                key = name[0].toUpperCase() + name.substring(1);
                g = getAccessor(p, 'get', accessors, boolType, nameObj, true ); 
                if (g) {
                    gName = (boolType === true ? 'is' : 'get') + key;
                    o[gName] = g;
                } else {
                    g = getAccessor(p, 'get', o, boolType, false, false);
                }
                
                if (g) {                    
                    p = { 
                        get : g
                    };
                    if (!readOnly) {
                        sName = 'set' + key;
                        s = setAccessor(p, 'set', accessors, false, nameObj, true ); 
                        if (s) {
                            o[sName] = s;
                        } else {
                            s = setAccessor(p, 'set', o, false, false, false);
                        }
                        if (s) {                        
                            p.set = s;
                        }
                    }
                } else {
                    p = false;
                }
            } else {
                p = false;
            }
        } else {
            p = false;
        }
        if (p) {
            Object.defineProperty(o, name, p);
        }
    }
    return o;
};
/**
 * 
 * @param {Object} o
 * @param {Object} props
 * @param {type} methods
 * @returns {Object}
 */
var defineProps = defineProperties;
/**
 * Returns the first name of the field/property that has a string value.  
 * @param {Object} obj
 * @param {Array&lt;String&gt;} fnames The field/property names
 * @returns {String}
 */
function coalesceFieldName(obj, fnames) {
    var n = fnames.length, name, v;
    for (var i = 0; i < n; i++) {
        name = fnames[i];
        v = obj[name];
        if (v instanceof String) {
            v = v.valueOf();
        }
        if (typeof v === 'string') {
            return name;
        }
    }
    return null;
}

var coalesceField = coalesceFieldName;

var $initClass = initClass;

/**
 * 
 * @param {type} props
 * @returns {undefined}
 */
function objectDual(props) {
    var d = {};
    for (var k in props) {
        d[props[k]] = k;
    }
}

var odual = objectDual;

var toDual = objectDual;

function dict() {
    var a, obj = {}, n = arguments.length;
    function fromPairs(a) {
        var n = a.length;
        var p;
        for (var i = 0; i < n; i++) {
            p = [a[i]];
            obj[p[0]] = p[1];
        }
    }
    if (n === 1) {
        a = arguments[0];
        if (isArray(a)) {
            if (isArray(a[0])) {
                fromPairs(a);
            } else {
                var n = a.length, obj = {};
                n = (n - (n%2))/2;
                for (var i = 0; i < n; i++) {
                    obj[a[2*i]] = obj[2*i+1];
                }
            }
        } else if (isPlainObject(a)) {
            for (var k in a) {
                obj[k] = a[k];
            }
        }        
    } else if (n > 0) {
        for (var i = 0; i < n; i++) {
            a = arguments[i];
            if (isArray(a)) {
                if (a.length === 2 && ['string', 'number'].indexOf(typeof a)>=0) { //it(s a pair
                    obj[a[0]] = a[1];
                } else if (isArray(a[0])) { //array of pairs
                    fromPairs(a);
                } else {
                    var len = a.length, obj = {};
                    len = (len - (len%2))/2;
                    for (var k = 0; k < len; k++) {
                        obj[a[2*k]] = obj[2*k+1];
                    }
                }
            } else if (isPlainObject(a)) {
                for (var k in a) {
                    obj[k] = a[k];
                }
            }
        }
    }
    return obj;
}
/**
 * 
 * @param {type} props
 * @returns {undefined}
 */
var reverseObj = objectDual;


/**
 * Returns the value of the first property that has a value 
 * not <b color="blue">null</b> and different of <b color="blue">undefined</b> 
 * if such property exists; other returns the default value if it's specified or 
 * <b color="blue">undefined</b>.
 * <div class="syntax">
 * <h4>Syntaxes</h4>
 * <ul>
 * <li><b><i>coalesceProp</i></b>(obj: Object, property1: String, property2: String, ... , propertyN: String)
 * <p></p>
 * </li>
 * <li><b><i>coalesceProp(obj: Object, properties: Array&lt;String&gt;[ , defaultValue: type])</i></b>
 * <p></p>
 * </li>
 * </ul>
 * </div>
 * @returns {type}
 */
function coalesceProp() {
    var a = arguments, o = a[0], n = a.length, i = 1, v, defaultVal, props;
    if (isArray(a[1])) {
        if (a.length >= 3) {
            defaultVal = a[2];
        } 
        a = a[1];
        i = 0;
        n = a.length;  
        props = true;
    } else if (typeof a[1] === 'string' && typeof a[2] !== 'string') {
        defaultVal = a[2];
        a = a.split(/\s*\|\s*/g);
        i = 0;
    }
    var prop;
    for (; i < n; i++) {
        if (typeof (prop = a[i]) !== 'string' || !prop) {
            if (props) { //if properties defined as an array
                throw new Error("Expected string in the properties argument at index " + i);
            }
            return prop;
        }
        v = o[prop];
        if (typeof v !== 'undefined' && v !== null) {
            return v;
        }
    }
    return defaultVal;
}

/**
 * Copy properties from object o to object dest
 * @param {Object} o
 * @param {Object} dest
 * @param {Array&lt;string&gt;|function} [filter]
 * @param {Boolean} [exclusions]
 * @returns {Object}  The object dest
 */
function copyProps(o, dest, filter, exclusions) {
    if (isArray(filter)) {
        if (exclusions) {
            function _filter(name) {
                return _filter.exclusions.indexOf(name) < 0;
            }
            _filter.exclusions = filter;
            filter = _filter;
        } else {
            function _filter(name) {
                return _filter.names.indexOf(name) >= 0;
            }
            _filter.names = filter;
            filter = _filter;
        }
    } else if (typeof filter !== 'function') {
        filter = false;
    } else if (arguments.length > 3 && exclusions) {
        for (var name in o) {
            if (hasOwnProp(o, name) && !filter(name)) {
                dest[name]= o[name];
            }
        }
        return dest;
    }
    if (filter) {
        for (var name in o) {
            if (hasOwnProp(o, name) && filter(name)) {
                dest[name]= o[name];
            }
        }
    } else {
        for (var name in o) {
            if (hasOwnProp(o, name)) {
                dest[name]= o[name];
            }
        }
    }
    return dest;
}

/**
 * 
 * @param {Object} o
 * @param {String} name
 * @param {type} value
 * @param {Boolean} e Enumerable ? 
 * @param {Boolean} c Configurable ? 
 * @returns {Object}  Returns the given object
 */
function readOnlyValueProperty(o, name, value, e, c) {
    var a = Array.prototype.slice.call(arguments), len = a.length;
    Object.defineProperty(o, name, { 
        value : value, 
        writable: false, 
        enumerable : len > 3 && e !== undefined && e !== null ? toBool(e) : true,
        configurable : len > 4 && c !== undefined && c !== null ? toBool(c) : false 
    });
    return o;
}

var readOnlyVarProperty = readOnlyValueProperty;

var readOnlyValProperty = readOnlyValueProperty;

var roVarProperty = readOnlyValueProperty;

var roValProperty = readOnlyValueProperty;

var roValueProperty = readOnlyValueProperty;


var readOnlyVarProp = readOnlyValueProperty;

var readOnlyValProp = readOnlyValueProperty;

var roVarProp = readOnlyValueProperty;

var roValProp = readOnlyValueProperty;

var roValueProp = readOnlyValueProperty;

var $roValProp = readOnlyValueProperty;
/**
 * 
 * @param {Object} o
 * @param {String} name
 * @param {Function|Object} get When it's a function, represents the getter. Otherwise, represents the descriptor
 * @param {Function|Boolean} set When it's a function, represents the setter. Otherwise, the setter is defineProperty.readOnlySet function
 * @param {Boolean} e
 * @param {Boolean} c
 * @returns {Object} Returns the given object
 */
function defineProperty(o, name, get, set, e, c) {
    var desc,
        a = Array.prototype.slice.call(arguments);
    if (isPlainObject(name)) {
        desc = get;
    } else {        
        if (typeof set === 'function') {
            set = defineProperty.readOnlySet;
        }
        desc = { get : get, set: set, enumerable: e !== undefined && e !== null ? toBool(e) : true, configurable : c !== undefined && c !== null ? toBool(c) : false };
    }
    Object.defineProperty(o, name, desc);
    return o;
};

defineProperty.readOnlySet = function() {
    throw new Error("Read only property");
};

var defProperty = defineProperty;
var setProperty = defineProperty;
var property = defineProperty;
var $prop = defineProperty;
var $property = defineProperty;
/**
 * Returns the values of a key-value object
 * @param {Object} obj
 * @returns {Array}
 */
function valuesOf(obj) {
    var values = [], value;
    for (var key in obj) {
        value = obj[key];
        values.push(value); 
    }
    return values;
}

/**
 * Transforms array to object. The number of entries of the final object equals 
 * to the number of values/items od the array divide by 2.
 * @example 
 * Array [ 'red', '#FF0000', 'green', '#00FF00', blue, '#0000FF' ] of 6 values 
 * is transformed to the object 
 * { red: '#FF0000', green : '#00FF00', blue: '#0000FF' } that has 3 entries.
 * @param {Array} arr Unidimensionnal array to transform
 * @returns {Object&lt;String, type&gt;}
 * 
 */
function arrayToObj(arr) {
    var n = arr.length, obj = {};
    n = (n - (n%2))/2;
    for (var i = 0; i < n; i++) {
        obj[arr[2*i]] = obj[2*i+1];
    }
    return obj;
}
/**
 * Transforms array of pairs to object. Each element of the array represents a 
 * pair.A pair is an array of two elements
 * @example 
 * Array [ ['red', '#FF0000'], [ 'green', '#00FF00'], [blue, '#0000FF'] ] of  
 * 3 values is transformed to the object 
 * { red: '#FF0000', green : '#00FF00', blue: '#0000FF' } that has 3 entries.
 * @param {Array&lt;Array&gt;} pairs Array of pairs to transform
 * @returns {Object&lt;String, type&gt;}
 */
function arrayPairsToObj(pairs) {
    var n = pairs.length, obj = {}, p;
    for (var i = 0; i < n; i++) {
        p = [pairs[i]];
        obj[p[0]] = p[1];
    }
    return obj;
};
var pairsToObj = arrayPairsToObj;

