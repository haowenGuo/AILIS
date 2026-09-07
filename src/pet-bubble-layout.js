// All coordinates are CSS pixels in the transparent window, not screen pixels.
export function layoutPetBubble({ visibleBounds, avatarBounds, width, height, gap = 18, padding = 8 }) {
    const v = {
        left: visibleBounds.left + padding,
        top: visibleBounds.top + padding,
        right: visibleBounds.right - padding,
        bottom: visibleBounds.bottom - padding
    };
    const a = avatarBounds;
    const slots = [
        { side: 'above', ...v, bottom: Math.min(v.bottom, a.top - gap) },
        { side: 'below', ...v, top: Math.max(v.top, a.bottom + gap) },
        { side: 'left', ...v, right: Math.min(v.right, a.left - gap) },
        { side: 'right', ...v, left: Math.max(v.left, a.right + gap) }
    ].map(s => ({ ...s, width: Math.max(0, s.right - s.left), height: Math.max(0, s.bottom - s.top) }));
    const readable = s => s.width >= Math.min(width, 120) && s.height >= Math.min(height, 64);
    const slot = slots.slice(0, 2).find(readable) ||
        slots.filter(readable).sort((a, b) => b.width * b.height - a.width * a.height)[0] ||
        slots.filter(s => s.width >= 48 && s.height >= 32)
            .sort((a, b) => b.width * b.height - a.width * a.height)[0];
    if (!slot) return null;
    const w = Math.min(width, slot.width);
    const h = Math.min(height, slot.height);
    const centerX = (a.left + a.right) / 2;
    const centerY = (a.top + a.bottom) / 2;
    let left = centerX - w / 2;
    let top = slot.side === 'above' ? a.top - gap - h :
        slot.side === 'below' ? a.bottom + gap : centerY - h / 2;
    if (slot.side === 'left') left = a.left - gap - w;
    if (slot.side === 'right') left = a.right + gap;
    return {
        left: Math.min(Math.max(left, slot.left), slot.right - w),
        top: Math.min(Math.max(top, slot.top), slot.bottom - h),
        width: w, height: h, side: slot.side, anchorX: centerX
    };
}
