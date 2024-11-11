/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  AlertCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alertComponent";

const CryptoDashboard = () => {
  const [tokens, setTokens] = useState({});
  const [selectedToken, setSelectedToken] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [alerts, setAlerts] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [tokenMetadata, setTokenMetadata] = useState({});

  // Fetch metadata from IPFS
  const fetchMetadata = useCallback(async (uri) => {
    try {
      const response = await fetch(uri);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  }, []);

  // WebSocket connection and message handling
  useEffect(() => {
    console.log("Attempting to connect to WebSocket...");
    const ws = new WebSocket("wss://pumpportal.fun/api/data");

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setWsStatus("connected");
      setAlerts((prev) => [
        {
          type: "success",
          message: "WebSocket connected successfully",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);

      const subscriptions = [
        { method: "subscribeNewToken" },
        {
          method: "subscribeAccountTrade",
          keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"],
        },
        {
          method: "subscribeTokenTrade",
          keys: ["91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p"],
        },
      ];

      subscriptions.forEach((sub) => ws.send(JSON.stringify(sub)));
    };

    ws.onclose = () => {
      setWsStatus("disconnected");
      setAlerts((prev) => [
        {
          type: "error",
          message: "WebSocket connection closed",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setAlerts((prev) => [
        {
          type: "error",
          message: "WebSocket error occurred",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        handleMessage(data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    return () => ws.close();
  }, []);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback(
    async (message) => {
      if (message.txType === "create") {
        console.log("New token detected:", message.symbol);

        // Fetch metadata if URI is provided
        let metadata = null;
        if (message.uri) {
          metadata = await fetchMetadata(message.uri);
          if (metadata) {
            setTokenMetadata((prev) => ({
              ...prev,
              [message.mint]: metadata,
            }));
          }
        }

        setTokens((prev) => ({
          ...prev,
          [message.mint]: {
            symbol: metadata?.symbol || message.symbol,
            name: metadata?.name || message.name,
            price: 0,
            volume: 0,
            trades: 0,
            lastUpdate: new Date().toISOString(),
            marketCapSol: message.marketCapSol || 0,
            initialBuy: message.initialBuy || 0,
            vSolInBondingCurve: message.vSolInBondingCurve || 0,
          },
        }));

        setAlerts((prev) =>
          [
            {
              type: "info",
              message: `New token detected: ${
                metadata?.name || message.symbol
              }`,
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 5)
        );
      }

      if (message.type === "trade") {
        setTokens((prev) => {
          const token = prev[message.token] || {
            symbol: message.symbol || "UNKNOWN",
            trades: 0,
            volume: 0,
          };

          return {
            ...prev,
            [message.token]: {
              ...token,
              price: message.price,
              volume: token.volume + parseFloat(message.volume || 0),
              trades: token.trades + 1,
              lastUpdate: new Date().toISOString(),
            },
          };
        });

        if (message.token === selectedToken) {
          setPriceHistory((prev) =>
            [
              ...prev,
              {
                timestamp: new Date().toISOString(),
                price: message.marketCapSol,
                volume: message.volume,
              },
            ].slice(-50)
          );
        }
      }
    },
    [selectedToken, fetchMetadata]
  );

  // Debug section component
  const DebugSection = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Token Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>WebSocket Status:</strong> {wsStatus}
          </div>
          <div>
            <strong>Last Message:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(lastMessage, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TokenCard = ({ address, token, metadata }) => (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 
        transition-colors duration-200 ease-in-out
        flex justify-between items-center gap-4
        ${selectedToken === address ? 'bg-gray-100 border-blue-500' : ''}"
      onClick={() => setSelectedToken(address)}
    >
      <div className="flex items-center gap-4">
        {metadata?.url ? (
          <img
            src={metadata.url.image}
            alt={metadata.name}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div>
          <div className="font-bold">{token.name || token.symbol}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {address}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          $
          {!isNaN(token.vSolInBondingCurve) &&
          !isNaN(token.vTokensInBondingCurve) &&
          token.vTokensInBondingCurve !== 0
            ? (token.vSolInBondingCurve / token.vTokensInBondingCurve).toFixed(
                8
              )
            : "0.00000000"}
        </div>
        <div className="text-sm text-gray-500">
          MCap: {(token.marketCapSol || 0).toFixed(2)} SOL
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`font-bold ${
                wsStatus === "connected" ? "text-green-500" : "text-red-500"
              }`}
            >
              {wsStatus.toUpperCase()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Active Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(tokens).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(tokens)
                .reduce((acc, t) => acc + (t.marketCapSol || 0), 0)
                .toFixed(2)}{" "}
              SOL
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(tokens).reduce(
                (acc, t) => acc + (t.trades || 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(tokens).length > 0 ? (
              Object.entries(tokens).map(([address, token]) => (
                <TokenCard
                  key={address}
                  address={address}
                  token={token}
                  metadata={tokenMetadata[address]}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No tokens available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <DebugSection />
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {priceHistory.length > 0 ? (
              <LineChart width={800} height={240} data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  name="Price (SOL)"
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#82ca9d"
                  name="Volume"
                />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a token to view price history
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <Alert
            key={i}
            variant={alert.type === "error" ? "destructive" : "default"}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {alert.message}
              <span className="text-sm text-gray-500 ml-2">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default CryptoDashboard;
