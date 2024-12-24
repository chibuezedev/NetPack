from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from model import EnhancedSecurityAnalyzer

app = FastAPI()
analyzer = EnhancedSecurityAnalyzer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/security/analyze")
async def analyze_contract(data: dict):
    try:
        result = await analyzer.analyze_contract(
            data['contract'],
            data['chain']
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/security/threats")
async def get_threats():
    try:
        threats = await analyzer._get_threat_intelligence()
        return threats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)