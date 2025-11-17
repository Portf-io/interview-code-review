#!/bin/bash

echo "🚀 Setting up the project..."
echo ""

echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

echo "🗄️  Setting up database..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo "✅ Prisma client generated"
echo ""

echo "🔄 Running migrations..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "❌ Failed to run migrations"
  exit 1
fi
echo "✅ Migrations applied"
echo ""

echo "🌱 Seeding database..."
npm run prisma:seed
if [ $? -ne 0 ]; then
  echo "❌ Failed to seed database"
  exit 1
fi
echo "✅ Database seeded"
echo ""

echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Failed to build project"
  exit 1
fi
echo "✅ Project built"
echo ""

echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To start the production server, run:"
echo "  npm start"

