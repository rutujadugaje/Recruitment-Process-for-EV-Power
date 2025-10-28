import bcrypt

# Generate fresh hash
password = "root@123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
hashed_str = hashed.decode('utf-8')

print(f"Password: {password}")
print(f"Fresh Hash: {hashed_str}")
print(f"Hash Length: {len(hashed_str)}")

# Verify it works
is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed)
print(f"Verification: {is_valid}")