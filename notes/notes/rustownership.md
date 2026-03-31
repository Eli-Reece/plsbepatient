# Rust: Ownership

## References

https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html

https://doc.rust-lang.org/rust-by-example/scope.html

https://rust-exercises.com/100-exercises/03_ticket_v1/06_ownership.html

<br>

---

## Key Takeaways

1. A resource can have only one owner at any given time (statically determined at compile time)
2. Not all variables own a resource (references)
3. Ownership can be transferred

<br>

---

## Scope

A variable is only valid within the scope that its declared

```rust
{ // scope starts
    let var = 5; // Variable created 
} // scope over, var is no longer valid (drop(var))
```

<br>

---

## Move

### Moving a String

Here's a simple program that creates a string variable `a` and prints it

```rust
fn main() {
    let a = String::from("demo");
    println!("{a}");
}
```

:::info
We say that we bind the string 'demo' to a
:::

This compiles perfectly fine and a will be dropped at the end of the scope<br><br>

Now, if I create a new variable `b` and assign it `a` the code will not compile
if we try to access `a`.

```rust
fn main() {
    let a = String::from("demo");
    println!("{a}");
    let b = a;
    println!("{b}");
    println!("{a}");
}
```

```bash
 --> src/main.rs:6:16
  |
2 |     let a = String::from("A");
  |         - move occurs because `a` has type `String`, which does not implement the `Copy` trait
3 |     println!("{a}");
4 |     let b = a;
  |             - value moved here
5 |     println!("{b}");
6 |     println!("{a}");
  |                ^ value borrowed here after move
```

Here, variable `a` was the initial resource owner of the string. Then,
ownership was transferred to variable `b`.

:::warning
For later: "move occurs because a has type String, which does not implement the
Copy trait"
:::


### Moving an Integer

Let's do the same as above but with an integer

```rust
fn main() {
    let a: u32 = 5;
    println!("{a}");
    let b: u32 = a;
    println!("{b}");
    println!("{a}");
}
```

```bash
❯ cr
   Compiling ownership v0.1.0 (/home/rust/0_programming/programming/rust/ownership)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/ownership`
5
5
5
```

Here, variable `a` is the owner of the resource (u32 value `5`). The u32 type
has a `trait` called `copy` which created a new instance of the resource (u32 value
`5`) and binded it to variable `b`. The resources variable `a` and variable `b`
hold are independent entities which exist on the stack.<br><br>

We can easily prove this by making variable `b` mutable and updating its value.

```rust
fn main() {
    let a: u32 = 5;
    println!("initial: {a}");
    let mut b: u32 = a;
    println!("after 'move' (copy): {b}");
    println!("after 'move' (copy): {a}");
    b = 22;
    println!("after update: {b}");
    println!("after update: {a}");
}
```

```bash
initial: 5
after 'move' (copy): 5
after 'move' (copy): 5
after update: 22
after update: 5
```

---

## Functions and Routines

Let's create a program that modifies a `String` in three ways using functions
to see how ownership and references work for functions

### Simple Modification

```rust
fn increment_a(s: String) -> String {
    s + " bar"
}

fn main() {
    let mut var = String::from("foo");
    println!("{var}");

    var = increment_a(var);
    println!("{var}");
}
```

In main, we create a mutable variable `var` and bind it to the String `"foo"`.
Then we pass this variable into `increment_a()`. At this point, ownership of the
String is moved into `increment_a()`. This means that our variable `var` becomes
invalid until we assign the returned value back to it.<br><br>

In `increment_a()`, parameter `s` takes ownership of the String. That value is
consumed in the body of the function and a new String is created and returned
to the caller.


### Borrow a String (Immutable Reference)

```rust
fn increment_b(s: &String) -> String {
    let mut new_s = s.clone();
    new_s.push_str(" bar");
    new_s
}

fn main () {
    let mut var = String::from("foo");
    println!("{var}");

    var = increment_b(&var);
    println!("{var}");
}
```

In main, we create a mutable variable `var` and bind it to the String `"foo"`.
Then we pass an immutable reference of the variable into `increment_b()`.<br><br>

In `increment_b()`, parameter `s` takes a reference to the String. In the body of
the function, `s` (the reference) is cloned, and this new clone is modified and
returned. The original resource still exists, but `var` is overwritten to take
this new resource. When var is overwritten, the heap memory of the original
'foo' is free'd


### Borrow and update a String (Mutable Reference)

```rust
fn increment_c(s: &mut String) {
    s.push_str(" bar");
}

fn main() {
    let mut var = String::from("foo");
    println!("{var}");

    increment_c(&mut var);
    println!("{var}");
}
```

In main, we create a mutable variable `var` and bind it to the String `"foo"`.
Then we pass a mutable reference of the variable into `increment_c()`.<br><br>

In `increment_c()`, parameter `s` takes a mutable reference to the String. In the
body of the function, `s` (the mutable reference) is modified directly. Pretty
straight forward
