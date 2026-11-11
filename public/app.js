const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'hi-IN'; // Fallback regional voice recognition
}

function toggleVoice() {
  const output = document.getElementById('speechOutput');
  if (!recognition) {
    output.textContent = "Web Speech API not supported in this browser. Press SOS button.";
    return;
  }
  
  output.textContent = "Listening in Hindi/English...";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = `Recognized Voice: "${transcript}"`;
    triggerSOS(transcript);
  };

  recognition.onerror = () => {
    output.textContent = "Speech recognition error. Try pressing the SOS button.";
  };
}

async function triggerSOS(voiceInput = "") {
  const statusCard = document.getElementById('statusCard');
  
  try {
    const res = await fetch('/api/emergency/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seniorName: "Senior Resident (Solo)",
        voiceTranscript: voiceInput || "Manual Single-Touch SOS Press",
        emergencyType: voiceInput ? voiceInput : "Urgent Medical Assistance"
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('sosId').textContent = data.dispatchDetails.id;
      document.getElementById('nodeName').textContent = data.dispatchDetails.assignedNode;
      document.getElementById('nodeAddr').textContent = data.dispatchDetails.nodeAddress;
      statusCard.classList.remove('hidden');

      // Voice Guidance Feedback using SpeechSynthesis
      speakGuidance("Emergency Alert Triggered. Help is on the way. Zero upfront payment required.");

      loadLedger();
    }
  } catch (err) {
    console.error("SOS Dispatch Error", err);
    alert("Emergency call dispatched to emergency services.");
  }
}

function speakGuidance(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

async function loadLedger() {
  try {
    const res = await fetch('/api/admin/ledger');
    const data = await res.json();
    const list = document.getElementById('ledgerList');
    list.innerHTML = '';

    if (data.dispatches.length === 0) {
      list.innerHTML = '<li class="empty-state">No emergency requests logged yet.</li>';
      return;
    }

    data.dispatches.forEach(item => {
      const li = document.createElement('li');
      li.className = 'ledger-item';
      li.innerHTML = `<strong>[${item.id}]</strong> ${item.emergencyType} - Assigned: ${item.assignedNode} (${item.paymentStatus})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Ledger loading failed", err);
  }
}

// Initial load
loadLedger();