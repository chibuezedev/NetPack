import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alertComponent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Shield, AlertTriangle, Network, Activity, Lock } from "lucide-react";

const SecurityAnalyzer = () => {
  const [contract, setContract] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realtimeData, setRealtimeData] = useState([]);
  const [communityScore, setCommunityScore] = useState(0);

  // API endpoints
  const API_ENDPOINTS = {
    analyze: "http://localhost:8000/api/security/analyze",
    realtime: "http://localhost:8000/api/security/realtime",
    community: "http://localhost:8000/api/security/community",
    threatFeed: "http://localhost:8000/api/security/threats",
  };

  // Fetch real-time analysis
  const fetchAnalysis = async () => {
    try {
      console.log("Data", { contract, chain });
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.analyze}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, chain }),
      });
      const data = await response.json();
      setAnalysis(data || { attackSurface: [], threats: [] }); // Provide default empty arrays
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({ attackSurface: [], threats: [] }); // Set default state on error
    } finally {
      setLoading(false);
    }
  };

  // Real-time monitoring
  useEffect(() => {
    if (!contract) return;

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRealtimeData((prev) => [...prev, data].slice(-20));
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [contract]);

  const renderAttackSurfaceMap = () => {
    if (!analysis?.attackSurface?.length) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-6 h-6" />
            Attack Surface Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.attackSurface.map((vulnerability, index) => (
              <Alert
                key={index}
                className={`bg-${vulnerability.risk}-100 border-${vulnerability.risk}-200`}
              >
                <Lock className="w-4 h-4" />
                <AlertDescription>
                  <div className="font-medium">{vulnerability.type}</div>
                  <div className="text-sm">
                    Risk Level: {vulnerability.risk}
                  </div>
                  <div className="text-sm">Impact: {vulnerability.impact}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRealtimeMonitoring = () => {
    if (!realtimeData.length) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Real-time Activity Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={600} height={200} data={realtimeData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="anomalyScore" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Advanced Web3 Security Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Contract Input */}
            <div className="flex gap-4">
              <select
                className="p-2 border rounded-md w-48"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
              >
                <option value="ethereum">Ethereum</option>
                <option value="bsc">BSC</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
              <input
                type="text"
                placeholder="Enter contract address"
                className="flex-1 p-2 border rounded-md"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
              <button
                onClick={fetchAnalysis}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <>
                {renderAttackSurfaceMap()}
                {renderRealtimeMonitoring()}

                {/* Threat Intelligence Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Threat Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.threats?.map((threat, index) => (
                        <Alert key={index} className="bg-red-50">
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            <div className="font-medium">{threat.title}</div>
                            <div className="text-sm">{threat.description}</div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Community Security Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center">
                      {communityScore}/100
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAnalyzer;
