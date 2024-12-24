import torch
from transformers import BertForSequenceClassification, BertTokenizer, AutoModelForSequenceClassification
from typing import Dict, List, Union
import numpy as np
from web3 import Web3
import httpx
import asyncio
from datetime import datetime
import re
from config import CONFIG

class EnhancedSecurityAnalyzer:
    def __init__(self):
        self.bert_model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.bert_model.to(self.device)
        
        self.models = {
            'bert': self.bert_model,
            'code_bert': AutoModelForSequenceClassification.from_pretrained('microsoft/codebert-base'),
            'security_bert': AutoModelForSequenceClassification.from_pretrained('security-bert-base')
        }
        
        self.web3_connections = {
            'ethereum': Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/38560066c01e42d39bdfcef279e3d4cb')),
            'bsc': Web3(Web3.HTTPProvider('https://bsc-dataseed1.binance.org')),
            'polygon': Web3(Web3.HTTPProvider('https://polygon-rpc.com'))
        }
        
        # vulnerability patterns
        self.vulnerability_patterns = {
            'reentrancy': r'(\.\bcall\b.*?{.*?[\w\.]+\.transfer\()',
            'overflow': r'(\+|\-|\*|\/(?!/))(?![^{]*})(?![^\[]*\])',
            'timestamp_dependency': r'\b(block\.(timestamp|number)|now)\b',
            'unchecked_external_call': r'\.call\{.*?\}',
            'arbitrary_jump': r'\bassembly\b.*?\bjump\b',
            'delegatecall': r'\.delegatecall\(',
            'self_destruct': r'\bselfdestruct\b|\bsuicide\b'
        }

    async def analyze_contract(self, 
                             contract_address: str, 
                             chain: str) -> Dict:
        """Comprehensive contract analysis"""
        contract_code = await self._get_contract_code(contract_address, chain)
        
        # parallel analysis
        results = await asyncio.gather(
            self._analyze_code_security(contract_code),
            self._check_attack_surface(contract_address, chain),
            self._monitor_cross_chain_activity(contract_address),
            self._get_threat_intelligence(),
            self._analyze_behavioral_patterns(contract_address, chain)
        )
        
        return self._compile_analysis_results(results)

    async def _analyze_code_security(self, code: str) -> Dict:
        """Enhanced code security analysis"""
        vulnerabilities = []
        
        # BERT ensemble model prediction
        for name, model in self.models.items():
            inputs = self.tokenizer(code, 
                                  return_tensors="pt",
                                  truncation=True,
                                  max_length=512).to(self.device)
            
            with torch.no_grad():
                outputs = model(**inputs)
                predictions = torch.softmax(outputs.logits, dim=1)
                
                if predictions[0][1] > 0.7:
                    vulnerabilities.append({
                        'model': name,
                        'confidence': float(predictions[0][1]),
                        'type': 'potential_vulnerability'
                    })

        # Pattern-based analysis
        for vuln_type, pattern in self.vulnerability_patterns.items():
            if re.search(pattern, code):
                vulnerabilities.append({
                    'type': vuln_type,
                    'severity': 'high',
                    'pattern_match': True
                })

        return {'vulnerabilities': vulnerabilities}

    async def _check_attack_surface(self, 
                                  contract_address: str, 
                                  chain: str) -> Dict:
        """Map attack surface and dependencies"""
        surface = {
            'external_calls': [],
            'permissions': [],
            'dependencies': []
        }
        
        web3 = self.web3_connections[chain]
        
        # Analyze external calls
        contract = web3.eth.contract(address=contract_address)
        events = contract.events
        
        for event in events:
            if 'external' in str(event):
                surface['external_calls'].append({
                    'name': event.event_name,
                    'risk': self._assess_call_risk(event)
                })
                
        return surface

    async def _monitor_cross_chain_activity(self, 
                                          contract_address: str) -> Dict:
        """Monitor cross-chain activities"""
        activities = []
        
        for chain, web3 in self.web3_connections.items():
            # Check for bridge interactions
            bridge_interactions = await self._check_bridge_interactions(
                contract_address, web3
            )
            
            if bridge_interactions:
                activities.append({
                    'chain': chain,
                    'type': 'bridge_interaction',
                    'details': bridge_interactions
                })
                
        return {'cross_chain_activities': activities}

    async def _get_threat_intelligence(self) -> Dict:
        """Fetch threat intelligence from multiple sources"""
        async with httpx.AsyncClient() as session:
            threat_feeds = await asyncio.gather(
                self._fetch_chainalysis_threats(session),
                self._fetch_openzeppelin_threats(session)
            )
        
        return {'threats': [threat for feed in threat_feeds for threat in feed]}


    async def _analyze_behavioral_patterns(self, 
                                        contract_address: str,
                                        chain: str) -> Dict:
        """Analyze contract behavioral patterns"""
        web3 = self.web3_connections[chain]
        
        # Get historical transactions
        transactions = await self._get_historical_transactions(
            contract_address, web3
        )
        
        # Analyze patterns
        patterns = self._identify_behavioral_patterns(transactions)
        
        return {
            'behavioral_patterns': patterns,
            'risk_score': self._calculate_behavior_risk(patterns)
        }

    def _compile_analysis_results(self, results: List[Dict]) -> Dict:
        """Compile all analysis results"""
        [code_security, attack_surface, cross_chain, threats, behavior] = results
        
        risk_score = self._calculate_overall_risk(
            code_security, attack_surface, behavior
        )
        
        return {
            'risk_score': risk_score,
            'code_security': code_security,
            'attack_surface': attack_surface,
            'cross_chain_activity': cross_chain,
            'threats': threats,
            'behavioral_analysis': behavior,
            'timestamp': datetime.now().isoformat()
        }

    def get_patch_recommendations(self, vulnerabilities: List[Dict]) -> Dict:
        """Generate smart contract patch recommendations"""
        patches = []
        
        for vuln in vulnerabilities:
            if vuln['type'] in self.vulnerability_patterns:
                patches.append({
                    'vulnerability': vuln['type'],
                    'patch_template': self._get_patch_template(vuln['type']),
                    'severity': vuln['severity']
                })
                
        return {'recommended_patches': patches}


    async def _fetch_security_threats(self, session: httpx.AsyncClient) -> List:
        # etherscan for contract verification and alerts
        etherscan_params = {
            'module': 'contract',
            'action': 'getabi',
            'address': self.contract_address,
            'apikey': CONFIG['API_KEYS']['ETHERSCAN']
    }
    
        async with session.get(CONFIG['ENDPOINTS']['ETHERSCAN'], params=etherscan_params) as response:
            etherscan_data = await response.json()

        # ForTA for real-time threat detection
        forta_query = """
        query getAlerts($input: AlertsInput) {
            alerts(input: $input) {
                alerts {
                    name
                    description
                    severity
                    protocol
                    findingType
                }
            }
        }
        """
    
        headers = {'Authorization': f'Bearer {CONFIG["API_KEYS"]["FORTA"]}'}
        async with session.post(CONFIG['ENDPOINTS']['FORTA'], json={'query': forta_query}, headers=headers) as response:
            forta_data = await response.json()

        return {
            'etherscan': etherscan_data,
            'forta': forta_data
        }

    async def _fetch_openzeppelin_threats(self, session: httpx.AsyncClient) -> List:
        """Fetch OpenZeppelin threat feed"""
        headers = {'Authorization': f'Bearer {CONFIG["API_KEYS"]["OPENZEPPELIN"]}'}
        async with session.get(CONFIG['ENDPOINTS']['OPENZEPPELIN'], headers=headers) as response:
            return await response.json()


    def _get_patch_template(self, vulnerability_type: str) -> str:
        """Get patch template for vulnerability"""
        templates = {
            'reentrancy': 'ReentrancyGuard',
            'overflow': 'SafeMath',
            'unchecked_external_call': 'Address',
            'timestamp_dependency': 'Pausable'
        }
        return templates.get(vulnerability_type, 'Custom')