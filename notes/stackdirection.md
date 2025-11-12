summary: Write function(s) to determine if the stack grows up or down

```c
void __check_stack_direction(int *first_var) {
    int second_var;
    if (&second_var > first_var)
        printf("stack grows up\n");
    else
        printf("stack grows down\n");
}
void check_stack_direction(void) {
    int first_var;
    __check_stack_direction(&first_var);
}
```
