// Compare user edits to the hydrated form, not to storage-only metadata.
export function createFormBaseline(form, saved) {
    return structuredClone({ form, saved });
}

export function hasFormChanges(form, saved, baseline) {
    if (!baseline) return false;
    return Object.keys(form).some((key) => {
        // Component installers can save individual preferences while this page is open.
        const savedChanged = JSON.stringify(saved[key]) !== JSON.stringify(baseline.saved[key]);
        const expected = savedChanged ? saved[key] : baseline.form[key];
        return JSON.stringify(form[key]) !== JSON.stringify(expected);
    });
}
