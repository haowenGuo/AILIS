import openpyxl

wb = openpyxl.load_workbook('task2-excel-map.xlsx')
ws = wb.active

# Let's print a cleaner view with coordinates
# Also double-check all cells in column A and around the start area
print("Verifying column A and nearby cells:")
for r in range(1, 21):
    for c_letter in ['A', 'B', 'C', 'D', 'E']:
        cell = ws[f'{c_letter}{r}']
        fill = cell.fill
        fg = fill.fgColor
        rgb = None
        if fg.type == 'rgb':
            rgb = fg.rgb
        elif fg.type == 'theme':
            rgb = f'theme:{fg.theme}'
        val = cell.value or ''
        if rgb == 'FF0099FF':
            code = 'BLUE'
        elif rgb == 'FF92D050':
            code = 'GREEN'
        elif rgb == 'FFF478A7':
            code = 'PINK'
        elif rgb == 'FFFFFF00':
            code = 'YELLOW'
        elif 'theme' in str(rgb):
            code = f'THEME({fg.theme})'
        else:
            code = str(rgb)
        print(f"  {c_letter}{r}: {code:8s} val={val}")
    print()
