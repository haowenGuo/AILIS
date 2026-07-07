import openpyxl
from collections import deque

wb = openpyxl.load_workbook(r'F:\AILIS_self_evolution_runtime\gaia-practice-tasks\task2-excel-map.xlsx')
ws = wb.active

ROWS, COLS = 20, 9

# Build grid: True = walkable (non-blue), False = blue/blocked
# Also store color hex
grid = []
colors = []
start = None
end = None

for r in range(1, ROWS+1):
    row_walk = []
    row_color = []
    for c in range(1, COLS+1):
        cell = ws.cell(row=r, column=c)
        val = cell.value
        fill = cell.fill
        fg = fill.fgColor
        fg_color = None
        if fg and fg.type == 'rgb':
            fg_color = fg.rgb
        elif fg and fg.type == 'theme':
            fg_color = 'theme0'  # white/default
        
        if val == 'START':
            start = (r-1, c-1)  # 0-indexed
            row_walk.append(True)
            # What color is START? Let's check theme:0
            row_color.append('FFFFFF')  # assuming white
        elif val == 'END':
            end = (r-1, c-1)
            row_walk.append(True)
            row_color.append('FFFFFF')
        elif fg_color == 'FF0099FF':
            row_walk.append(False)
            row_color.append('0099FF')
        elif fg_color and len(fg_color) == 8:
            row_walk.append(True)
            row_color.append(fg_color[2:])  # RRGGBB
        else:
            row_walk.append(True)
            row_color.append('FFFFFF')
    grid.append(row_walk)
    colors.append(row_color)

print(f"START: {start}, END: {end}")
print()

# Print walkable grid
print("Walkable grid (# = blocked, . = walkable, S=start, E=end):")
for r in range(ROWS):
    line = ""
    for c in range(COLS):
        if (r,c) == start: line += "S"
        elif (r,c) == end: line += "E"
        elif grid[r][c]: line += "."
        else: line += "#"
    print(f"{r+1:2d}|{line}|")
print("   ABCDEFGHI")
print()

# BFS to find path - interpretation 1: move exactly 2 cells in one direction
# Both intermediate and destination must be walkable
# No backward (can't reverse previous direction)

DIRS = [(-1,0,'U'), (1,0,'D'), (0,-1,'L'), (0,1,'R')]
OPPOSITE = {'U':'D', 'D':'U', 'L':'R', 'R':'L'}

def bfs_straight(pass_through=True):
    """BFS where each move is 2 cells in a straight line.
    If pass_through=True, intermediate cell must also be walkable.
    State: (row, col, last_dir)
    """
    # Start: from START, first move has no "backward" constraint
    # All 4 directions possible (if valid)
    queue = deque()
    visited = set()
    
    sr, sc = start
    for dr, dc, dname in DIRS:
        r1, c1 = sr+dr, sc+dc
        r2, c2 = sr+2*dr, sc+2*dc
        if 0 <= r2 < ROWS and 0 <= c2 < COLS:
            if pass_through:
                if grid[r1][c1] and grid[r2][c2]:
                    queue.append((r2, c2, dname, [(sr,sc), (r2,c2)], [dname]))
                    visited.add((r2, c2, dname))
            else:
                if grid[r2][c2]:
                    queue.append((r2, c2, dname, [(sr,sc), (r2,c2)], [dname]))
                    visited.add((r2, c2, dname))
    
    while queue:
        r, c, last_dir, path, dirs = queue.popleft()
        if (r,c) == end:
            return path, dirs
        if len(path) > 20:  # safety
            continue
        for dr, dc, dname in DIRS:
            if dname == OPPOSITE[last_dir]:
                continue  # no backward
            r2, c2 = r+2*dr, c+2*dc
            if 0 <= r2 < ROWS and 0 <= c2 < COLS:
                r1, c1 = r+dr, c+dc
                if pass_through:
                    if grid[r1][c1] and grid[r2][c2] and (r2,c2,dname) not in visited:
                        visited.add((r2,c2,dname))
                        queue.append((r2, c2, dname, path+[(r2,c2)], dirs+[dname]))
                else:
                    if grid[r2][c2] and (r2,c2,dname) not in visited:
                        visited.add((r2,c2,dname))
                        queue.append((r2, c2, dname, path+[(r2,c2)], dirs+[dname]))
    return None, None

print("=== BFS straight line (pass-through, both cells must be walkable) ===")
path, dirs = bfs_straight(pass_through=True)
if path:
    print(f"Path length: {len(path)-1} turns")
    for i, (r,c) in enumerate(path):
        color = colors[r][c]
        print(f"  Turn {i}: ({r+1},{c+1}) = {color}")
    if len(path) > 11:
        r11, c11 = path[11]
        print(f"\n  11th turn lands on ({r11+1},{c11+1}) = {colors[r11][c11]}")
else:
    print("No path found!")

print()
print("=== BFS straight line (jump, only destination must be walkable) ===")
path2, dirs2 = bfs_straight(pass_through=False)
if path2:
    print(f"Path length: {len(path2)-1} turns")
    for i, (r,c) in enumerate(path2):
        color = colors[r][c]
        print(f"  Turn {i}: ({r+1},{c+1}) = {color}")
    if len(path2) > 11:
        r11, c11 = path2[11]
        print(f"\n  11th turn lands on ({r11+1},{c11+1}) = {colors[r11][c11]}")
else:
    print("No path found!")
