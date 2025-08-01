import fs from "fs";

const firstNames = [
    "John", "Jane", "Michael", "Emma", "William", "Olivia", "James", "Sophia", "Robert", "Ava",
    "David", "Isabella", "Daniel", "Mia", "Joseph", "Charlotte", "Thomas", "Amelia", "Christopher", "Harper",
    "Andrew", "Evelyn", "Matthew", "Abigail", "Alexander", "Emily", "Benjamin", "Elizabeth", "Nicholas", "Sofia",
    "Samuel", "Victoria", "Ryan", "Grace", "Nathan", "Chloe", "Kevin", "Zoe", "Jonathan", "Hannah",
    "Lucas", "Natalie", "Christian", "Lily", "Justin", "Madison", "Noah", "Scarlett", "Dylan", "Aria"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
    "Clark", "Lewis", "Walker", "Hall", "Young", "Allen", "King", "Wright", "Scott", "Green",
    "Baker", "Adams", "Nelson", "Hill", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans",
    "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Morris", "Murphy", "Cook", "Rogers"
];

const generateData = () => {
    const data = [];

    for (let i = 0; i < 200; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const type = Math.random() > 0.1 ? "Member" : "Administrator";
        const email = `${ firstName.toLowerCase() }.${ lastName.toLowerCase() }${ i }@example.com`;

        data.push([
            {
                column: "firstName",
                className: "px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900",
                value: firstName
            },
            {
                column: "lastName",
                value: lastName
            },
            {
                column: "type",
                value: type,
            },
            {
                column: "emailAddress",
                value: email
            }
        ]);
    }

    return data;
};

const exampleData = generateData();
fs.writeFileSync("test/e2e/example.json", JSON.stringify(exampleData, null, 2));
