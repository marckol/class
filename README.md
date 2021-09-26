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


