# Contributing to Guessync 🎵

Welcome to Guessync! We're excited that you want to contribute to our real-time multiplayer music guessing game. Your contributions help make this project better for everyone! ⭐

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- A GitHub account

### Fork and Clone
1. **Fork** this repository to your GitHub account
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Guessync.git
   cd Guessync
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/yep-yogesh/Guessync.git
   ```

### Local Setup
1. **Install dependencies** for both client and server:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Set up environment files**:
   ```bash
   # Copy example files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Configure your .env files** with the required API keys:
   - **Server (.env)**: MongoDB URI, Firebase service account, Spotify API, YouTube API, Gemini API
   - **Client (.env)**: Firebase configuration
   
   See the [README.md](./README.md) for detailed setup instructions.

4. **Run the application**:
   ```bash
   # Terminal 1 - Backend (http://localhost:5000)
   cd server && npm run dev
   
   # Terminal 2 - Frontend (http://localhost:5173)
   cd client && npm run dev
   ```

## 🛠️ Development Workflow

### Creating a Branch
```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### Making Changes
1. Make your changes following our coding standards
2. Test your changes locally
3. Commit with clear, descriptive messages

### Submitting a Pull Request
1. **Push** your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Create a Pull Request** on GitHub
3. Fill out the PR template with:
   - Clear description of changes
   - Screenshots/GIFs if UI changes
   - Link to related issues

## 📋 Contribution Guidelines

### Issues
- **Search existing issues** before creating new ones
- Use clear, descriptive titles
- Provide detailed descriptions with steps to reproduce bugs
- Label appropriately (bug, enhancement, documentation, etc.)

### Pull Requests
- **One feature per PR** - keep changes focused
- **Reference related issues** using keywords (fixes #123)
- **Include tests** if applicable
- **Update documentation** if needed
- Ensure your PR passes all checks

### Code Review Process
- All PRs require review before merging
- Address feedback promptly
- Keep discussions respectful and constructive

## 🎨 Coding Standards

### Frontend (React + Tailwind CSS)
- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling (avoid custom CSS when possible)
- Keep components **small and focused**
- Use **descriptive variable names**

### Backend (Node.js + Express)
- Follow **RESTful API conventions**
- Use **async/await** for asynchronous operations
- Implement proper **error handling**
- Add **input validation**
- Use **meaningful function names**

### Database (MongoDB)
- Use **Mongoose** for schema definition
- Follow **MongoDB naming conventions**
- Implement proper **indexing** for performance

### Real-time Features (Socket.IO)
- Handle **connection/disconnection** gracefully
- Implement **error handling** for socket events
- Use **meaningful event names**

### General Guidelines
- Write **clean, readable code**
- Add **comments** for complex logic
- Follow **consistent formatting**
- Remove **console.logs** before committing

## 📝 Commit Message Style

Use clear, imperative commit messages:

```
feat: add AI-powered hint generation
fix: resolve socket connection issues
docs: update setup instructions
style: format code with prettier
refactor: optimize song matching algorithm
test: add unit tests for auth service
```

### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client && npm test

# Backend tests (if available)
cd server && npm test
```

### Testing Guidelines
- Write tests for new features
- Ensure existing tests pass
- Test across different browsers/devices
- Verify real-time functionality with multiple clients

## 🐛 Reporting Bugs

When reporting bugs, include:
1. **Environment details** (OS, browser, Node.js version)
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Console errors/logs**
5. **Screenshots** if applicable

## 💡 Feature Requests

For new features:
1. **Check existing issues** first
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation details
4. **Consider the impact** on existing functionality

## 🔒 Security

- **Never commit** API keys or sensitive data
- Use environment variables for configuration
- Report security vulnerabilities privately to the maintainers

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🤝 Community

- Be respectful and inclusive
- Help others in discussions
- Share knowledge and best practices
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md) (if available)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **README.md**: For setup and usage instructions

---

## 🙏 Thank You!

Thank you for contributing to Guessync! Every contribution, no matter how small, helps make this project better. We appreciate your time and effort in making Guessync an amazing music guessing game for everyone! 

**Don't forget to give us a ⭐ if you find this project helpful!**

Happy coding! 🎵🚀
