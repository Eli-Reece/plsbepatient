### What is it?

- A RAM-based virtual filesystem that provides access to kernel data structures
- Allows viewing device attributes, modifying parameters, and facilitating interaction between user space and the kernel

### kobject

- `kobject` is a structure that defines an object within sysfs
- Each `kobject` has:
  - A parent
  - A name
  - A type (ktype)
- The name of the `kobject` matches the name of the directory it represents in sysfs

```c
struct kobject {
    const char              *name;
    struct list_head        entry;
    struct kobject          *parent;
    struct kset             *kset;
    const struct kobj_type  *ktype;
    struct kernfs_node      *sd; /* sysfs directory entry */
    struct kref             kref;

    unsigned int state_initialized:1;
    unsigned int state_in_sysfs:1;
    unsigned int state_add_uevent_sent:1;
    unsigned int state_remove_uevent_sent:1;
    unsigned int uevent_suppress:1;

#ifdef CONFIG_DEBUG_KOBJECT_RELEASE
    struct delayed_work     release;
#endif
};
```

### kobj_type

- `kobj_type` defines the behavior of the kobject you are implementing
- It contains:
  - A list of attributes (sysfs files that users can interact with)
  - An operation structure `sysfs_ops` where you can define store/show methods

```c
struct kobj_type {
    void (*release)(struct kobject *kobj);
    const struct sysfs_ops *sysfs_ops;
    const struct attribute_group **default_groups;
    const struct kobj_ns_type_operations *(*child_ns_type)(const struct kobject *kobj);
    const void *(*namespace)(const struct kobject *kobj);
    void (*get_ownership)(const struct kobject *kobj, kuid_t *uid, kgid_t *gid);
};
```

### attributes

- `attributes` are used to expose and manipulate kernel info for user space
- these take the form of regular files each with a unique name where you could
bind a dedicated file operations structure
```c
struct attribute {
        const char              *name;
        umode_t                 mode;
#ifdef CONFIG_DEBUG_LOCK_ALLOC
        bool                    ignore_lockdep:1;
        struct lock_class_key   *key;
        struct lock_class_key   skey;
#endif
};
```

### sysfs operations (sysfs_ops)

- `sysfs_ops` defined into kobj_type expose two methods for IO operations
```c
struct sysfs_ops {
        ssize_t (*show)(struct kobject *, struct attribute *, char *);
        ssize_t (*store)(struct kobject *, struct attribute *, const char *, size_t);
};
```
- A kobject attribute could also a bind a specific I/O operations
```c
struct kobj_attribute {
        struct attribute attr;
        ssize_t (*show)(struct kobject *kobj, struct kobj_attribute *attr,
                        char *buf);
        ssize_t (*store)(struct kobject *kobj, struct kobj_attribute *attr,
                         const char *buf, size_t count);
};
```
- When a read or write operation is performed on a sysfs file, `sysfs_ops` methods
defined in the `kobj_type` of your `kobject` are always invoked

### Init Example

```c
/* In init function */

// kobject_init_and_add ( struct kobject* kobj, struct kobj_type * ktype, struct kobject* parent, const char* fmt, … ) ;
 /*
  * Create a simple kobject with the name of "kobject_example",
  * located under /sys/kernel/
  * The kobject path will be: /sys/kernel/kobject_example
  * Does not allocate memory therefore example_kobj should be a pre-allocated struct
  */
retval = kobject_init_and_add(&example_kobj, &my_ktype, kernel_kobj, "%s", "kobject_example");


// kobject_create_and_add ( const char* name, struct kobject* parent ) ;
 /*
  * Create a simple kobject with the name of "kobject_example",
  * located under /sys/kernel/
  * The kobject path will be: /sys/kernel/kobject_example
  * Allocates memory
  */
// global: struct kobject* kobject_ex;
kobject_ex = kobject_create_and_add("kobject_example", kernel_kobj);
if (!kobject_example)
    return -ENOMEM
```

### De-Init Example

```c
// kobject_put ( strcut kobject* kobj ) ;
kobject_put(kobject_ex);
```

### Show and Store

```c
static ssize_t my_file_show(struct kobject* kobj, struct attribute* attr, char* buf)
{
 int ret = 0;

 // attr->name is the name of the attribute where the read operation is performed

 if(strncmp(attr->name, "my_int", 6))
  ret = sysfs_emit(buf, "%d\n", my_int);
 else // if(strcmp(attr->name, "my_second_int"))
  ret = sysfs_emit(buf, "%d\n", my_second_int);

 return ret;
}

static ssize_t my_file_store(struct kobject* kobj, struct attribute* attr, const char* buf, size_t count)
{
 int ret;

 // attr->name is the name of the attribute where the read operation is performed
 
 if(strncmp(attr->name, "my_int", 6))
  ret = kstrtoint(buf, 10, &my_int);
 else
  ret = kstrtoint(buf, 10, &my_second_int);

 // Converts the string type to an integer

 if(ret < 0)
  return ret;

 return count;
}

// If needed release module
static void my_file_release(struct kobject* kobj)
{
    // Invoked when kobject_put is called ot destroy this object
    printk("Placeholder release")
}
```

### Attribute Configuration and Binding

```c
/* Defines my_int attribute */
static struct attribute my_file_attribute = {
 .name = "my_int", // The regular file name
 .mode = 0664,
};

/* Defines my_second_int attribute */
static struct attribute my_second_file_attribute = {
 .name = "my_second_int", // The regular file name
 .mode = 0664,
};

// The attributes array to bind to the kobject
static struct attribute *my_file_attrs[] = {
 &my_file_attribute,
 &my_second_file_attribute,
 NULL,
};

/* This is the same of:
 *  struct attribute_group the my_file_groups = {
 *  .attrs = my_file_attrs,
 * };
 * That contains the attribute_group
 */
ATTRIBUTE_GROUPS(my_file);
```
