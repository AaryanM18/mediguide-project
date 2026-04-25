from passlib.context import CryptContext
from database import get_db

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password):
    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_user(email, password):
    conn = get_db()

    hashed = hash_password(password)

    conn.execute(
        "INSERT INTO users (email,password) VALUES (?,?)",
        (email, hashed)
    )

    conn.commit()
    conn.close()


def authenticate_user(email, password):
    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    conn.close()

    if not user:
        return False

    if not verify_password(
        password,
        user["password"]
    ):
        return False

    return True