import sys
print("Python 路径:", sys.executable)

try:
    import sqlalchemy
    print("✅ SQLAlchemy 版本:", sqlalchemy.__version__)
except ImportError:
    print("❌ SQLAlchemy 未安装")

try:
    from backend.core.config import get_settings
    settings = get_settings()
    print("✅ 配置导入成功！模型名:", settings.LLM_MODEL_NAME)
except Exception as e:
    print("❌ 导入 core/config 失败:", e)
