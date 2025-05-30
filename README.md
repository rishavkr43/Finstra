# Finstra - Financial Empowerment for Rural Communities

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://finstra.vercel.app/)

## Overview

Finstra is a comprehensive financial advisory platform designed specifically for rural communities, particularly farmers. It combines modern technology with simplified financial guidance to make financial services more accessible and understandable.

## Features

### 1. Multilingual Voice Assistant
- Voice-based interaction in multiple Indian languages
- Supported languages:
  - English
  - Hindi (हिंदी)
  - Bengali (বাংলা)
  - Tamil (தமிழ்)
  - Telugu (తెలుగు)
  - Kannada (ಕನ್ನಡ)
  - Gujarati (ગુજરાતી)
  - Malayalam (മലയാളം)
  - Marathi (मराठी)

### 2. Financial Topics Coverage
- Kissan Credit Card (KCC) guidance
- Interest rate explanations
- Crop Insurance (PMFBY) details
- Loan vs Grant comparisons
- Financial scam prevention
- Government schemes information

### 3. Interactive Features
- Text-based chatbot
- Voice-based interactions
- Language selection options
- Real-time responses
- Contextual suggestions

### 4. Security Features
- Scam detection and alerts
- Safe banking practices guidance
- Fraud prevention tips

## Technology Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Web Speech API for voice interactions

### Backend
- Python
- Flask
- Google Gemini AI
- SerpAPI for real-time data

### Deployment
- Frontend: Vercel
- Backend: Railway

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finstra.git
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:

Frontend (.env):
```
NEXT_PUBLIC_API_URL=your_backend_url
```

Backend (.env):
```
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_API_KEY=your_serpapi_key
PORT=5000
```

5. Run the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
python app.py
```

## Requirements

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  }
}
```

### Backend Dependencies
```
flask==3.0.0
flask-cors==4.0.0
google-generativeai==0.3.0
python-dotenv==1.0.0
serpapi==0.1.0
```

## Usage

1. Visit the landing page
2. Select your preferred language
3. Choose between text chat or voice interaction
4. Ask questions about:
   - Financial schemes
   - Banking procedures
   - Government programs
   - Fraud prevention
   - Investment advice

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for natural language processing
- SerpAPI for real-time data fetching
- Web Speech API for voice interactions
- All contributors and supporters of the project

## Contact

Project Link: [https://finstra.vercel.app/](https://finstra.vercel.app/)

---

Made with a great zeal for Rural Financial Empowerment.