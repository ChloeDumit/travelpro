import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleCurrencyRates = [
  { currency: "EUR", rate: 0.85, isActive: true },
  { currency: "CLP", rate: 0.0011, isActive: true },
  { currency: "ARS", rate: 0.0012, isActive: true },
  { currency: "BRL", rate: 0.2, isActive: true },
  { currency: "MXN", rate: 0.055, isActive: true },
  { currency: "COP", rate: 0.00025, isActive: true },
  { currency: "PEN", rate: 0.27, isActive: true },
  { currency: "UYU", rate: 0.025, isActive: true },
  { currency: "BOB", rate: 0.15, isActive: true },
];

async function seedCurrencyRates() {
  try {
    console.log("🌱 Seeding currency rates...");

    // Get all companies
    const companies = await prisma.company.findMany();

    if (companies.length === 0) {
      console.log("❌ No companies found. Please create a company first.");
      return;
    }

    for (const company of companies) {
      console.log(`📊 Adding currency rates for company: ${company.name}`);

      // Create company settings if they don't exist
      await prisma.companySettings.upsert({
        where: { companyId: company.id },
        update: {},
        create: {
          companyId: company.id,
          defaultCurrency: "USD",
        },
      });

      // Add currency rates for this company
      for (const rateData of sampleCurrencyRates) {
        await prisma.currencyRate.upsert({
          where: {
            companyId_currency: {
              companyId: company.id,
              currency: rateData.currency,
            },
          },
          update: {
            rate: rateData.rate,
            isActive: rateData.isActive,
            lastUpdated: new Date(),
          },
          create: {
            companyId: company.id,
            currency: rateData.currency,
            rate: rateData.rate,
            isActive: rateData.isActive,
            lastUpdated: new Date(),
          },
        });
      }
    }

    console.log("✅ Currency rates seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding currency rates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedCurrencyRates();
