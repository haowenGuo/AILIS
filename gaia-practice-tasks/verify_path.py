import openpyxl

wb = openpyxl.load_workbook('task2-excel-map.xlsx')
ws = wb.active

rows, cols = 20, 9

# Build color grid
grid = {}
for r in range(1, rows+1):
    for c in range(1, cols+1):
        cell = ws.cell(row=r, column=c)
        fg = cell.fill.fgColor
        if fg.type == 'rgb':
            grid[(r,c)] = fg.rgb
        elif fg.type == 'theme':
            grid[(r,c)] = f"theme:{fg.theme}"
        if cell.value == 'START':
            grid[(r,c)] = 'START'
        elif cell.value == 'END':
            grid[(r,c)] = 'END'

# Print the map with coordinates
def cell_char(r, c):
    v = grid.get((r,c), '???')
    if v == 'START': return 'S'
    if v == 'END': return 'E'
    if v == 'FF0099FF': return '█'  # blue
    if v == 'FF92D050': return 'G'  # green
    if v == 'FFFFFF00': return 'Y'  # yellow
    if v == 'FFF478A7': return 'P'  # pink
    if v and v.startswith('theme'): return 'W'  # white/default
    return '?'

print("Map:")
print("    A B C D E F G H I")
for r in range(1, rows+1):
    line = f" {r:2d} "
    for c in range(1, cols+1):
        line += cell_char(r, c) + ' '
    print(line)

# Now trace the path from BFS
DIRS = {'U': (-1,0), 'D': (1,0), 'L': (0,-1), 'R': (0,1)}

# Let me manually trace the path found
path = "DDDRRDDLDDDDRRRUUUUUUU"
print(f"\nPath length: {len(path)}")
pos = (1, 1)
print(f"Start: A1 (row={pos[0]}, col={pos[1]})")
for i, d in enumerate(path):
    dr, dc = DIRS[d]
    pos = (pos[0]+dr, pos[1]+dc)
    cl = chr(ord('A') + pos[1] - 1)
    color = grid.get(pos, '???')
    hex6 = color[2:] if color.startswith('FF') and len(color)==8 else color
    is_blue = color == 'FF0099FF'
    print(f"  Step {i+1}: {d} -> {cl}{pos[0]} (color={hex6}) {'BLUE!' if is_blue else ''}")

# Let me also verify the BFS result more carefully by re-running with step-by-step validation
print("\n\n=== Re-validating BFS ===")

passable = {}
for r in range(1, rows+1):
    for c in range(1, cols+1):
        color = grid.get((r,c), '')
        if color == 'START' or color == 'END':
            passable[(r,c)] = True
        elif color == 'FF0099FF':
            passable[(r,c)] = False
        else:
            passable[(r,c)] = True

OPP = {'U':'D','D':'U','L':'R','R':'L'}

def neighbors(r, c, last_dir):
    result = []
    for dname, (dr, dc) in DIRS.items():
        if last_dir is not None and dname == OPP[last_dir]:
            continue
        nr, nc = r+dr, c+dc
        if 1<=nr<=rows and 1<=nc<=cols and passable.get((nr,nc), False):
            result.append((nr, nc, dname))
    return result

# BFS with full path tracking
from collections import deque

# Queue entries: (r, c, last_dir, turn, path)
queue = deque()
queue.append((1, 1, None, 0, ""))
visited = set()

results_at_turn = {}

while queue:
    r, c, last_dir, turn, path = queue.popleft()
    
    if turn == 11:
        if turn not in results_at_turn:
            results_at_turn[turn] = []
        results_at_turn[turn].append((r, c, last_dir, path))
        continue
    
    state = (r, c, last_dir, turn)
    if state in visited:
        continue
    visited.add(state)
    
    # Take 2 steps for this turn
    # Step 1
    for (r1, c1, d1) in neighbors(r, c, last_dir):
        # Step 2
        for (r2, c2, d2) in neighbors(r1, c1, d1):
            queue.append((r2, c2, d2, turn+1, path+d1+d2))

print(f"\nAfter turn 11, found {len(results_at_turn.get(11, []))} paths:")
for (r, c, d, p) in sorted(results_at_turn.get(11, [])):
    cl = chr(ord('A') + c - 1)
    color = grid[(r,c)]
    hex6 = color[2:] if color.startswith('FF') and len(color)==8 else color
    print(f"  {cl}{r}, last_dir={d}, color={hex6}, path={p}")
