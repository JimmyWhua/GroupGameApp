# DIBS!

DIBS! is a mobile app that uses cryptography to create entertaining consumer experiences--play with friends and at parties by using DIBS! to generate random card prompts that send users into a frenzy to complete their tasks accurate as quickly as possible.

The app is built with React Native where users can create or join group games. Users can start and play games in real-time.

## Tech Stack
To ensure easy onboarding, we supported Privy. Privy allows users to join group games with emails, tie their social login to a wallet address for distribution of points (tokens), and interact with an agentic group gaming experience.

The app then feeds encrypted photo metadata (tags like "cake, candles" or anonymized location hints) into SecretLLM. Running in a secure environment, it generated prompts like "What was your favorite moment at this celebration?" without accessing unencrypted data. The participant who answers accurately, fastest, screams DIBS!

SP1 ensures data integrity and minimal disclosure, while SecretLLM generates prompts without compromising secrecy. This is essential for private locations where even metadata leaks could reveal too much.

Generative prompts make the app interactive, encouraging users to share stories alongside photos—a key feature for group experiences—while SP1’s proofs maintain security.

SP1’s fast proof generation and SecretLLM’s efficient processing ensure the app feels like a Web2 experience.

Using Succinct SP1 with Nillion’s SecretLLM creates a robust privacy layer for a photo-sharing app. SP1’s ZKPs handle the heavy lifting of proving data validity and access rights, while SecretLLM enhances the experience with smart, private prompts. This is necessary because:

Sensitivity of Private Locations: Photos from homes or restricted areas need ironclad protection. SP1’s proofs and SecretLLM’s blind computation prevent leaks that could expose users to risks like stalking or property targeting.

Group Dynamics: Trust among participants hinges on verifiable privacy. SP1’s transparency (via open-source Rust code) and SecretLLM’s secure AI build a system where users feel safe contributing.

## Consumer Friendly UI

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- **Node.js** (Recommended version: 16.x or 18.x)
- **Expo CLI** (To run the project in development mode)

To install Expo CLI globally:

```bash
# frontend
npm install -g expo-cli

npm install

npx expo start

# rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl -L https://sp1up.succinct.xyz | bash


