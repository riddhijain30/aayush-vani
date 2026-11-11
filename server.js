const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Hyper-Local Node Network (Pharmacies, Hospitals, Blood Banks)
const partnerNodes = [
  { id: 1, name: "City Care Hospital", type: "Hospital", address: "Sector 14, Main Road", lat: 28.6139, lng: 77.2090, status: "Available", bedAvailable: true },
  { id: 2, name: "Apollo MedShop", type: "Pharmacy", address: "Market Complex, Gate 2", lat: 28.6150, lng: 77.2100, status: "Open 24/7", emergencyMed: true },
  { id: 3, name: "Red Cross Blood Node", type: "Blood Bank", address: "Civil Lines, Block B", lat: 28.6120, lng: 77.2050, status: "Active", stock: ["O+", "A+", "B+"] }
];

// Service-First Settle-Later Ledger DB Mock
let emergencyRequests = [];
let ngoSponsorLedger = [];

// API: Node Routing Engine (Locates Nearest Partner Node)
app.post('/api/emergency/trigger', (req, me) => {
  const { userLocation, emergencyType, voiceTranscript, seniorName } = req.body;
  
  const emergencyId = 'AV-SOS-' + Math.floor(1000 + Math.random() * 9000);
  
  // Dynamic matching based on emergency type
  let matchedNode = partnerNodes[0]; // Default fallback
  if (emergencyType && emergencyType.toLowerCase().includes('medicine')) {
    matchedNode = partnerNodes.find(n => n.type === 'Pharmacy') || partnerNodes[0];
  } else if (emergencyType && emergencyType.toLowerCase().includes('blood')) {
    matchedNode = partnerNodes.find(n => n.type === 'Blood Bank') || partnerNodes[0];
  }

  const newDispatch = {
    id: emergencyId,
    seniorName: seniorName || "Senior User (Solo-Living)",
    emergencyType: emergencyType || "General SOS Urgent Assistance",
    voiceTranscript: voiceTranscript || "SOS Emergency Button Pressed",
    assignedNode: matchedNode.name,
    nodeAddress: matchedNode.address,
    timestamp: new Date().toISOString(),
    paymentStatus: "Absorbed by NGO Sponsor Ledger (Zero Upfront Cost)",
    dispatchStatus: "Dispatched Immediately"
  };

  emergencyRequests.unshift(newDispatch);
  ngoSponsorLedger.push({
    emergencyId: emergencyId,
    amountCovered: "₹1,500 (Covered)",
    sponsorNGO: "AAYUSH Senior Care Trust",
    settledDate: "Pending Monthly NGO CSR Settlement"
  });

  return me.json({
    success: true,
    message: "Help is on the way! Zero pre-payment required.",
    dispatchDetails: newDispatch
  });
});

// API: Get Dispatch Queue & NGO Ledger
app.get('/api/admin/ledger', (req, res) => {
  res.json({
    dispatches: emergencyRequests,
    ngoLedger: ngoSponsorLedger
  });
});

app.listen(PORT, () => {
  console.log(`AAYUSH VANI Server active on http://localhost:${PORT}`);
});