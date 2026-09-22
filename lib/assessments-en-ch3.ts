/**
 * English overlay for chapter 3 performances and assessments.
 * Wording follows the Arabic ministry bank, same IDs.
 */
import type { AssessEnText } from "@/lib/assessments-helpers";

export const ASSESS_EN_CH3: Record<string, AssessEnText> = {
  "3-1-p1-class-e1": {
    prompt: "Define a web application.",
    guide:
      "A web application is a program that runs through the browser and the internet: the user opens a page, and the layers work together to display the service and save the data. Examples: an online store, a social network, and a maps site.",
  },
  "3-1-p1-class-e2": {
    prompt: "List the main layers that make up a web application.",
    guide:
      "Three layers: the frontend (display and input), the backend (processing and permissions), and the database (storage and retrieval).",
  },
  "3-1-p1-class-m1": {
    prompt: "A web application is usually built from..",
    options: ["Three layers.", "Two layers.", "One layer.", "Several layers."],
  },
  "3-1-p1-class-m2": {
    prompt: "The layer responsible for displaying screens and collecting the user’s data and actions is:",
    options: ["The backend.", "The database.", "The frontend.", "The processing server."],
  },
  "3-1-p1-home-e1": {
    prompt: "Compare the role of the frontend and the role of the backend in a social-network application.",
    guide:
      "The frontend displays the timeline and the forms and collects clicks. The backend checks sign-in, chooses the audience, and sends notifications. Do not mix display with the decision.",
  },
  "3-1-p1-home-e2": {
    prompt:
      "How does the backend handle data coming from the frontend and data stored in the database on an e-commerce site?",
    guide:
      "The backend receives the frontend request (a search or a payment), reads from or writes to the database (products and orders), then returns the result so it can be shown to the user.",
  },
  "3-1-p1-home-m1": {
    prompt: "On a video-sharing site, counting views and choosing recommended videos belongs to:",
    options: ["The frontend.", "The backend.", "The database.", "The communication network."],
  },
  "3-1-p1-home-m2": {
    prompt: "Storing posts, follow relationships, and messages in a social network is the job of:",
    options: ["The processing server.", "The database.", "The frontend.", "The backend."],
  },
  "3-1-p2-class-e1": {
    prompt: "Design a structure diagram that shows how the three layers work together to carry out the user’s actions.",
    guide:
      "The user acts in the frontend → the backend processes and checks → the database stores or returns data → the backend replies → the frontend displays the result.",
  },
  "3-1-p2-class-e2": {
    prompt: "Discuss the importance of the database layer on e-commerce sites.",
    guide:
      "The database keeps the goods, the stock, the order history, and the accounts. Without it every visit starts from zero, and no proof of the purchase remains.",
  },
  "3-1-p2-class-m1": {
    prompt:
      "Sending payment requests and handling their results on an e-commerce site is shared work of processing and control in:",
    options: ["The frontend.", "The database.", "The backend.", "The user’s browser."],
  },
  "3-1-p2-class-m2": {
    prompt: "The main role of the database layer in web applications is:",
    options: [
      "Receiving the user’s actions.",
      "Storing data and retrieving it.",
      "Processing calculations.",
      "Displaying screens and interfaces.",
    ],
  },
  "3-1-p2-home-e1": {
    prompt: "Explain the general structure of web applications and the three layers.",
    guide:
      "The structure is three cooperating layers: a frontend for display and input, a backend for logic and control, and a database for permanent storage. The browser requests; the server decides and saves.",
  },
  "3-1-p2-home-e2": {
    prompt:
      "Explain how the three layers work together to provide a \"video sharing\" service, and give an example of each layer’s job.",
    guide:
      "Frontend: search and playback screens. Backend: counting views and recommendations. Database: video files, user data, and the viewing history.",
  },
  "3-1-p2-home-m1": {
    prompt: "On a video-sharing site, the viewing history and user information are stored in:",
    options: ["The search screens.", "The backend.", "The frontend.", "The database layer."],
  },
  "3-1-p2-home-m2": {
    prompt: "Instant notifications are controlled, and the target audience for posts is chosen, through:",
    options: ["The backend.", "The frontend.", "The database.", "The timeline."],
  },
  "3-1-wa-e1": {
    prompt:
      "Explain the difference between the frontend and the backend in web applications, and give an example of each.",
    guide:
      "The frontend is what the user sees: pages, search, and buttons. The backend is the logic: sign-in, payment, and recommendations. A frontend example is the product screen. A backend example is checking the account.",
  },
  "3-1-wa-e2": {
    prompt:
      "Explain the role of the database in a web application, and how it works with the backend to show results to the user.",
    guide:
      "The database stores the records. The backend asks it when there is a request and the rows come back, then the frontend displays them. Without this cooperation there is no lasting result after the page is closed.",
  },
  "3-1-wa-e3": {
    prompt:
      "Trace the steps of a product-search request in an online store through the three layers, and state the role of each layer.",
    guide:
      "The user types in the frontend. The backend receives the request and queries the database. The database returns the matching goods. The backend replies and the frontend displays the list.",
  },
  "3-1-wa-e4": {
    prompt: "Design a suitable split of responsibilities for an e-commerce web application, and justify your decisions.",
    guide:
      "Frontend: catalog, cart, and the checkout the user sees. Backend: stock, permissions, and secure payment. Database: users, products, and orders. Justify by separation: the look can change without breaking storage.",
  },
  "3-1-wa-m1": {
    prompt: "Which of the following is the role of the frontend in a web application?",
    options: [
      "Processing requests.",
      "Displaying content and receiving user input.",
      "Storing data.",
      "Checking sign-in.",
    ],
  },
  "3-1-wa-m2": {
    prompt: "When searching for a product in an online store, which layer sends the request to the database?",
    options: ["The frontend.", "The backend.", "The database itself.", "The browser."],
  },
  "3-1-wa-m3": {
    prompt: "Which of the following is an example of data stored in an e-commerce site’s database?",
    options: ["The search screen.", "The order history.", "Checking sign-in.", "The user interface."],
  },
  "3-1-wa-m4": {
    prompt: "The main idea of the general structure of web applications is:",
    options: [
      "Building the application from one layer only.",
      "Three layers working together: frontend, backend, and database.",
      "Using the browser only.",
      "Relying on the backend without a database.",
    ],
  },
  "3-1-wb-e1": {
    prompt: "Explain the idea of a web application, and give examples from everyday life.",
    guide:
      "A web application is a service opened from the browser; it is not installed as a desktop program. Everyday examples: webmail, maps, a store, and video sharing.",
  },
  "3-1-wb-e2": {
    prompt: "Discuss why it matters to divide a web application into three main layers.",
    guide:
      "The split makes responsibility clear: display, decision, and storage. It makes maintenance and the work of two teams easier, and it stops secrets or the real data from living in the page alone.",
  },
  "3-1-wb-e3": {
    prompt: "Show how the three layers work together when a social network is used.",
    guide:
      "The frontend displays the post and the writing box. The backend decides who sees the notification. The database stores the post, the follow, and the message.",
  },
  "3-1-wb-e4": {
    prompt: "Analyse the role of the backend on an e-commerce site.",
    guide:
      "The backend checks sign-in, matches the cart to the stock, passes the payment through, and writes the order. The frontend does not decide the final price by itself.",
  },
  "3-1-wb-m1": {
    prompt: "Which of the following is an example of a web application?",
    options: [
      "A video-player program on the device.",
      "A maps site on the internet.",
      "A calculator application on the desktop.",
      "An image-editing program.",
    ],
  },
  "3-1-wb-m2": {
    prompt: "On a video-sharing site, which layer stores the video data and the users?",
    options: ["The frontend.", "The backend.", "The database.", "The browser."],
  },
  "3-1-wb-m3": {
    prompt: "Which of the following is a job of the backend in a web application?",
    options: [
      "Displaying product pages.",
      "Showing the search box to the user.",
      "Checking sign-in.",
      "Storing the order history.",
    ],
  },
  "3-1-wb-m4": {
    prompt: "The main idea of the general structure of web applications is:",
    options: [
      "That the application is built from three layers that work together.",
      "That each layer works alone, without cooperation.",
      "That the application works through the browser only.",
      "That the application depends only on the database.",
    ],
  },
  "3-1-wc-e1": {
    prompt: "What is the role of the frontend on a video site?",
    guide:
      "It displays the video list, the player, and the search box, collects the play click and the like click, then sends the request to the backend.",
  },
  "3-1-wc-e2": {
    prompt: "What is the role of the database in a social network?",
    guide:
      "It stores the posts, the follow relationships, the messages, and the account data, and retrieves them when the backend asks for them to be displayed.",
  },
  "3-1-wc-e3": {
    prompt: "State the cooperation steps when sending an email.",
    guide:
      "The frontend collects the address and the text. The backend checks the session and accepts the send. The database saves the message. The backend confirms, and the frontend shows \"Sent\".",
  },
  "3-1-wc-e4": {
    prompt: "Why does a strong backend layer matter in e-commerce?",
    guide:
      "It protects payment, stock, and accounts: it stops the price from being changed in the browser, and it keeps the orders after the page is closed. That is the basis of trust in the store.",
  },
  "3-1-wc-m1": {
    prompt: "The main idea of the general structure of web applications is:",
    options: [
      "That each layer works alone, without cooperation.",
      "That the application depends only on the database.",
      "That the application works through the browser only.",
      "That the application is built from three layers that work together.",
    ],
  },
  "3-1-wc-m2": {
    prompt: "On a video-sharing site, which layer stores the video data and the users?",
    options: ["The frontend.", "The backend.", "The database.", "The browser."],
  },
  "3-1-wc-m3": {
    prompt: "Which of the following is an example of a web application?",
    options: [
      "A video-player program on the device.",
      "A maps site on the internet.",
      "A calculator application on the desktop.",
      "An image-editing program.",
    ],
  },
  "3-1-wc-m4": {
    prompt: "Which of the following is a job of the backend in a web application?",
    options: [
      "Displaying product pages.",
      "Showing the search box to the user.",
      "Storing the order history.",
      "Checking sign-in.",
    ],
  },
  "3-2-p1-class-e1": {
    prompt: "Explain what the client and server model is.",
    guide:
      "The client is a program or device that sends the request (the browser). The server receives it, processes it, and replies with a result or an error. This is the request-and-response model.",
  },
  "3-2-p1-class-e2": {
    prompt: "Design a sketch that shows how the client and the server communicate.",
    guide:
      "Draw an arrow from the client to the server labeled with the method and the address, and a return arrow with the body and the status code. Without these two directions there is no understanding.",
  },
  "3-2-p1-class-m1": {
    prompt: "The client in web applications is:",
    options: [
      "The server that processes the requests.",
      "The program or device that sends the requests.",
      "The database.",
      "The communication protocol.",
    ],
  },
  "3-2-p1-class-m2": {
    prompt: "When sending sign-in data, it is better to use:",
    options: ["GET", "POST", "200", "404"],
  },
  "3-2-p1-home-e1": {
    prompt: "Why is the HTTPS protocol more secure than HTTP? Give an example.",
    guide:
      "HTTPS is HTTP over an encrypted TLS channel, so the lock appears. Example: the sign-in page; without the lock the password may be read on a public network.",
  },
  "3-2-p1-home-e2": {
    prompt: "Explain the difference between a GET request and a POST request, with an example of each.",
    guide:
      "GET is for reading without a change: opening a lesson or search results. POST is for sending and creating: sign-in or a new assignment. Do not hide a write inside GET.",
  },
  "3-2-p1-home-m1": {
    prompt: "Status code 200 means:",
    options: [
      "An internal error on the server.",
      "The request succeeded.",
      "The resource does not exist.",
      "An unauthorised request.",
    ],
  },
  "3-2-p1-home-m2": {
    prompt: "Status code 404 indicates:",
    options: [
      "The request succeeded.",
      "An internal error on the server.",
      "The resource does not exist.",
      "The connection is secure.",
    ],
  },
  "3-2-p2-class-e1": {
    prompt: "Explain what HTTP status code 200 means.",
    guide:
      "200 means the request succeeded: the server understood and answered with the resource or the expected result. The code is part of the communication contract.",
  },
  "3-2-p2-class-e2": {
    prompt: "What does status code 404 mean, and when does it appear?",
    guide:
      "404 means the resource does not exist at that address. It appears with a wrong link or a page that was deleted. It is not an internal server failure (that is 500).",
  },
  "3-2-p2-class-m1": {
    prompt: "The basic difference between HTTP and HTTPS is:",
    options: [
      "HTTPS uses TLS encryption.",
      "HTTP is always faster.",
      "HTTPS does not support POST.",
      "HTTP uses JSON.",
    ],
  },
  "3-2-p2-class-m2": {
    prompt: "The JSON format is used for:",
    options: [
      "Designing the user interface.",
      "Exchanging structured data.",
      "Encrypting the connection.",
      "Setting the status code.",
    ],
  },
  "3-2-p2-home-e1": {
    prompt: "What is the role of status code 500 in communication between the client and the server?",
    guide:
      "500 is an internal error: the server received the request, then failed while processing it. The client did not necessarily use the wrong address; the fault is on the server side.",
  },
  "3-2-p2-home-e2": {
    prompt: "What is an API, and how does it help in developing web applications?",
    guide:
      "An API is an agreement between two programs: the address, the method, and the shape of the data. The application is built on that contract without knowing the database details, so more than one client can communicate with the service.",
  },
  "3-2-p2-home-m1": {
    prompt: "An API is:",
    options: [
      "A database.",
      "A set of rules for communication between programs.",
      "A security protocol.",
      "A data format.",
    ],
  },
  "3-2-p2-home-m2": {
    prompt: "When search results are shown from the server, the method usually used is:",
    options: ["POST", "GET", "500", "HTTPS"],
  },
  "3-2-wa-e1": {
    prompt: "Explain the client and server model.",
    guide:
      "The client requests a resource with a method and an address. The server replies with a body and a status code. The browser displays; the server decides.",
  },
  "3-2-wa-e2": {
    prompt: "Why must HTTPS be used on the sign-in page?",
    guide:
      "The sign-in page carries a secret. HTTPS encrypts the channel, so eavesdropping is harder. HTTP is readable on a public network, so it is not used for the password.",
  },
  "3-2-wa-e3": {
    prompt: "What is the role of the API in web applications?",
    guide:
      "The API states how an application requests a list or saves a record, and which JSON is returned. It separates the interface from the server and makes the connection something that can be documented.",
  },
  "3-2-wa-e4": {
    prompt: "Explain status code 200.",
    guide:
      "200 is success: the request arrived and was handled as expected. Beside it, 404 is for a missing resource and 500 is for a server failure.",
  },
  "3-2-wa-m1": {
    prompt: "Which of the following is the role of the client in a web application?",
    options: [
      "Processing requests on the server.",
      "Sending requests to obtain data.",
      "Storing data in the database.",
      "Choosing the target audience for posts.",
    ],
  },
  "3-2-wa-m2": {
    prompt: "Which of the following is usually used to request a resource or data from the server?",
    options: ["POST", "GET", "API", "JSON"],
  },
  "3-2-wa-m3": {
    prompt: "Which of the following is a common format for exchanging data between applications?",
    options: ["HTML", "JSON", "CSS", "SQL"],
  },
  "3-2-wa-m4": {
    prompt: "Status code 404 means:",
    options: [
      "The request succeeded.",
      "An internal error on the server.",
      "The requested resource does not exist.",
      "The request was not sent.",
    ],
  },
  "3-2-wb-e1": {
    prompt:
      "Explain why the request-and-response model is basic in web applications, and give a practical example.",
    guide:
      "The web is a dialogue of a request, then a reply. Example: the browser requests the lesson page with GET, and HTML comes back with status code 200, or 404 if the address is missing.",
  },
  "3-2-wb-e2": {
    prompt: "Distinguish the use of the GET method and the POST method, and state a suitable situation for each.",
    guide:
      "GET is reading: a page or a search. POST is a data body for creating: a registration form. GET does not suit a password or creating an account.",
  },
  "3-2-wb-e3": {
    prompt: "Explain the importance of the HTTPS protocol in protecting data while it travels across the network.",
    guide:
      "HTTPS encrypts the transfer, so a grade or a password cannot be read on the way. The lock and a valid certificate are required for any sensitive gateway.",
  },
  "3-2-wb-e4": {
    prompt: "Design a suitable connection method for a task in a web application (such as registering a new user).",
    guide:
      "Registering a new user: POST to the users resource with a JSON body (name, email, and password) over HTTPS. GET does not create a record, and it does not protect the secret in the address.",
  },
  "3-2-wb-m1": {
    prompt: "Which of the following status codes indicates that the request succeeded?",
    options: ["200", "404", "500", "302"],
  },
  "3-2-wb-m2": {
    prompt: "Which of the following is usually used to send form data to the server?",
    options: ["GET", "POST", "API", "JSON"],
  },
  "3-2-wb-m3": {
    prompt: "Which interface lets applications communicate and exchange data?",
    options: ["HTML", "API", "CSS", "SQL"],
  },
  "3-2-wb-m4": {
    prompt: "Choose what counts as an example of a data format used to exchange information between applications.",
    options: ["XML", "JSON", "Java", "PHP"],
  },
  "3-2-wc-e1": {
    prompt:
      "Explain how the server handles requests coming from the client, and what happens if the request is incorrect or the resource is not found.",
    guide:
      "The server interprets the method and the address. If the request is correct, it replies 200 with the resource. If the address is missing, 404. If the server breaks, 500.",
  },
  "3-2-wc-e2": {
    prompt:
      "Explain the role of application programming interfaces (APIs) in linking different applications, with a practical example.",
    guide:
      "The API is a bridge: the attendance application requests a list from an agreed address, and JSON comes back. Another application can use the same contract without sharing the database.",
  },
  "3-2-wc-e3": {
    prompt: "Explain how the JSON format is used to exchange data, and why it suits web applications.",
    guide:
      "JSON is structured text: objects and arrays that the browser and the server understand. It is lighter and clearer than a free-form exchange, and it suits an API contract.",
  },
  "3-2-wc-e4": {
    prompt: "Suggest a scenario for a web application that needs the POST method, and explain why you chose it.",
    guide:
      "Sending a registration form, or saving a new assignment, needs POST because the request creates data on the server. It is not merely reading a page.",
  },
  "3-2-wc-m1": {
    prompt: "Which of the following status codes indicates an internal error on the server?",
    options: ["200", "404", "500", "302"],
  },
  "3-2-wc-m2": {
    prompt: "One of these is usually used to request a web page or search results.",
    options: ["POST", "GET", "API", "JSON"],
  },
  "3-2-wc-m3": {
    prompt: "Which text format is used to represent structured data with objects and arrays?",
    options: ["HTML", "JSON", "CSS", "SQL"],
  },
  "3-2-wc-m4": {
    prompt: "Which of the following is used to secure the connection between the client and the server and prevent eavesdropping?",
    options: ["HTTP", "HTTPS", "API", "JSON"],
  },
  "3-3-p1-class-e1": {
    prompt: "Explain the role of each of HTML, CSS, and JavaScript in building a web page.",
    guide:
      "HTML gives the meaning and the structure: a heading, a paragraph, and a button. CSS is the appearance: colour, grid, and spacing. JavaScript is the behaviour after loading: a check, or updating part of the page.",
  },
  "3-3-p1-class-e2": {
    prompt: "Why is semantic HTML important when building web pages?",
    guide:
      "Semantic HTML names elements by their meaning (header, main, and footer), not as empty boxes. That helps the screen reader, search engines, and the keyboard.",
  },
  "3-3-p1-class-m1": {
    prompt: "HTML is responsible for:",
    options: ["The visual appearance.", "The basic structure of the page.", "Interactive behaviour.", "Improving performance."],
  },
  "3-3-p1-class-m2": {
    prompt: "Which of the following is an element of a semantic HTML page, except........",
    options: ["header", "E-mail", "main", "footer"],
  },
  "3-3-p1-home-e1": {
    prompt: "Explain how responsive design helps improve the user experience.",
    guide:
      "The layout changes with the screen width, so the button stays readable on the phone as on a wide screen. Consistency matters more than surprise.",
  },
  "3-3-p1-home-e2": {
    prompt: "State the benefit of using a framework in frontend development.",
    guide:
      "The framework provides ready-made components, a project structure, and shared rules, so building is faster and the interface stays consistent instead of writing everything from scratch.",
  },
  "3-3-p1-home-m1": {
    prompt: "CSS is used for:",
    options: ["Building the structure.", "Adding interaction.", "Formatting the appearance.", "Managing databases."],
  },
  "3-3-p1-home-m2": {
    prompt: "JavaScript adds:",
    options: ["Headings and paragraphs.", "Colours and fonts.", "Interactive behaviour.", "Semantic elements."],
  },
  "3-3-p2-class-e1": {
    prompt: "Give an example of a semantic HTML element and state its function.",
    guide:
      "Example: main for the main content, or header for the page header, or nav for navigation. The correct meaning shows both the machine and the person where each section is.",
  },
  "3-3-p2-class-e2": {
    prompt: "Discuss how CSS helps improve the visual appearance of the page.",
    guide:
      "CSS sets the colour, the font, the alignment, and the grid without mixing meaning into the HTML. A clear, consistent page is easier to read than random formatting.",
  },
  "3-3-p2-class-m1": {
    prompt: "The header element in semantic HTML is used for:",
    options: ["The main content.", "Navigation.", "The page header.", "The bottom of the page."],
  },
  "3-3-p2-class-m2": {
    prompt: "Responsive design means:",
    options: [
      "Adjusting the layout according to different screen sizes.",
      "Using JavaScript only.",
      "Improving databases.",
      "Hiding unimportant content.",
    ],
  },
  "3-3-p2-home-e1": {
    prompt: "What is the difference between the React library and the Next.js framework?",
    guide:
      "React is a library for building an interface with reusable components. Next.js is a framework built on React that adds routing, page rendering, and tools for the full application.",
  },
  "3-3-p2-home-e2": {
    prompt: "Why does the mobile-first approach matter in responsive design?",
    guide:
      "Mobile-first starts with the small screen and then expands. The phone audience is larger, and large touch targets and readable text stop a desktop page from overflowing the screen.",
  },
  "3-3-p2-home-m1": {
    prompt: "The React framework is used for:",
    options: [
      "Building user interfaces with reusable components",
      "Managing databases",
      "Encrypting the connection",
      "Improving performance only",
    ],
  },
  "3-3-p2-home-m2": {
    prompt: "The Next.js framework is built on:",
    options: ["Vue", "React", "CSS", "HTML"],
  },
  "3-3-wa-e1": {
    prompt: "Discuss the role of HTML in building a web page.",
    guide:
      "HTML is the structure of the page and its meaning: headings, lists, tables, and real buttons. Without it there is no page that can be understood, however the look is decorated later.",
  },
  "3-3-wa-e2": {
    prompt: "Explain how CSS helps improve the appearance.",
    guide:
      "CSS separates appearance from meaning: colours, spacing, and responsiveness. It improves reading without replacing a semantic element with a box that is only a shape.",
  },
  "3-3-wa-e3": {
    prompt: "What is responsive design?",
    guide:
      "Responsive design adjusts the layout automatically according to the screen size, so the page works on the phone and the computer without two separate copies.",
  },
  "3-3-wa-e4": {
    prompt: "What is the benefit of using a framework?",
    guide:
      "It provides reuse, a ready structure, and unified practices, so repetition falls and the frontend is easier to maintain.",
  },
  "3-3-wa-m1": {
    prompt: "Which is used to set the appearance and formatting of a web page?",
    options: ["HTML", "CSS", "JavaScript", "JSON"],
  },
  "3-3-wa-m2": {
    prompt: "Which of the following HTML elements is used to mark the main content section?",
    options: ["header", "footer", "main", "nav"],
  },
  "3-3-wa-m3": {
    prompt: "Responsive design means:",
    options: [
      "Making the page work only on computers.",
      "Adjusting the layout automatically according to different screen sizes.",
      "Using JavaScript to add interactivity.",
      "Improving server speed.",
    ],
  },
  "3-3-wa-m4": {
    prompt: "Which of the following is a JavaScript library for building user interfaces?",
    options: ["React", "HTML", "CSS", "SQL"],
  },
  "3-3-wb-e1": {
    prompt: "Explain how HTML, CSS, and JavaScript work together to form a complete web page.",
    guide:
      "HTML builds the structure, CSS gives it the appearance, and JavaScript adds interaction after loading. Together the three make a complete page: meaning, form, and behaviour.",
  },
  "3-3-wb-e2": {
    prompt: "Give an example of a semantic HTML element, and explain how it improves access.",
    guide:
      "Example: nav for the navigation list. The screen reader knows it is navigation, not an ordinary paragraph, so access improves without guessing.",
  },
  "3-3-wb-e3": {
    prompt: "Explain the idea of \"mobile first\" in responsive design, and why it is used.",
    guide:
      "Small screens are designed first, then the layout expands. That makes sure the phone is not a broken copy of the desktop, and it serves most users first.",
  },
  "3-3-wb-e4": {
    prompt: "Name two common libraries and frameworks for web development, and state what each is like.",
    guide:
      "React: reusable interface components. Next.js: a framework on React for routing and page rendering. (Vue may also be mentioned as a progressive framework.)",
  },
  "3-3-wb-m1": {
    prompt: "Which of the following technologies is used to build the basic structure of the page?",
    options: ["CSS", "HTML", "JavaScript", "SQL"],
  },
  "3-3-wb-m2": {
    prompt: "The nav element in HTML is used for:",
    options: [
      "Displaying the main content.",
      "Navigating between parts of the site.",
      "Displaying the main heading.",
      "Displaying the footer.",
    ],
  },
  "3-3-wb-m3": {
    prompt: "The basic feature of responsive design is:",
    options: [
      "Improving server speed.",
      "Adapting to different screen sizes.",
      "Adding interactivity with JavaScript.",
      "Search-engine optimisation.",
    ],
  },
  "3-3-wb-m4": {
    prompt: "It is a framework built on React that provides routing and page-rendering methods.",
    options: ["Next.js", "Vue", "HTML", "CSS"],
  },
  "3-3-wc-e1": {
    prompt: "How does JavaScript add interactivity to a web page? Give a practical example.",
    guide:
      "JavaScript responds to an event after loading: filtering names as you type, or checking before sending, without a full reload. Do not put a secret in it.",
  },
  "3-3-wc-e2": {
    prompt: "State the benefits of semantic HTML for search engines.",
    guide:
      "Semantic elements show the search engine where the heading, the main content, and the footer are, so indexing is more precise than a page of boxes with no meaning.",
  },
  "3-3-wc-e3": {
    prompt: "Explain how responsive design helps improve the user experience on smartphones.",
    guide:
      "On the phone the width is narrow, so columns stack, or menus hide inside a clear menu, and the buttons stay tappable without tiring horizontal scrolling.",
  },
  "3-3-wc-e4": {
    prompt: "Discuss the role of the Next.js framework in developing modern web applications.",
    guide:
      "Next.js builds on React, so it provides routing, page-rendering methods, and the structure of a modern application, instead of managing routes by hand from scratch.",
  },
  "3-3-wc-m1": {
    prompt: "Which of the following technologies is used to add interactive behaviour to the page?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
  },
  "3-3-wc-m2": {
    prompt: "The footer element in HTML is used for:",
    options: [
      "Displaying the main content",
      "Displaying the footer at the bottom of the page",
      "Displaying the main heading",
      "Navigating between parts of the site",
    ],
  },
  "3-3-wc-m3": {
    prompt: "The \"mobile first\" approach in responsive design means:",
    options: [
      "Designing the page first for computers.",
      "Designing the page first for small screens such as phones.",
      "Using JavaScript to add interactivity.",
      "Improving server speed.",
    ],
  },
  "3-3-wc-m4": {
    prompt: "Which of the following is a JavaScript framework that lets applications be built progressively?",
    options: ["React", "Vue", "Next.js", "HTML"],
  },
};
