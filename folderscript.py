import os

folders = [
    "docs/user-guides",
    "ui/mobile-app/android",
    "ui/mobile-app/ios",
    "ui/web-portal/frontend",
    "ui/web-portal/backend",
    "ui/sms-interface/sms-gateway",
    "ui/voice-assistant/nlp-interface",
    "ui/voice-assistant/offline-tts-stt",
    "ai-core/symptom-nlp/models",
    "ai-core/symptom-nlp/pipeline",
    "ai-core/image-analysis/models",
    "ai-core/image-analysis/preprocessing",
    "ai-core/fusion-engine/ensemble-models",
    "ai-core/first-aid-guidance/rules-engine",
    "ai-core/first-aid-guidance/response-generator",
    "data-layer/edge-computing/local-inference",
    "data-layer/cloud-sync/firebase",
    "data-layer/offline-db/sqlite",
    "data-layer/feedback-system/api",
    "scripts/setup",
    "scripts/deploy",
    "scripts/test",
    "config/env",
    "config/logging",
    "config/permissions",
    "tests/unit",
    "tests/integration",
    "tests/e2e"
]

base_path = "AI-Disease-Diagnosis-App"

for folder in folders:
    os.makedirs(os.path.join(base_path, folder), exist_ok=True)

with open(os.path.join(base_path, "README.md"), "w") as f:
    f.write("# AI-Driven Multimodal Disease Diagnosis & First Aid Support System\n")
