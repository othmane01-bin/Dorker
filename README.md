# Dorker 

**Build Google Dorks. Simplify Recon.**

Dorker is a lightweight Chrome extension designed to make Google Dorking easier and more accessible for security researchers, penetration testers, and OSINT enthusiasts.

Instead of manually remembering and combining search operators, Dorker provides an interactive toolbox where you can enter a few parameters, generate advanced Google search queries, and copy or execute them instantly.

### Features

- **Interactive Dork Builder:** Generate search queries through simple input fields.
- **Ready-to-use Generators:** Create queries for indexed documents, login pages, directory listings, and more.
- **Live Query Preview:** See your generated Google Dork before using it.
- **One-Click Copy:** Copy generated queries instantly.
- **Direct Google Search:** Execute generated queries directly in Google.
- **Dark Cybersecurity UI:** A clean, HackTools-inspired interface.
- **Modular Architecture:** Designed to make adding new generators and search capabilities straightforward.

### Installation

Dorker can currently be installed manually using Chrome's Developer Mode.

1. Clone the repository:

   ```bash
   git clone https://github.com/othmane01-bin/dorker.git
   cd dorker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Open Chrome and navigate to:

   ```text
   chrome://extensions
   ```

5. Enable **Developer mode**.
6. Click **Load unpacked**.
7. Select the generated `dist/` directory.

The Dorker extension should now appear in your Chrome extensions list.

### Usage

1. Open Dorker from the Chrome extensions menu.
2. Select a search generator.
3. Enter the required information, such as a target domain or file type.
4. Review the generated Google Dork in the query preview.
5. Click **Copy Query** to copy it or **Search Google** to execute it.

That's it. No API keys, accounts, or external services required.

### Project Goals

Dorker aims to become a practical search reconnaissance toolbox, bringing commonly used Google search operators into one convenient browser extension.

### Disclaimer

Dorker is intended for educational purposes, OSINT, and authorized security assessments. Users are responsible for ensuring that their searches and subsequent activities comply with applicable laws and the permissions granted to them.

### Connect

- **LinkedIn:** [Othmane Labiyad](https://www.linkedin.com/in/othmane-labiyad/)
- **X:** [@othmane01_](https://x.com/othmane01_)
- **Blog:** [othmane01.com](https://othmane01.com)

---
