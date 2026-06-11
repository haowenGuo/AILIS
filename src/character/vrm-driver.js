export function createVrmDriver(vrmSystem) {
    return {
        getAvailableMotions() {
            return Object.keys(vrmSystem?.actionMap || {});
        },

        getCurrentMotion() {
            return vrmSystem?.getCurrentActionName?.() || '';
        },

        setSurfaceState(surface) {
            vrmSystem?.setCharacterSurfaceState?.(surface);
        },

        playMotion(motion, options = {}) {
            const motionId = typeof motion === 'string' ? motion : motion?.id;
            if (!motionId) {
                return false;
            }
            return vrmSystem?.playResolvedAction?.(motionId, options) ?? false;
        },

        applyExpressionMix(expressionMix, options = {}) {
            return vrmSystem?.applyExpressionMix?.(expressionMix, options) ?? false;
        },

        applySceneMood(sceneMood, options = {}) {
            return vrmSystem?.applySceneMood?.(sceneMood, options) ?? false;
        }
    };
}
