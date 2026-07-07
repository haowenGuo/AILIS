# Define the multiplication table: index 0=a,1=b,2=c,3=d,4=e
# table[x][y] = x*y
table = [
    ['a','b','c','b','d'], # a (0)
    ['b','c','a','e','c'], # b (1)
    ['c','a','b','b','a'], # c (2)
    ['b','e','b','e','d'], # d (3)
    ['d','b','a','d','c'], # e (4)
]
elements = ['a','b','c','d','e']
non_commute_pairs = []
bad_elements = set()
for x in range(5):
    for y in range(5):
        if x >= y:
            continue # only check each unordered pair once
        xy = table[x][y]
        yx = table[y][x]
        if xy != yx:
            print(f"Non-commutative: {elements[x]} * {elements[y]} = {xy}, {elements[y]} * {elements[x]} = {yx}")
            non_commute_pairs.append( (elements[x], elements[y]) )
            bad_elements.add(elements[x])
            bad_elements.add(elements[y])
print("\nAll elements involved in counterexamples:", sorted(bad_elements))
