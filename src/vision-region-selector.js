const MIN_SELECTION_SIZE = 12;

window.addEventListener('DOMContentLoaded', () => {
    const layerEl = document.getElementById('selection-layer');
    const boxEl = document.getElementById('selection-box');
    const sizeEl = document.getElementById('selection-size');
    const cancelBtnEl = document.getElementById('cancel-btn');

    let dragStart = null;
    let dragCurrent = null;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getPoint(event) {
        return {
            x: clamp(event.clientX, 0, window.innerWidth),
            y: clamp(event.clientY, 0, window.innerHeight)
        };
    }

    function getSelectionRect() {
        if (!dragStart || !dragCurrent) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        const x = Math.min(dragStart.x, dragCurrent.x);
        const y = Math.min(dragStart.y, dragCurrent.y);
        const width = Math.abs(dragCurrent.x - dragStart.x);
        const height = Math.abs(dragCurrent.y - dragStart.y);

        return { x, y, width, height };
    }

    function renderSelection() {
        const rect = getSelectionRect();
        if (!rect.width || !rect.height) {
            boxEl.style.display = 'none';
            return;
        }

        boxEl.style.display = 'block';
        boxEl.style.left = `${rect.x}px`;
        boxEl.style.top = `${rect.y}px`;
        boxEl.style.width = `${rect.width}px`;
        boxEl.style.height = `${rect.height}px`;
        sizeEl.textContent = `${Math.round(rect.width)} x ${Math.round(rect.height)}`;
    }

    function resetSelection() {
        dragStart = null;
        dragCurrent = null;
        renderSelection();
    }

    function cancelSelection() {
        window.ailisDesktop?.vision?.cancelRegionSelection?.();
    }

    function finishSelection() {
        const rect = getSelectionRect();
        if (rect.width < MIN_SELECTION_SIZE || rect.height < MIN_SELECTION_SIZE) {
            resetSelection();
            return;
        }

        window.ailisDesktop?.vision?.finishRegionSelection?.({
            selection: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                devicePixelRatio: window.devicePixelRatio || 1
            }
        });
    }

    layerEl.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            cancelSelection();
            return;
        }

        dragStart = getPoint(event);
        dragCurrent = dragStart;
        layerEl.setPointerCapture?.(event.pointerId);
        renderSelection();
    });

    layerEl.addEventListener('pointermove', (event) => {
        if (!dragStart) {
            return;
        }
        dragCurrent = getPoint(event);
        renderSelection();
    });

    layerEl.addEventListener('pointerup', (event) => {
        if (!dragStart) {
            return;
        }
        dragCurrent = getPoint(event);
        layerEl.releasePointerCapture?.(event.pointerId);
        finishSelection();
    });

    layerEl.addEventListener('pointercancel', resetSelection);
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cancelSelection();
        }
    });
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        cancelSelection();
    });
    cancelBtnEl.addEventListener('click', cancelSelection);
});
