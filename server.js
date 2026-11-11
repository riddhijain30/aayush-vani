const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Expanded Hyper-Local Emergency Network Nodes
const partnerNodes = [
  { id: 1, name: "City Care Super Speciality Hospital", type: "Hospital", address: "Sector 14, Main Road, New Delhi", distance: "0.8 km", status: "ICU & Beds Ready", contact: "+91 11 2345 6789" },
  { id: 2, name: "Apollo MedShop & 24/7 Pharmacy", type: "Pharmacy", address: "Market Complex, Gate 2, New Delhi", distance: "0.3 km", status: "Delivery Boy Ready", contact: "+91 11 9876 5432" },
  { id: 3, name: "Red Cross Emergency Blood Bank", type: "Blood Bank", address: "Civil Lines, Block B, New Delhi", distance: "1.2 km", status: "O+, A+, B+ Available", contact: "+91 11 4321 8765" },
  { id: 4, name: "AAYUSH Rapid Response Ambulance", type: "Ambulance", address: "Nearest Stand - Central Square", distance: "0.5 km", status: "Dispatched", contact: "+91 11 102 999" },
  { id: 5, name: "Seva Senior Helper Care Center", type: "Volunteer / Caregiver", address: "Community Center, Sector 12", distance: "0.4 km", status: "Helper On Duty", contact: "+91 98110 00000" }
];

// Expanded Comforting Quotes Database
const seniorQuotes = [
  "“You are never alone. Help is just a single touch away.”",
  "“Your peace of mind and well-being are our highest priority.”",
  "“Care first, settle later — because your health comes first.”",
  "“Rest easy. Assistance and caregivers are always nearby.”"
];

// In-Memory Database for Active Dispatches and NGO Ledger
let emergencyRequests = [
  {
    id: "AV-SOS-9102",
    seniorName: "Kamla Devi (Age 72)",
    emergencyType: "Urgent Cardiac Checkup & Ambulance",
    assignedNode: "City Care Super Speciality Hospital",
    nodeAddress: "Sector 14, Main Road, New Delhi",
    timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
    paymentStatus: "Covered by Helpage Care CSR Fund",
    caregiverNotified: "Son (Rahul Devi) Notified via SMS"
  }
];

let ngoSponsorLedger = [
  { emergencyId: "AV-SOS-9102", amountCovered: "₹2,500 (Covered)", sponsorNGO: "Helpage Care CSR Ledger", status: "Settled" }
];

// API: Dynamic Emergency Routing Engine
app.post('/api/emergency/trigger', (req, res) => {
  const { emergencyType, voiceTranscript, seniorName, relativePhone } = req.body;
  const emergencyId = 'AV-SOS-' + Math.floor(1000 + Math.random() * 9000);
  
  let textMatch = (emergencyType + " " + voiceTranscript).toLowerCase();
  let matchedNode = partnerNodes[0];

  if (textMatch.includes('medicine') || textMatch.includes('pharmacy') || textMatch.includes('dawa')) {
    matchedNode = partnerNodes.find(n => n.type === 'Pharmacy') || partnerNodes[1];
  } else if (textMatch.includes('blood') || textMatch.includes('khoon')) {
    matchedNode = partnerNodes.find(n => n.type === 'Blood Bank') || partnerNodes[2];
  } else if (textMatch.includes('helper') || textMatch.includes('caregiver')) {
    matchedNode = partnerNodes.find(n => n.type === 'Volunteer / Caregiver') || partnerNodes[4];
  } else if (textMatch.includes('ambulance')) {
    matchedNode = partnerNodes.find(n => n.type === 'Ambulance') || partnerNodes[3];
  }

  const newDispatch = {
    id: emergencyId,
    seniorName: seniorName || "Senior Resident",
    emergencyType: voiceTranscript ? `Voice Alert: "${voiceTranscript}"` : emergencyType || "General SOS Medical Alert",
    assignedNode: matchedNode.name,
    nodeAddress: `${matchedNode.address} (${matchedNode.distance} away)`,
    nodeContact: matchedNode.contact,
    timestamp: new Date().toLocaleTimeString(),
    paymentStatus: "Absorbed by NGO Partner Network (₹0 Upfront)",
    caregiverNotified: relativePhone ? `SMS Sent to Caregiver (${relativePhone})` : "Primary Caregiver Alerted"
  };

  emergencyRequests.unshift(newDispatch);
  ngoSponsorLedger.unshift({
    emergencyId: emergencyId,
    amountCovered: "₹1,800 (Fully Sponsored)",
    sponsorNGO: "AAYUSH Senior Welfare Trust",
    status: "Service First, Settling Post-Triage"
  });

  res.json({
    success: true,
    message: "Emergency Assistance Dispatched!",
    dispatchDetails: newDispatch,
    quote: seniorQuotes[Math.floor(Math.random() * seniorQuotes.length)]
  });
});

// API: Fetch Node Network & Admin Ledger
app.get('/api/admin/ledger', (req, res) => {
  res.json({
    partnerNodes: partnerNodes,
    dispatches: emergencyRequests,
    ngoLedger: ngoSponsorLedger,
    quote: seniorQuotes[Math.floor(Math.random() * seniorQuotes.length)]
  });
});

app.listen(PORT, () => {
  console.log(`AAYUSH VANI Enhanced Server listening at http://localhost:${PORT}`);
});
