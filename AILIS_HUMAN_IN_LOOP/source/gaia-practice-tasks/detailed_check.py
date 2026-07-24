import openpyxl

wb = openpyxl.load_workbook('task2-excel-map.xlsx')
ws = wb.active

# Let me check ALL cells including those with no fill or default fill
print("Complete cell inventory (all 180 cells):")
print("Row Col  Value  FillType  FGType     FGRGB        BGType     BGRGB")
print("-" * 90)
for r in range(1, 21):
    for c in range(1, 10):
        cell = ws.cell(row=r, column=c)
        fill = cell.fill
        fg = fill.fgColor
        bg = fill.bgColor
        
        fg_rgb = fg.rgb if fg.type == 'rgb' else ''
        bg_rgb = bg.rgb if bg.type == 'rgb' else ''
        fg_theme = f"theme:{fg.theme}" if fg.type == 'theme' else ''
        bg_theme = f"theme:{bg.theme}" if bg.type == 'theme' else ''
        fg_idx = f"idx:{fg.indexed}" if fg.type == 'indexed' else ''
        bg_idx = f"idx:{bg.indexed}" if bg.type == 'indexed' else ''
        
        fg_str = fg_rgb or fg_theme or fg_idx
        bg_str = bg_rgb or bg_theme or bg_idx
        
        v = repr(cell.value) if cell.value is not None else ''
        print(f"  {r:2d}  {c:2d}  {v:6s}  {fill.fill_type or 'None':8s}  {fg.type:8s}  {fg_str:12s}  {bg.type:8s}  {bg_str}")

# Also check if there are any conditional formatting rules
print(f"\nConditional formatting: {ws.conditional_formatting}")
for cf in ws.conditional_formatting:
    print(f"  CF range: {cf}, rules: {cf.rules}")
