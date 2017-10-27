---
title: "Tarantool: don't use auto_increment in the vinyl engine"
tags: "tarantool, vinyl"
published: true
---

Recently we changed all our spaces in tarantool from memtx to vinyl. But,
during load testing we got a error:

```bash
Transaction has been aborted by conflict
```

After, I found this [issue](https://github.com/tarantool/tarantool/issues/389).
So, we have to use sequence instead of `auto_increment`. We have
big spaces and vinyl not support altering the indexes. But, it
turned out precisely `index:alter()` can be used for `sequence`.

For example, we have space in vinyl engine:

```lua
tarantool> box.schema.space.create('test', {engine=vinyl})
...
tarantool> box.space.test:create_index('primary', {unique=true, parts={1, 'unsigned'}})
...
```

And we using `auto_increment`:

```lua
tarantool> box.space.test:auto_increment{'foo'}
---
- [1, 'foo']
...
tarantool> box.space.test:auto_increment{'bar'}
---
- [2, 'bar']
```

If we want use the `sequence` we should create a sequence for primary index:

```lua
    tarantool> box.schema.sequence.create('test_space_primary_seq')
    ---
    - step: 1
      id: 1
      min: 1
      cache: 0
      uid: 1
      max: 9223372036854775807
      cycle: false
      name: test_space_primary_seq
      start: 1
    ...
```

Value the created sequence must be last value of our primary index:

```lua
tarantool> box.sequence.test_space_primary_seq:set(2)
---
...
```

Set the primary index sequence:

```lua
tarantool> box.space.test.index.primary:alter({sequence='test_space_primary_seq'})
---
...
```

So, we can change all our `auto_increment` queries to common `insert`:

```
tarantool> box.space.test:insert{nil, 'foo'}
---
- [3, 'foo']
...
```

Info:

```bash
Tarantool 1.7.5-238-g39276fe
```
