document.addEventListener("DOMContentLoaded", () => {
  let score = 0;
  let health = 100;
  let quesIndex = 0;
  let gameStarted = false;
  let virusInterval;
  let startTime = null;
  let playerAnswers = [];
  let level = 1;

  const updateLevelStatus = () => {
    const levelElement = document.getElementById("level");
    levelElement.innerText = `${level}`;
  };

  const checkForLevelUp = () => {
    const requiredKills = ((level * (level + 1)) / 2) * 10;
    if (score >= requiredKills) {
      level++;

      updateLevelStatus();
    }
  };

  const scoreElement = document.getElementById("score");
  const healthElement = document.getElementById("health");
  const deployButton = document.getElementById("deploy-button");
  const codeInput = document.getElementById("code-input");
  const quesElement = document.getElementById("ques");
  const playButton = document.getElementById("play-button");
  const optionsContainer = document.getElementById("options-container");
  const correctAnswerSound = new Audio("media/success_bell.mp3");
  const wrongAnswerSound = new Audio("media/error.mp3");
  const gameOverSound = new Audio("media/game-over.mp3");

  const codeActions = {
    eliminate: () => {
      const viruses = document.querySelectorAll(".virus");
      viruses.forEach((virus) => {
        virus.dispatchEvent(new Event("transitionend"));
        score++; // Increment score as player eliminated a virus
        checkForLevelUp(); // Check if the player should level up
        scoreElement.innerText = score;
      });
    },
    shield: () => {
      health += 5;
      healthElement.innerText = health;
    },
  };

  // eliminateQuestions
  const eliminateQuestions = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Tool Markup Language",
        "HyperText Markup Language",
        "HyperText Mark Language",
        "Hyper Texting Markup Language",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "Which HTML element is used to define important text?",
      options: ["<highlight>", "<bold>", "<strong>", "<important>"],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How do you add a background color in CSS?",
      options: [
        "color: red;",
        "background-color: red;",
        "bgcolor: red;",
        "background: red;",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "How do you select an element with the id 'myElement' in CSS?",
      options: [".myElement", "#myElement", "myElement", "*myElement"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "What is the purpose of the JavaScript 'alert' function?",
      options: [
        "To display a message in an alert box",
        "To record errors in the console",
        "To hide all the images on the page",
        "To exit the application",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "What does DOM stand for in JavaScript?",
      options: [
        "Display Object Management",
        "Data Object Model",
        "Direct Object Manager",
        "Document Object Model",
      ],
      correctOption: 4,
      action: "eliminate",
    },
    {
      question:
        "What is the correct way to add a JavaScript file called 'script.js' in HTML?",
      options: [
        "<script src='script.js'>",
        "<javascript src='script.js'></javascript>",
        "<script href='script.js'>",
        "<link rel='javascript' src='script.js'>",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "Which of these tags are all <table> tags?",
      options: [
        "<table><head><tbody>",
        "<table><tr><tt>",
        "<table><tr><td>",
        "<thead><table><tr>",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How can you make a numbered list?",
      options: ["<dl>", "<ol>", "<ul>", "<list>"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "What is the correct HTML for making a text input field?",
      options: [
        "<textinput>",
        "<input type='text'>",
        "<textfield>",
        "<inputtext>",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheet",
        "Creative Style System",
        "Cascading Style Sheet",
        "Colorful Style Sheet",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How do you create a function in JavaScript?",
      options: [
        "function = myFunction()",
        "function:myFunction()",
        "function myFunction()",
        "myFunction function()",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How do you call a JavaScript function?",
      options: [
        "call function myFunction()",
        "call myFunction()",
        "myFunction()",
        "myFunction(call)",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How do you write an IF statement in JavaScript?",
      options: ["if i = 5", "if i = 5 then", "if (i == 5)", "if i == 5 then"],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "How can you add a comment in a JavaScript?",
      options: [
        "`This is a comment",
        "//This is a comment",
        "<!--This is a comment-->",
        "??This is a comment",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question:
        "What is the correct JavaScript syntax to change the content of the HTML element below? `<p id='demo'>This is a demonstration.</p>`",
      options: [
        "document.getElement('p').innerHTML = 'Hello World!';",
        "document.getElementById('demo').innerHTML = 'Hello World!';",
        "document.getElementByName('p').innerHTML = 'Hello World!';",
        "#demo.innerHTML = 'Hello World!';",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question:
        "What is the correct syntax for referring to an external script called 'xxx.js'?",
      options: [
        "<script src='xxx.js'>",
        "<script href='xxx.js'>",
        "<script link='xxx.js'>",
        "<script name='xxx.js'>",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "How do you declare a JavaScript variable?",
      options: [
        "let carName;",
        "variable carName;",
        "v carName;",
        "let = carName;",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "What is the correct HTML element for inserting a line break?",
      options: ["<br>", "<break>", "<lb>", "<line>"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question:
        "How do you change the background color of an HTML element in JavaScript?",
      options: [
        "document.getElement('body').style.background='red'",
        "document.getElement('body').style.backgroundColor='red'",
        "document.getElement('body').bgColor='red'",
        "document.getElement('body').style.background-color='red'",
      ],
      correctOption: 2,
      action: "eliminate",
    },

    {
      question: "How do you create a JavaScript array?",
      options: [
        "let colors = ['red', 'green', 'blue']",
        "let colors = 'red', 'green', 'blue'",
        "let colors = 1=('red'), 2=('green'), 3=('blue')",
        "let colors = (1:'red', 2:'green', 3:'blue')",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "How do you create a hyperlink in HTML?",
      options: [
        "<a href='https://example.com'>Link</a>",
        "<link href='https://example.com'>Link</link>",
        "<hyperlink src='https://example.com'>Link</hyperlink>",
        "<web href='https://example.com'>Link</web>",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "What is the correct HTML element for the largest heading?",
      options: ["<heading>", "<h1>", "<h6>", "<head>"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question:
        "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
      options: ["src", "href", "alt", "target"],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "Which event occurs when the user clicks on an HTML element?",
      options: ["onmouseclick", "onchange", "onblur", "onclick"],
      correctOption: 4,
      action: "eliminate",
    },
    {
      question: "How do you write 'Hello World' in an alert box in JavaScript?",
      options: [
        "msgBox('Hello World');",
        "alert('Hello World');",
        "alertBox('Hello World');",
        "msg('Hello World');",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "Which symbol is used for comments in JavaScript?",
      options: ["//", "/* */", "<!-- -->", "Both 1 and 2"],
      correctOption: 4,
      action: "eliminate",
    },
    {
      question: "How can you add a class to an element using JavaScript?",
      options: [
        "element.addClassName('newClass')",
        "element.addClass('newClass')",
        "element.classList.add('newClass')",
        "element.className.add('newClass')",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question: "Which is NOT a programming language?",
      options: ["Python", "Java", "HTML", "C++"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question:
        "Which HTML attribute is used to specify the destination of a link?",
      options: ["href", "src", "destination", "link"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "What does the 'alt' attribute in an <img> element represent?",
      options: [
        "alternate text",
        "altitude of image",
        "alignment",
        "alternative source",
      ],
      correctOption: 1,
      action: "eliminate",
    },

    {
      question: "How do you select all <p> elements in CSS?",
      options: ["p{}", ".p{}", "#p{}", "$p{}"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "Which property is used to change the font of an element?",
      options: ["font-style", "font-weight", "text-style", "font-family"],
      correctOption: 4,
      action: "eliminate",
    },
    {
      question:
        "Which property is used to change the text color of an element?",
      options: ["color", "font-color", "text-color", "font"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question:
        "How do you make each word in a text start with a capital letter?",
      options: [
        "text-transform:capitalize",
        "You can't do that with CSS",
        "text-style:capitalized",
        "text:capitalized",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "How do you make the text bold in CSS?",
      options: [
        "font: bold;",
        "font-weight: bold;",
        "font-bold: yes;",
        "text: bold;",
      ],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "Which JavaScript method is used to get an element by its ID?",
      options: ["get()", "getElementById()", "getById()", "getElement()"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "Which of the following is not a JavaScript data type?",
      options: ["String", "Number", "Image", "Boolean"],
      correctOption: 3,
      action: "eliminate",
    },

    {
      question: "Which HTML tag is used to define a JavaScript block?",
      options: ["<script>", "<javascript>", "<js>", "<code>"],
      correctOption: 1,
      action: "eliminate",
    },

    {
      question: "Which HTML element is used to display a data cell in a table?",
      options: ["<td>", "<cell>", "<dc>", "<data>"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "Which tag allows you to add a row in HTML?",
      options: ["<row>", "<tr>", "<td>", "<add>"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "Which tag is used to add an item in the list?",
      options: ["<li>", "<ul>", "<ol>", "<item>"],
      correctOption: 1,
      action: "eliminate",
    },

    {
      question: "How do you define a constant in JavaScript?",
      options: ["constant x = 1;", "const x = 1;", "x := 1;", "define x = 1;"],
      correctOption: 2,
      action: "eliminate",
    },

    {
      question: "How to write an inline style to set the font size to 20px?",
      options: [
        "style='font-size:20px'",
        "style:font-size=20px",
        "font-size:style=20px",
        "style='set-font:20px'",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question:
        "What is the default display value for the 'div' element in CSS?",
      options: ["block", "inline", "inline-block", "none"],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question:
        "In HTML, which attribute is used to specify the type of input element?",
      options: ["type", "inputType", "elementType", "kind"],
      correctOption: 1,
      action: "eliminate",
    },

    {
      question: "What does the 'DOMContentLoaded' event signify in JavaScript?",
      options: [
        "The user has clicked on the document",
        "The document and all sub-resources have finished loading",
        "The HTML document has been fully parsed",
        "The browser has lost connection",
      ],
      correctOption: 3,
      action: "eliminate",
    },
    {
      question:
        "Which of these CSS units is not relative to the size of the parent element?",
      options: ["em", "px", "rem", "%"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question:
        "How do you access the first element of an array named 'fruits' in JavaScript?",
      options: ["fruits[1]", "fruits[0]", "fruits.first", "fruits(1)"],
      correctOption: 2,
      action: "eliminate",
    },
    {
      question: "In HTML, what does the 'required' attribute do?",
      options: [
        "Prevents a form from being submitted if the input field is empty",
        "Makes sure that an input field is unique",
        "Checks if the input is a valid email",
        "Makes the input field hidden",
      ],
      correctOption: 1,
      action: "eliminate",
    },
    {
      question: "What does the 'this' keyword refer to in JavaScript?",
      options: [
        "The current function",
        "The object that the function is a method of",
        "The current element",
        "The global object",
      ],
      correctOption: 2,
      action: "eliminate",
    },
  ];

// shieldQuestions
  const shieldQuestions = [
    {
      question: "What should you do if someone is choking?",
      options: [
        "Offer them water",
        "Perform the Heimlich maneuver",
        "Ask them to cough harder",
        "Both 2 and 3",
      ],
      correctOption: 4,
      action: "shield",
    },
    {
      question:
        "In the case of a severe external bleeding, what is the first thing you should do?",
      options: [
        "Elevate the wound",
        "Apply a tourniquet",
        "Apply pressure to the wound",
        "Clean the wound",
      ],
      correctOption: 3,
      action: "shield",
    },
    {
      question: "Which of the following is not a sign of a heart attack?",
      options: [
        "Pain in the chest",
        "Shortness of breath",
        "Tingling in the left hand",
        "Sudden severe headache",
      ],
      correctOption: 4,
      action: "shield",
    },
    {
      question:
        "What is the correct ratio of chest compressions to breaths when performing CPR on an adult?",
      options: ["15:2", "30:2", "5:1", "100:30"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What should you do if you suspect someone is having a stroke?",
      options: [
        "Ask them to raise both arms",
        "Check for slurred speech",
        "Call emergency services",
        "All of the above",
      ],
      correctOption: 4,
      action: "shield",
    },
    {
      question:
        "For which type of burn should you use cold water to cool the area?",
      options: [
        "First-degree burns",
        "Second-degree burns",
        "Third-degree burns",
        "Both first and second-degree burns",
      ],
      correctOption: 4,
      action: "shield",
    },
    {
      question: "What number should you call for emergency services in the UK?",
      options: ["911", "112", "999", "123"],
      correctOption: 3,
      action: "shield",
    },
    {
      question:
        "What is the name of the NHS service that offers urgent medical help when it's not a life-threatening situation?",
      options: ["Emergency Care", "Urgent Care", "NHS 111", "First Aid Unit"],
      correctOption: 3,
      action: "shield",
    },

    {
      question: "What does A&E stand for in the context of the NHS?",
      options: [
        "Accident & Emergency",
        "Assistance & Emergency",
        "Accident & Evaluation",
        "Assessment & Emergency",
      ],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "What kind of assistance does the NHS ambulance service provide?",
      options: [
        "Only transport to the hospital",
        "Immediate care for life-threatening illnesses and injuries",
        "Deliveries for pharmacies",
        "Fire rescue services",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "How can you help ease the burden on emergency services?",
      options: [
        "Call for non-emergencies",
        "Use emergency services appropriately and consider alternatives like GP or NHS 111 when suitable",
        "Go to A&E for minor issues",
        "Ask for ambulance transport for non-urgent cases",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "In which year was the NHS founded? 5th of July is its Birthday",
      options: ["1948", "1952", "1938", "1960"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the primary aim of the NHS?",
      options: [
        "Provide military healthcare",
        "Provide healthcare to all UK residents free at the point of use",
        "Provide healthcare only to employed individuals",
        "Provide health insurance",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What color is commonly associated with the NHS logo?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "What vitamin is produced when a person is exposed to sunlight?",
      options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
      correctOption: 4,
      action: "shield",
    },
    {
      question: "What is the normal human body temperature in Celsius?",
      options: ["36.5°C", "37°C", "37.5°C", "38°C"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What does BMI stand for?",
      options: [
        "Basic Metabolic Index",
        "Body Mass Index",
        "Brain Mass Index",
        "Body Muscle Index",
      ],
      correctOption: 2,
      action: "shield",
    },

    {
      question: "Which blood type is known as the universal donor?",
      options: ["A", "B", "AB", "O"],
      correctOption: 4,
      action: "shield",
    },
    {
      question: "What is the largest internal organ of the human body?",
      options: ["Brain", "Liver", "Lungs", "Kidneys"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the most common blood type?",
      options: ["A+", "O+", "B-", "AB+"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "How many chambers does the human heart have?",
      options: ["2", "4", "6", "8"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "Which organ produces insulin?",
      options: ["Pancreas", "Liver", "Kidneys", "Lungs"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the main function of red blood cells?",
      options: [
        "Fight Infection",
        "Carry Oxygen",
        "Clot Blood",
        "Absorb Nutrients",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the medical term for low blood sugar?",
      options: [
        "Hyperglycemia",
        "Hypoglycemia",
        "Hyperlipidemia",
        "Hypolipidemia",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the human body’s biggest organ?",
      options: ["Skin", "Liver", "Brain", "Lungs"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "How many bones are in the human body?",
      options: ["206", "215", "224", "195"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "Which nutrient is essential for building and repairing cells?",
      options: ["Protein", "Fat", "Carbohydrates", "Vitamin C"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the most abundant gas in the Earth's atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the common name for the trachea?",
      options: ["Windpipe", "Gullet", "Food pipe", "Air tube"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the primary function of the large intestine?",
      options: [
        "Absorb Nutrients",
        "Produce Bile",
        "Absorb Water",
        "Produce Insulin",
      ],
      correctOption: 3,
      action: "shield",
    },
    {
      question: "What is the most common human blood type allele?",
      options: ["A", "B", "O", "AB"],
      correctOption: 3,
      action: "shield",
    },
    {
      question: "What is the gestation period of a human pregnancy typically?",
      options: ["9 months", "8 months", "10 months", "7 months"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "Which part of the human body stores bile?",
      options: ["Gallbladder", "Liver", "Stomach", "Small intestine"],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "What is the recommended daily caloric intake for an average adult?",
      options: [
        "1,500 calories",
        "2,000 calories",
        "2,500 calories",
        "3,000 calories",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "Which vaccination is given to newborn babies to protect them from tuberculosis?",
      options: ["MMR", "BCG", "HPV", "DTP"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What does GP stand for in the UK healthcare system?",
      options: [
        "General Practitioner",
        "Governmental Practitioner",
        "Generalized Patient",
        "Grouped Practice",
      ],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "What is the recommended minimum minutes of exercise per week for adults?",
      options: ["90 minutes", "150 minutes", "200 minutes", "250 minutes"],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "What is the UK’s recommended maximum daily intake of salt for an adult?",
      options: ["3g", "6g", "9g", "12g"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the main symptom of asthma?",
      options: ["Shortness of breath", "Nausea", "Headaches", "Joint pain"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "Which of these is NOT a symptom of diabetes?",
      options: [
        "Increased thirst",
        "Frequent urination",
        "Blurred vision",
        "Increased hair growth",
      ],
      correctOption: 4,
      action: "shield",
    },
    {
      question:
        "What is the recommended way to check for the early signs of breast cancer?",
      options: ["Blood test", "Breast self-exam", "Bone scan", "Urine test"],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "What type of medication is usually prescribed to people suffering from high cholesterol?",
      options: ["Statins", "Antibiotics", "Antihistamines", "Beta blockers"],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the UK’s leading cancer charity called?",
      options: [
        "Cancer Research UK",
        "Macmillan Cancer Support",
        "Marie Curie",
        "Breast Cancer Now",
      ],
      correctOption: 1,
      action: "shield",
    },
    {
      question: "What is the legal age to purchase tobacco products in the UK?",
      options: ["16", "18", "21", "25"],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the legal drinking age in the UK?",
      options: ["16", "18", "21", "25"],
      correctOption: 2,
      action: "shield",
    },

    {
      question:
        "What is the UK’s recommended maximum weekly alcohol units intake for men and women?",
      options: ["14 units", "21 units", "28 units", "35 units"],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "What is the name of the UK charity that focuses on mental health awareness and support?",
      options: ["Mind", "Heart", "Brain Trust", "MentalUK"],
      correctOption: 1,
      action: "shield",
    },

    {
      question:
        "What term describes a mental health condition characterized by extreme mood swings?",
      options: [
        "Bipolar Disorder",
        "Schizophrenia",
        "Depression",
        "Anxiety Disorder",
      ],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "Which free emergency helpline number can be dialed in the UK for urgent mental health help?",
      options: ["111", "999", "123", "911"],
      correctOption: 1,
      action: "shield",
    },
    {
      question:
        "What does the acronym CBT stand for in the context of mental health treatment?",
      options: [
        "Complete Brain Therapy",
        "Cognitive Behavioral Therapy",
        "Centralized Brain Training",
        "Cognitive Brain Training",
      ],
      correctOption: 2,
      action: "shield",
    },

    {
      question:
        "In the UK, what is the usual first step to take if you believe you are experiencing mental health issues?",
      options: [
        "Call a friend",
        "Book an appointment with a GP",
        "Buy medication",
        "Start exercising",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "In the UK, what is the common name for the National Health Service clinics that provide contraception and sexual health advice?",
      options: [
        "Sexual Health Hubs",
        "GUM Clinics",
        "Healthy Choices",
        "Family Planning Centers",
      ],
      correctOption: 2,
      action: "shield",
    },
    {
      question: "What is the age of sexual consent in the United Kingdom?",
      options: ["14", "16", "18", "21"],
      correctOption: 2,
      action: "shield",
    },

    {
      question: "What is a common barrier method of contraception?",
      options: ["Contraceptive pill", "Condom", "IUD", "Patch"],
      correctOption: 2,
      action: "shield",
    },
    {
      question:
        "What does the term STI stand for in the context of sexual health?",
      options: [
        "Sexual Transmitted Infection",
        "Sexual Treatment Information",
        "Sexual Therapy Institute",
        "Sexual Transmitted Illness",
      ],
      correctOption: 1,
      action: "shield",
    },
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(eliminateQuestions);
  shuffleArray(shieldQuestions);

  const questions = [];

  for (let i = 0; i < eliminateQuestions.length; i++) {
    questions.push(eliminateQuestions[i]);

    // Check if there is a shield question to pair with the eliminate question
    if (shieldQuestions[i]) {
      questions.push(shieldQuestions[i]);
    }
  }

  function displayQuestion(index) {
    const question = questions[index];
    quesElement.innerText = question.question;
    optionsContainer.innerHTML = "";

    // Remove previous classes
    optionsContainer.classList.remove("eliminate-question", "shield-question");

    // Add the appropriate class for the current question
    if (question.action === "eliminate") {
      optionsContainer.classList.add("eliminate-question");
    } else if (question.action === "shield") {
      optionsContainer.classList.add("shield-question");
    }

    question.options.forEach((option, i) => {
      const optionElement = document.createElement("div");
      optionElement.innerText = `${i + 1}. ${option}`;
      optionsContainer.appendChild(optionElement);
    });
  }

  displayQuestion(quesIndex);

  let gameEnded = false; // Add this flag outside of the createVirus function

  const createVirus = () => {
    if (!gameStarted || gameEnded) return;

    const virus = document.createElement("div");
    virus.classList.add("virus");
    virus.style.top = Math.random() * 400 + "px";
    virus.style.left = -30 + "px";

    // Add eyes
    const leftEye = document.createElement("div");
    leftEye.classList.add("eye", "left");
    virus.appendChild(leftEye);

    const rightEye = document.createElement("div");
    rightEye.classList.add("eye", "right");
    virus.appendChild(rightEye);

    // Add irises
    const leftIris = document.createElement("div");
    leftIris.classList.add("iris");
    leftEye.appendChild(leftIris);

    const rightIris = document.createElement("div");
    rightIris.classList.add("iris");
    rightEye.appendChild(rightIris);

    // Add mouth
    const mouth = document.createElement("div");
    mouth.classList.add("mouth");
    virus.appendChild(mouth);

    document.getElementById("game-board").appendChild(virus);

    let position = 0;
    let virusRemoved = false;

    // Adjust speed based on screen width
    let speed = window.innerWidth > 768 ? 5 : 3;

    // Make the interval shorter as the player levels up
    const intervalTime = 200 / level;

    const interval = setInterval(
      () => {
        if (position >= window.innerWidth) {
          clearInterval(interval);
          if (!virusRemoved) {
            virus.remove();

            if (health <= 0) return;

            health -= 5;
            healthElement.innerText = health;
            console.log("Health decreased due to virus reaching the edge");
          }

          if (health <= 0) {
            gameEnded = true;
            const endTime = Date.now();
            const durationInSeconds = Math.floor((endTime - startTime) / 1000);
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            const message = `Game Over! You hunted viruses for ${minutes} minutes and ${seconds} seconds and killed ${score} of them and reached Level: ${level}. Want to try again?`;
            showModal(message);
            setTimeout(() => {
              gameOverSound.play();
            }, 1000);
          }
        } else {
          position += speed;
          virus.style.left = position + "px";
        }
      },
      intervalTime,
      window.innerWidth > 768 ? 100 : 150
    ); // Slower on small screens

    virus.addEventListener("transitionend", () => {
      clearInterval(interval);
      virusRemoved = true;
      virus.remove();
    });
  };

  const deployCode = () => {
    if (!gameStarted) {
      alert("Please start the game by clicking the Play button.");
      return;
    }

    const question = questions[quesIndex];
    const code = parseInt(codeInput.value, 10);

    // Inside the deployCode function:
    playerAnswers.push({ question: questions[quesIndex], playerChoice: code });

    if (code === question.correctOption) {
      correctAnswerSound.play();
      const action = codeActions[question.action];
      if (action) {
        action();
      }
    } else {
      wrongAnswerSound.play();
      health -= 5;
      updateHealthBar(health); // Add this line
      healthElement.innerText = health;
      if (health <= 0) {
        gameStarted = false;
        clearInterval(virusInterval);
        virusInterval = null;

        const endTime = Date.now();
        const durationInSeconds = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;

        const message = `Game Over! You hunted viruses for ${minutes} minutes and ${seconds} seconds and killed ${score} of them and reached Level: ${level}. Want to try again?`;
        showModal(message);
        setTimeout(() => {
          gameOverSound.play();
        }, 1000);

        // location.reload();
      }
    }

    codeInput.value = "";
    quesIndex++;

    if (quesIndex < questions.length) {
      // Display the next question if it exists
      displayQuestion(quesIndex);
    } else {
      // All questions have been used,  end the game or do something else
      alert("All questions have been used!");
      gameStarted = false; // Optionally end the game
    }
  };

  deployButton.addEventListener("click", deployCode);

  codeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      deployCode();
    }
  });

  playButton.addEventListener("click", () => {
    if (!gameStarted) {
      startTime = Date.now();

      gameStarted = true;
      playButton.disabled = true;
      if (!virusInterval) {
        virusInterval = setInterval(createVirus, 2000);
      }
    }
  });



  document
    .getElementById("review-answers-button")
    .addEventListener("click", displayReview);

  function displayReview() {
    const reviewContainer = document.getElementById("review-container");

    reviewContainer.style.display = "block"; // Make sure this line is here

    let reviewContent = "";
    let correctAnswersCount = 0;

    for (let playerAnswer of playerAnswers) {
      const question = playerAnswer.question;
      const playerChoice = playerAnswer.playerChoice;
      const correctChoice = question.correctOption;

      if (playerChoice === correctChoice) {
        correctAnswersCount++;
      }

      reviewContent += `<p>Question: ${question.question}</p>`;
      reviewContent += `<p>Your Answer: ${
        question.options[playerChoice - 1]
      }</p>`;
      reviewContent += `<p>Correct Answer: ${
        question.options[correctChoice - 1]
      }</p><br>`;
    }

    // Append the total correct answers count after the loop
    reviewContent += `<p><strong>Total Correct Answers: ${correctAnswersCount} out of ${playerAnswers.length}</strong></p>`;

    reviewContainer.innerHTML = reviewContent;
  }
});


function showModal(message) {
  document.getElementById("game-over-message").innerText = message;
  document.getElementById("game-over-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("game-over-modal").style.display = "none";
}

function restartGame() {
  closeModal();
  location.reload();
}

function goToLink(link) {
  window.open(link, "_blank");
}

document.getElementById("reset-button").addEventListener("click", function () {
  location.reload();
});

function reloadPage() {
  location.reload();
}



document.addEventListener("DOMContentLoaded", function () {
  const music = document.getElementById("background-music");
  const muteButton = document.getElementById("mute-button");

  const tracks = [
    "media/evil-cue.mp3",
    "media/bellaCiaoItalian.mp3",
    "media/intro.mp3",
    "media/rick.mp3",
    "media/8bit.mp3",
    "media/piano.mp3",
    "media/instrument.mp3",
    "media/bellaCiao.mp3",
  ];

  
  let currentTrackIndex = 0;

  // Function to change the track
  function changeTrack() {
    music.src = tracks[currentTrackIndex];
    music.play();
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // loop back to the first track after the last track
  }

  // Play the first track
  changeTrack();

  // When the current track ends, play the next one
  music.addEventListener("ended", changeTrack);

  // Initially, set the audio to muted
  music.muted = true;

  // Toggle mute/unmute when the button is clicked
  muteButton.addEventListener("click", function () {
    music.muted = !music.muted;
    muteButton.innerHTML = music.muted ? "Music" : "Mute";
  });
});



function updateHealthBar(health) {
  const healthBar = document.getElementById("health-bar");

  let healthPercentage = health;
  if (health > 100) healthPercentage = 100; // Maximum bar width is 100%
  if (health < 0) healthPercentage = 0;

  healthBar.style.width = healthPercentage + "%";

  if (health > 100) {
    healthBar.style.backgroundColor = "blue";
  } else if (health <= 100 && health > 50) {
    healthBar.style.backgroundColor = "green";
  } else if (health <= 50 && health > 25) {
    healthBar.style.backgroundColor = "yellow";
  } else if (health <= 25) {
    healthBar.style.backgroundColor = "red";
  }
}
