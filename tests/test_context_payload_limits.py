"""Test actual relay body filtering without booting unrelated DB/auth services."""
import ast
import json
from pathlib import Path
from types import SimpleNamespace
import unittest

ROOT = Path(__file__).resolve().parents[1]


class HttpError(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code
        self.detail = detail


class ContextPayloadLimits(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        config = ast.parse((ROOT/'backend/core/config.py').read_text(encoding='utf-8'))
        settings = next(node for node in config.body if isinstance(node, ast.ClassDef) and node.name == 'Settings')
        field = next(node for node in settings.body if isinstance(node, ast.AnnAssign)
                     and isinstance(node.target, ast.Name) and node.target.id == 'AILIS_LLM_RELAY_MAX_BYTES')
        cls.limit = eval(compile(ast.Expression(field.value), '<relay-limit>', 'eval'), {'__builtins__': {}})
        module = ast.parse((ROOT/'backend/api/llm_relay.py').read_text(encoding='utf-8'))
        function = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == '_limited_payload')
        namespace = dict(json=json, HTTPException=HttpError,
                         settings=SimpleNamespace(AILIS_LLM_RELAY_MAX_BYTES=cls.limit))
        exec(compile(ast.Module(body=[function], type_ignores=[]), '<actual-relay-filter>', 'exec'), namespace)
        cls.filter = staticmethod(namespace['_limited_payload'])

    def test_defaults_and_example_match(self):
        self.assertEqual(self.limit, 16 * 1024 * 1024)
        example = (ROOT/'backend/.env.example').read_text(encoding='utf-8')
        value = next(line.split('=',1)[1] for line in example.splitlines()
                     if line.startswith('AILIS_LLM_RELAY_MAX_BYTES='))
        self.assertEqual(int(value), self.limit)

    def test_large_context_survives_without_changing_filtering(self):
        text = 'x' * (8 * 1024 * 1024)
        result = self.filter(dict(messages=[dict(role='user',content=text)],
                                 reasoning_effort='xhigh', unknown_field='not-forwarded'))
        self.assertEqual(result['messages'][0]['content'], text)
        self.assertEqual(result['model'], 'ailis-cloud')
        self.assertEqual(result['reasoning_effort'], 'xhigh')
        self.assertNotIn('unknown_field', result)

    def test_oversized_context_is_still_rejected(self):
        with self.assertRaises(HttpError) as error:
            self.filter(dict(messages=[dict(role='user',content='x' * self.limit)]))
        self.assertEqual(error.exception.status_code, 413)


if __name__ == '__main__':
    unittest.main()
