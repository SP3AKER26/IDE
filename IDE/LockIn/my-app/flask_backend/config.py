import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://criticheck_admin_ide:super123@localhost:5432/criticheck_ide_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
