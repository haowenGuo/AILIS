import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_WHEELHOUSE_DIR = path.join(projectRoot, 'build-cache', 'pip-wheelhouse', 'py310-linux');

const COMMON_TEST_PACKAGES = [
    'wheel',
    'packaging',
    'pytest<8',
    'exceptiongroup',
    'typing_extensions'
];

const PY310_COLLECTIONS_ABCS_COMPAT_COMMAND = "python -c \"import pathlib, site; p = pathlib.Path(site.getsitepackages()[0]) / 'swebench_compat.pth'; p.write_text('import collections, collections.abc; collections.Mapping = collections.abc.Mapping; collections.MutableMapping = collections.abc.MutableMapping; collections.Sequence = collections.abc.Sequence; collections.MutableSequence = collections.abc.MutableSequence; collections.Set = collections.abc.Set; collections.MutableSet = collections.abc.MutableSet; collections.Callable = collections.abc.Callable; collections.Iterable = collections.abc.Iterable\\n', encoding='utf8')\"";
const PY310_NUMPY_LEGACY_ALIAS_COMPAT_COMMAND = "python -c \"import pathlib, site; p = pathlib.Path(site.getsitepackages()[0]) / 'swebench_numpy_compat.pth'; p.write_text('import numpy as np; np.float = float; np.int = int; np.complex = complex; np.object = object; np.bool = bool; np.str = str\\n', encoding='utf8')\"";
const SCIPY_LEGACY_API_COMPAT_COMMAND = "python -c \"import pathlib, site; root = pathlib.Path(site.getsitepackages()[0]); (root / 'swebench_scipy_legacy.py').write_text('import scipy.linalg as _linalg\\nimport scipy.sparse.linalg as _sp_linalg\\nimport scipy.optimize.linesearch as _linesearch\\nimport scipy.optimize._linesearch as _private_linesearch\\n_linesearch.line_search_wolfe1 = _private_linesearch.line_search_wolfe1\\n_linesearch.line_search_wolfe2 = _private_linesearch.line_search_wolfe2\\n_original_solve = _linalg.solve\\ndef _swebench_solve(a, b, *args, sym_pos=False, **kwargs):\\n    if sym_pos:\\n        kwargs.setdefault(\\'assume_a\\', \\'pos\\')\\n    return _original_solve(a, b, *args, **kwargs)\\n_linalg.solve = _swebench_solve\\n_original_cg = _sp_linalg.cg\\ndef _swebench_cg(A, b, x0=None, tol=None, maxiter=None, M=None, callback=None, **kwargs):\\n    if tol is not None and \\'rtol\\' not in kwargs:\\n        kwargs[\\'rtol\\'] = tol\\n    return _original_cg(A, b, x0=x0, maxiter=maxiter, M=M, callback=callback, **kwargs)\\n_sp_linalg.cg = _swebench_cg\\n', encoding='utf8'); (root / 'swebench_scipy_legacy.pth').write_text('import swebench_scipy_legacy\\n', encoding='utf8')\"";

const RECIPE_LIST = [
    {
        id: 'astropy',
        repos: ['astropy/astropy'],
        description: 'Astropy source checkout with local extension build for modeling tests.',
        packages: [
            'setuptools<60',
            'wheel',
            'numpy<2',
            'setuptools_scm==6.4.2',
            'cython==0.29.22',
            'extension-helpers',
            'pyerfa',
            'PyYAML',
            'packaging',
            'pytest<8',
            'pytest-astropy',
            'pytest-astropy-header',
            'exceptiongroup',
            'typing_extensions'
        ],
        commands: [
            { type: 'pipInstallWheelhouse' },
            { type: 'shell', command: 'python setup.py build_ext --inplace' }
        ]
    },
    {
        id: 'django',
        repos: ['django/django'],
        description: 'Django pure-Python editable install with common test dependencies.',
        packages: [
            'setuptools',
            'wheel',
            'asgiref',
            'sqlparse',
            'pytz',
            'tzdata',
            'tblib',
            'Jinja2',
            'MarkupSafe',
            'PyYAML',
            ...COMMON_TEST_PACKAGES
        ],
        commands: [
            { type: 'pipInstallWheelhouse' },
            { type: 'shell', command: 'python -m pip install -e . --no-deps' }
        ]
    },
    {
        id: 'sympy',
        repos: ['sympy/sympy'],
        description: 'SymPy pure-Python editable install with pytest and mpmath.',
        packages: [
            'setuptools',
            'wheel',
            'mpmath',
            'hypothesis',
            ...COMMON_TEST_PACKAGES
        ],
        commands: [
            { type: 'pipInstallWheelhouse' },
            { type: 'shell', command: 'python -m pip install -e . --no-deps' },
            {
                type: 'shell',
                command: PY310_COLLECTIONS_ABCS_COMPAT_COMMAND
            }
        ]
    },
    {
        id: 'scikit-learn',
        repos: ['scikit-learn/scikit-learn'],
        description: 'Scikit-learn compiled editable install with scientific Python build dependencies.',
        packages: [
            'setuptools<60',
            'wheel',
            'numpy<2',
            'scipy',
            'cython<3',
            'joblib',
            'threadpoolctl',
            'meson-python',
            'meson',
            'ninja',
            'hypothesis',
            ...COMMON_TEST_PACKAGES
        ],
        commands: [
            { type: 'pipInstallWheelhouse' },
            { type: 'shell', command: 'python -m pip install -e . --no-build-isolation --no-deps' },
            { type: 'shell', command: PY310_COLLECTIONS_ABCS_COMPAT_COMMAND },
            { type: 'shell', command: PY310_NUMPY_LEGACY_ALIAS_COMPAT_COMMAND },
            { type: 'shell', command: SCIPY_LEGACY_API_COMPAT_COMMAND }
        ]
    },
    {
        id: 'python-default',
        repos: [],
        description: 'Fallback Python project setup for unknown repos.',
        packages: [
            'setuptools',
            ...COMMON_TEST_PACKAGES
        ],
        commands: [
            { type: 'pipInstallWheelhouse' },
            { type: 'shell', command: 'python -m pip install -e . --no-deps' }
        ]
    }
];

const RECIPES = Object.fromEntries(RECIPE_LIST.map((recipe) => [recipe.id, recipe]));
const RECIPE_BY_REPO = new Map();
for (const recipe of RECIPE_LIST) {
    for (const repo of recipe.repos || []) {
        RECIPE_BY_REPO.set(repo.toLowerCase(), recipe);
    }
}

function shellQuote(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function unique(values = []) {
    return [...new Set(values.filter(Boolean))];
}

function getSweBenchSetupRecipe(repo = '', requested = 'auto') {
    const normalized = String(requested || 'auto').toLowerCase();
    if (normalized === 'none' || normalized === 'skip') return null;
    if (normalized !== 'auto') {
        return RECIPES[normalized] || null;
    }
    return RECIPE_BY_REPO.get(String(repo || '').toLowerCase()) || RECIPES['python-default'];
}

function listSweBenchSetupRecipes() {
    return RECIPE_LIST.map((recipe) => ({
        id: recipe.id,
        repos: [...(recipe.repos || [])],
        description: recipe.description,
        packages: unique(recipe.packages)
    }));
}

function getSweBenchWheelhousePackages({ repos = [], recipeIds = [] } = {}) {
    const selected = [];
    for (const repo of repos) {
        const recipe = getSweBenchSetupRecipe(repo, 'auto');
        if (recipe) selected.push(recipe);
    }
    for (const id of recipeIds) {
        const recipe = getSweBenchSetupRecipe('', id);
        if (recipe) selected.push(recipe);
    }
    if (!selected.length) {
        selected.push(...RECIPE_LIST.filter((recipe) => recipe.id !== 'python-default'));
    }
    return unique(selected.flatMap((recipe) => recipe.packages || []));
}

function buildPipInstallCommand(recipe, { wheelhouseDir = DEFAULT_WHEELHOUSE_DIR } = {}) {
    const packages = unique(recipe.packages || []).map(shellQuote).join(' ');
    return `python -m pip install --no-index --find-links ${shellQuote(wheelhouseDir)} ${packages}`;
}

function buildSweBenchSetupCommand(recipe, options = {}) {
    if (!recipe) return '';
    return (recipe.commands || [])
        .map((step) => {
            if (step.type === 'pipInstallWheelhouse') {
                return buildPipInstallCommand(recipe, options);
            }
            return step.command || '';
        })
        .filter(Boolean)
        .join('\n');
}

export {
    DEFAULT_WHEELHOUSE_DIR,
    getSweBenchSetupRecipe,
    listSweBenchSetupRecipes,
    getSweBenchWheelhousePackages,
    buildSweBenchSetupCommand
};
