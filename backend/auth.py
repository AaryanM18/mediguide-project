from passlib.context import CryptContext
from fastapi import HTTPException
from database import get_db


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    password = str(password).strip()[:72]
    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_user(user_id, email, password):
    conn = get_db()

    # check if user_id already exists
    existing_user = conn.execute(
        "SELECT * FROM users WHERE id=?",
        (user_id,)
    ).fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="User ID already taken"
        )

    # check if email already exists
    existing_email = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    if existing_email:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed = hash_password(password)

    conn.execute(
        "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
        (user_id, email, hashed)
    )

    conn.commit()
    conn.close()

    return user_id


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