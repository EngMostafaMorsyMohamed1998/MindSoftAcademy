/**
 * English overlay for chapter 2 assessment items (lessons 2-1, 2-2, and 2-3).
 * Wording follows the Arabic ministry bank, same IDs.
 */
import type { AssessEnText } from "@/lib/assessments-helpers";

export const ASSESS_EN_CH2: Record<string, AssessEnText> = {
  "2-1-p1-class-e1": {
    prompt:
      "Explain how HTTPS connections protect the connection, and what role the TLS protocol plays in that.",
    guide:
      "HTTPS is HTTP over a secured TLS channel. The handshake verifies the server's identity and agrees on secrets from which the session keys are derived. The data is then encrypted in transit, so it is not read or altered on the way.",
  },
  "2-1-p1-class-e2": {
    prompt:
      "Distinguish the role of symmetric encryption and public key encryption during the flow of an HTTPS connection.",
    guide:
      "Public key encryption is used in the handshake to exchange the session key securely, but it is slower. Symmetric encryption encrypts the session data after the agreement because it is faster and more efficient for large amounts.",
  },
  "2-1-p1-class-m1": {
    prompt:
      "Which of the following technologies is used mainly to encrypt session data quickly and with high efficiency after the handshake and the security agreement are complete?",
    options: [
      "Public key encryption.",
      "Symmetric encryption.",
      "Digital signature.",
      "Digital certificate.",
    ],
  },
  "2-1-p1-class-m2": {
    prompt:
      "What are the steps called that create the secure connection and verify the server's identity and the domain name over the HTTPS protocol?",
    options: [
      "TLS handshake.",
      "Digital signature.",
      "Two-factor authentication.",
      "Symmetric encryption.",
    ],
  },
  "2-1-p1-home-e1": {
    prompt:
      "What does the term 'two-factor authentication (2FA)' mean, and how does using a second independent factor reduce the risk of unauthorised access?",
    guide:
      "Two-factor authentication proves identity with two independent factors from two different categories, such as a password (knowledge) and a one-time code (possession). If the first factor is stolen, the second remains a barrier to unauthorised access.",
  },
  "2-1-p1-home-e2": {
    prompt:
      "State the basic differences between two-factor authentication (2FA) and multi-factor authentication (MFA) in the number and categories of factors used.",
    guide:
      "Two-factor authentication uses two factors from two different categories. Multi-factor authentication uses two or more factors from the categories of knowledge, possession, and biometrics. Two-factor authentication is a common case of multi-factor authentication, and it is not broader than it.",
  },
  "2-1-p1-home-m1": {
    prompt:
      "Which of the following is two factors from two completely different categories (knowledge and possession) used in two-factor authentication for banking services?",
    options: [
      "A password + a second text password.",
      "A password + a one-time password (OTP).",
      "A fingerprint + face recognition.",
      "A paper identity card + the username only.",
    ],
  },
  "2-1-p1-home-m2": {
    prompt: "What does the term multi-factor authentication (MFA) mean?",
    options: [
      "Using one very strong and highly complex password.",
      "Using two or more factors from different categories such as knowledge, possession, and biometrics.",
      "Relying on a fingerprint only to sign in.",
      "Using an email address with the traditional password.",
    ],
  },
  "2-1-p2-class-e1": {
    prompt:
      "What is the basic role of the digital certificate and public key mechanisms in starting a secure TLS connection?",
    guide:
      "The digital certificate binds the public key to the server's identity and domain name through a chain of trust. The browser checks it at the start of TLS before sending any secret, so it does not connect to an impersonated site.",
  },
  "2-1-p2-class-e2": {
    prompt:
      "Briefly compare the function of the digital signature and the function of the digital certificate in security systems.",
    guide:
      "The digital signature detects tampering and impersonation and supports non-repudiation. The digital certificate proves that the public key belongs to the server that matches the domain name, and it does not replace the digital signature in proving the source.",
  },
  "2-1-p2-class-m1": {
    prompt:
      "Which technology helps the browser verify the server's identity and that the certificate is linked to the domain name it connects to?",
    options: [
      "Symmetric encryption",
      "Digital signature",
      "Digital certificate",
      "Two-factor authentication",
    ],
  },
  "2-1-p2-class-m2": {
    prompt:
      "Which of the following technologies detects tampering and impersonation and provides evidence that supports non-repudiation?",
    options: [
      "Symmetric encryption",
      "Digital signature",
      "TLS handshake",
      "Two-factor authentication",
    ],
  },
  "2-1-p2-home-e1": {
    prompt:
      "Briefly explain how different security technologies (encryption, certificates, and two-factor authentication) are combined when a purchase is completed on an online store.",
    guide:
      "When buying: the digital certificate proves the store's identity, encryption protects the payment data on the way, and two-factor authentication proves the buyer's identity at sign-in or when the transaction is confirmed. The layers cover different risks together.",
  },
  "2-1-p2-home-e2": {
    prompt:
      "Why is one security technology not enough to protect services and communications over the internet, and what is the practical benefit of multiple layers?",
    guide:
      "One technology covers only confidentiality, identity, or integrity. If it fails, the service stays exposed. Multiple layers reduce the effect of one layer falling and cover registration, payment, and the connection together.",
  },
  "2-1-p2-home-m1": {
    prompt:
      "Which of the following technologies stops third parties from reading the content of the connection while data is transferred over the network?",
    options: [
      "Encryption (with the symmetric key and the public key).",
      "Digital signature.",
      "Two-factor authentication (2FA).",
      "Digital certificate.",
    ],
  },
  "2-1-p2-home-m2": {
    prompt:
      "Among the following options, which is an incorrect example of two-factor authentication because it relies on the same factor category (knowledge)?",
    options: [
      "A password + a one-time password sent to the phone.",
      "A password + a fingerprint.",
      "A password + a second secret password.",
      "A password + a code from an authenticator app.",
    ],
  },
  "2-1-wa-e1": {
    prompt:
      "Explain in detail how HTTPS connections use different technologies to protect the connection from the moment the handshake starts until data is exchanged.",
    guide:
      "The TLS handshake starts by verifying the digital certificate and agreeing on shared secrets from which the session keys are derived. After security is complete, symmetric encryption encrypts the session data quickly, so HTTPS provides confidentiality and integrity in transit.",
  },
  "2-1-wa-e2": {
    prompt:
      "Precisely distinguish the role of symmetric encryption and public key encryption, explaining why each is used in the stages of an HTTPS connection.",
    guide:
      "The public key solves secret distribution in the handshake, but it is slow if it encrypts every packet. Symmetric encryption after the agreement uses one fast session key for the page and payment data. HTTPS mixes the two for this reason.",
  },
  "2-1-wa-e3": {
    prompt:
      "With a practical example, explain how two-factor authentication is used when signing in to social-media accounts or banking services.",
    guide:
      "Example: the account password, then a code from an authenticator app or a text message. The second factor is independent of knowledge. Leaking the password alone is not enough to open the bank account or the social-media account.",
  },
  "2-1-wa-e4": {
    prompt:
      "Discuss the following statement: 'Secure connection and services over the internet depend on combining encryption and authentication, and not on one technology only.' Show the role of each technology when they are used together.",
    guide:
      "Encryption stops the content from being read on the way. Authentication proves a party's identity before the data is revealed. Digital certificates and digital signatures complete trust. Relying on one technology leaves impersonation or eavesdropping without a barrier.",
  },
  "2-1-wa-m1": {
    prompt:
      "The HTTP protocol carried over a secured TLS connection, which provides data confidentiality and integrity in transit, is known as:",
    options: ["HTTPS", "FTP", "SMTP", "DNS"],
  },
  "2-1-wa-m2": {
    prompt:
      "Using two independent factors from two different categories to prove identity is known as:",
    options: [
      "Symmetric encryption.",
      "Two-factor authentication (2FA).",
      "Digital signature.",
      "Digital certificate.",
    ],
  },
  "2-1-wa-m3": {
    prompt:
      "A technology that detects tampering and impersonation and provides evidence that supports non-repudiation is:",
    options: [
      "Digital signature.",
      "Public key encryption.",
      "TLS handshake.",
      "Cloud computing.",
    ],
  },
  "2-1-wa-m4": {
    prompt:
      "Which of the following accurately represents the factor categories of multi-factor authentication (MFA)?",
    options: [
      "Knowledge, possession, and biometrics.",
      "Speed, efficiency, and cost.",
      "The public key, the private key, and the password.",
      "The wireless connection, the local network, and the cloud.",
    ],
  },
  "2-1-wb-e1": {
    prompt:
      "Explain the basic steps that happen during the 'TLS handshake', and how the browser verifies the server's digital certificate.",
    guide:
      "In the handshake the server presents its digital certificate, and the browser checks the chain of trust and that the domain name matches. The two parties then agree on secrets from which the session keys are derived, before the exchange of encrypted data begins.",
  },
  "2-1-wb-e2": {
    prompt:
      "Explain why using public key encryption for all the data exchanged is slow, and how the TLS protocol handles this problem by using session keys.",
    guide:
      "Public key operations are heavier to compute, so they are not suitable for every byte. TLS uses them once at the start to secure a symmetric session key, then encrypts the packets with that key quickly.",
  },
  "2-1-wb-e3": {
    prompt:
      "Compare the authentication factor categories (knowledge, possession, and biometrics), and give an example of each category.",
    guide:
      "Knowledge: a password or a secret question. Possession: a phone, a smart card, or a one-time code. Biometrics: a fingerprint or a face. Strong authentication combines at least two different categories.",
  },
  "2-1-wb-e4": {
    prompt:
      "Explain how using a second independent factor (such as an authenticator app or a text-message code) stops the account from being compromised even if the main password is leaked.",
    guide:
      "An attacker who stole the password does not have the phone or the code app. The second independent factor stops sign-in until the leaked secret is changed, and that is the essence of two-factor authentication.",
  },
  "2-1-wb-m1": {
    prompt:
      "A related key pair made up of a public key and a private key, used in encryption to secure the connection, is:",
    options: [
      "Public key encryption.",
      "Symmetric encryption.",
      "The quantum qubit.",
      "The classical bit.",
    ],
  },
  "2-1-wb-m2": {
    prompt:
      "A service or system that helps the browser verify the server's identity and that the domain name matches the digital certificate:",
    options: [
      "Digital signature.",
      "Digital certificate.",
      "Symmetric encryption.",
      "Two-factor authentication.",
    ],
  },
  "2-1-wb-m3": {
    prompt:
      "Which of the following is a correct example of a 'possession' factor in two-factor authentication?",
    options: [
      "Knowing the secret question.",
      "A one-time password sent to the phone, or a smart card.",
      "The user's fingerprint.",
      "Face recognition.",
    ],
  },
  "2-1-wb-m4": {
    prompt:
      "Combinations of security technologies in online stores protect registration and payment through:",
    options: [
      "Relying on one technology only, for speed of carrying it out.",
      "Combining encryption, digital certificates, digital signatures, and two-factor authentication to reduce the multiple risks.",
      "Cancelling the use of passwords for good.",
      "Settling for symmetric encryption with no authentication.",
    ],
  },
  "2-1-wc-e1": {
    prompt:
      "Explain in detail how digital certificates and the chain of trust let the browser check that the site name is valid and fits the server.",
    guide:
      "The chain links the digital certificate to a trusted authority. The browser refuses the connection if the chain is broken or the name does not match the domain. In this way server impersonation is blocked before any secret is sent.",
  },
  "2-1-wc-e2": {
    prompt:
      "Speak briefly about the digital signature, stating its properties, and how it helps detect tampering and impersonation and provides evidence of non-repudiation.",
    guide:
      "The digital signature is bound to the sender's private key. Any change breaks the verification, and impersonation fails without the private key, so evidence remains that supports non-repudiation.",
  },
  "2-1-wc-e3": {
    prompt:
      "What security benefits result from combining several security technologies (encryption, digital signatures, digital certificates, and two-factor authentication) in banking services and online shopping?",
    guide:
      "Encryption protects card numbers on the way, the digital certificate proves the store's or the bank's identity, the digital signature detects tampering, and two-factor authentication stops an account whose password was stolen. Combining them covers the risks of purchasing and registration together.",
  },
  "2-1-wc-e4": {
    prompt:
      "Discuss freely why advanced security means such as TLS and two-factor authentication do not mean that protection is absolute, or that the site's content is fully trustworthy.",
    guide:
      "TLS protects the channel, not the truth of the content; a phishing site may hold a digital certificate. Two-factor authentication proves who signed in, not the safety of the whole service. Protection is layers that reduce risk, and it is not an absolute guarantee.",
  },
  "2-1-wc-m1": {
    prompt:
      "The steps that create the secure connection and agree on shared secrets from which the session keys are derived are called:",
    options: [
      "TLS handshake.",
      "Symmetric encryption.",
      "Digital signature.",
      "Digital certificate.",
    ],
  },
  "2-1-wc-m2": {
    prompt:
      "Using two or more factors from different categories to prove identity (such as knowledge, possession, and biometrics) is called:",
    options: [
      "Multi-factor authentication (MFA).",
      "Public key encryption.",
      "TLS handshake.",
      "Symmetric encryption.",
    ],
  },
  "2-1-wc-m3": {
    prompt: "Which of the following is an example of a 'biometrics' factor in authentication?",
    options: [
      "A text password.",
      "A fingerprint or face recognition.",
      "An ATM card.",
      "A verification code by text message.",
    ],
  },
  "2-1-wc-m4": {
    prompt: "Secure connection and services over the internet depend mainly on:",
    options: [
      "One unique and absolute technology.",
      "Combining encryption, authentication, digital certificates, and digital signatures.",
      "Using simple passwords only.",
      "Cancelling the use of public keys and private keys.",
    ],
  },
  "2-2-p1-class-e1": {
    prompt:
      "Explain what 'defence in depth' means in network security, and why providing multiple layers is more reliable than relying on one means of protection.",
    guide:
      "Defence in depth is successive layers of controls: if one fails, the rest reduce the effect of the breach. Relying on one wall opens the whole network if the perimeter falls.",
  },
  "2-2-p1-class-e2": {
    prompt:
      "Explain the basic role of the firewall in network security, and give an example of how it controls traffic.",
    guide:
      "The firewall monitors traffic and allows it or blocks it according to rules. Example: stopping guest devices from reaching the database server, or closing a port that has no service.",
  },
  "2-2-p1-class-m1": {
    prompt:
      "Which of the following is the precise definition of 'defence in depth' in network security?",
    options: [
      "Full reliance on a strong firewall at the network boundary.",
      "Using multiple layers of security controls so that the other layers reduce the risk if one layer fails.",
      "Granting automatic trust to all devices inside the organisation's geographic area.",
      "Encrypting traffic in full only when public Wi-Fi networks are used.",
    ],
  },
  "2-2-p1-class-m2": {
    prompt:
      "What term is given to a system or program that monitors network traffic and allows it or blocks it according to set security rules?",
    options: [
      "Virtual private network.",
      "Demilitarised zone.",
      "Firewall.",
      "Zero Trust approach.",
    ],
  },
  "2-2-p1-home-e1": {
    prompt:
      "What does the term 'virtual private network (VPN)' mean? State two of its main uses.",
    guide:
      "A VPN is an encrypted logical tunnel over a public network. Two main uses: an employee connecting from home or while travelling to the organisation's network, and linking offices over the internet without exposing the data to eavesdropping.",
  },
  "2-2-p1-home-e2": {
    prompt:
      "Why is placing a public web server in the 'demilitarised zone (DMZ)' safer than placing it directly inside the organisation's internal network?",
    guide:
      "A public server is a target for attacks. In the demilitarised zone it stays separate from the internal network. Compromising it does not grant direct access to sensitive databases, as it would if the server were placed inside the organisation.",
  },
  "2-2-p1-home-m1": {
    prompt:
      "What term refers to a private logical connection or network created over a public network such as the internet, which uses encryption to protect the data?",
    options: [
      "Firewall.",
      "Virtual private network (VPN).",
      "Demilitarised zone (DMZ).",
      "Zero Trust approach.",
    ],
  },
  "2-2-p1-home-m2": {
    prompt:
      "Which of the following is the most suitable and most common use of a virtual private network (VPN) in modern workplaces?",
    options: [
      "Connecting securely to the organisation's network from home, while travelling, or when working remotely.",
      "Protecting endpoint devices from viruses and removing them automatically without helper software.",
      "Monitoring local network traffic and blocking spam email.",
      "Providing platforms that let the user publish content and share it very quickly.",
    ],
  },
  "2-2-p2-class-e1": {
    prompt:
      "Explain what the 'demilitarised zone (DMZ)' means in network designs, and how it protects the internal infrastructure components.",
    guide:
      "The demilitarised zone is a segment where outward-facing servers (web or mail) are placed apart from the inside. An attack stops at this segment and does not spread to the internal infrastructure.",
  },
  "2-2-p2-class-e2": {
    prompt:
      "Briefly compare traditional security and the 'Zero Trust' approach in how they treat users of the internal network.",
    guide:
      "Traditional security trusts automatically everyone who has entered the perimeter. Zero Trust does not grant trust merely because of location or ownership. It checks identity, permissions, and context on every access.",
  },
  "2-2-p2-class-m1": {
    prompt: "What does the term 'demilitarised zone (DMZ)' mean in the structure of network security?",
    options: [
      "A public network that is fully open and lets an attacker reach sensitive databases.",
      "A zone where servers exposed to the external network are placed separately from the organisation's internal network.",
      "Malicious software that monitors traffic and changes the firewall rules automatically.",
      "An encrypted virtual private line that links different branches over the public internet.",
    ],
  },
  "2-2-p2-class-m2": {
    prompt:
      "What is the basic assumption that the 'Zero Trust' approach relies on to secure the organisation's resources?",
    options: [
      "Treating every device or user inside the organisation's network as fully trusted, automatically.",
      "Not granting automatic trust to a user or device merely because they are inside the network or owned by the organisation, and checking identity and context.",
      "Absolute reliance on the outer security perimeter, and not checking internal applications.",
      "Encrypting email messages only, with no concern for permissions to access the data.",
    ],
  },
  "2-2-p2-home-e1": {
    prompt:
      "Explain how the security assumptions about the traditional 'security perimeter' changed with the spread of cloud computing and remote work.",
    guide:
      "The cloud and remote work blurred the boundary that used to separate a 'safe inside' from a 'dangerous outside'. Resources and users are outside the building, so the perimeter wall alone is not enough.",
  },
  "2-2-p2-home-e2": {
    prompt:
      "Give examples of the four security measures linked to the defence-in-depth layers (network entry, connection path, server placement, and endpoint devices).",
    guide:
      "Network entry: a firewall. Connection path: a VPN and encryption. Server placement: a demilitarised zone. Endpoint devices: antivirus software and an operating-system update.",
  },
  "2-2-p2-home-m1": {
    prompt:
      "What concept describes the traditional boundary that assumes everything inside the organisation's network is fully safe and everything outside it is unsafe, which cloud services and remote work have blurred?",
    options: [
      "Demilitarised zone.",
      "Security perimeter.",
      "Edge computing.",
      "Quantum superposition.",
    ],
  },
  "2-2-p2-home-m2": {
    prompt:
      "Which of the following 'defence in depth' layers is linked directly to installing antivirus software and updating the operating system?",
    options: [
      "Network entry.",
      "Connection path.",
      "Server placement.",
      "Endpoint devices.",
    ],
  },
  "2-2-wa-e1": {
    prompt:
      "Explain in detail how 'defence in depth' protects the organisation better than relying on one means of protection, using what happens when one of the defences is breached.",
    guide:
      "If the attacker breaches one layer, the next remains a barrier. A failed firewall does not mean the databases fall if a demilitarised zone and endpoint controls are in place. If the single means falls, it exposes the whole organisation.",
  },
  "2-2-wa-e2": {
    prompt:
      "Explain the technical role of the 'firewall' in monitoring network traffic, and illustrate that by protecting databases.",
    guide:
      "The firewall filters according to rules: who enters, which port, and to which service. Example: blocking direct external access to the databases and allowing only a specified internal path.",
  },
  "2-2-wa-e3": {
    prompt:
      "State the detailed concept of the 'virtual private network (VPN)', and show how it protects data sent over public Wi-Fi networks from eavesdropping.",
    guide:
      "A VPN is a private logical connection encrypted over the internet, using tunnelling techniques. On public Wi-Fi the packets are protected from eavesdropping because the content cannot be read without the tunnel key.",
  },
  "2-2-wa-e4": {
    prompt:
      "Compare in detail traditional security and the 'Zero Trust' approach, explaining why traditional designs alone are no longer adequate today.",
    guide:
      "Traditional security assumes the inside is safe after the perimeter is crossed. With the cloud and mobility the perimeter is no longer clear. Zero Trust checks identity, permission, and context on every request, so the traditional design alone is no longer enough.",
  },
  "2-2-wa-m1": {
    prompt:
      "Which of the following devices or systems monitors network traffic and allows it or blocks it according to set security rules?",
    options: [
      "Firewall.",
      "Demilitarised zone.",
      "Virtual private network.",
      "Edge computing.",
    ],
  },
  "2-2-wa-m2": {
    prompt:
      "What is the zone called in which public-facing servers are isolated from the internal network to reduce the effect of attacks?",
    options: [
      "Security perimeter.",
      "Demilitarised zone (DMZ).",
      "Connection path.",
      "Endpoint devices.",
    ],
  },
  "2-2-wa-m3": {
    prompt:
      "What term names a security approach that does not grant automatic trust to a user or device merely because they are inside the network?",
    options: [
      "Defence in depth.",
      "Firewall.",
      "Zero Trust approach.",
      "Virtual private network.",
    ],
  },
  "2-2-wa-m4": {
    prompt:
      "Which of the following is a main use of a virtual private network (VPN) for linking offices or employees?",
    options: [
      "Encrypting the connection and protecting the data over untrusted networks, or when working remotely.",
      "Automatically removing viruses that are on the hard disk.",
      "Speeding up public internet connections without any need for passwords.",
      "Providing a graphical interface for managing huge databases.",
    ],
  },
  "2-2-wb-e1": {
    prompt:
      "Explain how the 'demilitarised zone (DMZ)' protects the organisation's internal network when one public web server is compromised by an external attack.",
    guide:
      "The public web server is in the demilitarised zone. If it is compromised, it stays separated from the internal network, so the attacker does not reach the sensitive servers or the databases directly.",
  },
  "2-2-wb-e2": {
    prompt:
      "Discuss the four 'defence in depth' layers, stating the security measure linked to each layer from network entry through to the endpoint devices.",
    guide:
      "Network entry: blocking what is unauthorised with a firewall. Connection path: a VPN tunnel. Server placement: isolating public-facing servers in a DMZ. Endpoints: antivirus software and a system update.",
  },
  "2-2-wb-e3": {
    prompt:
      "Explain how applying the 'Zero Trust' approach checks every access based on identity, permissions, and context.",
    guide:
      "Every access is checked: who the requester is, with what permission, and from which device or context. There is no trust merely because the device is inside the building or owned by an employee.",
  },
  "2-2-wb-e4": {
    prompt:
      "Discuss why the traditional 'security perimeter' has become less effective in modern workplaces that rely on cloud computing and remote work.",
    guide:
      "Employees connect from home, and the cloud hosts services outside the building. The assumption that 'the inside is safe' has fallen. The perimeter alone does not see every path, and it is not enough without continuous checking.",
  },
  "2-2-wb-m1": {
    prompt:
      "The technology that creates an encrypted virtual private line over the internet for a secure connection from a remote site is:",
    options: [
      "Firewall.",
      "Virtual private network (VPN).",
      "Demilitarised zone.",
      "Zero Trust approach.",
    ],
  },
  "2-2-wb-m2": {
    prompt:
      "The defence-in-depth layer concerned with installing antivirus software and keeping the operating system updated is:",
    options: [
      "Network entry.",
      "Connection path.",
      "Server placement.",
      "Endpoint devices.",
    ],
  },
  "2-2-wb-m3": {
    prompt:
      "The traditional boundary that assumes the inside of the organisation's network is fully safe and the outside is dangerous is known as:",
    options: [
      "Security perimeter.",
      "Demilitarised zone.",
      "Quantum superposition.",
      "Edge computing.",
    ],
  },
  "2-2-wb-m4": {
    prompt:
      "A system or program that monitors network traffic and allows it or blocks it according to set security rules:",
    options: ["Firewall.", "Virtual private network.", "Qubit.", "Edge computing."],
  },
  "2-2-wc-e1": {
    prompt:
      "Discuss the security importance of using a 'virtual private network (VPN)' when connecting to untrusted networks, and how it protects the content of the connection from eavesdropping.",
    guide:
      "A public network is untrusted. A VPN creates an encrypted tunnel, so the device appears to be inside the organisation, and an eavesdropper in a café or a hotel cannot read the content of the connection.",
  },
  "2-2-wc-e2": {
    prompt:
      "Explain how the firewall, the virtual private network, the demilitarised zone, and endpoint-device controls work together to form an integrated 'defence in depth' strategy.",
    guide:
      "The firewall controls entry, the VPN protects the path, the DMZ isolates the public servers, and endpoint controls harden the devices. If one layer falls, the rest meet it. That is defence in depth.",
  },
  "2-2-wc-e3": {
    prompt:
      "Show how the 'Zero Trust' approach deals with identity, context, and permissions, compared with traditional security that trusts everything inside the perimeter.",
    guide:
      "Traditional security trusts the inside after the perimeter. Zero Trust asks for proof of identity, permission, and context every time, even from the organisation's own device.",
  },
  "2-2-wc-e4": {
    prompt:
      "Explain why placing an email server or a web server in the 'demilitarised zone (DMZ)' is a basic preventive measure for the safety of sensitive internal databases.",
    guide:
      "A mail server or a web server is exposed to the internet. Isolating it in a DMZ confines the breach there, so a direct path is not opened to the sensitive internal databases.",
  },
  "2-2-wc-m1": {
    prompt:
      "A zone where servers exposed to the external network are placed separately from the internal network is called:",
    options: [
      "Firewall.",
      "Demilitarised zone (DMZ).",
      "Virtual private network.",
      "Endpoint devices.",
    ],
  },
  "2-2-wc-m2": {
    prompt:
      "A security approach that does not grant automatic trust to a user or device merely because they are inside the network or owned by the organisation is:",
    options: [
      "Defence in depth.",
      "Zero Trust approach.",
      "Security perimeter.",
      "Firewall.",
    ],
  },
  "2-2-wc-m3": {
    prompt:
      "Which of the following represents the first layer (network entry) in a defence-in-depth strategy?",
    options: [
      "Encrypting the connection by using a virtual private network.",
      "Blocking an unauthorised connection by using a firewall.",
      "Separating public-facing servers by using a demilitarised zone.",
      "Installing antivirus software on the endpoint devices.",
    ],
  },
  "2-2-wc-m4": {
    prompt:
      "A private logical connection or network over a public network such as the internet, which uses encryption and tunnelling techniques to protect the data, is:",
    options: [
      "Virtual private network (VPN).",
      "Demilitarised zone.",
      "Firewall.",
      "Zero Trust approach.",
    ],
  },
  "2-3-p1-class-e1": {
    prompt: "What does the term 'security incident' mean, and what are its most notable typical examples?",
    guide:
      "A security incident is an event that threatens the confidentiality, integrity, or availability of information, or that violates a security policy. Typical examples: a leak of personal data, unauthorised tampering with data, and a service outage caused by an attack on a server.",
  },
  "2-3-p1-class-e2": {
    prompt:
      "Explain the six stages of incident response, stating the basic purpose of the 'preparation' and 'detection' stages.",
    guide:
      "The stages are: preparation, detection, containment, eradication, recovery, then lessons learned. Preparation sets the procedures and structures before anything happens. Detection confirms that an incident has occurred so that handling can begin.",
  },
  "2-3-p1-class-m1": {
    prompt:
      "Which of the following is a typical example of a security incident that affects the availability of the service?",
    options: [
      "Personal or confidential information leaking outward.",
      "Changing data inside a system without authorisation.",
      "A service outage because of an attack on the server.",
      "Creating response procedures and structures in advance.",
    ],
  },
  "2-3-p1-class-m2": {
    prompt:
      "What is the first stage of the incident-response model, which aims to create response procedures and structures in advance in readiness for incidents?",
    options: ["Detection.", "Preparation.", "Containment.", "Recovery."],
  },
  "2-3-p1-home-e1": {
    prompt:
      "Explain the purpose of the 'containment' and 'threat removal (eradication)' stages in the incident-response model.",
    guide:
      "Containment isolates the affected part, or limits its effect, so the problem does not spread. Eradication removes the threat and its causes, such as deleting malicious software, after the damage has been confined.",
  },
  "2-3-p1-home-e2": {
    prompt:
      "How is the risk score estimated in the lesson's simplified model? State its equation and the two basic factors that make it up.",
    guide:
      "Risk score = impact × likelihood. Impact is the amount of harm if the risk occurs, and likelihood is how probable it is that it occurs. The product ranks the priority.",
  },
  "2-3-p1-home-m1": {
    prompt:
      "What term is given to isolating the affected part, or limiting its effect in a suitable way, to stop the problem from spreading?",
    options: ["Preparation.", "Detection.", "Containment.", "Recovery."],
  },
  "2-3-p1-home-m2": {
    prompt: "How is the risk score calculated in the simplified matrix?",
    options: [
      "Impact + likelihood.",
      "Impact × likelihood.",
      "Impact − likelihood.",
      "Impact ÷ likelihood.",
    ],
  },
  "2-3-p2-class-e1": {
    prompt:
      "Explain what the 'recovery' and 'lessons learned and improvement' stages mean in the incident-response model.",
    guide:
      "Recovery returns the systems to safe operation, and it may use a sound backup. Lessons learned analyse what happened, document it, and improve the controls so the incident does not happen again.",
  },
  "2-3-p2-class-e2": {
    prompt:
      "Why must the 'containment' stage be carried out before the 'eradication (threat removal)' stage? What may happen if this order is reversed?",
    guide:
      "Containment first confines the spread. If eradication starts before isolation, the threat may move to other systems while it is being removed. The order protects the evidence and narrows the damage.",
  },
  "2-3-p2-class-m1": {
    prompt:
      "Which stage includes returning systems and services to a safe, normal operating state, and may include recovery from a sound backup?",
    options: [
      "Preparation.",
      "Containment.",
      "Recovery.",
      "Lessons learned and improvement.",
    ],
  },
  "2-3-p2-class-m2": {
    prompt:
      "Which stage closes the six stages of incident response, and includes analysing what happened and documenting the lessons in order to improve the controls?",
    options: [
      "Detection.",
      "Threat removal.",
      "Recovery.",
      "Lessons learned and improvement.",
    ],
  },
  "2-3-p2-home-e1": {
    prompt:
      "Explain how risks are handled according to the 'risk assessment matrix', and which category represents the highest priority for treatment.",
    guide:
      "The matrix classifies risks along the two dimensions of impact and likelihood. The highest priority is high impact and high likelihood, so those are treated first, before the lower categories.",
  },
  "2-3-p2-home-e2": {
    prompt:
      "Give examples of the overlap or repetition that may occur between the incident-response stages in real practice.",
    guide:
      "In practice the team may return from recovery to containment if a new spread appears, or detection may overlap with containment while the incident is being confirmed. The order is a starting point, not a rigid line with no review.",
  },
  "2-3-p2-home-m1": {
    prompt:
      "According to the risk assessment matrix, which category is among the highest priorities and must be treated first?",
    options: [
      "Low impact and low likelihood.",
      "Medium impact and medium likelihood.",
      "High impact and high likelihood.",
      "Low impact and high likelihood.",
    ],
  },
  "2-3-p2-home-m2": {
    prompt: "What does the term 'impact' mean in risk assessment?",
    options: [
      "How probable it is that the event occurs.",
      "The amount of harm if the risk occurs.",
      "The speed of the response to the security incident.",
      "The number of times the incident has been repeated.",
    ],
  },
  "2-3-wa-e1": {
    prompt:
      "Define a security incident in detail, and state three of its typical examples, with a description of each.",
    guide:
      "A security incident is a breach of confidentiality, integrity, or availability, or a violation of policy. A leak: confidential data leaving. Tampering: a change without authorisation. An outage: the service stopping because of an attack or a security fault.",
  },
  "2-3-wa-e2": {
    prompt:
      "State the six stages of incident response in sequence, with a brief explanation of the preparation and containment stages.",
    guide:
      "Preparation → detection → containment → eradication → recovery → lessons learned. Preparation readies the plan and the structures. Containment isolates what is affected and limits the spread of the damage.",
  },
  "2-3-wa-e3": {
    prompt:
      "Explain how the risk assessment matrix is used to set treatment priorities based on impact and likelihood.",
    guide:
      "Each risk is estimated for impact and for likelihood, then the risk score is their product. Cells with high impact and high likelihood come first, then the medium ones, and the low ones are deferred.",
  },
  "2-3-wa-e4": {
    prompt:
      "Discuss why carrying out the six response stages in order matters, and what kind of overlap or possible repetition there is among them during actual handling.",
    guide:
      "The order stops the damage from widening: no removal before isolation, and no return to operation before cleanup. Even so, stages may overlap or be repeated if new evidence appears during handling.",
  },
  "2-3-wa-m1": {
    prompt:
      "An event that affects the confidentiality, integrity, or availability of information, or that violates a security policy, is called:",
    options: [
      "A security incident.",
      "A risk assessment.",
      "Threat containment.",
      "A lesson learned.",
    ],
  },
  "2-3-wa-m2": {
    prompt: "The stage used to limit the spread of damage and isolate the affected part is called:",
    options: ["Preparation.", "Containment.", "Recovery.", "Eradication."],
  },
  "2-3-wa-m3": {
    prompt: "The risks that represent the highest priority in the risk assessment matrix are those with:",
    options: [
      "Low impact and fast containment.",
      "High impact and high likelihood.",
      "Small impact and low likelihood.",
      "Medium impact and zero likelihood.",
    ],
  },
  "2-3-wa-m4": {
    prompt: "What does the 'eradication' stage mean in the incident-response model?",
    options: [
      "Creating response procedures in advance.",
      "Removing the threat and its causes, such as deleting malicious software.",
      "Restoring the systems from a backup.",
      "Documenting the lessons learned.",
    ],
  },
  "2-3-wb-e1": {
    prompt:
      "Explain in detail the purpose of the 'detection' and 'threat removal (eradication)' stages within the six stages of incident response.",
    guide:
      "Detection spots the incident and confirms it after preparation. Eradication removes the cause after containment: the malicious software is deleted and the vulnerability is closed, so no path remains for a return.",
  },
  "2-3-wb-e2": {
    prompt:
      "Explain what 'impact' and 'likelihood' mean in risk assessment, and how they contribute to calculating the risk score.",
    guide:
      "Impact: the size of the harm if the risk occurs. Likelihood: how probable the occurrence is. In the simplified model the risk score is their product, which determines what is treated first.",
  },
  "2-3-wb-e3": {
    prompt:
      "Discuss the importance of the 'lessons learned and improvement' stage, and how it helps prevent security incidents from happening again in the future.",
    guide:
      "After recovery, what failed and what succeeded is documented. Improving the controls and the plan reduces the chance of a repeat. Without this stage the cause remains.",
  },
  "2-3-wb-e4": {
    prompt:
      "Compare the three types of security incident mentioned in the lesson (information leak, data tampering, and service outage) in terms of description.",
    guide:
      "A leak affects confidentiality because data leaves. Tampering affects integrity because of a change without authorisation. An outage affects availability because the service stops. All three are incidents, even though the affected pillar differs.",
  },
  "2-3-wb-m1": {
    prompt: "Changing data inside a system without authorisation is a typical example of:",
    options: [
      "A service outage.",
      "An information leak.",
      "Data tampering.",
      "Advance preparation.",
    ],
  },
  "2-3-wb-m2": {
    prompt:
      "The stage concerned with returning systems and services to a safe, normal operating state, including recovery from a backup, is:",
    options: ["Recovery.", "Containment.", "Detection.", "Preparation."],
  },
  "2-3-wb-m3": {
    prompt: "In the simplified model the risk score is calculated as follows:",
    options: [
      "Impact ÷ likelihood.",
      "Impact + likelihood.",
      "Impact × likelihood.",
      "Impact − likelihood.",
    ],
  },
  "2-3-wb-m4": {
    prompt: "What does the term 'likelihood' mean in risk assessment?",
    options: [
      "The expected size of the harm if the event occurs.",
      "How probable it is that the event or the risk occurs.",
      "The number of devices affected by the attack.",
      "The speed of carrying out the response stages.",
    ],
  },
  "2-3-wc-e1": {
    prompt:
      "Explain in detail how the 'recovery' and 'lessons learned and improvement' stages are carried out when dealing with a security incident such as a ransomware attack.",
    guide:
      "After ransomware: recovery from a sound copy after the cause is isolated, not a blind payment. The vulnerability, the copies, and the permissions are then reviewed, and lessons are documented that prevent the malicious encryption from happening again.",
  },
  "2-3-wc-e2": {
    prompt:
      "Discuss the relationship between the 'containment' and 'eradication' stages, and why containment must come before the cause is removed.",
    guide:
      "Containment confines the device or the account. Eradication after that cleans the cause. The reverse may spread the infection during the scan, or erase evidence needed for the review.",
  },
  "2-3-wc-e3": {
    prompt:
      "State the six stages of incident response in sequence, and show how overlaps, or a return to earlier stages, can happen during the actual response.",
    guide:
      "Preparation, detection, containment, eradication, recovery, lessons learned. Containment may be repeated after a partial recovery, or detection may overlap with isolation. The plans expect a return rather than confusion.",
  },
  "2-3-wc-e4": {
    prompt:
      "Explain how organisations use the risk assessment matrix to classify risks and direct effort toward effective first treatment.",
    guide:
      "The organisation places each risk on an impact × likelihood grid. Effort goes first to the highest-risk cells, so resources are not used up on risks with a weak effect or that are rare.",
  },
  "2-3-wc-m1": {
    prompt:
      "Personal or confidential information leaking outward represents a security incident of the type:",
    options: [
      "Information leak.",
      "Service outage.",
      "Data tampering.",
      "Safe recovery.",
    ],
  },
  "2-3-wc-m2": {
    prompt:
      "Analysing what happened, documenting the lessons, and improving the controls to reduce the chance of a repeat takes place in the stage:",
    options: [
      "Preparation.",
      "Containment.",
      "Eradication.",
      "Lessons learned and improvement.",
    ],
  },
  "2-3-wc-m3": {
    prompt:
      "Risks with high impact and low likelihood in the risk assessment matrix are usually classified as having a risk level of:",
    options: ["Very high.", "Medium.", "Very low.", "None."],
  },
  "2-3-wc-m4": {
    prompt:
      "The stage that includes detecting and confirming that a security incident has occurred, after advance preparation, is the stage of:",
    options: ["Recovery.", "Detection.", "Lessons learned.", "Eradication."],
  },
};
