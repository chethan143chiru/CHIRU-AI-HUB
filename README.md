
# 🚀 **CHIRU AI – Multi-Agent Intelligent Dashboard**

> ⚡ One Dashboard. 14 AI Agents. Infinite Possibilities.

---

## 🧠 **Overview**

**Chiru AI** is a powerful multi-agent AI system that integrates 14 specialized AI agents into a single intelligent dashboard.

Instead of relying on a single chatbot, Chiru AI uses a **central controller** to analyze user input and dynamically route tasks to the most suitable agent(s), ensuring accurate, structured, and high-quality responses.

This system simulates real-world teamwork — where each agent acts like a domain expert.

---

## ⚙️ **Architecture**

```
User Input
   ↓
🧠 Controller Agent (Chiru AI Brain)
   ↓
🔀 Agent Selection Logic
   ↓
🤖 Specialized AI Agent(s)
   ↓
📊 Structured Output
   ↓
Dashboard UI
```

---

## 🤖 **AI Agents Included (14 Total)**

| #  | Agent Name               | Description                        |
| -- | ------------------------ | ---------------------------------- |
| 1  | Research Agent           | Topic research & summaries         |
| 2  | Email & Content Agent    | Emails, blogs, social posts        |
| 3  | Resume & Interview Agent | Resume review & interview prep     |
| 4  | Data Analyst Agent       | CSV analysis & insights            |
| 5  | Document Q&A Agent       | PDF-based question answering (RAG) |
| 6  | Coding Assistant         | Code generation & debugging        |
| 7  | Business Analyst         | Market & strategy analysis         |
| 8  | Knowledge Assistant      | Internal knowledge retrieval       |
| 9  | Task Automation Agent    | Workflow automation                |
| 10 | Web Automation Agent     | Web scraping & actions             |
| 11 | Startup Idea Generator   | Business ideas & validation        |
| 12 | Learning Assistant       | Teaching & quizzes                 |
| 13 | Customer Support Agent   | FAQ & support                      |
| 14 | Project Manager Agent    | Planning & task management         |

---

## 🔥 **Key Features**

✅ Multi-agent system (not just chatbot)
✅ Smart agent selection (auto-routing)
✅ Structured outputs (clean & readable)
✅ Modular design (easy to scale)
✅ Real-world workflow simulation
✅ Supports complex multi-step tasks

---

## 💻 **Tech Stack**

* **Frontend**: React / SwiftUI / Flutter (choose your build)
* **Backend**: Node.js / Python (FastAPI recommended)
* **AI Model**: Gemini / OpenAI GPT
* **Database**: SQLite / Firebase (optional)
* **APIs**: REST / WebSockets

---

## 🖥️ **Dashboard UI**

* Single input box (Ask anything)
* Auto agent detection
* Real-time responses
* Structured output panel

---

## 🔄 **How It Works**

1. User enters a query
2. Controller Agent analyzes intent
3. Best agent(s) selected
4. Task executed
5. Response returned in structured format

---

## 📦 **Project Structure**

```
chiru-ai/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── backend/
│   ├── controller/
│   ├── agents/
│   ├── services/
│   └── main.py / server.js
│
├── prompts/
│   ├── controller_prompt.txt
│   ├── research_agent.txt
│   ├── coding_agent.txt
│   └── ...
│
└── README.md
```

---

## 🧪 **Example Use Cases**

💡 “Explain Generative AI” → Research Agent
💻 “Fix this Python error” → Coding Agent
📊 “Analyze this CSV” → Data Analyst
📄 “Summarize this PDF” → Document Q&A
🚀 “Startup idea in AI healthcare” → Startup Agent

---

## 🛠️ **Installation & Setup**

```bash
# Clone repo
git clone https://github.com/chethan143chiru/chiru-ai.git

# Navigate
cd chiru-ai

# Install dependencies
npm install   # or pip install -r requirements.txt

# Run project
npm start     # or python main.py
```

---

## 🔑 **Environment Variables**

Create a `.env` file:

```
API_KEY=your_openai_or_gemini_key
```

---

## 📈 **Future Enhancements**

* 🔐 User authentication system
* 📊 Agent performance analytics
* 🧠 Memory-based personalization
* 🌐 Real-time web automation
* 📱 Mobile app version

---

## 🤝 **Contributing**

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📄 **License**

This project is licensed under the MIT License.

---

## 🙌 **Acknowledgment**

Inspired by modern AI multi-agent systems and real-world intelligent workflows.

---

## 👨‍💻 **Author**

**Chiru**
Engineering Student | AI Builder 🚀

---

## ⭐ **Show Your Support**

If you like this project:

👉 Star ⭐ the repo
👉 Share with friends
👉 Build your own agents

---

🔥 This README alone can carry your whole project in viva.

---

If you want next upgrade:

👉 I’ll design **GitHub UI screenshots (fake but realistic)**
👉 Add **badges (build passing, AI powered, etc.)**
👉 Create **demo video script**

Just say the word 😏

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
