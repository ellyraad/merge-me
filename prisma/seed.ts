import { faker } from "@faker-js/faker";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting seed...");

	const jobTitlesData = [
		"Software Engineer",
		"Frontend Developer",
		"Backend Developer",
		"Fullstack Developer",
		"Data Scientist",
		"Machine Learning Engineer",
		"DevOps Engineer",
		"Product Manager",
		"UI/UX Designer",
		"QA Engineer",
		"Student",
		"Hobbyist",
		"Professor/Instructor",
	];

	const jobTitles = await Promise.all(
		jobTitlesData.map(name =>
			prisma.jobTitle.upsert({
				where: { name },
				update: {},
				create: { name },
			}),
		),
	);

	const languagesData = [
		"JavaScript",
		"TypeScript",
		"Python",
		"PHP",
		"Ruby",
		"Go",
		"Rust",
		"C",
		"C++",
		"C#",
		"Java",
		"Kotlin",
		"Scala",
		"Groovy",
		"Swift",
		"Objective-C",
		"Dart",
		"Haskell",
		"Elixir",
		"Erlang",
		"F#",
		"OCaml",
		"R",
		"Julia",
		"Matlab",
		"SQL",
		"GraphQL",
		"Shell",
		"Perl",
		"Lua",
		"Zig",
		"Nim",
		"Crystal",
		"V",
		"Solidity",
		"Assembly",
		"COBOL",
		"Fortran",
	];

	const programmingLanguages = await Promise.all(
		languagesData.map(name =>
			prisma.programmingLanguage.upsert({
				where: { name },
				update: {},
				create: { name },
			}),
		),
	);

	// 3️⃣ Create 30 Users
	for (let i = 0; i < 30; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const email = faker.internet.email({ firstName, lastName });

		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash: faker.internet.password(),
				bio: faker.lorem.sentence(),
				doneOnboarding: faker.datatype.boolean(),
				photo: {
					create: {
						url: faker.image.avatar(),
					},
				},
			},
		});

		// 4️⃣ Assign ONE random job title
		const jobTitle = faker.helpers.arrayElement(jobTitles);
		await prisma.userJobTitle.create({
			data: {
				userId: user.id,
				jobTitleId: jobTitle.id,
			},
		});

		// 5️⃣ Assign THREE unique programming languages
		const selectedLanguages = faker.helpers.arrayElements(
			programmingLanguages,
			3,
		);
		for (const lang of selectedLanguages) {
			await prisma.userProgrammingLanguage.create({
				data: {
					userId: user.id,
					programmingLanguageId: lang.id,
				},
			});
		}

		console.log(`✅ Created user ${i + 1}: ${firstName} ${lastName}`);
	}

	console.log("🎉 Seeding complete!");
}

main()
	.catch(err => {
		console.error(err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
