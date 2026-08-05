import openpyxl

wb = openpyxl.load_workbook('task2-excel-map.xlsx')
ws = wb.active

# Let me print the full map clearly with all colors
def get_color(r, c):
    cell = ws.cell(row=r, column=c)
    fg = cell.fill.fgColor
    if cell.value == 'START': return 'START'
    if cell.value == 'END': return 'END'
    if fg.type == 'rgb': return fg.rgb
    if fg.type == 'theme': return f'theme:{fg.theme}'
    return '???'

# Print full map with color codes
print("Full map (color codes):")
print("     A        B        C        D        E        F        G        H        I")
for r in range(1, 21):
    line = f" {r:2d} "
    for c in range(1, 10):
        col = get_color(r, c)
        if col == 'START': col = 'START   '
        elif col == 'END': col = 'END     '
        elif col.startswith('FF'): col = col[2:]
        line += f" {col:>7s}"
    print(line)

# Let me also check specific cells around potential branching points
print("\n\nChecking neighbors at key positions:")
key_positions = [
    (10, 4, "D10 after turn 7"),
    (10, 5, "E10 step 15"),
    (9, 5, "E9 after turn 8"),
    (10, 2, "B10 after turn 6"),
    (8, 2, "B8 after turn 5"),
    (6, 2, "B6 after turn 4"),
    (5, 3, "C5 after turn 3"),
    (4, 2, "B4 after turn 2"),
    (3, 1, "A3 after turn 1"),
]

DIRS = {'U': (-1,0), 'D': (1,0), 'L': (0,-1), 'R': (0,1)}
OPP = {'U':'D','D':'U','L':'R','R':'L'}

for (r, c, desc) in key_positions:
    cl = chr(ord('A') + c - 1)
    col = get_color(r, c)
    hex6 = col[2:] if col.startswith('FF') and len(col)==8 else col
    print(f"\n{desc}: {cl}{r} = {hex6}")
    for dname, (dr, dc) in DIRS.items():
        nr, nc = r+dr, c+dc
        if 1<=nr<=20 and 1<=nc<=9:
            ncl = chr(ord('A') + nc - 1)
            ncol = get_color(nr, nc)
            nhex6 = ncol[2:] if ncol.startswith('FF') and len(ncol)==8 else ncol
            is_blue = ncol == 'FF0099FF'
            print(f"  {dname} -> {ncl}{nr} = {nhex6}{' [BLUE]' if is_blue else ''}")
        else:
            print(f"  {dname} -> out of bounds")
