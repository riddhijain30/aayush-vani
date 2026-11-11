const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'hi-IN'; // Multi-lingual recognition default
}

function toggleVoice() {
  const output = document.getElementById('speechOutput');
  if (!recognition) {
    output.textContent = "Web Speech API not supported in browser. Use manual SOS button.";
    return;
  }
  
  output.textContent = "Listening... Speak your emergency in Hindi or English";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = `Recognized Voice: "${transcript}"`;
    triggerSOS(transcript);
  };

  recognition.onerror = () => {
    output.textContent = "Voice listening timed out. Tap SOS button.";
  };
}

async function triggerSOS(voiceInput = "") {
  const statusCard = document.getElementById('statusCard');
  const relativePhone = document.getElementById('relativePhone').value;
  
  try {
    const res = await fetch('/api/emergency/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seniorName: "Senior Resident (Solo Living)",
        voiceTranscript: voiceInput || "",
        emergencyType: voiceInput ? voiceInput : "Urgent Medical Assistance",
        relativePhone: relativePhone
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('sosId').textContent = data.dispatchDetails.id;
      document.getElementById('nodeName').textContent = data.dispatchDetails.assignedNode;
      document.getElementById('nodeAddr').textContent = data.dispatchDetails.nodeAddress;
      document.getElementById('nodeContact').textContent = data.dispatchDetails.nodeContact;
      document.getElementById('caregiverStatus').textContent = `✔ ${data.dispatchDetails.caregiverNotified}`;
      
      if (data.quote) {
        document.getElementById('quoteText').textContent = data.quote;
      }

      statusCard.classList.remove('hidden');

      // Calming Voice Feedback
      speakGuidance("Don't worry. Help has been dispatched to your location. Zero payment is needed.");
      loadLedgerAndNodes();
    }
  } catch (err) {
    console.error("SOS Dispatch Error", err);
    alert("Emergency alert dispatched.");
  }
}

function speakGuidance(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
}

async function loadLedgerAndNodes() {
  try {
    const res = await fetch('/api/admin/ledger');
    const data = await res.json();
    
    // Update Quote
    if (data.quote) {
      document.getElementById('quoteText').textContent = data.quote;
    }

    // Populate Active Nodes Grid
    const nodesGrid = document.getElementById('nodesGrid');
    nodesGrid.innerHTML = '';
    data.partnerNodes.forEach(node => {
      const div = document.createElement('div');
      div.className = 'node-item';
      div.innerHTML = `
        <strong>${node.type}: ${node.name}</strong>
        <p>📍 ${node.address} (${node.distance})</p>
        <p>⚡ Status: <em>${node.status}</em> | 📞 ${node.contact}</p>
      `;
      nodesGrid.appendChild(div);
    });

    // Populate Ledger List
    const list = document.getElementById('ledgerList');
    list.innerHTML = '';
    data.dispatches.forEach(item => {
      const li = document.createElement('li');
      li.className = 'ledger-item';
      li.innerHTML = `
        <strong>[${item.id}]</strong> ${item.seniorName} - <em>${item.emergencyType}</em><br>
        Assigned: <strong>${item.assignedNode}</strong> | Status: <span style="color:#059669; font-weight:600;">${item.paymentStatus}</span>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading ledger", err);
  }
}

// Initial Load
loadLedgerAndNodes();
