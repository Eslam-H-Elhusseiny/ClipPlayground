# 🎬 ClipPlayground

**ClipPlayground** is a full-stack, high-performance video-sharing platform tailored for gamers and content creators. It offers a smooth, intuitive experience for uploading, managing, and viewing short video clips, leveraging the latest Angular features for optimal speed, reactivity, and scalability.

## ✨ Key Features

| Feature                        | Description                                                                                                          | Stack Highlight |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **🚀 High-Performance State**  | Utilizes **Angular Signals** for robust and highly reactive state management across all components.                  | Angular Signals |
| **🔐 Secure Authentication**   | Full user registration, login, and session management powered by **Firebase Authentication**.                        | Firebase Auth   |
| **☁️ Scalable Media Storage**  | Handles video and thumbnail uploads, processing, and storage using **Firebase Storage** and **Firestore**.           | Firebase        |
| **▶️ Seamless Video Playback** | Integrated with **Video.js** for a customizable and modern clip viewing experience, including HLS streaming support. | Video.js        |
| **🎨 Modern UI**               | A clean, responsive design built efficiently using the utility-first framework **Tailwind CSS**.                     | Tailwind CSS    |
| **📈 Dynamic Data Flow**       | Efficiently manages asynchronous data streams and side effects using **RxJS**.                                       | RxJS            |

---

## 💻 Tech Stack

This project leverages the latest advancements in web development:

| Category               | Technology                         | Version |
| :--------------------- | :--------------------------------- | :------ |
| **Frontend Framework** | **Angular** (CLI)                  | 20.0.4  |
| **State Management**   | **Angular Signals** & Services     | -       |
| **Styling**            | **Tailwind CSS**                   | v4      |
| **Backend & Database** | **Firebase** (Firestore & Storage) | -       |
| **Video Player**       | **Video.js** & Themes              | v8+     |
| **Asynchronous Ops**   | **RxJS**                           | v7+     |
| **Language**           | **TypeScript**                     | -       |

---

## 🛠️ Setup and Installation

This guide assumes you have Node.js and the Angular CLI installed globally.

### Prerequisites

1. **Angular CLI:**

   ```bash
   npm install -g @angular/cli
   ```

2. **Firebase Project:** You must have a Firebase project with **Authentication**, **Firestore**, and **Storage** enabled.
3. **CORS Configuration:** For videos to play correctly, ensure your Firebase Storage bucket has the CORS policy defined in `cors.json` applied.

### Local Development

1. **Clone the repository:**

   ```bash
   git clone [YOUR-REPO-URL] ClipPlayground
   cd ClipPlayground
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**
   Update your Firebase credentials in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

4. **Start the server:**

   ```bash
   ng serve
   ```

Open your browser to `http://localhost:4200/`. The application will automatically reload upon changes.

---

## ⚙️ Available Commands

| Command                        | Description                                                                                             |
| :----------------------------- | :------------------------------------------------------------------------------------------------------ |
| `ng serve`                     | Starts the development server.                                                                          |
| `ng build`                     | Compiles the project to the `dist/` directory. Use `--configuration production` for a production build. |
| `ng generate component <name>` | Generates a new component.                                                                              |
| `ng test`                      | Executes unit tests via Karma.                                                                          |

---

## 🤝 Contribution

Feel free to open issues or submit pull requests. All contributions are welcome!
