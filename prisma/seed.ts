import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seed...");

	await prisma.userProgrammingLanguage.deleteMany();
	await prisma.userJobTitle.deleteMany();
	await prisma.programmingLanguage.deleteMany();
	await prisma.jobTitle.deleteMany();
	await prisma.user.deleteMany();

	console.log("📚 Creating programming languages...");
	const languages = await Promise.all([
		prisma.programmingLanguage.create({ data: { name: "JavaScript" } }),
		prisma.programmingLanguage.create({ data: { name: "TypeScript" } }),
		prisma.programmingLanguage.create({ data: { name: "Python" } }),
		prisma.programmingLanguage.create({ data: { name: "Java" } }),
		prisma.programmingLanguage.create({ data: { name: "C++" } }),
		prisma.programmingLanguage.create({ data: { name: "C#" } }),
		prisma.programmingLanguage.create({ data: { name: "Go" } }),
		prisma.programmingLanguage.create({ data: { name: "Rust" } }),
		prisma.programmingLanguage.create({ data: { name: "PHP" } }),
		prisma.programmingLanguage.create({ data: { name: "Ruby" } }),
		prisma.programmingLanguage.create({ data: { name: "Swift" } }),
		prisma.programmingLanguage.create({ data: { name: "Kotlin" } }),
		prisma.programmingLanguage.create({ data: { name: "Dart" } }),
		prisma.programmingLanguage.create({ data: { name: "Scala" } }),
		prisma.programmingLanguage.create({ data: { name: "R" } }),
	]);

	console.log("💼 Creating job titles...");
	const jobTitles = await Promise.all([
		prisma.jobTitle.create({ data: { name: "Software Engineer" } }),
		prisma.jobTitle.create({ data: { name: "Full Stack Developer" } }),
		prisma.jobTitle.create({ data: { name: "Frontend Developer" } }),
		prisma.jobTitle.create({ data: { name: "Backend Developer" } }),
		prisma.jobTitle.create({ data: { name: "Student" } }),
		prisma.jobTitle.create({ data: { name: "Web Developer" } }),
		prisma.jobTitle.create({ data: { name: "Mobile Developer" } }),
		prisma.jobTitle.create({ data: { name: "Data Engineer" } }),
		prisma.jobTitle.create({ data: { name: "DevOps Engineer" } }),
		prisma.jobTitle.create({ data: { name: "Machine Learning Engineer" } }),
		prisma.jobTitle.create({ data: { name: "QA Engineer" } }),
		prisma.jobTitle.create({ data: { name: "UI/UX Designer" } }),
	]);

	const passwordHash = await bcrypt.hash(
		process.env.SEED_DATA_PW as string,
		10,
	);

	const getRandomItems = <T>(array: T[], min: number, max: number): T[] => {
		const count = Math.floor(Math.random() * (max - min + 1)) + min;
		const shuffled = [...array].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const firstNames = [
		"Sarah",
		"Marcus",
		"Emily",
		"David",
		"Aisha",
		"James",
		"Maria",
		"Alex",
		"Jessica",
		"Michael",
		"Sophia",
		"Daniel",
		"Olivia",
		"Christopher",
		"Emma",
		"Matthew",
		"Isabella",
		"Andrew",
		"Ava",
		"Joshua",
		"Mia",
		"Ryan",
		"Charlotte",
		"Nicholas",
		"Amelia",
		"Tyler",
		"Harper",
		"Kevin",
		"Evelyn",
		"Brandon",
		"Abigail",
		"Jason",
		"Ella",
		"Jonathan",
		"Scarlett",
		"Justin",
		"Grace",
		"Samuel",
		"Chloe",
		"Benjamin",
		"Victoria",
		"Nathan",
		"Madison",
		"Aaron",
		"Luna",
		"Christian",
		"Penelope",
		"Dylan",
		"Layla",
		"Ethan",
	];

	const lastNames = [
		"Chen",
		"Johnson",
		"Rodriguez",
		"Kim",
		"Patel",
		"Wilson",
		"Santos",
		"Turner",
		"Garcia",
		"Martinez",
		"Nguyen",
		"Lee",
		"Wang",
		"Singh",
		"Ahmed",
		"Brown",
		"Davis",
		"Miller",
		"Anderson",
		"Taylor",
		"Thomas",
		"Moore",
		"Jackson",
		"White",
		"Harris",
		"Martin",
		"Thompson",
		"Garcia",
		"Martinez",
		"Robinson",
		"Clark",
		"Lewis",
		"Walker",
		"Hall",
		"Young",
		"Allen",
		"King",
		"Wright",
		"Lopez",
		"Hill",
		"Scott",
		"Green",
		"Adams",
		"Baker",
		"Nelson",
		"Carter",
		"Mitchell",
		"Perez",
		"Roberts",
		"Campbell",
	];

	const bioTemplates = [
		"Passionate developer with expertise in building scalable applications.",
		"Full-time coder, part-time coffee enthusiast. Love solving complex problems.",
		"Building the future one line of code at a time.",
		"Software engineer focused on clean code and best practices.",
		"Tech enthusiast with a love for learning new technologies.",
		"Creating innovative solutions through code.",
		"Experienced developer specializing in modern web technologies.",
		"Dedicated to crafting efficient and maintainable software.",
		"Always exploring new frameworks and programming paradigms.",
		"Computer science graduate passionate about software development.",
		"Building amazing user experiences through code.",
		"Lifelong learner committed to continuous improvement.",
		"Turning ideas into reality with clean, efficient code.",
		"Problem solver who loves tackling challenging projects.",
		"Developer with a keen eye for detail and performance.",
		"Coding by day, debugging by night.",
		"Passionate about open source and collaborative development.",
		"Building robust and scalable software solutions.",
		"Tech geek who loves to experiment with new tools.",
		"Developer focused on writing maintainable and testable code.",
	];

	console.log("👥 Creating 50 users...");

	for (let i = 0; i < 50; i++) {
		const firstName = firstNames[i];
		const lastName = lastNames[i];
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
		const bio = bioTemplates[i % bioTemplates.length];
		const imageNum = (i % 70) + 1;

		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash,
				bio,
				image: `https://i.pravatar.cc/150?img=${imageNum}`,
			},
		});

		// Assign 1-3 job titles
		const userJobTitles = getRandomItems(jobTitles, 1, 1);
		await Promise.all(
			userJobTitles.map(jobTitle =>
				prisma.userJobTitle.create({
					data: {
						userId: user.id,
						jobTitleId: jobTitle.id,
					},
				}),
			),
		);

		// Assign 1-5 programming languages
		const userLanguages = getRandomItems(languages, 3, 3);
		await Promise.all(
			userLanguages.map(language =>
				prisma.userProgrammingLanguage.create({
					data: {
						userId: user.id,
						programmingLanguageId: language.id,
					},
				}),
			),
		);

		if ((i + 1) % 10 === 0) {
			console.log(`   Created ${i + 1}/50 users...`);
		}
	}

	console.log("✅ Database seeded successfully!");
	console.log(`📊 Created:
    - ${languages.length} programming languages
    - ${jobTitles.length} job titles
    - 50 users with their relations`);
}

main()
	.catch(e => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
