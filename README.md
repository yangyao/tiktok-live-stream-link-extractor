# TikTok Live Stream Link Extractor

**TikTok Live Stream Link Extractor** is a lightweight and efficient tool designed to extract m3u8 stream URLs from TikTok live streams. This enables users to programmatically retrieve the raw video stream links for further processing or playback.

## 🚀 Features

- **Stream URL Extraction**: Easily fetch m3u8 URLs for TikTok live streams.  
- **High Performance**: Designed to handle requests efficiently.  
- **Extensible**: A solid base for integrating with other tools or services.  

## 🛠️ Installation

Clone the repository:  
```bash
git clone https://github.com/yangyao/tiktok-live-stream-link-extractor.git
cd tiktok-live-stream-link-extractor
```

Install dependencies:  
```
pnpm install
```

Update the code with the username
```
vim  index.mjs
```

## 💡 Usage

Run the tool with a TikTok live stream URL:  
```bash
node index.mjs
```

Example output:  
```text
m3u8 URL: https://pull-w5-sg01.tiktokcdn.com/game/stream-7450354181854055189.flv?expire=1735910037&session_id=173-202412201313562428
```

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/yangyao/tiktok-live-stream-link-extractor/issues).

---

> **Disclaimer**: This tool is intended for educational and personal use only. Please respect the terms of service of TikTok and ensure you have the right to use the data retrieved by this tool.