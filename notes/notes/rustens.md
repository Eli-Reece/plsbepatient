# Rust: Enums and Structs

## Whats the Difference?

`Enums` are a way to say **a value is one of a possible set of values**

`Structs` are a way to **group related fields and data**

Both create a **new type**

## Enums

### Variants

Type that can have a fixed set of values, called `variants`

```rust
enum RGB {
    Red,
    Green,
    Blue,
}

let color: RGB = RGB::Green;
```

:::info
Variants of an enum are namespaced under its identifier hence the "::"
:::

:::info
Since the above Enum has no fields, it's known as a field-less enum
:::

### Fields and Struct-like Variants

Enums can have named or unnamed fields

```rust
enum RGB2 {
    Red,
    Green(u8),
    Blue(u8, String),
}

let color: RGB2 = RGB2::Blue(52, "Light Blue".to_string());
```

Enums can also have struct-like variants

```rust

enum RGB3 {
    Red,
    Green,
    Blue { name: String, val: u8 },
}

let color: RGB3 = RGB3::Blue { name: "Dark Blue".to_string(), val: 170 };
```

### Discriminants

Each enum instance has a `discriminant`: an integer logically associated to it
that is used to determine which variant it holds (typically an `isize`)

If the discriminant for a variant is not specified, then it is set to one higher
than the discriminant of the previous variant in the declaration

```rust
enum Foo {
    Bar, // 0
    Baz = 123, // 123
    Quux, // 124
}
```

Two variants can not share the same discriminant

```rust
enum SharedDiscriminantError {
    SharedA = 1,
    SharedB = 1
}

enum SharedDiscriminantError2 {
    Zero,       // 0
    One,        // 1
    OneToo = 1  // 1 (collision with previous!)
}
```

## Structs

Struct is very simply a type that is made up of other types. Here is a `named
field struct`:

```rust
struct Example {
    field1: f32,
    field2: String,
    field3: bool,
}
```

### Fields

Fields can be accessed using the `example_struct.field` syntax.

You can directly instantiate a struct iff all of its fields are visible to you:

```rust
let example = Example {
    field1: 42.0,
    field2: "blah".to_string(),
    field3: false,
};
```

### Constructor

The typical method is to use a constructor method such as `new()`

```rust
struct Person {
    name: String,
    age: u8,
}

impl Person {
    pub fn new(name: String, age: u8) -> Self {
        Self { name, age }
    }
}

fn main() {
    let dude: Person = Person::new("the dude".to_string(), 55);
    println!("{}", dude.name);
}
```

Methods in general can be defined using the `impl` syntax:
```rust
impl <StructName> {
   fn <method_name>(<parameters>) -> <return_type> {
       // Method body
   }
}
```

### Self vs Self

Methods can use `self` as their first parameter. `self` represents the instance
of the struct that the method is being called on

```rust
struct Person {
    name: String,
    age: u8,
}

impl Person {
    pub fn new(name: String, age: u8) -> Self {
        Self { name, age }
    }

    pub fn get_person(self) -> Self {
        self
    }
}

fn main() {
    let john: Person = Person::new("john".to_string(), 22);
    // let person = Person::get_person(john); // Normal call syntax
    let person = john.get_person(); // Method call syntax
    println!("{}", person.name);
}
```

:::info
If a method doesn't take 'self' as its first parameter, its a static method and
must be called using the '::' function call syntax
:::

`Self` (captial 'S') refers to the *type* itself. It's just a placeholder for the type that
the method is being implemented for.

```rust
struct Counter {
    value: i32,
}

impl Counter {
    // Self refers to the type (Counter)
    // Used in return types and type annotations
    fn new(initial: i32) -> Self {  // Self = Counter
        Self { value: initial }      // Self = Counter
    }

    // self (owned) - consumes the instance
    fn consume(self) -> i32 {
        println!("Consuming self, value: {}", self.value);
        self.value
    }

    // &self (immutable reference) - borrows immutably
    fn get_value(&self) -> i32 {
        println!("Immutably borrowing self, value: {}", self.value);
        self.value
    }

    // &mut self (mutable reference) - borrows mutably
    fn increment(&mut self) {
        self.value += 1;
        println!("Mutably borrowing self, incremented to: {}", self.value);
    }

    // Self in return type
    fn clone_counter(&self) -> Self {
        Self { value: self.value }
    }

    // Self in both parameter type, consumes both instances
    fn add(self, other: Self) -> Self {
        Self { value: self.value + other.value }
    }
}

fn main() {
    println!(" Creating Counter ");
    let mut counter = Counter::new(0);

    println!("\n Immutable Reference (&self) ");
    let val1 = counter.get_value();
    let val2 = counter.get_value();
    println!("Can call multiple times: {}, {}", val1, val2);

    println!("\n Mutable Reference (&mut self) ");
    counter.increment();
    counter.increment();

    println!("\n Self as Type ");
    let counter2 = counter.clone_counter();
    println!("Cloned counter value: {}", counter2.get_value());

    println!("\n Owned self (consuming) ");
    let result = counter.add(counter2);
    println!("Added result: {}", result.get_value());

    // counter and counter2 are now moved/consumed
    // Uncommenting below would cause compile error:
    // counter.get_value();

    println!("\n Final consume ");
    let final_value = result.consume();
    println!("Final value: {}", final_value);

    // result is now consumed
    // Uncommenting below would cause compile error:
    // result.get_value();
}
```

### Tuple Structs

Tuple structs are also defined with the keyword `struct`. A constructor of the
same name is also defined:

```rust
struct Point(i32, i32);
let p = Point(10, 11);
```

## Extra

### Sorting a vector of structs

```rust
#[derive(Debug, Eq, Ord, PartialEq, PartialOrd)]
struct Person {
    name: String,
    age: u8,
}

impl Person {
    pub fn new(name: String, age: u8) -> Self {
        Self { name, age }
    }
}

fn main() {
    let mut people = vec![
        Person::new("john".to_string(), 50),
        Person::new("doe".to_string(), 30),
        Person::new("susan".to_string(), 88),
    ];

    people.sort(); // Sort by derived natural order
    people.sort_by(|a, b| b.age.cmp(&a.age)); // Sort by age where a is struct and b is a struct
}
```
