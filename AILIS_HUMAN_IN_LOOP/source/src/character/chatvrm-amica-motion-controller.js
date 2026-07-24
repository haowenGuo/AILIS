// Architecture adapted from pixiv/ChatVRM and semperai/amica (MIT License).
// Owns animation playback, fade transitions, one-shot return-to-idle, and runtime inspection.

import * as THREE from 'three';
import { getMotionReviewStatus } from './motion-library.js';

function normalizeName(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function pickDifferent(names, currentName, random = Math.random) {
    const available = names.filter(Boolean);
    if (!available.length) {
        return '';
    }
    const candidates = available.length > 1
        ? available.filter((name) => name !== currentName)
        : available;
    const pool = candidates.length ? candidates : available;
    const index = Math.floor(random() * pool.length);
    return pool[Math.min(index, pool.length - 1)];
}

function stopFading(action) {
    if (typeof action?.stopFading === 'function') {
        action.stopFading();
    }
}

export class ChatVRMAmicaMotionController {
    constructor({
        idleActions = ['idle'],
        danceActions = [],
        crossFadeDuration = 0.4,
        random = Math.random,
        logger = console
    } = {}) {
        this.mixer = null;
        this.actionMap = {};
        this.currentAction = null;
        this.currentActionName = '';
        this.lastIdleActionName = '';
        this.oneShotAction = null;
        this.oneShotActionName = '';
        this.idleActions = [...idleActions];
        this.danceActions = [...danceActions];
        this.crossFadeDuration = crossFadeDuration;
        this.random = random;
        this.logger = logger;
        this.onFinished = this.onFinished.bind(this);
    }

    bind({ mixer = null, actionMap = {} } = {}) {
        if (this.mixer) {
            this.mixer.removeEventListener?.('finished', this.onFinished);
        }
        this.mixer = mixer;
        this.actionMap = actionMap || {};
        this.mixer?.addEventListener?.('finished', this.onFinished);
    }

    dispose() {
        this.mixer?.removeEventListener?.('finished', this.onFinished);
        this.mixer = null;
        this.actionMap = {};
        this.currentAction = null;
        this.currentActionName = '';
        this.oneShotAction = null;
        this.oneShotActionName = '';
    }

    getAvailableActionNames() {
        return Object.keys(this.actionMap || {});
    }

    getActionNameByInstance(actionInstance) {
        return Object.keys(this.actionMap || {}).find((name) => this.actionMap[name] === actionInstance) || '';
    }

    getCurrentActionName() {
        return this.currentActionName || this.getActionNameByInstance(this.currentAction);
    }

    isIdleActionName(actionName) {
        return this.idleActions.includes(actionName);
    }

    isDanceActionName(actionName) {
        return this.danceActions.includes(actionName);
    }

    prepareAction(actionName, action) {
        if (!action) {
            return;
        }
        const isIdleAction = this.isIdleActionName(actionName);
        action.enabled = true;
        action.setLoop(
            isIdleAction ? THREE.LoopRepeat : THREE.LoopOnce,
            isIdleAction ? Infinity : 1
        );
        action.clampWhenFinished = !isIdleAction;
    }

    prepareAllActions() {
        for (const [name, action] of Object.entries(this.actionMap || {})) {
            this.prepareAction(name, action);
        }
    }

    selectIdleAction() {
        const availableIdles = this.idleActions.filter((name) => this.actionMap[name]);
        return pickDifferent(availableIdles, this.getCurrentActionName(), this.random);
    }

    selectDanceAction() {
        const availableDances = this.danceActions.filter((name) => this.actionMap[name]);
        return pickDifferent(availableDances, this.getCurrentActionName(), this.random);
    }

    resolveActionName(actionName) {
        const normalized = normalizeName(actionName);
        if (normalized === 'idle') {
            return this.selectIdleAction();
        }
        if (normalized === 'dance') {
            return this.selectDanceAction();
        }
        return normalized;
    }

    fadeToAction(nextAction, nextActionName, {
        fadeDuration = this.crossFadeDuration,
        reset = true,
        timeScale = 1,
        weight = 1,
        restartSame = false
    } = {}) {
        if (!nextAction) {
            return false;
        }

        const previousAction = this.currentAction;
        const previousActionName = this.currentActionName;
        const isSameAction = previousAction === nextAction;

        if (isSameAction && !restartSame) {
            this.logger?.debug?.('[CharacterMotion] skip same action', {
                action: nextActionName
            });
            return true;
        }

        nextAction.enabled = true;
        stopFading(nextAction);

        if (reset) {
            nextAction.reset();
            nextAction.time = 0;
        }
        nextAction
            .setEffectiveTimeScale(timeScale)
            .setEffectiveWeight(weight);

        if (previousAction && !isSameAction) {
            previousAction.enabled = true;
            stopFading(previousAction);
            previousAction.fadeOut?.(fadeDuration);
            nextAction.fadeIn?.(fadeDuration);
        } else {
            nextAction.fadeIn?.(fadeDuration);
        }
        nextAction.play();

        this.currentAction = nextAction;
        this.currentActionName = nextActionName;

        if (this.isIdleActionName(nextActionName)) {
            this.lastIdleActionName = nextActionName;
        }

        this.logger?.debug?.('[CharacterMotion] fade', {
            from: previousActionName,
            to: nextActionName,
            fadeDuration
        });
        return true;
    }

    playIdle(options = {}) {
        const idleName = this.resolveActionName('idle');
        if (!idleName || !this.actionMap[idleName]) {
            this.logger?.warn?.(`⚠️ IDLE 动作不存在: ${idleName || 'idle'}`);
            return false;
        }
        const idleAction = this.actionMap[idleName];
        this.prepareAction(idleName, idleAction);
        this.oneShotAction = null;
        this.oneShotActionName = '';
        return this.fadeToAction(idleAction, idleName, options);
    }

    playOneShot(actionName, options = {}) {
        const resolvedName = this.resolveActionName(actionName);
        if (!resolvedName || !this.actionMap[resolvedName]) {
            this.logger?.warn?.(`⚠️ 动作不存在: ${resolvedName || actionName}`);
            return false;
        }
        const reviewStatus = getMotionReviewStatus(resolvedName);
        if (reviewStatus !== 'approved' && options.allowExperimental !== true) {
            this.logger?.warn?.(`⚠️ 动作 "${resolvedName}" 当前为 ${reviewStatus}，已被稳定链路拦截`);
            return false;
        }

        const nextAction = this.actionMap[resolvedName];
        this.prepareAction(resolvedName, nextAction);
        this.oneShotAction = nextAction;
        this.oneShotActionName = resolvedName;
        const played = this.fadeToAction(nextAction, resolvedName, {
            ...options,
            restartSame: options.restartSame === true
        });
        if (played) {
            this.logger?.log?.(`🎬 播放 one-shot 动作: ${resolvedName}`);
        }
        return played;
    }

    play(actionName, options = {}) {
        const resolvedName = this.resolveActionName(actionName);
        if (!resolvedName) {
            return false;
        }
        if (this.isIdleActionName(resolvedName)) {
            return this.playIdle(options);
        }
        return this.playOneShot(resolvedName, options);
    }

    onFinished(event = {}) {
        const finishedAction = event.action;
        const finishedName = this.getActionNameByInstance(finishedAction);
        if (!finishedName || this.isIdleActionName(finishedName)) {
            return;
        }
        if (finishedAction !== this.currentAction || finishedAction !== this.oneShotAction) {
            this.logger?.debug?.('[CharacterMotion] ignore stale finished action', finishedName);
            return;
        }
        this.logger?.log?.(`🔄 one-shot 动作(${finishedName})结束，回到 idle`);
        this.playIdle({ fadeDuration: Math.max(this.crossFadeDuration, 0.5) });
    }
}
