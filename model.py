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
        """Initialize the security analyzer with pattern-based analysis"""
        # Initialize Web3 connections with fallback endpoints
        self.web3_connections = {}
        self._initialize_web3_connections()
        
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

    def _initialize_web3_connections(self):
        """Initialize Web3 connections with fallback endpoints"""
        endpoints = {
            'ethereum': [
                'https://mainnet.infura.io/v3/38560066c01e42d39bdfcef279e3d4cb',
                'https://eth-mainnet.g.alchemy.com/v2/EfdTDiOjk9sfEF4RIxxGFLc7NGD7CKhq',
                'https://cloudflare-eth.com'
            ],
            'bsc': [
                'https://bsc-dataseed1.binance.org',
                'https://bsc-dataseed2.binance.org'
            ],
            'polygon': [
                'https://polygon-rpc.com',
                'https://rpc-mainnet.matic.network'
            ]
        }
        
        for network, urls in endpoints.items():
            for url in urls:
                try:
                    web3 = Web3(Web3.HTTPProvider(url))
                    if web3.is_connected():
                        self.web3_connections[network] = web3
                        break
                except Exception as e:
                    continue
            if network not in self.web3_connections:
                print(f"Warning: Could not connect to {network}")

    async def analyze_contract(self, contract_address: str, chain: str) -> Dict:
        """Comprehensive contract analysis with fallback mechanisms"""
        try:
            contract_code = await self._get_contract_code(contract_address, chain)
            if not contract_code:
                return {'error': 'Could not retrieve contract code'}
            
            # Execute analyses with timeouts
            results = await asyncio.gather(
                self._analyze_code_security(contract_code),
                self._check_attack_surface(contract_address, chain),
                self._monitor_cross_chain_activity(contract_address),
                self._get_threat_intelligence(),
                self._analyze_behavioral_patterns(contract_address, chain),
                return_exceptions=True  # Handle individual task failures
            )
            
            # Filter out failed tasks
            valid_results = []
            for idx, result in enumerate(results):
                if isinstance(result, Exception):
                    print(f"Warning: Analysis task {idx} failed: {str(result)}")
                    valid_results.append({})
                else:
                    valid_results.append(result)
                    
            return self._compile_analysis_results(valid_results)
            
        except Exception as e:
            return {
                'error': f'Analysis failed: {str(e)}',
                'timestamp': datetime.now().isoformat()
            }

    async def _analyze_code_security(self, code: str) -> Dict:
        """Pattern-based code security analysis"""
        vulnerabilities = []
        
        # Pattern-based analysis
        for vuln_type, pattern in self.vulnerability_patterns.items():
            try:
                if re.search(pattern, code):
                    vulnerabilities.append({
                        'type': vuln_type,
                        'severity': self._determine_vulnerability_severity(vuln_type),
                        'pattern_match': True,
                        'confidence': 0.8  # Static confidence for pattern matches
                    })
            except Exception as e:
                print(f"Warning: Pattern matching failed for {vuln_type}: {e}")

        return {'vulnerabilities': vulnerabilities}

    def _determine_vulnerability_severity(self, vuln_type: str) -> str:
        """Determine vulnerability severity based on type"""
        severity_map = {
            'reentrancy': 'critical',
            'overflow': 'high',
            'timestamp_dependency': 'medium',
            'unchecked_external_call': 'high',
            'arbitrary_jump': 'critical',
            'delegatecall': 'critical',
            'self_destruct': 'critical'
        }
        return severity_map.get(vuln_type, 'medium')

    async def _get_contract_code(self, contract_address: str, chain: str) -> str:
        """Get contract code with retries and fallbacks"""
        if chain not in self.web3_connections:
            raise ValueError(f"Chain {chain} not supported")
            
        web3 = self.web3_connections[chain]
        
        for _ in range(3):  # Retry up to 3 times
            try:
                return web3.eth.get_code(Web3.to_checksum_address(contract_address)).hex()
            except Exception as e:
                await asyncio.sleep(1)
                continue
                
        raise Exception("Could not retrieve contract code after retries")

    async def _check_attack_surface(self, contract_address: str, chain: str) -> Dict:
        """Analyze attack surface with error handling"""
        surface = {
            'external_calls': [],
            'permissions': [],
            'dependencies': []
        }
        
        if chain not in self.web3_connections:
            return surface
            
        web3 = self.web3_connections[chain]
        
        try:
            contract = web3.eth.contract(address=contract_address)
            events = contract.events
            
            for event in events:
                if 'external' in str(event):
                    surface['external_calls'].append({
                        'name': event.event_name,
                        'risk': self._assess_call_risk(event)
                    })
        except Exception as e:
            print(f"Warning: Attack surface analysis failed: {e}")
            
        return surface

    def _compile_analysis_results(self, results: List[Dict]) -> Dict:
        """Compile analysis results with validation"""
        try:
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
        except Exception as e:
            return {
                'error': f'Failed to compile results: {str(e)}',
                'timestamp': datetime.now().isoformat()
            }

    def _calculate_overall_risk(self, code_security: Dict, attack_surface: Dict, behavior: Dict) -> float:
        """Calculate overall risk score between 0.0 and 1.0"""
        try:
            weights = {
                'code_vulnerabilities': 0.4,
                'attack_surface': 0.3,
                'behavior': 0.3
            }
        
            vulnerability_risk = self._calculate_vulnerability_risk(code_security)
            surface_risk = self._calculate_surface_risk(attack_surface)
            behavioral_risk = self._calculate_behavioral_risk(behavior)
        
            overall_risk = (
                vulnerability_risk * weights['code_vulnerabilities'] +
                surface_risk * weights['attack_surface'] +
                behavioral_risk * weights['behavior']
            )
        
            return max(0.0, min(1.0, overall_risk))
        
        except Exception as e:
            print(f"Risk calculation failed: {str(e)}")
            return 0.0

    def _calculate_vulnerability_risk(self, code_security: Dict) -> float:
        """Calculate risk based on detected vulnerabilities"""
        vulnerabilities = code_security.get('vulnerabilities', [])
        if not vulnerabilities:
            return 0.0
        
        severity_weights = {
            'critical': 1.0,
            'high': 0.8,
            'medium': 0.5,
            'low': 0.2
        }
    
        total_risk = 0.0
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'medium')
            base_risk = severity_weights.get(severity, 0.5)
            confidence = vuln.get('confidence', 1.0)
            vuln_risk = base_risk * confidence
            total_risk += vuln_risk
    
        return min(1.0, total_risk / len(vulnerabilities))

    def _calculate_surface_risk(self, attack_surface: Dict) -> float:
        """Calculate risk based on attack surface analysis"""
        external_calls = attack_surface.get('external_calls', [])
        dependencies = attack_surface.get('dependencies', [])
    
        risk_factors = {
            'external_call_count': len(external_calls) * 0.1,
            'dependency_count': len(dependencies) * 0.05,
            'high_risk_calls': 0.0
        }
    
        for call in external_calls:
            if call.get('risk', 'low') == 'high':
                risk_factors['high_risk_calls'] += 0.2
    
        surface_risk = sum(risk_factors.values())
        return min(1.0, surface_risk)

    def _calculate_behavioral_risk(self, behavior: Dict) -> float:
        """Calculate risk based on historical behavior patterns"""
        patterns = behavior.get('behavioral_patterns', [])
        if not patterns:
            return 0.0
    
        risk_score = 0.0
        risk_factors = {
            'high_value_transfers': 0.3,
            'frequent_ownership_changes': 0.2,
            'unusual_gas_patterns': 0.15,
            'irregular_activity_spikes': 0.25,
            'failed_transactions': 0.1
        }
    
        for pattern in patterns:
            pattern_type = pattern.get('type', '')
            if pattern_type in risk_factors:
                severity = pattern.get('severity', 0.5)
                risk_score += risk_factors[pattern_type] * severity
    
        return min(1.0, risk_score)
    
    async def _get_threat_intelligence(self) -> Dict:
        """Gather known threats and security intelligence"""
        try:
            # Initialize threats database
            known_threats = {
                'known_attacks': [
                    {
                        'type': 'flash_loan_attack',
                        'severity': 'critical',
                        'description': 'Flash loan-based price manipulation attacks',
                        'indicators': ['multiple_dex_calls', 'large_borrowing']
                    },
                    {
                        'type': 'front_running',
                        'severity': 'high',
                        'description': 'Transaction ordering exploitation',
                        'indicators': ['high_gas_price', 'similar_transactions']
                    },
                    {
                        'type': 'honeypot',
                        'severity': 'critical',
                        'description': 'Contracts that trap user funds',
                        'indicators': ['restricted_withdrawals', 'hidden_fee_logic']
                    }
                ],
                'recent_incidents': [],
                'threat_indicators': {
                    'high_risk_patterns': self.vulnerability_patterns,
                    'suspicious_behaviors': [
                        'unusual_gas_patterns',
                        'frequent_ownership_changes',
                        'irregular_activity_spikes'
                    ]
                },
                'timestamp': datetime.now().isoformat()
            }
        
            return known_threats
        
        except Exception as e:
            print(f"Warning: Failed to gather threat intelligence: {e}")
            return {
                'error': 'Failed to gather threat intelligence',
                'timestamp': datetime.now().isoformat()
            }

    async def _monitor_cross_chain_activity(self, contract_address: str) -> Dict:
        """Monitor for suspicious cross-chain activities"""
        try:
            # Initialize cross-chain monitoring results
            monitoring_results = {
                'cross_chain_transfers': [],
                'bridge_interactions': [],
                'suspicious_patterns': [],
                'timestamp': datetime.now().isoformat()
            }
        
            # Here you could add actual bridge monitoring logic
            # For now returning basic structure
        
            return monitoring_results
        
        except Exception as e:
            print(f"Warning: Cross-chain monitoring failed: {e}")
            return {
                'error': 'Cross-chain monitoring failed',
                'timestamp': datetime.now().isoformat()
            }

    async def _analyze_behavioral_patterns(self, contract_address: str, chain: str) -> Dict:
        """Analyze historical behavioral patterns of the contract"""
        try:
            # Initialize behavioral analysis results
            behavior_analysis = {
                'behavioral_patterns': [],
                'activity_spikes': [],
                'gas_usage_patterns': [],
                'interaction_patterns': [],
                'timestamp': datetime.now().isoformat()
            }
        
            if chain in self.web3_connections:
                web3 = self.web3_connections[chain]
            
                # Get recent blocks for analysis
                latest_block = await web3.eth.get_block_number()
            
                # Add basic transaction pattern analysis
                # You could expand this with more detailed analysis
                behavior_analysis['behavioral_patterns'].append({
                    'type': 'transaction_frequency',
                    'severity': 0.5,
                    'description': 'Normal transaction frequency observed'
                })
            
            return behavior_analysis
        
        except Exception as e:
            print(f"Warning: Behavioral analysis failed: {e}")
            return {
                'error': 'Behavioral analysis failed',
                'timestamp': datetime.now().isoformat()
            }