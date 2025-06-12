import os
import re

REQUIRED_FEATURES = {
    "anonymous_auth": r"FirebaseAuth\.instance\.signInAnonymously\(\)",
    "advice_toggle": r"Switch.*onChanged.*wantsAdvice",
    "burn_after_read": r"FirebaseDynamicLinks|Redis",
    "voice_confessions": r"flutter_voice_processor|WhisperAPI",
}

def scan_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    return {
        feature: bool(re.search(pattern, content))
        for feature, pattern in REQUIRED_FEATURES.items()
    }

print("🔍 Scanning for missing features...")
results = {}
for root, _, files in os.walk('lib'):
    for file in files:
        if file.endswith('.dart'):
            path = os.path.join(root, file)
            results.update(scan_file(path))

for feature, found in results.items():
    print(f"{'✅' if found else '❌'} {feature}")