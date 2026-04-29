from passlib.context import CryptContext
from fastapi import HTTPException
from database import get_db


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def normalize_password(password):
    return str(password).strip()[:72]


def hash_password(password: str):
    return pwd_context.hash(
        normalize_password(password)
    )


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        normalize_password(plain_password),
        hashed_password
    )


def create_user(user_id, email, password):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE id=%s",
        (user_id,)
    )
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="User ID already taken"
        )

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )
    existing_email = cursor.fetchone()

    if existing_email:
        cursor.close()
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed = hash_password(password)

    cursor.execute(
        "INSERT INTO users (id, email, password) VALUES (%s, %s, %s)",
        (user_id, email, hashed)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return user_id


def authenticate_user(email, password):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return False

    stored_password = user[2]

    if not verify_password(
        password,
        stored_password
    ):
        return False

    return True