# Talk Wave

**Talk Wave** is a modern, real-time chat application designed to make connecting with others seamless and efficient. Built with a powerful tech stack, it offers features like real-time messaging, secure authentication, and file sharing.

---

## Features
- User authentication with secure password hashing
- Real-time messaging powered by WebSockets
- Group chats and private direct messages
- Online/offline status indicators
- File uploads with support for images and documents
- Responsive design with a clean and modern UI

---

## Technologies Used
- **State Management**: Zustand
- **Database**: MongoDB
- **Backend Framework**: Express.js
- **WebSocket**: Socket.IO
- **Styling**: TailwindCSS
- **UI Components**: Lucide-React
- **Password Hashing**: Bcrypt
- **File Uploads**: Multer

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/talk-wave.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd talk-wave
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory and include the following:
     ```
     MONGO_URI=your_mongo_db_connection_string
     JWT_SECRET=your_jwt_secret
     SOCKET_PORT=5000
     ```

5. **Start the development server:**
   ```bash
   npm start
   ```

---

## Usage
- Open the app in your browser.
- Sign up or log in with your credentials.
- Join chat rooms or start private conversations.
- Share messages and files in real time.

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on GitHub.

---

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## Acknowledgments
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide-React](https://lucide.dev/docs/lucide-react/)
- [Multer](https://github.com/expressjs/multer)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

