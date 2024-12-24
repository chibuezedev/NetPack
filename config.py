import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    'API_KEYS': {
        'OPENZEPPELIN': os.getenv('OPENZEPPELIN_API_KEY'),
        'CHAINALYSIS': os.getenv('CHAINALYSIS_API_KEY'),
        'ETHERSCAN': os.getenv('ETHERSCAN_API_KEY'),
        'FORTA': os.getenv('FORTA_API_KEY'),
    },
    'ENDPOINTS': {
        'OPENZEPPELIN': 'https://api.openzeppelin.com/defender/v1/alerts',
        'CHAINALYSIS': 'https://api.chainalysis.com/api/v1/alerts',
        'CERTIK': 'https://api.certik.com/v1/alerts',
        'ETHERSCAN': 'https://api.etherscan.io/api',
        'FORTA': 'https://api.forta.network/graphql',
    },
    'RPC': {
        'ethereum': os.getenv('ETH_RPC_URL'),
        'bsc': os.getenv('BSC_RPC_URL'),
        'polygon': os.getenv('POLYGON_RPC_URL'),
    }
}