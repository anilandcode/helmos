import hashlib
import math


class EmbeddingService:
    DIM = 1536

    def generate(self, text: str) -> list[float]:
        seed = int(hashlib.sha256(text.encode()).hexdigest()[:16], 16)
        vec = []
        state = seed
        for i in range(self.DIM):
            state = (state * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
            val = ((state >> 32) & 0xFFFF) / 65535.0
            vec.append(val * 2.0 - 1.0)
        return self._normalize(vec)

    def _normalize(self, vector: list[float]) -> list[float]:
        norm = math.sqrt(sum(v * v for v in vector))
        if norm == 0:
            return vector
        return [v / norm for v in vector]

    def normalize(self, vector: list[float]) -> list[float]:
        return self._normalize(vector)
