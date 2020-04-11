import os
from collections import namedtuple

Klass = namedtuple("Klass", "name extends constructor varz funcs svars sfuncs")
Var = namedtuple("Var", "name value")

source = "flash/Box2D"
destination = "javascript/Box2D"
import re

def readblock(code, start="{", end="}"):
    i = 0
    code = code[code.index(start):]
    block = []
    for c in code:
        block.append(c)
        if c == start:
            i += 1
        elif c == end:
            i -= 1
            if i == 0:
                return "".join(block)

def insert_super_constructor_call(match):
	if not match.group(3):
		value = "%s%s%s%s%s" % ("{", match.group(1), "this._super.__constructor.apply(this, arguments);", match.group(1), match.group(2))
		return value
	else:
		return match.group(0)

def translate(klass):
    lines = ["var %s = function() {" % klass.name]
    if klass.extends:
        lines.append("%s.prototype.__varz.call(this)" % klass.extends)
    lines.append("this.__varz();")
    lines.append("this.__constructor.apply(this, arguments);")
    lines.append("}")
    constructor = klass.constructor.value
    if klass.extends:
        lines.append("extend(%s.prototype, %s.prototype)" % (klass.name, klass.extends));
        #lines.append("%s.prototype._super = function(){ %s.prototype.__constructor.apply(this, arguments) }" % (klass.name, klass.extends))
        lines.append("%s.prototype._super = %s.prototype;" % (klass.name, klass.extends))
		# handle implicit constructor call
		# function() {  }   or   function () {   this._super.__constructor.apply } or function (..) {  anyotherId}
		#             11                      1113333333333333333333333333333333                     11
		#               2                     2222222222222222222222222222222222                       2
        constructor = re.sub("\{(\s*)((?:\}|(this._super.__constructor.apply)|\w))", insert_super_constructor_call, constructor, 1)

    lines.append("%s.prototype.__constructor = %s" % (klass.name, constructor))
    lines.append("%s.prototype.__varz = function(){" % klass.name)
    for name, value in klass.varz:
        if not re.match("^\s*(\d+(\.\d+)?|null|true|false)\s*;\s*$", value):
            lines.append("this.%s = %s" % (name, value))
    lines.append("}")
    lines.append("// static methods")
    for name, value in klass.sfuncs:
        lines.append("%s.%s = %s" % (klass.name, name, value))
    lines.append("// static attributes")
    for name, value in klass.svars:
        lines.append("%s.%s = %s" % (klass.name, name, value))
    lines.append("// methods")
    for name, value in klass.funcs:
        lines.append("%s.prototype.%s = %s" % (klass.name, name, value))
    lines.append("// attributes")
    for name, value in klass.varz:
        lines.append("%s.prototype.%s = %s" % (klass.name, name, value))
    code = "\n".join(lines)
    # remove type annotations
    code = re.sub(r"([^ ]+)[ ]+as[ ]+\w+", "\\1", code)
    return code

def modify_supercall(match):
	result = "this._super."
	if match.group(1):
		result = result + match.group(1)
	else:
		result = result + "__constructor"
	result = result + ".apply(this, ["
	if match.group(2):
		result = result + match.group(2)
	result = result + "]);"
	
	return result		
	
def parse(code):
    # strip comments
    code = re.sub("(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/)|(//.*)", "", code)
    # ints and uints are initialized with 0 not null
    code = re.sub("(var\s+\w+:u?int)\s*;", "\\1 = 0;", code)
    # int/uint -> parseInt
    code = re.sub("([^a-zA-Z0-9]+)int\(", "\\1parseInt(", code)
    code = re.sub("([^a-zA-Z0-9]+)uint\(", "\\1parseInt(", code)
    # super calls including custructor
    # super.method(a, b)
    #       111111 2222
    code = re.sub(r"\bsuper(?:\.(\w+))?\(\s*([^\)]*)\);", modify_supercall, code)
    # const -> var 
    code = re.sub(r"\bconst\b", "var", code)
    #remove type anotations
    code = re.sub("((var |\(|,)\s*[^:=\), ]+):[ ]*(\w+|\\*)", "\\1", code)
    #remove function return types
    code = re.sub("(function \w+\([^\)]*\))\s*:\w+", "\\1", code)
    #convert vectors to arrays
    ## new Vector.<Number>();
    code = re.sub(r"\bVector\b", "Array", code);
    ## new Dictionary
    code = re.sub(r"\bDictionary\b", "Object", code);
    # remove generics
    ## new Vector.<Number>();
    ## var lowerValues:Vector.<Number>;
    ## var m_registers:Vector.<Vector.<b2ContactRegister> > = null;
    code = re.sub(r"\.<[^<>]*(<.*?>)?[^>]*>", "", code);
    ## remove override and virtual
    code = code.replace("override", "").replace("virtual", "").replace("\r", "")
    ## obj is type
    code = re.sub("(\w+) is (\w+)", "isInstanceOf(\\1, \\2)", code)
    ## for each(var queryProxy in m_moveBuffer)
    #               1111111111    222222222222
    # for(var i=0, queryProxy=null;i<this.m_moveBuffer.length, queryProxy=this.m_moveBuffer[i]; i++)
    code = re.sub(r"for each\(var (\w+) in (\w+)\)", r"for(var i=0, \1=null;i<\2.length, \1=\2[i]; i++)", code)
    
    # hack ...
    code = code.replace("var mid = ((low + high) / 2);", "var mid = Math.round((low + high) / 2);")
    code = code.replace("b2internal", "private")
    code = code.replace("static public", "staticpublik")
    code = code.replace("static private", "staticprivat")
    
    # hack for uints used in proxy
    code = code.replace("& 0x0000ffff", "% 65535")
    while "  " in code:
        # normalize whitespace
        code = code.replace("  ", " ")
    lines = code.split("\n")
    klass = None
    extends = None
    # remove packages and imports
    lines = [l for l in lines if not
                l.startswith("package ") and not l.startswith("import ")]

    code = "\n".join(lines)

    # find class
    class_start = re.search("(public|internal) class ", code)
    if not class_start:
    	return None
    aux = code[class_start.end(0):]
    i = min(aux.index(" "), aux.index("\n"), aux.index("{"))
    klass = aux[:i].strip()
    extends = None
    if "extends " in aux:
        if aux.index("extends ") < aux.index("{"):
            aux = aux[aux.index("extends ")+len("extends "):]
            extends = aux[:min(aux.index(" "), aux.index("{"))].strip()
    code = readblock(aux[aux.index("{"):])
    pubf = getfunctions(code, "^\s*(public\s)?function ")
    try:
        constructor = next(x for x in pubf if x[0] == klass)
        pubf.remove(constructor)
    except StopIteration:
        constructor = Var(klass, "function(){}")	
    privf = getfunctions(code, "private function ")
    statf = getfunctions(code, "static function ") + getfunctions(code,
            "staticpublik function ") + getfunctions(code, "staticprivat function ")
    privvar = getvars(code, "private var ")
    pubvar = getvars(code, "public var ")
    statvar = getvars(code, "staticpublik var ") + getvars(code, "static var") + getvars(code, "staticprivat var")
    
    return Klass(klass, extends, constructor, privvar+pubvar, privf+pubf, statvar, statf)

def getvars(code, prefix):
    varz = []
    while prefix in code:
        code = code[code.index(prefix)+len(prefix):]
        i = min(code.index(";"), code.index("\n"))
        if "=" in code and code.index("=") < i:
            name, code = code.split("=", 1)
            name = name.strip()
            i = min(code.index(";"), code.index("\n"))
            body = code[:i] + ";"
        else:
            name = code[:i].strip()
            body = " null;"
        # support var foo, bar = x;
        if "," in name:
            for subname in name.split(","):
                varz.append(Var(subname.strip(), body))
        else:
            varz.append(Var(name, body))
    return varz

def getfunctions(code, prefix):
    functions = []
    while True:
        so = re.search(prefix, code, re.M)
        if not so:
            break
        code = code[so.end():]
        i = min(code.index(" "), code.index("("))
        name = code[:i]
        args = readblock(code, "(", ")")
        #remove default parameters
        args = re.sub("=[^,)]+", "", args)
        body = readblock(code)
        functions.append(Var(name, "function %s %s" % (args, body)))
    return functions

classes = {}
files = []
for dirpath, dirnames, filenames in os.walk(source):
    target = dirpath.replace(source, destination, 1)
    for dirname in dirnames:
        try:
            os.mkdir(os.path.join(target, dirname))
        except OSError:
            pass
    for filename in filenames:
        if not filename.endswith(".as"):
            continue
        src = os.path.join(dirpath, filename)
        code = open(src, "r").read()
        dest = os.path.join(target, filename.replace(".as", ".js"))
       	print "parsing", src
       	klass = parse(code)
       	if not klass:
       		print "-> no class found"
       		continue
       	print "translating", src
       	code = translate(klass)
       	# klass, path, dependencies (empty)
       	deps = klass.extends and [klass.extends] or []
       	classes[klass.name] = (klass, code, dest, deps)

def resolve(code, klass):
    for name, value in klass.svars + klass.sfuncs:
        code = re.sub("([^a-zA-Z0-9_.])(%s)([^a-zA-Z0-9_])" % name, "\\1" +
                klass.name + ".\\2\\3", code)
    for name, value in klass.varz + klass.funcs:
        code = re.sub(r"([^a-zA-Z0-9_\.])(%s)\b" % name, "\\1this.\\2", code)

    if klass.extends:
        return resolve(code, classes[klass.extends][0])
    return code


# resolve references
for name in classes:
    klass, code, dest, deps = classes[name]
    with open(dest, "w") as f:
        f.write(resolve(code, klass))

# build deps
for klass in classes:
    klass, code, dest, deps = classes[klass]
    # hack
    if klass.name=="b2Collision":
    	deps.append("ClipVertex")

    for name, value in klass.varz + klass.svars + [klass.constructor]:
        for klass2 in classes:
            if klass2 == klass.name:
                continue
            if klass2 == klass.extends and not klass2 in deps:
            	deps.append(klass2)
            	continue    
            if klass2 in value and not klass2 in deps:
                deps.append(klass2)
                
# randomly breaking circular dependencies
def breakCircle(klass, root, visited):
    visited.append(klass)
    deps = classes[klass][3]
    if root in deps:
        deps.remove(root)
        print "found circle", root, klass
        return True
    return any(breakCircle(d, root, visited) for d in deps if not d in visited)

# breaking all the circles
while any(breakCircle(klass, klass, []) for klass in classes):
    pass

# exports for usage with CommonJS and node.js specifically
with open("javascript/misc/exports.js", "w") as f:
	f.write("if(typeof exports !== 'undefined') {\n")
	for name in classes:
		f.write("    exports.%s=%s;\n" % (name, name))       
	f.write("}")    

while classes:
    for name in classes.keys():
        klass, code, dest, deps = classes[name]
        deps = [d for d in deps if d in classes]
        if len(deps) == 0:
            files.append(dest)
            del classes[name]

with open("build.sh", "w") as f:
    f.write("#!/bin/sh\n")
    f.write("if [ ! -f closure/compiler.jar ]\n")
    f.write("then\n")
    f.write("echo \"closure compiler seems to be missing\"\n")
    f.write("echo \"read and follow instruction directory ./closure/\"\n")
    f.write("exit 1\n")
    f.write("fi\n")
    f.write("echo \"compiling box2d.js\"\n")
    f.write("java -jar closure/compiler.jar --compilation_level=WHITESPACE_ONLY --formatting PRETTY_PRINT --js javascript/misc/extend.js")
    f.write(" --js " + " --js ".join(files))
    f.write(" --js javascript/misc/exports.js")
    f.write(" --js_output_file javascript/Box2D/box2d.js\n")
    f.write("echo \"compiling box2d.min.js\"\n")
    f.write("java -jar closure/compiler.jar --js javascript/misc/extend.js")
    f.write(" --js " + " --js ".join(files))
    f.write(" --js javascript/misc/exports.js")
    f.write(" --js_output_file javascript//Box2D/box2d.min.js")

with open("javascript/Box2D/load.html", "w") as f:
    for filename in files:
        f.write('<script src="' + filename + '" type="text/javascript"></script>\r\n')
print "\n".join(files)