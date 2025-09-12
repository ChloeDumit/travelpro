import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const salesPassword = await bcrypt.hash("sales123", 10);
  const financePassword = await bcrypt.hash("finance123", 10);

  console.log("🌱 Iniciando proceso de seed...");

  // Crear compañía primero
  const company = await prisma.company.upsert({
    where: { name: "TripsOffice" },
    update: {},
    create: {
      name: "TripsOffice",
    },
  });
  console.log("✅ Compañía creada:", company.name);

  // Crear usuarios de prueba
  const admin = await prisma.user.upsert({
    where: { email: "admin@tripsoffice.com" },
    update: {},
    create: {
      email: "admin@tripsoffice.com",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      company: { connect: { id: company.id } },
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "sales@tripsoffice.com" },
    update: {},
    create: {
      email: "sales@tripsoffice.com",
      username: "sales",
      password: salesPassword,
      role: "sales",
      company: { connect: { id: company.id } },
    },
  });

  const finance = await prisma.user.upsert({
    where: { email: "finance@tripsoffice.com" },
    update: {},
    create: {
      email: "finance@tripsoffice.com",
      username: "finance",
      password: financePassword,
      role: "finance",
      company: { connect: { id: company.id } },
    },
  });

  console.log("✅ Usuarios creados:", [
    admin.username,
    sales.username,
    finance.username,
  ]);

  // Crear clasificaciones de prueba
  const classifications = await Promise.all([
    prisma.classification.create({
      data: {
        name: "Vuelos Nacionales",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Vuelos Internacionales",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Hoteles",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Paquetes Turísticos",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Traslados",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Excursiones",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.classification.create({
      data: {
        name: "Seguros de Viaje",
        company: { connect: { id: company.id } },
      },
    }),
  ]);
  console.log("✅ Clasificaciones creadas:", classifications.length);

  // Crear proveedores de prueba
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: "Aerolíneas Nacionales",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Hotel Plaza Internacional",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Aerolíneas del Sur",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Resort Paradise",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Transporte Ejecutivo",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Agencia de Excursiones",
        company: { connect: { id: company.id } },
      },
    }),
  ]);
  console.log("✅ Proveedores creados:", suppliers.length);

  // Crear operadores de prueba
  const operators = await Promise.all([
    prisma.operator.create({
      data: {
        name: "Operador Turístico ABC",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.operator.create({
      data: {
        name: "Agencia de Viajes XYZ",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.operator.create({
      data: {
        name: "Turismo Premium",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.operator.create({
      data: {
        name: "Viajes Express",
        company: { connect: { id: company.id } },
      },
    }),
  ]);
  console.log("✅ Operadores creados:", operators.length);

  // Crear clientes de prueba
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Juan Pérez",
        clientId: "CL001",
        address: "Av. Principal 123, Ciudad",
        email: "juan.perez@email.com",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.client.create({
      data: {
        name: "María González",
        clientId: "CL002",
        address: "Calle Secundaria 456, Pueblo",
        email: "maria.gonzalez@email.com",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.client.create({
      data: {
        name: "Empresa ABC Corp",
        clientId: "CL003",
        address: "Zona Industrial 789, Ciudad",
        email: "contacto@abccorp.com",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.client.create({
      data: {
        name: "Carlos Rodríguez",
        clientId: "CL004",
        address: "Residencial Los Pinos 321",
        email: "carlos.rodriguez@email.com",
        company: { connect: { id: company.id } },
      },
    }),
    prisma.client.create({
      data: {
        name: "Familia Martínez",
        clientId: "CL005",
        address: "Condominio Vista Hermosa 654",
        email: "familia.martinez@email.com",
        company: { connect: { id: company.id } },
      },
    }),
  ]);
  console.log("✅ Clientes creados:", clients.length);

  // Crear ventas de prueba
  const salesData = await Promise.all([
    prisma.sale.create({
      data: {
        passengerName: "Juan Pérez",
        client: { connect: { id: clients[0].id } },
        travelDate: new Date("2024-12-25"),
        saleType: "individual",
        region: "national",
        serviceType: "flight",
        status: "confirmed",
        seller: { connect: { id: sales.id } },
        passengerCount: 1,
        totalCost: 150.0,
        salePrice: 200.0,
        company: { connect: { id: company.id } },
      },
    }),
    prisma.sale.create({
      data: {
        passengerName: "María González",
        client: { connect: { id: clients[1].id } },
        travelDate: new Date("2024-12-30"),
        saleType: "individual",
        region: "international",
        serviceType: "package",
        status: "confirmed",
        seller: { connect: { id: sales.id } },
        passengerCount: 2,
        totalCost: 800.0,
        salePrice: 1200.0,
        company: { connect: { id: company.id } },
      },
    }),
    prisma.sale.create({
      data: {
        passengerName: "Empresa ABC Corp",
        client: { connect: { id: clients[2].id } },
        travelDate: new Date("2025-01-15"),
        saleType: "corporate",
        region: "national",
        serviceType: "hotel",
        status: "confirmed",
        seller: { connect: { id: admin.id } },
        passengerCount: 5,
        totalCost: 600.0,
        salePrice: 900.0,
        company: { connect: { id: company.id } },
      },
    }),
    prisma.sale.create({
      data: {
        passengerName: "Carlos Rodríguez",
        client: { connect: { id: clients[3].id } },
        travelDate: new Date("2025-01-20"),
        saleType: "individual",
        region: "regional",
        serviceType: "transfer",
        status: "draft",
        seller: { connect: { id: sales.id } },
        passengerCount: 1,
        totalCost: 25.0,
        salePrice: 35.0,
        company: { connect: { id: company.id } },
      },
    }),
  ]);
  console.log("✅ Ventas creadas:", salesData.length);

  // Crear pasajeros de prueba
  const passengers = await Promise.all([
    prisma.passenger.create({
      data: {
        name: "Juan Pérez",
        passengerId: "P001",
        email: "juan.perez@email.com",
        dateOfBirth: "1985-03-15",
        saleId: salesData[0].id,
        companyId: company.id,
      },
    }),
    prisma.passenger.create({
      data: {
        name: "María González",
        passengerId: "P002",
        email: "maria.gonzalez@email.com",
        dateOfBirth: "1990-07-22",
        saleId: salesData[1].id,
        companyId: company.id,
      },
    }),
    prisma.passenger.create({
      data: {
        name: "Pedro González",
        passengerId: "P003",
        email: "pedro.gonzalez@email.com",
        dateOfBirth: "1988-11-10",
        saleId: salesData[1].id,
        companyId: company.id,
      },
    }),
    prisma.passenger.create({
      data: {
        name: "Ana Martínez",
        passengerId: "P004",
        email: "ana.martinez@email.com",
        dateOfBirth: "1992-05-18",
        saleId: salesData[2].id,
        companyId: company.id,
      },
    }),
    prisma.passenger.create({
      data: {
        name: "Luis Martínez",
        passengerId: "P005",
        email: "luis.martinez@email.com",
        dateOfBirth: "1987-09-30",
        saleId: salesData[2].id,
        companyId: company.id,
      },
    }),
  ]);
  console.log("✅ Pasajeros creados:", passengers.length);

  // Crear items de venta de prueba
  const saleItems = await Promise.all([
    prisma.saleItem.create({
      data: {
        classification: { connect: [{ id: classifications[0].id }] },
        supplier: { connect: [{ id: suppliers[0].id }] },
        operator: { connect: [{ id: operators[0].id }] },
        dateIn: new Date("2024-12-25"),
        dateOut: new Date("2024-12-25"),
        passengerCount: 1,
        status: "confirmed",
        description: "Vuelo de ida y vuelta Ciudad A - Ciudad B",
        salePrice: 200.0,
        costPrice: 150.0,
        reservationCode: "RES001",
        paymentDate: new Date("2024-12-20"),
        sale: { connect: { id: salesData[0].id } },
      },
    }),
    prisma.saleItem.create({
      data: {
        classification: { connect: [{ id: classifications[2].id }] },
        supplier: { connect: [{ id: suppliers[1].id }] },
        operator: { connect: [{ id: operators[1].id }] },
        dateIn: new Date("2024-12-30"),
        dateOut: new Date("2025-01-05"),
        passengerCount: 2,
        status: "confirmed",
        description: "Paquete hotel + vuelo internacional",
        salePrice: 1200.0,
        costPrice: 800.0,
        reservationCode: "RES002",
        paymentDate: new Date("2024-12-25"),
        sale: { connect: { id: salesData[1].id } },
      },
    }),
    prisma.saleItem.create({
      data: {
        classification: { connect: [{ id: classifications[2].id }] },
        supplier: { connect: [{ id: suppliers[3].id }] },
        operator: { connect: [{ id: operators[2].id }] },
        dateIn: new Date("2025-01-15"),
        dateOut: new Date("2025-01-17"),
        passengerCount: 5,
        status: "confirmed",
        description: "Reserva de hotel corporativo",
        salePrice: 900.0,
        costPrice: 600.0,
        reservationCode: "RES003",
        paymentDate: new Date("2025-01-10"),
        sale: { connect: { id: salesData[2].id } },
      },
    }),
  ]);
  console.log("✅ Items de venta creados:", saleItems.length);

  // Crear facturas de prueba
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        sale: { connect: { id: salesData[0].id } },
        invoiceNumber: "INV001",
        date: new Date("2024-12-20"),
        amount: 200.0,
        currency: "USD",
        status: "paid",
      },
    }),
    prisma.invoice.create({
      data: {
        sale: { connect: { id: salesData[1].id } },
        invoiceNumber: "INV002",
        date: new Date("2024-12-25"),
        amount: 1200.0,
        currency: "USD",
        status: "paid",
      },
    }),
    prisma.invoice.create({
      data: {
        sale: { connect: { id: salesData[2].id } },
        invoiceNumber: "INV003",
        date: new Date("2025-01-10"),
        amount: 900.0,
        currency: "USD",
        status: "pending",
      },
    }),
  ]);
  console.log("✅ Facturas creadas:", invoices.length);

  // Crear pagos de prueba
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        sale: { connect: { id: salesData[0].id } },
        date: new Date("2024-12-20"),
        amount: 200.0,
        currency: "USD",
        method: "creditCard",
        reference: "PAY001",
        status: "confirmed",
      },
    }),
    prisma.payment.create({
      data: {
        sale: { connect: { id: salesData[1].id } },
        date: new Date("2024-12-25"),
        amount: 1200.0,
        currency: "USD",
        method: "transfer",
        reference: "PAY002",
        status: "confirmed",
      },
    }),
    prisma.payment.create({
      data: {
        sale: { connect: { id: salesData[2].id } },
        date: new Date("2025-01-10"),
        amount: 450.0,
        currency: "USD",
        method: "cash",
        reference: "PAY003",
        status: "confirmed",
      },
    }),
  ]);
  console.log("✅ Pagos creados:", payments.length);

  // Crear pagos a proveedores de prueba
  const supplierPayments = await Promise.all([
    prisma.supplierPayment.create({
      data: {
        company: { connect: { id: company.id } },
        supplier: { connect: { id: suppliers[0].id } },
        amount: 150.0,
        currency: "USD",
        paymentDate: new Date("2024-12-22"),
        description: "Pago por vuelo nacional",
        paymentMethod: "transfer",
        reference: "SP001",
        relatedSales: { connect: [{ id: salesData[0].id }] },
      },
    }),
    prisma.supplierPayment.create({
      data: {
        company: { connect: { id: company.id } },
        supplier: { connect: { id: suppliers[1].id } },
        amount: 800.0,
        currency: "USD",
        paymentDate: new Date("2024-12-27"),
        description: "Pago por paquete turístico",
        paymentMethod: "transfer",
        reference: "SP002",
        relatedSales: { connect: [{ id: salesData[1].id }] },
      },
    }),
    prisma.supplierPayment.create({
      data: {
        company: { connect: { id: company.id } },
        supplier: { connect: { id: suppliers[3].id } },
        amount: 600.0,
        currency: "USD",
        paymentDate: new Date("2025-01-12"),
        description: "Pago por reserva de hotel",
        paymentMethod: "transfer",
        reference: "SP003",
        relatedSales: { connect: [{ id: salesData[2].id }] },
      },
    }),
  ]);
  console.log("✅ Pagos a proveedores creados:", supplierPayments.length);

  console.log("\n🎉 ¡Seed completado exitosamente!");
  console.log("📊 Resumen de datos creados:");
  console.log(`   - Compañía: 1`);
  console.log(`   - Usuarios: 3`);
  console.log(`   - Clasificaciones: ${classifications.length}`);
  console.log(`   - Proveedores: ${suppliers.length}`);
  console.log(`   - Operadores: ${operators.length}`);
  console.log(`   - Clientes: ${clients.length}`);
  console.log(`   - Ventas: ${salesData.length}`);
  console.log(`   - Pasajeros: ${passengers.length}`);
  console.log(`   - Items de venta: ${saleItems.length}`);
  console.log(`   - Facturas: ${invoices.length}`);
  console.log(`   - Pagos: ${payments.length}`);
  console.log(`   - Pagos a proveedores: ${supplierPayments.length}`);

  return {
    company,
    users: [admin, sales, finance],
    classifications,
    suppliers,
    operators,
    clients,
    sales: salesData,
    passengers,
    saleItems,
    invoices,
    payments,
    supplierPayments,
  };
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
