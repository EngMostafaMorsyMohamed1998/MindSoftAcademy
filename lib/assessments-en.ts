/**
 * English overlay for the performances-and-assessments booklet.
 * Official EN PDF was not in Downloads/public/books (ministry blob 403).
 * Chapter 1 wording follows the Arabic ministry bank, same IDs and keys.
 * Later chapters still fall back to Arabic until the EN book is typed.
 */
import type { AssessEnText } from "@/lib/assessments-helpers";

export const ASSESS_EN: Record<string, AssessEnText> = {
  "1-1-p1-class-e1": {
    prompt: "Explain how information technology developed from the 1940s to the 1960s, and state its main use in that period.",
    guide:
      "From the 1940s to the 1960s electronic computers such as ENIAC appeared, using vacuum tubes. The main use was military and scientific: calculation and data processing in large institutions, not everyday personal use.",
  },
  "1-1-p1-class-e2": {
    prompt: "Explain what Moore’s Law means, and whether it is a fixed physical law. Justify your answer.",
    guide:
      "Moore’s Law is a 1965 empirical observation: the number of transistors on a chip roughly doubles every two years. It is not a fixed physical law; further shrinking hits a physical limit, leakage currents, and quantum effects.",
  },
  "1-1-p1-class-m1": {
    prompt: "Which option is the main technology or event linked to the 1970s and 1980s?",
    options: [
      "The appearance of smartphones",
      "The spread of personal computers (PCs)",
      "The spread of cloud computing",
      "Commercial internet access and the appearance of the web",
    ],
  },
  "1-1-p1-class-m2": {
    prompt: "Which empirical observation describes the historical rise in transistors on integrated circuits, roughly doubling every two years?",
    options: ["Cloud computing", "Moore’s Law", "Edge computing", "Quantum superposition"],
  },
  "1-1-p1-home-e1": {
    prompt: "State three social changes that resulted from information technology.",
    guide:
      "Three of five shifts: social networks, e-commerce, remote work, online learning, and cashless payment.",
  },
  "1-1-p1-home-e2": {
    prompt: "What does the term e-commerce mean? Give two examples.",
    guide:
      "E-commerce is buying and selling goods and services over the internet. Examples: buying a book from an online store, or ordering food through an app.",
  },
  "1-1-p1-home-m1": {
    prompt: "Which term names a work pattern in which a person does the job from home or another remote place using the internet?",
    options: ["Online learning", "E-commerce", "Remote work", "Cashless payment"],
  },
  "1-1-p1-home-m2": {
    prompt: "What does a social networking service (SNS) mean?",
    options: [
      "Platforms that let users communicate and publish and share content quickly.",
      "Buying and selling goods and services over the internet.",
      "Paying for goods or services by non-cash means.",
      "A learning pattern in which lessons are delivered online.",
    ],
  },
  "1-1-p2-class-e1": {
    prompt:
      "Explain how edge computing improves safety and decision speed in self-driving technology without sending the data to the cloud.",
    guide:
      "Edge computing processes camera and sensor data on the vehicle itself at once. There is no wait for the cloud, so delay falls and the decision stays safe even if the connection drops.",
  },
  "1-1-p2-class-e2": {
    prompt: "Briefly compare augmented reality (AR) and virtual reality (VR) in definition and how each works.",
    guide:
      "AR adds a digital layer over a real scene. VR places the user inside a fully computer-generated environment and replaces the real world.",
  },
  "1-1-p2-class-m1": {
    prompt:
      "Which technology processes data on the device itself at once instead of sending it to the cloud, to avoid delay in the decision?",
    options: ["Cloud computing.", "Quantum computing.", "Edge computing.", "Social networks."],
  },
  "1-1-p2-class-m2": {
    prompt: "Which option is the precise meaning of augmented reality (AR)?",
    options: [
      "A technology that places the user inside a fully computer-generated virtual environment.",
      "A technology that adds digital elements or information to a real-world scene.",
      "A computing approach that uses quantum mechanics to process information.",
      "A system for paying with electronic money and QR codes.",
    ],
  },
  "1-1-p2-home-e1": {
    prompt: "Explain the principle of the qubit in quantum computing and how it differs from the classical bit.",
    guide:
      "A classical bit is one state: 0 or 1. A qubit uses quantum superposition, so it is a mix of 0 and 1 at the same time. That is the basis of quantum computing.",
  },
  "1-1-p2-home-e2": {
    prompt: "How did the spread of cloud computing from the 2010s onward change the way IT resources are delivered?",
    guide:
      "From the 2010s onward, IT resources became an internet service: storage, software, and compute on demand, instead of buying only local machines. That is cloud computing.",
  },
  "1-1-p2-home-m1": {
    prompt: "What distinguishes a qubit from a classical bit in quantum computing?",
    options: [
      "It holds one fixed state, either 0 or 1, at every moment.",
      "It uses quantum superposition so it is a mix of 0 and 1 at the same time.",
      "It relies only on traditional integrated circuits and a steady current.",
      "It is used today only for simple calculations.",
    ],
  },
  "1-1-p2-home-m2": {
    prompt: "What does cashless payment mean?",
    options: [
      "Buying and selling in physical shops using paper cash.",
      "Paying for goods or services by non-cash means such as cards, phone apps, or QR codes.",
      "Working from home using the internet and email.",
      "Delivering lessons and materials to users over the internet.",
    ],
  },
  "1-1-wa-e1": {
    prompt:
      "Explain the historical stages of IT from electronic computers in the 1940s through the 1960s, and the main purpose of their use then.",
    guide:
      "1940s–1960s: electronic computers such as ENIAC appeared for military and scientific calculation in large institutions. There was no personal computer yet.",
  },
  "1-1-wa-e2": {
    prompt: "Explain Moore’s Law: what it describes, and the engineering and physical challenges of further shrinking circuits.",
    guide:
      "Moore’s Law describes transistors roughly doubling every two years. Further shrinking hits a physical limit: heat, leakage currents, quantum effects, and quantum tunneling.",
  },
  "1-1-wa-e3": {
    prompt:
      "List the five societal shifts from information technology. Explain remote work and e-commerce.",
    guide:
      "The five: social networks, e-commerce, remote work, online learning, and cashless payment. Remote work: doing the job from home or another place over the internet. E-commerce: buying and selling over the internet.",
  },
  "1-1-wa-e4": {
    prompt:
      "State the features and uses of the three emerging technologies in the lesson (self-driving, AR/VR, and quantum computing).",
    guide:
      "Self-driving: AI drives the vehicle with sensors and often needs edge computing. AR/VR: a digital layer on reality, or a fully generated environment. Quantum computing: qubits in superposition to treat some problems faster.",
  },
  "1-1-wa-m1": {
    prompt: "In which period did the internet become commercial and the web appear, widening global access to information?",
    options: ["The 1940s and 1960s.", "The 1990s.", "The 1970s and 1980s.", "From the 2010s onward."],
  },
  "1-1-wa-m2": {
    prompt: "Which technology uses AI to help drive a vehicle, using cameras and sensors to sense the surroundings and decide?",
    options: ["Cloud computing.", "Self-driving.", "Virtual reality.", "Quantum computing."],
  },
  "1-1-wa-m3": {
    prompt: "Which term names IT delivered as an internet service to support big-data analysis and AI?",
    options: ["Cloud computing.", "Edge computing.", "The classical bit.", "Quantum superposition."],
  },
  "1-1-wa-m4": {
    prompt: "Which is the correct description of virtual reality (VR)?",
    options: [
      "A technology that adds digital information over real-world images.",
      "A technology that places the user inside a computer-generated virtual environment.",
      "A technology that processes data on the device itself at once, without the cloud.",
      "A system for paying with electronic money and QR codes.",
    ],
  },
  "1-1-wb-e1": {
    prompt:
      "Explain how personal computers and later global access to information and email affected society in the 1970s and 1980s.",
    guide:
      "In the 1970s and 1980s personal computers spread in daily work and education. That later opened the way for wider information access and email.",
  },
  "1-1-wb-e2": {
    prompt:
      "Explain how further shrinking of circuits under Moore’s Law leads to engineering and physical challenges such as leakage currents, quantum effects, and quantum tunneling.",
    guide:
      "As parts shrink they approach atomic scale. Leakage currents, quantum effects, and quantum tunneling appear. Moore’s Law is an observation nearing a limit, not a physical law that continues forever.",
  },
  "1-1-wb-e3": {
    prompt: "Briefly explain social networks (SNS), online learning, and cashless payment as societal shifts.",
    guide:
      "Social networks: platforms for publishing and sharing quickly. Online learning: lessons and materials over the network. Cashless payment: a card, app, or QR code instead of paper cash.",
  },
  "1-1-wb-e4": {
    prompt: "Explain how edge computing processes data locally on a self-driving vehicle at once to cut response time and keep safety.",
    guide:
      "Sensors collect data on the vehicle, and processing happens locally at once. Response time falls, and safety does not depend on reaching the cloud.",
  },
  "1-1-wb-m1": {
    prompt: "The period that saw smartphones and fast mobile internet is:",
    options: ["The 1970s and 1960s.", "The first decade of the 2000s.", "The 1990s.", "The 1940s."],
  },
  "1-1-wb-m2": {
    prompt: "A technology that adds digital elements or information to a real-world scene is called:",
    options: ["Virtual reality (VR).", "Self-driving.", "Augmented reality (AR).", "Quantum computing."],
  },
  "1-1-wb-m3": {
    prompt: "Which observation describes Moore’s Law accurately?",
    options: [
      "The number of transistors on an integrated circuit roughly doubles every two years.",
      "The number of transistors stays fixed and never changes.",
      "Energy use in traditional computers doubles every year.",
      "Computing and data-processing power fall over the years.",
    ],
  },
  "1-1-wb-m4": {
    prompt: "A learning pattern in which lessons and materials are delivered wholly or partly over the internet is:",
    options: ["E-commerce.", "Remote work.", "Online learning.", "Cashless payment."],
  },
  "1-1-wc-e1": {
    prompt: "Discuss the effect of the web and the spread of the internet in the 1990s on commercial and global access to information.",
    guide:
      "The 1990s opened the internet to commercial use and the web appeared, so global access to information, trade, and services widened.",
  },
  "1-1-wc-e2": {
    prompt: "Explain why self-driving counts among the notable emerging technologies.",
    guide:
      "Self-driving is emerging: a vehicle senses the surroundings with cameras and sensors and decides how to drive using AI, often with edge computing.",
  },
  "1-1-wc-e3": {
    prompt: "Explain e-commerce and cashless payment.",
    guide:
      "E-commerce: buying and selling over the internet. Cashless payment: paying with a card, electronic money, or a QR code, without paper cash.",
  },
  "1-1-wc-e4": {
    prompt: "State the core differences between a classical bit and a qubit, using quantum superposition in quantum computing.",
    guide:
      "A classical bit is only 0 or 1. A qubit, by superposition, holds 0 and 1 together, so some problems can be treated more efficiently in quantum computing.",
  },
  "1-1-wc-m1": {
    prompt:
      "Electronic computers first appeared and were used mainly for military and scientific work, such as ENIAC with vacuum tubes, in the:",
    options: ["1940s.", "1970s.", "1990s.", "First decade of the 2000s."],
  },
  "1-1-wc-m2": {
    prompt:
      "A computing approach that uses quantum mechanics to process information and may outperform others on certain problem classes is:",
    options: ["Edge computing.", "Quantum computing.", "Cashless payment.", "Social networks."],
  },
  "1-1-wc-m3": {
    prompt: "Platforms that let users communicate and publish and share content quickly, and that spread information well, are:",
    options: ["Social networking services (SNS).", "E-commerce.", "Remote work.", "Cloud computing."],
  },
  "1-1-wc-m4": {
    prompt: "A work style in which a person does the job from home or another remote place using communication and the internet is called:",
    options: ["Online learning.", "Remote work.", "Self-driving.", "Edge computing."],
  },
  "1-2-p1-class-e1": {
    prompt:
      "Define artificial intelligence, and in three points distinguish machine learning, deep learning, and generative AI.",
    guide:
      "AI is the umbrella that lets a computer do tasks that usually need human intelligence. Machine learning is a branch that learns patterns from data. Deep learning is an ML method with multi-layer networks. Generative AI creates new text, images, or sound after deep training.",
  },
  "1-2-p1-class-e2": {
    prompt: "Explain how models learn in machine learning compared with traditional methods that program rules explicitly.",
    guide:
      "In traditional programming every rule is written by hand. In machine learning the model sees many examples, picks up the pattern itself, then predicts or classifies new cases without an explicit rule for each case.",
  },
  "1-2-p1-class-m1": {
    prompt:
      "Which option is the broad field that covers computer systems that can learn, predict, and recognise speech and images?",
    options: ["Deep learning.", "Artificial intelligence.", "Machine learning.", "Generative AI."],
  },
  "1-2-p1-class-m2": {
    prompt: "What is machine learning in the sequence of AI techniques?",
    options: [
      "A branch of AI in which models learn patterns from data.",
      "A method that relies only on disconnected neural networks.",
      "A system that generates images and video only, with no training data.",
      "A set of rules programmed by hand, strictly and fixedly.",
    ],
  },
  "1-2-p1-home-e1": {
    prompt: "What are the basic parts of an artificial neural network?",
    guide:
      "An artificial neural network has an input layer, hidden layers, and an output layer. Connected neuron units change their weights during training to learn complex patterns.",
  },
  "1-2-p1-home-e2": {
    prompt: "Explain generative AI (GenAI) and give examples.",
    guide:
      "Generative AI (GenAI) creates new content with deep learning: text, images, sound, or software. Examples: ChatGPT for text, and tools that generate images and audio.",
  },
  "1-2-p1-home-m1": {
    prompt:
      "Which term names a machine-learning method that uses multi-layer neural networks to learn complex representations and patterns?",
    options: ["Machine learning.", "Generative AI.", "Deep learning.", "A spam filter."],
  },
  "1-2-p1-home-m2": {
    prompt: "What is the main function of generative AI systems?",
    options: [
      "Programming explicit rules for old computers.",
      "Creating new content such as text, images, sound, and software.",
      "Classifying spam email only, without generating content.",
      "Running integrated circuits according to Moore’s Law.",
    ],
  },
  "1-2-p2-class-e1": {
    prompt: "Explain the relationship among AI, machine learning, deep learning, and generative AI.",
    guide:
      "The relation is containment, not four separate boxes: AI is the widest circle, machine learning sits inside it, deep learning inside that, and modern generative AI usually inside deep learning.",
  },
  "1-2-p2-class-e2": {
    prompt: "What does hallucination mean in generative AI?",
    guide:
      "A hallucination is text that looks reasonable and coherent but is wrong or unsupported. The model completes what is linguistically likely, so fluency is not proof of truth.",
  },
  "1-2-p2-class-m1": {
    prompt: "Which technique do most modern generative AI systems rely on to create new content?",
    options: [
      "Rules programmed explicitly.",
      "Deep-learning models and neural networks.",
      "Edge computing and Moore’s Law.",
      "Fixed classical bits.",
    ],
  },
  "1-2-p2-class-m2": {
    prompt: "What does hallucination mean when generative AI produces text?",
    options: [
      "Producing text that looks reasonable and logical but is factually wrong.",
      "Stopping all response because the internet dropped.",
      "Generating images that are 100% accurate and fully match reality.",
      "Classifying spam email with outstanding accuracy.",
    ],
  },
  "1-2-p2-home-e1": {
    prompt:
      "A farmer wants an AI system that tells healthy crop photos from diseased ones. What training data does the system need, and what factor might make its prediction wrong?",
    guide:
      "It needs labelled photos of healthy and diseased crops. If class sizes are unbalanced or the lighting differs from the real field, the prediction may be wrong while still looking confident.",
  },
  "1-2-p2-home-e2": {
    prompt:
      "State one benefit and one risk of using generative AI to write a school report, and what learners should do to check the output.",
    guide:
      "Benefit: faster drafts and clearer structure. Risk: hallucination or an unsourced claim. The learner checks the book and original references before submitting, and does not paste the output as-is.",
  },
  "1-2-p2-home-m1": {
    prompt: "Which option is not a suitable example of generative AI?",
    options: [
      "A ChatGPT model for generating text.",
      "Tools that generate images with AI.",
      "A spam filter.",
      "Tools that generate audio clips.",
    ],
  },
  "1-2-p2-home-m2": {
    prompt: "What are the basic parts of an artificial neural network that learns complex patterns from data?",
    options: [
      "Connected layers of neuron units whose weights change during training.",
      "A set of vacuum tubes and simple electric circuits.",
      "Fixed program rules written as purely linear algorithms.",
      "Manual switches that control current in the processor.",
    ],
  },
  "1-2-wa-e1": {
    prompt: "Define AI and explain how today’s intelligent systems differ from traditional computers programmed with fixed rules.",
    guide:
      "AI imitates intelligent behaviour: learning, inference, and judgement. A traditional computer runs fixed rules the programmer wrote; an intelligent system learns from examples and generalises to new cases.",
  },
  "1-2-wa-e2": {
    prompt: "Explain in detail the nested relationship among AI, machine learning, and deep learning, with the core idea of each.",
    guide:
      "AI is the umbrella. Machine learning is a branch that learns data patterns. Deep learning is an ML method with deep networks and large data. The field narrows as we move inward.",
  },
  "1-2-wa-e3": {
    prompt: "What is generative AI, and how does it rely on deep-learning models to create new content such as text and images?",
    guide:
      "Generative AI creates content that was not sitting ready in one file. It uses deep models trained on many examples, then completes the most likely next word or pixel, which yields new text and images.",
  },
  "1-2-wa-e4": {
    prompt: "Discuss hallucination in generative AI: why it is dangerous, and the right way to check the output.",
    guide:
      "The danger is that fluent sentences are believed even when wrong. The check: compare the output with the book and trusted sources, then write the answer from the learner’s understanding, not by pasting the screen.",
  },
  "1-2-wa-m1": {
    prompt:
      "Which of the following is a branch of AI in which models learn patterns from data to predict or classify, without programming every rule explicitly?",
    options: ["Deep learning.", "Generative AI.", "Machine learning.", "Cloud computing."],
  },
  "1-2-wa-m2": {
    prompt:
      "A machine-learning method that uses multi-layer neural networks to learn complex patterns such as image analysis and speech recognition is:",
    options: ["Deep learning.", "Artificial intelligence.", "Generative AI.", "Traditional programming."],
  },
  "1-2-wa-m3": {
    prompt: "A computer system loosely inspired by linked neurons, whose weights change during training, is:",
    options: ["A quantum qubit.", "An artificial neural network.", "A classical bit.", "Moore’s Law."],
  },
  "1-2-wa-m4": {
    prompt: "When generative AI produces text that looks reasonable but is factually wrong, the phenomenon is called:",
    options: ["Hallucination.", "Quantum superposition.", "Edge computing.", "Linear operation."],
  },
  "1-2-wb-e1": {
    prompt:
      "Explain how everyday examples such as spam classification, product recommendations, and translation help us understand AI applications.",
    guide:
      "A mail filter classifies spam from earlier examples. A recommender suggests a product from buying behaviour. Translation turns text between languages. All are everyday pattern tasks that show AI as a judgement or conversion tool, not consciousness.",
  },
  "1-2-wb-e2": {
    prompt: "Compare machine learning and deep learning clearly in their use of neural networks and the amount of training data needed.",
    guide:
      "Machine learning is wider: it may work without a deep network and on smaller tables. Deep learning needs multi-layer networks and large data, and fits images, sound, and complex language.",
  },
  "1-2-wb-e3": {
    prompt: "Explain how generative AI can create new, varied content such as text, images, and sound from training data.",
    guide:
      "After deep training on many examples the model draws a new sample: it completes what is likely rather than retrieving a stored file word for word. So the text, image, or sound was not uploaded as-is.",
  },
  "1-2-wb-e4": {
    prompt: "Give a suitable rule for using generative AI in school homework, with two reasons why sources must be checked.",
    guide:
      "The rule: understand the idea from the model, then write it yourself. Two reasons: hallucination makes fluent speech that is wrong, and pasting hides the source and blocks any check of understanding.",
  },
  "1-2-wb-m1": {
    prompt: "Which option is a direct example of machine-learning applications?",
    options: [
      "Spam filters and product recommendations.",
      "Generating complex artistic images and video.",
      "Processing data on vehicle edge devices.",
      "Running integrated circuits according to Moore’s Law.",
    ],
  },
  "1-2-wb-m2": {
    prompt: "What is the precise description of generative AI (GenAI)?",
    options: [
      "A system limited to classifying spam and removing viruses.",
      "AI that uses deep learning to generate new data such as text and images.",
      "A computing technique that uses quantum mechanics and parallel processing.",
      "A simple neural network with only one input layer and one output layer.",
    ],
  },
  "1-2-wb-m3": {
    prompt: "What are the layers between the input layer and the output layer of an artificial neural network called?",
    options: ["Hidden layers.", "Edge layers.", "Cloud layers.", "Linear layers."],
  },
  "1-2-wb-m4": {
    prompt: "What should learners do to avoid hallucination when using generative AI for school reports?",
    options: [
      "Rely on the output completely with no human review.",
      "Check the output and its sources against trusted facts.",
      "Avoid phones and computers completely and permanently.",
      "Copy the text word for word and hand it to the teacher at once.",
    ],
  },
  "1-2-wc-e1": {
    prompt: "Why are most current AI systems narrow AI?",
    guide:
      "Most current systems are narrow: they master one task or a limited set, such as mail classification or translation. They are not general intelligence that can handle any task the way a human does.",
  },
  "1-2-wc-e2": {
    prompt: "Define an artificial neural network.",
    guide:
      "An artificial neural network is a system loosely inspired by linked neurons: layers, units, and weights that change with training to capture complex patterns in data.",
  },
  "1-2-wc-e3": {
    prompt: "Draw a simple diagram of the relationship among AI, deep learning, machine learning, and generative AI.",
    guide:
      "Nested circles from the outside in: AI, then machine learning, then deep learning, then generative AI at the centre. Containment shows that generative AI is a method inside deep learning, not a replacement for the umbrella.",
  },
  "1-2-wc-e4": {
    prompt: "State the proper procedure when using generative AI tools in homework and projects, and the risk of hallucination.",
    guide:
      "Review the output and the original sources before submitting. Speed helps a draft; hallucination stays a risk if the screen is treated as absolute truth without a check.",
  },
  "1-2-wc-m1": {
    prompt: "Most current AI systems are designed to perform:",
    options: [
      "A specific task or a limited set of tasks (narrow AI).",
      "A full imitation of human consciousness in every field with no limits.",
      "Manual programming of old household electrical devices.",
      "Management of global military communication networks only.",
    ],
  },
  "1-2-wc-m2": {
    prompt: "Which option is the most suitable technique for complex image analysis and advanced speech recognition?",
    options: [
      "Deep learning based on multi-layer neural networks.",
      "Rules programmed by hand in a fixed linear style.",
      "Traditional cloud computing without AI.",
      "E-commerce and cashless payment.",
    ],
  },
  "1-2-wc-m3": {
    prompt: "What is the main benefit of the speed generative AI gives students when preparing reports?",
    options: [
      "Help finishing tasks quickly, while still watching the risk of inaccuracy.",
      "A guarantee that every fact is 100% correct automatically.",
      "Doing away with official school books and sources completely.",
      "Stopping hallucination forever.",
    ],
  },
  "1-2-wc-m4": {
    prompt: "What is the proper procedure when using generative AI tools in homework and projects?",
    options: [
      "Always check the facts and review the original sources and references.",
      "Treat everything the screen produces as absolute scientific truth.",
      "Stop writing any school research and rely on AI completely.",
      "Send AI output without reading or inspecting it.",
    ],
  },
  "1-3-p1-class-e1": {
    prompt:
      "Explain how technologies such as video platforms and voice assistants became part of daily services, and what AI’s main role is in them.",
    guide:
      "Platforms recommend a clip from viewing behaviour, and a voice assistant understands a command and carries it out. AI’s main role is finding a pattern in earlier data, then suggesting or acting, without programming every case.",
  },
  "1-3-p1-class-e2": {
    prompt: "What does AI image diagnosis mean in healthcare, and how does it help detect disease?",
    guide:
      "Image diagnosis analyses X-rays or CT scans for signs of disease. It helps with earlier detection as an aid to the doctor, not as a final medical judgement on its own.",
  },
  "1-3-p1-class-m1": {
    prompt: "Which option is an example of a system that predicts preferences from earlier behaviour and shows recommendations?",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-p1-class-m2": {
    prompt: "Which daily AI service translates text automatically into different languages?",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-p1-home-e1": {
    prompt: "State four basic daily AI services and the role of AI in each.",
    guide:
      "Four services: a recommender that suggests content, a voice assistant that carries out commands, machine translation that converts text, and face recognition to unlock a device or tag photos. In each, AI picks a pattern from earlier data.",
  },
  "1-3-p1-home-e2": {
    prompt: "What role does AI play in manufacturing? Give two examples.",
    guide:
      "In manufacturing it checks product quality and predicts a machine fault before it happens. Examples: sorting a damaged pack from an image, and predictive maintenance from a heat sensor.",
  },
  "1-3-p1-home-m1": {
    prompt: "Which term names an AI system that recognises speech, understands commands, and carries them out, such as Siri and Google Assistant?",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-p1-home-m2": {
    prompt: "Which industrial sector is linked to the task of improving delivery routes?",
    options: ["Healthcare.", "Agriculture.", "Manufacturing.", "Logistics."],
  },
  "1-3-p2-class-e1": {
    prompt: "Explain how AI is used in agriculture and its role in monitoring crops and pests.",
    guide:
      "In agriculture, field images and sensors are watched to predict harvest time and detect pests and disease, so action can be taken in time.",
  },
  "1-3-p2-class-e2": {
    prompt: "State four tasks AI can do in complex data processing and in recognising images and sounds.",
    guide:
      "Four tasks: image recognition, speech recognition, text classification, and content generation. All process complex patterns in large data.",
  },
  "1-3-p2-class-m1": {
    prompt: "Which industry uses AI to detect disease from X-ray and CT images?",
    options: ["Healthcare.", "Agriculture.", "Manufacturing.", "Logistics."],
  },
  "1-3-p2-class-m2": {
    prompt: "Which option is the main AI task in agriculture?",
    options: [
      "Improving delivery routes.",
      "Predicting harvest time and detecting pests and disease.",
      "Checking product quality and predictive maintenance.",
      "Analysing medical images and discovering drugs.",
    ],
  },
  "1-3-p2-home-e1": {
    prompt: "Explain the saying: “AI is good at finding patterns in data, but human judgement is still necessary.”",
    guide:
      "The model is good at repeating a pattern it saw in the data. Ethical, medical, or school judgement stays human because context and responsibility are not inferred from statistics alone.",
  },
  "1-3-p2-home-e2": {
    prompt: "State three precautions for using AI.",
    guide:
      "Three precautions: watch for hallucination, review the black box when a decision affects a person, and avoid biased training data or high-impact decisions with no human owner.",
  },
  "1-3-p2-home-m1": {
    prompt: "Which term names AI generating incorrect or unsupported information that still looks convincing?",
    options: ["The black-box problem.", "Hallucination.", "Discrimination or bias.", "Insufficient training data."],
  },
  "1-3-p2-home-m2": {
    prompt: "What does the black-box problem mean in AI applications?",
    options: [
      "Generating incorrect information that looks convincing to the user.",
      "It is unclear how the AI reached its judgement or decision.",
      "Using copyrighted works as training data.",
      "Training data that is missing or does not represent reality accurately.",
    ],
  },
  "1-3-wa-e1": {
    prompt: "Explain how recommendation systems are used daily, with examples such as YouTube and Amazon.",
    guide:
      "A recommendation system predicts preference from earlier behaviour. YouTube suggests a video after similar viewing, and Amazon shows a product often bought with what is in the basket.",
  },
  "1-3-wa-e2": {
    prompt: "State uses of AI in healthcare.",
    guide:
      "In healthcare: analysing X-ray and CT images to detect disease, and supporting drug discovery. The result aids the doctor; it does not replace the examination.",
  },
  "1-3-wa-e3": {
    prompt: "State four main industrial sectors where AI is used, and briefly the role in each.",
    guide:
      "Four sectors: healthcare (image diagnosis), agriculture (harvest and pests), manufacturing (quality and predictive maintenance), and logistics (better delivery routes).",
  },
  "1-3-wa-e4": {
    prompt: "Explain what AI is good at, and what needs caution when the decision has an ethical dimension or involves privacy.",
    guide:
      "It is good at finding patterns and probabilistic inference. It needs caution in ethical decisions, privacy, and bias; human judgement and responsibility are not handed to the model.",
  },
  "1-3-wa-m1": {
    prompt: "Which service is used to unlock a smartphone and to detect and recognise faces in photos automatically?",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-wa-m2": {
    prompt: "Which technique is used to check product quality and predict machine faults before they happen?",
    options: [
      "AI for image diagnosis.",
      "AI in manufacturing and predictive maintenance.",
      "Recommenders and voice assistants.",
      "Machine translation and social networks.",
    ],
  },
  "1-3-wa-m3": {
    prompt: "Among AI use precautions, what does hallucination mean?",
    options: [
      "Not knowing how the system reached its decision.",
      "Generating incorrect or unsupported information that looks convincing.",
      "Bias in the training data.",
      "Violating copyright in the data.",
    ],
  },
  "1-3-wa-m4": {
    prompt: "Which is the correct description of what AI is good at?",
    options: [
      "Finding and classifying patterns in complex data, and probabilistic inference.",
      "Making absolute ethical judgements without humans.",
      "Guaranteeing that outputs will be free of any future bias.",
      "Storing personal data and keeping it fully secret.",
    ],
  },
  "1-3-wb-e1": {
    prompt: "State the role of AI in voice assistants, with two examples.",
    guide:
      "A voice assistant recognises speech, understands the command, and carries it out. Examples: Siri to place a call or set a reminder, and Google Assistant for voice search or an alarm.",
  },
  "1-3-wb-e2": {
    prompt: "Discuss the role of AI in agriculture and logistics in improving operations and productivity.",
    guide:
      "Agriculture: watch the crop, predict harvest, and detect pests. Logistics: improve the delivery route to cut time and cost. Both raise productivity with a narrow, repeated task.",
  },
  "1-3-wb-e3": {
    prompt: "Briefly explain precautions linked to biased training data, high-impact decisions, and assigning responsibility.",
    guide:
      "Missing or unfair data repeats bias. A high-impact decision (admission or treatment) needs human review. A responsible party is named so a mistake is not left uncorrected.",
  },
  "1-3-wb-e4": {
    prompt: "Explain why a human doctor must confirm a medical diagnosis instead of relying on AI alone.",
    guide:
      "The model may hallucinate or err if the image differs from training. The doctor reviews the context and the patient; automated diagnosis is an aid, not a final judgement on its own.",
  },
  "1-3-wb-m1": {
    prompt: "A daily service used to understand speech and carry out voice commands, such as Siri and Google Assistant, is:",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-wb-m2": {
    prompt: "An industrial sector that uses AI to improve delivery routes is:",
    options: ["Healthcare.", "Agriculture.", "Manufacturing.", "Logistics."],
  },
  "1-3-wb-m3": {
    prompt: "Which term names the lack of clarity about how AI reached its judgement or decision?",
    options: ["Hallucination.", "The black-box problem.", "Discrimination or bias.", "Probabilistic inference."],
  },
  "1-3-wb-m4": {
    prompt: "Among the tasks AI is good at:",
    options: [
      "Making complex ethical decisions.",
      "Recognising images, sounds, and text, and generating content.",
      "Guaranteeing absolutely accurate results with no training data.",
      "Protecting personal privacy automatically.",
    ],
  },
  "1-3-wc-e1": {
    prompt: "Explain three services AI can perform in daily life.",
    guide:
      "Three services: recommending content on a video platform, translating text into another language, and a voice assistant carrying out a command. The shared role: a pattern from earlier data, then a suitable output.",
  },
  "1-3-wc-e2": {
    prompt: "Give two examples of AI’s contribution in manufacturing.",
    guide:
      "Two examples: checking product quality on the line from images, and predictive maintenance that expects a machine fault from sensors before a stop.",
  },
  "1-3-wc-e3": {
    prompt: "Explain the black-box problem and the rights issues when copyrighted works are used as training data.",
    guide:
      "Black box: it is unclear how the system reached the judgement, so evaluation is hard. Rights: training on protected works without permission raises copyright issues even if the output looks new.",
  },
  "1-3-wc-e4": {
    prompt:
      "State the core difference between what AI is good at (finding patterns) and what needs great caution, such as privacy and ethics.",
    guide:
      "It is good at classifying complex patterns. What needs caution: data privacy, ethical decisions, and bias. Statistical power is not an ethical licence.",
  },
  "1-3-wc-m1": {
    prompt: "A system that predicts preferences from earlier behaviour and shows recommendations on platforms such as YouTube and Amazon is called:",
    options: ["A recommendation system.", "A voice assistant.", "Machine translation.", "Face recognition."],
  },
  "1-3-wc-m2": {
    prompt: "Which industry uses AI to predict harvest time and detect pests and disease?",
    options: ["Healthcare.", "Agriculture.", "Manufacturing.", "Logistics."],
  },
  "1-3-wc-m3": {
    prompt: "Ethical decisions that may lead to discrimination or bias count as:",
    options: [
      "What AI is good at.",
      "What needs caution when using AI.",
      "Basic deep-learning skills.",
      "The role of daily recommendation systems.",
    ],
  },
  "1-3-wc-m4": {
    prompt: "Bias in AI systems is:",
    options: ["A pattern that may lead to unfair results.", "Hallucination.", "Quantum superposition.", "Probabilistic inference."],
  },
  "1-4-p1-class-e1": {
    prompt: "What does algorithmic bias mean in AI systems, and what are its main forms or examples?",
    guide:
      "Algorithmic bias is a pattern in the outputs that leads to unfair or harmful results. Examples: a hiring system that favours one group, or face recognition whose accuracy falls for certain groups.",
  },
  "1-4-p1-class-e2": {
    prompt: "State the main reasons algorithmic bias arises in AI systems.",
    guide:
      "It arises from biased or unrepresentative training data, from older discriminatory tendencies reflected in the data, from missing data about a trait, or from design and use that repeat the fault. Processor speed is not a cause.",
  },
  "1-4-p1-class-m1": {
    prompt: "Which option is not a suitable or correct cause of algorithmic bias?",
    options: [
      "The training data are biased.",
      "Older discriminatory tendencies are reflected in the data.",
      "The computer’s processing speed is slow.",
      "There is not enough data about certain traits.",
    ],
  },
  "1-4-p1-class-m2": {
    prompt: "What does algorithmic bias mean in AI systems?",
    options: [
      "A pattern in AI outputs that may lead to unfair or harmful results.",
      "A technique that lets humans understand why the AI made a given judgement.",
      "Handling personal data appropriately and protecting it.",
      "Naming the parties responsible for the system, its decisions, and its effects.",
    ],
  },
  "1-4-p1-home-e1": {
    prompt: "Explain how the growth of AI raised new privacy and surveillance issues in public places.",
    guide:
      "Face recognition and the mass collection of internet behaviour made tracking in public places possible. Technical ability opened wider surveillance, so a need to protect privacy appeared.",
  },
  "1-4-p1-home-e2": {
    prompt: "What does training data mean in AI systems, and how does poor representation affect the outputs?",
    guide:
      "Training data are the examples from which the system learns its patterns before it is used. If representation is poor, the model repeats what it saw most, so judgement weakens for whoever was missing from the sample.",
  },
  "1-4-p1-home-m1": {
    prompt: "Which option is the precise meaning of training data?",
    options: [
      "The examples from which an AI system learns its patterns before it is used.",
      "A technique that lets humans understand why the AI made a given judgement.",
      "Naming the parties responsible for the system, its decisions, and its effects.",
      "Not discriminating unjustly against any person or group.",
    ],
  },
  "1-4-p1-home-m2": {
    prompt: "Which is a privacy issue linked to AI?",
    options: [
      "AI computing becoming faster.",
      "AI creating creative works.",
      "Recognising and tracking people through face recognition.",
      "Microprocessors becoming more efficient.",
    ],
  },
  "1-4-p2-class-e1": {
    prompt: "What does explainable AI (XAI) mean, and why is it a basic way to overcome the black-box problem?",
    guide:
      "XAI is a technique that explains to humans the factors that led to the judgement. The black box hides the mechanism, so evaluation and error-finding are hard; explanation restores the chance to review.",
  },
  "1-4-p2-class-e2": {
    prompt: "Briefly compare responsibility and accountability in AI systems.",
    guide:
      "Responsibility: naming the roles and duties of the developer, operator, and user. Accountability: being able to hold the party to account, according to its role, for the decision and its effect. They are not synonyms.",
  },
  "1-4-p2-class-m1": {
    prompt: "Which term names the technique that lets humans understand the factors and reason that led the AI to a given judgement?",
    options: ["Cloud computing.", "Explainable AI (XAI).", "Edge computing.", "Algorithmic bias."],
  },
  "1-4-p2-class-m2": {
    prompt: "What is the main difference between responsibility and accountability as explained in the lesson?",
    options: [
      "Responsibility means showing the decision process, while accountability means processing speed.",
      "Responsibility is about naming the parties’ roles and duties, while accountability is about who can be held to account according to those roles.",
      "Accountability is the technique that understands AI logic, while responsibility is collecting data.",
      "There is no difference; they are complete synonyms.",
    ],
  },
  "1-4-p2-home-e1": {
    prompt: "State the four basic principles of AI ethics, and briefly explain fairness.",
    guide:
      "The four: fairness, transparency, privacy protection, and accountability. Fairness: not discriminating unjustly against a person or group in the system’s judgements and outputs.",
  },
  "1-4-p2-home-e2": {
    prompt: "Explain transparency and privacy protection in responsible AI use.",
    guide:
      "Transparency: clear information about the system, its use, and the limits of the decision. Privacy protection: handling personal data appropriately and keeping it, not collecting or tracking without a reason.",
  },
  "1-4-p2-home-m1": {
    prompt: "Among the basic principles of AI ethics, which principle requires not discriminating unjustly against any person or group?",
    options: ["Transparency.", "Accountability.", "Fairness.", "Privacy protection."],
  },
  "1-4-p2-home-m2": {
    prompt: "Which principle means offering clear, suitable information about the system, its use, the decision process, and its limits?",
    options: ["Fairness.", "Transparency.", "Privacy protection.", "Responsibility."],
  },
  "1-4-wa-e1": {
    prompt:
      "Explain algorithmic bias in AI systems: how it arises from training data or from system design and use, with examples.",
    guide:
      "Bias is a harmful pattern in the outputs. It arises from missing or skewed data, or from choosing variables and a design and use that repeat earlier discrimination. Example: admission or face recognition that weakens for one group.",
  },
  "1-4-wa-e2": {
    prompt:
      "Discuss explainable AI (XAI) and the black-box problem, and how explanation helps evaluate the system and find errors.",
    guide:
      "The black box hides how the judgement was reached. XAI shows the factors, so the system can be evaluated and bias or faults found, instead of stopping at “the model decided”.",
  },
  "1-4-wa-e3": {
    prompt:
      "Compare responsibility and accountability precisely, and why the split of responsibility changes with context and parties (developer, operator, user).",
    guide:
      "Responsibility is a split of roles: the developer designs, the operator deploys, the user applies. Accountability is holding whoever failed their role to account. The split changes with context, so blame is not left on “the AI” alone.",
  },
  "1-4-wa-e4": {
    prompt:
      "State the four basic principles of AI ethics and briefly explain fairness, transparency, privacy protection, and accountability.",
    guide:
      "Fairness without unjust discrimination. Transparency by making the decision and its limits understandable. Privacy protection by keeping personal data. Accountability by a human party that can be held to account for the effect.",
  },
  "1-4-wa-m1": {
    prompt: "A pattern in AI outputs that may lead to unfair or harmful results, and that arises from data or design, is called:",
    options: ["Explainable AI (XAI).", "Algorithmic bias.", "Absolute transparency.", "Privacy protection."],
  },
  "1-4-wa-m2": {
    prompt: "A technique that lets humans understand why the AI made a given judgement and helps avoid the black-box problem is:",
    options: ["Explainable AI (XAI).", "Edge computing.", "Training data.", "Algorithmic bias."],
  },
  "1-4-wa-m3": {
    prompt: "The principle that means handling personal information appropriately and protecting it is:",
    options: ["Fairness.", "Transparency.", "Privacy protection.", "Accountability."],
  },
  "1-4-wa-m4": {
    prompt: "Naming the parties responsible for the system, its decisions, and its effects, and being able to hold them to account according to their roles, is the principle of:",
    options: ["Transparency.", "Fairness.", "Accountability.", "Privacy protection."],
  },
  "1-4-wb-e1": {
    prompt:
      "Explain how unrepresentative or biased training data (such as older discriminatory tendencies) can make AI repeat that bias in its judgements.",
    guide:
      "If the data reflect older biased hiring, the model repeats the same ranking with numeric confidence. Missing or unrepresentative data repeats the bias in the new judgement.",
  },
  "1-4-wb-e2": {
    prompt:
      "Explain the black-box problem in complex AI algorithms and why evaluating the mechanism and finding errors is hard without explanation techniques.",
    guide:
      "A complex algorithm may not show why it decided. Without explanation it is hard to evaluate the mechanism and find the error; so XAI is required when the judgement affects admission, health, or a mark.",
  },
  "1-4-wb-e3": {
    prompt: "State privacy issues linked to face recognition in public places and to the mass collection of data and behaviour on the internet.",
    guide:
      "Issues: tracking people with face recognition in public squares, collecting browsing behaviour at scale, and using the data without clear notice or a clear period.",
  },
  "1-4-wb-e4": {
    prompt:
      "Explain in detail the four basic principles of AI ethics and how each guides responsible use of these technologies in society.",
    guide:
      "Fairness blocks discriminatory output. Transparency enables review. Privacy protection limits collection and tracking. Accountability keeps a human owner. Together they guide responsible use, not technical power alone.",
  },
  "1-4-wb-m1": {
    prompt: "The examples from which an AI system learns its patterns before use, and that affect output quality directly, are called:",
    options: ["Training data.", "Encryption algorithms.", "Edge devices.", "Random-access memory."],
  },
  "1-4-wb-m2": {
    prompt: "Offering clear, suitable information about the system, its use, the decision process, and its limits is a precise definition of:",
    options: ["Fairness.", "Transparency.", "Accountability.", "Privacy protection."],
  },
  "1-4-wb-m3": {
    prompt: "Not discriminating unjustly against any person or group in AI judgements and outputs is the principle of:",
    options: ["Fairness.", "Transparency.", "Privacy protection.", "Accountability."],
  },
  "1-4-wb-m4": {
    prompt: "The method or technique that helps humans understand the factors that led the system to a given output or decision is:",
    options: ["Algorithmic bias.", "Explainable AI (XAI).", "Mass data collection.", "Network auditing."],
  },
  "1-4-wc-e1": {
    prompt:
      "Discuss causes of algorithmic bias and how it can arise from a poor choice of variables, or from a proxy that indirectly stands for a protected trait.",
    guide:
      "Bias may arise from a wrongly chosen variable, or from a proxy that indirectly stands for a protected trait (such as an address that tracks origin or gender). The result is discrimination even if the trait is never named.",
  },
  "1-4-wc-e2": {
    prompt: "Show why explainable AI (XAI) matters when the path to the result is not clear to the human eye.",
    guide:
      "If the path to the result is invisible, the reviewer cannot find the fault. XAI makes the factors readable, so the judgement can be reviewed instead of trusting the black box blindly.",
  },
  "1-4-wc-e3": {
    prompt:
      "Explain the different responsibilities of the parties (developer, operating company, user) when an AI system makes a wrong or unfair judgement.",
    guide:
      "The developer is responsible for design and data. The operating company is responsible for deployment and policy. The user is responsible for applying the judgement in context. If the judgement is wrong, the party is held to account by role, not “the model” as an actor.",
  },
  "1-4-wc-e4": {
    prompt:
      "Explain how the four principles of AI ethics (fairness, transparency, privacy protection, accountability) form one framework for responsible use.",
    guide:
      "Fairness governs equity, transparency enables understanding, privacy protection limits collection, and accountability closes the effect of a mistake. The four are one framework for responsible use, not separate slogans.",
  },
  "1-4-wc-m1": {
    prompt:
      "Naming the roles and duties of the parties linked to developing, operating, and using the system (developer, operator, user) points to the term:",
    options: ["Responsibility.", "Algorithmic bias.", "Training data.", "Transparency."],
  },
  "1-4-wc-m2": {
    prompt:
      "A system or technique that collects large amounts of behaviour data on the internet and allows tracking people in public places raises issues of:",
    options: ["Computer processing speed.", "Privacy protection.", "Main-memory efficiency.", "Moore’s Law."],
  },
  "1-4-wc-m3": {
    prompt: "Which option is the precise description of accountability?",
    options: [
      "Offering clear information about the system and its limits.",
      "Not discriminating unjustly against any person or group.",
      "Naming the parties responsible for the system and its decisions, and being able to hold them to account according to their roles.",
      "Understanding the factors that led the system to a given output.",
    ],
  },
  "1-4-wc-m4": {
    prompt: "Which option is a clear example of bias in AI systems?",
    options: [
      "A hiring system that unfairly favours one group, or face recognition whose accuracy falls for certain groups.",
      "A program for organising folders and personal files on a local computer.",
      "An app for simple arithmetic and engineering calculations.",
      "A tool for editing landscape photos and improving their lighting.",
    ],
  },
};
