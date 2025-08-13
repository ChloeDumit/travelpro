import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const salesPassword = await bcrypt.hash("sales123", 10);

  // Crear compañía primero
  const company = await prisma.company.upsert({
    where: { name: "TravelPro" },
    update: {},
    create: {
      name: "TravelPro",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@travelpro.com" },
    update: {},
    create: {
      email: "admin@travelpro.com",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      company: {
        connect: { id: company.id },
      },
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "sales@travelpro.com" },
    update: {},
    create: {
      email: "sales@travelpro.com",
      username: "sales",
      password: salesPassword,
      role: "sales",
      company: {
        connect: { id: company.id },
      },
    },
  });

  // Crear clasificaciones de prueba
  const classification1 = await prisma.classification.create({
    data: {
      name: "Vuelos Nacionales",
      company: { connect: { id: company.id } },
    },
  });

  const classification2 = await prisma.classification.create({
    data: {
      name: "Hoteles",
      company: { connect: { id: company.id } },
    },
  });

  const classification3 = await prisma.classification.create({
    data: {
      name: "Paquetes Turísticos",
      company: { connect: { id: company.id } },
    },
  });

  // Crear proveedores de prueba
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Aerolíneas Nacionales",
      company: { connect: { id: company.id } },
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Hotel Plaza",
      company: { connect: { id: company.id } },
    },
  });

  // Crear operadores de prueba
  const operator1 = await prisma.operator.create({
    data: {
      name: "Operador Turístico ABC",
      company: { connect: { id: company.id } },
    },
  });

  const operator2 = await prisma.operator.create({
    data: {
      name: "Agencia de Viajes XYZ",
      company: { connect: { id: company.id } },
    },
  });

  console.log({
    company,
    admin,
    sales,
    classifications: [classification1, classification2, classification3],
    suppliers: [supplier1, supplier2],
    operators: [operator1, operator2],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
