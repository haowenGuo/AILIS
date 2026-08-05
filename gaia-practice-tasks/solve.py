import openpyxl
from collections import deque

wb = openpyxl.load_workbook('task2-excel-map.xlsx')
ws = wb.active

# Build the grid: True = passable (not blue), False = blocked (blue)
# Also store color hex for each cell
ROWS, COLS = 20, 9
passable = [[True]*COLS for _ in range(ROWS)]
colors = [[None]*COLS for _ in range(ROWS)]

for r in range(1, ROWS+1):
    for c in range(1, COLS+1):
        cell = ws.cell(row=r, column=c)
        fill = cell.fill
        fg = fill.fgColor
        rgb = None
        if fg.type == 'rgb':
            rgb = fg.rgb
        elif fg.type == 'theme':
            rgb = 'FFFFFFFF' if fg.theme == 0 else f'theme:{fg.theme}'
        
        colors[r-1][c-1] = rgb
        if rgb == 'FF0099FF':  # Blue = blocked
            passable[r-1][c-1] = False

# START at (0,0) [A1], END at (19,8) [I20]
# Directions: up, down, left, right
DIRS = {'up': (-1,0), 'down': (1,0), 'left': (0,-1), 'right': (0,1)}
OPPOSITE = {'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left'}

def in_bounds(r, c):
    return 0 <= r < ROWS and 0 <= c < COLS

def can_move(r, c, direction):
    """Can we move 2 cells in direction from (r,c)?"""
    dr, dc = DIRS[direction]
    # Intermediate cell (1 step)
    r1, c1 = r + dr, c + dc
    # Landing cell (2 steps)
    r2, c2 = r + 2*dr, c + 2*dc
    if not in_bounds(r2, c2):
        return False
    if not passable[r1][c1] or not passable[r2][c2]:
        return False
    return True

# BFS to find all reachable positions at each turn
# State: (row, col, last_direction)
# Turn 0: at START (0,0), no previous direction

# Let's do BFS tracking turn number
# We want to find where we are after exactly 11 turns

# State: (r, c, last_dir)
# From START, first move can be any direction except backward (but there's no previous, so any valid direction)

# Let's compute reachable positions turn by turn
print("Turn 0: at START (0,0) [A1]")

# positions at each turn: set of (r, c, last_dir)
current_positions = {(0, 0, None)}

for turn in range(1, 12):
    next_positions = set()
    for (r, c, last_dir) in current_positions:
        for dname, (dr, dc) in DIRS.items():
            # Can't move backward (opposite of last direction)
            if last_dir and dname == OPPOSITE[last_dir]:
                continue
            if can_move(r, c, dname):
                nr, nc = r + 2*dr, c + 2*dc
                next_positions.add((nr, nc, dname))
    current_positions = next_positions
    
    print(f"\nTurn {turn}: {len(current_positions)} possible positions")
    for (r, c, d) in sorted(current_positions):
        col_letter = chr(ord('A') + c)
        color = colors[r][c]
        print(f"  ({r},{c}) = {col_letter}{r+1}, came from {d}, color={color}")
