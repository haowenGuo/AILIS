table = {
    'a': {'a':'a','b':'b','c':'c','d':'b','e':'d'},
    'b': {'a':'b','b':'c','c':'a','d':'e','e':'c'},
    'c': {'a':'c','b':'a','c':'b','d':'b','e':'a'},
    'd': {'a':'b','b':'e','c':'b','d':'e','e':'d'},
    'e': {'a':'d','b':'b','c':'a','d':'d','e':'c'},
}
elements = ['a','b','c','d','e']
for x in elements:
    for y in elements:
        if x < y: # alphabetical order, check each pair once
            xy = table[x][y]
            yx = table[y][x]
            print(f"{x}*{y}={xy}, {y}*{x}={yx}{'  <-- NON-COMMUTATIVE' if xy != yx else ''}")
