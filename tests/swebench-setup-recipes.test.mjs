import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildSweBenchSetupCommand,
    getSweBenchSetupRecipe,
    getSweBenchWheelhousePackages,
    listSweBenchSetupRecipes
} from '../scripts/swebench-setup-recipes.mjs';

test('SWE-bench setup recipes select known repos by repo name', () => {
    assert.equal(getSweBenchSetupRecipe('astropy/astropy')?.id, 'astropy');
    assert.equal(getSweBenchSetupRecipe('django/django')?.id, 'django');
    assert.equal(getSweBenchSetupRecipe('sympy/sympy')?.id, 'sympy');
    assert.equal(getSweBenchSetupRecipe('scikit-learn/scikit-learn')?.id, 'scikit-learn');
});

test('SWE-bench setup recipes fall back for unknown Python repos', () => {
    const recipe = getSweBenchSetupRecipe('example/project');
    assert.equal(recipe.id, 'python-default');
    assert.match(buildSweBenchSetupCommand(recipe, { wheelhouseDir: '/tmp/wheelhouse' }), /--find-links '\/tmp\/wheelhouse'/);
});

test('SWE-bench setup recipes expose repo-specific wheelhouse packages', () => {
    const packages = getSweBenchWheelhousePackages({ repos: ['astropy/astropy'] });
    assert.ok(packages.includes('setuptools<60'));
    assert.ok(packages.includes('pytest-astropy'));
    assert.ok(packages.includes('exceptiongroup'));
    assert.ok(!packages.includes('django'));
});

test('SWE-bench setup recipes are listable for control panel or CLI docs', () => {
    const recipes = listSweBenchSetupRecipes();
    assert.ok(recipes.some((recipe) => recipe.id === 'astropy'));
    assert.ok(recipes.some((recipe) => recipe.id === 'scikit-learn'));
});
